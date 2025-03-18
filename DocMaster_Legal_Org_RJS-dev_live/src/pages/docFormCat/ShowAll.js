//ShowAll.js Category//
import React, { useState, useEffect, Suspense, lazy } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { confirmAlert } from "react-confirm-alert"; // Import Dep
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { toast } from "react-toastify";

import {
  WSReadDocFormCategories, //Java
  WSDeleteDocFormCategory, //Java
} from "../../configs/WebService";

import {} from // WSReadDocFormCategories, //Node
// WSDeleteDocFormCategory, //Node
"../../configs/WebServiceNodeJS";

import { apiKeyHeader } from "../../configs/ApiKeys";

import userStore from "../../zustand/userStore";

import AllFeatureDataTable from "../../GuiComponents/AllFeatureDataTable.table";

const Navbar = lazy(() => import("../../components/Navbar"));
const Sidebar = lazy(() => import("../../components/Sidebar"));
const Footer = lazy(() => import("../../components/Footer"));

const ShowAll = () => {
  let navigate = useNavigate();

  const userData = userStore((state) => state.user);

  const [errorMsg, setErrorMsg] = useState("");
  const [orgUsers, setOrgUsers] = useState([]);

  const dataTableColumns = [
    {
      Header: "S. No",
      accessor: "sno",
    },
    {
      Header: "Category",
      // accessor: "name",
      accessor: "category",
    },
    {
      Header: "Description",
      accessor: "description",
    },
    {
      Header: "Actions",
      accessor: "actiontd",
    },
  ];

  useEffect(() => {
    getOrgDocFormCategory();
  }, []);

  const getOrgDocFormCategory = () => {
    toast.success("Loading ...", {
      autoClose: 50,
    });

    axios
      .get(WSReadDocFormCategories + "/" + userData.org.id, {
        headers: apiKeyHeader(),
      })
      .then((response) => {
        const responseData = response.data;
        console.log("getOrgDocFormCategory_responseData", responseData);
        if (responseData.result_code === 1) {
          setOrgUsers(processData(responseData.result_message));
        } else {
          alert(responseData.result_message);
          setErrorMsg(responseData.result_message);
        }
      })
      .catch((error) => {
        console.error("getOrgUsers_error", error);
        setErrorMsg("Error while processing");
      });
  };

  const processData = (simpleDataArray) => {
    // let blankData = [];
    simpleDataArray.map((simpleData, index) => {
      console.log("processData_simpleData", simpleData);

      simpleData["sno"] = index + 1;
      simpleData["actiontd"] = (
        <>
          {userData.crudAccess?.docFormCat.u == 1 ? (
            <i
              data-tip="Edit"
              title="Edit"
              key={`Edit${index}`}
              className="fa fa-pencil mx-2"
              style={{ color: "blue", cursor: "pointer" }}
              aria-hidden="true"
              onClick={() => go2EditCategory(simpleData)}
            ></i>
          ) : null}

          {userData.crudAccess?.docFormCat.d == 1 ? (
            <i
              title="Delete"
              data-tip="Delete from Org"
              className="fa fa-trash mx-2"
              style={{ color: "red", cursor: "pointer" }}
              onClick={() => delAlert(simpleData)}
              aria-hidden="true"
            ></i>
          ) : null}
        </>
      );
      // blankData.push(simpleData);
    });
    // return blankData;

    return simpleDataArray;
  };

  const go2EditCategory = (category) => {
    delete category["actiontd"]; //DevNote:Needed
    navigate("/docFormCategoryEdit", {
      state: {
        category2edit: category,
      },
    });
  };

  const delAlert = (category) => {
    confirmAlert({
      title: "Confirm!",
      message: "Sure to Delete Category",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            proceedToDelete(category.id);
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  const proceedToDelete = (recId) => {
    toast.success("Deleting ...", {
      autoClose: 50,
    });

    axios
      .get(WSDeleteDocFormCategory + "/" + recId + "/" + userData.id, {
        headers: apiKeyHeader(),
      })
      .then((response) => {
        const responseData = response.data;
        console.log("proceedToDelete_responseData", responseData);
        if (responseData.result_code === 1) {
          window.location.reload();
        } else {
          alert(responseData.result_message);
          setErrorMsg(responseData.result_message);
        }
      })
      .catch((error) => {
        console.error("proceedToDelete_error", error);
        setErrorMsg("Error while processing");
      });
  };

  return (
    <Suspense fallback={<>Loading...</>}>
      <div className="main_container">
        <Sidebar />
        <Navbar />

        {/* <!-- page content --> */}
        <div className="right_col" role="main">
          <div className="page-title">
            <div className="title_left">
              <h3>Categories</h3>
            </div>

            {/* <div className="title_right">
                <div className="col-md-5 col-sm-5   form-group pull-right top_search">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search for..."
                    />
                    <span className="input-group-btn">
                      <button className="btn btn-default" type="button">
                        Go!
                      </button>
                    </span>
                  </div>
                </div>
              </div> */}
          </div>

          <div className="clearfix"></div>

          <div className="row">
            <div className="col-md-12 col-sm-12  ">
              <div className="x_panel">
                 
                <div className="x_content">
                  {errorMsg ? (
                    <div>
                      <b>{errorMsg}</b>
                    </div>
                  ) : null}

                  {orgUsers != undefined && orgUsers.length > 0 ? (
                    <div className=" ">
                      <ReactTooltip place="top" type="dark" effect="solid" />
                      <AllFeatureDataTable
                        columns={dataTableColumns}
                        data={orgUsers}
                      />
                    </div>
                  ) : (
                    <>No Data</>
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

export default ShowAll;
