import { Suspense, useEffect, useState } from "react";
import ClientShowAll from "./ShowAll";
import ClientCreate from "./Create";

const Research = ({ noOfCasesMain }) => {
  const [curTab, setCurTab] = useState("all");

  return (
    <Suspense fallback={<>Loading...</>}>
      <div className="main_container">
        {/* <ul
          class="nav nav-pills mb-3 right-col-tabs sub-tab-items"
          id="pills-tab1"
          role="tablist"
        >
          <li class="nav-item " role="presentation">
            <button
              class="nav-link active mb-0"
              id="pills-home-tab1"
              data-bs-toggle="pill"
              data-bs-target="#pills-home1"
              type="button"
              role="tab"
              aria-controls="pills-home1"
              aria-selected="true"
            >
              All
            </button>
          </li>
          <li class="nav-item " role="presentation">
            <button
              class="nav-link mb-0"
              id="pills-home-tab2"
              data-bs-toggle="pill"
              data-bs-target="#pills-home2"
              type="button"
              role="tab"
              aria-controls="pills-home2"
              aria-selected="true"
            >
              Create
            </button>
          </li>
        </ul> */}

        <div
          class="tab-content mb-3 ps-0 pe-0 sub-tab-content"
          id="pills-tab1Content"
          style={{
            border: "none",
            borderRadius: "0",
          }}
        >
          {curTab === "all" && (
            <div
              class="tab-pane fade show active"
              id="pills-home1"
              role="tabpanel"
              aria-labelledby="pills-home1-tab1"
            >
              <ClientShowAll
                handleCreateNewCase={setCurTab}
                noOfCasesMain={noOfCasesMain}
              />
            </div>
          )}

          {curTab === "create" && (
            <div
              class="tab-pane fade show active"
              id="pills-home2"
              role="tabpanel"
              aria-labelledby="pills-home2-tab2"
            >
              <ClientCreate handleCreateNewCase={setCurTab} />
            </div>
          )}
        </div>
      </div>
      {/* <!-- /page content --> */}

      {/* <Footer /> */}
      {/* </div> */}
    </Suspense>
  );
};

export default Research;
