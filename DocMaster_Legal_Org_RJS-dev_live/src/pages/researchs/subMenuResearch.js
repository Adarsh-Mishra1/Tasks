import { Suspense, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import MyResearchSubjects from "./MyResearchSubjects";
import ResearchsAssign2Me from "./ResearchsAssign2Me";
import OrgResearchs from "./OrgResearchs";

const ResearchSubMenu = () => {
  let navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("MyResearch");

  return (
    <Suspense fallback={<>Loading...</>}>
      <div className="main_container">
        <ul
          class="nav nav-pills mb-3 
          right-col-tabs 
          sub-tab-items"
          id="pills-tab1"
          role="tablist"
          style={{}}
        >
          <li class="nav-item " role="presentation">
            <div
              className={`nav-link ${
                activeTab === "MyResearch" ? "active" : ""
              }`}
              id="pills-MyResearch-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-MyResearch"
              type="button"
              role="tab"
              aria-controls="pills-MyResearch"
              aria-selected={activeTab === "pills-MyResearch"}
              style={{
                fontSize: "16px",
                fontWeight:"500",
                padding:"0",
                border:"none",
                cursor: "pointer",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                textDecoration:'underline'
              }}
              onClick={() => setActiveTab("MyResearch")}
            >
              My Research
            </div>
          </li>
          |
          <li class="nav-item " role="presentation">
            <div
              className={`nav-link ${
                activeTab === "assignedToMe" ? "active" : ""
              }`}
              id="pills-assignedToMe-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-assignedToMe"
              type="button"
              role="tab"
              aria-controls="pills-assignedToMe"
              aria-selected={activeTab === "pills-assignedToMe"}

              style={{
                fontSize: "16px",
                fontWeight:"500",
                padding:"0",
                border:"none",
                cursor: "pointer",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
              }}
              onClick={() => setActiveTab("assignedToMe")}
            >
              Assigned to Me
            </div>
          </li>
          |
          <li class="nav-item " role="presentation">
            <div
              className={`nav-link ${
                activeTab === "allResearchs" ? "active" : ""
              }`}
              id="pills-allResearchs-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-allResearchs"
              type="button"
              role="tab"
              aria-controls="pills-allResearchs"
              aria-selected={activeTab === "pills-allResearchs"}
              style={{
                fontSize: "16px",
                fontWeight:"500",
                padding:"0",
                border:"none",
                cursor: "pointer",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                
              }}
              onClick={() => setActiveTab("allResearchs")}
            >
              All Researches
            </div>
          </li>
          |
          <li class="nav-item" role="presentation">
            <div
              
              id="pills-createNewResearch-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-createNewResearch"
              type="button"
              role="tab"
              aria-controls="pills-createNewResearch"
              aria-selected={activeTab === "pills-createNewResearch"}
              style={{
                fontSize: "16px",
                fontWeight:"500",
                padding:"0",
                border:"none",
                cursor: "pointer",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                textDecoration: "underline",
                color:'red'

              }}
              onClick={() => {
                navigate("/createResearchSubject");
              }}
            >
              Create New Research
            </div>
          </li>
        </ul>
        <div
          class="tab-content mb-3 mt-0 pt-0 ps-0 pe-0"
          id="pills-tab1Content"
          style={{
            border: "none",
            borderRadius: "0",
          }}
        >
          {activeTab === "MyResearch" && (
            <div
            // class="tab-pane fade show active"
            // id="pills-home1"
            // role="tabpanel"
            // aria-labelledby="pills-home1-tab1"
            >
              <MyResearchSubjects />
            </div>
          )}
          {activeTab === "assignedToMe" && (
            <div
            // class="tab-pane fade show"
            // id="pills-home2"
            // role="tabpanel"
            // aria-labelledby="pills-home1-tab2"
            >
              <ResearchsAssign2Me />
            </div>
          )}
          <div
          // class="tab-pane fade show"
          // id="pills-home3"
          // role="tabpanel"
          // aria-labelledby="pills-home3-tab3"
          >
            {activeTab === "allResearchs" && (
               
                <OrgResearchs />
               
            )}
          </div>
          <div
            class="tab-pane fade show"
            id="pills-home3"
            role="tabpanel"
            aria-labelledby="pills-home3-tab3"
          >
            <div className="title_left">
              {/* <h3 className="mt-0">Research Subject(s)</h3> */}
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default ResearchSubMenu;
