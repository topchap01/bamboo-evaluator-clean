import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAWKEKGuMa2nA2XvtcFpk9tJs3sAfv-b5M",
    authDomain: "bamboo-evaluator-fd708.firebaseapp.com",
    projectId: "bamboo-evaluator-fd708",
    storageBucket: "bamboo-evaluator-fd708.appspot.com",
    messagingSenderId: "394770475009",
    appId: "1:394770475009:web:4f646ac80a0b8cddfff800",
    measurementId: "G-KJEHMTE2LG"
  };
  

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);