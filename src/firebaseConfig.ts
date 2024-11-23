// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { collection, addDoc, getDocs } from "firebase/firestore"; 
import { getSongsAction } from "./store/actions";
import { dispatch } from "./store/index";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCP-NFklL3FTrnLlmoQRFw_ervthogrGdg",
  authDomain: "dca-song-app.firebaseapp.com",
  projectId: "dca-song-app",
  storageBucket: "dca-song-app.appspot.com",
  messagingSenderId: "209834028678",
  appId: "1:209834028678:web:4778a490cc9402b860ab07",
  measurementId: "G-XS00R1408G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


export const addSong = async (song: any) => {
  try {
    const where = collection(db, "songs");

    // Añadir el documento sin el campo "id"
    const docRef = await addDoc(where, {
      ...song,
      id: "" // Se agrega un id temporal vacío
    });

    console.log("Song written with ID: ", docRef.id);

    // Actualizar el documento para incluir el ID
    await updateDoc(docRef, { id: docRef.id });

    // Actualizar appState con la nueva canción
    const action = await getSongsAction();
    dispatch(action);

  } catch (e) {
    console.error("Error adding song: ", e);
  }
};


export const getSongs = async () => {
  const where = collection(db, "songs");
  const querySnapshot = await getDocs(where);
  const data: any= [];

  querySnapshot.forEach((doc) => {
    data.push({
      id: doc.id, // Incluye el ID del documento
      ...doc.data() // Copia los demás campos
    });
  });
  console.log('data', data);
  return data;
}

export const updateSong = async (song: any) => {
  try {
    const songRef = doc(db, "songs", song.id);
    const docSnap = await getDoc(songRef);

    if (docSnap.exists()) {
        console.log("Document found, updating...");
        await updateDoc(songRef, {
            title: song.title,
            author: song.author,
            album: song.album,
            duration: song.duration,
            img: song.img,
        });
        console.log("Song updated:", song.id);
         // Actualizar appState con la nueva canción
    const action = await getSongsAction();
    dispatch(action);
    } else {
        console.log("No such document!");
    }
} catch (e) {
    console.error("Error updating song: ", e);
}
};