import { NextApiRequest, NextApiResponse } from "next";
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import firebase from 'firebase-admin';

interface Data {
  name: string;
  email: string;
  desc: string;
  status: string;
  resp: string;
  timestamp: Timestamp;
}

export default async function StatusApi(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, email, desc, status, resp, timestamp }: Data = req.body;

  try {
    const firebaseConfig = {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
      measurementId: process.env.FIREBASE_MEASUREMENT_ID,
      credential: firebase.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
      }),
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    } else {
      firebase.app();
    }

    const db = getFirestore();

    // Assuming 'timestamp' is a Firestore Timestamp object
    const collectionQuery = db.collection('ticket-data')
      .where('name', '==', name)
      .where('email', '==', email)
      .where('desc', '==', desc);
    const querySnapshot = await collectionQuery.get();

    if (!querySnapshot.empty) {
      const ticketDoc = querySnapshot.docs[0];
      
      // Update the existing document
      await ticketDoc.ref.update({
        status: status,
        // Add other fields you want to update
      });

      console.log("Ticket with description:" + desc + " has been updated with status: " + status);
      res.status(200).json({ message: "success" });
    } else {
      console.log("Ticket with description:" + desc + " not found.");
      res.status(404).json({ message: "Ticket not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "an error occurred" });
    console.error(err);
  }
}
