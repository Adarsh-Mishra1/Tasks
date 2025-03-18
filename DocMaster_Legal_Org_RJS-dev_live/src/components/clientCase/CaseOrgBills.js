import { useEffect, useState } from "react";
import AllFeatureDataTable from "../../GuiComponents/AllFeatureDataTable.table";
import { apiKeyHeader } from "../../configs/ApiKeys";
import { WsGetCaseOrgBills } from "../../configs/WebService";
import userStore from "../../zustand/userStore";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment/moment";

function CaseOrgBills() {
  const [caseOrgBills, setCaseOrgBills] = useState([]);
  const userData = userStore((state) => state.user);

  useEffect(function () {
    getOrgCaseBills();
  }, []);

  const tableColumns = [
    {
      Header: "S. No",
      accessor: "sno",
    },
    {
      Header: "Case Name",
      accessor: "caseName",
    },
    {
      Header: "Nature of Transaction",
      accessor: "typeTxt",
    },
    {
      Header: "Title of the case",
      accessor: "sampleTxt",
    },
    {
      Header: "Amount (₹)",
      accessor: "amount",
    },
    {
      Header: "Date",
      accessor: "dateTimeTxt",
    },
  ];

  const getOrgCaseBills = () => {
    const loader = toast.success("Loading...", { autoClose: false });
    axios
      .get(WsGetCaseOrgBills + `?orgId=${userData.org.id}`, {
        headers: apiKeyHeader(),
      })
      .then((response) => {
        const responseData = response.data;
        setCaseOrgBills(processOrgBills(responseData));
        toast.dismiss(loader);
      })
      .catch((error) => {
        console.error("error", error);
        toast.dismiss(loader);
        toast.error("Error Getting Org Bills.", { autoClose: 3000 });
      });
  };

  const processOrgBills = (simpleDataArray) => {
    console.log("simpleDataArray_59: ", simpleDataArray);
    simpleDataArray.map((simpleData, index) => {
      simpleData["sno"] = index + 1;
      simpleData["typeTxt"] = "";
      if (simpleData.type == "paid") {
        simpleData["typeTxt"] = "Amount Chargeable";
      }
      if (simpleData.type == "receive") {
        simpleData["typeTxt"] = "Amount Received";
      }

      simpleData["dateTimeTxt"] = moment(simpleData.date_time).format(
        "DD-MM-YYYY"
      );
      simpleData["caseName"] = simpleData.case_title;
      simpleData["sampleTxt"] = simpleData.payment_type;
    });
    return simpleDataArray;
  };

  return (
    <div className="mt-5">
      {caseOrgBills.length > 0 && (
          <AllFeatureDataTable columns={tableColumns} data={caseOrgBills} />
      )}
      {caseOrgBills.length === 0 && <div>No data Found</div>}
    </div>
  );
}

export default CaseOrgBills;
