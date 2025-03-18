//InputFieldRendring.js
import React from "react";
//import { render } from "@testing-library/react";
//import {decode,decodeEntity} from 'html-entities';
import {
  RenderInputAsPerType,
  sortFormFields,
} from "../../OtherFunctions/FormRenderingFunctions";

//AddedOn: 13-12-2021
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
    console.log(
      "processInputFieldsForMultiSelectedValues_mSelectValue",
      mSelectValue,
    );

    if (
      subInputField.input.condition.conditionStatements[mSelectValue] !=
      undefined
    ) {
      console.log(
        "processInputFieldsForMultiSelectedValues_input.condition.conditionStatements",
        subInputField.input.condition.conditionStatements[mSelectValue],
      );

      //let parentSubCondtionKey=subInputField.input.elementUId + 0;
      let parentSubCondtionKey = templateKey + 0;
      //console.log("recursivInputFieldRendring_parentSubCondtionKey",parentSubCondtionKey)
      let subSubTempFormFields =
        subInputField.input.condition.conditionStatements[mSelectValue]
          .subFormFields.formFields;

      subSubTempFormFields = sortFormFields(subSubTempFormFields);
      //console.log("recursivInputFieldRendring_multi_subSubTempFormFields",subSubTempFormFields)
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
            console.log(
              "processInputFieldsForMultiSelectedValues_temprow3**",
              temprow3,
            );
            condTempInputRowTempOne.push(temprow3);
          }
        } else {
          console.log(
            "processInputFieldsForMultiSelectedValues_level3",
            "Sub Level 3 is Not Cond",
          );
        }
      });
    } else {
      console.log("processInputFieldsForMultiSelectedValues_recursivundefined");
    }
  });

  console.log(
    "processInputFieldsForMultiSelectedValues_condTempInputRowTempOne",
    condTempInputRowTempOne,
  );
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
  let condTempInputRow = [];

  console.log("recursivInputFieldRendring_subInputField", subInputField);
  console.log("recursivInputFieldRendring_subInputFields", subInputFields);
  console.log("recursivInputFieldRendring_templateKey*", templateKey);

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
      console.log(
        "recursivInputFieldRendring_multi_inputValue",
        subInputField.inputValue,
      );
      console.log(
        "recursivInputFieldRendring_multi_inputV",
        subInputField.input.condition.conditionStatements[
          subInputField.inputValue
        ],
      );

      //let parentSubCondtionKey=subInputField.input.elementUId + 0;
      let parentSubCondtionKey = templateKey + 0;
      //console.log("recursivInputFieldRendring_parentSubCondtionKey",parentSubCondtionKey)
      let subSubTempFormFields =
        subInputField.input.condition.conditionStatements[
          subInputField.inputValue
        ].subFormFields.formFields;

      subSubTempFormFields = sortFormFields(subSubTempFormFields);
      //console.log("recursivInputFieldRendring_multi_subSubTempFormFields",subSubTempFormFields)
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
            console.log("recursivInputFieldRendring_temprow3**", temprow3);
            condTempInputRow.push(temprow3);
          }
        } else {
          console.log(
            "recursivInputFieldRendring_level3",
            "Sub Level 3 is Not Cond",
          );
        }
      });
    } else {
      console.log("recursivInputFieldRendring_recursivundefined");
    }
  } else if (
    subInputField.input.elementType.toLowerCase() == "checkbox" &&
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
  } else {
    console.log(
      "recursivInputFieldRendring_multi_subInputField",
      subInputField,
    );
    let populateCount = 0;
    if (
      isNaN(subInputField.inputValue) &&
      subInputField.inputValue != null &&
      subInputField.inputValue != undefined &&
      subInputField.inputValue.length > 0
    ) {
      console.log("inputFieldData_", " inputFieldData is Not Numeric");
      console.log("inputFieldData_value", subInputField.inputValue);
      populateCount = 1;
    } else {
      //console.log("inputFieldData", " inputFieldData is Numeric");
      //inputFieldData.input.elementConfig.type
      //Populate Only if data is Number //type:_copyOfInput
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

    //console.log("recursivInputFieldRendring_populateCount", populateCount);

    let subSubTempFormFields = {};
    if (populateCount == 1) {
      subSubTempFormFields =
        subInputField.input.condition.subFormFields.formFields;
      //for (var i = 0; i < populateCount; i++) {
      subSubTempFormFields = sortFormFields(subSubTempFormFields);
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
            console.log("recursivInputFieldRendring_temprow3**", temprow3);
            condTempInputRow.push(temprow3);
          }
        }
      });
      //condTempInputRow.push(<br/>)//Showing
      //}
    } else if (populateCount > 1) {
      subSubTempFormFields =
        subInputField.input.condition.subFormFields.formFields;
      subSubTempFormFields = sortFormFields(subSubTempFormFields);

      if (Object.entries(subSubTempFormFields).length > 0) {
        //Process Table Headings
        let thContainer = new Array();
        //condTempInputRow.push(<th className="inputFieldCountShwTdLabelNO">#</th>);//CommentedOn:09-10-2021
        thContainer.push(<th className="inputFieldCountShwTdLabelNO">S. No</th>); //AddedOn:09-10-2021
        Object.entries(subSubTempFormFields).map(([key, subSubTempField]) => {
          // condTempInputRow.push(
          //   <th className="inputFieldCountShwTdLabel">
          //     <div className="">
          //       <Label className="">
          //         <div className="">
          //           {subSubTempField.elementConfig.inputLabel}
          //         </div>
          //       </Label>
          //     </div>
          //   </th>
          // );//CommentedOn:09-10-2021

          thContainer.push(
            <th className="inputFieldCountShwTdLabel">
              {subSubTempField.elementConfig.inputLabel}
            </th>,
          ); //AddedOn:09-10-2021
        });

        let trContainer = new Array();
        //trContainer.push(React.createElement('tr','{}',thContainer));//AddedOn:09-10-2021
        trContainer.push(<tr>{thContainer}</tr>); //AddedOn:09-10-2021

        //Processing Table Inputfields
        for (var i = 0; i < populateCount; i++) {
          let tdContainer = new Array();
          let parentSubCondtionKey = templateKey + i;
          // condTempInputRow.push(<hr className="trHr" />);//CommentedOn:09-10-2021
          //tdContainer.push(<hr className="trHr" />);
          // condTempInputRow.push(
          //   <td className="inputFieldCountShwTdNo">{i + 1}</td>
          // );//CommentedOn:09-10-2021

          tdContainer.push(<td>{i + 1}</td>); //AddedOn:09-10-2021

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

            // condTempInputRow.push(
            //   <td className="inputFieldCountShwTd">{inoutView}</td>
            // );//CommentedOn:09-10-2021

            tdContainer.push(<td>{inoutView}</td>); //AddedOn:09-10-2021
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
                //console.log("recursivInputFieldRendring_temprow3**", temprow3);
                //condTempInputRow.push(temprow3);//CommentedOn:09-10-2021
                tdContainer.push(<td>{temprow3}</td>); //AddedOn:09-10-2021
              }
            }
          });
          //trContainer.push(React.createElement('tr','{}',tdContainer));//AddedOn:09-10-2021
          trContainer.push(<tr>{tdContainer}</tr>); //AddedOn:09-10-2021
          //condTempInputRow.push(<br/>)//Showing
        }

        //const tableContainer = React.createElement('table','{}',trContainer);//AddedOn:09-10-2021
        //console.log("tableContainer",tableContainer);//AddedOn:09-10-2021
        //condTempInputRow.push(tableContainer);//AddedOn:09-10-2021
        condTempInputRow.push(<table>{trContainer}</table>); //AddedOn:09-10-2021
      }
    }
  }

  return <div className="mainDivTest">{condTempInputRow}</div>;
  // return <table className="mainDivTest" >{condTempInputRow}</table>;
}

function recursivInputFieldRendring(
  inputField,
  subInputFields,
  formData,
  inInputChangeFunc,
) {
  console.log("--recursivInputFieldRendring----");
  console.log("recursivInputFieldRendring_inputField", inputField);
  console.log("recursivInputFieldRendring_subInputFields", subInputFields);
  console.log("recursivInputFieldRendring_formData", formData);
  var rows = [];

  inputField.forEach((tempField) => {
    if (tempField.isConditional == true) {
      console.log(
        "recursivInputFieldRendring_tempField_" + tempField.elementUId,
        tempField,
      );
      console.log(
        "recursivInputFieldRendring_subInputField_" + tempField.elementUId,
        subInputFields[tempField.elementUId],
      );

      if (subInputFields[tempField.elementUId] != undefined) {
        let templateKey = subInputFields[tempField.elementUId].templateKey;
        console.log(
          "recursivInputFieldRendring_templateKey_" + templateKey,
          templateKey,
        );
        console.log(
          "recursivInputFieldRendring_input_value_" + templateKey,
          formData[templateKey],
        );
        let subInputField = subInputFields[tempField.elementUId];
        console.log(
          "recursivInputFieldRendring_input_subInputField_" +
            tempField.elementUId,
          subInputField,
        );

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

        console.log(
          "recursivInputFieldRendring_rows_" + tempField.elementUId,
          rows,
        );

        console.log(
          "InputFieldRendring_tempField_templateKey",
          subInputField[templateKey],
        );
        //console.log("InputFieldRendring_tempField_templateKey",conditionalFormInputs[tempField.elementUId])
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

        console.log(
          "recursivInputFieldRendring_condTempInputRow_" + tempField.elementUId,
          condTempInputRow,
        );
      } else {
        console.log("subInputFields[tempField.elementUId]==undefined");
        console.log("subInputFields_undefined", tempField);
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
      //console.log("recursivInputFieldRendring_SimpleField",tempField)
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
  console.log("recursivInputFieldRendrin_rows", rows);
  return <>{rows}</>;
}

export function InputFieldRendring(
  formsFieldsDataSorted,
  conditionalFormInputs,
  inInputChangeFunc,
  formData,
) {
  //ToDo: check/process global variable properly
  //ToDo: check/process Numeric Condition

  console.log("--InputFieldRendring----");
  console.log(
    "InputFieldRendring_formsFieldsDataSorted",
    formsFieldsDataSorted,
  );
  console.log(
    "InputFieldRendring_conditionalFormInputs",
    conditionalFormInputs,
  );
  console.log("InputFieldRendring_formData", formData);
  var rows = [];
  rows = recursivInputFieldRendring(
    formsFieldsDataSorted,
    conditionalFormInputs,
    formData,
    inInputChangeFunc,
  );
  return <>{rows}</>;
}
