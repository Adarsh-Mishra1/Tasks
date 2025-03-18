import axios from "axios";
import { useEffect, useState } from "react";
import { FormGroup, Label, Input, Col, Button } from "reactstrap";
import {
  WsGetCaseTypes,
  WsPutClientCase,
  WsPutClientCaseNew,
} from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";
import userStore from "../../zustand/userStore";
import { toast } from "react-toastify";

function EditCase({
  SetEditingCase,
  editingCaseDetails,
  setEditingCaseDetails,
  getOrgClientCases,
}) {
  const [caseTypes, setCaseTypes] = useState();
  const userData = userStore((state) => state.user);

  useEffect(function () {
    getCaseType();
  }, []);

  const getCaseType = (parentTypeId) => {
    axios
      .get(
        WsGetCaseTypes +
          "/" +
          userData.id +
          (parentTypeId != null ? "/" + parentTypeId : ""),
        {
          headers: apiKeyHeader(),
        }
      )
      .then((response) => {
        const responseData = response.data;
        if (responseData.resultCode === 1) {
          setCaseTypes(responseData.resultMessage);
        } else {
          alert("CaseType: " + responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("error", error);
      });
  };

  const PutClientCase = async () => {
    const loader = toast.success("Loading...");
    await axios
      .post(
        // WsPutClientCase,
        WsPutClientCaseNew,
        JSON.stringify(editingCaseDetails),
        {
          headers: apiKeyHeader(),
        }
      )
      .then(async (response) => {
        const responseData = response.data;
        if (responseData.resultCode >= 1) {
          console.log("_responseData", responseData);
          await toast.dismiss(loader);
          toast.success("Case Edited Successfully.", { autoClose: 1000 });
          SetEditingCase(null);
          getOrgClientCases();
        } else {
          alert(responseData.resultMessage);
          await toast.dismiss(loader);
          toast.error("Error upading case.", { autoClose: 1000 });
        }
      })
      .catch(async (error) => {
        console.error("error", error);
        await toast.dismiss(loader);
        toast.error("Error upading case.", { autoClose: 1000 });
      });
  };

  return (
    <div>
      <label>
        Edit Case &nbsp;&nbsp;
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => SetEditingCase(null)}
        >
          Back
        </span>
      </label>
      <br />
      <FormGroup className="mb-3" row>
        <Label for="inputtitle" sm={2}>
          Title *
        </Label>

        <Col sm={10}>
          <Input
            type="text"
            className="form-control "
            id="inputtitle"
            aria-describedby="titleHelp"
            minLength={3}
            maxLength={64}
            required
            defaultValue={editingCaseDetails.title}
            onChange={(e) => {
              setEditingCaseDetails((prev) => ({
                ...prev,
                title: e.target.value,
              }));
            }}
          />
        </Col>
      </FormGroup>
      <FormGroup className="mb-3" row>
        <Label for="inputCaseType" sm={2}>
          Case Type *
        </Label>

        <Col sm={10}>
          <Input
            type="select"
            className="form-control "
            id="inputCaseType"
            aria-describedby="caseTypeHelp"
            value={editingCaseDetails.caseType}
            onChange={(e) => {
              setEditingCaseDetails((prev) => ({
                ...prev,
                caseType: Number(e.target.value),
              }));
            }}
          >
            <option>-Select-</option>
            {caseTypes != undefined &&
              caseTypes.map((caseType) => {
                return (
                  <option key={caseType.id} value={caseType.id}>
                    {caseType.type}
                  </option>
                );
              })}
          </Input>
        </Col>
      </FormGroup>
      <FormGroup className="mb-3" row>
        <Label for="inputdetails" sm={2}>
          Details *
        </Label>

        <Col sm={10}>
          <Input
            type="textarea"
            className="form-control "
            id="inputdetails"
            aria-describedby="detailsHelp"
            minLength={10}
            maxLength={500}
            required
            defaultValue={editingCaseDetails.details}
            onChange={(e) => {
              setEditingCaseDetails((prev) => ({
                ...prev,
                details: e.target.value,
              }));
            }}
          />
        </Col>
      </FormGroup>

      <div class="col-md-12 text-end p-0">
        <button
          class="btn btn-primary m-0"
          onClick={(e) => {
            e.preventDefault();
            PutClientCase();
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default EditCase;
