import { useEffect, useState, Suspense, lazy } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import axios from "axios";

import userStore from "../../zustand/userStore";
import {
  UpdateCaseStatus,
  WsGetOrgClientCases,
  WsGetOrgClientCasesNew,
  WsGetOrgClientCasesNew1,
} from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";
import EditCase from "../../components/clientCase/EditCase";
import { toast } from "react-toastify";

const AllFeatureDataTable = lazy(() =>
  import("../../GuiComponents/AllFeatureDataTable.table")
);

const Navbar = lazy(() => import("../../components/Navbar"));
const Sidebar = lazy(() => import("../../components/Sidebar"));
const Footer = lazy(() => import("../../components/Footer"));

const ShowAllByClient = () => {
  let navigate = useNavigate();
  const userData = userStore((state) => state.user);
  const [editingCase, SetEditingCase] = useState(null);
  const [editingCaseDetails, setEditingCaseDetails] = useState();
  const [noOfCases, setNoOfCases] = useState({});

  console.log("userData_", userData);
  const location = useLocation();
  console.log("_location_", location);
  const client = location?.state?.client;

  const [clientCases, setClientCases] = useState();

  const [errorMsg, setErrorMsg] = useState("");

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
      Header: "Type",
      accessor: "cType",
    },
    {
      Header: "Next Date",
      accessor: "caseNextDate",
    },
    {
      Header: "Particulars",
      accessor: "caseParticulars",
    },
    {
      Header: "Case Status",
      accessor: "caseStatus",
      Cell: ({ value }) => (value === 1 ? "Active" : "Closed"),
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
      getOrgClients();
    } else {
      window.location.href = "/";
    }
  }, []);

  useEffect(
    function () {
      console.log("editingCase_81: ", editingCase);
      setEditingCaseDetails({
        id: editingCase?.id,
        title: editingCase?.title,
        details: editingCase?.details,
        caseType: editingCase?.caseType?.id || null,
        orgId: userData.org.id,
        userId: userData.id,
        clientId: client?.id,
        // clientId: editingCase?.client?.id,
        docformsIds: null,
      });
    },
    [editingCase, userData]
  );

  const getOrgClients = () => {
    // WsGetOrgClientCasesNew
    // WsGetOrgClientCasesNew
    axios
      .get(
        WsGetOrgClientCasesNew1 +
          // WsGetOrgClientCasesNew +
          // WsGetOrgClientCases +
          "/" +
          userData.org.id +
          "/" +
          userData.id +
          "/" +
          client.id,
        {
          headers: apiKeyHeader(),
        }
      )
      .then((response) => {
        const responseData = response.data;
        console.log("_responseData", responseData);
        if (responseData.resultCode === 1) {
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
          setTableData(processOrgClientsMappedData(filteredRecords));
          // setTableData(processOrgClientsMappedData(responseData.resultMessage));
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
        getOrgClients();
      }
    } catch (error) {
      console.error("Error closing the case:", error);
      alert("An error occurred while closing the case. Please try again.");
    } finally {
      toast.dismiss(loader);
    }
  };

  const processOrgClientsMappedData = (simpleDataArray) => {
    let tempArrayVar = [];
    simpleDataArray.map((simpleData, index) => {
      console.log("simpleData_130: ", simpleData);
      simpleData["sno"] = index + 1;
      simpleData["cType"] = simpleData?.caseType?.type;

      simpleData["caseNextDate"] = simpleData?.caseDiary?.nextdate;
      simpleData["caseParticulars"] = simpleData?.caseDiary?.particulars;
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
              // onClick={() => goToUpdateClientCases(simpleData)}
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
    delete clientCase["actiontd"]; //Bug(If Not Using): Point To Be Notted
    clientCase["client"] = client;
    navigate("/clientCaseShow", {
      state: {
        clientCase: clientCase,
      },
    });
  };

  const goToAddCaseForClient = () => {
    navigate("/clientCaseCreate", {
      state: {
        client: client,
      },
    });
  };

  return (
    <Suspense fallback={<>Loading...</>}>
      <div className="main_container">
        <Sidebar />
        <Navbar />

        {/* <!-- page content --> */}
        {/* {DevNote: Show Page Content Here} */}
        <div className="right_col" role="main" style={{ minHeight: "100vh",overflowY:"auto" }}>
          <div className="page-titl mt-2">
            {/* mb-5 */}
            <div className="title_left">
              {/* <span>Back</span> */}
              <h6 className="mt-0">All Cases related to {client.name}
               
                 
                  (<span
                    style={{
                      fontSize: "17px",
                      color: "blue",
                      cursor: "pointer",
                    }}
                    onClick={() => goToAddCaseForClient()}
                  >
                    Add New Case +
                    {/* Add New Case for {client.name} + */}
                  </span>){" "}
                  
                  |{" "}
                  <span style={{ fontSize: "16px" }}>
                    No of Cases: {noOfCases.totalNoOfCases}
                  </span>
                  &nbsp;| &nbsp;
                  <span style={{ fontSize: "16px" }}>
                    Active Cases: {noOfCases.activeCases}
                  </span>
                  &nbsp;|&nbsp;
                  <span style={{ fontSize: "16px" }}>
                    Closed Cases: {noOfCases.closedCases}
                  </span>
                 </h6>
                 <h6
                    style={{
                      fontSize: "16px",
                      color: "blue",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      navigate(-1);
                    }}
                  >
                    Go Back ⬅️
                  </h6>
               
            </div>
          </div>

          <div className="clearfix"></div>

          <div className="row">
            <div className="col-md-12 col-sm-12  ">
              <div className="x_panel">
                {/* <div className="x_title">
                  <h2>
                    {client.name} Case(s){" "}
                    <i
                      className="fa fa-plus mx-2"
                      title="Create"
                      style={{ color: "grey", cursor: "pointer" }}
                      aria-hidden="true"
                      onClick={() => goToAddCaseForClient()}
                    />
                  </h2>

                  <div className="clearfix"></div>
                </div> */}
                <div className="x_content">
                  {tableData && tableData.length > 0 && editingCase === null ? (
                    <div className=" ">
                      <AllFeatureDataTable
                        columns={tableColumns}
                        data={tableData}
                      />
                    </div>
                  ) : null}
                  {editingCase !== null && (
                    <EditCase
                      SetEditingCase={SetEditingCase}
                      editingCaseDetails={editingCaseDetails}
                      setEditingCaseDetails={setEditingCaseDetails}
                      getOrgClientCases={getOrgClients}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- /page content --> */}

        <Footer />
      </div>
    </Suspense>
  );
};

export default ShowAllByClient;
