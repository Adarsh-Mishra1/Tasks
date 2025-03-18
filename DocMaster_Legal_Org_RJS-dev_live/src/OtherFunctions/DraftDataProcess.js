//PreFilledInputDataProcess.js

import { sortFormFields } from "../OtherFunctions/FormRenderingFunctions";
import { onMultiSelectCheckBoxClick } from "../OtherFunctions/TemplateRenderingFunctions";

export function getInputDataValueFromDraftData(field, draftInputDatas) {
  // console.log("getInputDataValueFromDraftData_", field, draftInputDatas);

  let fieldValue = "";
  if (
    draftInputDatas != null &&
    draftInputDatas != undefined &&
    Object.keys(draftInputDatas).length > 0
  ) {
    Object.entries(draftInputDatas).forEach(([key, value]) => {
      // key is either an array index or object key
      // traverse(value);

      // console.log(
      //   "getInputDataValueFromDraftData_draftInputDatas_field_key_value",
      //   field,
      //   key,
      //   value
      // );

      if (field == key) {
        fieldValue = value;
      }
    });

    // draftInputDatas.map((userPrefilledField, index) => {
    //   console.log(
    //     "getInputDataValueFromDraftData_equat",field,userPrefilledField.field
    //   );
    //   if (field == userPrefilledField.field) {
    //     fieldValue = userPrefilledField.fieldValue;
    //   }
    // });
  }
  // console.log("getInputDataValueFromDraftData_fieldValue", fieldValue);
  return fieldValue;
}

export function processDraftForTemplate(draftInputDatas, formdata) {
  //DevNote: Function to Replace Intial FormData value with User Provided Prefilled Input Data as per field
  // console.log("_processDraftForTemplate_draftInputDatas", draftInputDatas);
  if (Object.keys(draftInputDatas).length > 0) {
    // userPrefilledFields.map((userPrefilledField, index) =>
    Object.entries(draftInputDatas).forEach(([key, value]) => {
      /*console.log(
        "_processDraftForTemplate",
        userPrefilledField
      );
      console.log(
        "UserAllPrefilledFields_formdata[userPrefilledField.field]",
        formdata[userPrefilledField.field]
      );
      */
      if (formdata[key] == undefined || formdata[key].length <= 0) {
        formdata[key] = value;
      }
    });
  }
  return formdata;
}

export function processDocFormDraftDataFormInput(
  formsFieldsDataSorted,
  draftInputDatas,
) {
  console.log(
    "processDocFormDraftDataFormInput",
    "------(Start)-----------------",
  );

  console.log(
    "processDocFormDraftDataFormInput_draftInputDatas",
    draftInputDatas,
  );

  let conditionalFormInputs = {};

  if (formsFieldsDataSorted.length > 0) {
    var tempArray = [];
    // var tempConditionalArray = [];
    formsFieldsDataSorted.map((formsFieldsData, index) => {
      // console.log(
      //   "UserAllPrefilledFields_this.state.userPrefilledFields",
      //   userPrefilledFields
      // );
      let formsFieldsDataValue = getInputDataValueFromDraftData(
        formsFieldsData.elementUId,
        draftInputDatas,
      );
      console.log(
        "UserAllPrefilledFields_formsFieldsDataValue",
        formsFieldsDataValue,
      );

      if (
        formsFieldsDataValue != undefined &&
        formsFieldsDataValue.length > 0
      ) {
        // formsFieldsData.value = formsFieldsDataValue;
        formsFieldsData.defaultValue = formsFieldsDataValue;
      }

      tempArray = formsFieldsDataSorted.map((tableData) =>
        tableData.elementUId === formsFieldsData.elementUId
          ? { ...tableData, formsFieldsData }
          : tableData,
      );
      tempArray[formsFieldsDataSorted.indexOf(formsFieldsData)] =
        formsFieldsData;

      console.log(
        "processDocFormDraftDataFormInput_formsFieldsData",
        formsFieldsData,
      );

      if (
        formsFieldsData.isConditional &&
        formsFieldsData.defaultValue != undefined
      ) {
        console.log(
          "processDocFormDraftDataFormInput_formsFieldsData.isConditional",
          formsFieldsData,
          formsFieldsData.isConditional,
        );

        let valueKey = null;
        let tempValue = formsFieldsData?.defaultValue.trim();
        // let tempValue =formsFieldsDataValue.trim();
        let templateKey = formsFieldsData.elementUId;
        let multiSelectValue = []; //AddedOn 13-12-2021

        if (formsFieldsData.elementType.toLowerCase() === "selectv2") {
          valueKey = tempValue.split(":")[0];
          tempValue = tempValue.split(":")[1];
        }

        // DevNote:[ToBeDone]
        if (formsFieldsData.elementType.toLowerCase() == "checkbox") {
          if (
            formsFieldsData.elementConfig.type.toLowerCase() ==
              "multiselectt1" ||
            formsFieldsData.elementConfig.type.toLowerCase() ==
              "multiselectt2" ||
            formsFieldsData.elementConfig.type.toLowerCase() ==
              "multiselectt3" ||
            formsFieldsData.elementConfig.type.toLowerCase() ==
              "multiselectt4" ||
            formsFieldsData.elementConfig.type.toLowerCase() == "multiselectt5"
          ) {
            console.log(
              "processDocFormDraftDataFormInput_checkbox_formsFieldsData_before",
              formsFieldsData,
            );
            multiSelectValue = formsFieldsData?.defaultValue
              .split(",")
              .map(function (value) {
                return value.trim();
              })
              .filter(function (i) {
                return i;
              });
            tempValue = onMultiSelectCheckBoxClick(
              tempValue,
              formsFieldsData.elementConfig.type,
              formsFieldsData.validation.maxLength,
              formsFieldsData.validation.minLength,
            );
            formsFieldsData.multiSelectValue = multiSelectValue;
            formsFieldsData.tempValue = tempValue;
            console.log(
              "processDocFormDraftDataFormInput_checkbox_formsFieldsData_after",
              formsFieldsData,
            );
          }
        }
        /*
        conditionalFormInputs[templateKey] = {
          valueKey: valueKey,
          inputValue: tempValue.trim(),
          input: formsFieldsData,
          templateKey: templateKey,
          multiSelectValue: multiSelectValue,
        };
        */
        console.log(
          "processDocFormDraftDataFormInput_templateKey,multiSelectValue",
          templateKey,
          multiSelectValue,
        );

        console.log(
          "processDocFormDraftDataFormInput_conditionalFormInputs",
          templateKey,
        );
        //DevNote [ToDo]: Check for Other Conditional Fields here in Recursive patern
        let tempConditionalFormInputs = checkForConditionalFormInputs(
          formsFieldsData,
          conditionalFormInputs,
          templateKey,
          draftInputDatas,
          multiSelectValue,
        );
        console.log(
          "processDocFormDraftDataFormInput_tempConditionalFormInputs",
          tempConditionalFormInputs,
        );
        // conditionalFormInputs=tempConditionalFormInputs;
        // console.log("processDocFormDraftDataFormInput_conditionalFormInputs", conditionalFormInputs);
      }
    });

    // console.log("UserAllPrefilledFields_tempArray", tempArray);

    if (tempArray.length > 0) {
      //console.log("UserAllPrefilledFields_set", tempArray);
      //this.setState({ formsFieldsDataSorted: tempArray });
      formsFieldsDataSorted = tempArray;
    }
  }

  console.log(
    "processDocFormDraftDataFormInput",
    "------(End)-----------------",
  );

  console.log("processDocFormDraftDataFormInput_", formsFieldsDataSorted);

  console.log("processDocFormDraftDataFormInput_return", {
    formsFieldsDataSorted: formsFieldsDataSorted,
    conditionalFormInputs: conditionalFormInputs,
  });

  // console.log(
  //   "UserAllPrefilledFields_formsFieldsData_trrn",
  //   formsFieldsDataSorted
  // );

  return {
    formsFieldsDataSorted: formsFieldsDataSorted,
    conditionalFormInputs: conditionalFormInputs,
  };
}

const checkForConditionalFormInputs = (
  formsFieldsData,
  conditionalFormInputs,
  templateKey,
  draftInputDatas,
  multiSelectValue,
) => {
  let tempConditionalFormInputs = {};
  console.log("checkForConditionalFormInputs_formsFieldsData", "----Start----");
  console.log("checkForConditionalFormInputs_formsFieldsData", formsFieldsData);
  console.log(
    "checkForConditionalFormInputs_conditionalFormInputs",
    conditionalFormInputs,
  );
  console.log("checkForConditionalFormInputs_templateKey", templateKey);

  if (
    formsFieldsData.elementType.toLowerCase() == "select" ||
    formsFieldsData.elementType.toLowerCase() == "selectv2" ||
    formsFieldsData.elementType.toLowerCase() == "radio" ||
    formsFieldsData.elementType.toLowerCase() == "datalist" ||
    (formsFieldsData.elementType == "copyOfInput" &&
      formsFieldsData.input?.condition.conditionType == "ValueBased")
  ) {
    console.log(
      "checkForConditionalFormInputs_forMultiOption_formsFieldsData",
      formsFieldsData,
    );
    console.log("checkForConditionalFormInputs_forMultiOption", templateKey);

    let inputValueKey = formsFieldsData.defaultValue;
    if (formsFieldsData.elementType.toLowerCase() == "selectv2") {
      inputValueKey = formsFieldsData.defaultValue;
    }

    console.log(
      "checkForConditionalFormInputs_forMultiOption_inputValueKey",
      inputValueKey,
    );
    if (
      formsFieldsData.condition.conditionStatements[inputValueKey] != undefined
    ) {
      console.log(
        "checkForConditionalFormInputs_forMultiOption_conditionStatements",
        formsFieldsData.condition.conditionStatements,
      );
      let parentSubCondtionKey = templateKey + 0;
      console.log(
        "checkForConditionalFormInputs_forMultiOption_parentSubCondtionKey",
        parentSubCondtionKey,
      );

      console.log(
        "checkForConditionalFormInputs_formsFieldsData.condition.conditionStatements",
        formsFieldsData.condition.conditionStatements[inputValueKey],
      );
      /*
      let subSubTempFormFields =
        formsFieldsData.condition.conditionStatements[inputValueKey]
          .subFormFields.inputFields;
*/

      let subSubTempFormFields =
        formsFieldsData.condition.conditionStatements[inputValueKey]
          .subFormFields.formFields;

      console.log(
        "checkForConditionalFormInputs_formsFieldsData_subSubTempFormFields",
        subSubTempFormFields,
      );

      subSubTempFormFields = sortFormFields(subSubTempFormFields);
      console.log(
        "checkForConditionalFormInputs_forMultiOption_subSubTempFormFields",
        subSubTempFormFields,
      );
      tempConditionalFormInputs = subConditionalInternaleFields(
        subSubTempFormFields,
        parentSubCondtionKey,
        draftInputDatas,
        conditionalFormInputs,
        multiSelectValue,
      );
      console.log(
        "checkForConditionalFormInputs_forMultiOption_subSubTempFormFields_tempConditionalFormInputs",
        parentSubCondtionKey,
        tempConditionalFormInputs,
      );
    }
  } else if (
    formsFieldsData.elementType.toLowerCase() == "checkbox" &&
    (formsFieldsData.elementConfig.type.toLowerCase() == "multiselectt1" ||
      formsFieldsData.elementConfig.type.toLowerCase() == "multiselectt2" ||
      formsFieldsData.elementConfig.type.toLowerCase() == "multiselectt3" ||
      formsFieldsData.elementConfig.type.toLowerCase() == "multiselectt4" ||
      formsFieldsData.elementConfig.type.toLowerCase() == "multiselectt5")
  ) {
    // tempConditionalFormInputs= subConditionalInternaleFields(subSubTempFormFields,parentSubCondtionKey,draftInputDatas,conditionalFormInputs,multiSelectValue);
    console.log(
      "checkForConditionalFormInputs_MultiSelected_templateKey",
      templateKey,
    );

    console.log(
      "checkForConditionalFormInputs_MultiSelected_formsFieldsData",
      formsFieldsData,
    );
    console.log(
      "checkForConditionalFormInputs_MultiSelected_multiSelectValue",
      multiSelectValue,
    );

    let tempConditionalFormInputsTemp = {};

    if (multiSelectValue == undefined) {
      //draftInputDatas

      console.log(
        "checkForConditionalFormInputs_MultiSelected_multiSelectValue",
        "In Undefined Check in draftInputDatas",
        draftInputDatas[templateKey],
      );

      multiSelectValue = draftInputDatas[templateKey]
        ?.split(",")
        .map(function (value) {
          return value.trim();
        })
        .filter(function (i) {
          return i;
        });

      console.log(
        "checkForConditionalFormInputs_MultiSelected_multiSelectValue_after",
        multiSelectValue,
      );
    }

    multiSelectValue?.forEach((mSelectValue) => {
      console.log(
        "checkForConditionalFormInputs_MultiSelected_mSelectValue",
        mSelectValue,
      );

      if (
        formsFieldsData.condition.conditionStatements[mSelectValue] != undefined
      ) {
        console.log(
          "checkForConditionalFormInputs_MultiSelected_.condition.conditionStatements",
          formsFieldsData.condition.conditionStatements,
        );

        console.log(
          "checkForConditionalFormInputs_MultiSelected_.condition.conditionStatements_for_mSelectValue",
          formsFieldsData.condition.conditionStatements[mSelectValue],
        );

        //let parentSubCondtionKey=subInputField.input.elementUId + 0;
        let parentSubCondtionKey = templateKey + 0;
        //console.log("recursivInputFieldRendring_parentSubCondtionKey",parentSubCondtionKey)
        // let subSubTempFormFields =
        //   formsFieldsData.condition.conditionStatements[mSelectValue]
        //     .subFormFields.inputFields;
        let subSubTempFormFields =
          formsFieldsData.condition.conditionStatements[mSelectValue]
            .subFormFields.formFields;

        subSubTempFormFields = sortFormFields(subSubTempFormFields);

        console.log(
          "checkForConditionalFormInputs_MultiSelected_parentSubCondtionKey",
          parentSubCondtionKey,
        );
        console.log(
          "checkForConditionalFormInputs_MultiSelected_subSubTempFormFields_mSelectValue",
          mSelectValue,
          subSubTempFormFields,
        );

        tempConditionalFormInputs = subConditionalInternaleFields(
          subSubTempFormFields,
          parentSubCondtionKey,
          draftInputDatas,
          conditionalFormInputs,
          multiSelectValue,
        );
        console.log(
          "checkForConditionalFormInputs_MultiSelected_tempConditionalFormInputs",
          tempConditionalFormInputs,
        );

        // let checkForConditionalFormInputsVar=checkForConditionalFormInputs(formsFieldsData,conditionalFormInputs,templateKey,draftInputDatas,multiSelectValue)
        // console.log("checkForConditionalFormInputs_MultiSelected_checkForConditionalFormInputs",checkForConditionalFormInputsVar);
        // tempConditionalFormInputsTemp=[...tempConditionalFormInputsTemp,tempConditionalFormInputs]
        //console.log("recursivInputFieldRendring_multi_subSubTempFormFields",subSubTempFormFields)
        /*
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
                        formData
                      )
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
                          subInputFields
                        ); //Perform below using this Function
                        console.log(
                          "processInputFieldsForMultiSelectedValues_temprow3**",
                          temprow3
                        );
                        condTempInputRowTempOne.push(temprow3);
                      }
                    } else {
                      console.log(
                        "processInputFieldsForMultiSelectedValues_level3",
                        "Sub Level 3 is Not Cond"
                      );
                    }
                  });
                  */
      }
    });
    // return condTempInputRowTempOne;

    /*
    processInputFieldsForMultiSelectedValues(
      subInputField,
      templateKey,
      subInputFields,
      inInputChangeFunc,
      inputField,
      formData
    )*/
  } else {
    let populateCount = 0;

    if (
      isNaN(formsFieldsData.defaultValue) &&
      formsFieldsData.defaultValue != null &&
      formsFieldsData.defaultValue != undefined &&
      formsFieldsData.defaultValue.length > 0
    ) {
      //console.log("inputFieldData", " inputFieldData is Not Numeric");
      populateCount = 1;
    } else {
      if (
        (formsFieldsData.elementType.toLowerCase() == "input" ||
          formsFieldsData.elementType == "copyOfInput") &&
        (formsFieldsData.elementConfig.type.toLowerCase() == "number" ||
          formsFieldsData.elementConfig.type.toLowerCase() == "daystring" ||
          formsFieldsData.elementConfig.type.toLowerCase() == "monthstring")
      ) {
        populateCount = parseInt(formsFieldsData.defaultValue);
      }
    }

    console.log("checkForConditionalFormInputs_populateCount", populateCount);

    let subSubTempFormFields = {};
    // subSubTempFormFields = sortFormFields(
    //   formsFieldsData.condition.subFormFields.inputFields
    // );
    subSubTempFormFields = sortFormFields(
      formsFieldsData.condition?.subFormFields?.formFields,
    );

    console.log(
      "checkForConditionalFormInputs_subSubTempFormFields",
      subSubTempFormFields,
    );

    for (var i = 0; i < populateCount; i++) {
      let parentSubCondtionKey = templateKey + i;
      console.log(
        "checkForConditionalFormInputs_parentSubCondtionKey",
        parentSubCondtionKey,
      );
      tempConditionalFormInputs = subConditionalInternaleFields(
        subSubTempFormFields,
        parentSubCondtionKey,
        draftInputDatas,
        conditionalFormInputs,
        multiSelectValue,
      );
    }

    //}
  }

  console.log(
    "checkForConditionalFormInputs_return_conditionalFormInputs",
    conditionalFormInputs,
  );
  console.log("checkForConditionalFormInputs_formsFieldsData", "----End----");
  return { ...conditionalFormInputs, ...tempConditionalFormInputs };
  // return {...conditionalFormInputs}
  // return tempConditionalFormInputs;
};

const subConditionalInternaleFields = (
  subSubTempFormFields,
  parentSubCondtionKey,
  draftInputDatas,
  conditionalFormInputs,
  multiSelectValue,
) => {
  console.log(
    "subConditionalInternaleFields_parentSubCondtionKey_subSubTempFormFields",
    parentSubCondtionKey,
    subSubTempFormFields,
  );

  // console.log(
  //   "subConditionalInternaleFields_multiSelectValue",
  //   multiSelectValue
  // );
  console.log(
    "subConditionalInternaleFields_parentSubCondtionKey",
    parentSubCondtionKey,
  );
  console.log("subConditionalInternaleFields_draftInputDatas", draftInputDatas);
  console.log(
    "subConditionalInternaleFields_multiSelectValue_1",
    parentSubCondtionKey,
    multiSelectValue,
    subSubTempFormFields,
  );
  let tempConditionalFormInputs = {};
  Object.entries(subSubTempFormFields).map(([key, subSubTempField]) => {
    let templateKeyTmp = subSubTempField.elementUId + parentSubCondtionKey;

    console.log(
      "subConditionalInternaleFields_multiSelectValue_2",
      parentSubCondtionKey,
      multiSelectValue,
      subSubTempField,
    );

    // console.log(
    //   "checkForConditionalFormInputs_subSubTempFormFields_templateKeyTmp",
    //   templateKeyTmp
    // );
    console.log(
      "checkForConditionalFormInputs_subSubTempFormFields_subSubTempField_1",
      templateKeyTmp,
      subSubTempField,
    );

    if (subSubTempField.isConditional) {
      console.log(
        "checkForConditionalFormInputs_subSubTempFormFields_draftInputDatas",
        draftInputDatas,
      );
      console.log(
        "checkForConditionalFormInputs_subSubTempFormFields_subSubTempField_bfr",
        subSubTempField,
      );
      console.log(
        "checkForConditionalFormInputs_subSubTempFormFields-templateKeyValue",
        templateKeyTmp,
        draftInputDatas[templateKeyTmp],
      );
      // if(draftInputDatas[templateKeyTmp]!=undefined){
      //   subSubTempField["defaultValue"]=draftInputDatas[templateKeyTmp]
      // }else{
      //   subSubTempField["defaultValue"]=undefined
      // }
      subSubTempField["defaultValue"] = draftInputDatas[templateKeyTmp];
      console.log(
        "checkForConditionalFormInputs_subSubTempFormFields_subSubTempField_after",
        subSubTempField,
      );

      console.log(
        "checkForConditionalFormInputs_subSubTempFormFields_key",
        subSubTempField.elementUId + parentSubCondtionKey,
      );

      let valueKey = null;
      let tempValue = subSubTempField.defaultValue?.trim();

      console.log(
        "subConditionalInternaleFields_multiSelectValue_3",
        parentSubCondtionKey,
        templateKeyTmp,
        tempValue,
        multiSelectValue,
        subSubTempField,
      );

      if (
        subSubTempField.elementType.toLowerCase() == "checkbox" &&
        (subSubTempField.elementConfig.type.toLowerCase() == "multiselectt1" ||
          subSubTempField.elementConfig.type.toLowerCase() == "multiselectt2" ||
          subSubTempField.elementConfig.type.toLowerCase() == "multiselectt3" ||
          subSubTempField.elementConfig.type.toLowerCase() == "multiselectt4" ||
          subSubTempField.elementConfig.type.toLowerCase() == "multiselectt5")
      ) {
        console.log(
          "subConditionalInternaleFields_multiSelectValue_3_isMultiSelect",
          parentSubCondtionKey,
          templateKeyTmp,
          tempValue,
          multiSelectValue,
          subSubTempField,
        );

        multiSelectValue = draftInputDatas[templateKeyTmp]
          ?.split(",")
          .map(function (value) {
            return value.trim();
          })
          .filter(function (i) {
            return i;
          });
        subSubTempField["tempValue"] = multiSelectValue;
        subSubTempField["multiSelectValue"] = multiSelectValue;

        // console.log(
        //   "checkForConditionalFormInputs_subSubTempFormFields_subSubTempField_after_2",
        //   subSubTempField,tempValue
        // );
      }

      if (tempValue != undefined) {
        // console.log(
        //   "checkForConditionalFormInputs_subSubTempFormFields_tempValue",
        //   templateKeyTmp,
        //   tempValue
        // );
        // let tempValue =formsFieldsDataValue.trim();
        // let templateKey=formsFieldsData.elementUId;

        if (subSubTempField.elementType.toLowerCase() === "selectv2") {
          valueKey = tempValue.split(":")[0];
          tempValue = tempValue.split(":")[1];
        }

        console.log(
          "checkForConditionalFormInputs_subSubTempFormFields_subSubTempField.isConditional",
          subSubTempField.isConditional,
        );
        console.log(
          "checkForConditionalFormInputs_subSubTempFormFields_multiSelectValue",
          multiSelectValue,
        );
        // checkForConditionalFormInputs(formsFieldsData,conditionalFormInputs,templateKey)
        // conditionalFormInputs[templateKey]=

        console.log(
          "checkForConditionalFormInputs_subSubTempFormFields_draftInputDatas_value",
          draftInputDatas[templateKeyTmp],
        );

        conditionalFormInputs[templateKeyTmp] = {
          valueKey: valueKey,
          inputValue: tempValue?.trim(),
          input: subSubTempField,
          templateKey: templateKeyTmp,
          multiSelectValue: multiSelectValue,
        };

        console.log(
          "checkForConditionalFormInputs_subSubTempFormFields_conditionalFormInputs",
          conditionalFormInputs,
        );

        tempConditionalFormInputs = checkForConditionalFormInputs(
          subSubTempField,
          conditionalFormInputs,
          templateKeyTmp,
          draftInputDatas,
        );

        console.log(
          "checkForConditionalFormInputs_call",
          "checkForConditionalFormInputs",
        );
        console.log(
          "checkForConditionalFormInputs_tempConditionalFormInputs_forKey",
          templateKeyTmp,
        );
        console.log(
          "checkForConditionalFormInputs_tempConditionalFormInputs_rec",
          tempConditionalFormInputs,
        );
      }
    }
  });

  // return {...conditionalFormInputs,...tempConditionalFormInputs};
  return tempConditionalFormInputs;
};
