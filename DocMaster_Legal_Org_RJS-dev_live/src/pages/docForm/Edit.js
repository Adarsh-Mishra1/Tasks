import React, { useState, useEffect, Suspense, lazy } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";

import axios from "axios";
import DropdownTreeSelect from "react-dropdown-tree-select";
import "react-dropdown-tree-select/dist/styles.css";

import {
  WSCategoryAll,
  WSReadDocFormCategories,
  WSPutDocFormDetail,
} from "../../configs/WebService"; //Java

// import { WSReadDocFormCategories } from "../../configs/WebServiceNodeJS"; //Node

import { apiKeyHeader } from "../../configs/ApiKeys";

import userStore from "../../zustand/userStore";
import { listToTreeNumeric } from "../../OtherFunctions/OtherFunctions";

import { toast } from "react-toastify";

const Navbar = lazy(() => import("../../components/Navbar"));
const Sidebar = lazy(() => import("../../components/Sidebar"));
const Footer = lazy(() => import("../../components/Footer"));

const Edit = () => {
  let navigate = useNavigate();
  let location = useLocation();

  let docForm = location.state.docForm;

  console.log("DocFormEdit_docForm", docForm);

  const [errorMsg, setErrorMsg] = useState("");

  const userData = userStore((state) => state.user);

  // const [formChangeCount, setFormChangeCount] = useState(0);

  const [docName, setDocName] = useState(docForm.nameTitle);
  const [description, setDescription] = useState(docForm.description);
  // const [shortName, setShortName] = useState(docForm.shortName);
  // const [agencyName, setAgencyName] = useState(docForm.agencyName);
  // const [purpose, setPurpose] = useState(docForm.purpose);
  // const [keywords, setKeywords] = useState(docForm.keywords);
  // const [keyphrases, setKeyphrases] = useState(docForm.keyphrases);
  // const [glossary, setGlossary] = useState(docForm.glossary);
  // const [gist, setGist] = useState(docForm.gist);
  // const [language, setLanguage] = useState(docForm.language.id);
  // const [price, setPrice] = useState(docForm.price);

  const [category, setCategory] = useState(docForm.category.id);

  // const [natureCode, setNatureCode] = useState(docForm.nature?.id);
  // const [classCode, setClassCode] = useState(docForm.formClass?.id);
  const [isPublic, setIsPublic] = useState(docForm.isPublic);

  let [documentCategoryData, setDocumentCategoryData] = useState({});
  // let [docNaturesData, setDocNaturesData] = useState({});
  // let [docClassesData, setDocClassesData] = useState({});
  // let [docLanguagesData, setDocLanguagesData] = useState({});
  let [docCategoriesData, setdocCategoryData] = useState([]);

  useEffect(() => {
    fetchCombinedData();
  }, []);

  function fetchCombinedData() {
    toast.success("Loading Document Form Data Please Wait ...", {
      autoClose: 50,
    });

    // const requestCategory = axios.post(WSCategoryAll, JSON.stringify({
    //   adminUserId: userData.id,
    // }), {
    //   headers: apiKeyHeader(),
    // });

    const requestCategory = axios.get(
      WSReadDocFormCategories + "/" + userData.org.id,
      {
        headers: apiKeyHeader(),
      },
    );

    axios
      .all([requestCategory])
      .then(
        axios.spread((...responses) => {
          const responseCategory = responses[0];
          const responseCategoryData = responseCategory.data;
          if (responseCategoryData.result_code === 1) {
            docCategoriesData = responseCategoryData.result_message;
            docCategoriesData = processOrgCategories(
              responseCategoryData.result_message,
            );
            //console.log("responses_docCategoriesData",docCategoriesData);
            setdocCategoryData(docCategoriesData);
            documentCategoryData = {
              id: 0,
              label: "Categories",
              name: "Categories",
              value: 0,
              children: listToTreeNumeric(docCategoriesData),
            };
            setDocumentCategoryData(documentCategoryData);
          } else {
            alert("Error in Category, " + responseCategoryData.result_message);
          }
        }),
      )
      .catch((errors) => {
        // react on errors.
        console.error("errors", errors);
      });
  }

  const processOrgCategories = (catArray) => {
    catArray.map((cat, index) => {
      console.log("processOrgCategories_before_cat", cat);
      cat["name"] = cat.category;
      cat["label"] = cat.category;
      cat["value"] = cat.id;
      cat["parentId"] = cat.parent_category;
      console.log("processOrgCategories_after_cat", cat);
    });
    return catArray;
  };

  function onSubmitHandler(e) {
    e.preventDefault();

    let params2post = JSON.stringify({
      userId: userData.id,
      orgId: userData.org.id,
      orgFormId: docForm.id,
      nameTitle: docName,
      description: description,
      category: category,
      isPublic: isPublic,
    });

    // console.log("PutDocForm_onSubmit_params2post", params2post);

    axios
      .post(WSPutDocFormDetail, params2post, {
        headers: apiKeyHeader(),
      })
      .then((response) => {
        const responseData = response.data;
        console.log("PutDocForm_responseData", responseData);
        if (responseData.result_code === 1) {
          goToUserPage();
        } else {
          alert(responseData.result_message);
          setErrorMsg(responseData.result_message);
        }
      })
      .catch((error) => {
        console.error("PutDocForm_error", error);
        setErrorMsg("Error while processing");
      });
  }

  function goToUserPage() {
    navigate("/docFormShowAll");
  }

  return (
    <Suspense fallback={<>Loading...</>}>
      <div className="main_container">
        <Sidebar />
        <Navbar />

        {/* <!-- page content --> */}
        {/* {DevNote: Show Page Content Here} */}
        <div className="right_col" role="main">
          <div className="page-title">
            <div className="title_left">
              {/* <h3>Add DocForm</h3> */}
              <h3>Edit DocForm</h3>
            </div>
          </div>

          <div className="clearfix"></div>

          <div className="row">
            <div className="col-md-12 col-sm-12  ">
              <div className="x_panel">
                 
                <div className="x_content">
                  <Form onSubmit={onSubmitHandler} method="POST">
                    <div className="mb-1 add-form-container">
                      <Label htmlFor="docName" className="form-label">
                        Name of Document *
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="docName"
                        name="docName"
                        aria-describedby="docName"
                        value={docName}
                        onChange={(e) => {
                          setDocName(e.target.value);
                        }}
                        minLength={3}
                        maxLength={60}
                        required
                      />
                      {/* <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div> */}
                    </div>
                    <div className="mb-1 add-form-container">
                      <label htmlFor="describedby" className="form-label">
                        Description
                      </label>
                      <Input
                        type="textarea"
                        className="form-control"
                        name="description"
                        id="description"
                        aria-describedby="describedby"
                        value={description}
                        onChange={(e) => {
                          setDescription(e.target.value);
                        }}
                        minLength={3}
                        maxLength={500}
                        required
                      />
                    </div>

                    <div className="mb-1 add-form-container">
                      <label
                        htmlFor="category"
                        className="form-label"
                        style={{ width: "20%" }}
                      >
                        Category
                      </label>
                      {/* &nbsp;{" "} */}
                      <DropdownTreeSelect
                        data={documentCategoryData}
                        onChange={(currentNode, selectedNodes) => {
                          setCategory(currentNode.id);
                        }}
                        onAction={(node, action) => {
                          console.log("onAction::", action, node);
                        }}
                        onNodeToggle={(currentNode) => {
                          console.log("onNodeToggle::", currentNode);
                        }}
                        mode="radioSelect"
                        id="docFormCategory"
                      />
                      <strong
                        style={{
                          position: "relative",
                          top: "7px",
                          left: "3px",
                        }}
                      >
                        {docCategoriesData.length
                          ? docCategoriesData.map((docCategoryData) =>
                              (() => (
                                <>
                                  {docCategoryData.id == category ? (
                                    <span key={"docCate" + docCategoryData.id}>
                                      {docCategoryData.category}
                                    </span>
                                  ) : null}
                                </>
                              ))(),
                            )
                          : null}
                      </strong>
                    </div>

                    <div className="mb-1 add-form-container">
                      <label htmlFor="isPublic" className="form-label">
                        Is Public?
                      </label>

                      <Input
                        type="select"
                        name="isPublic"
                        id="isPublic"
                        className="form-control"
                        aria-describedby="isPublic"
                        onChange={(event) => {
                          setIsPublic(event.target.value);
                        }}
                      >
                        <option>-Select-</option>

                        <option
                          key="yesIsPublic"
                          value={1}
                          selected={docForm.isPublic == 1}
                        >
                          Yes
                        </option>
                        <option
                          key="NoIsPublic"
                          value={0}
                          selected={docForm.isPublic == 0}
                        >
                          No
                        </option>
                      </Input>
                    </div>

                    {userData.crudAccess?.docForm.u == 1 ? (
                      <button type="submit" className="btn btn-sm m-0 btn-primary">
                        Submit
                      </button>
                    ) : null}
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

export default Edit;
