//MultiChoiceValueConditionPopUp.js
import React, { useState } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Col,
} from "reactstrap";

import _ from "lodash";
import {
  ordinal_suffix_of,
  month2MonthString,
} from "../../OtherFunctions/OtherFunctions";

function MultiChoiceValueConditionPopUp(props) {
  console.log("MultiChoiceValueConditionPopUp");
  console.log("props", props);

  console.log(
    "valuesForMultiChoiceSelectCondition",
    props.valuesForMultiChoiceSelectCondition,
  );

  var inputValues = props.valuesForMultiChoiceSelectCondition; //props.mainDocumentFormField.value.split(",");
  console.log("valueArray", inputValues);
  const [selectedValue, SetSelectedValue] = useState("");

  function inputFieldTypeChangeHandler(e) {
    SetSelectedValue(e.target.value);
  }

  function onFormFieldsSubmit(e) {
    e.preventDefault();
    props.onChoiceValueSelect(
      props.mainDocumentFormField,
      props.formFieldkey,
      selectedValue,
    );
  }

  if (props.mainDocumentFormField.elementConfig.type == "daystring") {
    return (
      <Form
        id="inputDocFormFieldAddForm"
        className="px-3 py-2"
        onSubmit={onFormFieldsSubmit}
        method="POST"
        style={{
          width: "100%",
        }}
      >
        <FormGroup>
          <Label className="row boldLabel">
            <div className=" col-12">
              Select a Value For Which you want to enter Condition
            </div>
          </Label>
          <div className="row col-12">
            <Input
              type="select"
              name="valueselect"
              id="valueselect"
              placeholder="Select a Value"
              onChange={inputFieldTypeChangeHandler}
              required
              className="form-control"
            >
              <option key="mSelectKey" value="">
                -Select-
              </option>
              {_.range(1, 31 + 1).map((value) => (
                <option
                  key={ordinal_suffix_of(value)}
                  value={ordinal_suffix_of(value)}
                >
                  {ordinal_suffix_of(value)}
                </option>
              ))}
            </Input>
          </div>
          <div className="text-center">
            <Button type="submit" className="btn  btn-primary mt-2">
              Submit
            </Button>
          </div>
        </FormGroup>
      </Form>
    );
  } else if (props.mainDocumentFormField.elementConfig.type == "monthstring") {
    return (
      <Form
        id="inputDocFormFieldAddForm"
        className="px-3 py-2"
        onSubmit={onFormFieldsSubmit}
        method="POST"
        style={{
          width: "100%",
        }}
      >
        <FormGroup>
          <Label className="row boldLabel">
            <div className=" col-12">
              Select a Value For Which you want to enter Condition
            </div>
          </Label>
          <div className="row col-12">
            <Input
              type="select"
              name="valueselect"
              id="valueselect"
              placeholder="Select a Value"
              onChange={inputFieldTypeChangeHandler}
              required
              className="form-control"
            >
              <option key="mSelectKey" value="">
                -Select-
              </option>
              {_.range(1, 12 + 1).map((value) => (
                <option
                  key={month2MonthString(value)}
                  value={month2MonthString(value)}
                >
                  {month2MonthString(value)}
                </option>
              ))}
            </Input>
          </div>
          <div className="text-center">
            <Button type="submit" className="btn btn-primary mt-2">
              Submit
            </Button>
          </div>
        </FormGroup>
      </Form>
    );
  } else {
    return (
      <Form
        id="inputDocFormFieldAddForm"
        className="px-3 py-2"
        onSubmit={onFormFieldsSubmit}
        method="POST"
        style={{
          width: "100%",
        }}
      >
        <FormGroup>
          <Label className="row boldLabel">
            <div className=" col-12">
              Select a Value For Which you want to enter Condition
            </div>
          </Label>
          <div className="row col-12">
            <Input
              type="select"
              name="valueselect"
              id="valueselect"
              placeholder="Select a Value"
              onChange={inputFieldTypeChangeHandler}
              required
              className="form-control"
            >
              <option key="mSelectKey" value="">
                -Select-
              </option>
              {inputValues.map((inputValue) => (
                <option key={inputValue} value={inputValue}>
                  {inputValue}
                </option>
              ))}
            </Input>
          </div>
          <div className="text-center">
            <Button type="submit" className="btn btn-primary mt-2">
              Submit
            </Button>
          </div>
        </FormGroup>
      </Form>
    );
  }
}

export default MultiChoiceValueConditionPopUp;
