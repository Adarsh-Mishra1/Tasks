import { useEffect, Suspense, lazy, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { WsGetCaseLaws } from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";
import userStore from "../../zustand/userStore";

const AllFeatureDataTable = lazy(
  () => import("../../GuiComponents/AllFeatureDataTable.table"),
);
const Navbar = lazy(() => import("../../components/Navbar"));
const Sidebar = lazy(() => import("../../components/Sidebar"));
const Footer = lazy(() => import("../../components/Footer"));

const CaseLawShowAll = () => {
  let navigate = useNavigate();
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
      
      simpleData["isPublishedTxt"] =
        simpleData.isPublished == 1 ? "Published" : "Not Published";
      simpleData["actiontd"] = (
        <>
        {/* //ToDo: need clearity regarding which will be edited by which user */}
        {/* {userData.crudAccess?.clientCase?.c == 1 ? (
            <i
            data-tip="Edit"
            title="Edit"
            key={`Edit${index}`}
            className="fa fa-edit mx-2"
            style={{ color: "blue", cursor: "pointer" }}
            // onClick={() => editConfirmation(simpleData)}
            aria-hidden="true"
          />
          ) : null} */}

          {/* {userData.crudAccess?.clientCase?.r == 1 ? (
            <i
              className="fa fa-briefcase mx-2"
              title="Cases"
              style={{ color: "green", cursor: "pointer" }}
              aria-hidden="true"
              onClick={() => goToClientCases(simpleData)}
            />
          ) : null} */}
        </>
      );

      tempArrayVar.push(simpleData);
    });
    return tempArrayVar;
  };

  const goToClientCases = (client) => {
    delete client["actiontd"]; //Bug(If Not Using): Point To Be Notted
    navigate("/clientCaseShowAllByClient", {
      state: {
        client: client,
      },
    });
  };

  const goToAddCaseForClient = (client) => {
    delete client["actiontd"]; //Bug(If Not Using): Point To Be Notted
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
        <div className="right_col" role="main">
          <div className="page-title">
            <div className="title_left pt-2">
              <h3>Case Law(s) <a href="/caseLawCreate"><i
              className="fa fa-plus mx-2"
              title="Cases"
              style={{ color: "green", cursor: "pointer" }}
              aria-hidden="true"/></a></h3>
            </div>
          </div>

          <div className="clearfix"></div>

          <div className="row">
            <div className="col-md-12 col-sm-12  ">
              <div className="x_panel">
                <div className="x_content">
                  {tableData && tableData.length > 0 ? (
                    <div className=" ">
                      <AllFeatureDataTable
                        columns={tableColumns}
                        data={tableData}
                      />
                    </div>
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

export default CaseLawShowAll;
