import firebase from 'firebase'

const config = {
  apiKey: "AIzaSyDfHDAPUhBE-t8k41EHbOVpsy2q0kzKe_o",
  authDomain: "deccos-app.firebaseapp.com",
  projectId: "deccos-app",
  storageBucket: "deccos-app.appspot.com",
  messagingSenderId: "53449363588",
  appId: "1:53449363588:web:6213c4bfb2623bd944b2d1"
};

firebase.initializeApp(config)

const auth = firebase.auth()
const db = firebase.firestore();
const bucket = firebase.storage();
const timestamp = firebase.firestore.Timestamp.fromDate(new Date())

export { auth, db, bucket, timestamp }