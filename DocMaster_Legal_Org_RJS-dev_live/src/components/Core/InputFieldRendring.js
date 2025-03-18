//InputFieldRendring.js
import React from "react";
import {
  RenderInputAsPerType,
  sortFormFields,
} from "../../OtherFunctions/FormRenderingFunctions";

//AddedOn: 14-12-2021 to Process MultiSelectedCheckBoxe
function processInputFieldsForMultiSelectedValues(
  subInputField,
  templateKey,
  subInputFields,
  inInputChangeFunc,
  inputField,
  formData,
) {
  let condTempInputRowTempOne = [];
  subInputField.multiSelectValue.forEach((mSelectValue) => {
    if (
      subInputField.input.condition.conditionStatements[mSelectValue] !=
      undefined
    ) {
      let parentSubCondtionKey = templateKey + 0;
      let subSubTempFormFields =
        subInputField.input.condition.conditionStatements[mSelectValue]
          .subFormFields.formFields;
      subSubTempFormFields = sortFormFields(subSubTempFormFields);
      Object.entries(subSubTempFormFields).map(([key, subSubTempField]) => {
        condTempInputRowTempOne.push(
          RenderInputAsPerType(
            true,
            0,
            subSubTempField,
            subSubTempField.elementUId + parentSubCondtionKey,
            false,
            inInputChangeFunc,
            null,
            null,
            null,
            null,
            "" + parentSubCondtionKey,
            true,
            formData,
          ),
        );

        if (subSubTempField.isConditional == true) {
          if (
            subInputFields[subSubTempField.elementUId + parentSubCondtionKey] !=
            undefined
          ) {
            let temprow3 = recursivSubSubInputFieldRendring(
              inputField,
              subInputFields[subSubTempField.elementUId + parentSubCondtionKey],
              formData,
              inInputChangeFunc,
              subSubTempField.elementUId + parentSubCondtionKey,
              subInputFields,
            ); //Perform below using this Function
            condTempInputRowTempOne.push(temprow3);
          }
        } else {
          //DoNothing
          // "Sub Level 3 is Not Cond"
        }
      });
    } else {
      //DoNothing
    }
  });
  return condTempInputRowTempOne;
}

function recursivSubSubInputFieldRendring(
  inputField,
  subInputField,
  formData,
  inInputChangeFunc,
  templateKey,
  subInputFields,
) {
  console.log("recursivSubSubInputFieldRendring_formData", formData);
  console.log("recursivSubSubInputFieldRendring_templateKey", templateKey);
  let condTempInputRow = [];
  if (
    subInputField.input.elementType.toLowerCase() == "copyofinput" &&
    (subInputField.input.elementConfig.type.toLowerCase() == "multiselectt1" ||
      subInputField.input.elementConfig.type.toLowerCase() == "multiselectt2" ||
      subInputField.input.elementConfig.type.toLowerCase() == "multiselectt3" ||
      subInputField.input.elementConfig.type.toLowerCase() == "multiselectt4" ||
      subInputField.input.elementConfig.type.toLowerCase() == "multiselectt5")
  ) {
    console.log(
      "recursivInputFieldRendring_multiselec_checkbox",
      "multiselec_checkbox",
    );
    condTempInputRow.push(
      processInputFieldsForMultiSelectedValues(
        subInputField,
        templateKey,
        subInputFields,
        inInputChangeFunc,
        inputField,
        formData,
      ),
    );
  } else if (
    subInputField.input.elementType.toLowerCase() == "select" ||
    subInputField.input.elementType.toLowerCase() == "radio" ||
    subInputField.input.elementType.toLowerCase() == "datalist" ||
    (subInputField.input.elementType == "copyOfInput" &&
      subInputField.input.condition.conditionType == "ValueBased")
  ) {
    if (
      subInputField.input.condition.conditionStatements[
        subInputField.inputValue
      ] != undefined
    ) {
      //let parentSubCondtionKey=subInputField.input.elementUId + 0;
      let parentSubCondtionKey = templateKey + 0;
      let subSubTempFormFields =
        subInputField.input.condition.conditionStatements[
          subInputField.inputValue
        ].subFormFields.formFields;

      subSubTempFormFields = sortFormFields(subSubTempFormFields);
      Object.entries(subSubTempFormFields).map(([key, subSubTempField]) => {
        condTempInputRow.push(
          RenderInputAsPerType(
            true,
            0,
            subSubTempField,
            subSubTempField.elementUId + parentSubCondtionKey,
            false,
            inInputChangeFunc,
            null,
            null,
            null,
            null,
            "" + parentSubCondtionKey,
            true,
            formData,
          ),
        );

        if (subSubTempField.isConditional == true) {
          if (
            subInputFields[subSubTempField.elementUId + parentSubCondtionKey] !=
            undefined
          ) {
            let temprow3 = recursivSubSubInputFieldRendring(
              inputField,
              subInputFields[subSubTempField.elementUId + parentSubCondtionKey],
              formData,
              inInputChangeFunc,
              subSubTempField.elementUId + parentSubCondtionKey,
              subInputFields,
            ); //Perform below using this Function
            condTempInputRow.push(temprow3);
          }
        } else {
          //DoNothing //"Sub Level 3 is No Condition"
        }
      });
    } else {
    }
  } else if (
    subInputField.input.elementType.toLowerCase() == "checkbox" &&
    (subInputField.input.elementConfig.type.toLowerCase() == "multiselectt1" ||
      subInputField.input.elementConfig.type.toLowerCase() == "multiselectt2" ||
      subInputField.input.elementConfig.type.toLowerCase() == "multiselectt3" ||
      subInputField.input.elementConfig.type.toLowerCase() == "multiselectt4" ||
      subInputField.input.elementConfig.type.toLowerCase() == "multiselectt5")
  ) {
    console.log("inputrender_checkbox_subInputField", subInputField);
    //ToProcess MultiSelectedCheckBoxs
    condTempInputRow.push(
      processInputFieldsForMultiSelectedValues(
        subInputField,
        templateKey,
        subInputFields,
        inInputChangeFunc,
        inputField,
        formData,
      ),
    );
  } else {
    let populateCount = 0;
    if (
      isNaN(subInputField.inputValue) &&
      subInputField.inputValue != null &&
      subInputField.inputValue != undefined &&
      subInputField.inputValue.length > 0
    ) {
      //inputFieldData is Not Numeric
      populateCount = 1;
    } else {
      //inputFieldData is Numeric
      //Populate Only if data is Number
      if (
        (subInputField.input.elementType.toLowerCase() == "input" ||
          subInputField.input.elementType == "copyOfInput") &&
        (subInputField.input.elementConfig.type.toLowerCase() == "number" ||
          subInputField.input.elementConfig.type.toLowerCase() == "daystring" ||
          subInputField.input.elementConfig.type.toLowerCase() == "monthstring")
      ) {
        populateCount = parseInt(subInputField.inputValue);
      }
    }

    let subSubTempFormFields = {};
    if (populateCount == 1) {
      subSubTempFormFields = sortFormFields(
        subInputField.input.condition.subFormFields.formFields,
      );
      //for (var i = 0; i < populateCount; i++) {
      //subSubTempFormFields = sortFormFields(subSubTempFormFields);
      let parentSubCondtionKey = templateKey + 0;
      condTempInputRow.push(<hr className="trHr" />);
      Object.entries(subSubTempFormFields).map(([key, subSubTempField]) => {
        let inoutView = RenderInputAsPerType(
          true,
          0,
          subSubTempField,
          subSubTempField.elementUId + parentSubCondtionKey,
          false,
          inInputChangeFunc,
          null,
          null,
          null,
          null,
          "" + parentSubCondtionKey,
          true,
          formData,
        );
        condTempInputRow.push(inoutView);

        if (subSubTempField.isConditional == true) {
          if (
            subInputFields[subSubTempField.elementUId + parentSubCondtionKey] !=
            undefined
          ) {
            let temprow3 = recursivSubSubInputFieldRendring(
              inputField,
              subInputFields[subSubTempField.elementUId + parentSubCondtionKey],
              formData,
              inInputChangeFunc,
              subSubTempField.elementUId + parentSubCondtionKey,
              subInputFields,
            ); //Perform below using this Function
            condTempInputRow.push(temprow3);
          }
        }
      });
    } else if (populateCount > 1) {
      subSubTempFormFields = sortFormFields(
        subInputField.input.condition.subFormFields.formFields,
      );

      if (Object.entries(subSubTempFormFields).length > 0) {
        //Process Table Headings
        let thContainer = new Array();
        //condTempInputRow.push(<th className="inputFieldCountShwTdLabelNO">#</th>);
        thContainer.push(<th className="inputFieldCountShwTdLabelNO">S. No</th>); //AddedOn:11-10-2021
        Object.entries(subSubTempFormFields).map(([key, subSubTempField]) => {
          /*condTempInputRow.push(
          <th className="inputFieldCountShwTdLabel">
            <div className="">
              <Label className="">
                <div className="">
                  {subSubTempField.elementConfig.inputLabel}
                </div>
              </Label>
            </div>
          </th>
        );
        */
          //inputFieldData.elementType.toLowerCase() == "formula"
          if (
            subSubTempField.elementType.toLowerCase() === "label" ||
            subSubTempField.elementType.toLowerCase() === "formula" ||
            subSubTempField.elementType.toLowerCase() === "amount2words" ||
            subSubTempField.elementType.toLowerCase() == "strngformula" ||
            subSubTempField.elementType.toLowerCase() == "legalformula" ||
            subSubTempField.elementType.toLowerCase() == "trigger"
          ) {
          } else {
            thContainer.push(
              <th className="inputFieldCountShwTdLabel">
                {subSubTempField.elementConfig.inputLabel}
              </th>,
            ); //AddedOn:11-10-2021
          }
        });

        let trContainer = new Array();
        trContainer.push(<tr>{thContainer}</tr>); //AddedOn:11-10-2021
        //Processing Table Inputfields
        for (var i = 0; i < populateCount; i++) {
          let tdContainer = new Array();
          let parentSubCondtionKey = templateKey + i;
          /*
        condTempInputRow.push(<hr className="trHr" />);
        condTempInputRow.push(
          <td className="inputFieldCountShwTdNo">{i + 1}</td>
        );
        */

          tdContainer.push(<td>{i + 1}</td>); //AddedOn:11-10-2021

          Object.entries(subSubTempFormFields).map(([key, subSubTempField]) => {
            let inoutView = RenderInputAsPerType(
              true,
              0,
              subSubTempField,
              subSubTempField.elementUId + parentSubCondtionKey,
              false,
              inInputChangeFunc,
              null,
              null,
              null,
              null,
              "" + parentSubCondtionKey,
              false,
              formData,
            );
            /*
          condTempInputRow.push(
            <td className="inputFieldCountShwTd">{inoutView}</td>
          );*/
            tdContainer.push(<td>{inoutView}</td>); //AddedOn:11-10-2021
            /*
            condTempInputRow.push(RenderInputAsPerType(
              true,
              0,
              subSubTempField,
              subSubTempField.elementUId+parentSubCondtionKey,
              false,
              inInputChangeFunc,
              null,
              null,
              null,
              null,
              "" + parentSubCondtionKey
            ))
            */
            //condTempInputRow.push(</td>+{"&nbsp"});

            if (subSubTempField.isConditional == true) {
              if (
                subInputFields[
                  subSubTempField.elementUId + parentSubCondtionKey
                ] != undefined
              ) {
                let temprow3 = recursivSubSubInputFieldRendring(
                  inputField,
                  subInputFields[
                    subSubTempField.elementUId + parentSubCondtionKey
                  ],
                  formData,
                  inInputChangeFunc,
                  subSubTempField.elementUId + parentSubCondtionKey,
                  subInputFields,
                ); //Perform below using this Function
                //condTempInputRow.push(temprow3);
                tdContainer.push(<td>{temprow3}</td>); //AddedOn:11-10-2021
              }
            }
          });
          trContainer.push(<tr>{tdContainer}</tr>); //AddedOn:11-10-2021
        }
        condTempInputRow.push(
          <table className="inputFieldRenderingTable">{trContainer}</table>,
        ); //AddedOn:11-10-2021
      }
    }
  }
  // return <>{condTempInputRow}</>;
  return <div className="mainDivTest">{condTempInputRow}</div>;
}

function recursivInputFieldRendring(
  inputField,
  subInputFields,
  formData,
  inInputChangeFunc,
) {
  var rows = [];

  inputField.forEach((tempField) => {
    if (tempField.isConditional == true) {
      console.log(
        "recursivInputFieldRendring_tempField_isConditional",
        tempField,
      );
      if (subInputFields[tempField.elementUId] != undefined) {
        let templateKey = subInputFields[tempField.elementUId].templateKey;
        let subInputField = subInputFields[tempField.elementUId];
        rows.push(
          RenderInputAsPerType(
            true,
            0,
            tempField,
            tempField.elementUId,
            false,
            inInputChangeFunc,
            null,
            null,
            null,
            null,
            "",
            true,
            formData,
          ),
        );

        let condTempInputRow = [];
        condTempInputRow = recursivSubSubInputFieldRendring(
          inputField,
          subInputField,
          formData,
          inInputChangeFunc,
          templateKey,
          subInputFields,
        ); //Perform below using this Function
        rows.push(condTempInputRow);
      } else {
        rows.push(
          RenderInputAsPerType(
            true,
            0,
            tempField,
            tempField.elementUId,
            false,
            inInputChangeFunc,
            null,
            null,
            null,
            null,
            "",
            true,
            formData,
          ),
        );
      }
    } else {
      rows.push(
        RenderInputAsPerType(
          true,
          0,
          tempField,
          tempField.elementUId,
          false,
          inInputChangeFunc,
          null,
          null,
          null,
          null,
          "",
          true,
          formData,
        ),
      );
    }
  });
  return <>{rows}</>;
}

export function InputFieldRendring(
  formsFieldsDataSorted,
  conditionalFormInputs,
  inInputChangeFunc,
  formData,
) {
  console.log(
    "InputFieldRendring_formsFieldsDataSorted",
    formsFieldsDataSorted,
  );
  console.log(
    "InputFieldRendring_conditionalFormInputs",
    conditionalFormInputs,
  );
  console.log("InputFieldRendring_formData", formData);
  //ToDo: check/process global variable properly
  //ToDo: check/process Numeric Condition
  var rows = [];
  rows = recursivInputFieldRendring(
    formsFieldsDataSorted,
    conditionalFormInputs,
    formData,
    inInputChangeFunc,
  );
  return <>{rows}</>;
}
