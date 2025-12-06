import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, get, onValue, query, orderByChild, limitToLast } from "firebase/database";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, User } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

// Initialize Firebase only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const database = getDatabase(app);
const auth = getAuth(app);

export { app, database, auth };
console.log(database)
// Authentication state
let isAuthenticated = false;
let authPromise: Promise<User> | null = null;

// Sign in with email and password
export async function signInWithEmail(email: string, password: string): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    isAuthenticated = true;
    console.log("✅ Firebase authentication successful");
    return userCredential.user;
  } catch (error: any) {
    console.error("❌ Firebase authentication failed:", error.message);
    throw error;
  }
}

// Auto sign-in on app load
export async function ensureAuthenticated(): Promise<User> {
  // If already authenticated, return current user
  if (isAuthenticated && auth.currentUser) {
    return auth.currentUser;
  }

  // If authentication is in progress, wait for it
  if (authPromise) {
    return authPromise;
  }

  // Start authentication
  authPromise = new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        isAuthenticated = true;
        unsubscribe();
        resolve(user);
      } else {
        // Auto sign-in with credentials from env
        const email = process.env.NEXT_PUBLIC_FIREBASE_USER_EMAIL;
        const password = process.env.NEXT_PUBLIC_FIREBASE_USER_PASSWORD;

        if (email && password) {
          try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log(userCredential)
            isAuthenticated = true;
            unsubscribe();
            resolve(userCredential.user);
          } catch (error) {
            unsubscribe();
            reject(error);
          }
        } else {
          unsubscribe();
          reject(new Error("Firebase credentials not configured"));
        }
      }
    });
  });

  return authPromise;
}

export async function getLatestLiveStatus() {
  try {
    // Ensure user is authenticated before accessing database
    await ensureAuthenticated();

    // Get the latest entry from Firebase Realtime Database
    const statusRef = ref(database, "live");
    const snapshot = await get(statusRef);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log("📊 Firebase data:", data);
      
      return {
        id: Date.now().toString(),
        temperature: data.temperature || 0,
        humidity: data.humidity || 0,
        flame: data.flame === 1 || data.flame === true,
        vibration: data.vibration === 1 || data.vibration === true,
        light: data.light || 0,
        sound: data.sound || 0,
        updated_at: data.timestamp ? new Date(data.timestamp).toISOString() : new Date().toISOString(),
        today_fall_count: 0,
        total_fall_count: 0,
      };
    }
    
    console.warn("No data available in Firebase");
    return null;
  } catch (error) {
    console.error("Error fetching live status from Firebase:", error);
    return null;
  }
}

interface LiveStatusRecord {
  id: string;
  temperature: number;
  humidity: number;
  flame?: boolean;
  vibration?: boolean;
  light?: number;
  sound?: number;
  updated_at: string;
  today_fall_count?: number;
  total_fall_count?: number;
}

export function subscribeToLiveStatus(
  callback: (data: LiveStatusRecord) => void
): () => void {
  // Ensure authentication before subscribing
  ensureAuthenticated().then(() => {
    const statusRef = ref(database, "live");
    
    const unsubscribe = onValue(statusRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log("🔄 Real-time update:", data);
        
        callback({
          id: Date.now().toString(),
          temperature: data.temperature || 0,
          humidity: data.humidity || 0,
          flame: data.flame === 1 || data.flame === true,
          vibration: data.vibration === 1 || data.vibration === true,
          light: data.light || 0,
          sound: data.sound || 0,
          updated_at: data.timestamp ? new Date(data.timestamp).toISOString() : new Date().toISOString(),
          today_fall_count: 0,
          total_fall_count: 0,
        });
      }
    });
    
    return unsubscribe;
  }).catch((error) => {
    console.error("Authentication failed for subscription:", error);
  });

  // Return empty unsubscribe function in case of immediate error
  return () => {};
}
