//docFormPreFill/ShowAll.js
import React, { useState, useEffect, Suspense, lazy } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { confirmAlert } from "react-confirm-alert"; // Import Dep
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { toast } from "react-toastify";

import { WsGetOrgPreFillField } from "../../configs/WebService";
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
  const [docFormPreFills, setDocFormPreFills] = useState([]);
  /*        id:<org_forms.id>,
        language:{id:<doc_languages.id>,language:<doc_languages.language>},
        uid:<org_forms.form_uid>,
        nameTitle:<org_forms.name_title>,
category:{id:<`forms_category`.`id`>,category:<`forms_category`.`category`>},
        price:<org_forms.price>,
        isPublic:<org_forms.is_public>,
        isPublished:<org_forms.is_published>*/
  const dataTableColumns = [
    {
      Header: "S. No",
      accessor: "sno",
    },
    {
      Header: "Field Key",
      accessor: "fieldKey",
    },
    {
      Header: "Value",
      accessor: "value",
    },
    {
      Header: "Is User Specific",
      accessor: "isUserSpecific",
    },
    {
      Header: "Actions",
      accessor: "actiontd",
    },
  ];

  useEffect(() => {
    getOrgAllDocForm();
  }, []);

  const getOrgAllDocForm = () => {
    toast.success("Loading ...", {
      autoClose: 50,
    });

    axios
      .get(WsGetOrgPreFillField + "/" + userData.org.id + "/" + userData.id, {
        headers: apiKeyHeader(),
      })
      .then((response) => {
        const responseData = response.data;
        console.log("GetOrgPreFillField_responseData", responseData);
        if (responseData.resultCode === 1) {
          setDocFormPreFills(processData(responseData.resultMessage));
        } else {
          alert(responseData.resultMessage);
          setErrorMsg(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("getOrgAllDocForm_error", error);
        setErrorMsg("Error while processing");
      });
  };

  const processData = (simpleDataArray) => {
    simpleDataArray.map((simpleData, index) => {
      // console.log("processData_simpleData", simpleData);

      simpleData["sno"] = index + 1;
      simpleData["isUserSpecific"] = "No";

      if (
        simpleData.userId != null &&
        simpleData.userId != undefined &&
        simpleData.userId >= 0
      ) {
        simpleData["isUserSpecific"] = "Yes";
      }

      simpleData["actiontd"] = (
        <>
          {userData.crudAccess?.docFormPreFill.u == 1 ? (
            <i
              data-tip="Edit"
              title="Publish"
              key={`publish${index}`}
              className="fa fa-edit mr-3"
              style={{ color: "black", cursor: "pointer", marginRight: 10 }}
              onClick={() => proceed2Edit(simpleData)}
              aria-hidden="true"
            ></i>
          ) : null}

          {userData.crudAccess?.docFormPreFill.d == 1 ? (
            <i
              title="Delete"
              data-tip="Delete"
              className="fa fa-trash mr-3"
              style={{ color: "red", cursor: "pointer" }}
              onClick={() => proceed2Delete(simpleData)}
              aria-hidden="true"
            ></i>
          ) : null}
        </>
      );
    });
    console.log("processData_simpleDataArray", simpleDataArray);
    return simpleDataArray;
  };

  const proceed2Edit = (docFormPreFill) => {
    confirmAlert({
      title: "Confirm!",
      message: "Sure to Proceed to Edit",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            delete docFormPreFill["actiontd"]; //DevNote:Needed
            navigate("/docFormPreFillAdd", {
              state: {
                docFormFill: docFormPreFill,
                action: "edit",
              },
            });
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  const proceed2Delete = (docFormPreFill) => {
    confirmAlert({
      title: "Confirm!",
      message: "Sure to Proceed to Delete",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            alert("To be Done");
            //   delete docFormPreFill["actiontd"]; //DevNote:Needed
            //   navigate("/docFormPreFillAdd", {
            //     state: {
            //       docFormFill: docFormPreFill,
            //       action: "edit",
            //     },
            //   });
          },
        },
        {
          label: "No",
        },
      ],
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
              <h3>List of Document Prefill(s)</h3>
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
                <div className="x_title">
                  <h2>Prefill(s)</h2>
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
                    </ul>*/}
                  <div className="clearfix"></div>
                </div>
                <div className="x_content">
                  {errorMsg ? (
                    <div>
                      <b>{errorMsg}</b>
                    </div>
                  ) : null}

                  {docFormPreFills != undefined &&
                  docFormPreFills.length > 0 ? (
                    <div className=" ">
                      <ReactTooltip place="top" type="dark" effect="solid" />
                      <AllFeatureDataTable
                        columns={dataTableColumns}
                        data={docFormPreFills}
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
