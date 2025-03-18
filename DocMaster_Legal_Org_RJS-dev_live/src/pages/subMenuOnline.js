import { Suspense, useState } from "react";
import MergeTemplates from "./fileMerge/MergeTemplates";
import MergeRecords from "./fileMerge/MergeRecords";

const OnlineSubMenu = () => {
  const [activeTab, setActiveTab] = useState("template");

  return (
    <Suspense fallback={<>Loading...</>}>
      <div className="main_container">
        <ul
          class="nav nav-pills mb-3 right-col-tabs sub-tab-items bill-sub-mn org-tabs"
          id="pills-tab1"
          role="tablist"
        >
          <li class="nav-item " role="presentation">
            <div
            className={`nav-link active ${
              activeTab === "home1" ? "active" : ""
            }`}
              id="pills-home-tab1"
              data-bs-toggle="pill"
              data-bs-target="#pills-home1"
              type="button"
              role="tab"
              aria-controls="pills-home1"
              aria-selected="true"

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
              // style={{
              //   fontSize: "17px",
              //   color: "blue",
              //   cursor: "pointer",
              //   justifyContent: "center",
              //   alignItems: "center",
              //   textAlign: "center",
              // }}
              onClick={() => setActiveTab("template")}
            >
              Templates
            </div>
          </li>
          |
          <li class="nav-item " role="presentation">
            <div
              className={`nav-link ${
                activeTab === "home2" ? "active" : ""
              }`}
              id="pills-home-tab2"
              data-bs-toggle="pill"
              data-bs-target="#pills-home2"
              type="button"
              role="tab"
              aria-controls="pills-home2"
              aria-selected="true"
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
              onClick={() => setActiveTab("records")}
            >
              Records
            </div>
          </li>
        </ul>
        <div
          class="tab-content mb-3 pe-0 ps-0 sub-tab-content"
          id="pills-tab1Content"
          style={{
            border: "none",
            borderRadius: "10",
          }}
        >
          {activeTab === "template" && (
            <div
              class="tab-pane fade show active"
              // id="pills-home1"
              // role="tabpanel"
              // aria-labelledby="pills-home1-tab1"
            >
              <MergeTemplates />
            </div>
          )}
          {activeTab === "records" && (
            <div
              class="tab-pane fade show active"
              // id="pills-home2"
              // role="tabpanel"
              // aria-labelledby="pills-home2-tab2"
            >
              <MergeRecords />
            </div>
          )}
        </div>
      </div>
    </Suspense>
  );
};

export default OnlineSubMenu;
