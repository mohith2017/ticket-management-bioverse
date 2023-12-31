
import { NextApiRequest, NextApiResponse } from "next";
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
import firebase from 'firebase-admin';



interface Data {
    name: string;
    email: string;
    desc: string;
    status: string,
    resp: string,
    // token: string;
}


export default async function ContactApi(
    req: NextApiRequest,
    res: NextApiResponse,
) {
   
    const { name, email, desc, status, resp }: Data = req.body;

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
          privateKey: process.env.FIREBASE_PRIVATE_KEY
        })
      };
    

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig); 
     }
     else{
       firebase.app();
     }
    
      
      const db = getFirestore();

      const docRef = db.collection('ticket-data');
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();

      const newRef = db.collection('ticket-data').doc();

      await newRef.set({
        name: name,
        email: email,
        desc: desc,
        status: status,
        resp: resp,
        timestamp: timestamp,
      });

      const collectionQuery = db.collection('ticket-data').orderBy('timestamp', 'desc').limit(1);
      const fetch_side = await collectionQuery.get();
      console.log(fetch_side.docs[0].data().desc);

         
        console.log("Issue at time:" + timestamp + "with description:" + desc + "has been submitted!")
        res.status(200).json({ message: "success" });
    } catch (err) {
        res.status(500).json({ message: "an error occured" });
        console.log(err);
    }

    

}
