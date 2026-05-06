import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
// CRITICAL: The app will break without providing the firestoreDatabaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

async function testConnection() {
  try {
    // Tests that the SDK can reach the Firestore backend
    await getDocFromServer(doc(db, 'system', 'connection-test'));
    console.log("Firebase connection established successfully");
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration or connectivity.");
    } else {
      console.warn("Initial connection test note:", error instanceof Error ? error.message : "Connect attempt complete");
    }
  }
}

testConnection();
