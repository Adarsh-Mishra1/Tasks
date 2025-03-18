import axios from "axios";
import { useEffect, useState } from "react";
import userStore from "../../zustand/userStore";
import { apiKeyHeader } from "../../configs/ApiKeys";
import {
  LinkJudgmentWithCase,
  WsGetOrgClientCases,
  WsGetOrgClientCasesNew1,
  WsGetOrgClients,
  WsGetOrgClientsNew,
} from "../../configs/WebService";
import Select from "react-select";
import ClientCaseEvents from "../clientCase/CaseEvents";
import ClientCaseDocForms from "../clientCase/ClientCaseDocForms";
import ClientCaseFilledDocForms from "../clientCase/ClientCaseFilledDocForms";
import ClientCaseDiary from "../clientCase/CaseDiary";
import ClientCaseBills from "../clientCase/CaseBills";
import ClientCaseResearchs from "../clientCase/ClientCaseResearchs";
import ClientCaseAllDocForms from "../clientCase/ClientCaseAllRecords";
import { toast } from "react-toastify";

function MainComponent({
  type,
  nextHearing = null,
  JudgementData,
  closePopup,
}) {
  const userData = userStore((state) => state.user);
  const [existingClients, setExistingClients] = useState([]);
  const [existingClientCases, setExistingClientCases] = useState([]);
  const [selectedClient, setSelectedClient] = useState();
  const [cCase, setcCase] = useState(null);
  const [errorMsg, setErrorMsg] = useState(
    "Please Select Client, If it is not in the above list, create a new client first. "
  );

  const clientOptions = existingClients.map((client) => ({
    value: client.user.id,
    label: client.user.name,
  }));

  const clientCaseOptions = existingClientCases?.map((clientCase) => ({
    value: clientCase.id,
    label: clientCase.title,
  }));

  useEffect(() => {
    getExistingClients();

    return () => {
      setcCase(null);
      setExistingClientCases([]);
      setExistingClients([]);
    };
  }, []);

  const getExistingClients = async () => {
    try {
      const response = await axios.get(
        `${WsGetOrgClientsNew}/${userData.org.id}/${userData.id}`,
        // `${WsGetOrgClients}/${userData.org.id}/${userData.id}`, // old
        { headers: apiKeyHeader() }
      );
      const responseData = response.data;
      if (responseData.resultCode === 1) {
        // setExistingClients(responseData.resultMessage);
        const fileterdData = responseData.resultMessage.filter(
          (each) => each.isMobileVerify === 1
        );
        const newdata = fileterdData.map((each) => ({
          ...each,
          user: { ...each.user, id: each.id },
        }));
        setExistingClients(newdata);
      } else {
        if (responseData.result_message) alert(responseData.result_message);
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  const handleClientChange = async (e) => {
    const SelectedClient = existingClients.find(
      (client) => client.user.id === e.value
    );
    setErrorMsg(
      "Select Client's Case, If it is not in the above list, create a new client case first."
    );
    setcCase(null);
    setSelectedClient(SelectedClient);
    setExistingClientCases([]);
    getExistingClientCases(SelectedClient.user.id);
  };

  const getExistingClientCases = async (clientId) => {
    const loader = toast.success("Loading...", { autoClose: false });
    try {
      const response = await axios.get(
        // `${WsGetOrgClientCases}/${userData.org.id}/${userData.id}/${clientId}`,
        `${WsGetOrgClientCasesNew1}/${userData.org.id}/${userData.id}/${clientId}`,
        { headers: apiKeyHeader() }
      );
      const responseData = response.data;
      if (responseData.resultCode === 1) {
        setExistingClientCases(responseData.resultMessage);
      } else {
        if (responseData.resultMessage === "No data found") {
          alert(
            "There are no existing cases for this client. Please proceed with creating a new client case."
          );
        } else {
          alert(responseData.resultMessage);
        }
      }
    } catch (error) {
      console.error("error", error);
    } finally {
      toast.dismiss(loader);
    }
  };

  const handleClientCaseChange = (e) => {
    const selectedClientCase = existingClientCases.find(
      (clientCase) => clientCase.id === e.value
    );
    setcCase(selectedClientCase);
    setErrorMsg("");
  };

  function handleSubmit(e) {
    e.preventDefault();

    const loader = toast.success("Loading...", { autoClose: false });

    fetch(LinkJudgmentWithCase, {
      method: "POST",
      headers: apiKeyHeader(),
      body: JSON.stringify({
        orgId: userData.org.id,
        clientId: selectedClient.id,
        clientName: selectedClient.user.name,
        caseId: cCase.id,
        caseName: cCase.title,
        judgmentReport: JudgementData.Case_Gist,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to link judgment with case");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Judgment linked successfully", data);
        toast.success("Judgment linked successfully!");
        closePopup();
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Error linking judgment!");
      })
      .finally(() => {
        toast.dismiss(loader);
      });
  }

  return (
    <div style={{ paddingTop: "15px" }}>
      {type === "research" && (
        <div className="label-text-info"
          style={{
            marginTop: "15px",
            marginBottom: "15px",
            fontSize: "15px",
          }}
        >
          You can add a Research to an existing client case only.
        </div>
      )}
      {type === "caseHearing" && (
        <div className="label-text-info"
          style={{
            marginTop: "15px",
            marginBottom: "15px",
            fontSize: "15px",
          }}
        >
          You can add, edit the hearing dates for purpose or action to an
          existing client case.
        </div>
      )}
      {type === "listEvents" && (
        <div className="label-text-info"
          style={{
            marginTop: "15px",
            marginBottom: "15px",
            fontSize: "15px",
          }}
        >
          You can add a List of Event to an existing client's case only.
        </div>
      )}
      {type === "drafting" && (
        <div className="label-text-info"
          style={{
            marginTop: "15px",
            marginBottom: "15px",
            fontSize: "15px",
          }}
        >
          You can create a Draft for any Application, Petition, Notice or
          Complaint etc. for any existing client case.
        </div>
      )}
      {type === "billingPayments" && (
        <div className="label-text-info"
          style={{
            marginTop: "15px",
            marginBottom: "15px",
            fontSize: "15px",
          }}
        >
          Add Billing & Payment details of an existing client case.
        </div>
      )}
      {type === "filledDocFroms" && (
        <div className="label-text-info"
          style={{
            marginTop: "15px",
            marginBottom: "15px",
            fontSize: "15px",
          }}
        >
          You can Check completed Drafts to an existing client case only.
        </div>
      )}
      {type === "otherDocForms" && (
        <div className="label-text-info"
          style={{
            marginTop: "15px",
            marginBottom: "15px",
            fontSize: "15px",
          }}
        >
          You can add a External Document to an existing client case only.
        </div>
      )}
      {existingClients.length > 0 && (
        <div className="form-group">
          <label className="label-text-b"> Select Client:</label>
          <div>
            <Select
              styles={{ width: "100%" }}
              onChange={handleClientChange}
              options={clientOptions}
              placeholder="Select"
              isSearchable
            />
          </div>
        </div>
      )}
     

      {existingClientCases.length > 0 && (
        <div className="form-group">
          <label className="label-text-b">Select Client's Case:</label>
          <Select
            onChange={handleClientCaseChange}
            options={clientCaseOptions}
            placeholder="Select"
            // placeholder="Select Client's Case"
            isSearchable
          />
        </div>
      )}

      {existingClientCases.length > 0  }
      {errorMsg && 
      <>
        <span style={{ color: "red" }}>{errorMsg}</span> &nbsp; 
      </>
      }
      {errorMsg ==='Please Select Client, If it is not in the above list, create a new client first. '?<span style={{ color: "blue", cursor: "pointer" }}> <u>Create New Client +</u> </span>:''}
      {errorMsg === "Select Client's Case, If it is not in the above list, create a new client case first."?<span style={{ color: "blue", cursor: "pointer" }}> <u>Create New Case +</u> </span>:''}

      <div className="">
        {type === "listEvents" && cCase !== null && (
          <ClientCaseEvents
            key={cCase?.id}
            clientCase={cCase}
            getNotes={true}
          />
        )}
        {type === "drafting" && cCase !== null && (
          <ClientCaseDocForms
            key={cCase?.id}
            clientCase={cCase}
            type={"drftng"}
            getNotes={true}
          />
        )}
        {type === "filledDocFroms" && cCase !== null && (
          <ClientCaseFilledDocForms key={cCase?.id} clientCase={cCase} />
        )}
        {type === "otherDocForms" && cCase !== null && (
          <ClientCaseDocForms
            key={cCase?.id}
            type={"othr"}
            clientCase={cCase}
          />
        )}
        {type === "caseHearing" && cCase !== null && (
          <ClientCaseDiary
            key={cCase?.id}
            clientCase={cCase}
            getNotes={true}
            nextHearing={nextHearing}
          />
        )}
        {type === "billingPayments" && cCase !== null && (
          <ClientCaseBills
            key={cCase?.id}
            clientCase={cCase}
            selectedClient={selectedClient.user}
          />
        )}
        {type === "research" && cCase !== null && (
          <ClientCaseResearchs key={cCase?.id} clientCase={cCase} />
        )}
        {type === "allRecords" && cCase !== null && (
          <ClientCaseAllDocForms key={cCase?.id} clientCase={cCase} />
        )}
      </div>
      {type === "caseJudgements" && (
        <button
          type="submit"
          style={{
            backgroundColor: "blue",
            color: "#fff",
            borderRadius: "5px",
            borderStyle: "none",
            padding: "10px",
          }}
          onClick={handleSubmit}
        >
          Submit
        </button>
      )}
    </div>
  );
}

export default MainComponent;
