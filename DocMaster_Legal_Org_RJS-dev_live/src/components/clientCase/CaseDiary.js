import { useEffect, useState, Suspense, lazy, useRef } from "react";
import axios from "axios";
import Modal from "react-modal";
import ReactToPrint from "react-to-print";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import userStore from "../../zustand/userStore";
import {
  scheduleTemplate,
  WsGetCaseDiary,
  WsGetCaseDiaryNew,
  WsRemoveCaseDiary,
  WsRemoveCaseDiaryNew,
} from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";
import {
  addDaysToDate,
  changeDateFormat,
} from "../../OtherFunctions/OtherFunctions";
import SchedulePopup from "./schedulePopup";
import { useAlertMessages } from "../../customHooks/caseDiaryHook";
import { changeCreateNoteWindow } from "../stickyNotes/StickyNotesSlice";
import { useDispatch } from "react-redux";
import { fetchStickyNotesByCaseId } from "../stickyNotes/stickyNotesApi";
import PrintDataTable from "../../GuiComponents/PrintDataTable";

const AllFeatureDataTable = lazy(() =>
  import("../../GuiComponents/AllFeatureDataTable.table")
);

const PutCaseDiary = lazy(() => import("./PutCaseDiary"));

const ClientCaseDiary = (props) => {
  const userData = userStore((state) => state.user);
  const dispatch = useDispatch();
  const { isLoading, alertMessages, error } = useAlertMessages();
  const [showPutCaseDiaryModal, setShowPutCaseDiaryModal] = useState(false);
  const [showCaseDiaryPrintModal, setShowCaseDiaryPrintModal] = useState(false);
  const componentToPrintRef = useRef(null);
  const [caseDiary2Edit, setCaseDiary2Edit] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [modal, setModal] = useState(false);
  const [selectedSchDiary, setSelectedScheDiary] = useState(null);

  const [caseDiary, setCaseDiary] = useState([]);
  const [lastCaseDiary, setLastCaseDairy] = useState(null);
  const [previousCaseDiaries, setPreviousCaseDiaries] = useState([]);
  const [dataError, setDataError] = useState();

  const displayField = isEditing ? caseDiary.length > 1 : caseDiary.length > 0;

  const lastRecord = caseDiary.find(
    (each) => each.heading === "Final Decision"
  );

  const tableColumns =
    props.clientCase.caseStatus === 0 || lastRecord !== undefined
      ? [
          {
            Header: "S. No",
            accessor: "sno",
          },
          {
            Header: "Last Date of Action/Hearing",
            accessor: "dateTimeTxt",
          },
          {
            Header: "Purpose of Action/Hearing",
            accessor: "interimOrder",
          },
          {
            Header: "Outcome of Action/Hearing",
            accessor: "heading",
          },
          {
            Header: "Attendee",
            accessor: "attende",
          },
          {
            Header: "Remarks",
            accessor: "alertMessage",
          },
          {
            Header: "Action(s)",
            accessor: "actiontd",
          },
        ]
      : caseDiary?.length > 1
      ? [
          {
            Header: "S. No",
            accessor: "sno",
          },
          {
            Header: "Hearing Date",
            accessor: "dateTimeTxt",
          },
          {
            Header: "Purpose of Current Action/Hearing",
            accessor: "interimOrder",
          },
          {
            Header: "Outcome",
            accessor: "heading",
          },
          {
            Header: "Attendee",
            accessor: "attende",
          },
          {
            Header: "Next Date of Action/Hearing",
            accessor: "nextdate",
          },
          {
            Header: "Purpose of Next Action/Hearing",
            accessor: "particulars",
          },
          {
            Header: "Remarks",
            accessor: "alertMessage",
          },
          {
            Header: "Action(s)",
            accessor: "actiontd",
          },
        ]
      : [
          {
            Header: "S. No",
            accessor: "sno",
          },
          // {
          //   Header: "Attendee",
          //   accessor: "attende",
          // },
          {
            Header: "Next Date of Action/Hearing",
            accessor: "nextdate",
          },
          {
            Header: "Purpose of Action/Hearing",
            accessor: "particulars",
          },
          {
            Header: "Remarks",
            accessor: "alertMessage",
          },
          {
            Header: "Action(s)",
            accessor: "actiontd",
          },
        ];

  if (error) toast.error("Error getting alert Messages", { autoClose: 3000 });

  useEffect(() => {
    if (
      userData != null &&
      userData != undefined &&
      userData.isLoggedIn != undefined &&
      userData.isLoggedIn
    ) {
      if (alertMessages !== undefined) getClientCaseDiary();
    } else {
      window.location.href = "/";
    }
  }, [alertMessages]);

  useEffect(
    function () {
      if (props.getNotes) {
        getNotes("caseDiary");
      }
    },
    [props.getNotes]
  );

  useEffect(
    function () {
      if (props.fromCalender) {
        setShowPutCaseDiaryModal(true);
        setIsAdding(true);
        setIsEditing(false);
      }
    },
    [props.fromCalender]
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    // Extract day, month, and year
    const day = String(date.getDate()).padStart(2, "0"); // Ensures two-digit day
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();

    return `${day} -${month} -${year}`;
  };

  const getClientCaseDiary = () => {
    setDataError();
    // /{caseId}/{orgId}/{userId}
    setCaseDiary([]);
    axios
      .get(
        // WsGetCaseDiary +
        WsGetCaseDiaryNew +
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
          setCaseDiary(processCaseDiary(responseData.resultMessage));
          setLastCaseDairy(processCaseDiary(responseData.resultMessage)[0]);
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

  const formatToInputDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const processCaseDiary = (simpleDataArray) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sortedArray = simpleDataArray.sort(
      (a, b) => new Date(b.dateTime) - new Date(a.dateTime)
    );

    return simpleDataArray.map((simpleData, index) => {
      const nextDate = new Date(simpleData.nextdate);
      const isPastDate = nextDate < today;

      let alertMessage = "N/A";

      if (simpleData.legalDeadlineDate && simpleData.remarks) {
        alertMessage = `${simpleData.legalDeadlineDate} - ${simpleData.remarks}`;
      }
      if (
        simpleData.legalDeadlineDate === null ||
        simpleData.legalDeadlineDate === "null"
      ) {
        alertMessage = simpleData.remarks;
      }

      return {
        ...simpleData,
        sno: sortedArray.length - index,
        nextdate: changeDateFormat(nextDate),
        dateTimeTxt: simpleData?.dateTime
          ? changeDateFormat(
              simpleData.dateTime.substring(0, simpleData.dateTime.length - 9)
            )
          : "N/A",
        isPastDate: isPastDate,
        alertMessage: alertMessage || "N/A",
        actiontd: (
          <>
            <i
              className="fa fa-pencil mx-2"
              title="Edit"
              style={{ color: "blue", cursor: "pointer" }}
              aria-hidden="true"
              onClick={() => editCaseDiary(simpleData)}
            />
            <i
              className="fa fa-trash mx-2"
              title="Delete"
              style={{ color: "red", cursor: "pointer" }}
              aria-hidden="true"
              onClick={() => deleteThisCaseDiary(simpleData)}
            />
          </>
        ),
      };
    });
  };

  // const processCaseDiary = (simpleDataArray) => {
  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0);
  //   const sortedArray = simpleDataArray.sort(
  //     (a, b) => new Date(b.dateTime) - new Date(a.dateTime)
  //   );

  //   return simpleDataArray.map((simpleData, index) => {
  //     const nextDate = new Date(simpleData.nextdate);
  //     const isPastDate = nextDate < today;
  //     const alertMessage = alertMessages?.find(
  //       (each) => each.alert_field_value === simpleData.particulars
  //     );
  //     const isValidDateTime = (dateTime) => {
  //       return (
  //         dateTime &&
  //         dateTime !== "0000-00-00 00:00:00" &&
  //         !isNaN(new Date(dateTime).getTime())
  //       );
  //     };

  //     const legalDate = isValidDateTime(simpleData.dateTime)
  //       ? alertMessage?.days
  //         ? addDaysToDate(
  //             formatToInputDate(simpleData.dateTime),
  //             alertMessage.days
  //           )
  //         : null
  //       : null;
  //     // const legalDate = alertMessage?.days
  //     //   ? addDaysToDate(
  //     //       formatToInputDate(simpleData.dateTime),
  //     //       alertMessage.days
  //     //     )
  //     //   : null;

  //     return {
  //       ...simpleData,
  //       sno: sortedArray.length - index,
  //       nextdate: changeDateFormat(nextDate),
  //       dateTimeTxt: simpleData?.dateTime
  //         ? changeDateFormat(
  //             simpleData.dateTime.substring(0, simpleData.dateTime.length - 9)
  //           )
  //         : "N/A",
  //       isPastDate: isPastDate,

  //       alertMessage: alertMessage
  //         ? ` ${legalDate != null ? `${legalDate} -` : ""} ${
  //             alertMessage.alert_message
  //           }`
  //         : "N/A",

  //       // alertMessage: alertMessage
  //       //   ? `${legalDate} - ${alertMessage.alert_message}`
  //       //   : "N/A",

  //       // alertMessage: alertMessage ? (
  //       //   <span className="blinking-box">
  //       //     <p className="blinking-text">
  //       //       {legalDate} - {alertMessage.alert_message}
  //       //     </p>
  //       //   </span>
  //       // ) : (
  //       //   "N/A"
  //       // ),
  //       actiontd: (
  //         <>
  //           <i
  //             className="fa fa-pencil mx-2"
  //             title="Edit"
  //             style={{ color: "blue", cursor: "pointer" }}
  //             aria-hidden="true"
  //             onClick={() => editCaseDiary(simpleData)}
  //           />
  //           {/* <i
  //             className="fa fa-whatsapp mx-2"
  //             title="Post Data"
  //             style={{ color: "green", cursor: "pointer" }}
  //             aria-hidden="true"
  //             onClick={() => handlePostRequest(simpleData)}
  //           /> */}
  //           {/* <Schedule
  //             style={{ fontSize: 15, color: "#555", cursor: "pointer" }}
  //             onClick={() => {
  //               setModal((prev) => !prev);
  //               setSelectedScheDiary({
  //                 ...simpleData,
  //                 dateTimeTxt: simpleData?.dateTime
  //                   ? changeDateFormat(
  //                       simpleData.dateTime.substring(
  //                         0,
  //                         simpleData.dateTime.length - 9
  //                       )
  //                     )
  //                   : "N/A",
  //               });
  //             }}
  //           />  */}
  //           <i
  //             className="fa fa-trash mx-2"
  //             title="Delete"
  //             style={{ color: "red", cursor: "pointer" }}
  //             aria-hidden="true"
  //             onClick={() => deleteThisCaseDiary(simpleData)}
  //           />
  //         </>
  //       ),
  //     };
  //   });
  // };

  const editCaseDiary = (caseDiary) => {
    if (
      window.confirm("Sure to Edit this '" + caseDiary.heading + "' Diary") ==
      true
    ) {
      let tempCaseDiary = { ...caseDiary };
      delete tempCaseDiary["actiond"];
      setCaseDiary2Edit(tempCaseDiary);
      setShowPutCaseDiaryModal(true);
      setIsAdding(false);
      setIsEditing(true);
    }
  };

  const deleteThisCaseDiary = (caseDiary) => {
    // console.log("deleteThisFileForMerge_fileFOrMerge", caseDiary);
    if (
      window.confirm("Sure to delete this '" + caseDiary.heading + "' Diary") ==
      true
    ) {
      proceedToDeleteThisCaseDiary(caseDiary.id);
    }
  };

  function proceedToDeleteThisCaseDiary(caseDiaryId) {
    axios
      .post(
        // WsRemoveCaseDiary,
        WsRemoveCaseDiaryNew,
        JSON.stringify({
          id: caseDiaryId,
          userId: userData.id,
          orgId: userData.org.id,
        }),
        {
          headers: apiKeyHeader(),
        }
      )
      .then((response) => {
        const responseData = response.data;
        if (responseData.resultCode === 1) {
          getClientCaseDiary();
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

  const onPutCaseDiary = (flag) => {
    if (flag && props.fromCalender) {
      props.handleCalenderApiCalls();
    } else {
      setCaseDiary2Edit();
      if (flag) {
        getClientCaseDiary();
      }
      setShowPutCaseDiaryModal(false);
    }
  };

  useEffect(
    function () {
      if (caseDiary?.length > 0) {
        const latestDiary = caseDiary.sort((a, b) => a.id - b.id).at(-1);
        setLastCaseDairy(latestDiary);

        const previousDiaries = caseDiary.sort((a, b) => a.id - b.id).slice(-3);
        setPreviousCaseDiaries(previousDiaries);
      }
      if (caseDiary.length === 0) {
        setPreviousCaseDiaries([]);
        setLastCaseDairy(null);
      }
    },
    [caseDiary]
  );

  const handlePostRequest = (simpleData) => {
    const body = {
      username: userData.name,
      phoneNumber: userData.mobile_no,
      templateName: "testing_deployement",
      scheduledDate: simpleData.nextdate,
      frequency: "once",
    };
    const loader = toast.success("Loading...", { autoClose: false });
    axios
      .post(scheduleTemplate, JSON.stringify(body), {
        headers: apiKeyHeader(),
      })
      .then(async (response) => {
        const responseData = response.data;
        await toast.dismiss(loader);
        toast.success(responseData.message, { autoClose: 3000 });
      })
      .catch(async (error) => {
        console.error("API Error:", error);
        await toast.dismiss(loader);
        toast.error("Error Scheduling Whatsapp");
      });
  };

  if (isLoading) return <div>isLoading..</div>;

  return (
    <Suspense fallback={<>Loading...</>}>
      <div className="row ms-0 me-0 ">
        {modal && (
          <SchedulePopup
            selectedSchDiary={selectedSchDiary}
            onClose={setModal}
          />
        )}
        {showPutCaseDiaryModal &&
          previousCaseDiaries.length > 0 &&
          !props.fromCalender && (
            <PreviousCaseDiariesTable
              previousCaseDiaries={previousCaseDiaries}
              formatDate={formatDate}
            />
          )}
         
          {/* {props.clientCase.caseStatus === 1 && ( */}
          <div className="col-4 pt-2">
            {!showPutCaseDiaryModal ? (
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => {
                  setShowPutCaseDiaryModal(true);
                  setIsAdding(true);
                  setIsEditing(false);
                }}
              >
                <i
                  className="fa fa-plus "
                  title="Add"
                  style={{
                    color: "#1c46f2",
                    cursor: "pointer",
                    fontSize: "16px",
                  }}
                  aria-hidden="true"
                />{" "}
                Add
              </button>
            ) : null}
          </div>
          {/*  )} */}
          <div className="col-8 pt-2 text-end mb-2">
            {showPutCaseDiaryModal ? (
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => {
                  setShowPutCaseDiaryModal(false);
                  //setCaseDiary2Edit();
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
            <>
              {!showPutCaseDiaryModal ? (
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => {
                    setShowCaseDiaryPrintModal(true);
                  }}
                >
                  <i
                    className="fa fa-print "
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
              {!props.fromCalender && (
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => {
                    dispatch(
                      changeCreateNoteWindow({
                        noteWindow: true,
                        clientCase: { ...props.clientCase, type: "caseDiary" },
                      })
                    );
                  }}
                >
                  <b>Create Note</b>
                </button>
              )}
            </>
          </div>
         

        {/* {showPutCaseDiaryModal && lastCaseDiary !== null && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              marginBottom: "10px",
            }}
          >
            <div style={{ display: "flex" }}>
              <strong>Previous Date of Hearing:</strong>
              <span>
                {lastCaseDiary.dateTime
                  ? formatDate(lastCaseDiary.dateTime)
                  : ""}
              </span>
            </div>
            <div style={{ display: "flex" }}>
              <strong>Previous Purpose of Hearing:</strong>
              <span>{lastCaseDiary.particulars}</span>
            </div>
            <div style={{ display: "flex" }}>
              <strong>Current Hearing Date:</strong>
              <span>{lastCaseDiary.nextdate}</span>
            </div>
            <div style={{ display: "flex" }}>
              <strong>Purpose of Hearing:</strong>
              <span>{lastCaseDiary.interimOrder}</span>
            </div>
            <div style={{ display: "flex" }}>
              <strong>Outcome of Hearing:</strong>
              <span>{lastCaseDiary.heading}</span>
            </div>
          </div>
        )} */}

        {/* {showPutCaseDiaryModal && previousCaseDiaries.length > 0 && (
          <table className="table">
            <thead>
              <tr>
                <th>Previous Date of Hearing</th>
                <th>Previous Purpose of Hearing</th>
                <th>Current Hearing Date</th>
                <th>Purpose of Hearing</th>
                <th>Outcome of Hearing</th>
              </tr>
            </thead>
            <tbody>
              {previousCaseDiaries.map((each, index) => (
                <tr key={index}>
                  <td>
                    {each.dateTime ? formatDate(lastCaseDiary.dateTime) : ""}
                  </td>
                  <td>{each.particulars}</td>
                  <td>{each.nextdate}</td>
                  <td>{each.interimOrder}</td>
                  <td>{each.heading}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )} */}

        <div className="col-12">
          {showPutCaseDiaryModal ? (
            <>
              <PutCaseDiary
                caseDiaryLength={caseDiary?.length}
                caseDiary={caseDiary2Edit}
                lastCaseDiary={caseDiary?.length > 0 ? lastCaseDiary : null}
                onPutCaseDiary={onPutCaseDiary}
                data={caseDiary}
                displayField={displayField}
                clientCase={props.clientCase}
                resultMessageLength={caseDiary ? caseDiary.length : 0}
                isEditing={isEditing}
                isAdding={isAdding}
                nextHearing={props.nextHearing}
              />
            </>
          ) : (
            <>
              {caseDiary && caseDiary.length > 0 ? (
                <>
                  <Modal
                    transparent={false}
                    ariaHideApp={false}
                    isOpen={showCaseDiaryPrintModal}
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
                      <div className="d-flex mb-3 justify-content-between">
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
                        <button
                          className="btn btn-danger"
                          onClick={() => {
                            setShowCaseDiaryPrintModal(false);
                          }}
                        >
                          Close
                        </button>
                      </div>

                      {/* <table
                        className="table"
                        id="contentToPrint"
                        ref={componentToPrintRef}
                      >
                        <thead>
                          <tr>
                            <th>S. No</th>
                            <th>Date of Hearing</th>
                            <th>Attendee</th>
                            <th>Next Date of Action/Hearing</th>
                            <th>Outcome</th>
                          </tr>
                        </thead>
                        <tbody>
                          {caseDiary.map((caseDiary, index) => {
                            const nextDate = new Date(caseDiary.nextdate);
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);

                            const isPastDate = nextDate < today;

                            return (
                              <tr key={caseDiary.id}>
                                <td scope="row">{index + 1}</td>
                                <td>{caseDiary.dateTimeTxt}</td>
                                <td>{caseDiary.attende}</td>
                                <td>{caseDiary.nextdate}</td>
                                <td>{caseDiary.heading}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table> */}
                      <PrintDataTable
                        columns={tableColumns}
                        data={caseDiary}
                        tableRef={componentToPrintRef}
                        deleteAccessor="actiontd"
                      />
                    </div>
                  </Modal>

                    <AllFeatureDataTable
                      columns={tableColumns}
                      data={caseDiary}
                    />
                </>
              ) : null}
            </>
          )}
        </div>
        <br />
        {showPutCaseDiaryModal &&
          previousCaseDiaries.length > 0 &&
          props.fromCalender && (
            <PreviousCaseDiariesTable
              previousCaseDiaries={previousCaseDiaries}
              formatDate={formatDate}
            />
          )}
      </div>
    </Suspense>
  );
};

const PreviousCaseDiariesTable = ({ previousCaseDiaries, formatDate }) => {
  return (
    <div className="col-12">
      <div className="table-responsive table-container"> 
      <table className="table">
        <thead>
          <tr>
            <th>Previous Date of Action/Hearing</th>
            <th>Purpose of Previous Action/Hearing</th>
            <th>Current Date of Action/Hearing</th>
            <th>Purpose of Current Action/Hearing</th>
            <th>Outcome of Hearing</th>
          </tr>
        </thead>
        <tbody>
          {previousCaseDiaries.map((each, index) => (
            <tr key={index}>
              <td>{each.dateTime ? formatDate(each.dateTime) : ""}</td>
              <td>{each.particulars}</td>
              <td>{each.nextdate}</td>
              <td>{each.interimOrder}</td>
              <td>{each.heading}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default ClientCaseDiary;
