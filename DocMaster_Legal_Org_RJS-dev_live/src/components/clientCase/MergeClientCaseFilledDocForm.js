import React, { useState, useEffect, useRef } from "react";
import ReactSelect from "react-select";

import ReactToPrint from "react-to-print";
import axios from "axios";

import userStore from "../../zustand/userStore";
import { WsGetClientCaseFilledDocFormDraft } from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";

const MergeClientCaseFilledDocForm = (props) => {
  const componentRef = useRef();
  const userData = userStore((state) => state.user);

  console.log("MergeClientCaseFilledDocForm", props.filledDocForms);

  const [selectedDocForm, setSelectedDocForm] = useState();
  const [selectedDocFormDraftData, setSelectedDocFormDraftData] = useState();

  const [docFormDraftToMerge, setDocFormDraftToMerge] = useState([]);
  const [finalDraftToReturn, setFinalDraftToReturn] = useState();
  useEffect(() => {
    if (selectedDocForm != undefined && selectedDocForm?.id > 0) {
      getDocFormFilledDraft(selectedDocForm);
    }
  }, [selectedDocForm]);

  const getDocFormFilledDraft = (filledDocForm) => {
    // console.log("getClientCaseFilledDocForms_responseData", "Called");
    // setDataError();
    ///{id}/{caseId}/{orgId}/{userId}
    axios
      .get(
        WsGetClientCaseFilledDocFormDraft +
          "/" +
          filledDocForm.id +
          "/" +
          props.clientCase.id +
          "/" +
          userData.org.id +
          "/" +
          userData.id,
        {
          headers: apiKeyHeader(),
        },
      )
      .then((response) => {
        const responseData = response.data;
        console.log("getDocFormFilledDraft_responseData", responseData);
        if (responseData.resultCode === 1) {
          setSelectedDocFormDraftData(responseData.resultMessage);
          //   setCaseFilledDocForms(processCaseFilledDocFormsForDropDown(responseData.resultMessage));
          //   setTableData(processCaseFilledDocForms(responseData.resultMessage));
        } else {
          //   alert(" Client Case DocForms: " + responseData.resultMessage);
          // setErrorMsg(responseData.resultMessage);
        }
        // setDataError(responseData.resultMessage);
        // setSelectedDocForm();
      })
      .catch((error) => {
        console.error("error", error);
        // setErrorMsg("Error while processing");
      });
  };

  const addSelectedIntoDraftArrays = (docFormMapped, docFormDraft) => {
    if (
      checkDataExistInDraftArray(docFormMapped.id, docFormDraftToMerge) == false
    ) {
      let temp = [...docFormDraftToMerge]; //[...docFormDraftToMerge];
      console.log("addSelectedIntoDraftArrays_temp_before", temp);
      temp.push({
        key: docFormMapped.id,
        template: docFormDraft.htmlData,
        draftTitle: docFormDraft.title,
        docFormTitle: docFormMapped.label,
      });
      console.log("addSelectedIntoDraftArrays_temp_after", temp);
      setDocFormDraftToMerge(temp);
    } else {
      alert("Already Added for Merge");
    }

    setSelectedDocForm();
    setSelectedDocFormDraftData();
  };

  const checkDataExistInDraftArray = (keyId, draftArray) => {
    return draftArray.some((draft) => {
      return draft.key == keyId;
    });
  };

  const removeSelectedIntoDraftArrays = (keyId, index) => {
    // console.log("removeSelectedIntoDraftArrays", keyIdId);
    // // delete docFormDraftToMerge[keyIdId];
    // delete docFormDraftToMerge[""+keyIdId];
    // // let temp={...docFormDraftToMerge};
    // // console.log("removeSelectedIntoDraftArrays_temp_before", temp);
    // setDocFormDraftToMerge([ ...docFormDraftToMerge ]);
    var setValue = docFormDraftToMerge;
    const dataRemoved = setValue.filter((el) => {
      return el.key !== keyId;
    });
    setDocFormDraftToMerge(dataRemoved);
  };

  useEffect(() => {
    if (docFormDraftToMerge != undefined) {
      console.log("useEffect_docFormDraftToMerge", docFormDraftToMerge);
      // getOrgDocFormFilled(selectOrgDocFormUserDraft.id);
      concatAllIntoOneDraft();
    }
  }, [docFormDraftToMerge]);

  const concatAllIntoOneDraft = () => {
    // finalDraftContent;
    let finalDraftContentTemp =
      props?.finalDraftContent != undefined ? props?.finalDraftContent : "";
    console.log(
      "concatAllIntoOneDraft_finalDraftContentTemp",
      finalDraftContentTemp,
    );
    // Object.entries(docFormDraftToMerge).map(([key, val]) => {
    //     finalDraftContentTemp=finalDraftContentTemp+"<br/>"+val;
    //   })
    // return finalDraftContentTemp;
    docFormDraftToMerge.map((item) => {
      // finalDraftContentTemp = finalDraftContentTemp + "<br/>" + item.template;
      if (finalDraftContentTemp.length <= 1) {
        finalDraftContentTemp = item.template;
      } else {
        finalDraftContentTemp =
          finalDraftContentTemp +
          "<p style='page-break-before: always'></p>" +
          item.template;
        //<br/>
      }
    });
    setFinalDraftToReturn(finalDraftContentTemp);
  };

  return (
    <div className="row">
      <div className="col-md-12">
        Select Filled Documents
        <ReactSelect
          options={props.filledDocForms}
          onChange={(selectedOption) => {
            // console.log("handleUsersReactSelectChanges", selectedOption);
            setSelectedDocForm(selectedOption);
          }}
          // ref={docFormRef}
          isMulti={false}
          // defaultValue={selectedDocForm}
        />
      </div>
      <div className="col-md-12">
        {selectedDocFormDraftData != undefined ? (
          <div className="row">
            <div className="col-md-8">
              <h6>
                Preview of Selected DocForm Draft '
                {selectedDocFormDraftData.title}'
              </h6>
            </div>
            <div className="col-md-4">
              <button className="btn btn-sm btn-outline-danger">
              <i
                className="fa fa-times"
                aria-hidden="true"
              
                onClick={() => {
                  setSelectedDocForm();
                  setSelectedDocFormDraftData();
                }}
              />
              </button>
            </div>
            <br />
            <div
              className="col-md-12"
              id="selectedDocFormDraftDataPrevei"
              //   ref={componentRef}
              key={
                `selectedDocFormDraftDataCcDiv` + selectedDocFormDraftData.id
              }
              dangerouslySetInnerHTML={{
                __html: selectedDocFormDraftData.htmlData,
              }}
            />
            <button
              type="button"
              className="btn btn-success"
              onClick={() => {
                addSelectedIntoDraftArrays(
                  selectedDocForm,
                  selectedDocFormDraftData,
                );
                // resetNewDocFormFill();
              }}
            >
              Select for Merge
            </button>
          </div>
        ) : null}
      </div>
      <hr />
      <div className="col-md-6">
        Selected List of DocForms Draft
        {docFormDraftToMerge.length > 0 &&
          docFormDraftToMerge.map((item, index) => {
            // console.log("item", item);
            return (
              <>
                <h6>{item.draftTitle}</h6>
                {/* <div
                              id={"orgDocFormUserDraftDataHtmlData" + item.key}
                              key={
                                `orgDocFormUserDraftDataHtmlData` +
                                "selectOrgDocFormUserDraft?.id" +
                                item.key
                              }
                              dangerouslySetInnerHTML={{
                                __html: item.template,
                              }}
                              style={{
                                maxHeight: "250px",
                                overflowY: "scroll",
                              }}
                            /> */}
                <button
                  className="btn btn-outline-danger"
                  onClick={() => removeSelectedIntoDraftArrays(item.key, index)}
                >
                  Remove This
                </button>
              </>
            );
          })}
      </div>
      <div className="col-md-6">
        {finalDraftToReturn != undefined ? (
          <div className="row">
            <div className="col-md-6">
              <h6>Final Merged Template preview</h6>
            </div>
            <div className="col-md-6">
              <ReactToPrint
                documentTitle="DocMaster_TestRun_Print"
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
                        style={{ fontSize: 20 }}
                        className="fa fa-print"
                        aria-hidden="true"
                      ></i>{" "}
                      Print
                    </button>
                  );
                }}
                content={() => componentRef.current}
              />
            </div>
            <div
              id={"finalDraftToReturnkey"}
              key={`finalDraftToReturn`}
              ref={componentRef}
              dangerouslySetInnerHTML={{
                __html: finalDraftToReturn,
              }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default MergeClientCaseFilledDocForm;
