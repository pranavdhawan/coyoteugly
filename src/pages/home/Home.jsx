import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./home.scss";
import Widget from "../../components/widget/Widget";
import Chart from "../../components/chart/Chart";
import { useEffect, useState } from "react";
import Table from "../../components/table/Table"
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import LoadingSpinner from "../../components/loadingspinner/LoadingSpinner";

const Home = () => {
  const [sheetNames, setSheetNames] = useState([]);
  const [sheetID, setSheetID] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState([]);


  const getDefaultView = () => {
    // Set default view based on device width
    return window.innerWidth > 600 ? 'chart' : 'table';
  };



  const [view, setView] = useState(getDefaultView()); // Set default view based on device width

  const [loading, setLoading] = useState(true);


  const { isSignedIn, user, isLoaded } = useUser();

  // console.log(user.primaryEmailAddress.emailAddress)

  let key = import.meta.env.VITE_CLIENT_KEY

  const fetchSheetID = async () => {
    try {
      const response = await axios.get(`https://apnabackend.onrender.com/api/getSheetIdByEmail/${user.primaryEmailAddress.emailAddress}`);
      const sheetID = response.data.sheetId;
      setSheetID(sheetID);
    } catch (error) {
      console.error('Error fetching sheetID:', error.message);
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      await fetchSheetID();
      const user_id = isLoaded ?? user.id;
      const clerkSecretKey = import.meta.env.VITE_CLERK_SECRET_KEY;

      if (user_id) {
        const apiUrl = `https://api.clerk.com/v1/users/${user.id}/metadata`;
        const requestData = {
          private_metadata: {
            sheetId: sheetID
          }
        };

        try {
          const response = await axios.patch(apiUrl, requestData, {
            headers: {
              Authorization: `Bearer ${clerkSecretKey}`,
              'Content-Type': 'application/json'
            }
          });
          // console.log(response.data);
        } catch (error) {
          console.error(error);
        }
      }

      try {
        const endpoint = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}?key=${key}`;
        const response = await fetch(endpoint);
        const data = await response.json();
        const names = data.sheets.map((sheet) => sheet.properties.title);
        setSheetNames(names);
        setSelectedSheet(names[0]);
        setLoading(false);

      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [sheetID, user, isLoaded]);

  const handleViewChange = (newView) => {
    setView(newView);
  };

  return (
    <div className="home">
      <Sidebar names={sheetNames} selectedSheet={selectedSheet} setSelectedSheet={setSelectedSheet} />
      <div className="homeContainer">
        <br />
        {window.innerWidth > 600 ? (
          <div className="viewToggle">
            <button onClick={() => handleViewChange("chart")} disabled={view === "chart"}>
              Chart View
            </button>
            <button onClick={() => handleViewChange("table")} disabled={view === "table"}>
              Table View
            </button>
          </div>
        ) : (<></>)}

        <div className="views">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {view === "chart" && <Chart sheetID={sheetID} websiteName={selectedSheet} />}
              {view === "table" && <Table sheetID={sheetID} websiteName={selectedSheet} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
