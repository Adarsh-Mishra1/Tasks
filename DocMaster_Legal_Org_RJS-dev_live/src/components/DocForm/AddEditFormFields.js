//AddEditFormFields.js
import React, { useState } from "react";
import { Button, Form, FormGroup, Label, Input, Col } from "reactstrap";
import { processCommaSeperated } from "../../OtherFunctions/OtherFunctions";

const AddEditFormFields = (props) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [action, setAction] = useState(props.action);
  const [fieldToEdit, setField2Edit] = useState(props.formFieldToEdit);

  console.log("AddEditFormFields");
  console.log("action", action);
  console.log("props", props);
  console.log("fieldToEdit", fieldToEdit);
  //ToDo: get sequence
  const [inputNameTitle, setInputNameTitle] = useState(
    fieldToEdit.elementConfig.inputNameTitle,
  );

  const [inputSequence, setInputSequence] = useState(
    Number(fieldToEdit.sequence),
  );

  const [inputLabel, setInputLabel] = useState(
    fieldToEdit.elementConfig.inputLabel,
  );
  const [inputPlaceholder, setInputPlaceholder] = useState(
    fieldToEdit.elementConfig.placeholder,
  );
  const [inputTooltips, setInputTooltips] = useState(
    fieldToEdit.elementConfig.tooltips,
  );
  const [inputFieldType, setInputFieldType] = useState(fieldToEdit.elementType);
  let [inputFieldValueType, setInputFieldValueType] = useState(
    fieldToEdit.elementConfig.type,
  );
  const [inputValues, setInputValues] = useState(fieldToEdit.value);
  const [inputMaxLength, setInputMaxLength] = useState(
    fieldToEdit.validation.maxLength,
  );
  const [inputMinLength, setInputMinLength] = useState(
    fieldToEdit.validation.minLength,
  );
  const [inputIsRequired, setInputIsRequired] = useState(
    fieldToEdit.inputIsRequired,
  );
  const [inputIsHidden, setInputIsHidden] = useState(fieldToEdit.isHidden);

  const [otherConditions, setOtherConditions] = useState(
    fieldToEdit.otherConditions,
  );

  let inputIsGlobalTemp = false;

  console.log("inputIsGlobalTemp1", inputIsGlobalTemp);
  if (fieldToEdit.isGlobal == true) {
    inputIsGlobalTemp = true;
  }
  console.log("inputIsGlobalTemp2", inputIsGlobalTemp);
  const [inputIsGlobal, setInputIsGlobal] = useState(inputIsGlobalTemp);
  console.log("inputIsGlobal", inputIsGlobal);

  let showInputMinMaxTemp = true;
  if (
    inputFieldType.toLowerCase() == "input" ||
    inputFieldType.toLowerCase() == "textarea" ||
    inputFieldType.toLowerCase() == "range" ||
    inputFieldType.toLowerCase() == "password" ||
    (inputFieldType.toLowerCase() == "checkbox" &&
      (fieldToEdit.elementConfig.type.toLowerCase() == "multiselectt1" ||
        fieldToEdit.elementConfig.type.toLowerCase() == "multiselectt2" ||
        fieldToEdit.elementConfig.type.toLowerCase() == "multiselectt3" ||
        fieldToEdit.elementConfig.type.toLowerCase() == "multiselectt4" ||
        fieldToEdit.elementConfig.type.toLowerCase() == "multiselectt5"))
  ) {
    showInputMinMaxTemp = true;
  } else {
    showInputMinMaxTemp = false;
  }

  const [showInputMinMax, setShowInputMinMax] = useState(showInputMinMaxTemp);

  /*
  let [inputValueStyle, setInputValueStyle] = useState([]);
  if(fieldToEdit.valueStyle!=undefined){
    setInputValueStyle(fieldToEdit.valueStyle);//fieldToEdit.valueStyle;    
  }
  */

  let inputValueStyle2Set = [];
  if (fieldToEdit.valueStyle != undefined) {
    inputValueStyle2Set = fieldToEdit.valueStyle;
  }
  let [inputValueStyle, setInputValueStyle] = useState(inputValueStyle2Set);

  function onFormFieldsSubmit(e) {
    e.preventDefault();

    //ToDo: Validate Selected Form Fields
    inputFieldValueType = inputFieldValueType.replace(/\s/g, "").toLowerCase();
    let proceed = true;
    if (
      inputFieldType.toLowerCase() == "select" ||
      inputFieldType.toLowerCase() == "radio"
    ) {
      if (inputFieldValueType == "text") {
        var inputValuesTemp = inputValues.split(",");
        if (inputValuesTemp.length <= 1) {
          window.alert("Provide Values");
          proceed = false;
        }
      }
    }

    if (proceed == true) {
      let isConditionalTemp = fieldToEdit.isConditional;
      let conditionTemp = fieldToEdit.condition;
      if (
        fieldToEdit.isConditional == true &&
        fieldToEdit.elementType.toLowerCase() != inputFieldType.toLowerCase()
      ) {
        isConditionalTemp = false;
        if (
          inputFieldType.toLowerCase() == "select" ||
          inputFieldType.toLowerCase() == "radio"
        ) {
          conditionTemp = { conditionStatements: {} };
        } else {
          conditionTemp = {};
        }
      }

      //let objectKey=inputNameTitle.replace(/\s/g, "").toLowerCase();
      let objectKey = fieldToEdit.elementUId; ////elementUId
      let fieldElement4 = {};
      if (
        inputFieldType.toLowerCase() == "select" ||
        inputFieldType.toLowerCase() == "radio"
      ) {
        fieldElement4[objectKey] = {
          sequence: inputSequence,
          isHidden: inputIsHidden,
          isGlobal: inputIsGlobal,
          isConditional: isConditionalTemp,
          condition: conditionTemp,
          elementUId: objectKey,
          elementType: inputFieldType,
          elementConfig: {
            type: inputFieldValueType,
            placeholder: inputPlaceholder,
            tooltips: inputTooltips,
            inputNameTitle: inputNameTitle,
            inputLabel: inputLabel,
          },
          value: processCommaSeperated(inputValues),
          otherConditions: otherConditions,
          validation: {
            required: true,
            minLength: inputMinLength,
            maxLength: inputMaxLength,
            isNumeric: false,
            error: "",
          },
          inputIsRequired: inputIsRequired,
          valid: false,
          touched: false,
          valueStyle: inputValueStyle,
        };
      } else {
        fieldElement4[objectKey] = {
          sequence: inputSequence,
          isHidden: inputIsHidden,
          isGlobal: inputIsGlobal,
          isConditional: isConditionalTemp,
          condition: conditionTemp,
          elementUId: objectKey,
          elementType: inputFieldType,
          elementConfig: {
            type: inputFieldValueType,
            placeholder: inputPlaceholder,
            tooltips: inputTooltips,
            inputNameTitle: inputNameTitle,
            inputLabel: inputLabel,
          },
          value: processCommaSeperated(inputValues),
          otherConditions: otherConditions,
          validation: {
            required: true,
            minLength: inputMinLength,
            maxLength: inputMaxLength,
            isNumeric: false,
            error: "",
          },
          inputIsRequired: inputIsRequired,
          valid: false,
          touched: false,
          valueStyle: inputValueStyle,
        };
      }

      //document.getElementById("inputDocFormFieldAddForm").reset();
      props.onAddEditDocumentFormFieldsSubmit(fieldElement4);

      setInputNameTitle("");
      setInputLabel("");
      setInputPlaceholder("");
      setInputTooltips("");
      setInputFieldType("Input");
      setInputFieldValueType("text");
      setInputValues("");
      setInputMaxLength("");
      setInputMinLength("");
      setInputIsRequired(true);
      setInputIsHidden(false);
      setOtherConditions("");

      setModalIsOpen(false);
    }
  }

  function inputNameTitleChangeHandler(e) {
    setInputNameTitle(e.target.value);
  }

  function inputSequenceChangeHandler(e) {
    setInputSequence(Number(e.target.value));
  }

  function inputLabelChangeHandler(e) {
    setInputLabel(e.target.value);
  }

  function inputPlaceholderChangeHandler(e) {
    setInputPlaceholder(e.target.value);
  }

  function inputTooltipsChangeHandler(e) {
    setInputTooltips(e.target.value);
  }

  function inputFieldTypeChangeHandler(e) {
    console.log("inputFieldTypeChangeHandler");
    console.log("Old", fieldToEdit.elementType);
    console.log("New", e.target.value);

    if (
      fieldToEdit.isConditional == true &&
      fieldToEdit.elementType.toLowerCase() != e.target.value.toLowerCase()
    ) {
      alert(
        "Proceed Carefully with this option!\nThere is Condition Present, the Condition may not work or get reset.\nYou may need to recreate condition.",
      );
    } else {
      if (
        e.target.value.toLowerCase() == "input" ||
        e.target.value.toLowerCase() == "textarea" ||
        e.target.value.toLowerCase() == "range" ||
        e.target.value.toLowerCase() == "password" ||
        (e.target.value.toLowerCase() == "checkbox" &&
          (inputFieldValueType.toLowerCase() == "multiselectt1" ||
            inputFieldValueType.toLowerCase() == "multiselectt2" ||
            inputFieldValueType.toLowerCase() == "multiselectt3" ||
            inputFieldValueType.toLowerCase() == "multiselectt4" ||
            inputFieldValueType.toLowerCase() == "multiselectt5"))
      ) {
        setShowInputMinMax(true);
      } else {
        setShowInputMinMax(false);
      }
      setInputFieldType(e.target.value);
    }
  }

  function inputFieldValueTypeChangeHandler(e) {
    //console.log("inputFieldValueTypeChangeHandler_inputFieldType",inputFieldType)
    //console.log("inputFieldValueTypeChangeHandler_",e.target.value)
    if (
      inputFieldType.toLowerCase() == "input" ||
      inputFieldType.toLowerCase() == "textarea" ||
      inputFieldType.toLowerCase() == "range" ||
      inputFieldType.toLowerCase() == "password" ||
      (inputFieldType.toLowerCase() == "checkbox" &&
        (e.target.value.toLowerCase() == "multiselectt1" ||
          e.target.value.toLowerCase() == "multiselectt2" ||
          e.target.value.toLowerCase() == "multiselectt3" ||
          e.target.value.toLowerCase() == "multiselectt4" ||
          e.target.value.toLowerCase() == "multiselectt5"))
    ) {
      setShowInputMinMax(true);
    } else {
      setShowInputMinMax(false);
    }
    setInputFieldValueType(e.target.value);
  }

  function inputValuesChangeHandler(e) {
    setInputValues(e.target.value);
  }

  function otherConditionsChangeHandler(e) {
    setOtherConditions(e.target.value);
    //console.log("inputValuesChangeHandler",processCommaSeperated(e.target.value))
  }

  function inputMaxLengthChangeHandler(e) {
    setInputMaxLength(e.target.value);
  }

  function inputMinLengthChangeHandler(e) {
    setInputMinLength(e.target.value);
  }

  function inputIsRequiredChangeHandler(e) {
    if (e.target.value === "true") {
      setInputIsRequired(true);
    } else {
      setInputIsRequired(false);
    }
  }

  function inputIsHiddenChangeHandler(e) {
    if (e.target.value === "true") {
      setInputIsHidden(true);
    } else {
      setInputIsHidden(false);
    }
  }

  function inputIsGlobalChangeHandler(e) {
    if (e.target.value == "true") {
      setInputIsGlobal(true);
    } else {
      setInputIsGlobal(false);
    }
  }

  function inputIsBoxedStyled(e) {
    //console.log("inputIsBoxedStyled", e.target.checked);
    //const [inputValueStyle, setInputValueStyle] = useState([]);
    //let inputValueStyle2Set = [];//inputValueStyle;
    //inputValueStyle2Set.push(inputValueStyle);
    let inputValueStyle2Set = Array.from(inputValueStyle);
    if (e.target.checked == true) {
      //console.log("inputIsBoxedStyledValue","Add boxedChars")
      if (inputValueStyle2Set.indexOf(e.target.value) === -1) {
        inputValueStyle2Set.push(e.target.value);
      }
    } else {
      //console.log("inputIsBoxedStyledValue","Remove boxedChars")
      if (inputValueStyle2Set.indexOf(e.target.value) >= 0) {
        inputValueStyle2Set.splice(
          inputValueStyle2Set.indexOf(e.target.value),
          1,
        );
        //console.log(e.target.value);
      }
    }
    //setInputValueStyle(inputValueStyle2Set);
    setInputValueStyle(inputValueStyle2Set);
    //console.log("inputIsBoxedStyled_inputValueStyle", inputValueStyle2Set);
  }

  return (
    <>
      {/* <div className=""> */}
      {/* <div className="col-12"> */}
      {/* <h5>Form fields to Edit</h5> */}
      {/* </div> */}
      <div className="px-3">
        <Form
          id="inputDocFormFieldAddForm"
          className=""
          onSubmit={onFormFieldsSubmit}
          method="POST"
        >
          <FormGroup className="mb-3 row">
            <Label sm={3} for="sequence">
              Sequence
            </Label>
            <Col sm={9}>
              <Input
                type="number"
                name="sequence"
                id="sequence"
                onChange={inputSequenceChangeHandler}
                value={inputSequence}
                min={0}
                required
              />
            </Col>
          </FormGroup>
          <FormGroup className="mb-3 mt-2 row">
            <Label for="label" sm={3}>
              {"{FieldName}"}*
            </Label>
            <Col sm={9}>
              <Input
                type="text"
                name="inptNameTitle"
                id="inptNameTitle"
                placeholder="Name/Title"
                value={inputNameTitle}
                onChange={inputNameTitleChangeHandler}
                readOnly
                required
              />
            </Col>
          </FormGroup>

          <FormGroup className="mb-3 mt-2 row">
            <Label for="label" sm={3}>
              Label*
            </Label>
            <Col sm={9}>
              <Input
                type="text"
                name="inptLabel"
                id="inptLabel"
                placeholder="Label"
                value={inputLabel}
                onChange={inputLabelChangeHandler}
                required
              />
            </Col>
          </FormGroup>

          <FormGroup className="mb-3 row">
            <Label sm={3} for="filedType">
              Field Type*
            </Label>
            <Col sm={9}>
              <Input
                className="form-control"
                type="select"
                name="inptFieldType"
                id="inptFieldType"
                placeholder="FieldType"
                value={inputFieldType}
                onChange={inputFieldTypeChangeHandler}
                readOnly
                disabled
                required
              >
                <option value="Input">Input</option>
                <option value="Textarea">Textarea</option>
                <option value="Range">Range</option>
                <option value="Password">Password</option>
                <option value="Label">Label</option>
                <option value="Date">Date</option>
                <option value="Time">Time</option>
                <option value="Checkbox">Checkbox</option>
                <option value="Radio">Radio</option>
                <option value="Select">DropDown</option>
                <option value="formula">Formula</option>
                <option value="strngformula">String Formula</option>
                <option value="legalformula">Legal Formula</option>
                <option value="amount2words">Amount to Words</option>
                <option value="copyOfInput">Copy of Field</option>
                <option value="trigger">InputTrigger</option>
              </Input>
            </Col>
          </FormGroup>

          <FormGroup className="mb-3 row">
            <Label sm={3} for="filedType">
              Field Value Type*
            </Label>
            <Col sm={9}>
              <Input
                className="form-control"
                type="select"
                name="inptFieldValueType"
                id="inptFieldValueType"
                placeholder="Field Value Type"
                value={inputFieldValueType}
                onChange={inputFieldValueTypeChangeHandler}
                required
              >
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="file">File</option>
                <option value="image">Image</option>
                <option value="date">Date</option>
                <option value="time24">Time(24 Hour Format)</option>
                <option value="time12">Time(12 Hour Format)</option>
                <option value="date_l1">
                  Date_l1(DD of MMM of The year YYY)
                </option>
                <option value="date_l2">Date_l2(DD MMM, YYY)</option>
                <option value="number">Number</option>
                <option value="password">Password</option>
                <option value="daystring">Day String</option>
                <option value="monthstring">Month String</option>
                <option value="multiselectt1">
                  MultiSelect Checkbox (Next Line)
                </option>
                <option value="multiselectt2">
                  MultiSelect Checkbox (Comma)
                </option>
                <option value="multiselectt3">
                  MultiSelect Checkbox (Next Line-Non Numeric)
                </option>
                <option value="multiselectt4">
                  MultiSelect Checkbox (Ordered List Item)
                </option>
                <option value="multiselectt5">
                  MultiSelect Checkbox (UnOrdered List Item)
                </option>
              </Input>
            </Col>
          </FormGroup>

          <FormGroup className="mb-3 row">
            <Label sm={3} for="placeholder">
              Place-holder
            </Label>
            <Col sm={9}>
              <Input
                type="text"
                name="inptPlaceholder"
                id="inptPlaceholder"
                placeholder="Placeholder"
                value={inputPlaceholder}
                onChange={inputPlaceholderChangeHandler}
              />
            </Col>
          </FormGroup>
          <FormGroup className="mb-3 row">
            <Label sm={3} for="tooltip">
              Tooltip
            </Label>
            <Col sm={9}>
              <Input
                type="text"
                name="inptTooltip"
                id="inptTooltip"
                placeholder="Tooltip"
                value={inputTooltips}
                onChange={inputTooltipsChangeHandler}
              />
            </Col>
          </FormGroup>

          <FormGroup className="mb-3 row">
            <Label sm={3} for="values">
              Values (*,[Comma] Separated if Multiple)
              <br /> (*next line for Multi Selected CheckBox)
            </Label>
            <Col sm={9}>
              <Input
                type="textarea"
                name="inptValues"
                id="inptValues"
                onChange={inputValuesChangeHandler}
                value={inputValues}
                rows={4}
              />
            </Col>
          </FormGroup>

          <FormGroup className="mb-3 row">
            <Label sm={3} for="placeholder" className="boldLabel">
              Other Conditions
            </Label>
            <Col sm={9}>
              <Input
                type="text"
                name="otherConditions"
                id="otherConditions"
                placeholder="Other Conditions"
                value={otherConditions}
                onChange={otherConditionsChangeHandler}
              />
            </Col>
          </FormGroup>

          {(() => {
            if (showInputMinMax == true) {
              return (
                <>
                  <FormGroup className="mb-3 row">
                    <Label sm={3} for="maxLength">
                      Max(Length: incase of text data, Limit: incase of
                      Numric/Number OR Range Data, Width Incase of Image)
                    </Label>
                    <Col sm={9}>
                      <Input
                        type="number"
                        name="inptMaxLength"
                        id="inptMaxLength"
                        placeholder="Length: incase of text data, Limit: incase of Numric/Number OR Range Data, Width Incase of Image"
                        onChange={inputMaxLengthChangeHandler}
                        value={inputMaxLength}
                        required
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup className="mb-3 row">
                    <Label sm={3} for="minLength">
                      Min(Length: incase of text data, Limit: incase of
                      Numric/Number OR Range Data, height Incase of Image)
                    </Label>
                    <Col sm={9}>
                      <Input
                        type="number"
                        name="inptMinLength"
                        id="inptMinLength"
                        placeholder="Length: incase of text data, Limit: incase of Numric/Number OR Range Data, height Incase of Image"
                        onChange={inputMinLengthChangeHandler}
                        value={inputMinLength}
                        required
                      />
                    </Col>
                  </FormGroup>
                </>
              );
            }
          })()}

          <FormGroup className="mb-3 row">
            <Label sm={3} for="filedType">
              Is Required
            </Label>
            <Col sm={9}>
              <Input
                className="form-control"
                type="select"
                name="inptIsRequired"
                id="inptIsRequired"
                onChange={inputIsRequiredChangeHandler}
                value={inputIsRequired}
                required
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Input>
            </Col>
          </FormGroup>

          <FormGroup className="mb-3 row">
            <Label sm={3}>Is Hidden</Label>
            <Col sm={9}>
              <Input
                className="form-control"
                type="select"
                name="inputIsHidden"
                id="inputIsHidden"
                onChange={inputIsHiddenChangeHandler}
                value={inputIsHidden}
                required
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Input>
            </Col>
          </FormGroup>

          <FormGroup className="mb-3 row">
            <Label sm={3}>Is Global</Label>
            <Col sm={9}>
              <Input
                className="form-control"
                type="select"
                name="inputIsGlobal"
                id="inputIsGlobal"
                onChange={inputIsGlobalChangeHandler}
                value={inputIsGlobal}
                readOnly
                required
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Input>
            </Col>
          </FormGroup>

          <FormGroup className="row">
            <Label sm={3} className="boldLabel">
              Style(s)
            </Label>
            <Col sm={9}>
              {/* <Input
                  name="inputValueStyle"
                  id="inputValueBoxed"
                  type="checkbox"
                  onChange={inputIsBoxedStyled}
                  checked={inputValueStyle.some((item) => item === "boxed")}
                  value={"boxed"}
                /> */}
              {/* {(() => {
                  
                  if (inputValueStyle.some((item) => item === "boxed")) {
                    return (
                      <Input
                        name="inputValueStyle"
                        id="inputValueBoxed"
                        type="checkbox"
                        checked={true}
                        onChange={inputIsBoxedStyled}
                        value={"boxed"}
                      />
                    );
                  } else {
                    return (
                      <Input
                        name="inputValueStyle"
                        id="inputValueBoxed"
                        type="checkbox"
                        onChange={inputIsBoxedStyled}
                        value={"boxed"}
                      />
                    );
                  }
                })()}{" "}                
                Boxed Character(s) <br /> */}
              <Input
                name="inputValueStyle"
                id="inputValueBoxed"
                type="checkbox"
                checked={inputValueStyle.some((item) => item === "boxed")}
                onChange={inputIsBoxedStyled}
                value={"boxed"}
              />{" "}
              Boxed Character(s) <br />
              <Input
                name="inputValueStyle"
                id="inputValueAllCaps"
                type="checkbox"
                checked={inputValueStyle.some((item) => item === "allcaps")}
                onChange={inputIsBoxedStyled}
                value={"allcaps"}
              />{" "}
              All Caps <br />
              <Input
                name="inputValueStyle"
                id="inputValueHideInput"
                type="checkbox"
                checked={inputValueStyle.some((item) => item === "hideinput")}
                onChange={inputIsBoxedStyled}
                value={"hideinput"}
              />{" "}
              Hide Input <br />
              <Input
                name="inputValueStyle"
                id="inputValueCommaSepNum1"
                type="checkbox"
                checked={inputValueStyle.some(
                  (item) => item === "commasepnum1",
                )}
                onChange={inputIsBoxedStyled}
                value={"commasepnum1"}
              />{" "}
              Comma(,) Separated (for Number only) <br />
            </Col>
          </FormGroup>

          <Button type="submit" className="btn btn-sm btn-primary mt-2">
            Submit
          </Button>
        </Form>
      </div>
      {/* </div> */}
    </>
  );
};

export default AddEditFormFields;
