import React, { useState, useEffect, useRef } from "react";
// import ReactSelect from "react-select";

import ReactToPrint from "react-to-print";
import axios from "axios";

import userStore from "../../zustand/userStore";
import { WsGetClientCaseFilledDocFormDraft,WsGetLegalResearchDocFormDraft,WsGetLegalResearchFinalDraft } from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";

const MergeClientCaseFilledDocFormV2 = (props) => {
  const componentRef = useRef();
  const userData = userStore((state) => state.user);

  console.log("MergeClientCaseFilledDocForm", props.filledDocForms);

  const [docFormDraftToMerge, setDocFormDraftToMerge] = useState([]);
  const [finalDraftToReturn, setFinalDraftToReturn] = useState();

  const addSelectedIntoDraftArrays = (docFormMapped, docFormDraft) => {
    console.log("addSelectedIntoDraftArrays_docFormMapped", docFormMapped);
    //Old: docFormMapped.id New docFormMapped.typeId
    if (
      checkDataExistInDraftArray(docFormMapped.typeId, docFormDraftToMerge) == false
    ) {
      let temp = [...docFormDraftToMerge]; //[...docFormDraftToMerge];
      console.log("addSelectedIntoDraftArrays_temp_before", temp);
      temp.push({
        key: docFormMapped.typeId,
        template: docFormDraft.htmlData,
        draftTitle: docFormDraft.title,
        docFormTitle: docFormMapped.label,
      });
      console.log("addSelectedIntoDraftArrays_temp_after", temp);
      setDocFormDraftToMerge(temp);
    } else {
      alert("Already Added for Merge");
    }
  };

  const checkDataExistInDraftArray = (keyId, draftArray) => {
    return draftArray.some((draft) => {
      return draft.key == keyId;
    });
  };

  const removeSelectedIntoDraftArrays = (keyId) => {
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
      finalDraftContentTemp
    );
    // Object.entries(docFormDraftToMerge).map(([key, val]) => {
    //     finalDraftContentTemp=finalDraftContentTemp+"<br/>"+val;
    //   })
    // return finalDraftContentTemp;
    docFormDraftToMerge.map((item) => {
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
    //<p style='page-break-before: always'></p>
    setFinalDraftToReturn(finalDraftContentTemp);
  };

  const getDraftAndAddToArray = (filledDocForm) => {
    if (filledDocForm.type == "casevnt") {
      addSelectedIntoDraftArrays(filledDocForm, {
        htmlData: props.caseevent2html,
      });
    } else if(filledDocForm.type=="rsrchdf"){
      // alert("ToDo Merge")
      getLegalResearchDocFormFilledDraft(filledDocForm);
    }else if(filledDocForm.type=="csrshfd"){
      // alert("ToDo Merge")
      getLegalResearchFinalDraft(filledDocForm);
    }else {
      getDocFormFilledDraftV2(filledDocForm);
    }
  };

  const getLegalResearchDocFormFilledDraft = (filledDocForm) => {
    // console.log("getClientCaseFilledDocForms_responseData", "Called");
    // setDataError();
    ///{id}//{orgId}/{userId}
    axios
      .get(
        WsGetLegalResearchDocFormDraft +
          "/" +
          filledDocForm.id +
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
        console.log("getLegalResearchDocFormFilledDraft_responseData", responseData);
        if (responseData.resultCode === 1) {
          // setCaseFilledDocForm(filledDocForm);
          // setCaseFilledDocFormDraft(responseData.resultMessage);
          if (filledDocForm != undefined && filledDocForm?.id > 0) {
            // setSelectedDocForm(filledDocForm);
            addSelectedIntoDraftArrays(
              filledDocForm,
              responseData.resultMessage
            );
          }
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

  const getLegalResearchFinalDraft = (filledDocForm) => {
    // console.log("getClientCaseFilledDocForms_responseData", "Called");
    // setDataError();
    ///{id}//{orgId}/{userId}
    axios
      .get(
        WsGetLegalResearchFinalDraft +
          "/" +
          filledDocForm.id +
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
        console.log("getLegalResearchDocFormFilledDraft_responseData", responseData);
        if (responseData.resultCode === 1) {
          if (filledDocForm != undefined && filledDocForm?.id > 0) {
            // setSelectedDocForm(filledDocForm);
            addSelectedIntoDraftArrays(
              filledDocForm,
              responseData.resultMessage
            );
          }
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

  const getDocFormFilledDraftV2 = (filledDocForm) => {
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
        }
      )
      .then((response) => {
        const responseData = response.data;
        console.log("getDocFormFilledDraft_responseData", responseData);
        if (responseData.resultCode === 1) {
          if (filledDocForm != undefined && filledDocForm?.id > 0) {
            // setSelectedDocForm(filledDocForm);
            addSelectedIntoDraftArrays(
              filledDocForm,
              responseData.resultMessage
            );
          }
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

  return (
    <div className="row">
      <div className="col-md-5">
        {/* Choose from Filled DocForm */}
        {props.filledDocForms && props.filledDocForms.length > 0 ? (
          <div className="table-responsive table-container"> 
          <table
            className="table"
             
          >
            <thead>
              <tr>
                <th>S. No</th>
                <th>DocForm</th>
                <th>Choose</th>
              </tr>
            </thead>
            <tbody>
              {props.filledDocForms != undefined &&
                props.filledDocForms.map((filledDocForm, index) => {
                  return (
                    <tr key={filledDocForm.id + "caseDocFilledForms"}>
                      <td>{index + 1}</td>
                      <td>{filledDocForm.docform.nameTitle}</td>
                      <td>
                        <input
                          type="checkbox"
                          value={1}
                          name="cDocFilledForm"
                          id="cDocFilledForm"
                          disabled={filledDocForm.type === "othr"}
                          onChange={(e) => {
                            if (e.target.checked) {
                              getDraftAndAddToArray(filledDocForm);
                            } else {
                              // removeSelectedIntoDraftArrays(filledDocForm.id);//Old
                              removeSelectedIntoDraftArrays(
                                filledDocForm.typeId
                              ); //New
                            }
                          }}
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
      <div className="col-md-7">
        {/* <h6>Final Merged Template preview</h6> */}
        {finalDraftToReturn != undefined && finalDraftToReturn.length > 2 ? (
          <div
            style={{
              maxHeight: "640px",
              overflowX: "scroll",
              border: "2px dotted grey",
              padding: "10px",
            }}
          >
            <div>
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
                      Merged Print Preview
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

export default MergeClientCaseFilledDocFormV2;
