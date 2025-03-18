//Add.js Category//
import React, { useState, useEffect, Suspense, lazy } from "react";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
// import { Tooltip as ReactTooltip } from "react-tooltip";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { confirmAlert } from "react-confirm-alert"; // Import Dep
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

import { WSCreateDocFormCategory } from "../../configs/WebService"; //Java
// import { WSCreateDocFormCategory } from "../../configs/WebServiceNodeJS"; //Node
import { apiKeyHeader } from "../../configs/ApiKeys";

import userStore from "../../zustand/userStore";

import { toast } from "react-toastify";

const Navbar = lazy(() => import("../../components/Navbar"));
const Sidebar = lazy(() => import("../../components/Sidebar"));
const Footer = lazy(() => import("../../components/Footer"));

const Add = () => {
  let navigate = useNavigate();

  const userData = userStore((state) => state.user);
  const [errorMsg, setErrorMsg] = useState("");

  // const [userRoles, setUserRoles] = useState([]);

  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  /*
  useEffect(()=>{
    getUserRoles();
  },[]);

  const getUserRoles=()=>{
    toast.success("Loading ...", {
      autoClose: 1000,
    });  

    axios
      .post(WSReadRoles,
          JSON.stringify({
            adminUserId: userData.id,
          }),
        {
          headers: apiKeyHeader(),
        }
      )
      .then((response) => {
        const responseData = response.data;
        console.log("getUserRoles_responseData", responseData);
        if (responseData.result_code === 1) {
          setUserRoles(responseData.result_message);
        } else {
          alert(responseData.result_message);
          setErrorMsg(responseData.result_message);
        }
      })
      .catch((error) => {
        console.error("getUserRoles_error", error);
        setErrorMsg("Error while processing");
      });
  }
*/

  function onSubmitHandler(e) {
    e.preventDefault();

    if (category.length >= 3) {
      processdToAddCategory();
    } else {
      alert("Enter Category");
    }
  }
  function processdToAddCategory() {
    /*
    [Raw-JSON]
// userId:number,
// orgId:number, 
// category:text,
// description:text, 
// parentCategoryId:number
*/
    let params2post = JSON.stringify({
      userId: userData.id,
      orgId: userData.org.id,
      category: category,
      description: description,
      parentCategoryId: null,
    });

    console.log("processdToAddCategory_params2post", params2post);

    axios
      .post(WSCreateDocFormCategory, params2post, {
        headers: apiKeyHeader(),
      })
      .then((response) => {
        const responseData = response.data;
        console.log("processdToAddCategory_responseData", responseData);
        if (responseData.result_code === 1) {
          goToUserPage();
        } else {
          alert(responseData.result_message);
          setErrorMsg(responseData.result_message);
        }
      })
      .catch((error) => {
        console.error("processdToAddCategory_error", error);
        setErrorMsg("Error while processing");
      });
  }

  function goToUserPage() {
    navigate("/docFormCategoryShowAll");
  }

  return (
    <Suspense fallback={<>Loading...</>}>
      <div className="main_container">
        <Sidebar />
        <Navbar />
        {/* <!-- page content --> */}
        <div className="right_col" role="main">
          <div className="page-title">
            <div className="title_left">
              <h3>Add Category</h3>
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
                  <h2>Create a new category</h2>
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
                <div className="x_content">
                  <Form onSubmit={onSubmitHandler}>
                    <div className="mb-3">
                      <Label htmlFor="categoryName" className="form-label">
                        Category
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="category"
                        name="category"
                        aria-describedby="categoryName"
                        value={category}
                        onChange={(e) => {
                          setCategory(e.target.value);
                        }}
                        minLength={3}
                        maxLength={60}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="description" className="form-label">
                        Description
                      </Label>
                      <Input
                        type="textarea"
                        className="form-control"
                        id="description"
                        name="description"
                        aria-describedby="description"
                        value={description}
                        onChange={(e) => {
                          setDescription(e.target.value);
                        }}
                        minLength={10}
                        maxLength={140}
                        required
                      />
                    </div>

                    {/* <div className="mb-3">
                    <Label htmlFor="userEmailId" className="form-label">
                        Parent Category
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="eMailId"
                        name="eMailId"
                        aria-describedby="userEmailId"
                        value={eMailId}
                        onChange={(e) => {
                          setEmailId(e.target.value);
                        }}
                        minLength={7}
                        maxLength={62}                        
                      />
                    </div> */}

                    {/* <div className="mb-3">
                      <label for="exampleInputPassword1" className="form-label">Role</label>
                      <Input
                        className="form-control"
                        type="select"
                        name="docRole"
                        id="docRole"
                        aria-describedby="docRole"
                        onChange={(event) => {
                          setFormChangeCount(formChangeCount + 1);
                          docFormData.nature_code = event.target.value;
                          setDocFormData(docFormData);
                          setNatureCode(event.target.value);
                        }}
                      >
                        <option value="">Select Nature</option>
                        {docNaturesData.length
                          ? docNaturesData.map((docNatureData, index) =>
                              (() => {
                                if (
                                  docFormData.nature_code == docNatureData.id
                                ) {
                                  return (
                                    <option
                                      key={docNatureData.id}
                                      value={docNatureData.id}
                                      selected
                                    >
                                      {docNatureData.nature}
                                    </option>
                                  );
                                } else {
                                  return (
                                    <option
                                      key={docNatureData.id}
                                      value={docNatureData.id}
                                    >
                                      {docNatureData.nature}
                                    </option>
                                  );
                                }
                              })()
                            )
                          : null}
                      </Input>
                    </div> */}

                    <button type="submit" className="btn btn-sm m-0 btn-primary">
                      Submit
                    </button>
                  </Form>
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

export default Add;
