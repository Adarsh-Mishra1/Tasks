//OrgResearchEdit.js
import { useEffect, useState, useRef, Suspense, lazy } from "react";

import { useNavigate, useLocation } from "react-router-dom";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Col,
} from "reactstrap";
import axios from "axios";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import {
  WsMove2Stage,
  WsGetResearchSubjectByUser,
} from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";
import userStore from "../../zustand/userStore";

const OrgResearchEditAll = lazy(() =>
  import("../../components/researchs/OrgResearchEditAll")
);
const Navbar = lazy(() => import("../../components/Navbar"));
const Sidebar = lazy(() => import("../../components/Sidebar"));
const Footer = lazy(() => import("../../components/Footer"));

const OrgResearchEdit = () => {
  const userData = userStore((state) => state.user);
  console.log("userData_", userData);
  const location = useLocation();
  console.log("OrgResearchEdit_location_", location);
  const navigate = useNavigate();

  const set2StageRef = useRef();
  const [researchSubject, setResearchSubject] = useState(
    location.state.subject
  );
  // const [changeCount, setChangeCount] = useState(0);
  const [submitStatus, setSubmitStatus] = useState();

  useEffect(() => {
    if (
      userData != null &&
      userData != undefined &&
      userData.isLoggedIn != undefined &&
      userData.isLoggedIn
    ) {
      getResearchSubjectByUser();
    } else {
    }
  }, []);

  const getResearchSubjectByUser = () => {
    axios
      .get(
        WsGetResearchSubjectByUser +
          "/" +
          researchSubject.createdBy.id +
          "/" +
          researchSubject.id,
        {
          headers: apiKeyHeader(),
        }
      )
      .then((response) => {
        const responseData = response.data;
        console.log("responseData", responseData);
        if (responseData.resultCode == 1) {
          if (responseData.submitStatus != null) {
            setSubmitStatus(responseData.submitStatus);
          }
        } else {
          alert(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("error", error);
        // this.setState({ errorMsg: "Error while getting data" });
      });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();

    console.log(
      "onSubmit_prams",
      WsMove2Stage,
      JSON.stringify({
        subjectId: researchSubject.id,
        set2Stage: Number(set2StageRef.current.value),
        userId: userData.id,
      })
    );
    if (set2StageRef.current?.value != undefined) {
      axios
        .post(
          WsMove2Stage,
          JSON.stringify({
            subjectId: researchSubject.id,
            set2Stage: Number(set2StageRef.current.value),
            userId: userData.id,
          }),
          {
            headers: apiKeyHeader(),
          }
        )
        .then((response) => {
          const responseData = response.data;
          if (responseData.resultCode === 1) {
            // window.location.reload();
            goToPage();
          } else {
            alert(responseData.resultMessage);
          }
        })
        .catch((error) => {
          console.error("error", error);
        });
    }
  };

  function goToPage() {
    navigate("/orgResearchs");
  }

  return (
    <Suspense fallback={<>Loading...</>}>
      <div className="main_container">
        <Sidebar />
        <Navbar />

        {/* <!-- page content --> */}

        {/* {DevNote: Show Page Content Here} */}
        <div className="right_col" role="main">
          <div
            className="tab-content"
            style={{ border: "0", paddingLeft: "0", paddingRight: "0" }}
          >
            <div className="page-title">
              <div className="title_left">
                <h6><span
                        onClick={() => {
                          navigate(-1);
                        }}
                        style={{   cursor: "pointer" }}
                      >
                        Go Back ⬅️
                      </span>&nbsp;| Research Edit</h6>
              </div>
            </div>

            <div className="clearfix"></div>

            <div className="row">
              <div className="col-md-12 col-sm-12  ">
                <div className="x_panel">
                  {/* <div className="x_title">
                  <h2>Research Edit</h2>
                  
                  <div className="clearfix"></div>
                </div> */}
                  <div className="x_content">
                    {researchSubject != undefined ? (
                      <>
                        <Form onSubmit={onSubmitHandler} method="POST">
                          <FormGroup inline className="d-flex">
                            <Label for="inputSet2stage" sm={2}>
                              Move to Previous Stage
                            </Label>
                            <Col sm={2}>
                              <Input
                                type="select"
                                id="inputSet2stage"
                                aria-describedby="inputSet2stage"
                                innerRef={set2StageRef}
                                min={0}
                                max={4}
                                key={`set2StaeInpu`}
                                required
                              >
                                <option
                                  key={"researchStageNUll"}
                                  title="Select"
                                ></option>
                                {(() => {
                                  const arr = [];
                                  for (
                                    let i = 0;
                                    i < researchSubject.approvedLevel;
                                    i++
                                  ) {
                                    arr.push(
                                      <option
                                        Key={"researchStage" + i}
                                        value={i}
                                      >
                                        {"Stage " + i}
                                      </option>
                                    );
                                  }
                                  return arr;
                                })()}
                              </Input>
                            </Col>

                            {/* <Button
                              type="submit"
                              className="btn btn-info"
                              sm={6}
                            >
                              Submit
                            </Button> */}
                            <button className="btn btn-primary btn-sm mt-2"
                              onClick={onSubmitHandler}
                              type="submit"
                              style={{
                                fontSize: "14px",
                                cursor: "pointer",
                                textDecoration: "underline",
                                // paddingTop: "10px",
                              }}
                            >
                              Submit
                            </button>
                          </FormGroup>
                        </Form>

                        <Tabs
                          className="mb-0"
                          defaultActiveKey="researchEdit0"
                          id="uncontrolled-tab-example"
                        >
                          {(() => {
                            const arr = [];
                            for (
                              let i = 0;
                              i < researchSubject.approvedLevel;
                              i++
                            ) {
                              arr.push(
                                <Tab
                                  eventKey={"researchEdit" + i}
                                  title={"Stage " + i}
                                >
                                  <OrgResearchEditAll
                                    researchSubject={researchSubject}
                                    userData={userData}
                                    submitStatus={submitStatus}
                                    isByResearcher={true}
                                    approvedLevel={i}
                                  />
                                </Tab>
                              );
                            }
                            return arr;
                          })()}
                          {researchSubject.approvedLevel === 5 && (
                            <Tab
                              eventKey={
                                "researchEdit" + researchSubject.approvedLevel
                              }
                              title={"Stage " + researchSubject.approvedLevel}
                            >
                              <OrgResearchEditAll
                                researchSubject={researchSubject}
                                userData={userData}
                                submitStatus={submitStatus}
                                isByResearcher={true}
                                approvedLevel={researchSubject.approvedLevel}
                              />
                            </Tab>
                          )}
                        </Tabs>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- /page content --> */}
          <Footer />
        </div>
      </div>
    </Suspense>
  );
};

export default OrgResearchEdit;
