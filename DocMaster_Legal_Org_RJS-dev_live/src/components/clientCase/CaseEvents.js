import { useEffect, useState, Suspense, lazy, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";
import ReactToPrint from "react-to-print";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import userStore from "../../zustand/userStore";
import {
  WsGetCaseEvents,
  WsGetCaseEventsNew,
  WsRemoveCaseEvent,
} from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";
import { changeDateFormat } from "../../OtherFunctions/OtherFunctions";
import CreateNote from "../stickyNotes/createNote";
import { useDispatch } from "react-redux";
import { fetchStickyNotesByCaseId } from "../stickyNotes/stickyNotesApi";
import moment from "moment";

const AllFeatureDataTable = lazy(() =>
  import("../../GuiComponents/AllFeatureDataTable.table")
);
const CaseNotes = lazy(() => import("../../components/clientCase/CaseNotes"));

const PutCaseEvent = lazy(() => import("./PutCaseEvent"));

const ClientCaseEvents = (props) => {
  const location = useLocation();
  const cCase = location?.state?.clientCase;
  const userData = userStore((state) => state.user);
  const dispatch = useDispatch();
  const [showPutCaseEventModal, setShowPutCaseEventModal] = useState(false);
  const [showPutAddNoteModal, setShowPutAddNoteModal] = useState(false);
  const [showCaseEventsPrintModal, setShowCaseEventsPrintModal] =
    useState(false);
  const componentToPrintRef = useRef(null);
  const [caseEvent, setCaseEvent] = useState();

  const [caseEvents, setCaseEvents] = useState([]);
  const [dataError, setDataError] = useState();
  const [openNote, setOpenNote] = useState(false);
  const tableColumns = [
    {
      Header: "S. No",
      accessor: "sno",
    },
    {
      Header: "Date",
      accessor: "dateTime",
    },
    {
      Header: "Detail",
      accessor: "detail",
    },
    {
      Header: "Action(s)",
      accessor: "actiontd",
    },
  ];

  useEffect(
    function () {
      dispatch(
        fetchStickyNotesByCaseId({ caseId: props.clientCase.id, type: null })
      );
    },
    [props.clientCase.id]
  );

  useEffect(
    function () {
      if (props.getNotes) {
        getNotes("events");
      }
    },
    [props.getNotes]
  );

  const getNotes = (type) => {
    const loaderId = toast.success("Loading...", { autoClose: false });
    dispatch(
      fetchStickyNotesByCaseId({
        caseId: props.clientCase.id,
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

  useEffect(() => {
    if (
      userData != null &&
      userData != undefined &&
      userData.isLoggedIn != undefined &&
      userData.isLoggedIn
    ) {
      getClientCaseEvents();
    } else {
      window.location.href = "/";
    }
  }, []);

  const getClientCaseEvents = () => {
    setDataError();
    // /{caseId}/{orgId}/{userId}
    setCaseEvents();
    axios
      .get(
        // WsGetCaseEvents +
        WsGetCaseEventsNew +
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
        if (responseData.resultCode === 1) {
          // const modifiedData = responseData.resultMessage.map((each) => {
          //   each.dateTime = changeDateFormat(each.dateTime.split(" ")[0]);
          //   return each;
          // });

          const modifiedData = responseData.resultMessage.map((each) => {
            return {
              ...each,
              dateTime: moment(
                each.dateTime.split(" ")[0],
                "YYYY-MM-DD"
              ).format("DD-MM-YYYY"),
            };
          });

          modifiedData.sort((a, b) =>
            moment(a.dateTime, "DD-MM-YYYY").diff(
              moment(b.dateTime, "DD-MM-YYYY")
            )
          );

          setCaseEvents(processCaseEvents(modifiedData));
        } else {
          //   alert(" Client Case DocForms: " + responseData.resultMessage);
          // setErrorMsg(responseData.resultMessage);
        }
        setDataError(responseData.resultMessage);
      })
      .catch((error) => {
        console.error("error", error);
        // setErrorMsg("Error while processing");
      });
  };

  const processCaseEvents = (simpleDataArray) => {
    simpleDataArray.map((simpleData, index) => {
      simpleData["sno"] = index + 1;

      simpleData["actiontd"] = (
        <>
          <i
            className="fa fa-pencil mx-2"
            title="Edit"
            style={{ color: "blue", cursor: "pointer" }}
            aria-hidden="true"
            onClick={() => editCaseEvent(simpleData)}
          />
          <i
            className="fa fa-trash mx-2"
            title="Delete"
            style={{ color: "red", cursor: "pointer" }}
            aria-hidden="true"
            onClick={() => deleteThisCaseEvent(simpleData)}
          />
        </>
      );
    });
    return simpleDataArray;
  };

  const editCaseEvent = (caseEvent) => {
    if (
      window.confirm("Sure to Edit this '" + caseEvent.detail + "' Event") ==
      true
    ) {
      let tempCaseEvent = { ...caseEvent };
      delete tempCaseEvent["actiond"];
      setCaseEvent(tempCaseEvent);
      setShowPutCaseEventModal(true);
    }
  };

  const deleteThisCaseEvent = (caseEvent) => {
    // console.log("deleteThisFileForMerge_fileFOrMerge", caseEvent);
    if (
      window.confirm("Sure to delete this '" + caseEvent.detail + "' Event") ==
      true
    ) {
      proceedToDeleteThisCaseEvent(caseEvent.id);
    }
  };

  function proceedToDeleteThisCaseEvent(caseEventId) {
    console.log(
      "proceedToDeleteThisCaseEvent_params",
      JSON.stringify({
        id: caseEventId,
        userId: userData.id,
        orgId: userData.org.id,
      })
    );
    axios
      .post(
        WsRemoveCaseEvent,
        JSON.stringify({
          id: caseEventId,
          userId: userData.id,
          orgId: userData.org.id,
        }),
        {
          headers: apiKeyHeader(),
        }
      )
      .then((response) => {
        const responseData = response.data;
        console.log("proceedToDelete_responseData", responseData);
        if (responseData.resultCode === 1) {
          getClientCaseEvents();
        } else {
          toast.error(responseData.resultMessage, {
            position: "top-center",
            autoClose: 1800,
          });
          //   setErrorMsg(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("proceedToDelete_error", error);
        // setErrorMsg("Error while processing");
      });
  }

  const onPutCaseEvent = (flag) => {
    setCaseEvent();
    if (flag) {
      getClientCaseEvents();
    }
    setShowPutCaseEventModal(false);
  };

  const onPutNote = () => {
    setShowPutAddNoteModal(false);
  };
  // function openMenu() {
  //   setOpenNote(true);
  // }
  function openMenu() {
    setOpenNote((prevState) => !prevState);
  }

  return (
    <Suspense fallback={<>Loading...</>}>
      <div className="row">
        <div className="col-12"></div>
        {openNote ? (
          <CaseNotes clientCase={props.clientCase} setOpenNote={setOpenNote} />
        ) : (
          <>
            <div className="col-6 pt-2">
              {!showPutCaseEventModal ? (
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => setShowPutCaseEventModal(true)}
                >
                  <i
                    className="fa fa-plus"
                    title="Add"
                    style={{
                      fontSize: "16px",
                    }}
                    aria-hidden="true"
                  />{" "}
                  Add Event
                </button>
              ) : null}
            </div>
            <div className="col-6 pt-2 text-end">
              {showPutCaseEventModal ? (
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => {
                    setShowPutCaseEventModal(false);
                    setCaseEvent();
                  }}
                >
                  <i
                    className="fa fa-times"
                    title="Close"
                    style={{
                      fontSize: "16px",
                    }}
                    aria-hidden="true"
                  />
                </button>
              ) : null}
              {caseEvents && caseEvents.length > 0 ? (
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => {
                    setShowCaseEventsPrintModal(true);
                  }}
                >
                  <i
                    className="fa fa-print"
                    title="Print Preview"
                    data-tooltip-content={"Print Preview"}
                    data-tooltip={"Print Preview"}
                    style={{
                      fontSize: "16px",
                    }}
                    aria-hidden="true"
                  />
                </button>
              ) : null}
              <button className="btn btn-sm btn-primary" onClick={openMenu}>
                <b>{openNote ? "Close" : "Open Notes"}</b>
              </button>
            </div>

            <div className="col-12">
              {showPutAddNoteModal && (
                <CreateNote
                  clientCase={props.clientCase}
                  onPutNote={onPutNote}
                />
              )}
              {/* {!showPutAddNoteModal && notes.length > 0 && (
            <div className="table-responsive">
              <AllFeatureDataTable columns={NoteTableColumns} data={notes} />
            </div>s
            )} */}
              {showPutCaseEventModal ? (
                <>
                  <PutCaseEvent
                    caseEvent={caseEvent}
                    onPutCaseEvent={onPutCaseEvent}
                    clientCase={props.clientCase}
                  />
                </>
              ) : (
                <>
                  {caseEvents && caseEvents.length > 0 ? (
                    <>
                      <Modal
                        transparent={false}
                        ariaHideApp={false}
                        isOpen={showCaseEventsPrintModal}
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
                        <div>
                          <div className="d-flex justify-content-between">
                            <ReactToPrint
                              documentTitle="LeOrgDocMaster_Print"
                              pageStyle={`
                                @media print {
                                  @page {
                                    size: A4;
                                    margin: 0 50px 0 50px !important; 
                                    padding:50px 0!important;
                                  }
                                  body {
                                    -webkit-print-color-adjust: exact;
                                    margin: 0;
                                    padding: 0;
                                   
                                  }
                                }
                              `}
                              trigger={() => {
                                // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
                                // to the root node of the returned component as it will be overwritten.
                                return (
                                  <button className="no_print btn btn-outline-primary mb-3">
                                    <i
                                      className="fa fa-print"
                                      aria-hidden="true"
                                    ></i>{" "}
                                    Print
                                  </button>
                                );
                              }}
                              content={() => componentToPrintRef.current}
                            />
                            <span>
                              <button
                                className="btn btn-danger"
                                onClick={() => {
                                  setShowCaseEventsPrintModal(false);
                                }}
                              >
                                Close
                              </button>
                            </span>
                          </div>
                          <div className="table-responsive table-container">
                            <table
                              className="table"
                              id="contentToPrint"
                              ref={componentToPrintRef}
                            >
                              <thead>
                                <tr>
                                  <th>S. No</th>
                                  <th>Date</th>
                                  <th>Detail</th>
                                </tr>
                              </thead>
                              <tbody>
                                {caseEvents.map((caseEvent, index) => (
                                  <tr key={caseEvent.id}>
                                    <td scope="row">{index + 1}</td>
                                    <td>{caseEvent.dateTime}</td>
                                    <td>{caseEvent.detail}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </Modal>
                      <AllFeatureDataTable
                        columns={tableColumns}
                        data={caseEvents}
                      />
                    </>
                  ) : null}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </Suspense>
  );
};

export default ClientCaseEvents;
