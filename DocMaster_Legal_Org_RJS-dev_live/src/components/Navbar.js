import React, { useEffect } from "react";
import axios from "axios";

import { toggleSideBar } from "../ThemeFunctions/ThemeFunctions";
import userStore from "../zustand/userStore";

import { WSCheckForLogOutFromAllFlag } from "../configs/WebService";
import { apiKeyHeader } from "../configs/ApiKeys";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import DisplayOnScreenNotes from "./stickyNotes/displayOnScreenNotes";
import StickyPopup from "./stickyNotes/stickyPopup";

const Navbar = () => {
  const location = useLocation();
  const { userData, removeUser } = userStore((state) => ({
    userData: state.user,
    removeUser: state.removeUser,
  }));
  const { notesToDisplay, displayCreateNote } = useSelector(
    (store) => store.stickyNotes
  );
  const navigate = useNavigate();
  const ticketingURL = `https://ticketing.docmaster.in/?email=${userData.email_id}&name=${userData.name}&userId=${userData.id}&userType=User`;
  const requiredNoteUrl = location.pathname + location.search;
  // pathname search "/clientCaseShow" "/Casepreparations?2" "/Casepreparations?3" "/Casepreparations?4" clientcaseinformation?3 /judgmentcourtfees?2
  const displayNotesURLS = [
    "/clientCaseShow",
    "/Casepreparations?2",
    "/Casepreparations?3",
    "/Casepreparations?4",
    "/clientcaseinformation?3",
    "/judgmentcourtfees?2",
    "/myResearchSubject",
  ];

  const logOutUser = async() => {
    try {
      await callLogoutAPI();
    } catch (error) {
      console.log("Logout API failed, but proceeding with logout.",error);
    }
    removeUser();
    navigate("/Login");
  };
  async function callLogoutAPI() {
    if (!userData || !userData.id || !userData.token) {
      console.log("User data is missing. Cannot call logout API.");
      return;
    }
    try {
      const response = await axios.post(
        'https://web1024.ipguide.net:8443/organisation_new/logOut',
        JSON.stringify({
          userId: userData.id,
          lastLogInTimeStamp: userData.loginTimeStamp,
        }),
        {
          headers: {
            ...apiKeyHeader(),
            Authorization: `Bearer ${userData.token}`,
            "Content-Type": "application/json", 
          },
        }
      );
  
      if (response.status === 200) {
        console.log("Successfully logged out");
      } else {
        console.error("Logout API responded with status:", response.status);
      }
    } catch (error) {
      console.error("Error during logout API call:", error);
      throw error;
    }
  }
  

  // function callLogoutAPI() {
  //   return axios
  //     .post(
  //       'https://web1024.ipguide.net:8443/organisation-n/logOut', // Replace with your actual logout API endpoint
  //       JSON.stringify({
  //         userId: userData.id,
  //         lastLogInTimeStamp: userData.loginTimeStamp,
  //       }),
  //       {
  //         headers: {
  //           ...apiKeyHeader(), // Spread the existing headers from apiKeyHeader
  //          Authorization: `Bearer ${userData.token}`, // Add the Bearer token
  //         },
  //       }
  //     )
  //     .then((response) => {
  //       if (response.status === 200) {
  //         console.log("Successfully logged out");
  //       } else {
  //         console.error("Logout API responded with a non-200 status:", response.status);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error during logout API call:", error);
  //     });
  // }
  const [searchParams] = useSearchParams();
  const Exdate = searchParams.get("Exdate");

  useEffect(() => {
    // console.log("useEffect_navbar_userData",userData)
    if (userData.isLoggedIn) {
      //Do Nothing
      if (userData.loginTimeStamp != undefined) {
        checkForlogOutFromAllDeviceFlag();
      }
    }
  }, []);

  function checkForlogOutFromAllDeviceFlag() {
    axios
      .post(
        WSCheckForLogOutFromAllFlag,
        JSON.stringify({
          userId: userData.id,
          lastLogInTimeStamp: userData.loginTimeStamp,
        }),
        {
          headers: {
            // ...apiKeyHeader(), // Spread the existing headers from apiKeyHeader
            // Authorization: `Bearer ${userData.token}`, // Add the Bearer token
            ...apiKeyHeader(), // Spread the existing headers from apiKeyHeader
          },
        }
      )
      .then((response) => {
        const responseData = response.data;
        // console.log("checkForlogOutFromAllDeviceFlag_responseData",responseData)
        if (responseData.logout == 1) {
          logOutUser();
        }
      })
      .catch((error) => {
        console.error("error", error);
      });
  }

  return (
    <>
      {displayNotesURLS.includes(requiredNoteUrl) &&
        notesToDisplay.length > 0 && (
          <DisplayOnScreenNotes notes={notesToDisplay} />
        )}
      {displayCreateNote && <StickyPopup>Hello</StickyPopup>}
      {Exdate && (
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
          style={{
            position: "absolute",
            top: "8px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            borderRadius: "6px",
          }}
        >
          <strong>
            Your account is under 45 days trial which will expire on {Exdate}.
          </strong>{" "}
          Please make your payments before the date to continue using your
          account after {Exdate}. For more info. contact docmaster.in
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
          ></button>
        </div>
      )}
      <div className="top_nav w-100">
        <div className="nav_menu">
          <div className="left-top-menu-sec"></div>
          <div className="nav toggle">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            {/* DevNote: Togglebar */}
            {/* <a
              id="menu_toggle"
              onClick={() => {
                toggleSideBar();
              }}
            >
              <i className="fa fa-bars"></i>
            </a> */}
          </div>
          {/* <div className="nav toggle" style={{ marginLeft: "-20px" }}>
          <img
            src="/images/docmaster.png"
            alt="..."
            style={{ width: "180px", marginTop: "6px", marginBottom: "6px" }}
          />
        </div> */}
          {/* <button style={{position:'absolute',top:"8px",border:"1px solid #1c46f2",background:"#1c46f2",color:"#FFF",padding:"5px",borderRadius:"6px"}}><i class="fa fa-arrow-left" aria-hidden="true"></i>&nbsp;Back</button> */}
          <nav className="nav navbar-nav px-3 d-flex justify-content-between">
            {/* <ul>Go Back</ul> */}
            <ul className="navbar-right">
              <li className="pe-0">
                <a href="/" className="site_title">
                  <img
                    src="/images/docmaster.png"
                    alt="..."
                    style={{
                      width: "170px",
                      marginTop: "0px",
                      marginBottom: "0px",
                    }}
                  />
                </a>
              </li>
              {/* <li className="pe-0">
                <a
                  // href="https://ticketing.docmaster.in"
                  href={ticketingURL}
                  target="_blanks"
                  className="site_title"
                >
                  <img
                    src="../../images/ticket-icon.jpg"
                    alt="..."
                    title="Raise Your Ticket"
                    style={{
                      width: "50px",
                      marginTop: "0px",
                      marginBottom: "0px",
                    }}
                  />
                </a>
              </li> */}
              {/* <li className="pe-0">
              <button
                style={{ marginTop: "5px", marginLeft: "10px" }}
                className="btn btn-primary"
                onClick={() => setDisplayStickyNotes(true)}
              >
                Sticky Notes
              </button>
            </li> */}
              {location.pathname === "/" && (
                <li className="nav-item dropdown open me-0 py-2">
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a
                    // href="javascript:void(0);"
                    className="user-profile dropdown-toggle"
                    style={{ cursor: "pointer" }}
                    aria-haspopup="true"
                    id="navbarDropdown"
                    data-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {/* <img src="/images/img.jpg" alt="" /> */}
                    {/* <i className="fa fa-user"></i>&nbsp; {userData.name} */}
                    <div className="profile_pic">
                      <i
                        className="fa fa-user img-circle profile_img"
                        style={{
                          fontSize: "20px",
                          textAlign: "center",
                          color: "#fff",
                          background: "#1c46f2",
                          border: "1px solid #1c46f2",
                        }}
                      ></i>
                    </div>
                  </a>
                  <div
                    className="dropdown-menu dropdown-usermenu pull-right"
                    aria-labelledby="navbarDropdown"
                  >
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a className="dropdown-item" href="/Profile">
                      <span>Profile</span>
                    </a>

                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a className="dropdown-item" onClick={() => logOutUser()}>
                      <i className="fa fa-sign-out pull-right"></i> Log Out
                    </a>
                  </div>
                </li>
              )}
              <li className="nav-item dropdown open px-1 py-2 me-0">
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a
                  // href="javascript:void(0);"
                  onClick={() => logOutUser()}
                  className="user-profile  "
                  style={{ cursor: "pointer" }}
                  aria-haspopup="true"
                  // id="navbarDropdown"
                  // data-toggle="dropdown"
                  aria-expanded="false"
                >
                  {/* <img src="/images/img.jpg" alt="" /> */}
                  {/* <i className="fa fa-user"></i>&nbsp; {userData.name} */}
                  {/* {location.pathname === "/" && ( */}
                  {/* <div className="profile_pic" title="Logout">
                    <i
                      className="fa fa-sign-out img-circle profile_img"
                      style={{ fontSize: "20px", textAlign: "center" }}
                    ></i>
                  </div> */}
                  {/* )} */}
                </a>
                <div
                  className="dropdown-menu dropdown-usermenu pull-right"
                  aria-labelledby="navbarDropdown"
                >
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a className="dropdown-item" href="#">
                    {" "}
                    Profile
                  </a>
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a className="dropdown-item" href="#">
                    <span className="badge bg-red pull-right">50%</span>
                    <span>Settings</span>
                  </a>
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a className="dropdown-item" href="#">
                    Help
                  </a>
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a className="dropdown-item" onClick={() => logOutUser()}>
                    <i className="fa fa-sign-out pull-right"></i> Log Out
                  </a>
                </div>
              </li>

              {/* <li role="presentation" className="nav-item dropdown open">
              <a
                className="dropdown-toggle info-number"
                style={{cursor:"pointer"}}
                id="navbarDropdown1"
                data-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fa fa-envelope-o"></i>
                <span className="badge bg-green">6</span>
              </a>
              <ul
                className="dropdown-menu list-unstyled msg_list"
                role="menu"
                aria-labelledby="navbarDropdown1"
              >
                <li className="nav-item">
                  <a className="dropdown-item">
                    <span className="image">
                      <img src="images/img.jpg" alt="Profile Image" />
                    </span>
                    <span>
                      <span>John Smith</span>
                      <span className="time">3 mins ago</span>
                    </span>
                    <span className="message">
                      Film festivals used to be do-or-die moments for movie
                      makers. They were where...
                    </span>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="dropdown-item">
                    <span className="image">
                      <img src="/images/img.jpg" alt="Profile Image" />
                    </span>
                    <span>
                      <span>John Smith</span>
                      <span className="time">3 mins ago</span>
                    </span>
                    <span className="message">
                      Film festivals used to be do-or-die moments for movie
                      makers. They were where...
                    </span>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="dropdown-item">
                    <span className="image">
                      <img src="images/img.jpg" alt="Profile Image" />
                    </span>
                    <span>
                      <span>John Smith</span>
                      <span className="time">3 mins ago</span>
                    </span>
                    <span className="message">
                      Film festivals used to be do-or-die moments for movie
                      makers. They were where...
                    </span>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="dropdown-item">
                    <span className="image">
                      <img src="images/img.jpg" alt="Profile Image" />
                    </span>
                    <span>
                      <span>John Smith</span>
                      <span className="time">3 mins ago</span>
                    </span>
                    <span className="message">
                      Film festivals used to be do-or-die moments for movie
                      makers. They were where...
                    </span>
                  </a>
                </li>
                <li className="nav-item">
                  <div className="text-center">
                    <a className="dropdown-item">
                      <strong>See All Alerts</strong>
                      <i className="fa fa-angle-right"></i>
                    </a>
                  </div>
                </li>
              </ul>
            </li> */}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;
