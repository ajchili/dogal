import { initializeApp } from "firebase/app";
import firebaseConfigData from "../firebase.json";

initializeApp(firebaseConfigData, { automaticDataCollectionEnabled: false });