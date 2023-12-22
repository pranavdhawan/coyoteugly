import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import Single from "./pages/single/Single";
import { BrowserRouter, Router,Routes, Route, Navigate } from "react-router-dom";
import "./style/dark.scss";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import "./App.css"

import { SignOutButton, SignInButton, SignedIn, SignedOut } from "@clerk/clerk-react"

function App() {
  const { user } = useContext(AuthContext);

  return (
    <div className={`app-container ${user ? "signed-in" : "signed-out"}`}>
      <SignedOut>
        <div className="signin-container">
          {/* Background logo for signed-out state */}
          <div className="background-logo" />
          <SignInButton />
        </div>
      </SignedOut>
      <SignedIn>
        <Home />
        {/* <SignOutButton afterSignOutUrl="/" />
        <p>This content is private. Only signed-in users can see the SignOutButton above this text.</p> */}
      </SignedIn>
    </div>
  );
}

export default App;