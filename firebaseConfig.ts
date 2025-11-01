import { initializeApp, FirebaseApp } from "firebase/app";
// Explicitly import firestore for its side-effects to ensure the service is registered.
import "firebase/firestore"; 
// Update imports to use the new API for persistence
import { initializeFirestore, persistentLocalCache, Firestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// =================================================================================================
// Cấu hình Firebase sẽ ưu tiên sử dụng Biến môi trường (Environment Variables) khi được deploy.
// Nếu không tìm thấy, nó sẽ sử dụng các giá trị dự phòng bên dưới để phát triển cục bộ.
// Điều này giúp ứng dụng hoạt động ở cả môi trường phát triển và sản phẩm mà không bị lỗi.
// =================================================================================================

const FALLBACK_CONFIG = {
  apiKey: "AIzaSyDLjmEvxFN77cZoAgutIbfcSnpYZLvwynA",
  authDomain: "project-6402338388925710253.firebaseapp.com",
  projectId: "project-6402338388925710253",
  storageBucket: "project-6402338388925710253.appspot.com",
  messagingSenderId: "888042239100",
  appId: "1:888042239100:web:0d363fa4d3de2f4960c5f9",
  measurementId: "G-L3R6D8TVPY"
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


// Kiểm tra xem các biến môi trường và giá trị dự phòng có bị thiếu không
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error("Firebase config is not set. Please check your environment variables or the fallback config in firebaseConfig.ts.");
  alert("Lỗi cấu hình Firebase. Ứng dụng không thể khởi động. Vui lòng liên hệ quản trị viên.");
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