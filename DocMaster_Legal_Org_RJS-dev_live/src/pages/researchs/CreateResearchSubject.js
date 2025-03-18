import { useEffect, useState, Suspense, lazy } from "react";
import Select from "react-select";
import { useNavigate, useLocation } from "react-router-dom";

import userStore from "../../zustand/userStore";
import axios from "axios";
import {
  WsGetOrgClientCases,
  WsGetOrgClientCasesNew1,
  WsGetOrgClients,
  WsGetOrgClientsNew,
} from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";

const Navbar = lazy(() => import("../../components/Navbar"));
const Sidebar = lazy(() => import("../../components/Sidebar"));
const Footer = lazy(() => import("../../components/Footer"));

const CreateResearch = lazy(() =>
  import("../../components/researchs/CreateResearchSubject")
);

const CreateResearchSubject = () => {
  let navigate = useNavigate();
  const userData = userStore((state) => state.user);
  const [existingClients, setExistingClients] = useState([]);
  const [existingClientCases, setExistingClientCases] = useState([]);
  const [selectedClientCase, setSelectedClientCase] = useState();
  const [errorMsg, setErrorMsg] = useState(
    "Please Select Client, If it is not in the above list, create a new client first."
  );
  const [selectedClient, setSelectedClient] = useState();

  const clientOptions = existingClients.map((client) => ({
    value: client.user.id,
    label: client.user.name,
  }));

  const clientCaseOptions = existingClientCases?.map((clientCase) => ({
    value: clientCase.id,
    label: clientCase.title,
  }));

  useEffect(() => {
    if (
      userData != null &&
      userData != undefined &&
      userData.isLoggedIn != undefined &&
      userData.isLoggedIn
    ) {
    } else {
      window.location.href = "/";
    }
  }, []);

  useEffect(() => {
    getExistingClients();

    return () => {
      setExistingClientCases([]);
      setExistingClients([]);
    };
  }, []);

  const getExistingClients = async () => {
    try {
      const response = await axios.get(
        // `${WsGetOrgClients}/${userData.org.id}/${userData.id}`,
        `${WsGetOrgClientsNew}/${userData.org.id}/${userData.id}`,
        { headers: apiKeyHeader() }
      );
      const responseData = response.data;
      if (responseData.resultCode === 1) {
        // setExistingClients(responseData.resultMessage);
        const newdata = responseData.resultMessage
          .filter((each) => each.isMobileVerify === 1)
          .map((each) => ({
            ...each,
            user: { ...each.user, id: each.id },
          }));
        setExistingClients(newdata);
      } else {
        alert(responseData.result_message);
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  const handleClientChange = async (e) => {
    const selectedClient = existingClients.find(
      (client) => client.user.id === e.value
    );
    setErrorMsg(
      "Select Client's Case, If it is not in the above list, create a new client case first."
    );
    setSelectedClient(selectedClient);
    setSelectedClientCase();
    getExistingClientCases(selectedClient.user.id);
  };

  const getExistingClientCases = async (clientId) => {
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
    }
  };

  const handleClientCaseChange = (e) => {
    const selectedClientCase = existingClientCases.find(
      (clientCase) => clientCase.id === e.value
    );
    setErrorMsg("");
    setSelectedClientCase(selectedClientCase);
  };

  return (
    <Suspense fallback={<>Loading...</>}>
      <div className="main_container mt-0">
        <Sidebar />
        <Navbar />
        <div className="right_col" role="main">
          <div
            className="tab-content"
            style={{ border: "0", paddingLeft: "0", paddingRight: "0" }}
          >
            <div
              className="page-title"
              style={{ marginTop: "0px", width: "100%" }}
            >
              <div className="title_left">
                <h6><span
                    onClick={() => {
                      navigate(-1);
                    }}
                    style={{   cursor: "pointer" }}
                  >
                    Go Back ⬅️
                  </span>&nbsp; Create Research Subject</h6>
              </div>
            </div>
            {existingClients.length > 0 && (
              <>
                <label> Select client:</label>
                <Select
                  onChange={handleClientChange}
                  options={clientOptions}
                  placeholder="Select Client"
                  isSearchable
                />
              </>
            )}

            <br />

            {existingClientCases.length > 0 && (
              <div key={selectedClient.user.id}>
                <label>Select client's case:</label>
                <Select
                  onChange={handleClientCaseChange}
                  options={clientCaseOptions}
                  placeholder="Select Client Case"
                  isSearchable
                />
              </div>
            )}
            <div className="clearfix"></div>
            {selectedClientCase && (
              <div
                // className="row"
                style={{ paddingTop: "20px" }}
              >
                <div className="col-md-12 col-sm-12  ">
                  <div className="x_panel">
                    <div className="x_content">
                      <CreateResearch
                        handleMapWithCase={true}
                        ClientCase={selectedClientCase}
                        key={selectedClientCase.id}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div
              style={{
                paddingTop: "10px",
                color: "red",
                justifyContent: "center",
              }}
            >
              {errorMsg && errorMsg} 
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </Suspense>
  );
};

export default CreateResearchSubject;
