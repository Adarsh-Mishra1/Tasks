import { Suspense, lazy, useEffect, useState } from "react";
import FeeCalculatorSub1 from "../components/legalOrg/FeeCalculatorSub1";
import ClientCaseInfoDocFormsJQuery from "./legalOrg/ClientCaseInfoDocFormsJQuery";
import { useLocation, useNavigate } from "react-router-dom";
import ShowAllUserCaseLaw from "../components/caseLaw/ShowAllCaseLawUser";

const Navbar = lazy(() => import("../components/Navbar"));
const Sidebar = lazy(() => import("../components/Sidebar"));
const Footer = lazy(() => import("../components/Footer"));

const Judgmentcourtfees = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("pills-home");

  useEffect(() => {
    switch (location.search) {
      case "?1":
        setActiveTab("pills-home");
        break;
      case "?2":
        setActiveTab("pills-home1");
        break;
      case "?3":
        setActiveTab("pills-home2");
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
            class="nav nav-pills mb-3 right-col-tabs"
            id="pills-tab"
            role="tablist"
          >
            {/* <li class="nav-item me-2" role="presentation">
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
                aria-selected="true"
                onClick={() => navigate("/judgmentcourtfees?1")}
              >
                Court Fees Calculator
              </button>
            </li> */}
            <li class="nav-item me-2" role="presentation">
              <button
                className={`nav-link ${
                  activeTab === "pills-home1" ? "active" : ""
                }`}
                id="pills-home-tab1"
                data-bs-toggle="pill"
                data-bs-target="#pills-home1"
                type="button"
                role="tab"
                aria-controls="pills-home1"
                aria-selected="true"
                onClick={() => navigate("/judgmentcourtfees?2")}
              >
                Judgement Search
              </button>
            </li>
            {/* <li class="nav-item " role="presentation">
              <button
                className={`nav-link ${
                  activeTab === "pills-home2" ? "active" : ""
                }`}
                id="pills-home-tab1"
                data-bs-toggle="pill"
                data-bs-target="#pills-home2"
                type="button"
                role="tab"
                aria-controls="pills-home2"
                aria-selected="true"
                onClick={() => navigate("/judgmentcourtfees?3")}
              >
                My Judgements
              </button>
            </li> */}
          </ul>
          <div class="tab-content" id="pills-tabContent">
            {/* <div
              className={`tab-pane fade ${
                activeTab === "pills-home" ? "show active" : ""
              }`}
              id="pills-home"
              role="tabpanel"
              aria-labelledby="pills-home-tab"
            >
              <FeeCalculatorSub1 />
            </div> */}

            <div
              className={`tab-pane fade ${
                activeTab === "pills-home1" ? "show active" : ""
              }`}
              id="pills-home1"
              role="tabpanel"
              aria-labelledby="pills-home1-tab1"
            >
              <ClientCaseInfoDocFormsJQuery />
            </div>

            <div
              className={`tab-pane fade ${
                activeTab === "pills-home2" ? "show active" : ""
              }`}
              id="pills-home2"
              role="tabpanel"
              aria-labelledby="pills-home2-tab2"
            >
              <ShowAllUserCaseLaw />
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </Suspense>
  );
};

export default Judgmentcourtfees;
