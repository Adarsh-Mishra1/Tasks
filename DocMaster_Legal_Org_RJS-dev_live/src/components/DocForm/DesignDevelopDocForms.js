//DesignDevelopDocForms.js
import React, { useEffect, useState } from "react";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";

import { Tooltip as ReactTooltip } from "react-tooltip";
// import { Prompt } from "react-router";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import axios from "axios";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import * as XLSX from "xlsx";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import { toast } from "react-toastify";

import { apiKeyHeader } from "../../configs/ApiKeys";
import TinyMce from "./TinyMce";

import AddFormFields from "./AddFormFields";
import DocumentFormFields from "./DocumentFormFields";
import DocmasterCoreTestRunPopUp from "./DocmasterCoreTestRunPopUp";

// import {
//   WSDocFormsConnectionTest,
//   WSPutDocFormTemplateAndInputFields,
//   WSGetDocFormTemplateAndInputFields,
//   WSGetFormFieldsAndTemplateHistory,
// } from "../../configs/WebService";

import {
  WSDocFormsConnectionTest,
  WSGetDocFormFieldsTemplate,
  WSPutDocFormFieldsTemplate,
  WSApproveDocFormFieldAndTemplate,
} from "../../configs/WebService";

import {
  isNetworkAlive,
  processCommaSeperated,
} from "../../OtherFunctions/OtherFunctions";

import {
  RenderInputAsPerType,
  sortFormFields,
} from "../../OtherFunctions/FormRenderingFunctions";
import userStore from "../../zustand/userStore";

const DesignDevelopDocForms = (props) => {
  const userData = userStore((state) => state.user);
  const navigate = useNavigate();

  // const userData = reactLocalStorage.getObject("user_data");
  //console.log("DesignDevelopDocForms" + props.formType, props);
  let [formId, setFormId] = useState(0);
  let [templateLanguage, setTemplateLanguage] = useState(
    props.templateLanguage,
  );
  const [formType, setFormType] = useState(props.formType);
  const [historyModalIsOpen, setHistoryModalIsOpen] = useState(false); //HistoryModal
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [printSettingModalIsOpen, setPrintSettingModalIsOpen] = useState(false);
  const [pagePrintMarginLeft, setPagePrintMarginLeft] = useState(0);
  const [pagePrintMarginRight, setPagePrintMarginRight] = useState(0);
  const [pagePrintMarginTop, setPagePrintMarginTop] = useState(0);
  const [pagePrintMarginBottom, setPagePrintMarginBottom] = useState(0);
  const [pageType, setPageType] = useState("A4");

  const [formIsHalfFilledOut, setFormIsHalfFilledOut] = useState(false);
  //console.log("formsFieldsData2", formsFieldsData2);
  let formsFieldsDataDefault = {
    printMarginLeft: 2,
    printMarginRight: 2,
    printMarginTop: 2,
    printMarginBottom: 2,
    pageType: "a4",
    errorTextColor: "pink",
    formFields: {},
  };

  const [templateHistories, setTemplateHistories] = useState([]);
  const [formFieldHistories, setFormFieldHistories] = useState([]);

  //const [inputFields, setInputFields] = useState([]);
  const [inputFieldsChangeCount, setInputFieldsChangeCount] = useState(0);
  let sampleFormDataForEditor = "Hello User Type Form/Document Content here.";
  //const [formSample, setFormSample] = useState("");
  //const [formPreviewSample, setFormPreviewSample] = useState("");
  // console.log(
  //   "DesignDevelopDocForms" + props.formType,
  //   "DesignDevelopDocForms"
  // );
  //console.log("mainDocumentFormField", props.mainDocumentFormField);
  if (props.formType === "subform") {
    console.log("subform_formFieldValue_", props.formFieldValue);
    //for Sub Forms
    if (props.mainDocumentFormField != null) {
      if (props.mainDocumentFormField.isConditional == true) {
        console.log("mainDocumentFormField", "Is Conditional");
        console.log(
          "mainDocumentFormField",
          props.mainDocumentFormField.condition.conditionType,
        );

        //Loading editor with Old Data
        //setEditorState(EditorState.createWithContent(stateFromHTML(props.mainDocumentFormField.condition.subFormTemplate)));
        if (props.mainDocumentFormField.elementType == "copyOfInput") {
          //ToDo: Process final Adding of Sub Conditional Statement in copyOfInput
          console.log(
            "copyOfInput_conditional_props.mainDocumentFormField.condition",
            props.mainDocumentFormField.condition,
          );
          console.log(
            "copyOfInput_conditional_props.formFieldValue",
            props.formFieldValue,
          );

          if (
            props.formFieldValue != undefined &&
            props.formFieldValue != null &&
            props.formFieldValue.trim().length > 0
          ) {
            console.log("copyOfInput_conditional_type", "ValueBased");

            if (
              props.mainDocumentFormField.condition.conditionStatements[
                props.formFieldValue
              ] != undefined
            ) {
              formId =
                props.mainDocumentFormField.condition.conditionStatements[
                  props.formFieldValue
                ].subFormId;
              formsFieldsDataDefault =
                props.mainDocumentFormField.condition.conditionStatements[
                  props.formFieldValue
                ].subFormFields; //setFormsFieldsData()
              sampleFormDataForEditor =
                props.mainDocumentFormField.condition.conditionStatements[
                  props.formFieldValue
                ].subFormTemplate;
            }
          } else {
            console.log("copyOfInput_conditional_type", "Populate");
            // formId = props.formId;
            // formsFieldsDataDefault = props.documentFormFieldsData;
            // sampleFormDataForEditor = props.documentFormTemplateData;

            formId = props.mainDocumentFormField.condition.subFormId;
            formsFieldsDataDefault =
              props.mainDocumentFormField.condition.subFormFields; //setFormsFieldsData()
            sampleFormDataForEditor =
              props.mainDocumentFormField.condition.subFormTemplate;
          }
        } else if (
          props.mainDocumentFormField.elementType.toLowerCase() == "select" ||
          props.mainDocumentFormField.elementType.toLowerCase() == "radio" ||
          props.mainDocumentFormField.elementType.toLowerCase() == "datalist"
        ) {
          console.log(
            "mainDocumentFormFieldChoice",
            props.mainDocumentFormField.condition,
          );
          console.log("formFieldValue", props.formFieldValue);

          console.log(
            "props.formFieldValue",
            props.mainDocumentFormField.condition.conditionStatements[
              props.formFieldValue
            ],
          );

          if (
            props.mainDocumentFormField.condition.conditionStatements[
              props.formFieldValue
            ] != undefined
          ) {
            formId =
              props.mainDocumentFormField.condition.conditionStatements[
                props.formFieldValue
              ].subFormId;
            formsFieldsDataDefault =
              props.mainDocumentFormField.condition.conditionStatements[
                props.formFieldValue
              ].subFormFields; //setFormsFieldsData()
            sampleFormDataForEditor =
              props.mainDocumentFormField.condition.conditionStatements[
                props.formFieldValue
              ].subFormTemplate;
          }

          console.log(
            "------------------------------------------------------------------------------------------------------------",
          );
          console.log("formId", formId);
          console.log("formsFieldsDataDefault", formsFieldsDataDefault);
          console.log("sampleFormDataForEditor", sampleFormDataForEditor);
          console.log(
            "------------------------------------------------------------------------------------------------------------",
          );
          /*this.state.formsFieldsData.formFields[formFieldKey].isConditional = true;
          this.state.formsFieldsData.formFields[
            formFieldKey
          ].condition.conditionType = "ValueBased";

          // this.state.formsFieldsData.formFields[
          //   formFieldKey
          // ].condition.conditionStatements[formFieldSelectedValue][subFormId] = subFormId;
          
          this.state.formsFieldsData.formFields[
            formFieldKey
          ].condition.conditionStatements[formFieldSelectedValue] = {"subFormId":subFormId,"subFormTemplate":subFormTemplate,"subFormFields":subFormFields};
          
          */
          /*
          formId=props.mainDocumentFormField[
          props.formFieldKey
        ].condition.conditionStatements[formFieldSelectedValue]
        */
        } else if (
          props.mainDocumentFormField.elementType.toLowerCase() == "checkbox" &&
          (props.mainDocumentFormField.elementConfig.type.toLowerCase() ==
            "multiselectt1" ||
            props.mainDocumentFormField.elementConfig.type.toLowerCase() ==
              "multiselectt2" ||
            props.mainDocumentFormField.elementConfig.type.toLowerCase() ==
              "multiselectt3" ||
            props.mainDocumentFormField.elementConfig.type.toLowerCase() ==
              "multiselectt4" ||
            props.mainDocumentFormField.elementConfig.type.toLowerCase() ==
              "multiselectt5")
        ) {
          //AddedOn: 13-12-2021
          console.log("MultiSelectCheckBoxCondi_");
          console.log(
            "MultiSelectCheckBoxCondi_mainDocumentFormField.condition",
            props.mainDocumentFormField.condition,
          );
          console.log(
            "MultiSelectCheckBoxCondi_formFieldValue",
            props.formFieldValue,
          );
          console.log(
            "MultiSelectCheckBoxCondi_conditionStatements",
            props.mainDocumentFormField.condition.conditionStatements,
          );
          //Getting Already Set Condition Data/Content for Field
          if (
            props.mainDocumentFormField.condition.conditionStatements[
              props.formFieldValue
            ] != undefined
          ) {
            formId =
              props.mainDocumentFormField.condition.conditionStatements[
                props.formFieldValue
              ].subFormId;
            formsFieldsDataDefault =
              props.mainDocumentFormField.condition.conditionStatements[
                props.formFieldValue
              ].subFormFields; //setFormsFieldsData()
            sampleFormDataForEditor =
              props.mainDocumentFormField.condition.conditionStatements[
                props.formFieldValue
              ].subFormTemplate;
          }
        } else {
          console.log(
            "mainDocumentFormField",
            props.mainDocumentFormField.condition.subFormId,
          );
          console.log(
            "mainDocumentFormField",
            props.mainDocumentFormField.condition.subFormTemplate,
          );
          console.log(
            "mainDocumentFormField",
            props.mainDocumentFormField.condition.subFormFields,
          );

          formId = props.mainDocumentFormField.condition.subFormId;
          formsFieldsDataDefault =
            props.mainDocumentFormField.condition.subFormFields; //setFormsFieldsData()
          sampleFormDataForEditor =
            props.mainDocumentFormField.condition.subFormTemplate;
        }
      } else {
        console.log("mainDocumentFormField", "Is Not Conditional Yet");
      }
    }
  } else {
    //console.log("mainDocumentFormField from Main Form");
    console.log("mainDocumentFormField", props.documentFormFieldsData);
    formId = props.formId;
    formsFieldsDataDefault = props.documentFormFieldsData;
    sampleFormDataForEditor = props.documentFormTemplateData;
  }

  let [formsFieldsData, setFormsFieldsData] = useState(formsFieldsDataDefault);
  const [editorContent, setEditorContent] = useState(sampleFormDataForEditor);

  function onUploadDocumentFormFieldsSubmit(formFields) {
    console.log("onUploadDocumentFormFieldsSubmit", formFields);
    formFields.forEach((formField) => {
      processAndAddUploadedField(formField);
    });
  }

  function onDownloadDocumentFormFieldsSubmit() {
    //sortFormFields
    //const sortedFormFields=sortFormFields(formsFieldsData.formFields)
    //console.log("onDownloadDocumentFormFieldsSubmit", "Called");
    //console.log("onDownloadDocumentFormFieldsSubmit_formsFieldsData", formsFieldsData.formFields);
    //console.log("onDownloadDocumentFormFieldsSubmit_formsFieldsData_sortFormFields",sortFormFields(formsFieldsData.formFields));
    /*
    formFields.forEach((formField) => {
      processAndAddUploadedField(formField);
    });
    */
    /*
    console.log("onDownloadDocumentFormFieldsSubmit_data", data);
    console.log(
      "onDownloadDocumentFormFieldsSubmit_data",
      Object.prototype.toString.call(data)
    );
    */
    let data2Export = processFormFields2Export(
      sortFormFields(formsFieldsData.formFields),
    );
    /*
    console.log("onDownloadDocumentFormFieldsSubmit_data2Export", data2Export);
    console.log(
      "onDownloadDocumentFormFieldsSubmit_data2Export",
      Object.prototype.toString.call(data2Export)
    );
    */
    const fileName = "formfields_" + props.formId + "_" + props.formType;

    if (Array.isArray(data2Export)) {
      const sheetName = "formfields_" + props.formId;
      var workSheet = XLSX.utils.json_to_sheet(data2Export, { header: false });
      var wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, workSheet, sheetName);
      var bin = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
      let url = window.URL.createObjectURL(
        new Blob([sheetData2Buffer(bin)], { type: "application/octet-stream" }),
      );
      downloadExcelFile(url, fileName + ".xlsx");
    } else {
      console.log("onDownloadDocumentFormFieldsSubmit", "Not A Array");
    }
  }

  function sheetData2Buffer(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);

    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;

    return buf;
  }

  const downloadExcelFile = (url, name) => {
    let a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  function processFormFields2Export(formFields) {
    console.log("processFormFields2Export", formFields);

    let formsFields2Exp = [];

    formFields.map((formField) => {
      //let tempObject={}
      //tempObject["fieldName"]=formField.elementUId;
      //tempObject["label"]=formField.elementConfig.inputLabel
      //formsFields2Exp.push(tempObject);
      //console.log(tempObject)
      //-----------------------------------------
      //sequence
      //fieldName
      //label
      //fieldType
      //fieldValueType
      //placeholder
      //tooltip
      //values
      //max
      //min
      //isRequired
      //isHidden
      //isGlobal
      //------------------------------------------

      let objectKey = formField.elementUId.replace(/\s/g, "").toLowerCase();

      let fIsRequired = "no";
      if (formField.inputIsRequired == true) {
        fIsRequired = "yes";
      }

      let fIsHidden = "no";
      if (formField.isHidden == true) {
        fIsHidden = "yes";
      }

      let fIsGlobal = "no";
      if (formField.isGlobal == true) {
        fIsGlobal = "yes";
        objectKey = formField.elementUId.replace("glbl_", "");
      }

      formsFields2Exp.push({
        sequence: formField.sequence,
        fieldName: objectKey,
        label: formField.elementConfig.inputLabel,
        fieldType: formField.elementType,
        fieldValueType: formField.elementConfig.type,
        placeholder: formField.elementConfig.placeholder,
        tooltip: formField.elementConfig.tooltips,
        values: formField.value,
        max: formField.validation.maxLength,
        min: formField.validation.minLength,
        isRequired: fIsRequired,
        isHidden: fIsHidden,
        isGlobal: fIsGlobal,
      });
    });
    //console.log("processFormFields2Export_", formsFieldsDataSortedTemp);
    return formsFields2Exp;
  }

  function processFormFields2Export2(formFields) {
    let formsFields2Exp = [];

    formFields.map((formField) => {
      /*
        let tempObject={
           fieldName:formField.elementUId,
          label: formField.elementConfig.inputLabel
        }
        */
      let tempObject = [];
      tempObject.push(formField.elementUId);
      tempObject.push(formField.elementConfig.inputLabel);
      //let tempObject={}
      //tempObject["fieldName"]=formField.elementUId;
      //tempObject["label"]=formField.elementConfig.inputLabel
      formsFields2Exp.push(tempObject);
      //console.log(tempObject)
    });
    //console.log("processFormFields2Export_", formsFieldsDataSortedTemp);
    return formsFields2Exp;
  }

  function processAndAddUploadedField(inputField) {
    console.log("processAndAddUploadedField_inputField", inputField);
    let proceed = true;
    let fieldElement4 = {};

    if (inputField.fieldName == undefined || inputField.fieldName.length <= 0) {
      window.alert("Provide FieldName for" + inputField.fieldName);
      proceed = false;
    }

    if (inputField.label == undefined || inputField.label.length <= 0) {
      inputField.label = "";
    }

    if (inputField.fieldType == undefined || inputField.fieldType.length <= 0) {
      inputField.fieldType = "Input";
    }

    if (
      inputField.fieldValueType == undefined ||
      inputField.fieldValueType.length <= 0
    ) {
      inputField.fieldValueType = "Text";
    }

    if (
      inputField.placeholder == undefined ||
      inputField.placeholder.length <= 0
    ) {
      inputField.placeholder = "";
    }

    if (inputField.tooltip == undefined || inputField.tooltip.length <= 0) {
      inputField.tooltip = "";
    }

    if (inputField.max == undefined || inputField.max.length <= 0) {
      inputField.max = 40;
    }

    if (inputField.min == undefined || inputField.min.length <= 0) {
      inputField.min = 4;
    }

    if (
      inputField.isRequired == undefined ||
      inputField.isRequired.length <= 0
    ) {
      inputField.isRequired = "Yes";
    }

    if (inputField.isHidden == undefined || inputField.isHidden.length <= 0) {
      inputField.isHidden = "No";
    }

    if (inputField.isGlobal == undefined || inputField.isGlobal.length <= 0) {
      inputField.isGlobal = "No";
    }

    if (inputField.fieldType.toLowerCase() == "dropdown") {
      inputField.fieldType = "Select";
    }

    inputField.fieldValueType = inputField.fieldValueType
      .replace(/\s/g, "")
      .toLowerCase();

    /*
    if(inputField.fieldValueType.replace(/\s/g, "").toLowerCase()=="daystring"){
      inputField.fieldValueType="daystring"
    }

    if(inputField.fieldValueType.replace(/\s/g, "").toLowerCase()=="monthstring"){
      inputField.fieldValueType="monthstring" 
    }
    */
    if (
      inputField.fieldType.toLowerCase() == "select" ||
      inputField.fieldType.toLowerCase() == "radio" ||
      inputField.fieldType.toLowerCase() == "datalist"
    ) {
      if (inputField.fieldValueType == "text") {
        var inputValuesTemp = inputField.values.split(",");
        if (inputValuesTemp.length <= 1) {
          window.alert("Provide Values for" + inputField.fieldName);
          proceed = false;
        }
      }
    }

    if (inputField.isGlobal.toLowerCase() == "yes") {
      inputField.isGlobal = true;
    } else {
      inputField.isGlobal = false;
    }

    if (inputField.isRequired.toLowerCase() == "yes") {
      inputField.isRequired = true;
    } else {
      inputField.isRequired = false;
    }

    if (inputField.isHidden.toLowerCase() == "yes") {
      inputField.isHidden = true;
    } else {
      inputField.isHidden = false;
    }

    if (inputField.values == undefined) {
      inputField.values = "";
    }

    console.log("processAndAddUploadedField_inputField", inputField);

    if (proceed == true) {
      let objectKey = inputField.fieldName.replace(/\s/g, "").toLowerCase();

      if (inputField.isGlobal == true) {
        objectKey =
          "glbl_" + inputField.fieldName.replace(/\s/g, "").toLowerCase();
      }

      if (
        inputField.fieldType.toLowerCase() == "select" ||
        inputField.fieldType.toLowerCase() == "radio" ||
        inputField.fieldType.toLowerCase() == "datalist"
      ) {
        fieldElement4[objectKey] = {
          sequence: inputField.sequence,
          isHidden: inputField.isHidden,
          isGlobal: inputField.isGlobal,
          isConditional: false,
          condition: { conditionStatements: {} },
          elementUId: objectKey,
          elementType: inputField.fieldType,
          elementConfig: {
            type: inputField.fieldValueType,
            placeholder: inputField.placeholder,
            tooltips: inputField.tooltip,
            inputNameTitle: inputField.fieldName,
            inputLabel: inputField.label,
          },
          value: processCommaSeperated(inputField.values),
          validation: {
            required: true,
            minLength: inputField.min,
            maxLength: inputField.max,
            isNumeric: false,
            error: "",
          },
          inputIsRequired: inputField.isRequired,
          valid: false,
          touched: false,
        };
      } else {
        fieldElement4[objectKey] = {
          sequence: inputField.sequence,
          isHidden: inputField.isHidden,
          isGlobal: inputField.isGlobal,
          isConditional: false,
          condition: {},
          elementUId: objectKey,
          elementType: inputField.fieldType,
          elementConfig: {
            type: inputField.fieldValueType,
            placeholder: inputField.placeholder,
            tooltips: inputField.tooltip,
            inputNameTitle: inputField.fieldName,
            inputLabel: inputField.label,
          },
          value: processCommaSeperated(inputField.values),
          validation: {
            required: true,
            minLength: inputField.min,
            maxLength: inputField.max,
            isNumeric: false,
            error: "",
          },
          inputIsRequired: inputField.isRequired,
          valid: false,
          touched: false,
        };
      }
    }

    if (fieldElement4 != undefined) {
      console.log("fieldElement4", fieldElement4);
      onAddDocumentFormFieldsSubmitV2(fieldElement4);
      setInputFieldsChangeCount(inputFieldsChangeCount + 1);
    }
    //props.onAddDocumentFormFieldsSubmit(fieldElement4);
    //setInputFieldsChangeCount(inputFieldsChangeCount + 1);
    console.log("formsFieldsData.formFields", formsFieldsData.formFields);
    setFormsFieldsData(formsFieldsData);
    setInputFieldsChangeCount(inputFieldsChangeCount + 2);
  }

  function onAddDocumentFormFieldsSubmitV2(formField) {
    console.log("onAddDocumentFormFieldsSubmit", formField);
    var formFieldKey = Object.keys(formField).map(function (key) {
      //console.log("DesignDevelopDocForms"+props.formType, key);
      return key;
    });

    if (formsFieldsData.formFields.hasOwnProperty(formFieldKey)) {
      //Use This in case you want to Update Existing
      //console.log("DesignDevelopDocForms" + props.formType, "hasOwnProperty");
      window.alert(
        "Input Field with this Name/Title Already exist, Check Input Field Created!",
      );
    } else {
      //console.log("onAddDocumentFormFieldsSubmit", "Don't hasOwnProperty");
      formsFieldsData.formFields = Object.assign(
        formsFieldsData.formFields,
        formField,
      );
    }
  }

  function onAddDocumentFormFieldsSubmit(formField) {
    console.log("onAddDocumentFormFieldsSubmit", formField);
    var formFieldKey = Object.keys(formField).map(function (key) {
      //console.log("DesignDevelopDocForms"+props.formType, key);
      return key;
    });

    if (formsFieldsData.formFields.hasOwnProperty(formFieldKey)) {
      //Use This in case you want to Update Existing
      //console.log("DesignDevelopDocForms" + props.formType, "hasOwnProperty");
      window.alert(
        "Input Field with this Name/Title Already exist, Check Input Field Created!",
      );
    } else {
      //console.log("onAddDocumentFormFieldsSubmit", "Don't hasOwnProperty");
      formsFieldsData.formFields = Object.assign(
        formsFieldsData.formFields,
        formField,
      );
      setFormsFieldsData(formsFieldsData);
      //inputFieldsChangeCount=inputFieldsChangeCount+1;
      setInputFieldsChangeCount(inputFieldsChangeCount + 1);
    }
  }

  function onInputFormFieldsDelete(formField) {
    //console.log("onInputFormFieldsDelete", formField);
    {
      console.log("/////////////////////////////////////", formField);
    }
    var formFieldKey = Object.keys(formField).map(function (key) {
      //console.log("DesignDevelopDocForms"+props.formType, key);
      return key;
    });
    //console.log("onInputFormFieldsDelete", formField.elementUId);
    if (
      window.confirm("Are you sure you want to delete this Input Field?") ===
      true
    ) {
      delete formsFieldsData.formFields[formField.elementUId];

      setFormsFieldsData(formsFieldsData);
      //inputFieldsChangeCount=inputFieldsChangeCount+1;
      setInputFieldsChangeCount(inputFieldsChangeCount + 1);
    }
  }

  function DeleteAllFields(formField) {
    //console.log("onInputFormFieldsDelete", formField);
    var formFieldKey = Object.keys(formField).map(function (key) {
      //console.log("DesignDevelopDocForms"+props.formType, key);
      return key;
    });
    //console.log("onInputFormFieldsDelete", formField.elementUId);
    if (
      window.confirm("Are you sure you want to delete all Input Fields?") ===
      true
    ) {
      delete formsFieldsData.formFields[formField];

      setFormsFieldsData(formsFieldsData);
      //inputFieldsChangeCount=inputFieldsChangeCount+1;
      setInputFieldsChangeCount(inputFieldsChangeCount + 1);
    }
  }

  // function onEditorStateChange(editState) {
  //   setEditorState(editState);
  //   setFormSample(draftToHtml(convertToRaw(editorState.getCurrentContent())));
  // }

  function onTemplateSaveButonAction(saveAndGo, submitForApproval) {
    console.log(
      "DesignDevelopDocForms" + props.formType,
      "onTemplateSaveButonAction",
    );
    //content
    //let templateContent=draftToHtml(convertToRaw(editorState.getCurrentContent()));//Old
    let templateContent = editorContent;
    if (props.formType.toLowerCase() === "subform") {
      const subFormId = 0; //Test
      const conditionType = "populate"; // "populate"{populate n numbers of time based on Numeric value entered},"specific":{show a specific form}
      //setFormIsHalfFilledOut(true);
      props.onConditionalFormCreate(
        props.mainDocumentFormField,
        props.formFieldkey,
        props.formFieldValue,
        subFormId,
        templateContent,
        formsFieldsData,
        conditionType,
      );
    } else {
      toast.info("Checking Connection...", { autoClose: 50 });

      if (isNetworkAlive() == true) {
        fetch(WSDocFormsConnectionTest, {
          // Check for internet connectivity
          mode: "no-cors",
        })
          .then(() => {
            submitDocFormFieldsAndTemplate(saveAndGo, submitForApproval);
          })
          .catch(() => {
            alert(
              "Check Connection to Server Network! Stay in This Page Until Network Problem Resolved, Do not Click on Save Button before Connection Reinitiated",
            );
          });
      } else {
        alert(
          "Check Network! Stay in This Page Until Network Problem Resolved, Do not Click on Save Button before Network Reinitiated",
        );
      }
    }
  }

  function submitDocFormFieldsAndTemplate(saveAndGo, submitForApproval) {
    if (submitForApproval == 1) {
      //ToDo Process call /approveDocFormFieldAndTemplate
      approveDocFormFieldsAndTemplate(saveAndGo, submitForApproval);
    } else {
      saveDocFormFieldsAndTemplate(saveAndGo, submitForApproval);
    }
  }

  function saveDocFormFieldsAndTemplate(saveAndGo, submitForApproval) {
    setFormIsHalfFilledOut(false);

    toast.success("Submitting...", { autoClose: 50 });

    let docFormTemplateData = editorContent;
    let docFormsFieldsData = formsFieldsData;

    if (
      docFormTemplateData == null ||
      docFormTemplateData == undefined ||
      docFormTemplateData == "" ||
      docFormsFieldsData == undefined ||
      Object.keys(docFormsFieldsData).length === 0 ||
      docFormsFieldsData == "" ||
      docFormsFieldsData.formFields == undefined ||
      Object.keys(docFormsFieldsData.formFields).length === 0 ||
      docFormsFieldsData.formFields == ""
    ) {
      if (
        docFormTemplateData == null ||
        docFormTemplateData == undefined ||
        docFormTemplateData == ""
      ) {
        window.alert("Can't Save Empty Data, Provide template data");
      } else if (
        docFormsFieldsData == undefined ||
        Object.keys(docFormsFieldsData).length === 0 ||
        docFormsFieldsData == "" ||
        docFormsFieldsData.formFields == undefined ||
        Object.keys(docFormsFieldsData.formFields).length === 0 ||
        docFormsFieldsData.formFields == ""
      ) {
        window.alert(
          "Can't Save Empty Data, Provide Field data, Create atleast one Form field to save this",
        );
      } else {
        window.alert("Can't Save Empty Data");
      }
    } else {
      const formData = new FormData();
      //formData.append("action", "put_doc_form_template_n_fields");
      formData.append("userId", userData.id);
      formData.append("orgFormId", props.formId);
      formData.append("template", docFormTemplateData);
      formData.append("formFields", JSON.stringify(docFormsFieldsData));

      // formData.append("submitForApproval", submitForApproval);
      // formData.append("templateLanguage", templateLanguage);

      console.log("saveDocFormFieldsAndTemplate_template", docFormTemplateData);
      console.log(
        "saveDocFormFieldsAndTemplate_formFields",
        docFormsFieldsData,
      );
      console.log("saveDocFormFieldsAndTemplate_formId", props.formId);
      axios
        .post(WSPutDocFormFieldsTemplate, formData, {
          headers: apiKeyHeader(),
        })
        .then((response) => {
          const responseData = response.data;
          console.log(
            "saveDocFormFieldsAndTemplate_responseData",
            responseData,
          );
          if (responseData.result_code === 1) {
            goToPage(formId, submitForApproval, saveAndGo);
          } else {
            toast.warn(responseData.result_message, {
              autoClose: 50,
            });
            //console.log("", "else ".responseData.result_message);
          }
        })
        .catch((error) => {
          console.error("saveDocFormFieldsAndTemplate_error", error);
          toast.error(error, { position: "bottom-center" });
        });
    }
  }

  function approveDocFormFieldsAndTemplate(saveAndGo, submitForApproval) {
    setFormIsHalfFilledOut(false);

    toast.success("Submitting...", { autoClose: 50 });

    let docFormTemplateData = editorContent;
    let docFormsFieldsData = formsFieldsData;

    if (
      docFormTemplateData == null ||
      docFormTemplateData == undefined ||
      docFormTemplateData == "" ||
      docFormsFieldsData == undefined ||
      Object.keys(docFormsFieldsData).length === 0 ||
      docFormsFieldsData == "" ||
      docFormsFieldsData.formFields == undefined ||
      Object.keys(docFormsFieldsData.formFields).length === 0 ||
      docFormsFieldsData.formFields == ""
    ) {
      if (
        docFormTemplateData == null ||
        docFormTemplateData == undefined ||
        docFormTemplateData == ""
      ) {
        window.alert("Can't Save Empty Data, Provide template data");
      } else if (
        docFormsFieldsData == undefined ||
        Object.keys(docFormsFieldsData).length === 0 ||
        docFormsFieldsData == "" ||
        docFormsFieldsData.formFields == undefined ||
        Object.keys(docFormsFieldsData.formFields).length === 0 ||
        docFormsFieldsData.formFields == ""
      ) {
        window.alert(
          "Can't Save Empty Data, Provide Field data, Create atleast one Form field to save this",
        );
      } else {
        window.alert("Can't Save Empty Data");
      }
    } else {
      /*
      [Raw-JSON]
      adminUserId:number,
      docFormId:number,
      option:number (0|1)
      */
      axios
        .post(
          WSApproveDocFormFieldAndTemplate,
          JSON.stringify({
            adminUserId: userData.id,
            docFormId: props.docForm.id,
            option: 1,
          }),
          {
            headers: apiKeyHeader(),
          },
        )
        .then((response) => {
          const responseData = response.data;
          console.log(
            "approveDocFormFieldsAndTemplate_responseData",
            responseData,
          );
          if (responseData.result_code === 1) {
            goToPage(formId, submitForApproval, saveAndGo);
          } else {
            toast.warn(responseData.result_message, {
              autoClose: 50,
            });
          }
        })
        .catch((error) => {
          console.error("approveDocFormFieldsAndTemplate_error", error);
          toast.error(error, { position: "bottom-center" });
        });
    }
  }

  function goToPage(formId, submitForApproval, saveAndGo) {
    if (saveAndGo == 1) {
      if (submitForApproval == 0) {
        navigate("/docFormShowAll");
      } else {
        navigate("/docFormView", {
          state: {
            docForm: props.docForm,
          },
        });
      }
    } else {
      //ToDo: refresh Page
      window.location.reload();
    }
  }

  function testRunTemplateOnPopUpAction(onOtherPage) {
    if (onOtherPage == 1) {
      //setModalIsOpen(true);
      window.open("/docFormTestRun?formId=" + formId, "_blank");
    } else {
      setModalIsOpen(true);
    }
  }

  function onDocFormInputFieldChangeHandler(formsFieldsData) {
    //console.log("onDocFormInputFieldChangeHandler", formsFieldsData);
    setFormsFieldsData(formsFieldsData);
    setInputFieldsChangeCount(inputFieldsChangeCount + 1);
  }

  useEffect(() => {
    //console.log("*----useEffect----*");
    console.log("isNetworkAlive", isNetworkAlive());
    //history.pushState(null, null, null);
    //toast.success("Loading Please Wait...", { position: "bottom-center" });
    console.log("props.formType", props.formType);
    if (props.formType === "subform") {
    } else {
      console.log("----fetchDocFormTemplateAndFormFields2----");
      toast.info("Checking Connection...", { autoClose: 50 });
      if (isNetworkAlive() == false) {
        alert("Please Check Network");
      } else {
        fetchDocFormTemplateAndFormFields(); //Fetch History Data with This
      }
    }
  }, []);

  useEffect(() => {
    console.log("*----useEffect----*");
    //history.pushState(null, null, null);
    //toast.success("Loading Please Wait...", { position: "bottom-center" });
    console.log("formIsHalfFilledOut", formIsHalfFilledOut);
    if (formIsHalfFilledOut) {
      window.onbeforeunload = () => true;
    } else {
      window.onbeforeunload = undefined;
    }
  }, [formIsHalfFilledOut]);

  function fetchDocFormTemplateAndFormFields() {
    toast.success("Loading Document Form Template & Fields Please Wait ...", {
      autoClose: 50,
    });

    // const formParamsFormFieldsAndTemplate = JSON.stringify({
    //   //fetch_doc_form_template_n_fields
    //   formId: props.formId,
    //   templateLanguage: templateLanguage,
    //   adminUserId: userData.id,
    // });

    const requestFormFieldsAndTemplate = axios.get(
      WSGetDocFormFieldsTemplate + "/" + userData.id + "/" + props.formId,
      {
        headers: apiKeyHeader(),
      },
    );

    // const requestFormFieldsAndTemplateHistory = axios.post(
    //   WSGetFormFieldsAndTemplateHistory,
    //   formParamsFormFieldsAndTemplate,
    //   {
    //     headers: apiKeyHeader(),
    //   }
    // );

    axios
      .all([requestFormFieldsAndTemplate])
      .then(
        axios.spread((...responses) => {
          const responseFormFieldsAndTemplate = responses[0];
          // const responseFormFieldsAndTemplateHistory = responses[1];
          const responseFormFieldsAndTemplateData =
            responseFormFieldsAndTemplate.data;
          //console.log("formsFieldsData_response",formsFieldsData)
          /*console.log(
            "forms_fields_response",
            responseFormFieldsAndTemplateData.forms_fields
          );
          */
          const formsFieldsDataTemp =
            responseFormFieldsAndTemplateData.result_message.fields;

          if (
            Object.keys(formsFieldsDataTemp).length === 0 &&
            formsFieldsDataTemp.constructor === Object
          ) {
            console.log("formsFieldsData_response", "No Data");
          } else {
            formsFieldsData = formsFieldsDataTemp;
            //formsFieldsData=utf8.decode(formsFieldsData)
            setFormsFieldsData(formsFieldsData);
            setPagePrintMarginLeft(formsFieldsData.printMarginLeft);
            setPagePrintMarginRight(formsFieldsData.printMarginRight);
            setPagePrintMarginTop(formsFieldsData.printMarginTop);
            setPagePrintMarginBottom(formsFieldsData.printMarginBottom);
            setPageType(formsFieldsData.pageType);
            //console.log("formsFieldsData_response", formsFieldsData);
          }

          if (
            responseFormFieldsAndTemplateData.result_message.template.length > 2
          ) {
            setEditorContent(
              responseFormFieldsAndTemplateData.result_message.template,
            );
            setInputFieldsChangeCount(inputFieldsChangeCount + 2);
          }

          //Setting History of Template and Form Fields
          // const responseFormFieldsAndTemplateHistoryData =
          //   responseFormFieldsAndTemplateHistory.data;
          // console.log(
          //   "responseFormFieldsAndTemplateHistoryData",
          //   responseFormFieldsAndTemplateHistoryData
          // );
          // setTemplateHistories(
          //   responseFormFieldsAndTemplateHistoryData.forms_templates
          // );
          // setFormFieldHistories(
          //   responseFormFieldsAndTemplateHistoryData.forms_fields
          // );
        }),
      )
      .catch((errors) => {
        // react on errors.
        console.log("errors", errors);
      });

    /*
    axios
      .post(WSGetDocFormTemplateAndInputFields, formParams, {
        headers: apiKeyHeader(),
      })
      .then((response) => {
        console.log("FormFieldTemplate_response", response.data);
        
        const responseData = response.data;
        //console.log("formsFieldsData_response",formsFieldsData)
        console.log("forms_fields_response", responseData.forms_fields);
        const formsFieldsDataTemp = responseData.forms_fields;

        if (
          Object.keys(formsFieldsDataTemp).length === 0 &&
          formsFieldsDataTemp.constructor === Object
        ) {
          console.log("formsFieldsData_response", "No Data");
        } else {
          formsFieldsData = formsFieldsDataTemp;
          //formsFieldsData=utf8.decode(formsFieldsData)
          setFormsFieldsData(formsFieldsData);
          setPagePrintMarginLeft(formsFieldsData.printMarginLeft);
          setPagePrintMarginRight(formsFieldsData.printMarginRight);
          setPagePrintMarginTop(formsFieldsData.printMarginTop);
          setPagePrintMarginBottom(formsFieldsData.printMarginBottom);
          setPageType(formsFieldsData.pageType);
          console.log("formsFieldsData_response", formsFieldsData);
        }
        
        if (responseData.forms_templates.length > 2) {
          setEditorContent(responseData.forms_templates);
          setInputFieldsChangeCount(inputFieldsChangeCount + 2);
        }
      })
      .catch((error) => {
        console.log("", "error " + error);
      });
      */
  }

  function onEditorChange(content) {
    //console.log("onEditorChange_Main", content);
    setFormIsHalfFilledOut(true);
    setEditorContent(content);
  }

  function inputTemplateUploadChangeHandler(e) {
    console.log("-inputTemplateUploadChangeHandler-", e);
    let inTarget = e.target;
    const files = e.target.files;
    console.log("-inputTemplateUploadChangeHandler-_files", files);
    console.log("-inputTemplateUploadChangeHandler-_files_name", files[0].name);

    var file = files[0];
    var reader = new FileReader();
    var mammoth = require("mammoth");
    let templateData2Use = "";
    reader.onloadend = function (event) {
      console.log("-inputTemplateUploadChangeHandler-onloadend", "onloadend");
      var arrayBuffer = reader.result;
      console.log("-inputTemplateUploadChangeHandler-arrayBuffer", arrayBuffer);
      // debugger
      mammoth
        .convertToHtml({ arrayBuffer: arrayBuffer })
        .then(function (resultObject) {
          //result1.innerHTML = resultObject.value
          console.log("convertToHtml");
          console.log(resultObject.value);
          setEditorContent(resultObject.value);
        });

      /*
      mammoth.extractRawText({arrayBuffer: arrayBuffer}).then(function (resultObject) {
        //result2.innerHTML = resultObject.value
        console.log("extractRawText")
        console.log(resultObject.value)
        templateData2Use=resultObject.value
        //setEditorContent(templateData2Use)
      })
      */
      /*
      mammoth.convertToMarkdown({arrayBuffer: arrayBuffer}).then(function (resultObject) {
        //result3.innerHTML = resultObject.value
        console.log("convertToMarkdown")
        console.log(resultObject.value)
      })
      */
    };
    reader.readAsArrayBuffer(file);
    /*var mammoth = require("mammoth");
    mammoth.extractRawText({path: files[0].name})
    .then(function(result){
        var text = result.value; // The raw text
        var messages = result.messages;
    })
    .done();
    */
    /*if (typeof FileReader !== "undefined") {
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
    */
  }

  // Create a reference to the hidden file input element
  const hiddenTemplateFileInput = React.useRef(null);

  // Programatically click the hidden file input element
  // when the Button component is clicked
  const handleClick = (event) => {
    hiddenTemplateFileInput.current.click();
  };

  function clearAllFormInputFields() {
    //console.log("clearAllFormInputFields","clearAllFormInputFields")
    confirmAlert({
      title: "Confirm!",
      message: "Sure to Delete all the form Fields",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            formsFieldsData.formFields = {};
            //console.log("formsFieldsData.formFields",formsFieldsData.formFields)
            setFormsFieldsData(formsFieldsData);
            setInputFieldsChangeCount(inputFieldsChangeCount + 1);
          },
        },
        {
          label: "No",
        },
      ],
    });
  }

  function onPrintSettingSubmit(e) {
    e.preventDefault();
    setPrintSettingModalIsOpen(false);
  }

  function printMarginLeftChangeHandler(e) {
    //e.target.value
    console.log(
      "formsFieldsData.printMarginLeft_pre",
      formsFieldsData.printMarginLeft,
    );
    setPagePrintMarginLeft(e.target.value);
    formsFieldsData["printMarginLeft"] = e.target.value;
    //formsFieldsData.printMarginLeft=e.target.value;
    console.log(
      "formsFieldsData.printMarginLeft_post",
      formsFieldsData.printMarginLeft,
    );
  }

  function printMarginRightChangeHandler(e) {
    //e.target.value
    console.log(
      "formsFieldsData.printMarginRight_pre",
      formsFieldsData.printMarginRight,
    );
    setPagePrintMarginRight(e.target.value);
    formsFieldsData["printMarginRight"] = e.target.value;
    //formsFieldsData.printMarginLeft=e.target.value;
    console.log(
      "formsFieldsData.printMarginRight_post",
      formsFieldsData.printMarginRight,
    );
  }

  function printMarginTopChangeHandler(e) {
    //e.target.value
    console.log(
      "formsFieldsData.printMarginTop_pre",
      formsFieldsData.printMarginTop,
    );
    setPagePrintMarginTop(e.target.value);
    formsFieldsData["printMarginTop"] = e.target.value;
    //formsFieldsData.printMarginLeft=e.target.value;
    console.log(
      "formsFieldsData.printMarginTop_post",
      formsFieldsData.printMarginTop,
    );
  }

  function printMarginBottomChangeHandler(e) {
    //e.target.value
    console.log(
      "formsFieldsData.printMarginBottom_pre",
      formsFieldsData.printMarginBottom,
    );
    setPagePrintMarginBottom(e.target.value);
    formsFieldsData["printMarginBottom"] = e.target.value;
    //formsFieldsData.printMarginLeft=e.target.value;
    console.log(
      "formsFieldsData.printMarginBottom_post",
      formsFieldsData.printMarginBottom,
    );
  }

  function printPageTypeChangeHandler(e) {
    //e.target.value
    console.log("formsFieldsData.pageType_pre", formsFieldsData.pageType);
    setPageType(e.target.value);
    formsFieldsData["pageType"] = e.target.value;
    //formsFieldsData.printMarginLeft=e.target.value;
    console.log("formsFieldsData.pageType_post", formsFieldsData.pageType);
  }

  function handleTemplateHistoryClick(templateHistory) {
    //console.log("handleTemplateHistoryClick_templateHistory", templateHistory);

    confirmAlert({
      title: "Confirm!",
      message: "Replace Current Template with History Template ",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            //console.log("replace_templateHistory_yes", templateHistory);
            setEditorContent(templateHistory.template);
            //setInputFieldsChangeCount(inputFieldsChangeCount + 3);
            setHistoryModalIsOpen(false);
          },
        },
        {
          label: "No",
        },
      ],
    });
  }

  function handleFormFieldHistoryClick(formFieldHistory) {
    //console.log("handleFormFieldHistoryClick_templateHistory", formFieldHistory);
    confirmAlert({
      title: "Confirm!",
      message: "Replace Current Fields with History ",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            //console.log("replace_formFields_yes", formFieldHistory);
            const formsFieldsDataTemp = formFieldHistory.formFields;
            if (
              Object.keys(formsFieldsDataTemp).length === 0 &&
              formsFieldsDataTemp.constructor === Object
            ) {
              alert("No Form Field Data");
            } else {
              formsFieldsData = formsFieldsDataTemp;
              setFormsFieldsData(formsFieldsData);
              setPagePrintMarginLeft(formsFieldsData.printMarginLeft);
              setPagePrintMarginRight(formsFieldsData.printMarginRight);
              setPagePrintMarginTop(formsFieldsData.printMarginTop);
              setPagePrintMarginBottom(formsFieldsData.printMarginBottom);
              setPageType(formsFieldsData.pageType);
            }

            //setInputFieldsChangeCount(inputFieldsChangeCount + 3);

            setHistoryModalIsOpen(false);
          },
        },
        {
          label: "No",
        },
      ],
    });
  }

  window.addEventListener("beforeunload", (ev) => {
    ev.preventDefault();
    return (ev.returnValue = "Are you sure you want to close?");
  });

  return (
    <>
      {/* <Prompt
        when={formIsHalfFilledOut}
        message="You have unsaved changes, are you sure you want to leave?"
      /> */}
      <ReactTooltip />
      <Modal
        transparent={false}
        ariaHideApp={false}
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
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
            <h4>Test Run</h4>
          </div>
          <div className="col-6" style={{ textAlign: "end" }}>
            <span
              className="pointer"
              onClick={() => setModalIsOpen(false)}
              style={{ cursor: "pointer" }}
            >
              <button className="btn btn-danger btn-sm">X</button>
            </span>
          </div>
        </div>
        {/* formsTemplate={draftToHtml(
          convertToRaw(editorState.getCurrentContent())
        )} */}
        <div className="row">
          <DocmasterCoreTestRunPopUp
            formId={formId}
            formsTemplate={editorContent}
            formsFieldsData={formsFieldsData}
          />
        </div>
      </Modal>

      <Modal
        transparent={false}
        ariaHideApp={false}
        isOpen={historyModalIsOpen}
        onRequestClose={() => setHistoryModalIsOpen(false)}
        // style={{ zIndex: "4" }}
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
            <h4>Tamplate &amp; From Fields History</h4>
          </div>
          <div className="col-6" style={{ textAlign: "end" }}>
            <span
              className="pointer"
              onClick={() => setHistoryModalIsOpen(false)}
              style={{ cursor: "pointer" }}
            >
              <button className="btn btn-danger btn-sm">X</button>
            </span>
          </div>
        </div>
        <div className="">
          <Tabs
            className="mb-1"
            defaultActiveKey="formTemplateHistory"
            id="uncontrolled-tab-example"
          >
            <Tab eventKey="formTemplateHistory" title="Template History">
              <div className="contentRemarks">
                {templateHistories &&
                  templateHistories.map((templateHistory, index) => (
                    <div
                      className="pointer"
                      key={templateHistory.id + "FTH"}
                      onClick={() =>
                        handleTemplateHistoryClick(templateHistory)
                      }
                    >
                      {templateHistory.dateTime}
                    </div>
                  ))}
              </div>
            </Tab>
            <Tab eventKey="formFormfieldsHistory" title="Formfields History">
              <div className="contentRemarks">
                {formFieldHistories &&
                  formFieldHistories.map((formFieldHistory, index) => (
                    <div
                      className="pointer"
                      key={formFieldHistory.id + "FFH"}
                      onClick={() =>
                        handleFormFieldHistoryClick(formFieldHistory)
                      }
                    >
                      {formFieldHistory.dateTime}
                    </div>
                  ))}
              </div>
            </Tab>
          </Tabs>
        </div>
      </Modal>

      <Modal
        transparent={false}
        ariaHideApp={false}
        isOpen={printSettingModalIsOpen}
        onRequestClose={() => setPrintSettingModalIsOpen(false)}
        // style={{ zIndex: "4" }}
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
            left: "30%",
            width: "40vw",
            // background: "transparent",
            // border: "none",
            // boxShadow:"0 0 5px black"
          },
        }}
      >
        <div className="row">
          <div className="col-6">
            <h4>Print Setting (in CM)</h4>
          </div>
          <div className="col-6" style={{ textAlign: "end" }}>
            <span
              className="pointer"
              onClick={() => setPrintSettingModalIsOpen(false)}
              style={{ cursor: "pointer" }}
            >
              <button className="btn btn-danger btn-sm">X</button>
            </span>
          </div>
        </div>
        <div className="">
          <Form
            className="px-3 py-2"
            onSubmit={onPrintSettingSubmit}
            method="POST"
          >
            <FormGroup className="mb-3">
              <Label className="form-label" for="printMarginLeft">
                Print Margin Left
              </Label>
              <Input
                className="form-control"
                type="number"
                name="printMarginLeft"
                id="printMarginLeft"
                placeholder="printMarginLeft"
                value={pagePrintMarginLeft}
                onChange={printMarginLeftChangeHandler}
                required
              />
            </FormGroup>

            <FormGroup className="mb-3">
              <Label className="form-label" for="printMarginRight">
                Print Margin Right
              </Label>
              <Input
                className="form-control"
                type="number"
                name="printMarginRight"
                id="printMarginRight"
                placeholder="printMarginRight"
                value={pagePrintMarginRight}
                onChange={printMarginRightChangeHandler}
                required
              />
            </FormGroup>

            <FormGroup className="mb-3">
              <Label className="form-label" for="printMarginTop">
                Print Margin Top
              </Label>
              <Input
                className="form-control"
                type="number"
                name="printMarginTop"
                id="printMarginTop"
                placeholder="printMarginTop"
                value={pagePrintMarginTop}
                onChange={printMarginTopChangeHandler}
                required
              />
            </FormGroup>

            <FormGroup className="mb-3">
              <Label className="form-label" for="printMarginBottom">
                Print Margin Bottom
              </Label>
              <Input
                className="form-control"
                type="number"
                name="printMarginBottom"
                id="printMarginBottom"
                placeholder="printMarginBottom"
                value={pagePrintMarginBottom}
                onChange={printMarginBottomChangeHandler}
                required
              />
            </FormGroup>

            <FormGroup className="mb-3">
              <Label className="form-label" for="pageType">
                Page Type
              </Label>
              <Input
                className="form-control"
                type="select"
                name="pageType"
                id="pageType"
                value={pageType}
                onChange={printPageTypeChangeHandler}
                required
              >
                <option key="pageType0" value="">
                  Select Page
                </option>
                <option key="pageType1" value="a4">
                  A4
                </option>
                <option key="pageType2" value="letter">
                  Letter
                </option>
                <option key="pageType3" value="legal">
                  Legal
                </option>
              </Input>
            </FormGroup>

            <Button className="mb-3 btn-sm btn btn-primary " type="submit">
              Submit
            </Button>
          </Form>
        </div>
      </Modal>

      <div className="row">
        <div
          className="col-9 "
          // style={{ borderColor: "red", border: "1px solid" }}
        >
          <div className="">
            {/* <strong>{formTypeMessageHeader}</strong>&nbsp; */}
            {/* <strong>{formTypeSubMessageHeader}</strong> */}
            {/* <br/> */}
            <input
              style={{ display: "none" }}
              ref={hiddenTemplateFileInput}
              data-tip="Upload template file"
              title="Upload template file"
              type="file"
              name="inputTemplateFieldUpload"
              id="inputTemplateFieldUpload"
              onChange={inputTemplateUploadChangeHandler}
              accept=".docx"
            />
            {/* <button
              data-tip="Upload template"
              title="Upload template"
              className="btn btn-info btn-md"
              id="uploadTemplateBTN"
              onClick={handleClick}
            >
              <i className="fa fa-upload" aria-hidden="true"></i>
            </button> */}
            {/* &nbsp;&nbsp; */}
            {(() => {
              if (isNetworkAlive() == true) {
                return (
                  <>
                    <button
                      className="btn btn-md btn-secondary  bg-primary"
                      onClick={() => onTemplateSaveButonAction(0, 0)}
                      title="Save &amp; Continue"
                      // data-tip="Save &amp; Continue"
                    >
                      {/* <i className="fa fa-save"></i> */}
                      <p>Save</p>
                    </button>
                    &nbsp;&nbsp;
                    {/* <button
                    className="btn btn-md btn-secondary"
                      onClick={() => onTemplateSaveButonAction(1, 0)}
                      title="Submit"
                      data-tip="Submit"
                    >
                      <i className="fa fa-paper-plane"></i> Save &amp; Exit
                    </button> */}
                    {/* &nbsp;&nbsp;
                    <button
                    className="btn btn-md btn-secondary"
                      onClick={() => onTemplateSaveButonAction(1, 1)}
                      title="Submit for Approval"
                      data-tip="Submit for Approval"
                    >
                      <i className="fa fa-check"></i> Approve
                    </button> */}
                  </>
                );
              } else {
                return <p>Check for Network Problem</p>;
              }
            })()}
            {(() => {
              if (isNetworkAlive() == true && props.formType == "mainform") {
                return (
                  <>
                    {/* &nbsp;&nbsp; */}
                    <button
                      className="btn btn-md outline-primary-button"
                      onClick={() => setPrintSettingModalIsOpen(true)}
                      title="Print Setting"
                      // data-tip="Print Setting"
                    >
                      {/* <i className="fa fa-print"></i>{" "}
                      <i className="fa fa-gear"></i> */}
                      <p>Print Setting</p>
                    </button>
                    {/* &nbsp;&nbsp;&nbsp;&nbsp; */}
                    {/* <button
                    className="btn btn-md btn-secondary"
                      onClick={() => setHistoryModalIsOpen(true)}
                      title="Form Fields &amp; Template History"
                      data-tip="Form Fields &amp; Template History"
                    >
                      <i className="fa fa-history"></i>
                    </button> */}
                  </>
                );
              }
            })()}
            {/* &nbsp;&nbsp; */}
            {/* {(() => {
              if (isNetworkAlive() == true) {
                return (
                  <button
                  className="btn btn-md btn-secondary"
                    onClick={() => testRunTemplateOnPopUpAction(0)}
                    title="Test Run PopUp"
                    data-tip="Test Run PopUp"
                  >
                    <i className="fa fa-tachometer"></i>
                  </button>
                );
              } else {
                return <p>Check for Network Problem</p>;
              }
            })()} */}
            &nbsp;&nbsp;
            {(() => {
              if (isNetworkAlive() == true) {
                return (
                  <button
                    className="btn btn-md outline-primary-button"
                    onClick={() => testRunTemplateOnPopUpAction(1)}
                    title="Test Run on Whole Page"
                    // data-tip="Test Run on Whole Page"
                  >
                    <p>Test Run</p>
                    {/* <i className="fa fa-tachometer"></i>{" "}
                    <i className="fa fa-sign-out"></i> */}
                  </button>
                );
              } else {
                return <p>Check for Network Problem</p>;
              }
            })()}
          </div>
          {/* <div className="row"> */}
          {/* <div className="flex"> */}
          {/* <input
              style={{ display: "none" }}
              ref={hiddenTemplateFileInput}
              data-tip="Upload template file"
              title="Upload template file"
              type="file"
              name="inputTemplateFieldUpload"
              id="inputTemplateFieldUpload"
              onChange={inputTemplateUploadChangeHandler}
              accept=".docx"
            />
            <button
              data-tip="Upload template"
              title="Upload template"
              className="btn btn-info btn-sm my-1"
              onClick={handleClick}
            >
              <i className="fa fa-upload" aria-hidden="true"></i>
            </button> */}
          {/* </div> */}

          {(() => {
            if (isNetworkAlive() == true) {
              return (
                <TinyMce
                  formId={formId}
                  intitialContent={editorContent}
                  onEditorChange={onEditorChange}
                />
              );
            } else {
              return <p>Check for Network Problem</p>;
            }
          })()}
        </div>
        <div className="col-3 padding-zero">
          {(() => {
            if (isNetworkAlive() == true) {
              return (
                <>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                    className=""
                  >
                    <AddFormFields
                      onAddDocumentFormFieldsSubmit={(formField) =>
                        onAddDocumentFormFieldsSubmit(formField)
                      }
                      onUploadDocumentFormFieldsSubmit={(formFieldsData) =>
                        onUploadDocumentFormFieldsSubmit(formFieldsData)
                      }
                      onDownloadDocumentFormFieldsSubmit={() =>
                        onDownloadDocumentFormFieldsSubmit()
                      }
                      action="add"
                    />
                    {/* <button
                      // data-tip="Clear All Form Fields"
                      title="Clear All Form Fields"
                      className="btn btn-danger btn-sm"
                      onClick={clearAllFormInputFields}
                    >
                      <p>Delete all Fields</p> */}
                    {/* <i className="" aria-hidden="true"></i> */}
                    {/* </button> */}
                  </div>
                  {/* <b>Form Fields</b> */}
                  {/* <button
                    data-tip="Clear All Form Fields"
                    title="Clear All Form Fields"
                    className="btn btn-info btn-sm my-1 float-right"
                    onClick={clearAllFormInputFields}
                  >
                    <i className="fa fa-times" aria-hidden="true"></i>
                  </button> */}
                  <DocumentFormFields
                    formType={props.formType}
                    inputFieldsChangeCount={inputFieldsChangeCount}
                    formsFieldsData={formsFieldsData}
                    onDocFormInputFieldChangeHandler={(thisFormsFieldsData) =>
                      onDocFormInputFieldChangeHandler(thisFormsFieldsData)
                    }
                    onInputFormFieldsDelete={(formField) =>
                      onInputFormFieldsDelete(formField)
                    }
                  />
                </>
              );
            } else {
              return <p>Check for Network Problem</p>;
            }
          })()}

          {/* <AddFormFields
              onAddDocumentFormFieldsSubmit={(formField) =>
                onAddDocumentFormFieldsSubmit(formField)
              }
              action="add"
            />
            <DocumentFormFields
              formType={props.formType}
              inputFieldsChangeCount={inputFieldsChangeCount}
              formsFieldsData={formsFieldsData}
              onDocFormInputFieldChangeHandler={(thisFormsFieldsData) =>
                onDocFormInputFieldChangeHandler(thisFormsFieldsData)
              }
              onInputFormFieldsDelete={(formField) =>
                onInputFormFieldsDelete(formField)
              }
            /> */}
          {/* </div> */}
        </div>
      </div>
    </>
  );
};
export default DesignDevelopDocForms;
