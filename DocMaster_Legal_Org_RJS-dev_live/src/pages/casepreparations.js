import { useEffect, useState, Suspense, lazy } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ClientCaseInfoDocForms from "./legalOrg/ClientCaseInfoDocForms";
import ResearchSubMenu from "./researchs/subMenuResearch";
import MainComponent from "../components/newFlow/mainComponent";
import { useDispatch } from "react-redux";
import { clearNotesFromDisplay } from "../components/stickyNotes/StickyNotesSlice";

const Navbar = lazy(() => import("../components/Navbar"));
const Sidebar = lazy(() => import("../components/Sidebar"));
const Footer = lazy(() => import("../components/Footer"));

const Casepreparations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("pills-home");

  useEffect(() => {
    dispatch(clearNotesFromDisplay());
    switch (location.search) {
      case "?1":
        setActiveTab("pills-home");
        break;
      case "?2":
        setActiveTab("pills-profile");
        break;
      case "?3":
        setActiveTab("pills-list-of-events");
        break;
      case "?4":
        setActiveTab("pills-drafting");
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

        {/* <!-- page content --> */}
        <div className="right_col" role="main">
          <ul
            className="nav nav-pills mb-3 right-col-tabs"
            id="pills-tab"
            role="tablist"
          >
            <li className="nav-item me-2" role="presentation">
              <button
                className={`nav-link ${
                  activeTab === "pills-home" ? "active" : ""
                }`}
                id="pills-home-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-home"
                type="button"
                role="tab"
                aria-controls="pills-home"
                aria-selected={activeTab === "pills-home"}
                onClick={() => {
                  navigate("/Casepreparations?1");
                }}
              >
                Problem Info
              </button>
            </li>
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
                  navigate("/Casepreparations?2");
                }}
              >
                Research
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
                onClick={() => navigate("/Casepreparations?3")}
              >
                List of Events
              </button>
            </li>
            <li className="nav-item " role="presentation">
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
                  navigate("/Casepreparations?4");
                }}
              >
                Drafting
              </button>
            </li>
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
              <ClientCaseInfoDocForms />
            </div>
            <div
              className={`tab-pane fade ${
                activeTab === "pills-profile" ? "show active" : ""
              }`}
              id="pills-profile"
              role="tabpanel"
              aria-labelledby="pills-profile-tab"
            >
              <ResearchSubMenu />
            </div>
            <div
              className={`tab-pane fade ${
                activeTab === "pills-list-of-events" ? "show active" : ""
              }`}
              id="pills-list-of-events"
              role="tabpanel"
              aria-labelledby="pills-list-of-events-tab"
            >
              <MainComponent type="listEvents" />
            </div>
            <div
              className={`tab-pane fade ${
                activeTab === "pills-drafting" ? "show active" : ""
              }`}
              id="pills-drafting"
              role="tabpanel"
              aria-labelledby="pills-drafting-tab"
            >
              <MainComponent type="drafting" />
            </div>
          </div>
          <Footer />
        </div>
        {/* <!-- /page content --> */}
      </div>
    </Suspense>
  );
};

export default Casepreparations;
