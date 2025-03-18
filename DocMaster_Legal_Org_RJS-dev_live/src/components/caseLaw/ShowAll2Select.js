import { useEffect, Suspense, lazy, useState } from "react";
import axios from "axios";
import { WsGetCaseLaws } from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";
import userStore from "../../zustand/userStore";

const AllFeatureDataTable = lazy(() =>
  import("../../GuiComponents/AllFeatureDataTable.table")
);

const ShowAll2Select = (props) => {
  const userData = userStore((state) => state.user);
  console.log("userData_", userData);

  const tableColumns = [
    {
      Header: "S. No",
      accessor: "sno",
    },
    {
      Header: "Parties Name",
      accessor: "partiesName",
    },
    {
      Header: "Court",
      accessor: "court",
    },
    {
      Header: "Judgement Date",
      accessor: "judgementDate",
    },
    {
      Header: "Actions",
      accessor: "actiontd",
    },
  ];

  const [tableData, setTableData] = useState();

  useEffect(() => {
    if (
      userData != null &&
      userData != undefined &&
      userData.isLoggedIn != undefined &&
      userData.isLoggedIn
    ) {
      getOrgClients();
    } else {
      window.location.href = "/";
    }
  }, []);

  const getOrgClients = () => {
    axios
      .get(WsGetCaseLaws + "/1/" + userData.id, {
        headers: apiKeyHeader(),
      })
      .then((response) => {
        const responseData = response.data;
        console.log("_responseData", responseData);
        if (responseData.resultCode === 1) {
          setTableData(processCaseLawsData(responseData.resultMessage));
        } else {
          alert(" Clients: " + responseData.resultMessage);
          // setErrorMsg(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("error", error);
        // setErrorMsg("Error while processing");
      });
  };

  const processCaseLawsData = (simpleDataArray) => {
    let tempArrayVar = [];
    simpleDataArray.map((simpleData, index) => {
      simpleData["sno"] = index + 1;
      simpleData["actiontd"] = (
        <>
          <i
            data-tip="Select"
            title="Select"
            key={`Select${index}`}
            className="fa fa-arrows mx-2"
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => select2add2casemap(simpleData)}
            aria-hidden="true"
          />
        </>
      );

      tempArrayVar.push(simpleData);
    });
    return tempArrayVar;
  };

  const select2add2casemap = (caseLaw) => {
    delete caseLaw["actiontd"]; //Bug(If Not Using): Point To Be Notted
    props?.onSelectReturn(caseLaw);    
  };

  return (
    <Suspense fallback={<>Loading...</>}>
      {tableData && tableData.length > 0 ? (
        <AllFeatureDataTable columns={tableColumns} data={tableData} />
        
      ) : null}
    </Suspense>
  );
};

export default ShowAll2Select;
