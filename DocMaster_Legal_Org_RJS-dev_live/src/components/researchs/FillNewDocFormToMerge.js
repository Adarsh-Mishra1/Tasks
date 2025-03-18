//FillNewDocFormToMerge
import React, { useState, useEffect, Suspense, lazy } from "react";
import axios from "axios";
import ReactSelect from "react-select";
import {
  WSGetOrgDocForms,
  WsGetOrgUserPreFillField,
  WsGetLegalGeneralDocForm,
  WsGetDocFormTemplateAndInputFields,
} from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";

const DocFormCoreRun = lazy(
  () => import("../../components/Core/DocFormCoreRun"),
);

const FillNewDocFormToMerge = (props) => {
  const [errorMsg, setErrorMsg] = useState("");
  const [docForms, setDocForms] = useState([]);
  const [selectedDocForm, setSelectedDocForm] = useState();
  const [showCore, setShowCore] = useState(false);

  let formsFieldsDataDefault = {
    buttonBackgroundColor: "#0000ff",
    formBorderColorOnFocus: "#0000ff",
    formFields: {},
  };
  let [formsFieldsDataThis, setFormsFieldsData] = useState(
    formsFieldsDataDefault,
  );
  let [docFormTemplateData, setDocFormTemplateData] = useState("<p></p>");
  const [docFormPreFills, setDocFormPreFills] = useState([]);

  useEffect(() => {
    // getOrgAllDocForm();
    getLegalGeneralDocForm();
  }, []);

  // const getOrgAllDocForm = () => {
  //   axios
  //     .get(
  //       WSGetOrgDocForms + "/" + props.user.id + "/" + props.user.org.id + "/0",
  //       {
  //         headers: apiKeyHeader(),
  //       },
  //     )
  //     .then((response) => {
  //       const responseData = response.data;
  //       console.log("getOrgAllDocForm_responseData", responseData);
  //       if (responseData.result_code === 1) {
  //         setDocForms(processItemData(responseData.result_message));
  //       } else {
  //         alert(responseData.result_message);
  //         setErrorMsg(responseData.result_message);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("getOrgAllDocForm_error", error);
  //       setErrorMsg("Error while processing");
  //     });
  // };

  // const processData = (simpleDataArray) => {
  //   // let blankData = [];
  //   simpleDataArray.map((simpleData, index) => {
  //     console.log("processData_simpleData", simpleData);
  //     simpleData["sno"] = index + 1;
  //     simpleData["formId"] = simpleData.id;
  //     simpleData["category"] = simpleData.categoryCode;
  //     simpleData["categoryTxt"] = simpleData.category?.category;
  //   });
  //   return simpleDataArray;
  // };

  // const processItemData = (itemArray) => {
  //   itemArray.map((item, index) => {
  //     item["formId"] = item.id;
  //     item["label"] =
  //       " DocForm:" +
  //       item.nameTitle +
  //       " category: " +
  //       item.categoryCode?.category;
  //     item["value"] = item.id;
  //     console.log("processitemData_", item);
  //   });
  //   return itemArray;
  // };

  const getLegalGeneralDocForm = () => {
    //setGenLegalDocForms
    axios
      .get(
        WsGetLegalGeneralDocForm +
          "/" +
          props.user.org.id +
          "/" +
          props.user.id +
          "/rsrch",
        {
          headers: apiKeyHeader(),
        },
      )
      .then((response) => {
        const responseData = response.data;
        console.log("_responseData", responseData);
        if (responseData.resultCode === 1) {
          // setGenLegalDocForms(
          //   processGetLegalGeneralDocFormData(responseData.resultMessage)
          // );
          setDocForms(
            processGetLegalGeneralDocFormData(responseData.resultMessage),
          );
        } else {
          alert(" DocForms: " + responseData.resultMessage);
          // setErrorMsg(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("error", error);
        // setErrorMsg("Error while processing");
      });
  };

  const processGetLegalGeneralDocFormData = (simpleDataArray) => {
    let tempArrayVar = [];
    simpleDataArray.map((simpleData, index) => {
      // let tempVar=simpleData.user;
      simpleData = simpleData.docform;
      //   tempVar["label"]=simpleData.name;
      //   tempVar["value"]=simpleData.id;
      simpleData["label"] = simpleData.nameTitle;
      simpleData["value"] = simpleData.id;
      //   console.error("_simpleData", simpleData);
      //   simpleData=tempVar
      //   console.error("_simpleData_tempVar", tempVar);
      tempArrayVar.push(simpleData);
    });
    //console.log("_simpleDataArray", simpleDataArray);
    //console.log("_simpleDataArray_tempArrayVar", tempArrayVar);
    // return simpleDataArray;
    return tempArrayVar;
  };

  useEffect(() => {
    if (selectedDocForm != undefined && selectedDocForm?.id > 0) {
      getDocFormFieldAndTemplate(selectedDocForm);
    }
  }, [selectedDocForm]);

  const getDocFormFieldAndTemplate = (docForm) => {
    fetchDocFormTemplateAndInputFields(docForm);
  };

  const fetchDocFormTemplateAndInputFields = (docForm) => {
    // toast.success("Loading Please Wait...", { autoClose: 50 });

    //Invalid wring WS Call
    // let requestTemplateAndFormFields = axios.get(
    //   WSGetDocFormFieldsTemplate + "/" + props.user.id + "/" + docForm.id,
    //   {
    //     headers: apiKeyHeader(),
    //   },
    // );

    let requestTemplateAndFormFields = axios.post(
      WsGetDocFormTemplateAndInputFields,
      JSON.stringify({
        adminUserId: props.user.id,
        templateLanguage: 1,
        formId: docForm.id,
      }),
      {
        headers: apiKeyHeader(),
      },
    );


    let requestOrgUserPreFillField = axios.get(
      WsGetOrgUserPreFillField + "/" + props.user.org.id + "/" + props.user.id,
      {
        headers: apiKeyHeader(),
      },
    );

    let webServiceCalls = [
      requestTemplateAndFormFields,
      requestOrgUserPreFillField,
    ];

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
              // console.log(
              //   "FormFieldTemplate_responseTemplateAndFormFields.result_message?.fields",
              //   responseTemplateAndFormFields.result_message?.fields,
              // );

              // console.log(
              //   "FormFieldTemplate_responseTemplateAndFormFields.result_message?.template",
              //   responseTemplateAndFormFields.result_message?.template,
              // );

              // setFormsFieldsData(
              //   responseTemplateAndFormFields.result_message?.fields,
              // );

              // setDocFormTemplateData(
              //   responseTemplateAndFormFields.result_message?.template,
              // );
              console.log(
                "FormFieldTemplate_responseTemplateAndFormFields.result_message?.fields",
                responseTemplateAndFormFields.forms_fields,
              );

              console.log(
                "FormFieldTemplate_responseTemplateAndFormFields.result_message?.template",
                responseTemplateAndFormFields.forms_templates,
              );

              setFormsFieldsData(
                responseTemplateAndFormFields.forms_fields,
              );

              setDocFormTemplateData(
                responseTemplateAndFormFields.forms_templates,
              );

              showCoreCount = showCoreCount + 1;
            } else {
              alert("No Template & Input Data found", { autoClose: 50 });
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

          if (showCoreCount > 0) {
            setShowCore(true);
          }
        }),
      )
      .catch((error) => {
        console.error("FormFieldTemplate_error", error);
      });
  };

  const onReturnDraftRecord = (draftRecord) => {
    console.log("onReturnDraftRecord_draftRecord", draftRecord);
    resetNewDocFormFill();
    if (props.onReturn != undefined) {
      props.onReturn(draftRecord);
    }
  };

  const resetNewDocFormFill = () => {
    setSelectedDocForm();
    setFormsFieldsData(formsFieldsDataDefault);
    setDocFormTemplateData("<p></p>");
    setShowCore(false);
  };

  return (
    <div className="row">
      {selectedDocForm != undefined ? (
        <div className="row">
          <div className="col-md-6">
            {selectedDocForm.nameTitle} {selectedDocForm.categoryCode?.category}
          </div>
          <div className="col-md-6">
            <button
              onClick={() => {
                resetNewDocFormFill();
              }}
              className="btn"
            >
              Fill another DocForm
            </button>
          </div>
          <div className="col-md-12">
            {showCore ? (
              <>
                <DocFormCoreRun
                  docForm={selectedDocForm}
                  formsTemplate={docFormTemplateData}
                  formsFieldsData={formsFieldsDataThis}
                  userPrefilledFields={[]}
                  inputFieldsChangeCount={0}
                  filledDocForm={undefined}
                  userData={props.user}
                  draft={{}}
                  submittedBy={props.user}
                  oldFilledData={null}
                  docFormPreFills={docFormPreFills}
                  toMerge={true}
                  onReturnDraftRecord={onReturnDraftRecord}
                  isClientDocForm={true}
                  clientFormType={"rsrch"}
                />
              </>
            ) : null}
          </div>
        </div>
      ) : (
        <ReactSelect
          options={docForms}
          onChange={(selectedOption) => {
            console.log("handleUsersReactSelectChanges", selectedOption);
            //docFormId = selectedOption.id;
            if (props.type == 0) {
              setSelectedDocForm(selectedOption);
            } else {
              props.onReturn(selectedOption);
            }
          }}
          // ref={docFormRef}
          isMulti={false}
          //   defaultValue={{}}
        />
      )}
    </div>
  );
};

export default FillNewDocFormToMerge;
