import { useEffect, useState, Suspense, lazy, useRef } from "react";
import { Button, Form, FormGroup, Label, Input, Col } from "reactstrap";
import axios from "axios";
import ReactSelect from "react-select";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import userStore from "../../zustand/userStore";
import { WsGetOrgClientCases, WSGetUserGroups, WsPutCase2UserGroup } from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";

const AssignCase2UserGroup = (props) => {
  const userData = userStore((state) => state.user);

  const [userGroupId, setUserGroupId] = useState(
    props.userGroup != undefined ? props.userGroup?.id : null
  );

  const [caseId, setCaseId] = useState();
  const [cases, setCases] = useState();
  const [userGroups, setUserGroups] = useState();

  useEffect(() => {
    if (props.userGroup == undefined) {
      getOrgUserGroups();
    }
    getOrgClientCases();
  }, []);

  const getOrgClientCases = () => {
    axios
      .get(WsGetOrgClientCases + "/" + userData.org.id + "/" + userData.id, {
        headers: apiKeyHeader(),
      })
      .then((response) => {
        const responseData = response.data;
        console.log("_responseData", responseData);
        if (responseData.resultCode === 1) {
          setCases(processOrgClientCases(responseData.resultMessage));
        } else {
          alert(" Client Cases: " + responseData.resultMessage);
          // setErrorMsg(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("error", error);
        // setErrorMsg("Error while processing");
      });
  };

  const processOrgClientCases = (simpleDataArray) => {
    simpleDataArray.map((simpleData, index) => {
      simpleData["sno"] = index + 1;
      simpleData["label"] = simpleData.title;
      simpleData["value"] = simpleData.id;
      //   simpleData["isApproved"] =
      //     simpleData.approvedLevel < 0
      //       ? "Not Approved"
      //       : simpleData.approvedLevel;
    });
    return simpleDataArray;
  };

  const getOrgUserGroups = () => {
    // toast.success("Loading ...", {
    //   autoClose: 50,
    // });

    axios
      .get(WSGetUserGroups + "/" + userData.id + "/" + userData.org.id, {
        headers: apiKeyHeader(),
      })
      .then((response) => {
        const responseData = response.data;
        console.log("getOrgUserGroups_responseData", responseData);
        if (responseData.result_code === 1) {
          setUserGroups(processOrgUsrGroupData(responseData.result_message));
        } else {
          alert(responseData.result_message);
          //   setErrorMsg(responseData.result_message);
        }
      })
      .catch((error) => {
        console.error("getOrgUserGroups_error", error);
        // setErrorMsg("Error while processing");
      });
  };

  const processOrgUsrGroupData = (simpleDataArray) => {
    simpleDataArray.map((simpleData, index) => {
      simpleData["sno"] = index + 1;
      simpleData["label"] = simpleData.title;
      simpleData["value"] = simpleData.id;
      //   simpleData["isApproved"] =
      //     simpleData.approvedLevel < 0
      //       ? "Not Approved"
      //       : simpleData.approvedLevel;
    });
    return simpleDataArray;
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (userGroupId == undefined || userGroupId <= 0) {
      alert("Select User Group");
    } else if (caseId == undefined || caseId <= 0) {
      alert("Select Case");
    } else {
        putAssignCase2UserGroup();
    }
  };

  const putAssignCase2UserGroup = () => {
      axios
        .post(
            WsPutCase2UserGroup,
          JSON.stringify({
            caseId: caseId,
            userGroupId: userGroupId,
            userId: userData.id,
          }),
          {
            headers: apiKeyHeader(),
          }
        )
        .then((response) => {
          const responseData = response.data;
          console.log("putCaseUG_responseData", responseData);
          if (responseData.resultCode === 1) {
            props.onReturn(true);
          } else {
            toast.error(responseData.resultMessage, {
              position: "top-center",
              autoClose: 1800,
            });
            props.onReturn(false);
          }
        })
        .catch((error) => {
          console.error("putCaseBill_error", error);
          // setErrorMsg("Error while processing");
        });

  };

  return (
    <>
      Assign Case to UserGroup
      <Form onSubmit={onSubmitHandler} method="POST">
        <FormGroup row>
          <Label for="type" sm={2}>
            UserGroup
          </Label>
          <Col sm={10}>
            {props.userGroup != undefined ? (
              <>{props.userGroup?.title}</>
            ) : (
              <ReactSelect
                options={userGroups}
                onChange={(userGroup) => {
                  console.log(
                    "handleUsersReactSelectChanges_userGroup",
                    userGroup
                  );
                  setUserGroupId(userGroup.id);
                }}
                // ref={docFormRef}
                isMulti={false}
                //   defaultValue={{}}
              />
            )}
          </Col>
        </FormGroup>

        <FormGroup row>
          <Label for="type" sm={2}>
            Cases
          </Label>
          <Col sm={10}>
            <ReactSelect
              options={cases}
              onChange={(clientCase) => {
                console.log(
                  "handleUsersReactSelectChanges_clientCase",
                  clientCase
                );
                setCaseId(clientCase.id);
              }}
              // ref={docFormRef}
              isMulti={false}
              //   defaultValue={{}}
            />
          </Col>
        </FormGroup>
        
        <div className="text-center">
            <Button type="submit" className="btn btn-primary">
              Submit
            </Button>
          </div>
      </Form>
    </>
  );
};

export default AssignCase2UserGroup;
