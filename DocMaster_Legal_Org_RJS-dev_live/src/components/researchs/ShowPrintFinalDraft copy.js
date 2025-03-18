//ShowPrintFinalDraft.js
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import ReactToPrint from "react-to-print";
import Modal from "react-modal";
import {
  WsGetResearchConclusion,
  WsGetUserSubjectQuestionAndAnswer,
  WsPutResearchConclusion,
} from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";
import TinyMce from "./TinyMce";
import DocForm2FinalDraftMerge from "./DocForm2FinalDraftMerge";
import ResearchPresetDocForm from "./ResearchPresetDocForm";

const ShowPrintFinalDraft = (props) => {
  const componentRef = useRef();
  const [consolidation, setConsolidation] = useState("");
  const [saveButtonColor, setSaveButtonColor] = useState("green");
  const [finalDraftContent, setFinalDraftContent] = useState();
  const [showDocForm2FinalDraftMerge, setShowDocForm2FinalDraftMerge] =
    useState(false);
  const [enableEditFinalDraft, setEnableEditFinalDraft] = useState(false);
  useEffect(() => {
    getResearchConclusion();
  }, []);

  const getResearchConclusion = () => {
    axios
      .get(
        WsGetResearchConclusion +
          "/" +
          props.user.id +
          "/" +
          props.researchSubject.id,
        {
          headers: apiKeyHeader(),
        },
      )
      .then((response) => {
        const responseData = response.data;
        console.log("responseData_Conc", responseData);
        if (responseData.resultCode == 1) {
          setConsolidation(responseData.resultMessage.consolidation);
          setFinalDraftContent(responseData.resultMessage.finalDraft);
        } else {
          alert(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("error", error);
      });
  };

  const onDocFormDraftMergeContentReturn = (finalContent) => {
    console.log("onDocFormDraftMergeContentReturn_finalContent", finalContent);
    setShowDocForm2FinalDraftMerge(false);
    setFinalDraftContent(finalContent);
    setSaveButtonColor("red");
    //DevNote: Enable Save Button Here so that this change can be submitted/stored to Database
  };

  function onFinalDraftEditorChange(content) {
    console.log("onFinalDraftEditorChange_Main", content);
    setSaveButtonColor("red");
    setFinalDraftContent(content);
  }

  const onSubmitFinalDraft = () => {
    // e.preventDefault();
    if (saveButtonColor == "green") {
      alert("No changes to save");
    } else {
      let finalDraft2put =
        finalDraftContent != undefined ? finalDraftContent : null;
      console.log("onSubmit_conclusion2put", finalDraft2put);
      if (finalDraft2put != undefined && finalDraft2put.length >= 3) {
        putConclusion(1, null, finalDraft2put);
      } else {
        alert("Insert Final Draft");
      }
    }
  };

  const putConclusion = (type, conclusion2put, finalDraft2put) => {
    /*Long id;
    Long subjectId;
    String heading;
    String consolidation;
    Long userId;*/

    console.log(
      "onSubmit_prams",
      JSON.stringify({
        subjectId: props.researchSubject.id,
        heading: consolidation?.heading,
        consolidation: consolidation?.consolidation,
        finalDraft: type == 0 ? null : finalDraft2put,
        userId: props.user.id,
        type: type,
      }),
    );

    axios
      .post(
        WsPutResearchConclusion,
        JSON.stringify({
          subjectId: props.researchSubject.id,
          heading: consolidation?.heading,
          consolidation: consolidation?.consolidation,
          finalDraft: type == 0 ? null : finalDraft2put,
          userId: props.user.id,
          type: type,
        }),
        {
          headers: apiKeyHeader(),
        },
      )
      .then((response) => {
        const responseData = response.data;

        console.log("onSubmit_responseData", responseData);
        if (responseData.resultCode === 1) {
          setSaveButtonColor("green");
        } else {
          alert(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("error", error);
      });
  };

  return (
    <>
      <h6>Final Draft</h6>
      {/* <div> */}
      <Modal
        transparent={false}
        ariaHideApp={false}
        isOpen={showDocForm2FinalDraftMerge}
        style={{
          overlay: {
            width: "100vw",
            top: "0%",
            zIndex: 9999,
          },
          content: {
            left: "5%",
            width: "90vw",
          },
        }}
      >
        <button
          className="btn btn-danger"
          style={{ position: "absolute", top: 5, right: 5 }}
          onClick={() => {
            setShowDocForm2FinalDraftMerge(false);
            // setSelectedQue();
          }}
        >
          Close
        </button>
        <br />
        <div>
          {/* <DocForm2FinalDraftMerge
              // org={props.user.org}
              toMerge={1}
              researchSubject={props.researchSubject}
              user={props.user}
              onContentReturn={onDocFormDraftMergeContentReturn}
              finalDraftContent={finalDraftContent}
            /> */}
          <ResearchPresetDocForm
            toMerge={1}
            researchSubject={props.researchSubject}
            user={props.user}
            onContentReturn={onDocFormDraftMergeContentReturn}
            finalDraftContent={finalDraftContent}
            toShow={!props.isByResearcher}
            isAssigned2user={props.isAssigned2user}
          />
        </div>
      </Modal>

      {/* {showDocForm2FinalDraftMerge ? null : (
        <button
          className="btn btn-outline-primary mb-3"
          onClick={() => setShowDocForm2FinalDraftMerge(true)}
        >
          <i
            style={{ fontSize: 20 }}
            className="fa fa-file"
            aria-hidden="true"
          />{" "}
          Supporting Docs
        </button>
      )} */}

      {/* </div> */}

      {enableEditFinalDraft ? (
        <>
          <button
            className="no_print btn btn-outline-info mb-3"
            onClick={() => setEnableEditFinalDraft(false)}
          >
            <i
              style={{ fontSize: 20 }}
              className="fa fa-print"
              aria-hidden="true"
            ></i>{" "}
            Print View
          </button>
          <TinyMce
            keyId={props.researchSubject.id + `ccFdedtr`}
            intitialContent={finalDraftContent}
            onEditorChange={onFinalDraftEditorChange}
            height={600}
          />
        </>
        
      ) : (
        <>
          <ReactToPrint
            documentTitle="DocMaster_TestRun_Print"
            pageStyle={
              "@media print { body { -webkit-print-color-adjust: exact; } @page { size: " +
              "A4; margin: 0 !important" +
              Number(1) * 0.3937 +
              "in " +
              Number(1) * 0.3937 +
              "in " +
              Number(1) * 0.3937 +
              "in " +
              Number(1) * 0.3937 +
              "in!important }}"
            }

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
          <button
            className="no_print btn btn-outline-success mb-3"
            onClick={() => setEnableEditFinalDraft(true)}
          >
            <i
              style={{ fontSize: 20 }}
              className="fa fa-edit"
              aria-hidden="true"
            ></i>{" "}
            Edit
          </button>

          <div style={{ border: "1px solid #dee2e6", padding: "10px" }}>
            <div
              id="contentToPrint"
              ref={componentRef}
              key={`ccDiv` + props.researchSubject.id}
              dangerouslySetInnerHTML={{
                __html: finalDraftContent,
              }}
            />
          </div>
        </>
      )}
      <button
        type="submit"
        className="btn btn-primary"
        
        onClick={onSubmitFinalDraft}
      >
        <i
          className="fa fa-save"
          title="Save"
          aria-hidden="true"
          style={{ fontSize: "32px" }}
        ></i>{" "}
      </button>
    </>
  );
};

export default ShowPrintFinalDraft;
