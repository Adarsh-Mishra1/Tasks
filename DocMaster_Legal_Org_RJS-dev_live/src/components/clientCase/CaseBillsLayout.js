import { useState } from "react";
import MainComponent from "../newFlow/mainComponent";
import CaseOrgBills from "./CaseOrgBills";

function CaseBillsLayout() {
  const [activeTab, setActiveTab] = useState("caseBills");

  return (
    <div className="main_container">
      <ul
        class="nav nav-pills mb-3 bill-sub-mn
          right-col-tabs org-tabs 
          sub-tab-items"
        id="pills-tab1"
        role="tablist"
        style={{}}
      >
        <li class="nav-item " role="presentation">
          <div
            className={`nav-link ${activeTab === "caseBills" ? "active" : ""}`}
            style={{
              fontSize: "16px",
              fontWeight: "500",
              padding: "0",
              border: "none",
              cursor: "pointer",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              textDecoration: "underline",
            }}
            onClick={() => setActiveTab("caseBills")}
          >
            Case wise Bills
          </div>
        </li>
        |
        <li class="nav-item " role="presentation">
          <div
            className={`nav-link ${activeTab === "orgBills" ? "active" : ""}`}
            style={{
              fontSize: "16px",
              fontWeight: "500",
              padding: "0",
              border: "none",
              cursor: "pointer",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
            onClick={() => setActiveTab("orgBills")}
          >
            Org Bills
          </div>
        </li>
      </ul>

      <div>
        {activeTab === "caseBills" && (
          <div
            className={`mt-2 tab-pane fade ${
              activeTab === "caseBills" ? "show active" : ""
            }`}
            id="pills-profile"
            role="tabpanel"
            aria-labelledby="pills-profile-tab"
          >
            <MainComponent type={"billingPayments"} />
          </div>
        )}
        {activeTab === "orgBills" && (
          <div
            className={`tab-pane fade ${
              activeTab === "orgBills" ? "show active" : ""
            }`}
            id="pills-profile"
            role="tabpanel"
            aria-labelledby="pills-profile-tab"
          >
            <CaseOrgBills />
          </div>
        )}
      </div>
    </div>
  );
}

export default CaseBillsLayout;
