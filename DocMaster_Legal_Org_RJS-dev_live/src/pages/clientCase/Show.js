import { useEffect, Suspense, lazy, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

import { useDispatch } from "react-redux";
import { clearNotesFromDisplay } from "../../components/stickyNotes/StickyNotesSlice";
import { fetchStickyNotesByCaseId } from "../../components/stickyNotes/stickyNotesApi";
import { toast } from "react-toastify";
import CaseRelatedJudgements from "../caseRelatedJudgements";
const Navbar = lazy(() => import("../../components/Navbar"));
const Sidebar = lazy(() => import("../../components/Sidebar"));
const Footer = lazy(() => import("../../components/Footer"));
const ClientCaseDocForms = lazy(() =>
  import("../../components/clientCase/ClientCaseDocForms")
);
const ClientCaseResearchs = lazy(() =>
  import("../../components/clientCase/ClientCaseResearchs")
);
const ClientCaseFilledDocForms = lazy(() =>
  import("../../components/clientCase/ClientCaseFilledDocForms")
);
// const FeeCalculator = lazy(
//   () => import("../../components/legalOrg/FeeCalculator"),
// );
const CaseEvents = lazy(() => import("../../components/clientCase/CaseEvents"));
const CaseBills = lazy(() => import("../../components/clientCase/CaseBills"));
const CaseDiary = lazy(() => import("../../components/clientCase/CaseDiary"));
const CaseLaws = lazy(() => import("../../components/clientCase/CaseLaws"));
// const CaseNotes = lazy(() => import("../../components/clientCase/CaseNotes"));

const ClientCaseShow = () => {
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const location = useLocation();
  const cCase = location?.state?.clientCase;
  const client = cCase?.client;

  const [hideOtherTabs, setHideOtherTabs] = useState(false);
  const [changeCount, setChangeCount] = useState(0);

  useEffect(function () {
    getNotes("probleminfo");
  }, []);

  const hideOtherTabFunc = (flag) => {
    if (flag != undefined) {
      setHideOtherTabs(flag);
    }
  };

  const increaseChangeCount = () => {
    setChangeCount(changeCount + 1);
  };

  const handleTabSelect = (key) => {
    switch (key) {
      case "clientCaseInfoDocForms":
        getNotes("probleminfo");
        break;
      case "clientCaseResearchs":
        getNotes("research");
        break;
      case "caseEvents":
        getNotes("events");
        break;
      case "clientCaseDrftngDF":
        getNotes("drafting");
        break;
      case "caseDiary":
        getNotes("caseDiary");
        break;
      default:
        dispatch(clearNotesFromDisplay());
        break;
    }
  };

  const getNotes = (type) => {
    const loaderId = toast.success("Loading...", { autoClose: false });
    dispatch(
      fetchStickyNotesByCaseId({
        caseId: cCase.id,
        type,
      })
    );
    if (loaderId) {
      toast.update(loaderId, {
        render: "Loaded!",
        autoClose: 0,
      });
    }
  };

  return (
    <Suspense fallback={<>Loading...</>}>
      <div className="main_container">
        <Sidebar />
        <Navbar />

        {/* <!-- page content --> */}

        {/* {DevNote: Show Page Content Here} */}
        <div className="right_col" role="main">
          {/* <div className="page-title">
            <div className="title_left">
              <h3>Client Case</h3>
            </div>
          </div> */}

          <div className="clearfix"></div>
          <div
            className="tab-content"
            style={{ border: "0", paddingLeft: "0", paddingRight: "0" }}
          >
            <div className="row">
              <div className="col-md-12 col-sm-12">
                <div className="x_panel">
                  <div className="x_title">
                    <h6>
                      <span
                        onClick={() => {
                          navigate(-1);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        Go Back ⬅️
                      </span>
                      &nbsp;
                      {cCase?.title} (Client: {cCase?.client?.name})
                    </h6>
                    <div className="clearfix"></div>
                  </div>
                  <div className="x_content">
                    {/* <p>{cCase?.details}</p> */}
                    {/* <h4>Case Related actions</h4> */}
                    <hr />
                    <Tabs
                      className="mb-1"
                      defaultActiveKey="clientCaseInfoDocForms"
                      id="uncontrolled-tab-example"
                      onSelect={handleTabSelect}
                    >
                      <Tab
                        eventKey={"clientCaseInfoDocForms"}
                        title={"Problem Info"}
                        // style={{ color: "blue" }}
                      >
                        <ClientCaseDocForms
                          clientCase={cCase}
                          type={"clntinfo"}
                          hideOtherTabs={hideOtherTabFunc}
                          increaseChangeCount={increaseChangeCount}
                        />
                      </Tab>

                      {hideOtherTabs ? null : (
                        <Tab
                          eventKey={"clientCaseResearchs"}
                          title={"Case Research(s)"}
                        >
                          <ClientCaseResearchs clientCase={cCase} />
                        </Tab>
                      )}

                      <Tab eventKey={"caseEvents"} title={"List of Events"}>
                        <CaseEvents clientCase={cCase} />
                      </Tab>
                      {/* {hideOtherTabs ? null : (
                        <Tab
                          eventKey={"clientCaseLmtJridctn"}
                          title={"Limitation & Jurisdiction(s)"}
                        >
                          <ClientCaseDocForms
                            clientCase={cCase}
                            type={"landj"}
                            increaseChangeCount={increaseChangeCount}
                          />
                        </Tab>
                      )} */}
                      {hideOtherTabs ? null : (
                        <Tab eventKey={"clientCaseDrftngDF"} title={"Drafting"}>
                          <ClientCaseDocForms
                            clientCase={cCase}
                            type={"drftng"}
                            increaseChangeCount={increaseChangeCount}
                          />
                        </Tab>
                      )}
                      {hideOtherTabs ? null : (
                        <Tab
                          eventKey={"clientCaseOtherDF"}
                          title={"External Record(s)"}
                        >
                          <ClientCaseDocForms
                            clientCase={cCase}
                            type={"othr"}
                            increaseChangeCount={increaseChangeCount}
                          />
                        </Tab>
                      )}
                      {hideOtherTabs ? null : (
                        <Tab eventKey={"filledDFs"} title={"Filled Documents"}>
                          <ClientCaseFilledDocForms
                            clientCase={cCase}
                            changeCount={changeCount}
                          />
                        </Tab>
                      )}

                      <Tab eventKey={"caseBills"} title={"Billing/Payment"}>
                        <CaseBills clientCase={cCase} selectedClient={client} />
                      </Tab>

                      <Tab eventKey={"caseDiary"} title={"Case Hearing Diary"}>
                        <CaseDiary clientCase={cCase} />
                      </Tab>

                      <Tab
                        eventKey={"relatedJudgment"}
                        title={"Related Judgment"}
                      >
                        <CaseRelatedJudgements clientCase={cCase} />
                      </Tab>

                      {/* <Tab eventKey={"caselaw"} title={"Case Law"}>
                        <CaseLaws clientCase={cCase} />
                      </Tab> */}
                      {/* <Tab eventKey={"scarpBook"} title={"Scrap Book"}>
                        <CaseNotes clientCase={cCase} />
                      </Tab> */}

                      {/* {hideOtherTabs ? null : (
                        <Tab eventKey={"feeCal"} title={"Fee Calculator"}>
                          <FeeCalculator clientCase={cCase} />
                        </Tab>
                      )} */}

                      {/* <Tab eventKey={"propertyChain"} title={"List of Events"}>
                        <CaseEvents clientCase={cCase} />
                      </Tab> */}
                    </Tabs>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- /page content --> */}
          <Footer />
        </div>
      </div>
    </Suspense>
  );
};

export default ClientCaseShow;
