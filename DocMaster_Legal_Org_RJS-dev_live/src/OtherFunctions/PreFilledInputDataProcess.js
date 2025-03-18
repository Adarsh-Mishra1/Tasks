//PreFilledInputDataProcess.js
//import React from "react";

export function getPrefilledFiledValue(field, userPrefilledFields, type) {
  // console.log("getPrefilledFiledValue_userPrefilledFields",userPrefilledFields)
  // console.log("getPrefilledFiledValue_field",field)
  let fieldValue = "";
  if (userPrefilledFields.length > 0) {
    userPrefilledFields.map((userPrefilledField, index) => {
      if (type == "org") {
        if (field == userPrefilledField.fieldKey) {
          fieldValue = userPrefilledField.value;
        }
      } else {
        if (field == userPrefilledField.field) {
          fieldValue = userPrefilledField.fieldValue;
        }
      }
    });
  }

  // console.log("getPrefilledFiledValue_fieldValue",fieldValue)
  return fieldValue;
}

export function processPreFilledDataFormInput(
  formsFieldsDataSorted,
  userPrefilledFields,
  userOldFilledRecord,
  type,
) {
  console.log(
    "UserAllPrefilledFields_formsFieldsData_1",
    "------processPreFilledUserData(Start)-----------------",
  );

  console.log(
    "processPreFilledUserDataFormInput_userOldFilledRecord",
    userOldFilledRecord,
  );

  let userOldFilledRecordInputDataJSon = {};

  if (
    userOldFilledRecord != undefined &&
    userOldFilledRecord.inputData != undefined &&
    userOldFilledRecord.inputData != null &&
    userOldFilledRecord.inputData.length > 5
  ) {
    userOldFilledRecordInputDataJSon = JSON.parse(
      userOldFilledRecord.inputData,
    );
  }

  console.log(
    "processPreFilledUserDataFormInput_userPrefilledFields",
    userPrefilledFields,
  );
  console.log(
    "processPreFilledUserDataFormInput_userOldFilledRecordInputDataJSon",
    userOldFilledRecordInputDataJSon,
  );

  if (formsFieldsDataSorted.length > 0) {
    var tempArray = [];
    formsFieldsDataSorted.map((formsFieldsData, index) => {
      console.log(
        "processPreFilledUserDataFormInput_formsFieldsData",
        formsFieldsData,
      );
      let formsFieldsDataValue = getPrefilledFiledValue(
        formsFieldsData.elementUId,
        userPrefilledFields,
        type,
      );
      console.log(
        "processPreFilledUserDataFormInput_formsFieldsDataValue",
        formsFieldsDataValue,
      );

      if (
        formsFieldsDataValue != undefined &&
        formsFieldsDataValue.length > 0
      ) {
        formsFieldsData.value = formsFieldsDataValue;
      }

      let formsFieldsDataValueOld =
        userOldFilledRecordInputDataJSon[formsFieldsData.elementUId];
      //elementUId
      console.log(
        "processPreFilledUserDataFormInput_formsFieldsDataValueOld_for_" +
          formsFieldsData.elementUId,
        formsFieldsDataValueOld,
      );

      if (
        formsFieldsDataValueOld != undefined &&
        formsFieldsDataValueOld.length > 0
      ) {
        console.log(
          "processPreFilledUserDataFormInput_formsFieldsDataValueOld_for_yes_" +
            formsFieldsData.elementUId,
          formsFieldsDataValueOld,
        );
        formsFieldsData.value = formsFieldsDataValueOld;

        console.log(
          "processPreFilledUserDataFormInput_formsFieldsData_withvalue_" +
            formsFieldsData.elementUId,
          formsFieldsData,
        );
      }

      tempArray = formsFieldsDataSorted.map((tableData) =>
        tableData.elementUId === formsFieldsData.elementUId
          ? { ...tableData, formsFieldsData }
          : tableData,
      );
      tempArray[formsFieldsDataSorted.indexOf(formsFieldsData)] =
        formsFieldsData;
    });

    // console.log("UserAllPrefilledFields_tempArray", tempArray);

    if (tempArray.length > 0) {
      //console.log("UserAllPrefilledFields_set", tempArray);
      //this.setState({ formsFieldsDataSorted: tempArray });
      formsFieldsDataSorted = tempArray;
    }
  }

  console.log(
    "processPreFilledUserDataFormInput_formsFieldsDataSorted",
    formsFieldsDataSorted,
  );

  console.log(
    "UserAllPrefilledFields_formsFieldsData_1",
    "------processPreFilledUserData(End)-----------------",
  );

  // console.log(
  //   "UserAllPrefilledFields_formsFieldsData_trrn",
  //   formsFieldsDataSorted
  // );

  return formsFieldsDataSorted;
}

export function processUserPrefilledForTemplate(userPrefilledFields, formdata) {
  //DevNote: Function to Replace Intial FormData value with User Provided Prefilled Input Data as per field
  console.log(
    "UserAllPrefilledFields_replaceTemplateKeyWithFormDataView_",
    userPrefilledFields?.length,
  );
  if (userPrefilledFields?.length > 0) {
    console.log(
      "UserAllPrefilledFields_replaceTemplateKeyWithFormDataView_",
      userPrefilledFields,
    );
    userPrefilledFields.map((userPrefilledField, index) => {
      console.log(
        "UserAllPrefilledFields_userPrefilledField",
        userPrefilledField,
      );
      console.log(
        "UserAllPrefilledFields_formdata[userPrefilledField.field]",
        formdata[userPrefilledField.field],
      );
      if (
        formdata[userPrefilledField.field] == undefined ||
        formdata[userPrefilledField.field].length <= 0
      ) {
        formdata[userPrefilledField.field] = userPrefilledField.fieldValue;
      }
    });
  }
  return formdata;
}
