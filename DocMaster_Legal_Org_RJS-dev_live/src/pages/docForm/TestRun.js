//TestRun.js
import React, { useState, useEffect, Suspense, lazy } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
// import { confirmAlert } from "react-confirm-alert"; // Import Dep
// import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

import { WSGetDocFormFieldsTemplate } from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";

import userStore from "../../zustand/userStore";

// import DocmasterCoreTestRunPopUp from "../../components/DocForm/DocmasterCoreTestRunPopUp";
const DocmasterCoreTestRunPopUp = lazy(
  () => import("../../components/DocForm/DocmasterCoreTestRunPopUp"),
);
// const Navbar = lazy(() => import("../../components/Navbar"));
// const Sidebar = lazy(() => import("../../components/Sidebar"));
// const Footer = lazy(() => import("../../components/Footer"));

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const TestRun = () => {
  // let navigate = useNavigate();

  let query = useQuery();
  let formId = query.get("formId");

  console.log("TestRun_", formId);

  const [inputFieldsChangeCount, setInputFieldsChangeCount] = useState(0);

  const userData = userStore((state) => state.user);

  const [errorMsg, setErrorMsg] = useState("");

  let formsFieldsDataDefault = {
    formFields: {},
  };
  let [formsFieldsDataThis, setFormsFieldsData] = useState(
    formsFieldsDataDefault,
  );
  let [docFormTemplateData, setDocFormTemplateData] = useState("<p></p>");

  const [showCore, setShowCore] = useState(false);

  useEffect(() => {
    getDocFormTemplateAndFields();
  }, []);

  const getDocFormTemplateAndFields = () => {
    toast.success("Loading ...", {
      autoClose: 50,
    });
    //+"/"+userData.id+"/"+props.formId
    axios
      .get(WSGetDocFormFieldsTemplate + "/" + userData.id + "/" + formId, {
        headers: apiKeyHeader(),
      })
      .then((response) => {
        const responseData = response.data;
        console.log("getDocFormTemplateAndFields_responseData", responseData);
        if (responseData.result_code === 1) {
          formsFieldsDataThis = responseData.result_message.fields;
          setFormsFieldsData(formsFieldsDataThis);
          docFormTemplateData = responseData.result_message.template;
          setDocFormTemplateData(responseData.result_message.template);
          // setEditorState(EditorState.createWithContent(stateFromHTML(responseData.forms_templates)))
          setInputFieldsChangeCount(inputFieldsChangeCount + 1);
          setShowCore(true);
        } else {
          alert(responseData.result_message);
          setErrorMsg(responseData.result_message);
        }
      })
      .catch((error) => {
        console.error("getDocFormTemplateAndFields_error", error);
        setErrorMsg("Error while processing");
      });
  };

  return (
    <Suspense fallback={<>Loading...</>}>
      <div style={{ backgroundColor: "#fff", overflowX: "clip" }}>
        <div className="page-title">
          <div className="title_left">
            <h3>DocForm(Test Run)</h3>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12 col-sm-12">
            {errorMsg ? (
              <div>
                <b>{errorMsg}</b>
              </div>
            ) : null}
            {showCore == true ? (
              <DocmasterCoreTestRunPopUp
                formId={formId}
                inputFieldsChangeCount={inputFieldsChangeCount}
                formsTemplate={docFormTemplateData}
                formsFieldsData={formsFieldsDataThis}
              />
            ) : null}
          </div>
        </div>
      </div>
    </Suspense>
  );

  // return (
  //   <Suspense fallback={<>Loading...</>}>
  //     <div style={{ backgroundColor: "#fff" }}>
  //       <div className="page-title">
  //         <div className="title_left">
  //           <h3>DocForm(Test Run)</h3>
  //         </div>
  //       </div>

  //       <div className="row">
  //         <div className="col-md-12 col-sm-12">
  //           {errorMsg ? (
  //             <div>
  //               <b>{errorMsg}</b>
  //             </div>
  //           ) : null}
  //           <DocmasterCoreTestRunPopUp
  //             formId={formId}
  //             inputFieldsChangeCount={inputFieldsChangeCount}
  //             formsTemplate={docFormTemplateData}
  //             formsFieldsData={formsFieldsDataThis}
  //           />
  //         </div>
  //       </div>
  //     </div>
  //   </Suspense>
  // );
};

export default TestRun;
