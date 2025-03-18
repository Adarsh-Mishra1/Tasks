import React, { useEffect, useState } from "react";
import { initSideBar } from "../ThemeFunctions/ThemeFunctions";
import userStore from "../zustand/userStore";
import { useLocation, useNavigate } from "react-router-dom";
import { handleRaiseConcern } from "../OtherFunctions/OtherFunctions";
import axios from "axios";
import { apiKeyHeader } from "../configs/ApiKeys";
// import axios from "axios";
// import { apiKeyHeader } from "../configs/ApiKeys";
const Sidebar = () => {
  const location = useLocation();
  const { userData, removeUser } = userStore((state) => ({
    userData: state.user,
    removeUser: state.removeUser,
  }));
  const navigate = useNavigate();
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

  // const logOutUser = () => {
  //   removeUser(); // Clear local user data
  //   window.location.href = "/";
  //   // callLogoutAPI().then(() => {
  //   //   window.location.href = "/"; // Redirect to the home page
  //   // });
  // };

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

  useEffect(() => {
    if (Object.keys(userData).length === 0 || !userData.isLoggedIn) {
      window.location.href = "/login";
    }
  }, [userData]);

  // State to control the position (left: 0 or left: 250)
  const [isOpen, setIsOpen] = useState(true);

  // Function to toggle the position
  const togglePosition = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className="col-md-3 left_col"
      style={{ left: isOpen ? "-240px" : "0px", transition: "left 0.3s ease" }}
    >
      <div className="left_col scroll-view">
        <div className="clearfix"></div>

        {/* Profile Info */}
        <div className="profile clearfix">
          <div className="d-flex border-b">
            <a className="d-flex gap-2 w-100" href="/Profile">
              <div className="profile_pic me-2 ms-3">
                <i
                  className="fa fa-user img-circle profile_img"
                  style={{ fontSize: "30px", textAlign: "center" }}
                ></i>
              </div>
              <div className="profile_info ps-2">
                <span>Welcome</span>
                <h2>{userData.name}</h2>
              </div>
            </a>
          </div>
          <button
            className="btn btn-sm btn-primary m-0"
            id="toggle-btn"
            onClick={togglePosition}
            style={{ position: "absolute", right: "-38px", top: "5px" }}
          >
            {isOpen ? (
              <i class="fa fa-bars" aria-hidden="true"></i>
            ) : (
              <i class="fa fa-times" aria-hidden="true"></i>
            )}
          </button>
        </div>
        <hr className="mt-2 mb-0" />

        <div
          id="sidebar-menu"
          className="main_menu_side hidden-print main_menu"
          style={{ backgroundColor: "#1C46F2" }}
        >
          <div className="menu_section">
            {/* <h3>Legal Organisation</h3> */}
            <ul className="nav side-menu non-mobile-menu  mt-0">
              {/* Home */}
              <li>
                <a href="/">
                  <i
                    className="fa fa-home"
                    style={{ pointerEvents: "none" }}
                  ></i>{" "}
                  Home
                </a>
              </li>

              {/* Client and Case Information */}
              <li
                className={
                  location.pathname === "/clientCaseInfo" ||
                  location.pathname === "/clientcaseinformation" ||
                  location.pathname === "/clientCaseShow" ||
                  location.pathname === "/clientCaseShowAllByClient" ||
                  location.pathname === "/createResearchSubject" ||
                  location.pathname === "/researchAssigned"
                    ? `active ${
                        location.pathname === "/clientcaseinformation"
                          ? "sub-active"
                          : ""
                      }`
                    : ""
                }
              >
                <a href="/clientCaseInfo" onClick={(e) => initSideBar(e)}>
                  <i
                    className="fa fa-info"
                    style={{ pointerEvents: "none" }}
                  ></i>{" "}
                  Client and Case Information
                  <span
                    className="fa fa-chevron-down"
                    style={{ pointerEvents: "none" }}
                  ></span>
                </a>
              </li>
              {/* Case Preparation */}
              <li
                className={
                  location.pathname === "/casepreparation1" ||
                  location.pathname === "/Casepreparations" ||
                  location.state?.isJudgement === 0
                    ? `active ${
                        location.pathname === "/Casepreparations"
                          ? "sub-active"
                          : ""
                      }`
                    : ""
                }
              >
                <a href="/casepreparation1" onClick={(e) => initSideBar(e)}>
                  <i
                    className="fa fa-folder"
                    style={{ pointerEvents: "none" }}
                  ></i>{" "}
                  Case Preparation
                  <span
                    className="fa fa-chevron-down"
                    style={{ pointerEvents: "none" }}
                  ></span>
                </a>
              </li>

              {/* Document Management */}
              <li
                className={
                  location.pathname === "/documentmanagment" ||
                  location.pathname === "/documentmanagments"
                    ? `active ${
                        location.pathname === "/documentmanagments"
                          ? "sub-active"
                          : ""
                      }`
                    : ""
                }
              >
                <a href="/documentmanagment" onClick={(e) => initSideBar(e)}>
                  <i
                    className="fa fa-file"
                    style={{ pointerEvents: "none" }}
                  ></i>{" "}
                  Document Management
                  <span
                    className="fa fa-chevron-down"
                    style={{ pointerEvents: "none" }}
                  ></span>
                </a>
              </li>

              {/* Judgement and Court Fee */}
              <li
                className={
                  location.pathname === "/judgementCourtFee" ||
                  location.pathname === "/judgmentcourtfees" ||
                  location.state?.isJudgement === 1
                    ? `active ${
                        location.pathname === "/judgmentcourtfees"
                          ? "sub-active"
                          : ""
                      }`
                    : ""
                }
              >
                <a href="/judgementCourtFee" onClick={(e) => initSideBar(e)}>
                  <i
                    className="fa fa-gavel"
                    style={{ pointerEvents: "none" }}
                  ></i>{" "}
                  Others
                  <span
                    className="fa fa-chevron-down"
                    style={{ pointerEvents: "none" }}
                  ></span>
                </a>
                {/* <ul className="nav child_menu">
                  <li>
                    <a href="/feeCal">Fee Calculator</a>
                  </li>
                  <li>
                <a
                  href="http://testjudgement.docmaster.in"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i></i> Judgement Search
                </a>
              </li>
                </ul> */}
              </li>

              {/* Other sections and submenus */}
              {/* {userData.crudAccess?.client?.r === 1 && (
                <li>
                  <a onClick={(e) => initSideBar(e)}>
                    <i className="fa fa-users" style={{ pointerEvents: "none" }}></i> Client(s)
                    <span className="fa fa-chevron-down" style={{ pointerEvents: "none" }}></span>
                  </a>
                  <ul className="nav child_menu">
                    {userData.crudAccess?.client?.c === 1 && (
                      <li>
                        <a href="/clientCreate">Create</a>
                      </li>
                    )}
                    {userData.crudAccess?.client?.r === 1 && (
                      <li>
                        <a href="/clientShowAll">Show All</a>
                      </li>
                    )}
                  </ul>
                </li>
              )} */}
              {/* Additional menu items... */}
              {console.log(
                "userGroup.r value:",
                userData?.crudAccess?.userGroup?.r
              )}
              {userData?.crudAccess?.user &&
                userData.crudAccess.userGroup.r === 1 && (
                  // <li
                  //   className={
                  //     location.pathname === "/userShowAll" ||
                  //     location.pathname === "/UserAdd" ||
                  //     location.state?.isJudgement === 1
                  //       ? `active ${
                  //           location.pathname === "/userView"
                  //             ? "sub-active"
                  //             : ""
                  //         }`
                  //       : ""
                  //   }
                  // >
                  <li
                    className={
                      location.pathname === "/userShowAll" ||
                      location.pathname === "/userAdd" ||
                      location.pathname === "/userView"
                        ? `active`
                        : ""
                    }
                  >
                    <a href="/userShowAll" onClick={(e) => initSideBar(e)}>
                      <i
                        className="fa fa-user"
                        style={{ pointerEvents: "none" }}
                      ></i>
                      Users
                      <span
                        className="fa fa-chevron-down"
                        style={{ pointerEvents: "none" }}
                      ></span>
                    </a>
                  </li>
                )}
              {/* {userData?.crudAccess?.user &&
                userData.crudAccess.userGroup.r === 1 && ( */}
              <li
                className={location.pathname === "/caseDiary" ? `active` : ""}
              >
                <a href="/caseDiary" onClick={(e) => initSideBar(e)}>
                  <i
                    className="fa fa-calendar"
                    style={{ pointerEvents: "none" }}
                  ></i>
                  &nbsp; Case Diary Organizer
                  <span
                    className="fa fa-chevron-down"
                    style={{ pointerEvents: "none" }}
                  ></span>
                </a>
              </li>
              {/* )} */}

              <li>
                <a
                  className="dropdown-item"
                  onClick={() => handleRaiseConcern(userData)}
                >
                  {/* <i className="fa fa-sign-out "></i> */}
                  <i className="fa fa-ticket"></i>&nbsp; Raise Your Concern
                </a>
              </li>

              <li>
                <a className="dropdown-item" onClick={() => logOutUser()}>
                  <i className="fa fa-sign-out "></i> Log Out
                </a>
              </li>
            </ul>

            {/* Mobile menu start */}
            <ul className="nav side-menu mt-0 mobile-menu">
              {/* Home */}
              <li>
                <a href="/">
                  <i
                    className="fa fa-home"
                    style={{ pointerEvents: "none" }}
                  ></i>{" "}
                  Home
                </a>
              </li>
              {/* Client and Case Information */}
              <li>
                <a onClick={(e) => initSideBar(e)}>
                  <i
                    className="fa fa-info"
                    style={{ pointerEvents: "none" }}
                  ></i>{" "}
                  Client and Case Information
                  <span
                    className="fa fa-chevron-down"
                    style={{ pointerEvents: "none" }}
                  ></span>
                </a>
                <ul className="nav child_menu" style={{ display: "block" }}>
                  <li>
                    <a href="/caseDiary">Case Hearing Diary</a>
                  </li>
                  {userData?.orgModuleAccess?.client == 1 ? (
                    <li>
                      <a onClick={(e) => initSideBar(e)}>
                        <i style={{ pointerEvents: "none" }}></i> Client(s){" "}
                        <span
                          style={{ pointerEvents: "none" }}
                          className="fa fa-chevron-down"
                        ></span>
                      </a>
                      <ul className="nav child_menu">
                        {userData.crudAccess?.client?.c == 1 ? (
                          <li>
                            <a href="/clientCreate">Create</a>
                          </li>
                        ) : null}
                        {userData.crudAccess?.client?.r == 1 ? (
                          <li>
                            <a href="/clientShowAll">Show All</a>
                          </li>
                        ) : null}
                      </ul>
                    </li>
                  ) : null}
                  <li>
                    <a href="/clientcaseinformation?2">Case Management</a>
                  </li>
                  <li>
                    <a href="/clientcaseinformation?4">Billing & Payments</a>
                  </li>
                </ul>
              </li>
              {/* Case Preparation */}
              <li>
                <a onClick={(e) => initSideBar(e)}>
                  <i
                    className="fa fa-folder"
                    style={{ pointerEvents: "none" }}
                  ></i>{" "}
                  Case Preparation
                  <span
                    className="fa fa-chevron-down"
                    style={{ pointerEvents: "none" }}
                  ></span>
                </a>

                <ul className="nav child_menu" >
                  {userData?.orgModuleAccess?.probInfo === 1 &&
                  userData.crudAccess?.probInfo?.r === 1 ? (
                    <li>
                      <a href="/Casepreparations?1">
                        <i style={{ pointerEvents: "none" }}></i> Problem Info
                      </a>
                    </li>
                  ) : null}
                  <li>
                    <a onClick={(e) => initSideBar(e)}>
                      <i style={{ pointerEvents: "none" }} /> Research
                      <span
                        style={{ pointerEvents: "none" }}
                        className="fa fa-chevron-down"
                      ></span>
                    </a>
                    <ul className="nav child_menu">
                      {userData.crudAccess?.research?.r === 1 &&
                      userData?.role?.code === "aprvr" ? (
                        <li>
                          <a href="/orgResearchs">All Research(s)</a>
                        </li>
                      ) : null}
                      {userData.crudAccess?.research?.r === 1 ? (
                        <li>
                          <a href="/myResearchSubjects">My Research(s)</a>
                        </li>
                      ) : null}
                      {userData.crudAccess?.research?.r === 1 ? (
                        <li>
                          <a href="/researchsAssign2Me">Assigned to Me</a>
                        </li>
                      ) : null}
                      {userData.crudAccess?.research?.r === 1 ? (
                        <li>
                          <a href="/createResearchSubject" style={{color:'white'}}>Create New Research</a>
                        </li>
                      ) : null}
                    </ul>
                  </li>
                  <li>
                    <a href="/listOfEvents">List of Events</a>
                  </li>
                  <li>
                    <a href="/drafting">Drafting</a>
                  </li>
                </ul>
              </li>

              {/* Document Management */}
              <li>
                <a onClick={(e) => initSideBar(e)}>
                  <i
                    className="fa fa-file"
                    style={{ pointerEvents: "none" }}
                  ></i>{" "}
                  Document Management
                  <span
                    className="fa fa-chevron-down"
                    style={{ pointerEvents: "none" }}
                  ></span>
                </a>
                <ul className="nav child_menu">
                  <li>
                    <a href="/documentmanagment?1">Filled Documents</a>
                  </li>
                  <li>
                    <a href="/documentmanagment?2">External Records</a>
                  </li>
                  <li>
                    <a href="/documentmanagment?3">All Records</a>
                  </li>
                  <li>
                    <a href="/documentmanagments?4">Online Filing</a>
                  </li>
                </ul>
              </li>

              

              {/* Judgement and Court Fee */}
              <li>
                <a onClick={(e) => initSideBar(e)}>
                  <i
                    className="fa fa-gavel"
                    style={{ pointerEvents: "none" }}
                  ></i>{" "}
                  Others
                  <span
                    className="fa fa-chevron-down"
                    style={{ pointerEvents: "none" }}
                  ></span>
                </a>
                <ul className="nav child_menu">
                  <li>
                    <a >Fee Calculator</a>
                  </li>
                  <li><a href="/judgmentcourtfees?2">Judgment Search</a></li>
                  <li>
                    <a
                      href="http://testjudgement.docmaster.in"
                      target="_blank"
                      rel="noopener noreferrer"
                    >Raise Your Concern
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <a href="/userShowAll">
                  <i className="fa fa-user "></i>Users
                </a>
              </li>
              <li>
                <a href="/Profile" onClick={(e) => initSideBar(e)}>
                  <i className="fa fa-sign-out "></i> Profie
                </a>
              </li>
              <li>
                <a className="dropdown-item" onClick={() => logOutUser()}>
                  <i className="fa fa-sign-out "></i> Log Out
                </a>
              </li>
              {/* Additional menu items... */}
            </ul>
            {/* Mobile Menu End */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
