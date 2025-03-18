import { useEffect, useState, useRef, Suspense, lazy } from "react";
import axios from "axios";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

import { confirmAlert } from "react-confirm-alert"; // Import Dep
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { WsPutCaseLaw2CaseMap } from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";
import userStore from "../../zustand/userStore";
import ShowAll2Select from "../caseLaw/ShowAll2Select";

const CreateCaseLaw = lazy(() => import("../caseLaw/PutCaseLaw"));

const PutCaseLaw2CaseMap = (props) => {
  const userData = userStore((state) => state.user);
  const onCaseLawSelect = (caseLaw) => {
    confirmAlert({
      title: "Confirm to Add",
      message:
        "Confirm to Add this law '" + caseLaw.partiesName + "' for the Case!",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            putCaseLawToCase(caseLaw);
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  const putCaseLawToCase = (caseLaw) => {
    if (caseLaw != undefined) {
      axios
        .post(
          WsPutCaseLaw2CaseMap,
          JSON.stringify({
            caseId: props.clientCase.id,
            caseLawId: caseLaw.id,
            userId: userData.id,
          }),
          {
            headers: apiKeyHeader(),
          }
        )
        .then((response) => {
          const responseData = response.data;
          console.log("putCaseBill_responseData", responseData);
          if (responseData.resultCode === 1) {
            props.onPutCaseLaw(true);
          } else {
            toast.error(responseData.resultMessage, {
              position: "top-center",
              autoClose: 1800,
            });
            //   setErrorMsg(responseData.resultMessage);
            props.onPutCaseBill(false);
          }
        })
        .catch((error) => {
          console.error("putCaseBill_error", error);
          // setErrorMsg("Error while processing");
        });
    }
  };

  const onCaseLawAdd = (caseLawResponse) => {
    putCaseLawToCase(caseLawResponse.data);
  };

  return (
    <Suspense fallback={<>Loading...</>}>
      {/* PutCaseLaw2CaseMap */}
      <Tabs
        className="mb-1"
        defaultActiveKey="selectCaseLaw"
        id="uncontrolled-tab-example"
      >
        <Tab eventKey={"selectCaseLaw"} title={"Select"}>
          <ShowAll2Select onSelectReturn={onCaseLawSelect} />
        </Tab>
        <Tab eventKey={"addCaseLaw"} title={"Add New"}>
          {/* <CaseLaws clie-ntCase={cCase} /> */}
          <CreateCaseLaw
            caseLaw={undefined}
            onReturn={onCaseLawAdd}
            userData={userData}
          />
        </Tab>
      </Tabs>
    </Suspense>
  );
};

export default PutCaseLaw2CaseMap;
