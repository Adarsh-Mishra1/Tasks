//OrgResearchView.js
import { useEffect, useState, useRef, Suspense, lazy } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import axios from "axios";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import {
  WsMove2Stage,
  WsGetResearchSubjectByUser,
} from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";
import userStore from "../../zustand/userStore";

import OrgResearchEditAll from "../../components/researchs/OrgResearchEditAll";
import ApproverRemarks from "../../components/researchs/ApproverRemarks";

const Navbar = lazy(() => import("../../components/Navbar"));
const Sidebar = lazy(() => import("../../components/Sidebar"));
const Footer = lazy(() => import("../../components/Footer"));

const OrgResearchView = () => {
  const userData = userStore((state) => state.user);
  console.log("userData_", userData);
  const location = useLocation();
  console.log("OrgResearchEdit_location_", location);
  const navigate = useNavigate();

  const set2StageRef = useRef();
  const [researchSubject, setResearchSubject] = useState(
    location.state.subject,
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
        },
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
      }),
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
          },
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
          <div className="page-title">
            <div className="title_left">
              <h3>View Research</h3>
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
                  <h2>View Research</h2>
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
                  {researchSubject != undefined ? (
                    <>
                      <h4>{researchSubject.subject}</h4>
                      <br />
                      <ApproverRemarks
                        researchSubject={researchSubject}
                        user={userData}
                        userType="aprvr"
                      />
                      <br />
                      <Tabs
                        className="mb-1"
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
                                  isByResearcher={false}
                                  approvedLevel={i}
                                />
                              </Tab>,
                            );
                          }
                          return arr;
                        })()}
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
    </Suspense>
  );
};

export default OrgResearchView;
