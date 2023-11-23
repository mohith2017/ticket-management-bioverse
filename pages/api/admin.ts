import { NextApiRequest, NextApiResponse } from "next";
// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
import firebase from 'firebase-admin';


export default async function Adminapi(
    req: NextApiRequest,
    res: NextApiResponse,
) {
   

    const result: any[] = [];
    
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
      // console.log(db);

      const docRef = db.collection('ticket-data');

      const collectionQuery = db.collection('ticket-data').orderBy('timestamp', 'desc');
      const fetch_side = await collectionQuery.get();
      fetch_side.forEach((doc: { data: () => any; }) =>
      { 
        result.push(doc.data());
      });
      console.log(result);


        console.log("Tickets in descending order - retrieved!")
        res.status(200).json({ message: "success" , data: result });
    } catch (err) {
        res.status(500).json({ message: "an error occured" });
        console.log(err);
    }
  }
