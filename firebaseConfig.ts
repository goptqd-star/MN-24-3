import { initializeApp, FirebaseApp } from "firebase/app";
// Explicitly import firestore for its side-effects to ensure the service is registered.
import "firebase/firestore"; 
// Update imports to use the new API for persistence
import { initializeFirestore, persistentLocalCache, Firestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// =================================================================================================
// Cấu hình Firebase giờ đây sẽ được đọc từ Biến môi trường (Environment Variables)
// trên nền tảng hosting (Vercel). Điều này giúp bảo mật thông tin nhạy cảm.
// Khi deploy, bạn cần thiết lập các biến này trong cài đặt dự án trên Vercel.
// =================================================================================================
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};


// Kiểm tra xem các biến môi trường đã được cấu hình hay chưa
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error("Firebase config is not set. Please check your environment variables.");
  // You might want to render an error message to the user here
  // For now, we will proceed, but Firebase will likely fail to initialize.
}

// Khởi tạo Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Khởi tạo Firebase Auth và lấy một tham chiếu đến dịch vụ
const auth = getAuth(app);

let dbInstance: Firestore | null = null;

/**
 * Lazily initializes and returns the Firestore instance.
 * This singleton pattern helps prevent race conditions where Firestore is
 * requested before its service is available. It now uses the recommended
 * `initializeFirestore` with cache settings to enable offline persistence.
 */
const getDb = (): Firestore => {
    if (!dbInstance) {
        try {
            // Use the new API to initialize Firestore with offline persistence enabled.
            // This replaces the deprecated enableIndexedDbPersistence() function.
            dbInstance = initializeFirestore(app, {
                cache: persistentLocalCache({})
            });
        } catch (err) {
            console.error("Error initializing Firestore with persistence. Falling back to default in-memory cache.", err);
            // Fallback to memory-only cache if the initialization with persistence fails.
            dbInstance = initializeFirestore(app, {});
        }
    }
    return dbInstance;
};


// Xuất hàm lấy Firestore instance và Auth instance
export { getDb, auth };