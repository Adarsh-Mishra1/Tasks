import { useEffect, useState } from "react";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import axios from "axios";

import {
  WsGetUsers,
  WsAssignQuestionToUser,
  WsAssignResearchDocFormToUser,
  WsAssignLegalResearchDocFormToUser,
} from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";

//   getUsers/{orgId}/{userId}

const AssignQuestion2User = (props) => {
  const [users, setUsers] = useState();
  const [assignToUser, setAssignToUser] = useState();
  const [formChangeCount, setFormChangeCount] = useState(0);

  const [assignCrud, setAssignCrud] = useState({
    c: 0,
    r: 0,
    u: 0,
    d: 0,
  });

  useEffect(() => {
    //Get Users List
    //Show any User Assigned to this
    getOrgUsers();
  }, []);

  /*
    Props;
    subject={props.researchSubject}
    question={questionForUserAssign}
    user={props.user}
    */

  const getOrgUsers = () => {
    axios
      .get(WsGetUsers + "/" + props.user.org.id + "/" + props.user.id, {
        headers: apiKeyHeader(),
      })
      .then((response) => {
        const responseData = response.data;
        console.log("responseData_users", responseData);
        if (responseData.resultCode == 1) {
          setUsers(responseData.resultMessage);
        } else {
          alert(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("error", error);
      });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (assignToUser != undefined && assignToUser > 0) {
      if (props.type == 1) {
        putAssignQuestionToUser();
      }

      if (props.type == 2) {
        putAssignResearchDocFormToUser();
      }
    } else {
      alert("Select User");
    }
  };

  const putAssignQuestionToUser = () => {
    // WsAssignQuestionToUser
    // Long questionId;
    // Long userId;
    // Long assignToUserId;
    // String assignCrud;

    axios
      .post(
        WsAssignQuestionToUser,
        JSON.stringify({
          questionId: props.question.id,
          userId: props.user.id,
          assignToUserId: assignToUser,
          assignCrud: JSON.stringify(assignCrud),
        }),
        {
          headers: apiKeyHeader(),
        },
      )
      .then((response) => {
        const responseData = response.data;
        if (responseData.resultCode === 1) {
          props.onSuccesReturn(true);
        } else {
          alert(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("error", error);
      });
  };

  const putAssignResearchDocFormToUser = () => {
    // Old:WsAssignResearchDocFormToUser
    // Long presetDocFormId;
    // Long userId;
    // Long assignToUserId;
    // String assignCrud;

    axios
      .post(
        WsAssignLegalResearchDocFormToUser,
        JSON.stringify({
          presetDocFormId: props.docForm.id,
          userId: props.user.id,
          assignToUserId: assignToUser,
          assignCrud: JSON.stringify(assignCrud),
        }),
        {
          headers: apiKeyHeader(),
        },
      )
      .then((response) => {
        const responseData = response.data;
        if (responseData.resultCode === 1) {
          props.onSuccesReturn(true);
        } else {
          alert(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("error", error);
      });
  };

  return (
    <>
      <h2>Assign {props.type == 1 ? "Question" : "DocForm"} to User</h2>
      <Form className="mt-4" onSubmit={onSubmitHandler} method="POST">
        <div className="form-box px-lg-5 px-2">
          <FormGroup className="form-group mb-3">
            <Label for="inputUser" className="">
              User
            </Label>
            <Input
              type="select"
              className="form-control "
              id="inputUser"
              aria-describedby="inputUserHelp"
              onChange={(e) => setAssignToUser(Number(e.target.value))}
              required
            >
              <option>-Select-</option>
              {users != undefined &&
                users.map((userObj) => {
                  return <option value={userObj.id}>{userObj.name}</option>;
                })}
            </Input>
          </FormGroup>
          <FormGroup className="row form-group mb-3">
            <Label className="col-4">
              <strong>Create, Read, Update, Delete</strong>
            </Label>
            <div className="col-2">
              <Input
                type="checkbox"
                value={1}
                name="cDocForm"
                id="cDocForm"
                checked={assignCrud.c == 1}
                onChange={(e) => {
                  let tempUserSystemAccess = assignCrud;
                  if (e.target.checked) {
                    tempUserSystemAccess.c = 1;
                  } else {
                    tempUserSystemAccess.c = 0;
                  }
                  setAssignCrud(tempUserSystemAccess);
                  setFormChangeCount(formChangeCount + 1);
                  console.log("tempUserSystemAccess_", tempUserSystemAccess);
                }}
              />
              Create
            </div>
            <div className="col-2">
              <Input
                type="checkbox"
                value={1}
                name="rDocForm"
                id="rDocForm"
                checked={assignCrud.r == 1}
                onChange={(e) => {
                  let tempUserSystemAccess = assignCrud;
                  if (e.target.checked) {
                    tempUserSystemAccess.r = 1;
                  } else {
                    tempUserSystemAccess.r = 0;
                  }
                  setAssignCrud(tempUserSystemAccess);
                  setFormChangeCount(formChangeCount + 1);
                  console.log("tempUserSystemAccess_", tempUserSystemAccess);
                }}
              />
              Read
            </div>
            <div className="col-2">
              <Input
                type="checkbox"
                value={1}
                name="uDocForm"
                id="uDocForm"
                checked={assignCrud.u == 1}
                onChange={(e) => {
                  let tempUserSystemAccess = assignCrud;
                  if (e.target.checked) {
                    tempUserSystemAccess.u = 1;
                  } else {
                    tempUserSystemAccess.u = 0;
                  }
                  setAssignCrud(tempUserSystemAccess);
                  setFormChangeCount(formChangeCount + 1);
                  console.log("tempUserSystemAccess_", tempUserSystemAccess);
                }}
              />
              Update
            </div>
            <div className="col-2">
              <Input
                type="checkbox"
                value={1}
                name="dDocForm"
                id="dDocForm"
                checked={assignCrud.d == 1}
                onChange={(e) => {
                  let tempUserSystemAccess = assignCrud;
                  if (e.target.checked) {
                    tempUserSystemAccess.d = 1;
                  } else {
                    tempUserSystemAccess.d = 0;
                  }
                  setAssignCrud(tempUserSystemAccess);
                  setFormChangeCount(formChangeCount + 1);
                  console.log("tempUserSystemAccess_", tempUserSystemAccess);
                }}
              />
              Delete
            </div>
          </FormGroup>
          <div className="text-end">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </div>
      </Form>
    </>
  );
};

export default AssignQuestion2User;
