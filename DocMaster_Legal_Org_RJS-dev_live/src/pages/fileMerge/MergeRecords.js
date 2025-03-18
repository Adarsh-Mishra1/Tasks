import { useEffect, useState, Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import userStore from "../../zustand/userStore";
import { WsGetFileMergeOrgRecord } from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";

const AllFeatureDataTable = lazy(() =>
  import("../../GuiComponents/AllFeatureDataTable.table")
);

const MergeRecords = () => {
  let navigate = useNavigate();
  const userData = userStore((state) => state.user);

  const tableColumns = [
    {
      Header: "S. No",
      accessor: "sno",
    },
    {
      Header: "Title",
      accessor: "title",
    },
    {
      Header: "Action(s)",
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
      getFileMergeOrgRecord();
    } else {
      window.location.href = "/";
    }
  }, []);

  const getFileMergeOrgRecord = () => {
    axios
      .get(
        WsGetFileMergeOrgRecord + "/" + userData.org.id + "/" + userData.id,
        {
          headers: apiKeyHeader(),
        }
      )
      .then((response) => {
        const responseData = response.data;
        console.log("_responseData", responseData);
        if (responseData.resultCode === 1) {
          setTableData(processOrgClientsMappedData(responseData.resultMessage));
        } else {
          alert(" Client Cases: " + responseData.resultMessage);
          // setErrorMsg(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("error", error);
        // setErrorMsg("Error while processing");
      });
  };

  const processOrgClientsMappedData = (simpleDataArray) => {
    let tempArrayVar = [];
    simpleDataArray=simpleDataArray.slice().reverse();
    simpleDataArray.map((simpleData, index) => {
      simpleData["sno"] = index + 1;
      simpleData["actiontd"] = (
        <>
          {userData.crudAccess?.fileMerge?.u == 1 ? (
            <i
              className="fa fa-eye mx-2"
              title="View"
              style={{ color: "blue", cursor: "pointer" }}
              aria-hidden="true"
              onClick={() => goToMergeProcess(simpleData)}
            />
          ) : null}
        </>
      );

      tempArrayVar.push(simpleData);
    });
    return tempArrayVar;
  };

  const goToMergeProcess = (mergeTemplate) => {
    delete mergeTemplate["actiontd"];
    navigate("/mergeProcess", {
      state: {
        userMergeData: mergeTemplate,
      },
    });
  };

  return (
    <Suspense fallback={<>Loading...</>}>
      <div>
        <div className="clearfix mb-5"></div>
        <div className="row">
          <div className="col-md-12 col-sm-12  ">
            <div className="x_panel">
              {/* <div className="x_title">
                <h2>File Merge Templates</h2>
                <div className="clearfix"></div>
              </div> */}
              <div className="x_content">
                {tableData && tableData.length > 0 ? (
                   
                    <AllFeatureDataTable
                      columns={tableColumns}
                      data={tableData}
                    />
                   
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default MergeRecords;
