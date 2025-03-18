//View.js: View Group Members

import React, { useEffect, useState, Suspense, lazy } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tooltip as ReactTooltip } from "react-tooltip";
import axios from "axios";
import { toast } from "react-toastify";

import { WSGetOrgGroupMembers } from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";

import userStore from "../../zustand/userStore";
import AllFeatureDataTable from "../../GuiComponents/AllFeatureDataTable.table";
const Navbar = lazy(() => import("../../components/Navbar"));
const Sidebar = lazy(() => import("../../components/Sidebar"));
const Footer = lazy(() => import("../../components/Footer"));

const View = () => {
  let location = useLocation();
  let navigate = useNavigate();
  let userGroup = location.state.userGroup;

  const userData = userStore((state) => state.user);

  const [errorMsg, setErrorMsg] = useState("");
  const [orgGroupMembers, setOrgGroupMembers] = useState([]);

  const dataTableColumns = [
    {
      Header: "S. No",
      accessor: "sno",
    },
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Mobile No",
      accessor: "mobileNo",
    },
    {
      Header: "Actions",
      accessor: "actiontd",
    },
  ];

  useEffect(() => {
    getOrgGroupMembers();
  }, []);

  const getOrgGroupMembers = () => {
    toast.success("Loading Group Members ...", {
      autoClose: 50,
    });

    /*[url/adminUserId/orgGroupId]
adminUserId:number,
orgGroupId:number,*/
    axios
      .get(WSGetOrgGroupMembers + "/" + userData.id + "/" + userGroup.id, {
        headers: apiKeyHeader(),
      })
      .then((response) => {
        const responseData = response.data;
        console.log("getOrgGroupMembers_responseData", responseData);
        if (responseData.result_code === 1) {
          setOrgGroupMembers(processData(responseData.result_message));
        } else {
          alert(responseData.result_message);
          setErrorMsg(responseData.result_message);
        }
      })
      .catch((error) => {
        console.error("getOrgGroupMembers_error", error);
        setErrorMsg("Error while processing");
      });
  };

  const processData = (simpleDataArray) => {
    let blankData = [];

    simpleDataArray.map((simpleData, index) => {
      console.log("processData_simpleData", simpleData);
      simpleData["sno"] = index + 1;
      simpleData["actiontd"] = (
        <>
          {/* <i
          data-tip="View"
          title="View"
          key={`view${index}`}
          className="fa fa-eye mx-2"
          style={{ color: "blue", cursor: "pointer" }}
          aria-hidden="true"
          onClick={() => go2ViewUserGroup(simpleData)}
        ></i> */}
          <i
            title="Delete"
            data-tip="Delete"
            key={`delete${index}`}
            className="fa fa-trash mx-2"
            style={{ color: "red", cursor: "pointer" }}
            onClick={() => delAlert(simpleData)}
            aria-hidden="true"
          ></i>
        </>
      );
      blankData.push(simpleData);
    });
    return blankData;
  };

  const delAlert = () => {
    alert("To be Done");
  };

  const go2AddUser2Group = () => {
    navigate("/userGroupAddUser", {
      state: {
        userGroup: userGroup,
      },
    });
  };

  return (
    <Suspense fallback={<>Loading...</>}>
      <div className="main_container" >
        <Sidebar />
        <Navbar />
        {/* <!-- page content --> */}
        <div className="right_col" role="main">
          <div className="page-title">
            <div className="title_left">
              <h3>{userGroup.title} <i className="fa fa-plus" 
              style={{cursor:"pointer"}}
                onClick={()=>{go2AddUser2Group()}}
              /></h3>
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
            <div className="col-md-12 col-sm-12">
              <div className="x_panel">
                <div className="x_title">
                  <h2>Users of {userGroup.title}</h2>
                  {/* <ul className="nav navbar-right panel_toolbox">
                      <li><a className="collapse-link"><i className="fa fa-chevron-up"></i></a>
                      </li>
                      <li className="dropdown">
                        <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><i className="fa fa-wrench"></i></a>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <a className="dropdown-item" href="#">Settings 1</a>
                            <a className="dropdown-item" href="#">Settings 2</a>
                          </div>
                      </li>
                      <li><a className="close-link"><i className="fa fa-close"></i></a>
                      </li>
                    </ul> */}
                  <div className="clearfix"></div>
                </div>
                <div className="x_content">{errorMsg ? (
                    <div>
                      <b>{errorMsg}</b>
                    </div>
                  ) : null}

                  {orgGroupMembers != undefined && orgGroupMembers.length > 0 ? (
                    <div className="table-responsive">
                      <ReactTooltip place="top" type="dark" effect="solid" />
                      <AllFeatureDataTable
                        columns={dataTableColumns}
                        data={orgGroupMembers}
                      />
                    </div>
                  ) : (
                    <>No Data</>
                  )}</div>
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

export default View;
