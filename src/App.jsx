import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import Single from "./pages/single/Single";
// import New from "./pages/new/New";
import { BrowserRouter, Router,Routes, Route, Navigate } from "react-router-dom";
// import { productInputs, userInputs } from "./formSource";
import "./style/dark.scss";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
// import { hotelColumns, userColumns, roomColumns } from "./datatablesource";
// import NewHotel from "./pages/newHotel/NewHotel";
// import NewRoom from "./pages/newRoom/NewRoom";

import { SignOutButton, SignInButton, SignedIn, SignedOut } from "@clerk/clerk-react"


function App() {
  const ProtectedRoute = ({children}) => {
    const {user} = useContext(AuthContext)

    // if(!user) {
    //   return <Navigate to="/login"></Navigate>
    // }
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


  // return (
  //     <div className="app">
  //             <SignedIn>
  //               <Home/>
  //             </SignedIn>

  //       {/* <Router> */}
  //         {/* <Routes> */}
  //           {/* <Route path="/login" element={<Login />} /> */}
  //           {/* <Route path="/signup" element={<Signup />} /> */}
  //           {/* <Route path="/" element={<Home />} /> */}
  //         {/* </Routes> */}
  //       {/* </Router> */}
  //     </div>
  // );

}

export default App;
