//UserFilledDataView.js
import React, { useState, useEffect, Suspense, lazy, useRef } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import { confirmAlert } from "react-confirm-alert"; // Import Dep
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { toast } from "react-toastify";
import ReactToPrint from "react-to-print";

import {
  processPageBreak,
  processPageBreakForDoc,
  processPageBreakForDocTest,
  processPageBreakForJsPrint,
} from "../../OtherFunctions/OtherFunctions";

import {
  WSGetOrgUserCrudAccess,
  WSGetOrgDocFormFilledData,
} from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";

import userStore from "../../zustand/userStore";

const Navbar = lazy(() => import("../../components/Navbar"));
const Sidebar = lazy(() => import("../../components/Sidebar"));
const Footer = lazy(() => import("../../components/Footer"));

const UserFilledDataView = () => {
  let navigate = useNavigate();
  let location = useLocation();

  console.log("UserFilledDataView_locationstate", location.state);
  const userData = userStore((state) => state.user);
  const filledRecData = location.state.filledRecData;
  const docForm = location.state.docForm;

  const [errorMsg, setErrorMsg] = useState("");
  let [userSystemAccess, setUserSystemAccess] = useState({
    c: 1,
    r: 0,
    u: 0,
    d: 0,
  });
  const [filledDocForm, setFilledDocForm] = useState({});

  const [pageType, setPageType] = useState("a4");
  const [printMarginLeft, setPrintMarginLeft] = useState(4);
  const [printMarginRight, setPrintMarginRight] = useState(4);
  const [printMarginTop, setPrintMarginTop] = useState(2);
  const [printMarginBottom, setPrintMarginBottom] = useState(2);

  const componentToPrintRef = useRef();

  useEffect(() => {
    document.addEventListener("keydown", (event) => {
      //c - copy
      //v - paste
      //x - cut
      //s - save
      //p - paste
      //w - close tab
      //u - source code
      //a - select all
      //z - undo
      if (event.ctrlKey && "cvxspwuaz".indexOf(event.key) !== -1) {
        event.preventDefault();
      }
    });
    fetchCombinedData();
  }, []);

  function fetchCombinedData() {
    toast.success("Loading User Data Please Wait ...", {
      autoClose: 500,
    });

    //[url/userId/orgId/docFormId]
    const requestOrgUserCrudAccess = axios.get(
      WSGetOrgUserCrudAccess +
        "/" +
        userData.id +
        "/" +
        userData.org.id +
        "/" +
        docForm.id,
      {
        headers: apiKeyHeader(),
      },
    );

    // console.log("UserFilledData_WSGetOrgUserCrudAccess_params","/" + userData.id + "/" + userData.org.id + "/" + docForm.id);

    // [url/orgFormId/submitted]
    const requestOrgDocFormFilled = axios.get(
      WSGetOrgDocFormFilledData + "/" + filledRecData.recId,
      {
        headers: apiKeyHeader(),
      },
    );

    axios
      .all([requestOrgUserCrudAccess, requestOrgDocFormFilled])
      .then(
        axios.spread((...responses) => {
          console.log(
            "UserFilledDataView_fetchCombinedData_responses",
            responses,
          );
          const responseOrgUserCrudAccess = responses[0];
          const responseOrgDocFormFilled = responses[1];

          const responseOrgUserCrudAccessData = responseOrgUserCrudAccess.data;
          if (responseOrgUserCrudAccessData.resultCode === 1) {
            userSystemAccess = responseOrgUserCrudAccessData.resultMessage;
            setUserSystemAccess(responseOrgUserCrudAccessData.resultMessage);
            console.log(
              "UserFilledData_fetchCombinedData_responseOrgUserCrudAccessData",
              responseOrgUserCrudAccessData,
            );
          }

          const responseOrgDocFormFilledData = responseOrgDocFormFilled.data;
          console.log(
            "UserFilledDataView_fetchCombinedData_responseOrgDocFormFilledData",
            responseOrgDocFormFilledData,
          );
          if (responseOrgDocFormFilledData.result_code === 1) {
            // setDocFormUserFilled(
            //   processData(responseOrgDocFormFilledData.result_message)
            // );
            setFilledDocForm({
              inputData: JSON.parse(
                responseOrgDocFormFilledData.result_message.inputData,
              ),
              htmlData: responseOrgDocFormFilledData.result_message.htmlData,
            });
          } else {
            setErrorMsg(responseOrgDocFormFilledData.result_message);
          }
        }),
      )
      .catch((errors) => {
        // react on errors.
        console.error("UserFilledData_fetchCombinedData_errors", errors);
      });
  }

  function sendDocToUser(option, contact) {
    // const userDataThis = reactLocalStorage.getObject("user_data");
    // console.log("sendDocToUser_option", option);
    // console.log("sendDocToUser_contact", contact);
    //option 0: download (after confirmed checkDocFormsLimit to process)
    //Option 5: Download(after)
    //Option 6: SubmitConfirmation
    var content2Print = componentToPrintRef;
    const targetComponent2Print = content2Print.current || content2Print;
    //document.querySelector("#filledDocFOrm")
    // console.log("targetComponent2Print_", targetComponent2Print);
    //margin: [1, 1, 1, 1],//Old
    //html2canvas: { scale: 2, dpi: 192, letterRendering: true },Old
    //jsPDF: { unit: "mm", format: "letter", orientation: "portrait" }, //Old
    var pagesWidth = "8.3in"; //In Inches
    var pagesHeight = "11.7in"; //In Inches

    var pageTypeFormat = "a4";
    if (pageType != undefined && pageType.length > 1) {
      pageTypeFormat = pageType;
    }

    if (pageTypeFormat.toLowerCase() == "letter") {
      pagesWidth = "8.5in"; //In Inches
      pagesHeight = "11.0in"; //In Inches
    }
    if (pageTypeFormat.toLowerCase() == "legal") {
      pagesWidth = "8.5in"; //In Inches
      pagesHeight = "14.0in"; //In Inches
    }

    //Default Top:1
    //Default Bottom:1
    //Default Right:2
    //Default Left:2

    var setPrintMarginTop = 2;
    if (!isNaN(printMarginTop)) {
      setPrintMarginTop = Number(printMarginTop);
    }

    var setPrintMarginLeft = 4;
    if (!isNaN(printMarginLeft)) {
      setPrintMarginLeft = Number(printMarginLeft);
    }

    var setPrintMarginBottom = 2;
    if (!isNaN(printMarginBottom)) {
      setPrintMarginBottom = Number(printMarginBottom);
    }

    var setPrintMarginRight = 4;
    if (!isNaN(printMarginRight)) {
      setPrintMarginRight = Number(printMarginRight);
    }

    //[top, left, bottom, right].
    //margin: [Number(this.state.printMarginTop), Number(this.state.printMarginLeft), Number(this.state.printMarginBottom), Number(this.state.printMarginRight)],
    let fileName2Process = docForm.nameTitle + "docmasterOrg_" + Date.now();
    if (option == -1) {
      //Download Word

      let marginStye =
        "margin-right: " +
        setPrintMarginRight * 0.3937 +
        "in" +
        "; margin-left: " +
        setPrintMarginLeft * 0.3937 +
        "in" +
        "; margin-top: " +
        setPrintMarginTop * 0.3937 +
        "in" +
        "; margin-bottm: " +
        setPrintMarginBottom * 0.3937 +
        "in" +
        ";";

      let otherStye =
        "<style> @page{ size:" +
        pagesWidth +
        " " +
        pagesHeight +
        ";" +
        marginStye +
        " padding-left: 0pt; padding-right: 0pt; padding-top: 0pt; padding-bottom: 0pt; } </style>";

      var header =
        "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
        "xmlns:w='urn:schemas-microsoft-com:office:word' " +
        "xmlns='http://www.w3.org/TR/REC-html40'>" +
        "<head><meta charset='utf-8'><title>" +
        fileName2Process +
        "</title>" +
        otherStye +
        "</head><body>";
      var footer = "</body></html>";
      let htmlString =
        header +
        processPageBreakForDocTest(targetComponent2Print.innerHTML) +
        footer;

      var source =
        "data:application/vnd.ms-word;charset=utf-8," +
        encodeURIComponent(htmlString);
      var fileDownload = document.createElement("a");
      document.body.appendChild(fileDownload);
      fileDownload.href = source;
      fileDownload.download = fileName2Process + ".doc";
      fileDownload.click();
      document.body.removeChild(fileDownload);
    }
  }

  const goToFillDocFormPage = (draftData, withOldData) => {
    // console.log("goToFillDocFormPage_filledRecData", draftData);
    // console.log("goToFillDocFormPage_filledRecData", filledRecData);
    // console.log("goToFillDocFormPage_docForm", docForm);
    docForm["formId"] = docForm.id;
    docForm["formNameTitle"] = docForm.nameTitle;

    if (withOldData) {
      // console.log("goToFillDocFormPage_", withOldData);
      // console.log("goToFillDocFormPage_draftData_filledDocForm", filledDocForm);
      // console.log("goToFillDocFormPage_draftData", draftData);
      // console.log("goToFillDocFormPage_title", draftData?.title);
      navigate("/orgDocFormFill", {
        state: {
          docForm: docForm,
          dfAction: "FWOD",
          filledDocForm: filledDocForm,
          title: filledRecData?.title,
        },
      });
    } else {
      console.log("goToFillDocFormPage_", withOldData);
      navigate("/orgDocFormFill", {
        state: {
          docForm: docForm,
        },
      });
    }
  };

  return (
    <Suspense fallback={<>Loading...</>}>
      <div className="main_container">
        <Sidebar />
        <Navbar />

        {/* <!-- page content --> */}
        <div className="right_col" role="main">
          <div className="page-title">
            <div className="title_left">
              <h3>User Submitted Data</h3>
            </div>
          </div>

          <div className="clearfix"></div>

          <div className="row">
            <div className="col-md-12 col-sm-12  ">
              <div className="x_panel">
                <div className="x_title">
                  <h2>
                    {docForm.nameTitle} : {filledRecData?.title}
                  </h2>
                  <div className="clearfix"></div>
                </div>
                <div className="x_content">
                  <button
                    className="subscribeNowButton w-150 mx-1 mb-1 ml-lg-2 mb-3 outlineButton"
                    onClick={() => {
                      goToFillDocFormPage(filledRecData, 0);
                    }}
                  >
                    Fill Again
                  </button>

                  <button
                    className="subscribeNowButton w-150 mx-1 mb-1 ml-lg-2 mb-3 outlineButton"
                    onClick={() => {
                      goToFillDocFormPage(filledRecData, 1);
                    }}
                  >
                    Fill with this Data
                  </button>

                  {(() => {
                    if (
                      filledDocForm.htmlData != undefined &&
                      filledDocForm.htmlData != null &&
                      filledDocForm.htmlData.length > 4
                    ) {
                      return (
                        <>
                          <ReactToPrint
                            documentTitle={
                              docForm.nameTitle + "_DocMasterOrg_" + Date.now()
                            }
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
                                <button className="ml-lg-2 mb-3 outlineButton">
                                  <i
                                    style={{ fontSize: 20 }}
                                    className="fa fa-print"
                                    aria-hidden="true"
                                  ></i>{" "}
                                  Print
                                </button>
                              );
                            }}
                            content={() => componentToPrintRef.current}
                          />
                          &nbsp;
                          <button
                            className="ml-lg-2 mb-3 outlineButton"
                            onClick={() => sendDocToUser(-1, "")}
                          >
                            Download Word/Docx
                          </button>
                          &nbsp;&nbsp;
                          <div
                            id="docFormPreview"
                            className="defaultDocForm showDocFormPreview pl-40"
                          >
                            <div className="outTemplateSectionForPrintSelect doNotSelectInMobile liveRenderingOfForm">
                              <div
                                id="contentToPrint"
                                ref={componentToPrintRef}
                                className="contentToPrintTableProps"
                                style={{
                                  fontFamily: "'Times New Roman', Times, serif",
                                }}
                                dangerouslySetInnerHTML={{
                                  __html: processPageBreak(
                                    filledDocForm.htmlData,
                                  ),
                                }}
                              />
                            </div>
                          </div>
                        </>
                      );
                    } else {
                      return <p>{errorMsg}</p>;
                    }
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- /page content --> */}
        <Footer />
      </div>
    </Suspense>
  );
};

export default UserFilledDataView;
