//DocForm2FinalDraftMerge.js
import { useEffect, useState, useRef } from "react";
import axios from "axios";
// import ReactToPrint from "react-to-print";
import ReactSelect from "react-select";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import {
  WsGetOrgDocFormUsages,
  WSGetOrgDocForms,
  WSGetOrgDocFormFilledData,
  WsPutResearchDocformdraftWatchlist,
  WsGetResearchDocformdraftWatchlist,
} from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";
import FillNewDocFormToMerge from "./FillNewDocFormToMerge";

const DocForm2FinalDraftMerge = (props) => {
  const [orgDocFormUserDrafts, setOrgDocFormUserDrafts] = useState();
  const [selectOrgDocFormUserDraft, setSelectOrgDocFormUserDraft] = useState();
  const [orgDocFormUserDraftData, setOrgDocFormUserDraftData] = useState();

  const [docFormDraftToMerge, setDocFormDraftToMerge] = useState([]);
  const [docFormDraftWatchList, setDocFormDraftWatchList] = useState([]);

  const [finalDraftToReturn, setFinalDraftToReturn] = useState();

  useEffect(() => {
    getResearchDocformdraftWatchlist();
    getOrgDocForms();
  }, []);

  const getResearchDocformdraftWatchlist = () => {
    axios
      .get(
        WsGetResearchDocformdraftWatchlist +
          "/" +
          props.researchSubject.id +
          "/" +
          props.user.id,
        {
          headers: apiKeyHeader(),
        },
      )
      .then((response) => {
        const responseData = response.data;
        console.log("responseData_WatchList", responseData);
        if (responseData.resultCode == 1) {
          setDocFormDraftWatchList(
            processWatchListItemData(responseData.resultMessage),
          );
        } else {
          alert(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("error", error);
      });
  };

  const processWatchListItemData = (itemArray) => {
    itemArray.map((item, index) => {
      item["label"] =
        "Draft:" +
        item.orgDocformUserData.title +
        " DocForm:" +
        item.orgDocformUserData.docForm.nameTitle +
        " By: " +
        item.orgDocformUserData.user.name;
      item["value"] = item.orgDocformUserData.id;
      item["id"] = item.orgDocformUserData.id;
    });
    return itemArray;
  };

  const getOrgDocForms = () => {
    //WSGetOrgDocForms + "/" + userData.id + "/" + userData.org.id + "/0",
    axios
      .get(WsGetOrgDocFormUsages + "/" + props.user.org.id, {
        headers: apiKeyHeader(),
      })
      .then((response) => {
        const responseData = response.data;
        console.log("responseData_setOrgDocForms", responseData);
        if (responseData.resultCode == 1) {
          setOrgDocFormUserDrafts(processItemData(responseData.resultMessage));
          // setOrgDocForms(responseData.resultMessage);
        } else {
          alert(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("error", error);
      });
  };

  const processItemData = (itemArray) => {
    itemArray.map((item, index) => {
      item["label"] =
        "Draft:" +
        item.title +
        " DocForm:" +
        item.nameTitle +
        " By: " +
        item.uname;
      item["value"] = item.id;
      console.log("processitemData_", item);
    });
    return itemArray;
  };

  useEffect(() => {
    if (selectOrgDocFormUserDraft != undefined) {
      console.log(
        "useEffect_selectOrgDocFormUserDraft",
        selectOrgDocFormUserDraft,
      );
      getOrgDocFormFilled(selectOrgDocFormUserDraft, 0);
    }
  }, [selectOrgDocFormUserDraft]);

  const getOrgDocFormFilled = (selectOrgDocFormUserDraft, type) => {
    axios
      .get(WSGetOrgDocFormFilledData + "/" + selectOrgDocFormUserDraft.id, {
        headers: apiKeyHeader(),
      })
      .then((response) => {
        const responseData = response.data;
        console.log("responseData_getOrgDocFormFilledData", responseData);
        if (responseData.result_code == 1) {
          if (type == 0) {
            setOrgDocFormUserDraftData(responseData.result_message);
          } else {
            addSelectedIntoDraftArrays(
              selectOrgDocFormUserDraft?.id,
              responseData.result_message.htmlData,
            );
          }
        } else {
          alert(responseData.result_message);
        }
      })
      .catch((error) => {
        console.error("error", error);
      });
  };

  const addSelectedIntoDraftArrays = (keyId, template) => {
    console.log("addSelectedIntoDraftArrays", keyId, template);
    if (props.toMerge == 1) {
      if (checkDataExistInDraftArray(keyId, docFormDraftToMerge) == false) {
        let temp = [...docFormDraftToMerge]; //[...docFormDraftToMerge];
        console.log("addSelectedIntoDraftArrays_temp_before", temp);
        temp.push({ key: keyId, template: template });
        // checkDataExistInDraftArray(keyId,docFormDraftToMerge);
        console.log("addSelectedIntoDraftArrays_temp_after", temp);
        setDocFormDraftToMerge(temp);
        setSelectOrgDocFormUserDraft();
        setOrgDocFormUserDraftData();
      } else {
        alert("Already Added for Merge");
      }
    } else {
      // let temp = [];
      // console.log("addSelectedIntoDraftArrays_temp_before", temp);
      // temp.push({ key: keyId, template: template });
      // // checkDataExistInDraftArray(keyId,docFormDraftToMerge);
      // console.log("addSelectedIntoDraftArrays_temp_after", temp);
      // setDocFormDraftToMerge(temp);
      // setSelectOrgDocFormUserDraft();
      // setOrgDocFormUserDraftData();
      addToResearchDocformdraftWatchlist(keyId, props.researchSubject.id);
    }
  };

  const addToResearchDocformdraftWatchlist = (draftId, researchSubjectId) => {
    axios
      .post(
        WsPutResearchDocformdraftWatchlist,
        JSON.stringify({
          subjectId: researchSubjectId,
          orgDocformUserDataId: draftId,
          userId: props.user.id,
        }),
        {
          headers: apiKeyHeader(),
        },
      )
      .then((response) => {
        const responseData = response.data;
        if (responseData.resultCode === 1) {
          props.onContentReturn("");
        } else {
          alert(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("error", error);
      });
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
    let finalDraftContentTemp = props.finalDraftContent;
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

  const processReturnedDocFormDraft = (draftRecord) => {
    getOrgDocForms();
    // setSelectOrgDocFormUserDraft(draftRecord);
    getOrgDocFormFilled(draftRecord, 1);
  };

  return (
    <>
      {/* Select for Drafts Submitted */}
      <Tabs
        className="mb-1"
        defaultActiveKey="draftWatchList"
        id="uncontrolled-tab-example"
      >
        <Tab eventKey="draftWatchList" title="WatchList">
          <div className="row">
            <div className="col-md-6">
              <ReactSelect
                options={docFormDraftWatchList}
                onChange={(selectedOption) => {
                  console.log("handleUsersReactSelectChanges", selectedOption);
                  //docFormId = selectedOption.id;
                  setSelectOrgDocFormUserDraft(selectedOption);
                }}
                // ref={docFormRef}
                isMulti={false}
                //   defaultValue={{}}
              />
            </div>
            <div className="col-md-6">
              {orgDocFormUserDraftData != undefined ? (
                <>
                  <div
                    id="orgDocFormUserDraftDataHtmlData"
                    key={
                      `orgDocFormUserDraftDataHtmlData` +
                      selectOrgDocFormUserDraft?.id
                    }
                    dangerouslySetInnerHTML={{
                      __html: orgDocFormUserDraftData.htmlData,
                    }}
                    style={{ maxHeight: "250px", overflowY: "scroll" }}
                  />
                  {props.toMerge == 1 ? (
                    <button
                      className="btn btn-outline-primary"
                      onClick={() =>
                        addSelectedIntoDraftArrays(
                          selectOrgDocFormUserDraft?.id,
                          orgDocFormUserDraftData.htmlData,
                        )
                      }
                    >
                      Add This to merge
                    </button>
                  ) : null}
                </>
              ) : null}
            </div>
          </div>
        </Tab>
        <Tab eventKey="fromOldDraft" title="Select from Old Draft">
          <div className="row">
            <div className="col-md-6">
              <ReactSelect
                options={orgDocFormUserDrafts}
                onChange={(selectedOption) => {
                  console.log("handleUsersReactSelectChanges", selectedOption);
                  //docFormId = selectedOption.id;
                  setSelectOrgDocFormUserDraft(selectedOption);
                }}
                // ref={docFormRef}
                isMulti={false}
                //   defaultValue={{}}
              />
            </div>
            <div className="col-md-6">
              {orgDocFormUserDraftData != undefined ? (
                <>
                  <div
                    id="orgDocFormUserDraftDataHtmlData"
                    key={
                      `orgDocFormUserDraftDataHtmlData` +
                      selectOrgDocFormUserDraft?.id
                    }
                    dangerouslySetInnerHTML={{
                      __html: orgDocFormUserDraftData.htmlData,
                    }}
                    style={{ maxHeight: "250px", overflowY: "scroll" }}
                  />
                  <button
                    className="btn btn-outline-primary"
                    onClick={() =>
                      addSelectedIntoDraftArrays(
                        selectOrgDocFormUserDraft?.id,
                        orgDocFormUserDraftData.htmlData,
                      )
                    }
                  >
                    {props.toMerge == 1
                      ? "Add This to merge"
                      : "Add To WatchList"}
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </Tab>
        <Tab eventKey="fillNew" title="Fill New">
          <i>
            * on Submit Draft will be added into WatchList from where it can be
            used to view or merge later.
          </i>
          <FillNewDocFormToMerge
            user={props.user}
            onReturn={processReturnedDocFormDraft}
            type={0}
          />
        </Tab>
      </Tabs>
      <hr />
      {docFormDraftToMerge != undefined ? (
        <div className="row">
          <div className="col-md-6">
            {docFormDraftToMerge.length > 0 &&
              docFormDraftToMerge.map((item, index) => {
                console.log("item", item);
                return (
                  <>
                    <div
                      id={"orgDocFormUserDraftDataHtmlData" + item.key}
                      key={
                        `orgDocFormUserDraftDataHtmlData` +
                        selectOrgDocFormUserDraft?.id +
                        item.key
                      }
                      dangerouslySetInnerHTML={{
                        __html: item.template,
                      }}
                      style={{ maxHeight: "250px", overflowY: "scroll" }}
                    />
                    <button
                      className="btn btn-outline-danger"
                      onClick={() =>
                        removeSelectedIntoDraftArrays(item.key, index)
                      }
                    >
                      {props.toMerge == 1
                        ? "Remove This to merge"
                        : "Remove from View"}
                    </button>
                  </>
                );
              })}
          </div>
          <div className="col-md-6">
            {props.toMerge == 1 ? (
              <>
                <>Preview</>
                {finalDraftToReturn != undefined ? (
                  <div
                    id={"finalDraftToReturnkey"}
                    key={`finalDraftToReturn`}
                    dangerouslySetInnerHTML={{
                      __html: finalDraftToReturn,
                    }}
                  />
                ) : null}
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    props.onContentReturn(finalDraftToReturn);
                  }}
                >
                  Submit
                </button>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
};
export default DocForm2FinalDraftMerge;
