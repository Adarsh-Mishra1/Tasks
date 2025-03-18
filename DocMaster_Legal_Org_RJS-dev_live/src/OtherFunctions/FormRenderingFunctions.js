//FormRenderingFunctions.js
import React from "react";
import { FormGroup, Label, Input } from "reactstrap";
import _ from "lodash";
import Tooltip from "rc-tooltip";
import {
  ordinal_suffix_of,
  month2MonthString,
  getMonthFromString,
  hrTimeTo24HourFormat,
  dateFormValueToDateValueFormat,
} from "../OtherFunctions/OtherFunctions";
//import ReactDOM from "react-dom";
// import ShowTooltipCard from "../GuiComponents/ShowTooltipCard";
import CustomMultiCheckBox from "../components/CustomMultiCheckBox";
import "rc-tooltip/assets/bootstrap.css";

export function sortFormFields(formFields) {
  // console.log("formFields", formFields);
  let formsFieldsDataSortedTemp = [];
  if (formFields != null && formFields != undefined) {
    Object.keys(formFields).forEach(function (key) {
      //console.log("-key-", key);
      //console.log("testFields_key", formFields[key]);
      formsFieldsDataSortedTemp.push(formFields[key]);
    });
  }

  formsFieldsDataSortedTemp.sort(function (a, b) {
    /*
    console.log(
      "-a.sequence - b.sequence 1 ",
      a.sequence + "-" + b.sequence + " = " + (a.sequence - b.sequence)
    );
    */
    if (a.sequence == undefined) {
      a.sequence = 0;
    }
    if (b.sequence == undefined) {
      b.sequence = 0;
    }
    /*
    console.log(
      "-a.sequence - b.sequence 1 ",
      a.sequence + "-" + b.sequence + " = " + (a.sequence - b.sequence)
    );*/

    return a.sequence - b.sequence;
  });
  return formsFieldsDataSortedTemp;
}

/*
export function RenderConditionalInputAsPerTypeV2(
  isTestRun,
  level,
  inputFieldData,
  key,
  isReadOnly,
  onChangeFunc,
  addConditionFunc
) {
  console.log("recursivInputFieldRendring_RenderConditionalInputAsPerTypeV2");
  console.log("recursivInputFieldRendring_inputFieldData", inputFieldData);
  //console.log(
  //"RenderConditionalInputAsPerType_inputFieldData",
  //inputFieldData.input.condition.subFormFields
  //);
  //console.log(
  //"RenderConditionalInputAsPerType_inputFieldData",
  //inputFieldData.input.elementType
  //);
  var rows = [];
  if (
    inputFieldData.elementType.toLowerCase() == "select" ||
    inputFieldData.elementType.toLowerCase() == "radio" ||
    inputFieldData.elementType.toLowerCase() == "datalist"
  ) {
    if (
      inputFieldData.condition.conditionStatements[inputFieldData.inputValue] !=
      undefined
    ) {
      rows.push(
        <>
          {renderInputType(
            isTestRun,
            level,
            inputFieldData.condition.conditionStatements[
              inputFieldData.inputValue
            ].subFormFields.formFields,
            onChangeFunc,
            "" + inputFieldData.elementUId + 0
          )}
        </>
      );
    } else {
      console.log(
        "recursivInputFieldRendring_inputFieldData",
        "Undefince COnddsd"
      );
    }
  } else {
    let populateCount = 1;
    if (isNaN(inputFieldData.inputValue)) {
      //console.log("inputFieldData", " inputFieldData is Not Numeric");
    } else {
      //console.log("inputFieldData", " inputFieldData is Numeric");
      //inputFieldData.input.elementConfig.type
      //Populate Only if data is Number
      if (
        (inputFieldData.elementType.toLowerCase() == "input"
        || inputFieldData.elementType == "copyOfInput"
        ) &&
        (inputFieldData.elementConfig.type.toLowerCase() == "number" ||
          inputFieldData.elementConfig.type.toLowerCase() == "daystring" ||
          inputFieldData.elementConfig.type.toLowerCase() == "monthstring")
      ) {
        populateCount = parseInt(inputFieldData.inputValue);
      }
    }

    //console.log("populateCount", populateCount);
    for (var i = 0; i < populateCount; i++) {
      rows.push(
        <>
          {i}
          {renderInputType(
            isTestRun,
            level,
            inputFieldData.condition.subFormFields.formFields,
            onChangeFunc,
            "" + inputFieldData.elementUId + i
          )}
        </>
      );
    }
  }

  return <>{rows}</>;
}
*/
/*
export function RenderConditionalInputAsPerType(
  isTestRun,
  level,
  inputFieldData,
  key,
  isReadOnly,
  onChangeFunc,
  addConditionFunc
) {
  console.log(
    "recursivInputFieldRendring_RenderConditionalInputAsPerType",
    inputFieldData
  );
  //console.log("RenderConditionalInputAsPerType");
  //console.log("RenderConditionalInputAsPerType_inputFieldData", inputFieldData);
  //console.log(
  //"RenderConditionalInputAsPerType_inputFieldData",
  //inputFieldData.input.condition.subFormFields
  //);
  //console.log(
  //"RenderConditionalInputAsPerType_inputFieldData",
  //inputFieldData.input.elementType
  //);
  var rows = [];
  if (
    inputFieldData.input.elementType.toLowerCase() == "select" ||
    inputFieldData.input.elementType.toLowerCase() == "radio" ||
    inputFieldData.input.elementType.toLowerCase() == "datalist"
  ) {
    if (
      inputFieldData.input.condition.conditionStatements[
        inputFieldData.inputValue
      ] != undefined
    ) {
      //"" + inputFieldData.input.elementUId + 0 Old
      rows.push(
        <>
          {renderInputType(
            isTestRun,
            level,
            inputFieldData.input.condition.conditionStatements[
              inputFieldData.inputValue
            ].subFormFields.formFields,
            onChangeFunc,
            "" + inputFieldData.templateKey + 0
          )}
        </>
      );

      console.log("recursivInputFieldRendring_inputFieldData", "Dwefined****");
    } else {
      console.log(
        "recursivInputFieldRendring_inputFieldData",
        "Undefince COnddsd"
      );
    }
  } else {
    let populateCount = 1;
    if (isNaN(inputFieldData.inputValue)) {
      //console.log("inputFieldData", " inputFieldData is Not Numeric");
    } else {
      //console.log("inputFieldData", " inputFieldData is Numeric");
      //inputFieldData.input.elementConfig.type
      //Populate Only if data is Number
      if (
        (inputFieldData.input.elementType.toLowerCase() == "input" || inputFieldData.input.elementType == "copyOfInput") &&
        (inputFieldData.input.elementConfig.type.toLowerCase() == "number" ||
          inputFieldData.input.elementConfig.type.toLowerCase() ==
            "daystring" ||
          inputFieldData.input.elementConfig.type.toLowerCase() ==
            "monthstring")
      ) {
        populateCount = parseInt(inputFieldData.inputValue);
      }
    }

    //console.log("populateCount", populateCount);
    for (var i = 0; i < populateCount; i++) {
      rows.push(
        <>
          {i}
          {renderInputType(
            isTestRun,
            level,
            inputFieldData.input.condition.subFormFields.formFields,
            onChangeFunc,
            "" + inputFieldData.templateKey + i
          )}
        </>
      );
    }
  }

  return <>{rows}</>;
}
*/

/*
function renderInputType(isTestRun, level, formFields, onChangeFunc, keyAddOn) {
  //console.log("renderInputType");
  //console.log("formFields", formFields);
  //console.log("keyAddOn", keyAddOn);

  let formsFieldsDataSorted = sortFormFields(formFields);
  //console.log("formsFieldsDataSorted", formsFieldsDataSorted);
  return (
    <>
      {formsFieldsDataSorted.map((tempField) =>
        RenderInputAsPerType(
          isTestRun,
          level,
          tempField,
          tempField.elementUId,
          false,
          onChangeFunc,
          null,
          null,
          null,
          null,
          keyAddOn,
          true
        )
      )}
    </>
  );
}
*/

export function RenderInputAsPerType(
  isTestRun,
  level,
  inputFieldData,
  key,
  isReadOnly,
  onChangeFunc,
  editThisFieldFunc,
  addConditionFunc,
  removeConditionFunc,
  deleteThisFieldFunc,
  addition2key,
  showLabel,
  formData
) {
  // console.log("RenderInputAsPerType_key", key);
  // console.log("RenderInputAsPerType_addition2key", addition2key);
  // console.log("RenderInputAsPerType_showLabel", showLabel);
  console.log("RenderInputAsPerType_formData", formData);
  function onAddConditionFunctionClick(inputFieldData, key) {
    addConditionFunc(inputFieldData, key);
  }

  function onRemoveConditionFunctionClick(inputFieldData, key) {
    removeConditionFunc(inputFieldData, key);
  }

  function onEditThisFieldFunctionClick(inputFieldData, key) {
    editThisFieldFunc(inputFieldData, key);
  }

  function onDeleteThisFieldFunctionClick(inputFieldData, key) {
    deleteThisFieldFunc(inputFieldData, key);
  }

  function increaseNumberInInputField(fieldId, max) {
    //Not Working With Test Run Pop Up Model
    //console.log("increaseNumberInInputField_fieldId_ref",fieldId.value)
    //console.log("increaseNumberInInputField_fieldId",fieldId)
    var element = document.getElementById(fieldId);
    var fieldValue = Number(element.value);
    let lastValue = Number(element.value);
    //console.log("increaseNumberInInputField_fieldValue",fieldValue)
    if (fieldValue < max) {
      element.value = Number(fieldValue) + 1;
      var event = new Event("input", { target: element, bubbles: true });
      // React 15
      event.simulated = true;
      // React 16
      let tracker = element._valueTracker;
      if (tracker) {
        tracker.setValue(lastValue);
      }
      try {
        element.dispatchEvent(event);
      } catch (e) {
        console.log("increaseNumberInInputField_error", e);
      }
    }
  }

  function decreaseNumberInInputField(fieldId, min) {
    //console.log("decreaseNumberInInputField_fieldId",fieldId)
    var element = document.getElementById(fieldId);
    var fieldValue = Number(element.value);
    let lastValue = Number(element.value);
    //console.log("decreaseNumberInInputField_fieldValue",fieldValue)
    if (fieldValue > min) {
      element.value = Number(fieldValue) - 1;
      var event = new Event("input", { target: element, bubbles: true });
      // React 15
      event.simulated = true;
      // React 16
      let tracker = element._valueTracker;
      if (tracker) {
        tracker.setValue(lastValue);
      }
      try {
        element.dispatchEvent(event);
      } catch (e) {
        console.log("increaseNumberInInputField_error", e);
      }
    }
  }

  let deleteInputBlock = "";
  if (deleteThisFieldFunc != null) {
    deleteInputBlock = (
      <Tooltip placement="top" overlay="Delete This Field">
        <a
          className=""
          title="Delete This Field"
          style={{ cursor: "pointer" }}
          onClick={() => onDeleteThisFieldFunctionClick(inputFieldData, key)}
        >
          &nbsp;<i className="fa fa-trash" aria-hidden="true"></i>
        </a>
      </Tooltip>
    );
  }

  let editInputBlock = "";
  if (editThisFieldFunc != null) {
    editInputBlock = (
      <Tooltip placement="top" overlay="Edit This Field">
        <a
          className=""
          title="Edit This Field"
          style={{ cursor: "pointer" }}
          onClick={() => onEditThisFieldFunctionClick(inputFieldData, key)}
        >
          &nbsp;<i className="fa fa-edit" aria-hidden="true"></i>
        </a>
      </Tooltip>
    );
  }

  let addConditionBlock = "";
  if (addConditionFunc != null) {
    addConditionBlock = (
      <Tooltip placement="top" overlay="Add Condition">
        <a
          className=""
          title="Add Condition"
          style={{ cursor: "pointer" }}
          onClick={() => onAddConditionFunctionClick(inputFieldData, key)}
        >
          &nbsp;<i className="fa fa-plus-square" aria-hidden="true"></i>
        </a>
      </Tooltip>
    );
  }

  let removeConditionBlock = "";
  if (inputFieldData.isConditional === true && removeConditionFunc != null) {
    removeConditionBlock = (
      <Tooltip placement="top" overlay="Remove Condition">
        <a
          className=""
          title="Remove Condition"
          style={{ cursor: "pointer" }}
          onClick={() => onRemoveConditionFunctionClick(inputFieldData, key)}
        >
          &nbsp;
          <i
            className="fa fa-minus-square"
            style={{ color: "red" }}
            aria-hidden="true"
          ></i>
        </a>
      </Tooltip>
    );
  }

  // let showKeyOrLabel = <>Key: {inputFieldData.elementUId}</>;
  let showKeyOrLabel = (
    <div className="form-label" style={{}}>
      {" "}
      {inputFieldData.elementUId}
    </div>
  );

  let showToolTip = <></>;
  if (isTestRun == true) {
    showKeyOrLabel = <>{inputFieldData.elementConfig.inputLabel} </>;
    if (
      inputFieldData.elementConfig.tooltips != undefined &&
      inputFieldData.elementConfig.tooltips.length > 0
    ) {
      showToolTip = (
        <Tooltip
          placement="top"
          overlay={inputFieldData.elementConfig.tooltips}
        >
          <i className="fa fa-info-circle"></i>
        </Tooltip>
        // <div className="tooltip_container">
        //   {/* <i className="fa fa-question-circle"><span style={{color:"white"}}>---------------------------</span></i> */}
        //   <div className="tooltip_card_container">
        //     <ShowTooltipCard
        //       description={inputFieldData.elementConfig.tooltips}
        //     />
        //   </div>
        // </div>
      );
    }
  }

  //To Hide Label of input
  if (!showLabel) {
    showKeyOrLabel = <></>;
  }

  //let inputFieldsActionOption=deleteInputBlock+addConditionBlock+removeConditionBlock;
  let inFieldUniqueIdAndName = inputFieldData.elementUId + addition2key;
  //console.log("------",inputFieldData)
  if (inputFieldData.isGlobal == true) {
    inFieldUniqueIdAndName = inputFieldData.elementUId; // + addition2key;
    //console.log("------", "isGlobal");
  }

  // console.log("---------------------------------------------");
  // console.log("inputFieldData", inputFieldData);
  // console.log("inFieldUniqueIdAndName", inFieldUniqueIdAndName);
  // console.log("---------------------------------------------");
  //showKeyOrLabel = <>RenderInputAsPerType: {inFieldUniqueIdAndName}</>; //testing

  if (inputFieldData.elementType.toLowerCase() == "label") {
    return (
      <div className="" key={inFieldUniqueIdAndName}>
        <div className="">
          {deleteInputBlock} {editInputBlock}
        </div>
        {/* <Label className=""> */}
        <label className="form-label">
          {showKeyOrLabel} {showToolTip}
        </label>
        {/* <div className="">
            <p>{inputFieldData.value} </p>
          </div> */}
        {/* </Label> */}
      </div>
    );
  } else if (inputFieldData.elementType == "copyOfInput") {
    console.log("copyOfInput_input_", inputFieldData);
    return (
      <div
        className="inputFldContainer"
        key={inFieldUniqueIdAndName}
        style={{ display: "none" }}
      >
        <div className="">
          {deleteInputBlock} {editInputBlock}
          {addConditionBlock} {removeConditionBlock}
        </div>
        <label className="form-label">
          {showKeyOrLabel} {showToolTip}
        </label>
        <div className="">
          <input
            className="form-control"
            style={{ display: "none" }}
            type="text"
            disabled
            name={inFieldUniqueIdAndName}
            id={inFieldUniqueIdAndName}
            placeholder={inputFieldData.elementConfig.placeholder}
            max={inputFieldData.validation.maxLength}
            min={inputFieldData.validation.minLength}
            readOnly={isReadOnly}
            defaultValue={formData[inFieldUniqueIdAndName]}
            required={inputFieldData.inputIsRequired}
            onChange={(e) =>
              onChangeFunc(
                e,
                inputFieldData,
                key,
                inFieldUniqueIdAndName,
                level
              )
            }
          />
        </div>
      </div>
    );
  } else if (
    inputFieldData.elementType.toLowerCase() == "formula" ||
    inputFieldData.elementType.toLowerCase() == "amount2words" ||
    inputFieldData.elementType.toLowerCase() == "strngformula" ||
    inputFieldData.elementType.toLowerCase() == "legalformula" ||
    inputFieldData.elementType.toLowerCase() == "trigger"
  ) {
    //DevNote: Not To show this to General User
    return <></>;
    // return (
    //   <FormGroup className="inputFldContainer" key={inFieldUniqueIdAndName}>
    //     <div className="">
    //       {deleteInputBlock} {editInputBlock}
    //     </div>
    //     <Label className="">
    //       <div className="formRenderingLabelContainer">
    //         {showKeyOrLabel} {showToolTip}
    //       </div>
    //     </Label>
    //   </FormGroup>
    // );
  } else if (inputFieldData.elementType.toLowerCase() == "input") {
    //const numInputRef = useRef(null)
    //ToDo: process it as per value type, i.e. String or Number
    //use -> inputFieldData.elementConfig.type
    //image

    // if (inputFieldData.elementConfig.type.toLowerCase() == "image") {
    //   return (
    //     <FormGroup className="inputFldContainer" key={inFieldUniqueIdAndName}>
    //       <div className="row">
    //         {deleteInputBlock} {editInputBlock} {addConditionBlock}{" "}
    //         {removeConditionBlock}
    //       </div>

    //       <div className="form-label">
    //         {showKeyOrLabel}
    //         {showToolTip}
    //       </div>
    //       <Input
    //         className="form-control"
    //         type="file"
    //         accept="image/*"
    //         name={inFieldUniqueIdAndName}
    //         id={inFieldUniqueIdAndName}
    //         placeholder={inputFieldData.elementConfig.placeholder}
    //         required={inputFieldData.inputIsRequired}
    //         readOnly={isReadOnly}
    //         onChange={(e) => {
    //           onChangeFunc(
    //             e,
    //             inputFieldData,
    //             key,
    //             inFieldUniqueIdAndName,
    //             level
    //           );
    //         }}
    //       />
    //     </FormGroup>
    //   );
    // }

    if (
      ["image", "file"].includes(
        inputFieldData.elementConfig.type.toLowerCase()
      )
    ) {
      return (
        <FormGroup className="inputFldContainer" key={inFieldUniqueIdAndName}>
          <div className="row">
            {deleteInputBlock} {editInputBlock} {addConditionBlock}{" "}
            {removeConditionBlock}
          </div>

          <div className="form-label">
            {showKeyOrLabel}
            {showToolTip}
          </div>
          <Input
            className="form-control"
            type="file"
            accept={
              inputFieldData.elementConfig.type === "image" ? "image/*" : "*/*"
            }
            name={inFieldUniqueIdAndName}
            id={inFieldUniqueIdAndName}
            placeholder={inputFieldData.elementConfig.placeholder}
            required={inputFieldData.inputIsRequired}
            // required={
            //   !formData[inFieldUniqueIdAndName] &&
            //   inputFieldData.inputIsRequired
            // }
            readOnly={isReadOnly}
            onChange={(e) => {
              onChangeFunc(
                e,
                inputFieldData,
                key,
                inFieldUniqueIdAndName,
                level
              );
            }}
          />
        </FormGroup>
      );
    } else if (inputFieldData.elementConfig.type.toLowerCase() == "number") {
      return (
        <div className="inputFldContainer" key={inFieldUniqueIdAndName}>
          <div className="">
            {deleteInputBlock} {editInputBlock} {addConditionBlock}{" "}
            {removeConditionBlock}
          </div>
          <label className="form-label">
            {showKeyOrLabel} {showToolTip}
          </label>
          <div className="d-flex" style={{ alignItems: "center" }}>
            {(() => {
              if (
                inputFieldData.valueStyle != undefined &&
                inputFieldData.valueStyle.some((item) => item === "hideinput")
              ) {
                return (
                  <>
                    <input
                      className="form-control"
                      style={{ display: "none" }}
                      type={inputFieldData.elementConfig.type}
                      name={inFieldUniqueIdAndName}
                      id={inFieldUniqueIdAndName}
                      placeholder={inputFieldData.elementConfig.placeholder}
                      max={inputFieldData.validation.maxLength}
                      min={inputFieldData.validation.minLength}
                      defaultValue={formData[inFieldUniqueIdAndName]}
                      required={inputFieldData.inputIsRequired}
                      readOnly={isReadOnly}
                      onChange={(e) => {
                        if (
                          parseInt(e.target.value) >=
                            inputFieldData.validation.minLength &&
                          parseInt(e.target.value) <=
                            inputFieldData.validation.maxLength
                        ) {
                          onChangeFunc(
                            e,
                            inputFieldData,
                            key,
                            inFieldUniqueIdAndName,
                            level
                          );
                        } else {
                          console.log("NUmField", "InValidValue");
                          //e.target.value=""
                        }
                      }}
                    />
                    {/* </div> */}
                    <div className="inputMoreLessButtonDiv">
                      {/* &nbsp; */}
                      <span
                        className="inputMoreLessButton"
                        onClick={() =>
                          increaseNumberInInputField(
                            inFieldUniqueIdAndName,
                            inputFieldData.validation.maxLength
                          )
                        }
                      >
                        More
                      </span>
                      &nbsp;|&nbsp;
                      <span
                        className="inputMoreLessButton"
                        onClick={() =>
                          decreaseNumberInInputField(
                            inFieldUniqueIdAndName,
                            inputFieldData.validation.minLength
                          )
                        }
                      >
                        less
                      </span>
                      &nbsp;
                    </div>
                  </>
                );
              } else {
                return (
                  <>
                    <input
                      className="form-control"
                      type={inputFieldData.elementConfig.type}
                      name={inFieldUniqueIdAndName}
                      id={inFieldUniqueIdAndName}
                      placeholder={inputFieldData.elementConfig.placeholder}
                      max={inputFieldData.validation.maxLength}
                      min={inputFieldData.validation.minLength}
                      // value={formData[inFieldUniqueIdAndName]}
                      defaultValue={formData[inFieldUniqueIdAndName]}
                      required={inputFieldData.inputIsRequired}
                      readOnly={isReadOnly}
                      onChange={(e) => {
                        // if (
                        //   parseInt(e.target.value) >=
                        //     inputFieldData.validation.minLength &&
                        //   parseInt(e.target.value) <=
                        //     inputFieldData.validation.maxLength
                        // ) {
                        onChangeFunc(
                          e,
                          inputFieldData,
                          key,
                          inFieldUniqueIdAndName,
                          level
                        );
                        // } else {
                        //   console.log("NUmField", "InValidValue");
                        //   //e.target.value=""
                        // }
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-dark mx-1"
                      onClick={() =>
                        increaseNumberInInputField(
                          inFieldUniqueIdAndName,
                          inputFieldData.validation.maxLength
                        )
                      }
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-dark"
                      style={{ border: "1px solid black" }}
                      onClick={() =>
                        decreaseNumberInInputField(
                          inFieldUniqueIdAndName,
                          inputFieldData.validation.minLength
                        )
                      }
                    >
                      -
                    </button>
                  </>
                );
              }
            })()}
          </div>
        </div>
      );
    } else if (inputFieldData.elementConfig.type.toLowerCase() == "daystring") {
      return (
        <div className="inputFldContainer" key={inFieldUniqueIdAndName}>
          <div className="">
            {deleteInputBlock} {editInputBlock} {addConditionBlock}{" "}
            {removeConditionBlock}
          </div>

          <label className="form-label">
            {showKeyOrLabel}
            {showToolTip}
          </label>
          <div className="d-flex" style={{ alignItems: "center" }}>
            <input
              className="form-control"
              type="number"
              name={inFieldUniqueIdAndName}
              id={inFieldUniqueIdAndName}
              placeholder={inputFieldData.elementConfig.placeholder}
              defaultValue={formData[inFieldUniqueIdAndName]?.replace(
                /(\d+)(st|nd|rd|th)/,
                "$1"
              )}
              required={inputFieldData.inputIsRequired}
              max="31"
              min="1"
              readOnly={isReadOnly}
              onChange={(e) => {
                /*
                      onChangeFunc(
                        e,
                        inputFieldData,
                        key,
                        inFieldUniqueIdAndName,
                        level
                      )*/
                if (
                  parseInt(e.target.value) >= 1 &&
                  parseInt(e.target.value) <= 31
                ) {
                  //console.log("NUmField","ValidValue")
                  onChangeFunc(
                    e,
                    inputFieldData,
                    key,
                    inFieldUniqueIdAndName,
                    level
                  );
                } else {
                  console.log("NUmField", "InValidValue");
                  //e.target.value=""
                }
              }}
            />
            <button
              type="button"
              className="btn btn-sm btn-outline-dark mx-1"
              onClick={() =>
                increaseNumberInInputField(inFieldUniqueIdAndName, 31)
              }
            >
              +
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-dark"
              onClick={() =>
                decreaseNumberInInputField(inFieldUniqueIdAndName, 1)
              }
            >
              -
            </button>
          </div>
        </div>
      );
    } else if (inputFieldData.elementConfig.type == "monthstring") {
      return (
        <div className="inputFldContainer">
          <div className="">
            {deleteInputBlock} {editInputBlock} {addConditionBlock}{" "}
            {removeConditionBlock}
          </div>

          <label className="form-label">
            {showKeyOrLabel}
            {showToolTip}
          </label>
          <div className="d-flex">
            <input
              className="form-control"
              type="number"
              name={inFieldUniqueIdAndName}
              id={inFieldUniqueIdAndName}
              placeholder={inputFieldData.elementConfig.placeholder}
              max="12"
              min="1"
              defaultValue={getMonthFromString(
                formData[inFieldUniqueIdAndName]
              )}
              required={inputFieldData.inputIsRequired}
              readOnly={isReadOnly}
              onChange={(e) => {
                // onChangeFunc(
                //   e,
                //   inputFieldData,
                //   key,
                //   inFieldUniqueIdAndName,
                //   level
                // )
                if (
                  parseInt(e.target.value) >= 1 &&
                  parseInt(e.target.value) <= 12
                ) {
                  //console.log("NUmField","ValidValue")
                  onChangeFunc(
                    e,
                    inputFieldData,
                    key,
                    inFieldUniqueIdAndName,
                    level
                  );
                } else {
                  console.log("NumField", "InValidValue");
                  //e.target.value=""
                }
              }}
            />
            <button
              type="button"
              className="btn btn-sm btn-outline-dark mx-1"
              onClick={() =>
                increaseNumberInInputField(inFieldUniqueIdAndName, 12)
              }
            >
              +
            </button>
            <button
              type="button"
              // className="inputMoreLessButton"
              className="btn btn-sm btn-outline-dark"
              onClick={() =>
                decreaseNumberInInputField(inFieldUniqueIdAndName, 1)
              }
            >
              -
            </button>
          </div>
        </div>
      );
    } else {
      //   console.log("datetype2_fromOtherInput",inputFieldData.elementConfig.type)

      //   console.log("datetype2_formData",formData)
      // console.log("datetype2_inFieldUniqueIdAndName",inFieldUniqueIdAndName)
      // console.log("datetype2_DEFAULTVALUE",formData[inFieldUniqueIdAndName])

      let defaultValue2set = formData[inFieldUniqueIdAndName];
      if (
        inputFieldData.elementConfig.type.toLowerCase() == "date" &&
        defaultValue2set != undefined &&
        defaultValue2set.length > 0
      ) {
        defaultValue2set = dateFormValueToDateValueFormat(
          inputFieldData.value,
          formData[inFieldUniqueIdAndName]
        );
      }

      return (
        <div className="inputFldContainer" key={inFieldUniqueIdAndName}>
          <div className="">
            {deleteInputBlock} {editInputBlock} {addConditionBlock}{" "}
            {removeConditionBlock}
          </div>

          <label className="form-label">
            {showKeyOrLabel}
            {showToolTip}
          </label>
          <input
            className="form-control"
            type={inputFieldData.elementConfig.type}
            name={inFieldUniqueIdAndName}
            id={inFieldUniqueIdAndName}
            placeholder={inputFieldData.elementConfig.placeholder}
            maxLength={inputFieldData.validation.maxLength}
            minLength={inputFieldData.validation.minLength}
            // defaultValue={formData[inFieldUniqueIdAndName]}
            defaultValue={defaultValue2set}
            // value={defaultValue2set}
            required={inputFieldData.inputIsRequired}
            readOnly={isReadOnly}
            onChange={(e) =>
              onChangeFunc(
                e,
                inputFieldData,
                key,
                inFieldUniqueIdAndName,
                level
              )
            }
          />
        </div>
      );
    }
  } else if (inputFieldData.elementType.toLowerCase() == "range") {
    return (
      <div className="inputFldContainer">
        <div className="">
          {deleteInputBlock} {editInputBlock} {addConditionBlock}{" "}
          {removeConditionBlock}
        </div>
        <div className="form-label">
          {showKeyOrLabel}
          {showToolTip}
        </div>
        <Input
          className="form-control"
          type="range"
          name={inFieldUniqueIdAndName}
          id={inFieldUniqueIdAndName}
          placeholder={inputFieldData.elementConfig.placeholder}
          max={inputFieldData.validation.maxLength}
          min={inputFieldData.validation.minLength}
          defaultValue={formData[inFieldUniqueIdAndName]}
          required={inputFieldData.inputIsRequired}
          readOnly={isReadOnly}
          onChange={(e) =>
            onChangeFunc(e, inputFieldData, key, inFieldUniqueIdAndName, level)
          }
        />
      </div>
    );
  } else if (inputFieldData.elementType.toLowerCase() == "textarea") {
    return (
      <FormGroup className="inputFldContainer" key={inFieldUniqueIdAndName}>
        <div className="">
          {deleteInputBlock} {editInputBlock} {addConditionBlock}{" "}
          {removeConditionBlock}
        </div>

        {/* <Label className="form-label"> */}
        {/* <div className="d-flex"> */}
        <div className="form-label">
          {showKeyOrLabel}
          {showToolTip}
        </div>
        {/* <div className=""> */}
        {/* {console.log("textares_formData",inFieldUniqueIdAndName,formData)} */}
        <Input
          className="form-control"
          type="textarea"
          name={inFieldUniqueIdAndName}
          id={inFieldUniqueIdAndName}
          placeholder={inputFieldData.elementConfig.placeholder}
          maxLength={inputFieldData.validation.maxLength}
          minLength={inputFieldData.validation.minLength}
          defaultValue={formData[inFieldUniqueIdAndName]}
          required={inputFieldData.inputIsRequired}
          readOnly={isReadOnly}
          onChange={(e) =>
            onChangeFunc(e, inputFieldData, key, inFieldUniqueIdAndName, level)
          }
        />
      </FormGroup>
    );
  } else if (inputFieldData.elementType.toLowerCase() == "password") {
    return (
      <FormGroup className="inputFldContainer" key={inFieldUniqueIdAndName}>
        <div className="">
          {deleteInputBlock} {editInputBlock} {addConditionBlock}{" "}
          {removeConditionBlock}
        </div>
        <div className="form-label">
          {showKeyOrLabel}
          {showToolTip}
        </div>
        <Input
          className="form-control"
          type="Password"
          name={inFieldUniqueIdAndName}
          id={inFieldUniqueIdAndName}
          placeholder={inputFieldData.elementConfig.placeholder}
          maxLength={inputFieldData.validation.maxLength}
          minLength={inputFieldData.validation.minLength}
          defaultValue={formData[inFieldUniqueIdAndName]}
          required={inputFieldData.inputIsRequired}
          readOnly={isReadOnly}
          onChange={(e) =>
            onChangeFunc(e, inputFieldData, key, inFieldUniqueIdAndName, level)
          }
        />
      </FormGroup>
    );
  } else if (inputFieldData.elementType.toLowerCase() == "date") {
    // console.log("datetype1_formData",formData)
    // console.log("datetype1_formData",inputFieldData)
    // console.log("datetype1_inFieldUniqueIdAndName",inFieldUniqueIdAndName)
    // console.log("datetype1_DEFAULTVALUE",formData[inFieldUniqueIdAndName])
    // console.log("datetype1_dateFormValueToDateValueFormat",dateFormValueToDateValueFormat(inputFieldData.value,formData[inFieldUniqueIdAndName]))

    let defaultValue2set = formData[inFieldUniqueIdAndName];
    if (defaultValue2set != undefined && defaultValue2set.length > 0) {
      defaultValue2set = dateFormValueToDateValueFormat(
        inputFieldData.value,
        formData[inFieldUniqueIdAndName]
      );
    }

    // console.log("datetype1_defaultValue2set",defaultValue2set)

    return (
      <FormGroup className="inputFldContainer" key={inFieldUniqueIdAndName}>
        <div className="">
          {deleteInputBlock} {editInputBlock} {addConditionBlock}{" "}
          {removeConditionBlock}
        </div>
        <div className="form-label">
          {showKeyOrLabel}
          {showToolTip}
        </div>
        <Input
          className="form-control"
          type="Date"
          name={inFieldUniqueIdAndName}
          id={inFieldUniqueIdAndName}
          placeholder={inputFieldData.elementConfig.placeholder}
          maxLength={inputFieldData.validation.maxLength}
          minLength={inputFieldData.validation.minLength}
          defaultValue={defaultValue2set}
          required={inputFieldData.inputIsRequired}
          readOnly={isReadOnly}
          onChange={(e) =>
            onChangeFunc(e, inputFieldData, key, inFieldUniqueIdAndName, level)
          }
        />
      </FormGroup>
    );
  } else if (inputFieldData.elementType.toLowerCase() == "checkbox") {
    //CustomMultiCheckBox
    if (
      inputFieldData.elementConfig.type.toLowerCase() == "multiselectt1" ||
      inputFieldData.elementConfig.type.toLowerCase() == "multiselectt2" ||
      inputFieldData.elementConfig.type.toLowerCase() == "multiselectt3" ||
      inputFieldData.elementConfig.type.toLowerCase() == "multiselectt4" ||
      inputFieldData.elementConfig.type.toLowerCase() == "multiselectt5"
    ) {
      var inputValues2 = inputFieldData.value.split("\n");
      //console.log("---------multiselectt1-------------")
      //console.log("multiselectt1_inputValues2",inputValues2)
      console.log("formData_1135: ", formData);
      console.log("formData_1136: ", inFieldUniqueIdAndName);
      return (
        <FormGroup className="inputFldContainer" key={inFieldUniqueIdAndName}>
          <div className="">
            {deleteInputBlock} {editInputBlock} {addConditionBlock}{" "}
            {removeConditionBlock}
          </div>
          {/* <Label className=""> */}
          <div className="form-label">
            {showKeyOrLabel}
            {showToolTip}
          </div>
          <div key={inFieldUniqueIdAndName + "inDiv"}>
            <CustomMultiCheckBox
              className="form-control form-checkbox"
              type={inputFieldData.elementConfig.type.toLowerCase()}
              key={inFieldUniqueIdAndName + "cmcbx"}
              name={inFieldUniqueIdAndName}
              id={inFieldUniqueIdAndName}
              placeholder={inputFieldData.elementConfig.placeholder}
              readOnly={isReadOnly}
              value={inputFieldData.value}
              options={inputValues2}
              maxSelect={inputFieldData.validation.maxLength}
              minSelect={inputFieldData.validation.minLength}
              defaultValue={formData[inFieldUniqueIdAndName]}
              required={inputFieldData.inputIsRequired}
              onOptionSelect={(e) =>
                onChangeFunc(
                  e,
                  inputFieldData,
                  key,
                  inFieldUniqueIdAndName,
                  level
                )
              }
            />
          </div>
          {/* </Label> */}
        </FormGroup>
      );
    } else {
      return (
        <FormGroup className="inputFldContainer" key={inFieldUniqueIdAndName}>
          <div className="">
            {deleteInputBlock} {editInputBlock} {addConditionBlock}{" "}
            {removeConditionBlock}
          </div>
          <label className="form-label" key={inFieldUniqueIdAndName + "inLBL"}>
            <div key={inFieldUniqueIdAndName + "inDiv"}>
              <input
                // className="form-control form-checkbox"
                className="form-check-input"
                type="checkbox"
                name={inFieldUniqueIdAndName}
                id={inFieldUniqueIdAndName}
                placeholder={inputFieldData.elementConfig.placeholder}
                readOnly={isReadOnly}
                value={inputFieldData.value}
                checked={
                  formData[inFieldUniqueIdAndName] === inputFieldData.value
                    ? true
                    : false
                }
                required={inputFieldData.inputIsRequired}
                onChange={(e) =>
                  onChangeFunc(
                    e,
                    inputFieldData,
                    key,
                    inFieldUniqueIdAndName,
                    level
                  )
                }
              />
              {showToolTip}
              {showKeyOrLabel}
            </div>
          </label>
        </FormGroup>
      );
    }
  } else if (inputFieldData.elementType.toLowerCase() == "radio") {
    console.log("RenderInputAsPerType_radio");
    var inputValues = inputFieldData.value.split(",");
    return (
      <FormGroup className="inputFldContainer" key={inFieldUniqueIdAndName}>
        <div className="">
          {deleteInputBlock} {editInputBlock} {addConditionBlock}{" "}
          {removeConditionBlock}
        </div>
        <div className="form-label">
          {showKeyOrLabel}
          {showToolTip}
        </div>
        <div
          className=""
          style={{
            listStyle: "none",
            width: "fit-content",
            fontFamily: "'Merriweather', serif",
            fontSize: "12px",
          }}
        >
          {inputValues.map((inputValue) => (
            <span className="" key={inputValue} style={{ display: "block" }}>
              <Input
                className="form-check-input"
                type="radio"
                name={inFieldUniqueIdAndName}
                id={inFieldUniqueIdAndName}
                placeholder={inputFieldData.elementConfig.placeholder}
                readOnly={isReadOnly}
                value={inputValue}
                checked={
                  formData[inFieldUniqueIdAndName] === inputValue ? true : false
                }
                required={inputFieldData.inputIsRequired}
                onChange={(e) =>
                  onChangeFunc(
                    e,
                    inputFieldData,
                    key,
                    inFieldUniqueIdAndName,
                    level
                  )
                }
              />
              {<span className=" form-check-label">{inputValue}</span>}
            </span>
          ))}
        </div>
      </FormGroup>
    );
  } else if (inputFieldData.elementType.toLowerCase() == "select") {
    console.log("RenderInputAsPerType_select", "fd");
    /*
    for (var i = 0; i < this.props.level; i++) {
      indents.push(<span className='indent' key={i}></span>);
    }
    */
    if (inputFieldData.elementConfig.type == "daystring") {
      //console.log("DropDown", "daystring");
      return (
        <FormGroup className="inputFldContainer" key={inFieldUniqueIdAndName}>
          <div className="">
            {deleteInputBlock} {editInputBlock} {addConditionBlock}{" "}
            {removeConditionBlock}
          </div>
          {/* <Label className=""> */}
          {/* <div className="d-flex"> */}
          <div className="form-label ">
            {showKeyOrLabel}
            {showToolTip}
          </div>
          {/* <div className=""> */}
          <Input
            className="form-control"
            type="select"
            name={inFieldUniqueIdAndName}
            id={inFieldUniqueIdAndName}
            placeholder={inputFieldData.elementConfig.placeholder}
            readOnly={isReadOnly}
            // defaultValue={formData[inFieldUniqueIdAndName]}
            defaultValue={formData[inFieldUniqueIdAndName]?.replace(
              /(\d+)(st|nd|rd|th)/,
              "$1"
            )}
            required={inputFieldData.inputIsRequired}
            onChange={(e) =>
              onChangeFunc(
                e,
                inputFieldData,
                key,
                inFieldUniqueIdAndName,
                level
              )
            }
          >
            <option key="mSelectDayStringKey" value="">
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
        </FormGroup>
      );
    } else if (inputFieldData.elementConfig.type == "monthstring") {
      //console.log("DropDown", "daystring");
      return (
        <FormGroup className="inputFldContainer" key={inFieldUniqueIdAndName}>
          <div className="">
            {deleteInputBlock} {editInputBlock} {addConditionBlock}{" "}
            {removeConditionBlock}
          </div>
          {/* <Label className="row"> */}
          {/* <div className="d-flex"> */}
          <div className="form-label">
            {showKeyOrLabel}
            {showToolTip}
          </div>
          {/* <div className=""> */}
          <Input
            className="form-control"
            type="select"
            name={inFieldUniqueIdAndName}
            id={inFieldUniqueIdAndName}
            placeholder={inputFieldData.elementConfig.placeholder}
            readOnly={isReadOnly}
            defaultValue={getMonthFromString(formData[inFieldUniqueIdAndName])}
            required={inputFieldData.inputIsRequired}
            onChange={(e) =>
              onChangeFunc(
                e,
                inputFieldData,
                key,
                inFieldUniqueIdAndName,
                level
              )
            }
          >
            <option key="mSelectMonthStringKey" value="">
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
          {/* <span>{showToolTip}</span> */}
          {/* </div> */}
          {/* </div> */}
          {/* </Label> */}

          {/* <hr /> */}
        </FormGroup>
      );
    } else {
      // var inputValues = inputFieldData.value.split(",");
      let inputValues;

      if (String(inputFieldData.value).includes("&&")) {
        inputValues = inputFieldData.value.split("&&");
      } else {
        inputValues = inputFieldData.value.split(",");
      }

      return (
        <FormGroup className="inputFldContainer" key={inFieldUniqueIdAndName}>
          <div className="">
            {deleteInputBlock} {editInputBlock} {addConditionBlock}{" "}
            {removeConditionBlock}
          </div>
          <div className="form-label">
            {showKeyOrLabel}
            {showToolTip}
          </div>
          <Input
            className="form-control"
            type="select"
            name={inFieldUniqueIdAndName}
            id={inFieldUniqueIdAndName}
            placeholder={inputFieldData.elementConfig.placeholder}
            readOnly={isReadOnly}
            defaultValue={formData[inFieldUniqueIdAndName]}
            required={inputFieldData.inputIsRequired}
            onChange={(e) =>
              onChangeFunc(
                e,
                inputFieldData,
                key,
                inFieldUniqueIdAndName,
                level
              )
            }
          >
            <option key="mSelectMonthStringKey" value="">
              -Select-
            </option>
            {inputValues.map((inputValue) => (
              <option key={inputValue} value={inputValue}>
                {inputValue}
              </option>
            ))}
          </Input>
        </FormGroup>
      );
    }
  } else if (inputFieldData.elementType.toLowerCase() == "datalist") {
    var inputValues = inputFieldData.value.split(",");
    //console.log("valueArray", inputValues);
    return (
      <FormGroup className="inputFldContainer" key={inFieldUniqueIdAndName}>
        <div className="">
          {deleteInputBlock} {editInputBlock} {addConditionBlock}{" "}
          {removeConditionBlock}
        </div>
        <div className="form-label">
          {showKeyOrLabel}
          {showToolTip}
        </div>
        <input
          className="form-control"
          type="text"
          autoComplete="off"
          name={inFieldUniqueIdAndName}
          id={inFieldUniqueIdAndName}
          list={inFieldUniqueIdAndName + "dl"}
          placeholder={inputFieldData.elementConfig.placeholder}
          readOnly={isReadOnly}
          defaultValue={formData[inFieldUniqueIdAndName]}
          required={inputFieldData.inputIsRequired}
          onChange={(e) =>
            onChangeFunc(e, inputFieldData, key, inFieldUniqueIdAndName, level)
          }
        />
        <datalist
          name={inFieldUniqueIdAndName + "dl"}
          id={inFieldUniqueIdAndName + "dl"}
        >
          {inputValues.map((inputValue) => (
            <option key={inputValue} value={inputValue}>
              {inputValue}
            </option>
          ))}
        </datalist>
      </FormGroup>
    );
  } else if (inputFieldData.elementType.toLowerCase() == "time") {
    // if (inputFieldData.elementConfig.type.toLowerCase() == "image") {
    //defaultValue={formData[inFieldUniqueIdAndName]}
    // console.log(
    //   "timetype_input_type",
    //   inputFieldData.elementConfig.type.toLowerCase()
    // );
    // console.log(
    //   "timetype_input_Value",
    //   inputFieldData.elementConfig.type.toLowerCase() == "time12"
    //     ? hrTimeTo24HourFormat(formData[inFieldUniqueIdAndName])
    //     : formData[inFieldUniqueIdAndName]
    // );
    // console.log(
    //   "timetype_input_defaultValue",
    //   formData[inFieldUniqueIdAndName]
    // );
    return (
      <FormGroup className="inputFldContainer" key={inFieldUniqueIdAndName}>
        <div className="">
          {deleteInputBlock} {editInputBlock} {addConditionBlock}{" "}
          {removeConditionBlock}
        </div>
        <div className="form-label">
          {showKeyOrLabel}
          {showToolTip}
        </div>
        {/* <>Converted Value: {formData[inFieldUniqueIdAndName]}</> */}
        <Input
          className="form-control"
          type="time"
          name={inFieldUniqueIdAndName}
          id={inFieldUniqueIdAndName}
          placeholder={inputFieldData.elementConfig.placeholder}
          readOnly={isReadOnly}
          // defaultValue={formData[inFieldUniqueIdAndName]}
          onChange={(e) => {
            onChangeFunc(e, inputFieldData, key, inFieldUniqueIdAndName, level);
          }}
          defaultValue={
            inputFieldData.elementConfig.type.toLowerCase() == "time12"
              ? hrTimeTo24HourFormat(formData[inFieldUniqueIdAndName])
              : formData[inFieldUniqueIdAndName]
          }
          required={inputFieldData.inputIsRequired}
        />
      </FormGroup>
    );
    // }
  } else {
    return <>Other Type {inFieldUniqueIdAndName}</>;
  }
}
