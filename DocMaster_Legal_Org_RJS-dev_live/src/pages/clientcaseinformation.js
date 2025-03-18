import { Suspense, lazy, useEffect, useState } from "react";
import Research from "./client/Clients";
import SubMenuCase from "./clientCase/subMenuCase";
import MainComponent from "../components/newFlow/mainComponent";
import { useLocation, useNavigate } from "react-router-dom";
import CaseBillsLayout from "../components/clientCase/CaseBillsLayout";
import ClientCaseData from "./ClientCaseData";
import { clearNotesFromDisplay } from "../components/stickyNotes/StickyNotesSlice";
import { useDispatch } from "react-redux";
import CaseRelatedJudgements from "./caseRelatedJudgements";

const Navbar = lazy(() => import("../components/Navbar"));
const Sidebar = lazy(() => import("../components/Sidebar"));
const Footer = lazy(() => import("../components/Footer"));

const Clientcaseinformation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("pills-home");

  useEffect(() => {
    dispatch(clearNotesFromDisplay());
    switch (location.search) {
      case "?1":
        setActiveTab("pills-profile");
        break;
      case "?2":
        setActiveTab("pills-list-of-events");
        break;
      case "?3":
        setActiveTab("pills-drafting1");
        break;
      case "?4":
        setActiveTab("pills-drafting");
        break;
      case "?5":
        setActiveTab("pills-drafting2");
        break;
      default:
        setActiveTab("pills-home");
        break;
    }
  }, [location.search]);

  return (
    <Suspense fallback={<>Loading...</>}>
      <div className="main_container">
        <Sidebar />
        <Navbar />
        <div className="right_col" role="main">
          <ul
            className="nav nav-pills mb-3 right-col-tabs"
            id="pills-tab"
            role="tablist"
          >
            <li className="nav-item me-2" role="presentation">
              <button
                className={`nav-link ${
                  activeTab === "pills-profile" ? "active" : ""
                }`}
                id="pills-profile-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-profile"
                type="button"
                role="tab"
                aria-controls="pills-profile"
                aria-selected={activeTab === "pills-profile"}
                onClick={() => {
                  setActiveTab("pills-profile");
                  navigate("/clientcaseinformation?1");
                }}
              >
                Client Management
              </button>
            </li>
            <li className="nav-item me-2" role="presentation">
              <button
                className={`nav-link ${
                  activeTab === "pills-list-of-events" ? "active" : ""
                }`}
                id="pills-list-of-events-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-list-of-events"
                type="button"
                role="tab"
                aria-controls="pills-list-of-events"
                aria-selected={activeTab === "pills-list-of-events"}
                onClick={() => {
                  setActiveTab("pills-list-of-events");
                  navigate("/clientcaseinformation?2");
                }}
              >
                Case Management
              </button>
            </li>

            <li className="nav-item me-2" role="presentation">
              <button
                className={`nav-link ${
                  activeTab === "pills-drafting1" ? "active" : ""
                }`}
                id="pills-drafting-tab1"
                data-bs-toggle="pill"
                data-bs-target="#pills-drafting1"
                type="button"
                role="tab"
                aria-controls="pills-drafting1"
                aria-selected={activeTab === "pills-drafting1"}
                onClick={() => {
                  setActiveTab("pills-drafting1");
                  navigate("/clientcaseinformation?3");
                }}
              >
                Case Hearing Diary
              </button>
            </li>
            <li className="nav-item me-2" role="presentation">
              <button
                className={`nav-link ${
                  activeTab === "pills-drafting" ? "active" : ""
                }`}
                id="pills-drafting-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-drafting"
                type="button"
                role="tab"
                aria-controls="pills-drafting"
                aria-selected={activeTab === "pills-drafting"}
                onClick={() => {
                  setActiveTab("pills-drafting");
                  navigate("/clientcaseinformation?4");
                }}
              >
                Billing & Payments
              </button>
            </li>
            {/* <li className="nav-item me-2" role="presentation">
              <button
                className={`nav-link ${
                  activeTab === "pills-drafting2" ? "active" : ""
                }`}
                id="pills-drafting-tab2"
                data-bs-toggle="pill"
                data-bs-target="#pills-drafting2"
                type="button"
                role="tab"
                aria-controls="pills-drafting2"
                aria-selected={activeTab === "pills-drafting2"}
                onClick={() => {
                  setActiveTab("pills-drafting2");
                  navigate("/clientcaseinformation?5");
                }}
              >
                Related Judgment
              </button>
            </li> */}
          </ul>
          <div className="tab-content" id="pills-tabContent">
            <div
              className={`tab-pane fade ${
                activeTab === "pills-home" ? "show active" : ""
              }`}
              id="pills-home"
              role="tabpanel"
              aria-labelledby="pills-home-tab"
            >
              {/* <Research /> */}
            </div>
            <div
              className={`tab-pane fade ${
                activeTab === "pills-profile" ? "show active" : ""
              }`}
              id="pills-profile"
              role="tabpanel"
              aria-labelledby="pills-profile-tab"
            >
              {/* Client management */}
              {/* <Research /> */}
              <ClientCaseData componentType="client" />
            </div>
            <div
              className={`tab-pane fade ${
                activeTab === "pills-list-of-events" ? "show active" : ""
              }`}
              id="pills-list-of-events"
              role="tabpanel"
              aria-labelledby="pills-list-of-events-tab"
            >
              {/* Case management */}
              {/* <SubMenuCase /> */}
              <ClientCaseData componentType="case" />
            </div>
            <div
              className={`tab-pane fade ${
                activeTab === "pills-drafting1" ? "show active" : ""
              }`}
              id="pills-drafting1"
              role="tabpanel"
              aria-labelledby="pills-drafting-tab1"
            >
              {/* Case hearing diary */}
              <MainComponent type={"caseHearing"} />
            </div>
            <div
              className={`tab-pane fade ${
                activeTab === "pills-drafting" ? "show active" : ""
              }`}
              id="pills-drafting"
              role="tabpanel"
              aria-labelledby="pills-drafting-tab"
            >
              {/* Billing and payments */}
              {/* <MainComponent type={"billingPayments"} /> */}
              <CaseBillsLayout />
            </div>
            {/* <div
              className={`tab-pane fade ${
                activeTab === "pills-drafting2" ? "show active" : ""
              }`}
              id="pills-drafting2"
              role="tabpanel"
              aria-labelledby="pills-drafting2-tab"
            >
              <CaseRelatedJudgements />
            </div> */}
          </div>
          <Footer />
        </div>
      </div>
    </Suspense>
  );
};

export default Clientcaseinformation;
