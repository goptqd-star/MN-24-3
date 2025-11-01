import { initializeApp, FirebaseApp } from "firebase/app";
// Explicitly import firestore for its side-effects to ensure the service is registered.
import "firebase/firestore"; 
// Update imports to use the new API for persistence
import { initializeFirestore, persistentLocalCache, Firestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// =================================================================================================
// LƯU Ý BẢO MẬT QUAN TRỌNG
// Tệp này đã an toàn để đưa lên một kho chứa GitHub công khai.
// Các khóa API thật đã được thay thế bằng các chuỗi giữ chỗ (placeholder).
// Khi deploy lên Vercel, các khóa API sẽ được cung cấp thông qua Biến môi trường an toàn.
// TUYỆT ĐỐI KHÔNG ĐƯA KHÓA API THẬT VÀO ĐÂY VÀ ĐẨY LÊN GITHUB.
// =================================================================================================

const FALLBACK_CONFIG = {
  // Để chạy ứng dụng cục bộ (local development), bạn có thể tạm thời thay thế
  // các chuỗi giữ chỗ này bằng khóa API thật của mình. Nhưng đừng commit thay đổi đó.
  apiKey: "ADD_YOUR_API_KEY_HERE_FOR_LOCAL_DEVELOPMENT",
  authDomain: "ADD_YOUR_AUTH_DOMAIN_HERE_FOR_LOCAL_DEVELOPMENT",
  projectId: "ADD_YOUR_PROJECT_ID_HERE_FOR_LOCAL_DEVELOPMENT",
  storageBucket: "ADD_YOUR_STORAGE_BUCKET_HERE_FOR_LOCAL_DEVELOPMENT",
  messagingSenderId: "ADD_YOUR_MESSAGING_SENDER_ID_HERE_FOR_LOCAL_DEVELOPMENT",
  appId: "ADD_YOUR_APP_ID_HERE_FOR_LOCAL_DEVELOPMENT",
  measurementId: "ADD_YOUR_MEASUREMENT_ID_HERE_FOR_LOCAL_DEVELOPMENT"
};

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY || FALLBACK_CONFIG.apiKey,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN || FALLBACK_CONFIG.authDomain,
  projectId: process.env.REACT_APP_PROJECT_ID || FALLBACK_CONFIG.projectId,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET || FALLBACK_CONFIG.storageBucket,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID || FALLBACK_CONFIG.messagingSenderId,
  appId: process.env.REACT_APP_APP_ID || FALLBACK_CONFIG.appId,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID || FALLBACK_CONFIG.measurementId
};


// Kiểm tra xem cấu hình có hợp lệ không trước khi khởi tạo
if (!firebaseConfig.apiKey || !firebaseConfig.projectId || firebaseConfig.apiKey.startsWith("ADD_YOUR")) {
  console.error("Firebase config is not set. Please check your environment variables (for production) or the fallback config in firebaseConfig.ts (for local development).");
  // Thông báo cho người dùng cuối nếu ứng dụng không thể khởi động
  if (!window.location.hostname.includes('usercontent.goog')) {
    alert("Lỗi cấu hình Firebase. Ứng dụng không thể khởi động. Vui lòng liên hệ quản trị viên.");
  }
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