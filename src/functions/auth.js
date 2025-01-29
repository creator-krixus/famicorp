import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/fire";

export const signIn = async (email, password) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    return res.user;
  } catch (error) {
    if (error.code === 'auth/invalid-credential') {
      console.log('Email or Password incorrect');
      alert('Email or Password incorrect')
      // Mostrar un mensaje de error más amigable en la interfaz
    } else {
      console.log(error);
    }
    return error;
  }
};

export const logout = async () => {
  try {
    // await auth.signOut();
    await signOut(auth);
    localStorage.removeItem("loginTime");
  } catch (error) {
    return error;
  }
};

export const signUp = async (email, password, userData) => {

  try {
    const user = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, "users", user.user.uid), {
      ...userData,
      uid: user.user.uid,
    });
    return user.user;
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('This email is already registered.');
      // Mostrar un mensaje de error más amigable en la interfaz
    } else if (error.code === 'auth/weak-password') {
      console.log('This email is already registered.');
      // Mostrar un mensaje de error más amigable en la interfaz
    }
    else {
      console.log(error);
    }
    return error;
  }
};

// Iniciar sesión con Google
const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Guardar el usuario en Firestore si es necesario
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      uid: user.uid,
    }, { merge: true });

    return user;
  } catch (error) {
    console.log("Error during Google sign in:", error.message);
    return error;
  }
};