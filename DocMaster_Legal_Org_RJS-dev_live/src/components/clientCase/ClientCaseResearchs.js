//ClientCaseResearchs
import { useEffect, useState, Suspense, lazy, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Modal from "react-modal";
import axios from "axios";
import ReactSelect from "react-select";
import {
  WsGetClientCaseResearches,
  WsPutClientCaseResearchMap,
  WsGetOrgResearchSubjects,
  WsRemoveClientCaseResearchMap,
  WsPutClientCaseResearchMapNew,
  WsGetClientCaseResearchesNew,
} from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";

import userStore from "../../zustand/userStore";
import { Padding } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { fetchStickyNotesByCaseId } from "../stickyNotes/stickyNotesApi";
import { changeCreateNoteWindow } from "../stickyNotes/StickyNotesSlice";
const CreateResearch = lazy(() =>
  import("../../components/researchs/CreateResearchSubject")
);
const ClientCaseResearchs = (props) => {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = userStore((state) => state.user);
  const [caseResearches, setCaseResearches] = useState([]);
  const [createResearchType, setCreateResearchType] = useState();
  const [orgResearches, setOrgResearches] = useState([]);
  const [showCreateResearchFormModal, setShowCreateResearchFormModal] =
    useState(false);

  const [errorMsg, setErrorMsg] = useState();
  useEffect(() => {
    getClientCaseResearches();
    getOrgResearchs();
  }, []);

  const getOrgResearchs = () => {
    axios
      .get(
        WsGetOrgResearchSubjects + "/" + userData.org.id + "/" + userData.id,
        {
          headers: apiKeyHeader(),
        }
      )
      .then((response) => {
        const responseData = response.data;
        console.log("responseData", responseData);
        if (responseData.resultCode == 1) {
          setOrgResearches(processOrgResearches(responseData.resultMessage));
        } else {
          alert("Org Researches: " + responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("error", error);
        // this.setState({ errorMsg: "Error while getting data" });
      });
  };

  const processOrgResearches = (simpleDataArray) => {
    simpleDataArray.map((simpleData, index) => {
      simpleData["sno"] = index + 1;
      simpleData["label"] = simpleData.subject;
      simpleData["value"] = simpleData.id;
      simpleData["isApproved"] =
        simpleData.approvedLevel < 0
          ? "Not Approved"
          : simpleData.approvedLevel;
    });
    return simpleDataArray;
  };

  const getClientCaseResearches = () => {
    setErrorMsg();
    axios
      .get(
        // WsGetClientCaseResearches +
        WsGetClientCaseResearchesNew +
          "/" +
          props.clientCase.id +
          "/" +
          userData.org.id +
          "/" +
          userData.id,
        {
          headers: apiKeyHeader(),
        }
      )
      .then((response) => {
        const responseData = response.data;
        console.log("GetResearchs_responseData", responseData);
        if (responseData.resultCode === 1) {
          //   setCaseResearches(processCaseResearches(responseData.resultMessage));
          setCaseResearches(responseData.resultMessage);
        } else {
          // alert("Client Case Researches: " + responseData.resultMessage);
          setErrorMsg("Client Case Researches: " + responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("error", error);
        // setErrorMsg("Error while processing");
      });
  };

  const onCreateResearchReturn = (researchSubjectId) => {
    /*
     * Long researchId;
     * Long caseId;
     * Long userId;
     */
    axios
      .post(
        // WsPutClientCaseResearchMap,
        WsPutClientCaseResearchMapNew,
        JSON.stringify({
          researchId: researchSubjectId,
          caseId: props.clientCase.id,
          userId: userData.id,
        }),
        {
          headers: apiKeyHeader(),
        }
      )
      .then((response) => {
        const responseData = response.data;
        console.log("onCreateResearchReturn_responseData", responseData);
        if (responseData.resultCode === 1) {
          getClientCaseResearches();
          setCreateResearchType();
          setShowCreateResearchFormModal(false);
        } else {
          alert(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("error", error);
        // setErrorMsg("Error while processing");
      });
  };

  const proceed2Continue = (researchSubject) => {
    console.log("researchSubject", researchSubject);
    // delete researchSubject["actiontd"]; //Bug(If Not Using): Point To Be Notted
    navigate("/myResearchSubject", {
      state: {
        subject: researchSubject,
        clientCase: props.clientCase,
      },
    });
  };

  const removeCaseResearch = (caseResearch) => {
    if (
      window.confirm(
        "Sure to remove Research '" +
          caseResearch.researchSubject.subject +
          "' from Case"
      ) == true
    ) {
      proceedRemoveCaseDocform(caseResearch);
    }
  };

  const proceedRemoveCaseDocform = (caseResearch) => {
    axios
      .post(
        WsRemoveClientCaseResearchMap,
        JSON.stringify({
          id: caseResearch.id,
          userId: userData.id,
        }),
        {
          headers: apiKeyHeader(),
        }
      )
      .then((response) => {
        const responseData = response.data;
        if (responseData.resultCode === 1) {
          removeFromResearchDocFormsArray(caseResearch);
        } else {
          alert(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("error", error);
      });
  };

  const removeFromResearchDocFormsArray = (caseResearchVar) => {
    setCaseResearches(
      caseResearches.filter((caseResearch) => {
        return caseResearch.id !== caseResearchVar.id;
      })
    );
  };

  return (
    <Suspense fallback={<>Loading...</>}>
      
      <div >
        {/* <span
          style={{
            fontSize: "14px",
            cursor: "pointer",
            color: "blue",
            textDecoration: "underline",
          }}
          onClick={handleViewNotes}
        >
          View Notes
        </span> */}
        <div className="d-flex justify-content-between">  
        <h4 className="mb-0" style={{fontSize:'1rem'}} >
          Client Case Researches
          <button className="btn btn-sm  btn-outline-primary mx-3">
          <i
            className="fa fa-plus mx-2"
            title="Create"
             
            aria-hidden="true"
            onClick={() => {
              setCreateResearchType("new");
              setShowCreateResearchFormModal(true);
            }}
          />
          </button>
          {/* <button className="btn btn-sm btn-outline-primary">
          <i
            className="fa fa-link mx-2"
            title="Link "
            aria-hidden="true"
            onClick={() => {
              setCreateResearchType("lnk");
              setShowCreateResearchFormModal(true);
            }}
          />
          </button> */}
        </h4>
        <button  className="btn btn-sm btn-primary"
          onClick={() => {
            dispatch(
              changeCreateNoteWindow({
                noteWindow: true,
                clientCase: { ...props.clientCase, type: "research" },
              })
            );
          }}
        >
          <b>Create Note</b>
        </button>
        </div>
        {errorMsg != undefined ? <i>{errorMsg}</i> : null}
        {showCreateResearchFormModal ? (
          <Modal
            transparent={false}
            ariaHideApp={false}
            isOpen={showCreateResearchFormModal}
            style={{
              overlay: {
                width: "100vw",
                top: "0%",
                zIndex: 9999,
              },
              content: {
                left: "4%",
                width: "90vw",
              },
            }}
          >
            <button
              className="btn btn-danger"
              style={{ position: "absolute", top: 5, right: 5 }}
              onClick={() => {
                setShowCreateResearchFormModal(false);
              }}
            >
              Close
            </button>
            <br />
            <div>
              {createResearchType == "lnk" ? (
                <>
                  <h5>Link research for client case</h5>
                  <ReactSelect
                    options={orgResearches}
                    onChange={(orgResearch) => {
                      console.log("handleUsersReactSelectChanges", orgResearch);
                      onCreateResearchReturn(orgResearch.id);
                    }}
                    // ref={docFormRef}
                    isMulti={false}
                    //   defaultValue={{}}
                  />
                </>
              ) : (
                <>
                  <h5>Create research for client case</h5>
                  <CreateResearch
                    onReturn={onCreateResearchReturn}
                    typeToMatch={props?.clientCase?.caseType.type}
                  />
                  {/* <CreateResearch onReturn={onCreateResearchReturn} typeToMatch={"legal"}/> */}
                  {/* // */}
                </>
              )}
            </div>
          </Modal>
        ) : null}

        {caseResearches && caseResearches.length > 0 ? (
          <div className="table-responsive table-container"> 
          <table className="table">
            <thead>
              <tr>
                <th>S. No</th>
                <th>Research Subject</th>
                <th>Action(s)</th>
              </tr>
            </thead>
            <tbody>
              {caseResearches != undefined &&
                caseResearches.map((caseResearch, index) => {
                  return (
                    <tr key={caseResearch.id + "caseResearches"}>
                      <td>{index + 1}</td>
                      <td>{caseResearch.researchSubject.subject}</td>
                      <td>
                        {caseResearch.researchSubject.approvedLevel >= 0 ? (
                          <i
                            className="fa fa-arrows mx-2"
                            title="Proceed for Research"
                            style={{ color: "#1c46f2", cursor: "pointer" }}
                            aria-hidden="true"
                            onClick={() =>
                              proceed2Continue(caseResearch.researchSubject)
                            }
                          />
                        ) : (
                          <>
                            {caseResearch.researchSubject.needAprvl == 0
                              ? "Initial Approval Needed to Continue"
                              : "Can Continue after Approval"}
                          </>
                        )}
                        <i
                          className="fa fa-trash mx-2"
                          title="Remove this"
                          style={{ color: "red", cursor: "pointer" }}
                          aria-hidden="true"
                          onClick={() => removeCaseResearch(caseResearch)}
                        />
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          </div>
        ) : null}
      </div>
    </Suspense>
  );
};

export default ClientCaseResearchs;
