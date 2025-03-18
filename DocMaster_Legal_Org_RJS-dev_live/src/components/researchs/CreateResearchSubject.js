import { useEffect, useState, Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, FormGroup, Label, Input, Col } from "reactstrap";
import axios from "axios";

import userStore from "../../zustand/userStore";
import {
  WsGetResearchTypes,
  WsPutClientCaseResearchMap,
  WsPutClientCaseResearchMapNew,
  WsPutLegalResearchSubject,
} from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";
import { matchRuleShort } from "../../OtherFunctions/StringFunctions";
import { toast } from "react-toastify";

const FillNewDocFormToMerge = lazy(() => import("./FillNewDocFormToMerge"));

const CreateResearchSubject = (props) => {
  let navigate = useNavigate();
  const userData = userStore((state) => state.user);
  console.log("userData_", userData);

  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");

  // const [researchType, setResearchType] = useState();
  const [researchTypeId, setResearchTypeId] = useState();
  const [researchSubTypeId, setResearchSubTypeId] = useState();
  const [researchTypes, setResearchTypes] = useState();
  const [researchSubTypes, setResearchSubTypes] = useState();

  const [researchDocForms, setResearchDocForms] = useState([]);
  const [showResearchPresetDocFormModal, setShowResearchPresetDocFormModal] =
    useState(false);
  const [researchSource, setResearchSource] = useState(0);

  useEffect(() => {
    if (
      userData != null &&
      userData != undefined &&
      userData.isLoggedIn != undefined &&
      userData.isLoggedIn
    ) {
      getResearchTypes(null);
    } else {
      window.location.href = "/";
    }
  }, []);

  useEffect(() => {
    if (
      researchTypeId != null &&
      researchTypeId != undefined &&
      researchTypeId > 0
    ) {
      getResearchTypes(researchTypeId);
    }
  }, [researchTypeId]);

  useEffect(() => {
    let valueId2set;
    researchTypes != undefined &&
      researchTypes.forEach((researchType) => {
        if (isMarkSelected(researchType.type)) {
          valueId2set = researchType.id;
          return;
        }
      });

    if (valueId2set != undefined) {
      setResearchTypeId(Number(valueId2set));
    }
  }, [researchTypes]);

  const getResearchTypes = (parentTypeId) => {
    if (parentTypeId != null) {
      setResearchSubTypes();
    }
    axios
      .get(
        WsGetResearchTypes +
          "/" +
          userData.id +
          (parentTypeId != null ? "/" + parentTypeId : ""),
        {
          headers: apiKeyHeader(),
        }
      )
      .then((response) => {
        const responseData = response.data;
        console.log("GetResearchSubTypes_responseData", responseData);
        if (responseData.resultCode === 1) {
          if (parentTypeId != null) {
            setResearchSubTypes(responseData.resultMessage);
          } else {
            setResearchTypes(responseData.resultMessage);
          }
        } else {
          alert(responseData.resultMessage);
          // ssetErrorMsg(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("error", error);
        // setErrorMsg("Error while processing");
      });
  };

  const PutClientCaseResearchMap = async (researchId) => {
    // alert("line 111");
    toast.success("Loading....");
    await axios
      .post(
        // WsPutClientCaseResearchMap,
        WsPutClientCaseResearchMapNew,
        JSON.stringify({
          researchId: researchId,
          caseId: props.ClientCase.id,
          userId: userData.id,
        }),
        {
          headers: apiKeyHeader(),
        }
      )
      .then((response) => {
        const responseData = response.data;
        if (responseData.resultCode === 1) {
          navigate("/Casepreparations?2");
        } else {
          alert(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("error", error);
      });
    toast.dismiss();
  };

  const putResearchSubject = async () => {
    const docformsIdString = concatAllIntoDocFormIds(); //docformsIds:(docformsIdString.length<=0)?null:docformsIdString,
    const docformsIdStringArray = concatAllIntoDocFormIdsArray();
    const loader = toast.success("Loading....", { autoClose: false });
    await axios
      .post(
        WsPutLegalResearchSubject,
        JSON.stringify({
          orgId: userData.org.id,
          subject: subject,
          details: details,
          userId: userData.id,
          researchTypeId:
            researchSubTypeId != undefined &&
            researchSubTypeId != null &&
            researchSubTypeId > 0
              ? researchSubTypeId
              : researchTypeId,
          isApprovalNeeded: 0,
          // isApprovalNeeded: Number(isApprovalNeededRef?.current.value),
          docformsIds:
            docformsIdStringArray.length <= 0 ? null : docformsIdStringArray,
          isOwn: researchSource,
        }),
        {
          headers: apiKeyHeader(),
        }
      )
      .then(async (response) => {
        const responseData = response.data;
        if (responseData.resultCode === 1) {
          if (props?.onReturn != undefined && props?.onReturn != null) {
            props.onReturn(responseData.data);
          } else if (props.handleMapWithCase === true) {
            PutClientCaseResearchMap(responseData.data);
          } else {
            goToPage();
          }
        } else {
          alert(responseData.resultMessage);
          // ssetErrorMsg(responseData.resultMessage);
        }
        await toast.dismiss(loader);
      })
      .catch(async (error) => {
        console.error("error", error);
        // setErrorMsg("Error while processing");
        await toast.dismiss(loader);
        toast.error("Error creating research..", { autoClose: 3000 });
      });
    toast.dismiss();
  };

  function goToPage() {
    navigate("/myResearchSubjects");
  }

  async function onSubmitHandler(e) {
    e.preventDefault();

    if (!researchTypeId || researchTypeId <= 0) {
      alert("Select Research Type");
      return;
    }

    putResearchSubject();

    // try {
    //   const response = await fetch(
    //     `https://web1024.ipguide.net:8443/dm_leorg_new1/userStatistics/${userData.org.id}`,
    //     { headers: apiKeyHeader() }
    //   );
    //   const data = await response.json();

    //   const researchesTotal = data.resultMessage[0]?.researches_total; // Default to 0 if null
    //   const currentResearches = data.resultMessage[0]?.researches; // Default to 0 if null

    //   if (currentResearches !== 0 && currentResearches <= researchesTotal) {
    //     alert("Your researches are completed. Extend your plan.");
    //   } else {
    //     putResearchSubject();
    //   }
    // } catch (error) {
    //   console.error("Error fetching research statistics:", error);
    //   alert("Failed to fetch research statistics. Please try again.");
    // }
  }

  const processReturnedDocForm = (docForm) => {
    console.log("processReturnedDocForm_docForm", docForm);

    // addToResearchDocForms()
    if (
      checkDataExistInResearchDocFormsArray(docForm.id, researchDocForms) ==
      false
    ) {
      // researchDocForms.push(docForm);
      setResearchDocForms([...researchDocForms, docForm]);
      setShowResearchPresetDocFormModal(false);
    } else {
      alert("Already Exist in Array");
    }
  };

  const checkDataExistInResearchDocFormsArray = (docFormId, docFormArray) => {
    return docFormArray.some((docFormObj) => {
      return docFormObj.id == docFormId;
    });
  };

  const removeFromResearchDocFormsArray = (docForm) => {
    setResearchDocForms(
      researchDocForms.filter((researchDocForm) => {
        return researchDocForm.id !== docForm.id;
      })
    );
  };

  const concatAllIntoDocFormIds = () => {
    let docFormIds = "";
    researchDocForms.map((researchDocForm) => {
      docFormIds = researchDocForm + "," + researchDocForm.id;
    });
    return docFormIds;
  };

  const concatAllIntoDocFormIdsArray = () => {
    let docFormIdsArray = [];
    researchDocForms.map((researchDocForm) => {
      docFormIdsArray.push(researchDocForm.id);
    });
    return docFormIdsArray;
  };

  const isMarkSelected = (researchType) => {
    if (props?.typeToMatch != undefined && props?.typeToMatch.length > 1) {
      return matchRuleShort(
        researchType.toLowerCase(),
        "*" + props?.typeToMatch.toLowerCase() + "*"
      );
    }
    return false;
  };

  return (
    <Suspense fallback={<>Loading...</>}>
      <Form onSubmit={onSubmitHandler} method="POST">
        <div className="form-box px-lg-2 px-2">
          <FormGroup className="mb-3" row>
            <Label for="researchSource" sm={2}>
              Research Source *
            </Label>
            <Col sm={10}>
              <div className="d-flex align-items-center">
                <div className="mr-4">
                  <Input
                    type="radio"
                    name="researchSource"
                    id="ownResearch"
                    value={1} // Set value to 1 for "Own Research"
                    onChange={(e) => setResearchSource(Number(e.target.value))}
                    checked={researchSource === 1}
                  />
                  <label for="ownResearch">Own Research</label>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                </div>
                <div>
                  <Input
                    type="radio"
                    name="researchSource"
                    id="fromDocmaster"
                    value={0}
                    onChange={(e) => setResearchSource(Number(e.target.value))}
                    checked={researchSource === 0}
                  />
                  <label for="fromDocmaster">Using Docmaster</label>
                </div>
              </div>
            </Col>
          </FormGroup>
          <FormGroup className="mb-3" row>
            <Label for="inputresearchType" sm={2}>
              Research Type *
            </Label>
            <Col sm={10}>
              <Input
                type="select"
                className="form-control "
                id="inputresearchType"
                aria-describedby="researchTypeHelp"
                onChange={(e) => {
                  setResearchTypeId(Number(e.target.value));
                }}
                required
              >
                <option>-Select-</option>
                {researchTypes != undefined &&
                  researchTypes.map((researchType) => {
                    return (
                      <option
                        value={researchType.id}
                        selected={isMarkSelected(researchType.type)}
                      >
                        {researchType.type}
                      </option>
                    );
                  })}
              </Input>
            </Col>
          </FormGroup>
          {researchSubTypes != undefined && researchSubTypes.length > 0 ? (
            <FormGroup className="mb-3" row>
              <Label for="inputresearchSubType" sm={2}>
                Research Sub Type *
              </Label>

              <Col sm={10}>
                <Input
                  type="select"
                  className="form-control "
                  id="inputresearchSubType"
                  aria-describedby="researchSubTypeHelp"
                  // value={researchTypeId}
                  onChange={(e) => {
                    setResearchSubTypeId(Number(e.target.value));
                  }}
                  // minLength={3}
                  // maxLength={250}
                  // required
                >
                  <option>-Select-</option>
                  {researchSubTypes != undefined &&
                    researchSubTypes.map((researchSubType) => {
                      return (
                        <option value={researchSubType.id}>
                          {researchSubType.type}
                        </option>
                      );
                    })}
                </Input>
              </Col>
            </FormGroup>
          ) : null}
          <FormGroup className="mb-3" row>
            <Label for="inputsubject" sm={2}>
              Subject *
            </Label>

            <Col sm={10}>
              <Input
                type="text"
                className="form-control "
                id="inputsubject"
                aria-describedby="subjectHelp"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                minLength={3}
                maxLength={250}
                required
              />
            </Col>
          </FormGroup>
          <FormGroup className="mb-3" row>
            <Label for="inputDetails" sm={2}>
              Details *
            </Label>
            <Col sm={10}>
              <Input
                type="textarea"
                className="form-control "
                id="inputDetails"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                minLength={6}
                maxLength={1000}
                required
              />
            </Col>
          </FormGroup>

          {/* <FormGroup className="mb-3" row>
            <Label sm={2}>Is Approval Needed</Label>
            <Col sm={10}>
              <Input
                type="select"
                name="isApprovalNeeded"
                id="isApprovalNeeded"
                className="form-control"
                aria-describedby="isApprovalNeeded"
                innerRef={isApprovalNeededRef}
              >
                <option value={1}>Yes</option>
                <option value={0}>No</option>
              </Input>
            </Col>
          </FormGroup>  */}

          {/* <FormGroup className="mb-3" row>
            <Label for="inputDocFormNeeded" sm={2}>
              DocForm(s) Needed *
            </Label>
            <Col sm={10}>
              <Modal
                transparent={false}
                ariaHideApp={false}
                isOpen={showResearchPresetDocFormModal}
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
                    setShowResearchPresetDocFormModal(false);
                  }}
                >
                  Close
                </button>
                <br />
                <div>
                  Select docform related to Research
                  <FillNewDocFormToMerge
                    user={userData}
                    onReturn={processReturnedDocForm}
                    type={1}
                  />
                </div>
              </Modal>

              <i
                className="fa fa-plus mx-2"
                title="Add"
                style={{ color: "grey", cursor: "pointer" }}
                aria-hidden="true"
                onClick={() => setShowResearchPresetDocFormModal(true)}
              />
              <br />
              {researchDocForms.length > 0 ? (
                <>
                  {researchDocForms.map((researchDocForm) => {
                    return (
                      <p>
                        {" "}
                        <i
                          className="fa fa-close mx-2"
                          title="Add"
                          style={{ color: "red", cursor: "pointer" }}
                          aria-hidden="true"
                          onClick={
                            () =>
                              removeFromResearchDocFormsArray(researchDocForm)
                            // alert()
                          }
                        />{" "}
                        {researchDocForm.nameTitle}
                      </p>
                    );
                  })}
                </>
              ) : null}
            </Col>
          </FormGroup> */}

          <div className="text-end">
            <button
              className="btn btn-primary m-0"
              type="submit"
              onClick={onSubmitHandler}
            >
              Submit
            </button>
          </div>
        </div>
      </Form>
    </Suspense>
  );
};

export default CreateResearchSubject;
