//AddFormFields.js
import React, { useState } from "react";
import { Button, Form, FormGroup, Label, Input, Col } from "reactstrap";
import Modal from "react-modal";
import { processCommaSeperated } from "../../OtherFunctions/OtherFunctions";
import * as XLSX from "xlsx";

const AddFormFields = (props) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [action, setAction] = useState(props.action);
  const [field2Edit, setField2Edit] = useState({});

  // console.log("AddFormFields");
  // console.log("action", action);
  // console.log("field2Edit", field2Edit);
  //ToDo: get sequence
  const [inputNameTitle, setInputNameTitle] = useState("");
  const [inputLabel, setInputLabel] = useState("");
  const [inputPlaceholder, setInputPlaceholder] = useState("");
  const [inputTooltips, setInputTooltips] = useState("");
  const [inputFieldType, setInputFieldType] = useState("Input");
  let [inputFieldValueType, setInputFieldValueType] = useState("text");
  const [inputValues, setInputValues] = useState("");
  const [inputMaxLength, setInputMaxLength] = useState(20);
  const [inputSequence, setInputSequence] = useState(0);
  const [inputMinLength, setInputMinLength] = useState(4);
  const [inputIsRequired, setInputIsRequired] = useState(true);
  const [inputIsHidden, setInputIsHidden] = useState(false);
  const [showInputMinMax, setShowInputMinMax] = useState(true);
  const [inputIsGlobal, setInputIsGlobal] = useState(false);
  let [inputValueStyle, setInputValueStyle] = useState([]);

  const [otherConditions, setOtherConditions] = useState("");

  //ToDo:Field Selection Flow
  //1. Show Max,Min for Input, TextArea, Range,

  function onFormFieldsSubmit(e) {
    e.preventDefault();

    inputFieldValueType = inputFieldValueType.replace(/\s/g, "").toLowerCase();
    let proceed = true;
    //ToDo: Validate Selected Form Fields
    //1. Show Max, Min for Input, TextArea, Range,
    //DataList

    if (
      inputFieldType.toLowerCase() == "select" ||
      inputFieldType.toLowerCase() == "radio" ||
      inputFieldType.toLowerCase() == "datalist"
    ) {
      if (inputFieldValueType == "text") {
        var inputValuesTemp = inputValues.split(",");
        if (inputValuesTemp.length <= 1) {
          window.alert("Provide Values");
          proceed = false;
        }
      }
    }

    //window.alert("proceed "+proceed);
    let objectKey = inputNameTitle.replace(/\s/g, "").toLowerCase();

    if (inputIsGlobal == true) {
      objectKey = "glbl_" + inputNameTitle.replace(/\s/g, "").toLowerCase();
    }
    if (proceed == true) {
      let fieldElement4 = {};
      if (
        inputFieldType.toLowerCase() == "select" ||
        inputFieldType.toLowerCase() == "radio" ||
        inputFieldType.toLowerCase() == "datalist"
      ) {
        fieldElement4[objectKey] = {
          sequence: inputSequence,
          isHidden: inputIsHidden,
          isGlobal: inputIsGlobal,
          isConditional: false,
          condition: { conditionStatements: {} },
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
          isConditional: false,
          condition: {},
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
      props.onAddDocumentFormFieldsSubmit(fieldElement4);

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

  function processExcel(data) {
    const workbook = XLSX.read(data, { type: "binary" });
    const firstSheet = workbook.SheetNames[0];
    const excelRows = XLSX.utils.sheet_to_row_object_array(
      workbook.Sheets[firstSheet],
    );
    //console.log(excelRows);
    return excelRows;
  }

  function inputFieldUploadChangeHandler(e) {
    //console.log("-inputFieldUploadChangeHandler-",e)
    let inTarget = e.target;
    const files = e.target.files;
    if (typeof FileReader !== "undefined") {
      const reader = new FileReader();
      if (reader.readAsBinaryString) {
        reader.onload = (e) => {
          //let excelRows = processExcel(reader.result);
          //console.log("inputFieldUploadChangeHandler_excelRows",excelRows)
          //props.onUploadDocumentFormFieldsSubmit(excelRows);
          props.onUploadDocumentFormFieldsSubmit(processExcel(reader.result));
          inTarget.value = null;
        };
        reader.readAsBinaryString(files[0]);
      }
    } else {
      window.alert("This browser does not support HTML5.");
    }
    //const result = e.target.result;
    //console.log("-inputFieldUploadChangeHandler_files",files)
    //console.log("-inputFieldUploadChangeHandler_result",result)
    //let fileName = files[0].name;
    //console.log("-inputFieldUploadChangeHandler_fileName",fileName)
    /*const regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
    if (regex.test(files[0].name.toLowerCase())) {
      let fileName = files[0].name;
      if (typeof (FileReader) !== 'undefined') {
          const reader = new FileReader();
          if (reader.readAsBinaryString) {
              reader.onload = (e) => {
                  //let excelRows = processExcel(reader.result);
                  //console.log("inputFieldUploadChangeHandler_excelRows",excelRows)
                  //props.onUploadDocumentFormFieldsSubmit(excelRows);
                  props.onUploadDocumentFormFieldsSubmit(processExcel(reader.result));
                  inTarget.value=null;
              };
              reader.readAsBinaryString(files[0]);
          }
      } else {
          window.alert("This browser does not support HTML5.");
      }
    } else {
      window.alert("Please upload a valid Excel file.");
    }*/
  }

  function inputNameTitleChangeHandler(e) {
    setInputNameTitle(e.target.value);
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
    //1. Show Max,Min for Input, TextArea, Range,Password
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

  function inputFieldValueTypeChangeHandler(e) {
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
    //console.log("inputValuesChangeHandler",processCommaSeperated(e.target.value))
  }

  function otherConditionsChangeHandler(e) {
    setOtherConditions(e.target.value);
    //console.log("inputValuesChangeHandler",processCommaSeperated(e.target.value))
  }

  function inputMaxLengthChangeHandler(e) {
    setInputMaxLength(e.target.value);
  }

  function inputSequenceChangeHandler(e) {
    setInputSequence(Number(e.target.value));
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
    if (e.target.value === "true") {
      setInputIsGlobal(true);
    } else {
      setInputIsGlobal(false);
    }
  }

  function inputIsBoxedStyled(e) {
    //console.log("inputIsBoxedStyled",e.target.checked)
    //const [inputValueStyle, setInputValueStyle] = useState([]);
    if (e.target.checked == true) {
      //console.log("inputIsBoxedStyledValue","Add boxedChars")
      if (inputValueStyle.indexOf(e.target.value) === -1) {
        inputValueStyle.push(e.target.value);
      }
    } else {
      //console.log("inputIsBoxedStyledValue","Remove boxedChars")
      if (inputValueStyle.indexOf(e.target.value) >= 0) {
        inputValueStyle.splice(inputValueStyle.indexOf(e.target.value), 1);
        console.log(e.target.value);
      }
    }
    console.log("inputIsBoxedStyled_inputValueStyle", inputValueStyle);
  }

  // Create a reference to the hidden file input element
  const hiddenFileInput = React.useRef(null);

  // Programatically click the hidden file input element
  // when the Button component is clicked
  const handleUploadFieldsButtonClick = (event) => {
    hiddenFileInput.current.click();
  };

  const handleDownloadFieldsButtonClick = (event) => {
    props.onDownloadDocumentFormFieldsSubmit();
  };

  // Call a function (passed as a prop from the parent component)
  // to handle the user-selected file
  // const handleChange = (event) => {
  //   const fileUploaded = event.target.files[0];
  //   //props.handleFile(fileUploaded);
  // };

  return (
    <>
      <Modal
        // transparent={false}
        ariaHideApp={false}
        isOpen={modalIsOpen}
        // onRequestClose={() => setModalIsOpen(false)}
        style={{
          overlay: {
            // border: "1px solid gray",
            // width: "45vw",
            width: "99vw",
            height: "100vh",
            // left: "27%",
            left: 0,
            top: "0%",
            // background: "transparent",
            zIndex: "999",
          },
          content: {
            left: "10%",
            width: "80vw",
            // background: "transparent",
            // border: "none",
            // boxShadow:"0 0 5px black"
          },
        }}
      >
        <div className="row">
          <div className="col-6">
            <h5>Form Fields</h5>
          </div>
          <div className="col-6" style={{ textAlign: "end" }}>
            <span className="pointer" onClick={() => setModalIsOpen(false)}>
              <button className="btn-sm btn-danger"><i className="fa fa-times"></i></button>
            </span>
          </div>

          <div className="col-12">
            <Form
              id="inputDocFormFieldAddForm"
              className="px-3 py-2"
              onSubmit={onFormFieldsSubmit}
              method="POST"
            >
              <FormGroup className="row">
                <Label sm={2} for="sequence" className="boldLabel">
                  Sequence
                </Label>
                <Col sm={10}>
                  <Input
                    type="number"
                    className="form-control"
                    name="sequence"
                    id="sequence"
                    onChange={inputSequenceChangeHandler}
                    value={inputSequence}
                    min={0}
                    required
                  />
                </Col>
              </FormGroup>

              <div className="d-flex">
                <div className="col-6 zero-padding">
                  <FormGroup className="row">
                    <Label for="label" sm={4} className="boldLabel">
                      {"{FieldName}"}*
                    </Label>
                    <Col sm={8}>
                      <Input
                        type="text"
                        className="form-control"
                        name="inptNameTitle"
                        id="inptNameTitle"
                        placeholder="Name/Title"
                        value={inputNameTitle}
                        onChange={inputNameTitleChangeHandler}
                        required
                      />
                    </Col>
                  </FormGroup>

                  <FormGroup className="row">
                    <Label for="label" sm={4} className="boldLabel">
                      Label*
                    </Label>

                    <Col sm={8}>
                      <Input
                        type="text"
                        className="form-control"
                        name="inptLabel"
                        id="inptLabel"
                        placeholder="Label"
                        value={inputLabel}
                        onChange={inputLabelChangeHandler}
                        required
                      />
                    </Col>
                  </FormGroup>

                  <FormGroup className="row">
                    <Label sm={4} for="filedType" className="boldLabel">
                      Field Type*
                    </Label>
                    <Col sm={8}>
                      <Input
                        type="select"
                        className="form-control"
                        name="inptFieldType"
                        id="inptFieldType"
                        placeholder="FieldType"
                        value={inputFieldType}
                        onChange={inputFieldTypeChangeHandler}
                        required
                      >
                        <option value="Input">Input</option>
                        <option value="TextArea">Textarea</option>
                        <option value="Range">Range</option>
                        <option value="Password">Password</option>
                        <option value="Label">Label</option>
                        <option value="Date">Date</option>
                        <option value="Time">Time</option>
                        <option value="CheckBox">Checkbox</option>
                        <option value="Radio">Radio</option>
                        <option value="Select">DropDown</option>
                        <option value="DataList">DataList</option>
                        <option value="formula">Formula</option>
                        <option value="strngformula">String Formula</option>
                        <option value="legalformula">Legal Formula</option>
                        <option value="amount2words">Amount to Words</option>
                        <option value="copyOfInput">Copy of Field</option>
                        <option value="trigger">InputTrigger</option>
                      </Input>
                    </Col>
                  </FormGroup>
                </div>

                <div className="col-6 zero-padding">
                  <FormGroup className="row">
                    <Label sm={4} for="filedType" className="boldLabel">
                      Field Value Type*
                    </Label>

                    <Col sm={8}>
                      <Input
                        type="select"
                        className="form-control"
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

                  <FormGroup className=" row">
                    <Label sm={4} for="placeholder" className="boldLabel">
                      Place-holder
                    </Label>
                    <Col sm={8}>
                      <Input
                        type="text"
                        className="form-control"
                        name="inptPlaceholder"
                        id="inptPlaceholder"
                        placeholder="Placeholder"
                        value={inputPlaceholder}
                        onChange={inputPlaceholderChangeHandler}
                      />
                    </Col>
                  </FormGroup>

                  <FormGroup className="row">
                    <Label sm={4} for="tooltip" className="boldLabel">
                      Tooltip
                    </Label>
                    <Col sm={8}>
                      <Input
                        type="text"
                        className="form-control"
                        name="inptTooltip"
                        id="inptTooltip"
                        placeholder="Tooltip"
                        value={inputTooltips}
                        onChange={inputTooltipsChangeHandler}
                      />
                    </Col>
                  </FormGroup>
                </div>
              </div>

              <FormGroup className="row">
                <Label sm={2} for="values" className="boldLabel">
                  Values
                  {/* (*,[Comma] Separated if Multiple) */}
                  {/* <br/> (*next line for Multi Selected CheckBox) */}
                </Label>
                <Col sm={10}>
                  <Input
                    type="textarea"
                    className="form-control"
                    name="inptValues"
                    id="inptValues"
                    onChange={inputValuesChangeHandler}
                    value={inputValues}
                    rows={2}
                  />
                </Col>
              </FormGroup>

              <FormGroup className=" row">
                <Label sm={2} for="placeholder" className="boldLabel">
                  Other Conditions
                </Label>
                <Col sm={10}>
                  <Input
                    type="text"
                    className="form-control"
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
                      <FormGroup className="row">
                        <Label sm={2} for="maxLength" className="boldLabel">
                          Max Length
                          {/* (Length: incase of text data, Limit: incase of */}
                          {/* Numric/Number OR Range Data, Width Incase of Image) */}
                        </Label>
                        <Col sm={10}>
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
                      <FormGroup className="row">
                        <Label sm={2} for="minLength" className="boldLabel">
                          Min Length
                          {/* (Length: incase of text data, Limit: incase of */}
                          {/* Numric/Number OR Range Data, height Incase of Image) */}
                        </Label>
                        <Col sm={10}>
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

              <div
                className="d-flex"
                // style={{width:"100%"}}
              >
                <FormGroup className="row col-4 padding-zero">
                  <Label sm={4} className="boldLabel">
                    Required
                  </Label>
                  <Col sm={8}>
                    <Input
                      type="select"
                      className="form-control"
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

                <FormGroup className="row  col-4">
                  <Label sm={4} className="boldLabel">
                    Hidden
                  </Label>

                  <Col sm={8}>
                    <Input
                      type="select"
                      className="form-control"
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

                <FormGroup className="row  col-4">
                  <Label sm={4} className="boldLabel">
                    Global
                  </Label>

                  <Col sm={8}>
                    <Input
                      type="select"
                      className="form-control"
                      name="inputIsGlobal"
                      id="inputIsGlobal"
                      onChange={inputIsGlobalChangeHandler}
                      value={inputIsGlobal}
                      required
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </Input>
                  </Col>
                </FormGroup>
              </div>

              <FormGroup className="row">
                <Label sm={2} className="boldLabel">
                  Style(s)
                </Label>
                <Col
                  className="d-flex"
                  style={{ alignItems: "center" }}
                  sm={10}
                >
                  <Input
                    name="inputValueStyle"
                    id="inputValueBoxed"
                    type="checkbox"
                    onChange={inputIsBoxedStyled}
                    value={"boxed"}
                    className="zero-top"
                  />
                  <span className="mr-4">Boxed Character(s)</span>

                  <Input
                    name="inputValueStyle"
                    id="inputValueAllCaps"
                    type="checkbox"
                    onChange={inputIsBoxedStyled}
                    value={"allcaps"}
                    className="zero-top"
                  />
                  <span className="mr-4">All Caps</span>

                  <Input
                    name="inputValueStyle"
                    id="inputValueHideInput"
                    type="checkbox"
                    onChange={inputIsBoxedStyled}
                    value={"hideinput"}
                    className="zero-top"
                  />
                  <span className="mr-4">Hide Input</span>

                  <Input
                    name="inputValueStyle"
                    id="inputValueCommaSepNum1"
                    type="checkbox"
                    onChange={inputIsBoxedStyled}
                    value={"commasepnum1"}
                    className="zero-top"
                  />
                  <span className="mr-4">
                    {" "}
                    Comma(,) Separated (for Number only)
                  </span>
                </Col>
              </FormGroup>

              <div className="text-center">
                <Button type="submit" className="btn btn-primary mt-2 btn-sm">
                  Submit
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </Modal>
      <div style={{ display: "flex" }} className="">
        {/* <span className="col-7"><b>Fields</b></span> */}

        <input
          style={{ display: "none" }}
          ref={hiddenFileInput}
          data-tip="Upload Fields"
          title="Upload Fields"
          type="file"
          name="inputFieldUpload"
          id="inputFieldUpload"
          onChange={inputFieldUploadChangeHandler}
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        />

        {/* <button
          className="fa fa-upload btn btn-info btn-md"
          data-tip="Upload Fields"
          title="Upload Fields"
          onClick={handleUploadFieldsButtonClick}
        /> */}
        {/* <i className="fa fa-upload" aria-hidden="true"></i>
        </button> */}

        {/* <span className="col-1"></span> */}

        {/* <button
          className="fa fa-download btn btn-info btn-md"
          data-tip="Download Fields"
          title="Download Fields"
          onClick={handleDownloadFieldsButtonClick}
        /> */}
        {/* </button> */}

        {/* <span className="col-1"></span> */}
        <button
          // className="fa fa-plus btn btn-info btn-md"
          className="btn btn-info btn-sm bg-primary"
          // data-tip="Add New Field"
          title="Add New Field"
          onClick={() => setModalIsOpen(true)}
        >
          <p>Add New Field</p>
        </button>
        {/* <i className="fa fa-plus" aria-hidden="true"></i>
        </button> */}
      </div>
    </>
  );
};

export default AddFormFields;
