import { useEffect, useState, Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom";

import userStore from "../../zustand/userStore";
import { apiKeyHeader } from "../../configs/ApiKeys";
import EditCase from "../../components/clientCase/EditCase";
import { toast } from "react-toastify";
import {
  UpdateCaseStatus,
  WsGetOrgClientCasesNew,
  WsGetOrgClientCasesNew1,
} from "../../configs/WebService";

const AllFeatureDataTable = lazy(() =>
  import("../../GuiComponents/AllFeatureDataTable.table")
);

const ClientShowAll = ({
  handleCreateNewCase,
  orgClientCases,
  noOfCasesMain,
  getOrgClientCases,
}) => {
  let navigate = useNavigate();
  const [editingCase, SetEditingCase] = useState(null);
  const [noOfCases, setNoOfCases] = useState({});

  const [editingCaseDetails, setEditingCaseDetails] = useState();

  const userData = userStore((state) => state.user);

  const tableColumns = [
    {
      Header: "S. No",
      accessor: "sno",
    },
    {
      Header: "Title of the Case",
      accessor: "title",
    },
    {
      Header: "Client",
      accessor: "clientTxt",
    },
    {
      Header: "Case Type",
      accessor: "cType",
    },
    // {
    //   Header: "No of Cases",
    //   accessor: "noofCases",
    // },
    {
      Header: "Next Date",
      accessor: "caseNextDate",
    },
    {
      Header: "Case Status",
      accessor: "caseStatus",
      Cell: ({ value }) => (value === 1 ? "Active" : "Closed"),
    },
    // {
    //   Header: "Particulars",
    //   accessor: "caseParticulars",
    // },

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
      // getOrgClientCases();
    } else {
      window.location.href = "/";
    }
  }, []);

  useEffect(
    function () {
      setNoOfCases({
        totalNoOfCases: noOfCasesMain.totalNoOfCases,
        activeCases: noOfCasesMain.activeCases,
        closedCases: noOfCasesMain.closedCases,
      });
      setTableData(processOrgClientsMappedData(orgClientCases));
    },
    [noOfCasesMain, orgClientCases]
  );

  useEffect(
    function () {
      setEditingCaseDetails({
        id: editingCase?.id,
        title: editingCase?.title,
        details: editingCase?.details,
        caseType: editingCase?.caseType.id,
        orgId: userData.org.id,
        userId: userData.id,
        // clientId: editingCase?.client?.id,
        clientId: editingCase?.client?.lorg_link_client,
        docformsIds: null,
      });
    },
    [editingCase, userData]
  );

  // const getOrgClientCases = async () => {
  //   const loader = toast.success("Loading...", { autoClose: false });
  //   await axios
  //     .get(
  //       // WsGetOrgClientCasesNew +
  //       WsGetOrgClientCasesNew1 +
  //         // localAPI
  //         "/" +
  //         userData.org.id +
  //         "/" +
  //         userData.id,
  //       {
  //         headers: apiKeyHeader(),
  //       }
  //     )
  //     .then(async (response) => {
  //       const responseData = response.data;

  //       if (responseData.resultCode === 1) {
  //         await toast.dismiss(loader);
  //         const filteredRecords = responseData.resultMessage.filter(
  //           (each) => each.client.lorg_link_client !== null
  //         );
  //         const totalNoOfCases = filteredRecords.length;
  //         const activeCases = filteredRecords.filter(
  //           (each) => each.caseStatus === 1
  //         ).length;
  //         const closedCases = filteredRecords.filter(
  //           (each) => each.caseStatus === 0
  //         ).length;
  //         setNoOfCases({
  //           totalNoOfCases,
  //           activeCases,
  //           closedCases,
  //         });
  //         setTableData(processOrgClientsMappedData(filteredRecords));
  //         // setTableData(processOrgClientsMappedData(responseData.resultMessage));
  //       } else {
  //         await toast.dismiss(loader);
  //         if (!responseData.resultMessage === "No data found") {
  //           alert(" Client Cases: " + responseData.resultMessage);
  //         }
  //         // setErrorMsg(responseData.resultMessage);
  //         // await toast.dismiss(loader);
  //         // toast.error("Error upading case.", { autoClose: 1000 });
  //       }
  //     })
  //     .catch(async (error) => {
  //       console.error("error", error);
  //       // setErrorMsg("Error while processing");
  //       // await toast.dismiss(loader);
  //       toast.error("Error getting cases.", { autoClose: 3000 });
  //     });
  //   // toast.dismiss(loader);
  // };

  const processOrgClientsMappedData = (simpleDataArray) => {
    let tempArrayVar = [];
    simpleDataArray.map((simpleData, index) => {
      simpleData["sno"] = index + 1;
      simpleData["clientTxt"] = simpleData?.client?.name;
      simpleData["cType"] = simpleData?.caseType?.type;

      simpleData["caseNextDate"] = simpleData?.caseDiary?.nextdate;
      // simpleData["caseParticulars"] = simpleData?.caseDiary?.particulars;

      simpleData["actiontd"] = (
        <>
          {userData.crudAccess?.clientCase?.r == 1 ? (
            <i
              className="fa fa-eye mx-2"
              title="View"
              style={{ color: "blue", cursor: "pointer" }}
              aria-hidden="true"
              onClick={() => goToViewClientCase(simpleData)}
            />
          ) : null}
          {/* {userData.crudAccess?.clientCase?.u == 1 && !simpleData.isEditable ? (
            <i
              className="fa fa-edit mx-2"
              title="Edit"
              style={{ color: "black", cursor: "pointer" }}
              aria-hidden="true"
              onClick={() => SetEditingCase(simpleData)}
            />
          ) : null} */}
          {userData.crudAccess?.clientCase?.u == 1 ? (
            <i
              className="fa fa-edit mx-2"
              title={simpleData.isEditable ? "Not in Edit Mode" : "Edit"}
              style={{
                color: simpleData.isEditable ? "gray" : "black",
                cursor: simpleData.isEditable ? "not-allowed" : "pointer",
              }}
              aria-hidden="true"
              onClick={() => {
                if (simpleData.isEditable) {
                  alert(
                    "You cannot edit this case. You can only edit it before creating the case documents."
                  );
                } else {
                  SetEditingCase(simpleData);
                }
              }}
            />
          ) : null}
          {simpleData.caseStatus === 1 ? (
            <i
              className="fa fa-trash mx-2"
              title="Close Case"
              style={{ color: "red", cursor: "pointer" }}
              aria-hidden="true"
              onClick={() => handleCloseCase(simpleData.id)}
            />
          ) : (
            <i
              className="fa fa-trash mx-2"
              title="Case Already Closed"
              style={{ color: "gray", cursor: "not-allowed" }}
              aria-hidden="true"
              onClick={() => alert("This case is already closed.")}
            />
          )}
        </>
      );

      tempArrayVar.push(simpleData);
    });
    //console.log("_simpleDataArray", simpleDataArray);
    //console.log("_simpleDataArray_tempArrayVar", tempArrayVar);
    // return simpleDataArray;
    return tempArrayVar;
  };

  const goToViewClientCase = (clientCase) => {
    console.log("clientCase: ", clientCase);
    delete clientCase["actiontd"]; //Bug(If Not Using): Point To Be Notted
    navigate("/clientCaseShow", {
      state: {
        clientCase: clientCase,
      },
    });
  };

  const handleCloseCase = async (caseId) => {
    const loader = toast.success("Loading...", { autoClose: false });
    try {
      if (window.confirm("Are you sure you want to close this case?")) {
        const updateResponse = await fetch(UpdateCaseStatus, {
          method: "POST",
          headers: apiKeyHeader(),
          body: JSON.stringify({
            id: caseId,
            caseStatus: 0,
          }),
        });

        if (!updateResponse.ok) {
          throw new Error(
            `Failed to update the case status. Status: ${updateResponse.status}`
          );
        }

        alert("Case has been successfully closed.");
        // getOrgClientCases();
        window.location.reload();
      }
    } catch (error) {
      console.error("Error closing the case:", error);
      alert("An error occurred while closing the case. Please try again.");
    } finally {
      toast.dismiss(loader);
    }
  };

  return (
    <Suspense fallback={<>Loading...</>}>
      <div className="main_container">
        <div className="page-title mb-2">
          <div className="title_left">
            <h3 className="mt-0">
              Client & Case{" "}
              <span style={{ fontSize: "17px" }} onClick={handleCreateNewCase}>
                (
                <span style={{ color: "blue", cursor: "pointer" }}>
                  Create New Case +
                </span>
                )
              </span>
              &nbsp;|&nbsp;
              <span>No of Cases: {noOfCases.totalNoOfCases}</span>&nbsp;|&nbsp;
              <span>Active Cases: {noOfCases.activeCases}</span>
              &nbsp;|&nbsp;<span>Closed Cases: {noOfCases.closedCases}</span>
            </h3>
          </div>
        </div>

        <div className="clearfix"></div>

        <div className="row">
          <div className="col-md-12 col-sm-12  ">
            <div className="x_panel">
              <div className="x_content">
                {tableData && tableData.length > 0 && editingCase === null && (
                  <div className=" ">
                    <AllFeatureDataTable
                      columns={tableColumns}
                      data={tableData}
                    />
                  </div>
                )}

                {/* edit case form */}
                {editingCase !== null && (
                  <EditCase
                    SetEditingCase={SetEditingCase}
                    editingCaseDetails={editingCaseDetails}
                    setEditingCaseDetails={setEditingCaseDetails}
                    getOrgClientCases={getOrgClientCases}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default ClientShowAll;
