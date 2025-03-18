import { useEffect, useState, Suspense, lazy, useRef } from "react";
import axios from "axios";
import Modal from "react-modal";
import ReactToPrint from "react-to-print";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import userStore from "../../zustand/userStore";
import {
  WsGetCaseBills,
  WsGetCaseBillsNew,
  WsRemoveCaseBill,
} from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";
import { changeDateFormat } from "../../OtherFunctions/OtherFunctions";

const AllFeatureDataTable = lazy(() =>
  import("../../GuiComponents/AllFeatureDataTable.table")
);

const PutCaseBill = lazy(() => import("./PutCaseBill"));
const CaseBillGenerate = lazy(() => import("./CaseBillGenerate"));
const ClientCaseBills = (props) => {
  const userData = userStore((state) => state.user);
  const [showPutCaseBillModal, setShowPutCaseBillModal] = useState(false);
  const [showCaseBillsPrintModal, setShowCaseBillsPrintModal] = useState(false);
  const componentToPrintRef = useRef(null);
  const [caseBill, setCaseBill] = useState();

  const [caseBill2Generate, setCaseBill2Generate] = useState();

  const [caseBills, setCaseBills] = useState([]);
  const [dataError, setDataError] = useState();
  const tableColumns = [
    {
      Header: "S. No",
      accessor: "sno",
    },
    {
      Header: "Nature of Transaction",
      accessor: "typeTxt",
    },
    {
      Header: "Title of the case",
      accessor: "sampleTxt",
    },
    {
      Header: "Amount (₹)",
      accessor: "amount",
      Cell: ({ value }) => (
        // <div style={{ textAlign: 'right' }}>
        <div>
          {value}.00
        </div>
      ), 
    },
    {
      Header: "Date",
      accessor: "dateTimeTxt",
    },
    {
      Header: "Action(s)",
      accessor: "actiontd",
    },
  ];

  useEffect(() => {
    if (
      userData != null &&
      userData != undefined &&
      userData.isLoggedIn != undefined &&
      userData.isLoggedIn
    ) {
      getClientCaseBills();
    } else {
      window.location.href = "/";
    }
  }, []);

  const getClientCaseBills = () => {
    setDataError();
    // WsGetCaseBillsNew
    // /{caseId}/{orgId}/{userId}
    setCaseBills();
    axios
      .get(
        WsGetCaseBillsNew +
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
        console.log("_responseData", responseData);
        if (responseData.resultCode === 1) {
          setCaseBills(processCaseBills(responseData.resultMessage));
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

  const processCaseBills = (simpleDataArray) => {
    simpleDataArray.map((simpleData, index) => {
      simpleData["sno"] = index + 1;
      simpleData["typeTxt"] = "";
      if (simpleData.type == "paid") {
        simpleData["typeTxt"] = "Amount Chargeable";
      }
      if (simpleData.type == "receive") {
        simpleData["typeTxt"] = "Amount Received";
      }

      simpleData["dateTimeTxt"] = changeDateFormat(
        simpleData?.dateTime.substring(0, simpleData?.dateTime.length - 9)
      );
      simpleData["sampleTxt"] = simpleData.paymentType;

      simpleData["actiontd"] = (
        <>
          <i
            className="fa fa-pencil mx-2"
            title="Edit"
            style={{ color: "blue", cursor: "pointer" }}
            aria-hidden="true"
            onClick={() => editCaseBill(simpleData)}
          />
          <i
            className="fa fa-suitcase mx-2"
            title="Generate Bill"
            style={{ color: "grey", cursor: "pointer" }}
            aria-hidden="true"
            onClick={() => generateCaseBill(simpleData)}
          />
          <i
            className="fa fa-trash mx-2"
            title="Delete"
            style={{ color: "red", cursor: "pointer" }}
            aria-hidden="true"
            onClick={() => deleteThisCaseBill(simpleData)}
          />
        </>
      );
    });
    return simpleDataArray;
  };

  const editCaseBill = (caseBill) => {
    if (
      window.confirm("Sure to Edit this '" + caseBill.detail + "' Bill") == true
    ) {
      let tempCaseBill = { ...caseBill };
      delete tempCaseBill["actiond"];
      setCaseBill(tempCaseBill);
      setShowPutCaseBillModal(true);
    }
  };

  const deleteThisCaseBill = (caseBill) => {
    // console.log("deleteThisFileForMerge_fileFOrMerge", caseBill);
    if (
      window.confirm("Sure to delete this '" + caseBill.detail + "' Bill") ==
      true
    ) {
      proceedToDeleteThisCaseBill(caseBill.id);
    }
  };

  function proceedToDeleteThisCaseBill(caseBillId) {
    console.log(
      "proceedToDeleteThisCaseBill_params",
      JSON.stringify({
        id: caseBillId,
        userId: userData.id,
        orgId: userData.org.id,
      })
    );
    axios
      .post(
        WsRemoveCaseBill,
        JSON.stringify({
          id: caseBillId,
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
          getClientCaseBills();
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

  // const onPutCaseBill = (flag) => {
  //   setCaseBill();
  //   if (flag) {
  //     getClientCaseBills();
  //   }
  //   setShowPutCaseBillModal(false);
  // };

  const onPutCaseBill = (flag) => {
    setCaseBill();
    if (flag) {
      getClientCaseBills();
    }
    setShowPutCaseBillModal(false);
    getClientCaseBills();
  };

  const getBalanceAmount = () => {
    if (caseBills && caseBills.length > 0) {
      let totalPaidAmount = 0;
      let totalReceiveAmount = 0;

      caseBills.forEach((caseBill) => {
        if (caseBill.type === "receive") {
          totalReceiveAmount += caseBill.amount;
        }
        if (caseBill.type === "paid") {
          totalPaidAmount += caseBill.amount;
        }
      });

      // Calculate the balance
      return totalPaidAmount - totalReceiveAmount;
    } else {
      return 0; // Return 0 if no bills are present
    }
  };

  const getSummeryOfBill = () => {
    if (caseBills && caseBills.length > 0) {
      let balAmount = 0;
      let totalPaidAmount = 0;
      let totalReceiveAmount = 0;
      //<td>{caseBill.type=="paid"?"Amount Chargeable":null}{caseBill.type=="receive"?"Amount Received":null}</td>
      caseBills.forEach((caseBill) => {
        if (caseBill.type == "receive") {
          totalReceiveAmount = totalReceiveAmount + caseBill.amount;
        }
        if (caseBill.type == "paid") {
          totalPaidAmount = totalPaidAmount + caseBill.amount;
        }
      });

      return (
        <>
          {" "}
          &nbsp;
          <b>Amount Chargeable</b>: ₹ {totalPaidAmount}.00, &nbsp;
          <b>Amount Received</b>: ₹ {totalReceiveAmount}.00, &nbsp;
          <b>Balance</b>: ₹ {totalPaidAmount - totalReceiveAmount}.00
        </>
      );
    } else {
      // return 0
      return (
        <>
          Amount Chargeable:0.00, Amount Received:0.00, Balance:0.00
          <br />
        </>
      );
    }
  };

  const generateCaseBill = (caseBill) => {
    let tempCaseBill = { ...caseBill };
    delete tempCaseBill["actiond"];
    setCaseBill2Generate(tempCaseBill);
  };

  console.log("client_details_295: ", props.selectedClient);
  console.log("clientCase_296: ", props.clientCase);

  return (
    <Suspense fallback={<>Loading...</>}>
      <div className="row ms-0 me-0">
        <div className="col-8 pt-2">
          <p className="">
            
            {!showPutCaseBillModal ? (
              <button className="btn btn-sm btn-outline-primary" onClick={() => {
                setCaseBill();
                setShowPutCaseBillModal(true);
                setCaseBill2Generate();
              }}>
              <i
                className="fa fa-plus rounded-50"
                title="Add"
                style={{
                   
                  fontSize: "16px",
                }}
                aria-hidden="true"
                
              />&nbsp;Add Bill and Receipt
              </button>
            ) : (
              null
            )}
          </p>
          {/* <h4>Summery {getSummeryOfBill()}</h4> */}
        </div>
        <div className="col-4 pt-2 text-end">
        {showPutCaseBillModal ? (
          <button className="btn btn-sm btn-outline-danger" onClick={() => {
            setShowPutCaseBillModal(false);
            setCaseBill2Generate();
          }}>
          <i
            className="fa fa-times"
            title="Close"
            style={{
              fontSize: "16px",
            }}
            aria-hidden="true"
            
          />
          </button>
        ) : (null)}
        {!showPutCaseBillModal ? (
            <button className="btn btn-sm btn-outline-primary" onClick={() => {setShowCaseBillsPrintModal(true);
              setCaseBill2Generate();
            }}>

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
        </div>

        <div className="col-12">
          <p>
            <span style={{ color: "black", fontWeight: "bold" }}>
              Summary:
            </span>
             {getSummeryOfBill()}
          </p>
        </div>

        <div className="col-12">
          {showPutCaseBillModal ? (
            <>
              <PutCaseBill
                caseBill={caseBill}
                onPutCaseBill={onPutCaseBill}
                clientCase={props.clientCase}
                selectedClient={props.selectedClient}
              />
            </>
          ) : (
            <>
              {caseBills && caseBills.length > 0 ? (
                <>
                  <Modal
                    transparent={false}
                    ariaHideApp={false}
                    isOpen={showCaseBillsPrintModal}
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
                      <div className="d-flex mb-2 justify-content-between">
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
                                <i className="fa fa-print" aria-hidden="true"></i>{" "}
                                Print
                              </button>
                            );
                          }}
                          content={() => componentToPrintRef.current}
                        />
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => {
                            setShowCaseBillsPrintModal(false);
                          }}
                        >
                          Close
                        </button>
                      </div>
                      
                      <div ref={componentToPrintRef}>
                        <h4 style={{ fontSize: "14px" }}>
                          <span style={{ color: "black", fontWeight: "bold" }}>
                            Payment Summary
                          </span>
                          : {getSummeryOfBill()}
                        </h4>
                        <div className="table-responsive table-container">
                        <table className="table" id="contentToPrint">
                          <thead>
                            <tr>
                              <th>S. No</th>
                              <th>Nature of Transaction</th>
                              <th>Title of the case</th>
                              <th>Amount (₹)</th>
                              {/* <th>Detail</th> */}
                              <th>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {caseBills.map((caseBill, index) => (
                              <tr key={caseBill.id}>
                                <td scope="row">{index + 1}</td>
                                <td>
                                  {caseBill.type == "paid"
                                    ? "Amount Chargeable"
                                    : null}
                                  {caseBill.type == "receive"
                                    ? "Amount Received"
                                    : null}
                                </td>
                                <td>{caseBill.sampleTxt}</td>
                                <td>{caseBill.amount}</td>
                                {/* <td>{caseBill.detail}</td> */}
                                <td>{caseBill.dateTimeTxt}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        </div>
                      </div>
                    </div>
                  </Modal>

                  {caseBill2Generate != undefined ? (
                    <CaseBillGenerate
                      caseBill={caseBill2Generate}
                      selectedClient={props.selectedClient}
                      sampleAmount={getBalanceAmount()} // This should pass the value correctly
                      onCloseClik={() => {
                        setCaseBill2Generate();
                      }}
                    />
                  ) : (
                     
                      <AllFeatureDataTable
                        columns={tableColumns}
                        data={caseBills}
                      />
                     
                  )}
                </>
              ) : null}
            </>
          )}
        </div>
      </div>
    </Suspense>
  );
};

export default ClientCaseBills;
