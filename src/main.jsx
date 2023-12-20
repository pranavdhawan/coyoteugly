import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import { ClerkProvider } from '@clerk/clerk-react'

// import { DarkModeContextProvider } from "./context/darkModeContext";
// import { AuthContextProvider } from "./context/AuthContext";

// ReactDOM.createRoot(
//   <React.StrictMode>
//       <App />
//   </React.StrictMode>,
//   document.getElementById("root")
// );



const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: [
			{
				index: true,
				element: <App />,
			},
			{
				path: 'login',
				element: <Login />,
			}
		],
	},
	{
		path: '*',
		element: <App />,
	},
]);

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
 
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}


ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
	<ClerkProvider frontendApi={PUBLISHABLE_KEY}>
		<RouterProvider router={router} />
	</ClerkProvider>
	</React.StrictMode>
);