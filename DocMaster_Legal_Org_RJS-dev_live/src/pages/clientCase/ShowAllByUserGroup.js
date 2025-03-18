import { useEffect, useState, Suspense, lazy } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import axios from "axios";
import Modal from "react-modal";
import userStore from "../../zustand/userStore";
import { WsGetOrgUserGroupClientCases } from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";

const AssignCase2UserGroup = lazy(() =>
  import("../../components/clientCase/AssignCase2UserGroup")
);

const AllFeatureDataTable = lazy(() =>
  import("../../GuiComponents/AllFeatureDataTable.table")
);

const Navbar = lazy(() => import("../../components/Navbar"));
const Sidebar = lazy(() => import("../../components/Sidebar"));
const Footer = lazy(() => import("../../components/Footer"));

const ShowAllByUserGroup = () => {
  let navigate = useNavigate();
  const userData = userStore((state) => state.user);

  console.log("userData_", userData);
  const location = useLocation();
  console.log("_location_", location);
  const userGroup = location?.state?.userGroup;

  const [showModalAddCase2UserGroup, setShowModalAddCase2UserGroup] =
    useState(false);

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
    // {
    //   Header: "Next Date",
    //   accessor: "caseNextDate",
    // },
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
      getOrgClients();
    } else {
      window.location.href = "/";
    }
  }, []);

  const getOrgClients = () => {
    axios
      .get(
        WsGetOrgUserGroupClientCases +
          "/" +
          userData.org.id +
          "/" +
          userData.id +
          "/" +
          userGroup.id,
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
      simpleData = simpleData.clientCase;
      simpleData["cType"] = simpleData?.caseType?.type;
      simpleData["sno"] = index + 1;
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
          {/* {userData.crudAccess?.clientCase?.u == 1 ? (
            <i
              className="fa fa-edit mx-2"
              title="Edit"
              style={{ color: "black", cursor: "pointer" }}
              aria-hidden="true"
              // onClick={() => goToUpdateClientCases(simpleData)}
            />
          ) : null} */}
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
    // clientCase["client"] = client;
    navigate("/clientCaseShow", {
      state: {
        clientCase: clientCase,
      },
    });
  };

  // const goToAddCaseToUserGroup = () => {
  //   //[ToDo]: do this using Modal
  //   navigate("/clientCaseAdd2UserGroup", {
  //     state: {
  //       userGroup: userGroup,
  //     },
  //   });
  // };

  const onAssignCase2UserGroupReturn = (flag) => {
    if (flag) {
      setTableData();
      getOrgClients();
    }
    setShowModalAddCase2UserGroup(false);
  };

  return (
    <Suspense fallback={<>Loading...</>}>
      <div className="main_container">
        <Sidebar />
        <Navbar />

        {/* <!-- page content --> */}
        {/* {DevNote: Show Page Content Here} */}
        <div className="right_col" role="main">
          <div className="page-title mb-2">
            <div className="title_left">
              <h3 className="mt-0">Client Case(s)</h3>
            </div>
          </div>

          <div className="clearfix"></div>

          <div className="row">
            <div className="col-md-12 col-sm-12  ">
              {showModalAddCase2UserGroup ? (
                <Modal
                  transparent={false}
                  ariaHideApp={false}
                  isOpen={showModalAddCase2UserGroup}
                  style={{
                    overlay: {
                      width: "100vw",
                      top: "0%",
                      zIndex: 9999,
                    },
                    content: {
                      left: "4%",
                      width: "90vw",
                    },
                  }}
                >
                  <button
                    className="btn btn-danger"
                    style={{ position: "absolute", top: 5, right: 5 }}
                    onClick={() => {
                      setShowModalAddCase2UserGroup(false);
                    }}
                  >
                    Close
                  </button>
                  <br />
                  <div>
                    <AssignCase2UserGroup
                      userGroup={userGroup}
                      onReturn={onAssignCase2UserGroupReturn}
                    />
                  </div>
                </Modal>
              ) : null}
              <div className="x_panel">
                <div className="x_title">
                  <h2>
                    Cases assigned to '{userGroup.title}'
                    <i
                      className="fa fa-plus mx-2"
                      title="Create"
                      style={{ color: "grey", cursor: "pointer" }}
                      aria-hidden="true"
                      onClick={() => setShowModalAddCase2UserGroup(true)}
                    />
                  </h2>
                  <div className="clearfix"></div>
                </div>
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
        {/* <!-- /page content --> */}
        <Footer />
      </div>
    </Suspense>
  );
};

export default ShowAllByUserGroup;
