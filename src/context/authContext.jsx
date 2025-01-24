import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import PropTypes from 'prop-types';
import { auth } from "../firebase/fire";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../firebase/fire";

const UserContext = createContext();

export const UserAuth = () => {
  return useContext(UserContext)
}

export default function AuthContextProvider({ children }) {
  const [isLoggedOut, setIsLoggedOut] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setIsLoggedOut(false);
        onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
          setUser(doc.data());
        });
      } else {
        setIsLoggedOut(true);
      }
    });
    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <UserContext.Provider
      value={{
        isLoggedOut,
        user
      }}>{children}</UserContext.Provider>

  )
}

AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};