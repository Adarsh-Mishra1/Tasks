//ApproverRemarks.js
//By: Pramod Singh Rawat
import React, { useEffect, useState } from "react";
import {
  WSPutRemarks,
  WSGetRemarksBySubjectId,
} from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";
import axios from "axios";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

import Accordion from "react-bootstrap/Accordion";
// import Card from "react-bootstrap/Card";

// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// toast.configure();

const ContentRemarks = (props) => {
  console.log("ContentRemarks", props);
  console.log("ContentRemarks_props.user", props.user);

  const [contentRemark, setContentRemark] = useState("");
  const [contentRemarks, setContentRemarks] = useState([]);

  function postContentRemark(event) {
    event.preventDefault();

    axios
      .post(
        WSPutRemarks,
        JSON.stringify({
          subjectId: props.researchSubject.id,
          remark: contentRemark,
          userId: props.user.id,
        }),
        {
          headers: apiKeyHeader(),
        },
      )
      .then((response) => {
        const responseData = response.data;
        console.log("responseData_", responseData);
        if (responseData.resultCode === 1) {
          setContentRemark("");
          //ToDo: Fetch Remarks
          getRemarksByFormId();
        } else {
          alert(responseData.resultMessage);
          // toast.warn(responseData.result_message, {
          //   autoClose: 1400,
          // });
        }
      })
      .catch((error) => {
        console.error("error", error);
      });
  }

  useEffect(() => {
    getRemarksByFormId();
  }, []);

  function getRemarksByFormId() {
    axios
      .get(
        WSGetRemarksBySubjectId +
          "/" +
          props.researchSubject.id +
          "/" +
          props.user.id,
        {
          headers: apiKeyHeader(),
        },
      )
      .then((response) => {
        const responseData = response.data;
        console.log("responseData_", response.data);
        if (responseData.resultCode === 1) {
          setContentRemarks(responseData.resultMessage);
        }
        //else {
        //   toast.warn(responseData.result_message, {
        //     autoClose:1400
        //   });
        // }
      })
      .catch((error) => {
        console.error("error", error);
      });
  }

  return (
    <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Header style={{ margin: 0 }}>
          Click to Post/View your Remarks on this research topic
          {/* <i className="fa fa-arrow-down" aria-hidden="true"></i>{" "} */}
        </Accordion.Header>
        <Accordion.Body>
          <Tabs
            className="mb-1"
            defaultActiveKey="remarks"
            id="uncontrolled-tab-example"
          >
            {props.userType === "aprvr" ? (
              <Tab eventKey="postnew" title="Post">
                <div className="contentRemarks">
                  <Form className="addFormsPage" onSubmit={postContentRemark}>
                    <Input
                      type="textarea"
                      name="remark"
                      id="remark"
                      className="mb-1"
                      placeholder="Enter Remark"
                      value={contentRemark}
                      onChange={(event) => {
                        setContentRemark(event.target.value);
                      }}
                      minLength={6}
                      maxLength={200}
                      required
                    />
                    <div className="w-100 mt-2 text-end">
                      <button className="btn btn-primary mb-2 mx-0" type="Submit">
                        Post&nbsp;<i className="fa fa-send"></i>
                      </button>
                    </div>
                  </Form>
                </div>
              </Tab>
            ) : null}
            <Tab eventKey="remarks" title="Remarks">
              <div className="contentRemarks">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th scope="col">S. No</th>
                      <th scope="col">Remark</th>
                      <th scope="col">Remark By</th>
                      <th scope="col">Date </th>
                    </tr>
                  </thead>
                  <tbody>
                  {contentRemark.length < 1 ? <tr><td colSpan="4">No data found</td></tr>:''}
                    {
                    contentRemarks.map((contentRemarkThis, index) => (
                      <tr key={contentRemarkThis.id}>
                        <th scope="row">{index + 1}</th>
                        <td>{contentRemarkThis.remark}</td>
                        <td>{contentRemarkThis.createdBy.name}</td>
                        <td>{new Date(contentRemarkThis.createdOn) + ""}</td>
                      </tr>
                    ))}
                    
                    
                  </tbody>
                </table>
              </div>
            </Tab>
          </Tabs>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};
export default ContentRemarks;
