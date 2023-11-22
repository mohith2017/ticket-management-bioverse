
import { NextApiRequest, NextApiResponse } from "next";
// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
import firebase from 'firebase-admin';



interface Data {
    name: string;
    email: string;
    desc: string;
    // token: string;
}


export default async function ContactApi(
    req: NextApiRequest,
    res: NextApiResponse,
) {
   
    const { name, email, desc }: Data = req.body;

    // console.log(name);

    // const human = await validateHuman(token);
    // if (!human) {
    //     res.status(400);
    //     res.json({ errors: ["Haha, caught you! ;)"] });
    //     return;
    // }
    
    try {

        const firebaseConfig = {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
        measurementId: process.env.FIREBASE_MEASUREMENT_ID
      };
  

    

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig); 
     }
     else{
       firebase.app();
     }
    
      
      const db = getFirestore();
      console.log(db);

      const docRef = db.collection('ticket-data').doc(email);


      var issueRef_fetch = "0";
      const fetch = await docRef.get();
      // if(!fetch.exists){
      //   await docRef.set({
      //       name: name,
      //       issueRef: 1 });
      //    issueRef_fetch = "1";
      // }
      // else{
      //   issueRef_fetch = fetch.data().issueRef;
      //   console.log(issueRef_fetch)
      //   issueRef_fetch = (+issueRef_fetch + 1).toString();
      //   console.log(issueRef_fetch)
      //   docRef.update({issueRef: issueRef_fetch});
      // }


    // //   console.log(issueRef);
    //   const newRef = db.collection('ticket-data').doc(email).collection('tickets').doc(issueRef_fetch);

    //   await newRef.set({
    //     desc: desc
    //   });

      
        // const snapshot = await db.collection('ticket-data').doc(email).get();
        // console.log(email, '=>', snapshot.data());
            
        res.status(200).json({ message: "success" });
    } catch (err) {
        res.status(500).json({ message: "an error occured" });
        console.log(err);
    }

    

}

// async function validateHuman(
//     token: string
// ) {
//     const secret = process.env.RECAPTCHA_SECRET_KEY;
//     const response = await fetch(
//         `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`,
//         {
//             method: "POST",
//         }
//     );
//     const data = await response.json();
//     return data.success;
// }
