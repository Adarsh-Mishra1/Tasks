//ShowAll.js//DocForm
import React, { useState, useEffect, Suspense, lazy } from "react";
// import { Tooltip as ReactTooltip } from "react-tooltip";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

// import { confirmAlert } from "react-confirm-alert"; // Import Dep
// import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { toast } from "react-toastify";

import {
  WSGetDocFormFieldsTemplate,
  WSGetMyFilledOrgDocForm,
  WsGetOrgUserPreFillField,
} from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";

import userStore from "../../zustand/userStore";

const Navbar = lazy(() => import("../../components/Navbar"));
const Sidebar = lazy(() => import("../../components/Sidebar"));
const Footer = lazy(() => import("../../components/Footer"));

const DocFormCoreRun = lazy(
  () => import("../../components/Core/DocFormCoreRun"),
);

const FillDocForm = () => {
  let navigate = useNavigate();
  let location = useLocation();

  console.log("FillDocForm_location.state", location.state);
  const userData = userStore((state) => state.user);
  const docForm = location.state?.docForm;
  // const toBeUpdatedBy = location.state?.toBeUpdatedBy==undefined?userData.id:location.state?.toBeUpdatedBy;
  // console.log("FillDocForm_toBeUpdatedBy", toBeUpdatedBy);
  const submittedBy =
    location.state?.submittedBy == undefined
      ? userData
      : location.state?.submittedBy;
  console.log("FillDocForm_ToBeSubmittedBy", submittedBy);

  console.log("FillDocForm_docForm", docForm);
  const [errorMsg, setErrorMsg] = useState("");
  //   const [docForm, setDocForm] = useState();

  const draftRecId =
    location.state?.draftDataRecId != undefined
      ? location.state?.draftDataRecId
      : 0;

  const dfAction =
    location.state?.dfAction != undefined ? location.state?.dfAction : null;

  let docFormFilledDataOld = null;
  if (dfAction == "FWOD") {
    docFormFilledDataOld = {
      title: location.state?.title,
      data: location.state?.filledDocForm,
    };
  }
  console.log("FillDocForm_docFormFilledDataOld_", docFormFilledDataOld);
  console.log("FillDocForm_draftRecId", draftRecId);

  const [inputFieldsChangeCount, setInputFieldsChangeCount] = useState(0);
  let formsFieldsDataDefault = {
    buttonBackgroundColor: "#0000ff",
    formBorderColorOnFocus: "#0000ff",
    formFields: {},
  };
  let [formsFieldsDataThis, setFormsFieldsData] = useState(
    formsFieldsDataDefault,
  );
  let [docFormTemplateData, setDocFormTemplateData] = useState("<p></p>");
  let [userPrefilledFields, setUserPrefilledFields] = useState([]);

  const [showCore, setShowCore] = useState(false);
  let filledDocForm = location.state?.filledDocForm;

  const [draft, setDraft] = useState({}); //id:,title:,inputData:,htmlString:
  const [docFormPreFills, setDocFormPreFills] = useState([]);

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

    fetchDocFormTemplateAndInputFields();
  }, []);

  const fetchDocFormTemplateAndInputFields = () => {
    toast.success("Loading Please Wait...", { autoClose: 50 });

    let requestTemplateAndFormFields = axios.get(
      WSGetDocFormFieldsTemplate + "/" + userData.id + "/" + docForm.formId,
      {
        headers: apiKeyHeader(),
      },
    );

    let requestOrgUserPreFillField = axios.get(
      WsGetOrgUserPreFillField + "/" + userData.org.id + "/" + userData.id,
      {
        headers: apiKeyHeader(),
      },
    );

    let webServiceCalls = [
      requestTemplateAndFormFields,
      requestOrgUserPreFillField,
    ];
    if (draftRecId > 0) {
      const requestGetUserFilledDocForm = axios.get(
        WSGetMyFilledOrgDocForm + "/" + userData.id + "/" + draftRecId,
        {
          headers: apiKeyHeader(),
        },
      );
      console.log("FormFieldTemplate_responses", "Call For Draft Data");
      //WSGetMyFilledOrgDocForm
      webServiceCalls = [
        requestTemplateAndFormFields,
        requestOrgUserPreFillField,
        requestGetUserFilledDocForm,
      ];
    }
    /*
      const requestUserAllPrefilledFields = axios.post(
        WSGetUserAllPrefilledFields,
        JSON.stringify({
          formId: formId,
          userId: userData.id,
        }),
        {
          headers: apiKeyHeader(),
        }
      );
      */

    axios
      .all(webServiceCalls)
      .then(
        axios.spread((...responses) => {
          console.log("FormFieldTemplate_responses", responses);
          let showCoreCount = 0;
          if (responses[0] != undefined && responses[0] != null) {
            const responseTemplateAndFormFields = responses[0].data;

            console.log(
              "FormFieldTemplate_responseTemplateAndFormFields",
              responseTemplateAndFormFields,
            );

            if (responseTemplateAndFormFields.result_code == 1) {
              console.log(
                "FormFieldTemplate_responseTemplateAndFormFields.result_message?.fields",
                responseTemplateAndFormFields.result_message?.fields,
              );

              console.log(
                "FormFieldTemplate_responseTemplateAndFormFields.result_message?.template",
                responseTemplateAndFormFields.result_message?.template,
              );

              setFormsFieldsData(
                responseTemplateAndFormFields.result_message?.fields,
              );

              setDocFormTemplateData(
                responseTemplateAndFormFields.result_message?.template,
              );

              showCoreCount = showCoreCount + 1;
            } else {
              toast.warn("No Template & Input Data found", { autoClose: 50 });
            }
          }

          //PreFill
          if (responses[1] != undefined && responses[1] != null) {
            const responseOrgUserPreFillData = responses[1].data;

            console.log(
              "responseOrgUserPreFillData_",
              responseOrgUserPreFillData,
            );

            if (responseOrgUserPreFillData.resultCode == 1) {
              setDocFormPreFills(responseOrgUserPreFillData.resultMessage);
              // console.log(
              //   "responseOrgPreFillFieldData_responseDraftData",
              //   "setDocFormPreFills(responseOrgPreFillFieldData.resultMessage)"
              // );
            }
          }

          if (responses[2] != undefined && responses[2] != null) {
            const responseDraftData = responses[2].data;

            console.log(
              "FormFieldTemplate_responseDraftData",
              responseDraftData,
            );

            //id:,title:,inputData:,htmlString:
            if (responseDraftData.result_code == 1) {
              console.log("FormFieldTemplate_responseDraftData_setdraft", {
                id: draftRecId,
                inputData: JSON.parse(
                  responseDraftData.result_message.inputData,
                ),
                htmlData: responseDraftData.result_message.htmlData,
              });
              setDraft({
                id: draftRecId,
                inputData: JSON.parse(
                  responseDraftData.result_message.inputData,
                ),
                htmlData: responseDraftData.result_message.htmlData,
              });
            }
          }

          if (showCoreCount > 0) {
            setShowCore(true);
          }

          /*
            //User Prefilled Input Field Data
            const responseUserAllPrefilledFields = responses[1];
            const responseUserAllPrefilledFieldsData =
              responseUserAllPrefilledFields.data;
            if (responseUserAllPrefilledFieldsData.result_code == 1) {
              userPrefilledFields =
                responseUserAllPrefilledFieldsData.result_message;
              console.log("UserAllPrefilledFields*", userPrefilledFields);
              setUserPrefilledFields(userPrefilledFields);
            }
            setInputFieldsChangeCount(inputFieldsChangeCount + 1);
            */
        }),
      )
      .catch((error) => {
        console.error("FormFieldTemplate_error", error);
      });
  };

  return (
    <Suspense fallback={<>Loading...</>}>
      <div className="main_container">
        <Sidebar />
        <Navbar />

        {/* <!-- page content --> */}
        <div className="right_col" role="main">
          <div className="page-title">
            <div className="title_left">{/* <h3>Fill</h3> */}</div>
          </div>

          <div className="clearfix"></div>

          <div className="row">
            <div className="col-md-12 col-sm-12  ">
              <div className="x_panel">
                <div className="x_title">
                  <h2>{docForm.nameTitle}</h2>
                  <div className="clearfix"></div>
                </div>
                <div className="x_content">
                  <h4>By: {submittedBy.name}</h4>
                  {errorMsg ? (
                    <>
                      <b>{errorMsg}</b>
                    </>
                  ) : null}
                  {showCore == true ? (
                    <DocFormCoreRun
                      docForm={docForm}
                      formsTemplate={docFormTemplateData}
                      formsFieldsData={formsFieldsDataThis}
                      userPrefilledFields={userPrefilledFields}
                      inputFieldsChangeCount={inputFieldsChangeCount}
                      filledDocForm={filledDocForm}
                      userData={userData}
                      draft={draft}
                      submittedBy={submittedBy}
                      oldFilledData={docFormFilledDataOld}
                      docFormPreFills={docFormPreFills}
                      toMerge={false}
                    />
                  ) : (
                    <>...</>
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

export default FillDocForm;
