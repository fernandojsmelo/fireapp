import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, getauth } from 'firebase/auth'


const firebaseConfig = {
    apiKey: "AIzaSyAWybZVkQqw-EVwZyHv2EsIFbPwp4chyN0",
    authDomain: "curso-62a28.firebaseapp.com",
    projectId: "curso-62a28",
    storageBucket: "curso-62a28.appspot.com",
    messagingSenderId: "593313719746",
    appId: "1:593313719746:web:6ec0df42c851c3e315225b",
    measurementId: "G-V76SLFL0X4"
  };

  const firebaseApp = initializeApp(firebaseConfig);

  const db = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);

  export { db, auth };