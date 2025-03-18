import { Suspense, useState } from "react";
import ClientShowAll from "./ShowAll";
import ClientCreate from "./Create";

const ResearchSubMenu = ({
  orgClientCases,
  noOfCasesMain,
  getOrgClientCases,
}) => {
  const [curTab, setCurTab] = useState("all");

  const handleCreateNewCase = () => {
    setCurTab("create");
  };
  return (
    <Suspense fallback={<>Loading...</>}>
      <div className="main_container">
        {/* <ul
          className="nav nav-pills mb-3 right-col-tabs sub-tab-items"
          id="pills-tab1"
          role="tablist"
        >
          <li className="nav-item " role="presentation">
            <button
              // className={`nav-link  mb-0` curTab === 'all' ? 'active' : ''}
              className={`nav-link mb-0 ${curTab === "all" ? "active" : ""}`}
              // id="pills-home-tab1"
              // data-bs-toggle="pill"
              // data-bs-target="#pills-home1"
              type="button"
              role="tab"
              // aria-controls="pills-home1"
              aria-selected="true"
              onClick={() => setCurTab("all")}
            >
              All
            </button>
          </li>
          <li className="nav-item " role="presentation">
            <button
              // className="nav-link active mb-0"
              className={`nav-link mb-0 ${curTab === "create" ? "active" : ""}`}
              // id="pills-home-tab2"
              // data-bs-toggle="pill"
              // data-bs-target="#pills-home2"
              type="button"
              role="tab"
              // aria-controls="pills-home2"
              aria-selected="false"
              onClick={() => setCurTab("create")}
            >
              Create
            </button>
          </li>
        </ul> */}
        <div
          className="tab-content mb-3 ps-0 pe-0"
          id="pills-tab1Content"
          style={{
            border: "none",
            borderRadius: "0",
          }}
        >
          {curTab === "all" && (
            <div
              className="tab-pane fade show active"
              id="pills-home1"
              role="tabpanel"
              aria-labelledby="pills-home-tab1"
            >
              <ClientShowAll
                handleCreateNewCase={handleCreateNewCase}
                noOfCasesMain={noOfCasesMain}
                orgClientCases={orgClientCases}
                getOrgClientCases={getOrgClientCases}
              />
            </div>
          )}
          {curTab === "create" && (
            <div>
              <ClientCreate setCurTab={setCurTab} />
            </div>
          )}
        </div>
      </div>
    </Suspense>
  );
};

export default ResearchSubMenu;
