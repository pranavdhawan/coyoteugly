import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import Single from "./pages/single/Single";
import { BrowserRouter, Router,Routes, Route, Navigate } from "react-router-dom";
import "./style/dark.scss";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import { SignOutButton, SignInButton, SignedIn, SignedOut } from "@clerk/clerk-react"


function App() {
  const ProtectedRoute = ({children}) => {
    const {user} = useContext(AuthContext)

    return children
  }


  return (
    <div>
      <SignedOut>
        <SignInButton />
        <p>This content is public. Only signed out users can see the SignInButton above this text.</p>
      </SignedOut>
      <SignedIn>
        <Home></Home>
        <SignOutButton afterSignOutUrl="/" />
        <p>This content is private. Only signed in users can see the SignOutButton above this text.</p>
      </SignedIn>
    </div>
  )

}

export default App;
