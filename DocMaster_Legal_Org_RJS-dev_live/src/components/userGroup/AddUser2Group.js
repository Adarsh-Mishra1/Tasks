import { useEffect, useState, Suspense, lazy, useRef } from "react";
import { Button, Form, FormGroup, Label, Input, Col } from "reactstrap";
import axios from "axios";
import ReactSelect from "react-select";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import userStore from "../../zustand/userStore";
import { WSGetOrgUsers, WSGetUserGroups, WSAddUserToGroup } from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";

const AddUser2Group = (props) => {
  const userData = userStore((state) => state.user);

  const [userGroupId, setUserGroupId] = useState(
    props.userGroup != undefined ? props.userGroup?.id : null
  );

  const [orgUserId, setOrgUserId] = useState();
  const [orgUsers, setOrgUsers] = useState();
  const [userGroups, setUserGroups] = useState();

  useEffect(() => {
    if (props.userGroup == undefined) {
      getOrgUserGroups();
    }
    getOrgUsers();
  }, []);

  const getOrgUsers = () => {
    axios
      .get(WSGetOrgUsers+ "/" + userData.id + "/" + userData.org.id , {
        headers: apiKeyHeader(),
      })
      .then((response) => {
        const responseData = response.data;
        console.log("_responseData", responseData);
        if (responseData.resultCode === 1) {
          setOrgUsers(processOrgUsers(responseData.resultMessage));
        } else {
          alert(responseData.resultMessage);
          // setErrorMsg(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("error", error);
        // setErrorMsg("Error while processing");
      });
  };

  const processOrgUsers = (simpleDataArray) => {
    simpleDataArray.map((simpleData, index) => {
      simpleData["sno"] = index + 1;
      simpleData["label"] = simpleData.name;
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
    } else if (orgUserId == undefined || orgUserId <= 0) {
      alert("Select User");
    } else {
        putUser2UserGroup();
    }
  };

  const putUser2UserGroup = () => {
      axios
        .post(
          WSAddUserToGroup,
          JSON.stringify({
            adminUserId: userData.id,
            orgGroupId: userGroupId,
            userId: orgUserId,
          }),
          {
            headers: apiKeyHeader(),
          }
        )
        .then((response) => {
          const responseData = response.data;
          console.log("putCaseUG_responseData", responseData);
          if (responseData.result_code === 1) {
            props.onReturn(true);
          } else {
            toast.error(responseData.result_message, {
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
            Org User
          </Label>
          <Col sm={10}>
            <ReactSelect
              options={orgUsers}
              onChange={(orgUser) => {
                console.log(
                  "handleUsersReactSelectChanges_clientCase",
                  orgUser
                );
                setOrgUserId(orgUser.id);
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

export default AddUser2Group;
