import firebase from "firebase";
import "firebase/firestore";

var config = {
    apiKey: "AIzaSyDFGsXG3PsaEBA_VwDmL4Q8hF3fZac_Wvc",
    authDomain: "chat-8a73d.firebaseapp.com",
    databaseURL: "https://chat-8a73d.firebaseio.com",
    projectId: "chat-8a73d",
    storageBucket: "chat-8a73d.appspot.com",
    messagingSenderId: "823811871566",
    appId: "1:823811871566:web:dc76f8e8751ddcda23c41f",
    measurementId: "G-JJGM5VVEG4"
  };

var fire = firebase.initializeApp(config);
export default fire;