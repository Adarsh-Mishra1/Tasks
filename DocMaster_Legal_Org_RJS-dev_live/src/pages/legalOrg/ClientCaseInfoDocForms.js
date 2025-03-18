import { useEffect, useState, Suspense, lazy } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import axios from "axios";

import userStore from "../../zustand/userStore";
import { WsGetLegalGeneralDocForm } from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";

const AllFeatureDataTable = lazy(() =>
  import("../../GuiComponents/AllFeatureDataTable.table")
);
const Navbar = lazy(() => import("../../components/Navbar"));
const Sidebar = lazy(() => import("../../components/Sidebar"));
const Footer = lazy(() => import("../../components/Footer"));

const ClientCaseInfoDocForms = () => {
  let navigate = useNavigate();
  const userData = userStore((state) => state.user);
  // const location = useLocation();

  const tableColumns = [
    {
      Header: "S. No",
      accessor: "sno",
    },
    {
      Header: "Title of the Case",
      accessor: "nameTitle",
    },
    // {
    //   Header: "Category",
    //   accessor: "categoryTxt",
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
        WsGetLegalGeneralDocForm +
          "/" +
          userData.org.id +
          "/" +
          userData.id +
          "/clntinfo",
        {
          headers: apiKeyHeader(),
        }
      )
      .then(async (response) => {
        const responseData = response.data;
        if (responseData.resultCode === 1) {
          console.log(responseData.resultMessage);
          const publishedProblemInfo = await responseData.resultMessage.filter(
            (eachDoc) => {
              console.warn(eachDoc.docform);
              return eachDoc.docform.isProblemInfo == 1;
              // return eachDoc.docform.isPublished === 2;
            }
          );
          setTableData(processLegalDocForms(publishedProblemInfo));
          // setTableData(processLegalDocForms(responseData.resultMessage));
        } else {
          if(!responseData.resultMessage === "No data found"){
          alert("Client Case Info DocForm(s): " + responseData.resultMessage);
          }
          // setErrorMsg(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("error", error);
        // setErrorMsg("Error while processing");
      });
  };

  const processLegalDocForms = (simpleDataArray) => {
    let tempArrayVar = [];
    simpleDataArray.map((simpleData, index) => {
      simpleData = simpleData.docform;
      simpleData["sno"] = index + 1;
      // simpleData["categoryTxt"] = simpleData.category?.category;
      simpleData["actiontd"] = (
        <>
          <i
            className="fa fa-arrow-right mx-2"
            title="Start/Create"
            style={{ color: "blue", cursor: "pointer" }}
            aria-hidden="true"
            onClick={() => goToClientCaseInfoDocFormFill(simpleData)}
          />
        </>
      );

      tempArrayVar.push(simpleData);
    });
    //console.log("_simpleDataArray", simpleDataArray);
    //console.log("_simpleDataArray_tempArrayVar", tempArrayVar);
    return tempArrayVar;
  };

  const goToClientCaseInfoDocFormFill = (clientInfoLegalDocForm) => {
    delete clientInfoLegalDocForm["actiontd"]; //Bug(If Not Using): Point To Be Notted
    navigate("/clientCaseInfoDocFormFill", {
      state: {
        clientInfoLegalDocForm: clientInfoLegalDocForm,
        isJudgement: 0,
        isProblemInfo: 1,
      },
    });
  };

  return (
    <Suspense fallback={<>Loading...</>}>
      <div className="main_container">
        {/* <Sidebar /> */}
        {/* <Navbar /> */}

        {/* <!-- page content --> */}
        {/* {DevNote: Show Page Content Here} */}
        {/* <div className="right_col" role="main"> */}
        {/* <div className="page-title">
          <div className="title_left">
            <h3>
              Problem Info{" "}
              <span className="small-text">
                {" "}
                (Choose your problem from below list, fill the questions)
              </span>
            </h3>
          </div>
        </div> */}

        <br />
        <div className="clearfix"></div>

        <div className="row">
          <div className="col-md-12 col-sm-12  ">
            <div className="x_panel">
              {/* <div className="x_title">
                  <h2>Problem Info</h2>
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
      {/* <!-- /page content --> */}

      {/* <Footer /> */}
      {/* </div> */}
    </Suspense>
  );
};

export default ClientCaseInfoDocForms;
