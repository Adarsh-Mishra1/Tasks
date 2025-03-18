import { useEffect, useState, Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import userStore from "../../zustand/userStore";
import { WsGetFileMergeTemplates } from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";

const AllFeatureDataTable = lazy(() =>
  import("../../GuiComponents/AllFeatureDataTable.table")
);

const MergeTemplates = () => {
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
      getFileMergeTemplates();
    } else {
      window.location.href = "/";
    }
  }, []);

  const getFileMergeTemplates = () => {
    axios
      .get(
        WsGetFileMergeTemplates +
          "/" +
          userData.org.id +
          "/" +
          userData.id +
          "/0",
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
    simpleDataArray.map((simpleData, index) => {
      simpleData["sno"] = index + 1;
      simpleData["actiontd"] = (
        <>
          {userData.crudAccess?.fileMerge?.c == 1 ? (
            <i
              className="fa fa-plus mx-2"
              title="View"
              style={{ color: "blue", cursor: "pointer" }}
              aria-hidden="true"
              onClick={() => goToMergeProcess(simpleData)}
            />
          ) : null}
          {/* <i
          className="fa fa-edit mx-2"
          title="Edit"
          style={{ color: "black", cursor: "pointer" }}
          aria-hidden="true"
          // onClick={() => goTo(simpleData)}
        /> */}
        </>
      );

      tempArrayVar.push(simpleData);
    });
    //console.log("_simpleDataArray", simpleDataArray);
    //console.log("_simpleDataArray_tempArrayVar", tempArrayVar);
    // return simpleDataArray;
    return tempArrayVar;
  };

  const goToMergeProcess = (mergeTemplate) => {
    delete mergeTemplate["actiontd"];
    navigate("/mergeProcess", {
      state: {
        mergeTemplate: mergeTemplate,
      },
    });
  };

  return (
    <Suspense fallback={<>Loading...</>}>
      <div>
        <div className="clearfix mb-5"></div>

        <div className="row ">
          <div className="col-md-12 col-sm-12  ">
            <div className="x_panel">
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

export default MergeTemplates;
