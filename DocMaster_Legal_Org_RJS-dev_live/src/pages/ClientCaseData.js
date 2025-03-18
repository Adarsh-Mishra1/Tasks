import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { WsGetOrgClientCasesNew1 } from "../configs/WebService";
import userStore from "../zustand/userStore";
import { apiKeyHeader } from "../configs/ApiKeys";
import Research from "./client/Clients";
import ResearchSubMenu from "./clientCase/subMenuCase";

function ClientCaseData({ componentType }) {
  const [noOfCasesMain, setNoOfCases] = useState({});
  const [orgClientCases, serOrgClientCases] = useState([]);
  const userData = userStore((state) => state.user);

  useEffect(function () {
    getOrgClientCases();
  }, []);

  const getOrgClientCases = async () => {
    const loader = toast.success("Loading...", { autoClose: false });
    await axios
      .get(
        WsGetOrgClientCasesNew1 + "/" + userData.org.id + "/" + userData.id,
        {
          headers: apiKeyHeader(),
        }
      )
      .then(async (response) => {
        const responseData = response.data;

        if (responseData.resultCode === 1) {
          await toast.dismiss(loader);
          const filteredRecords = responseData.resultMessage.filter(
            (each) => each.client.lorg_link_client !== null
          );
          const totalNoOfCases = filteredRecords.length;
          const activeCases = filteredRecords.filter(
            (each) => each.caseStatus === 1
          ).length;
          const closedCases = filteredRecords.filter(
            (each) => each.caseStatus === 0
          ).length;
          setNoOfCases({
            totalNoOfCases,
            activeCases,
            closedCases,
          });
          serOrgClientCases(filteredRecords);
        } else {
          await toast.dismiss(loader);
          if (!responseData.resultMessage === "No data found") {
            alert(" Client Cases: " + responseData.resultMessage);
          }
        }
      })
      .catch(async (error) => {
        console.error("error", error);
        toast.error("Error getting no of cases.", { autoClose: 3000 });
      });
  };

  return (
    <div>
      {componentType === "client" && <Research noOfCasesMain={noOfCasesMain} />}
      {componentType === "case" && (
        <ResearchSubMenu
          noOfCasesMain={noOfCasesMain}
          orgClientCases={orgClientCases}
          getOrgClientCases={getOrgClientCases}
        />
      )}
    </div>
  );
}

export default ClientCaseData;
