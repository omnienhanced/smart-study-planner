import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth"
import { auth, db } from "./firebaseConfig"
import { doc, setDoc } from "firebase/firestore"

export const register = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  const user = userCredential.user

  // Create user document in Firestore
  await setDoc(doc(db, "users", user.uid), {
    email: user.email,
    createdAt: new Date(),
    streakCount: 0,
  })

  return user
}

export const login = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  return userCredential.user
}

export const logout = async () => {
  await signOut(auth)
}

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback)
}
