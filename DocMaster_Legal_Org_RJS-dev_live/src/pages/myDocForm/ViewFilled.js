//ViewFilled.js
import React, { useState, useEffect, Suspense, lazy, useRef } from "react";
import ReactToPrint from "react-to-print";
// import { Tooltip as ReactTooltip } from "react-tooltip";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
// import { confirmAlert } from "react-confirm-alert"; // Import Dep
// import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { toast } from "react-toastify";
// import {
//   closeSibdbar,
//   renderLazyLoader,
//   htmlString2Print,
// } from "../../OtherFunctions/OtherUIFunctions";

import {
  processPageBreak,
  processPageBreakForDoc,
  processPageBreakForDocTest,
  processPageBreakForJsPrint,
} from "../../OtherFunctions/OtherFunctions";

import {
  WSGetDocFormFieldsTemplate,
  WSGetMyFilledOrgDocForm,
} from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";

import userStore from "../../zustand/userStore";

const Navbar = lazy(() => import("../../components/Navbar"));
const Sidebar = lazy(() => import("../../components/Sidebar"));
const Footer = lazy(() => import("../../components/Footer"));

// const DocFormCoreRun = lazy(() =>
//   import("../../components/Core/DocFormCoreRun")
// );

const ViewFilled = () => {
  let navigate = useNavigate();
  let location = useLocation();

  console.log("ViewFilled_location.state", location.state);
  const userData = userStore((state) => state.user);
  const draftData = location.state?.draftData;

  console.log("ViewFilled_docForm", draftData);

  //   const draftRecId =
  //     location.state?.draftDataRecId != undefined
  //       ? location.state?.draftDataRecId
  //       : 0;

  //   console.log("ViewFilled_draftRecId", draftRecId);

  const [errorMsg, setErrorMsg] = useState("");
  //   const myDocForm  = {};
  const [filledDocForm, setFilledDocForm] = useState({});
  let [formsFieldsDataThis, setFormsFieldsData] = useState({});

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
    getUserFilledDocForm();
  }, []);

  function getUserFilledDocForm() {
    toast.success("Loading ...", { autoClose: 50 });

    const requestTemplateAndFormFields = axios.get(
      WSGetDocFormFieldsTemplate +
        "/" +
        userData.id +
        "/" +
        draftData.docForm.id,
      {
        headers: apiKeyHeader(),
      },
    );

    const requestGetUserFilledDocForm = axios.get(
      WSGetMyFilledOrgDocForm + "/" + userData.id + "/" + draftData.recId,
      {
        headers: apiKeyHeader(),
      },
    );
    axios
      .all([requestTemplateAndFormFields, requestGetUserFilledDocForm])
      .then(
        axios.spread((...responses) => {
          console.log("getUserFilledDocForm_responses", responses);
          const responseTemplateAndFormFields = responses[0];
          const responseTemplateAndFormFieldsData =
            responseTemplateAndFormFields.data;

          if (responseTemplateAndFormFieldsData.result_code === 1) {
            formsFieldsDataThis =
              responseTemplateAndFormFieldsData.result_message.fields;
            setFormsFieldsData(formsFieldsDataThis);

            if (
              formsFieldsDataThis?.pageType !== undefined &&
              formsFieldsDataThis?.pageType !== null &&
              formsFieldsDataThis.length > 2
            ) {
              setPageType(formsFieldsDataThis.pageType);
            }

            if (
              formsFieldsDataThis?.printMarginLeft !== undefined &&
              formsFieldsDataThis?.printMarginLeft !== null &&
              formsFieldsDataThis.printMarginLeft > 0
            ) {
              setPrintMarginLeft(formsFieldsDataThis.printMarginLeft);
            }

            if (
              formsFieldsDataThis.printMarginRight !== undefined &&
              formsFieldsDataThis.printMarginRight !== null &&
              formsFieldsDataThis.printMarginRight > 0
            ) {
              setPrintMarginRight(formsFieldsDataThis.printMarginRight);
            }

            if (
              formsFieldsDataThis.printMarginTop !== undefined &&
              formsFieldsDataThis.printMarginTop !== null &&
              formsFieldsDataThis.printMarginTop > 0
            ) {
              setPrintMarginTop(formsFieldsDataThis.printMarginTop);
            }
            if (
              formsFieldsDataThis.printMarginBottom !== undefined &&
              formsFieldsDataThis.printMarginBottom !== null &&
              formsFieldsDataThis.printMarginBottom > 0
            ) {
              setPrintMarginBottom(formsFieldsDataThis.printMarginBottom);
            }
          }

          const responseGetUserFilledDocForm = responses[1];
          const responseGetUserFilledDocFormData =
            responseGetUserFilledDocForm.data;
          console.log(
            "responseGetUserFilledDocFormData",
            responseGetUserFilledDocFormData,
          );
          if (responseGetUserFilledDocFormData.result_code === 1) {
            setFilledDocForm({
              inputData: JSON.parse(
                responseGetUserFilledDocFormData.result_message.inputData,
              ),
              htmlData:
                responseGetUserFilledDocFormData.result_message.htmlData,
            });
            setErrorMsg("");
          } else {
            // setErrorMsg(responseGetUserFilledDocFormData.result_message);
            setErrorMsg("No Data Found");
          }
        }),
      )
      .catch((error) => {
        console.error("getUserFilledDocForm_error", error);
      });
  }

  const goToFillDocFormPage = (draftData, withOldData) => {
    draftData.docForm["formId"] = draftData.docForm.id;
    draftData.docForm["formNameTitle"] = draftData.docForm.nameTitle;

    if (withOldData) {
      // console.log("goToFillDocFormPage_", withOldData);
      // console.log("goToFillDocFormPage_draftData_filledDocForm", filledDocForm);
      // console.log("goToFillDocFormPage_draftData", draftData);
      navigate("/orgDocFormFill", {
        state: {
          docForm: draftData.docForm,
          dfAction: "FWOD",
          filledDocForm: filledDocForm,
          title: draftData?.title,
        },
      });
    } else {
      console.log("goToFillDocFormPage_", withOldData);
      navigate("/orgDocFormFill", {
        state: {
          docForm: draftData.docForm,
        },
      });
    }
  };

  function sendDocToUser(option, contact) {
    // const userDataThis = reactLocalStorage.getObject("user_data");
    // console.log("sendDocToUser_option", option);
    // console.log("sendDocToUser_contact", contact);
    //option 0: download (after confirmed checkDocFormsLimit to process)
    //option 1: eMail
    //option 2: SMS
    //option 3: WhatsApp
    //Option 4: Print(after checkDocFormsLimit)
    //Option 5: Download(after checkDocFormsLimit)
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
    let fileName2Process =
      draftData.docForm.nameTitle + "docmasterOrg_" + Date.now();
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
  const copyContent = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // console.log('Content copied to clipboard');
      toast("Content copied to clipboard", { autoClose: 500 });
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const copy2clipboard = () => {
    let text = document.getElementById("contentToPrint").innerText;
    copyContent(text);
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
              <h3>Filled Documents</h3>
            </div>
          </div>

          <div className="clearfix"></div>

          <div className="row">
            <div className="col-md-12 col-sm-12  ">
              <div className="x_panel">
                <div className="x_title">
                  <h2>
                    {draftData?.docForm.nameTitle} : {draftData?.title}
                  </h2>
                  <div className="clearfix"></div>
                </div>
                <div className="x_content">
                  {errorMsg ? (
                    <div>
                      <b>{errorMsg}</b>
                    </div>
                  ) : null}

                  <button
                    className="subscribeNowButton w-150 mx-1 mb-1 ml-lg-2 mb-3 outlineButton"
                    onClick={() => {
                      goToFillDocFormPage(draftData, 0);
                    }}
                  >
                    Fill
                  </button>

                  <button
                    className="subscribeNowButton w-150 mx-1 mb-1 ml-lg-2 mb-3 outlineButton"
                    onClick={() => {
                      goToFillDocFormPage(draftData, 1);
                    }}
                  >
                    Edit
                  </button>

                  {filledDocForm.htmlData != undefined &&
                  filledDocForm.htmlData != null &&
                  filledDocForm.htmlData.length > 4 ? (
                    <>
                      <ReactToPrint
                        documentTitle={
                          draftData.docForm.nameTitle +
                          "_DocMasterOrg_" +
                          Date.now()
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
                      &nbsp;
                      <button
                        title="Copy"
                        className="ml-lg-2 mb-3 outlineButton"
                        onClick={() => copy2clipboard()}
                      >
                        <i class="fa fa-solid fa-clipboard"></i>
                      </button>
                      &nbsp; &nbsp;
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
                              __html: processPageBreak(filledDocForm.htmlData),
                            }}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <p>{errorMsg}</p>
                  )}
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

export default ViewFilled;
