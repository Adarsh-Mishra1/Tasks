//DocmasterCoreTestRunPopUp
import React, { Component } from "react";
import { Alert, Button, Form } from "reactstrap";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { reactLocalStorage } from "reactjs-localstorage";
import axios from "axios";
import Moment from "moment";
import Modal from "react-modal";

import ReactToPrint from "react-to-print";
import { toast } from "react-toastify";

// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
// import html2pdf from "html2pdf.js";
// import htmlToPdfmake from "html-to-pdfmake"

// import { savePDF } from "@progress/kendo-react-pdf";
// import { drawDOM, exportPDF } from "@progress/kendo-drawing";

import { InputFieldRendring } from "./InputFieldRendring";
import { sortFormFields } from "../../OtherFunctions/FormRenderingFunctions";
import { htmlString2Print } from "../../OtherFunctions/OtherUIFunctions";

import {
  populateSubConditonalForm,
  replaceTemplateKeyWithFormDataViewTT,
  replaceTemplateKeyWithFormDataViewTTV2,
  fetchFormulaObjectV2,
  processFormulaObjectV2,
  fetchFormulaObjectForConditionalElementV2,
  processFormulaObjectForConditionalElementV2,
  digitAmountToWord,
  rendringInputValueStyle,
  onMultiSelectCheckBoxClick,
  fetchStringFormulaObject,
  processStringFormulaObject,
  fetchStringFormulaObjectForConditionalElementV2,
  processStringFormulaObjectForConditionalElementV2,
  fetchLegalFormulaObject,
  processLegalFormulaObject,
  processTriggerInputKeyValue,
  fetchLegalFormulaObjectForConditionalElement,
  processLegalFormulaObjectForConditionalElement,
} from "../../OtherFunctions/TemplateRenderingFunctions";
import {
  ordinal_suffix_of,
  month2MonthString,
  processPageBreak,
  processPageBreakForBackEnd,
  processPageBreakForDoc,
  processPageBreakForJsPrint,
  dataURItoBlob,
  timeTo12HourFormat,
} from "../../OtherFunctions/OtherFunctions";
import {
  inPutFieldStart,
  inPutFieldEnd,
  inPutFieldStartBlank,
  inPutFieldEndBlank,
} from "../../configs/GeneralConfigs";
// import { WSSendDocToUserByEmail } from "../../configs/WebService";
// import { apiKey, apiKeyValue } from "../../configs/ApiKeys";

// import { forEach } from "mathjs";
// import { NaN } from "mathjs";

class DocmasterCoreTestRunPopUp extends Component {
  constructor(props) {
    super(props);
    console.log("DocmasterCoreTestRunPopUp_props", props);
    this.state = {
      showFilledForm: false,
      formData: {},
      formId: props.formId,
      conditionalFormInputs: {},
      selectedConditionalFormInput: {},
      selectedConditionalFormInputValue: "",
      mainDocFormTemplate: this.props.formsTemplate,
      testTemplateToShow: this.props.formsTemplate,
      printMarginLeft: this.props.formsFieldsData.printMarginLeft,
      printMarginRight: this.props.formsFieldsData.printMarginRight,
      printMarginTop: this.props.formsFieldsData.printMarginTop,
      printMarginBottom: this.props.formsFieldsData.printMarginBottom,
      pageType: this.props.formsFieldsData.pageType,
      mainFormFields: this.props.formsFieldsData.formFields,
      formsFieldsDataSorted: sortFormFields(
        this.props.formsFieldsData.formFields
      ),
      cCall: 0,
    };
    //var cCall=0;
  }

  onFormSubmit(e) {
    e.preventDefault();
    //console.log("onFormSubmit", e);
  }

  componentDidUpdate() {
    //console.log("componentDidUpdate_formData2_props", this.props);
    //console.log("componentDidUpdate_formData2_prevProps", prevProps);
    //console.log("componentDidUpdate_formData2", this.state.formData);
    //if(this.state.formData!==prevProps.formData){
    //console.log("componentDidUpdate_formData2_PRoceess_FomrData");

    let template = this.replaceTemplateKeyWithFormDataView(
      this.state.mainDocFormTemplate,
      this.state.formData
    );

    if (this.state.testTemplateToShow !== template) {
      // console.log("componentDidUpdate_formData2_templatedata");
      this.setState({ testTemplateToShow: template });
    }
  }

  // toBase64 = (file) =>
  //   new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => resolve(reader.result);
  //     reader.onerror = (error) => reject(error);
  //   });

  // onInputChange = (event, formsFieldsData, fieldKey, templateKey, level) => {
  onInputChange = async (
    event,
    formsFieldsData,
    fieldKey,
    templateKey,
    level
  ) => {
    console.log("onInputChange_formsFieldsData", formsFieldsData);
    console.log("onInputChange_level", level);
    /*
    console.log("DocmasterCoreTestRunPopUp", "DocmasterCoreTestRunPopUp");
    console.log("formsFieldsData", formsFieldsData);
    console.log("fieldKey", fieldKey);
    console.log("templateKey", templateKey);
    console.log("level", level);
    // console.log("formsFieldsData.value", formsFieldsData.value);
    // console.log("onInputChange", e);
    // console.log("onInputChange", e.target.name);
    console.log("onInputChange", e.target.type);
    console.log("formsFieldsData.elementType", formsFieldsData.elementType);
    */
    // console.log("onInputChange", e.target.value.trim());
    //ToDo: if target type is date show/ convert input value in Provided Format
    console.log("_tempValue_event.target.value", event.target.value);
    let tempValue = event.target.value.trim();
    let multiSelectValue = []; //AddedOn 13-12-2021

    console.log("_tempValue", tempValue);
    //console.log("handling_imageIn", formsFieldsData);
    //console.log("handling_imageIn_event.target.type", event.target.type);

    if (
      event.target.type.toLowerCase() == "input" ||
      event.target.type.toLowerCase() == "file"
    ) {
      if (formsFieldsData.elementConfig.type.toLowerCase() == "image") {
        //console.log("handling_imageIn", "value");
        //console.log("handling_imageIn",event.target.value.trim());
        // console.log("handling_imageIn",event.target.files[0]);
        //console.log("handling_imageIn",this.toBase64(event.target.files[0]));
        // console.log("handling_imageIn",URL.createObjectURL(event.target.files[0]));
        tempValue =
          "<img src='" +
          URL.createObjectURL(event.target.files[0]) +
          "' alt='' width='" +
          formsFieldsData.validation.maxLength +
          "' height='" +
          formsFieldsData.validation.minLength +
          "'/>";
      }
    }

    if (event.target.type.toLowerCase() == "date") {
      if (formsFieldsData.elementConfig.type.toLowerCase() == "date") {
        //console.log("DateOnInputChange", formsFieldsData.value);
        if (formsFieldsData.value.length >= 10) {
          tempValue = Moment(tempValue).format(formsFieldsData.value); //To Change into Provided Format
          //console.log("DateOnInputChange", tempValue);
        } else {
          tempValue = Moment(tempValue).format("DD-MM-YYYY"); //To Change into dd-mm-yyyy
          //console.log("DateOnInputChange", tempValue);
        }
      } else if (
        formsFieldsData.elementConfig.type.toLowerCase() == "date_l1"
      ) {
        tempValue = Moment(tempValue).format("DD-MM-YYYY"); //To Change into dd-mm-yyyy
        //console.log("DateOnInputChange", tempValue);
        const tempValueDate = tempValue.split("-");
        console.log("tempValueDate", tempValueDate);
        //tempValue=tempValueDay+" day of "+tempValueMonth+", "+tempValueDate[2]//Old
        tempValue =
          ordinal_suffix_of(tempValueDate[0]) +
          " day of " +
          month2MonthString(tempValueDate[1]) +
          " of the year " +
          tempValueDate[2];
      } else if (
        formsFieldsData.elementConfig.type.toLowerCase() == "date_l2"
      ) {
        tempValue = Moment(tempValue).format("DD-MM-YYYY"); //To Change into dd-mm-yyyy
        //console.log("DateOnInputChange", tempValue);
        const tempValueDate = tempValue.split("-");
        console.log("tempValueDate", tempValueDate);
        //const tempValueDay=ordinal_suffix_of(tempValueDate[0])
        //const tempValueMonth=month2MonthString(tempValueDate[1])
        //tempValue=tempValueDay+" day of "+tempValueMonth+", "+tempValueDate[2]//Old
        tempValue =
          ordinal_suffix_of(tempValueDate[0]) +
          " " +
          month2MonthString(tempValueDate[1]) +
          ", " +
          tempValueDate[2];
      } else {
        tempValue = Moment(tempValue).format("DD-MM-YYYY"); //To Change into dd-mm-yyyy
      }
    }

    //ToProcess TimePicker
    if (formsFieldsData.elementType.toLowerCase() == "time") {
      if (formsFieldsData.elementConfig.type.toLowerCase() == "time12") {
        tempValue = timeTo12HourFormat(tempValue);
      }
    }

    if (formsFieldsData.elementType.toLowerCase() == "checkbox") {
      if (
        formsFieldsData.elementConfig.type.toLowerCase() == "multiselectt1" ||
        formsFieldsData.elementConfig.type.toLowerCase() == "multiselectt2" ||
        formsFieldsData.elementConfig.type.toLowerCase() == "multiselectt3" ||
        formsFieldsData.elementConfig.type.toLowerCase() == "multiselectt4" ||
        formsFieldsData.elementConfig.type.toLowerCase() == "multiselectt5"
      ) {
        // tempValue = event.target.value.trim();
        //AddedOn 13-12-2021
        tempValue = onMultiSelectCheckBoxClick(
          tempValue,
          formsFieldsData.elementConfig.type,
          formsFieldsData.validation.maxLength,
          formsFieldsData.validation.minLength
        );
        console.log("multiselectt1_tempValue_test", tempValue);
        multiSelectValue = event.target.tempValue; //AddedOn 13-12-2021
        console.log(
          "multiselectt1_tempValue_multiSelectValue",
          multiSelectValue
        ); //AddedOn 13-12-2021

        // if(formsFieldsData.isHidden==true){
        //   tempValue="";
        // }else{

        // }
      } else {
        //console.log("checkBoxChecked", event.target.checked);
        if (event.target.checked) {
          tempValue = event.target.value.trim();
        } else {
          tempValue = "";
        }
      }
    }

    if (formsFieldsData.elementConfig.type.toLowerCase() == "daystring") {
      if (formsFieldsData.elementType.toLowerCase() == "select") {
        //Nothing to do
      } else {
        tempValue = ordinal_suffix_of(tempValue); //Change to Day String
      }
    }

    if (formsFieldsData.elementConfig.type.toLowerCase() == "monthstring") {
      if (formsFieldsData.elementType.toLowerCase() == "select") {
        //Nothing to do
      } else {
        tempValue = month2MonthString(tempValue); //Change to Month String
      }
    }

    /*
    if(event.target.type.toLowerCase() == "input"){
    }
    */

    //Old
    //this.setState({ [event.target.name]:event.target.value.trim() });
    //this.state.formData[event.target.name] = tempValue;

    // if (
    //   formsFieldsData.otherConditions !== undefined &&
    //   formsFieldsData.otherConditions === "commaSepNum"
    // ) {
    //   //AddedOn:23-11-2021
    //   if (!isNaN(tempValue)) {
    //     //console.log("Number_WithComma",numberWithCommas(tempValue))
    //     tempValue = numberWithCommas(tempValue);
    //   }
    // }

    this.setState({ [templateKey]: tempValue.trim() });
    this.state.formData[templateKey] = tempValue.trim();

    this.setState({ formData: this.state.formData });
    console.log("formData_", this.state.formData);

    console.log("otherConditions_formsFieldsData", formsFieldsData);
    console.log("otherConditions_", formsFieldsData.otherConditions);
    //DevNote: Process Below on Submit Also
    if (
      formsFieldsData.otherConditions !== undefined &&
      formsFieldsData.otherConditions.length > 0
    ) {
      this.processOtherCondition(formsFieldsData, templateKey);
    }

    if (formsFieldsData.isConditional == true) {
      console.log("formsFieldsData.isConditional", "-----------------------");

      this.setState({
        selectedConditionalFormInputValue: tempValue.trim(),
        selectedConditionalFormInput: formsFieldsData,
      });

      //Way 1
      // this.state.conditionalFormInputs[formsFieldsData.elementUId] = {
      //   inputValue: e.target.value.trim(),
      //   input: formsFieldsData,
      // };

      //Way 2//ChangedOn 13-12-2021
      this.state.conditionalFormInputs[templateKey] = {
        inputValue: tempValue.trim(),
        input: formsFieldsData,
        templateKey: templateKey,
        multiSelectValue: multiSelectValue,
      };

      console.log("conditionalFormInputs_", this.state.conditionalFormInputs);

      //this.props.formsFieldsData.formFields

      //Way 3
      // this.state.mainFormFields[templateKey] = formsFieldsData
      // console.log("-templateKey-",templateKey);
      // console.log("-conditionalFormInputs-",this.state.mainFormFields);
      // this.setState({mainFormFields:this.state.mainFormFields });

      //this.state.conditionalFormInputs = conditionalFormInputsTemp
      this.setState({
        conditionalFormInputs: this.state.conditionalFormInputs,
      });

      //console.log("conditionalFormInputs", this.state.conditionalFormInputs);
      //this.state.mainDocFormTemplate
      //this.props.formsTemplate
      //console.log("processConditionalFormFieldTemplate", "Called");
      //console.log("formsFieldsData", formsFieldsData);
      console.log("processConditionalFormFieldTemplate_tempValue", tempValue);
      this.processConditionalFormFieldTemplate(
        this.props.formsTemplate,
        formsFieldsData,
        tempValue.trim(),
        templateKey,
        level
      );
    }
  };

  processOtherCondition(formsFields, mainFieldTemplateKey) {
    console.log("processOtherCondition_formsFieldsData", formsFields);
    console.log(
      "processOtherCondition_mainFieldTemplateKey",
      mainFieldTemplateKey
    );
    console.log("processOtherCondition_", formsFields.otherConditions);

    let conditionAction = formsFields.otherConditions.split("(")[0];

    if (conditionAction == "commaSepNum") {
      //DoNothing
    } else {
      console.log("processOtherCondition_conditionAction", conditionAction);

      var conditionVars = formsFields.otherConditions.substring(
        formsFields.otherConditions.indexOf("(") + 1,
        formsFields.otherConditions.lastIndexOf(")")
      );

      console.log("processOtherCondition_conditionVars", conditionVars);

      let parentKeyTemp = this.filterOutParentKey(
        mainFieldTemplateKey,
        formsFields.elementUId
      );

      if (parentKeyTemp != undefined && parentKeyTemp.length > 0) {
        conditionVars = conditionVars + parentKeyTemp;
        console.log("processOtherCondition_conditionVars", conditionVars);
      }

      if (
        this.state.formData[conditionVars] != undefined &&
        this.state.formData[mainFieldTemplateKey] != undefined
      ) {
        console.log(
          "processOtherCondition_formData_" + conditionVars,
          this.state.formData[conditionVars]
        );
        console.log(
          "processOtherCondition_formData_" + mainFieldTemplateKey,
          this.state.formData[mainFieldTemplateKey]
        );
        if (conditionAction == "lessThanEqualTo") {
          if (
            Number(this.state.formData[mainFieldTemplateKey]) <=
            Number(this.state.formData[conditionVars])
          ) {
            console.log("processOtherCondition_conditionAction_test", "Ok");
          } else {
            console.log(
              "processOtherCondition_conditionAction_test",
              "Check " + conditionVars
            );
            //alert("Please check value of "+mainFieldTemplateKey+" and "+conditionVars);
            alert(
              "Please check input of " + formsFields.elementConfig.inputLabel
            );
          }
        }
        //AddedOn:17-11-2021
        if (conditionAction == "greaterThanEqualTo") {
          if (
            Number(this.state.formData[mainFieldTemplateKey]) >=
            Number(this.state.formData[conditionVars])
          ) {
            console.log("processOtherCondition_conditionAction_test", "Ok");
          } else {
            console.log(
              "processOtherCondition_conditionAction_test",
              "Check " + conditionVars
            );
            //alert("Please check value of "+mainFieldTemplateKey+" and "+conditionVars);
            alert(
              "Please check input of " + formsFields.elementConfig.inputLabel
            );
          }
        }
      }
    }
  }

  filterOutParentKey(inputAndTemplateKey, fieldUid) {
    console.log(
      "processOtherCondition_filterOutParentKey_inputAndTemplateKey",
      inputAndTemplateKey
    );
    console.log("processOtherCondition_filterOutParentKey_fieldUid", fieldUid);
    console.log(
      "processOtherCondition_filterOutParentKey_test",
      "fieldUid".replace("fieldUid", "")
    );
    console.log("processOtherCondition_filterOutParentKey_prnt_key");
    return inputAndTemplateKey.replace(fieldUid, "");
  }

  replaceTemplateKeyWithFormDataView(template, formdata) {
    //console.log("----replaceTemplateKeyWithFormDataView----");
    template = template.replace(
      new RegExp(inPutFieldStart, "gi"),
      inPutFieldStartBlank
    );
    template = template.replace(
      new RegExp(inPutFieldEnd, "gi"),
      inPutFieldEndBlank
    );
    let conditionalFormsFieldsDataSorted = [];
    let conditionalFormsFieldsDataSortedMain = [];
    //ToDo: Do Not Show Unchecked CheckBox
    //console.log("FormData", this.state.formData);
    //console.log("conditionalFormInputs", this.state.conditionalFormInputs);
    //console.log("formsTemplate",this.props.formsTemplate)

    console.log("formsTemplate_mainFormFields", this.state.mainFormFields);
    console.log(
      "formsTemplate_formsFieldsDataSorted",
      this.state.formsFieldsDataSorted
    );

    Object.entries(this.state.mainFormFields).map(([key, val]) => {
      //let formFieldObject = this.state.mainFormFields[key];
      console.log("mainFormFields_val", val);
      console.log("mainFormFields_key", key);
      if (val.elementType.toLowerCase() == "label") {
        formdata[key] = val.value;
      } else if (val.elementType == "copyOfInput") {
        console.log("copyOfInput_", "copyOfInput");
        console.log("copyOfInput_val", val);
        console.log("copyOfInput_key", key);
        console.log("copyOfInput_val.value", val.value);

        //formdata[key] = val.value;

        if (formdata[val.value] != undefined) {
          console.log("copyOfInput_formData_val.value", formdata[val.value]);
          //formdata[key] = formdata[val.value];
          // document.getElementById(key).value = formdata[val.value];
          /*
          var element = document.getElementById(key);
          // console.log("copyOfInput_element",element);
          element.value = formdata[val.value];
          var event = new Event('change', { bubbles: true });
          element.dispatchEvent(event);
          */

          const input = document.querySelector("#" + key);
          if (input != null && input != undefined) {
            // This will work by calling the native setter bypassing Reacts incorrect value change check
            Object.getOwnPropertyDescriptor(
              window.HTMLInputElement.prototype,
              "value"
            ).set.call(input, formdata[val.value]);
            // This will trigger a new render wor the component
            input.dispatchEvent(new Event("change", { bubbles: true }));
          }

          console.log("copyOfInput_formData_" + key, formdata[key]);
        }
      } else if (val.elementType.toLowerCase() == "amount2words") {
        console.log("mainFormFields", "---- amount2words ----");
        console.log("mainFormFields_amount2words_key", key);
        console.log("mainFormFields_amount2words_val.value", val.value);
        console.log("mainFormFields_formdata[key]", formdata[key]);
        console.log("mainFormFields_formdata[key]", formdata[val.value]);

        formdata[key] = digitAmountToWord(formdata[val.value]);
      } else if (val.elementType.toLowerCase() == "formula") {
        console.log("mainFormFields", "---- Formula type ----");
        console.log("mainFormFields_Formula_key", key);
        console.log("mainFormFields_Formula_val.value", val.value);

        console.log("mainFormFieldsformdata[key]" + key, formdata[key]);

        //console.log("mainFormFieldsTest", formdata.noofitems);

        //let formulaObject=fetchFormulaObject(val.value);
        let formulaObject = fetchFormulaObjectV2(val.value);
        console.log("mainFormFields_formulaObject", formulaObject);

        //console.log("mainFormFields_formdata[formulaObject.parentKey]", formdata[formulaObject.parentKey]);

        //var processFormulaObjectValue=processFormulaObject(formulaObject,formdata[formulaObject.parentKey],formdata);
        var processFormulaObjectValue = processFormulaObjectV2(
          formulaObject,
          formdata
        );

        console.log(
          "mainFormFields_processFormulaObjectValue",
          processFormulaObjectValue
        );

        formdata[key] = processFormulaObjectValue;
        console.log(
          "mainFormFields_processFormulaObjectValue_key",
          formdata[key]
        );
      } else if (val.elementType.toLowerCase() == "strngformula") {
        //DevNote:strngformula//added on 21-02-2024
        console.log("mainFormFields", "---- strngformula ----");
        console.log("mainFormFields_strngformula_key", key);
        console.log("mainFormFields_strngformula_val.value", val.value);
        console.log(
          "mainFormFieldsformdata[key]_strngformula_" + key,
          formdata[key]
        );
        let stringFormulaObject = fetchStringFormulaObject(val.value);
        console.log(
          "mainFormFields_strngformula_formulaObject",
          stringFormulaObject
        );
        var processStringFormulaObjectValue = processStringFormulaObject(
          stringFormulaObject,
          formdata,
          val.elementConfig.type.toLowerCase()
        );
        console.log(
          "mainFormFields_strngformula_processFormulaObjectValue",
          processStringFormulaObjectValue
        );
        formdata[key] = processStringFormulaObjectValue;
        console.log(
          "mainFormFields_strngformula_processFormulaObjectValue_key",
          formdata[key]
        );
      } else if (val.elementType.toLowerCase() == "legalformula") {
        //DevNote:legalformula//added on 24-02-2024//

        console.log("mainFormFields", "---- legalformula ----");
        console.log("mainFormFields_legalformula_key", key);
        console.log("mainFormFields_legalformula_val.value", val.value);
        console.log(
          "mainFormFieldsformdata[key]_legalformula_" + key,
          formdata[key]
        );
        let stringLegalObject = fetchLegalFormulaObject(val.value);
        console.log(
          "mainFormFields_legalformula_formulaObject",
          stringLegalObject
        );
        let processLegalFormulaObjectValue = processLegalFormulaObject(
          stringLegalObject,
          formdata,
          val.elementConfig.type.toLowerCase()
        );
        console.log(
          "mainFormFields_legalformula_processFormulaObjectValue",
          processLegalFormulaObjectValue
        );
        formdata[key] = processLegalFormulaObjectValue;

        console.log(
          "mainFormFields_legalformula_processFormulaObjectValue_key",
          formdata[key]
        );
      } else if (val.elementType.toLowerCase() == "trigger") {
        //DevNote:trigger type input//added on 22-02-2024
        console.log("mainFormFields_trigger_key", key);
        let triggerKeyValue = processTriggerInputKeyValue(val.value);

        console.log("mainFormFields_trigger_triggerKeyValue", triggerKeyValue);
        formdata[key] = "";

        if (
          triggerKeyValue[0] != undefined &&
          triggerKeyValue[0].length > 0 &&
          formdata[triggerKeyValue[0]] != undefined &&
          formdata[triggerKeyValue[0]].length > 0
        ) {
          console.log(
            "mainFormFields_trigger_triggerKeyValue_formdata",
            triggerKeyValue,
            formdata[triggerKeyValue[0]]
          );
          if (
            triggerKeyValue[1] != undefined &&
            triggerKeyValue[1].length > 0
          ) {
            formdata[key] = triggerKeyValue[1];
          }
          console.log(
            "mainFormFields_trigger_key_formdata",
            key,
            formdata[key]
          );
        }
      } else if (val.elementType.toLowerCase() == "checkbox") {
        if (
          val.elementConfig.type.toLowerCase() == "multiselectt1" ||
          val.elementConfig.type.toLowerCase() == "multiselectt2" ||
          val.elementConfig.type.toLowerCase() == "multiselectt3" ||
          val.elementConfig.type.toLowerCase() == "multiselectt4" ||
          val.elementConfig.type.toLowerCase() == "multiselectt5"
        ) {
          //Do Nothing
        } else {
          if (formdata[key] == undefined) {
            formdata[key] = ""; //<-Hold Changes on 25-05-2021
          } else {
            if (formdata[key].length > 0) {
              formdata[key] = val.value;
            } else {
              //DO Nothing
            }
          }
        }
      } else {
        //formdata[key] = "";
      }
    });
    console.log("formsTemplate_formdata", formdata);
    //formFieldObjectFF
    /*console.log(
      "formFieldObjectFF-conditionalFormInputs",
      this.state.conditionalFormInputs
    );*/
    Object.entries(this.state.conditionalFormInputs).map(([key, val]) => {
      //let formFieldObject = this.state.mainFormFields[key];
      console.log("conditionalFormInputs_key", key);
      console.log("conditionalFormInputs_val", val);
      //console.log("conditionalFormInputs_val.inputValue", val.inputValue);
      //console.log("val.input.elementType", val.input.elementType);
      //console.log("formFieldObjectFF-conditionalFormInput_val", val);

      //To Process copyOfInput
      /*
      if (val.input.elementType == "copyOfInput"){
        console.log("copyOfInput_conditionalFormInputs_val", val);
          if(val.input.condition.conditionType=="ValueBased"){

          }else{

          }

      } else */ if (
        val.input.elementType.toLowerCase() == "select" ||
        val.input.elementType.toLowerCase() == "radio" ||
        val.input.elementType.toLowerCase() == "datalist" ||
        (val.input.elementType == "copyOfInput" &&
          val.input.condition.conditionType == "ValueBased")
      ) {
        console.log("conditionalFormInputs_elementType", val.input.elementType);

        if (
          val.input.condition.conditionStatements[val.inputValue] != undefined
        ) {
          let keyAddOnTemp = "" + key + 0;
          conditionalFormsFieldsDataSorted = sortFormFields(
            val.input.condition.conditionStatements[val.inputValue]
              .subFormFields.formFields
          );

          conditionalFormsFieldsDataSorted.forEach((formInElement) => {
            let formKeyAddOnTemp = formInElement.elementUId + "" + keyAddOnTemp;
            if (formInElement.isGlobal == true) {
              formKeyAddOnTemp = formInElement.elementUId; // + addition2key;
            }

            if (formInElement.elementType.toLowerCase() == "label") {
              formdata[formKeyAddOnTemp] = formInElement.value;
            }

            if (formInElement.elementType == "copyOfInput") {
              let mainParentFieldKey = formInElement.value + "" + keyAddOnTemp;
              console.log(
                "copyOfInput_condi_mainParentFieldKey",
                mainParentFieldKey
              );
              if (formdata[mainParentFieldKey] != undefined) {
                //console.log("copyOfInput_condi_mainParentFieldKey_form_value",formdata[mainParentFieldKey]);
                const input = document.querySelector("#" + formKeyAddOnTemp);
                if (input != null && input != undefined) {
                  // This will work by calling the native setter bypassing Reacts incorrect value change check
                  Object.getOwnPropertyDescriptor(
                    window.HTMLInputElement.prototype,
                    "value"
                  ).set.call(input, formdata[mainParentFieldKey]);
                  // This will trigger a new render wor the component
                  input.dispatchEvent(new Event("change", { bubbles: true }));
                  //console.log("copyOfInput_formData_"+formKeyAddOnTemp,formdata[formKeyAddOnTemp]);
                }
              }
            }

            if (formInElement.elementType.toLowerCase() == "amount2words") {
              formdata[formKeyAddOnTemp] = digitAmountToWord(
                formdata[formInElement.value + "" + keyAddOnTemp]
              );
            }

            if (formInElement.elementType.toLowerCase() == "formula") {
              let formulaObject = fetchFormulaObjectForConditionalElementV2(
                formInElement.value,
                keyAddOnTemp
              );
              var processFormulaObjectValue =
                processFormulaObjectForConditionalElementV2(
                  formulaObject,
                  formdata,
                  keyAddOnTemp
                );
              formdata[formKeyAddOnTemp] = processFormulaObjectValue;
            }

            if (formInElement.elementType.toLowerCase() == "strngformula") {
              let formulaObject =
                fetchStringFormulaObjectForConditionalElementV2(
                  formInElement.value,
                  keyAddOnTemp
                );
              var processFormulaObjectValue =
                processStringFormulaObjectForConditionalElementV2(
                  formulaObject,
                  formdata,
                  keyAddOnTemp,
                  formInElement.elementConfig.type.toLowerCase()
                );
              formdata[formKeyAddOnTemp] = processFormulaObjectValue;
            }

            if (formInElement.elementType.toLowerCase() == "legalformula") {
              //DevNote:legalformula//added on 24-02-2024//

              console.log("mainFormFields", "---- legalformula ----");
              console.log("mainFormFields_legalformula_key", key);
              console.log(
                "mainFormFields_legalformula_val.value",
                formInElement.value
              );
              console.log(
                "mainFormFieldsformdata[key]_legalformula_" + key,
                formdata[key]
              );
              let stringLegalObject =
                fetchLegalFormulaObjectForConditionalElement(
                  formInElement.value,
                  keyAddOnTemp
                );
              console.log(
                "mainFormFields_legalformula_formulaObject",
                stringLegalObject
              );
              let processLegalFormulaObjectValue =
                processLegalFormulaObjectForConditionalElement(
                  stringLegalObject,
                  formdata,
                  keyAddOnTemp,
                  formInElement.elementConfig.type.toLowerCase()
                );
              console.log(
                "mainFormFields_legalformula_processFormulaObjectValue",
                processLegalFormulaObjectValue
              );
              formdata[formKeyAddOnTemp] = processLegalFormulaObjectValue;

              console.log(
                "mainFormFields_legalformula_processFormulaObjectValue_key",
                formdata[formKeyAddOnTemp]
              );
            }

            if (formInElement.elementType.toLowerCase() == "trigger") {
              //DevNote:trigger type input//added on 22-02-2024
              console.log("mainFormFields_trigger_key", key);
              let triggerKeyValue = processTriggerInputKeyValue(
                formInElement.value
              );
              console.log(
                "mainFormFields_trigger_triggerKeyValue",
                triggerKeyValue
              );
              formdata[key] = "";

              if (
                triggerKeyValue[0] != undefined &&
                triggerKeyValue[0].length > 0 &&
                formdata[triggerKeyValue[0] + keyAddOnTemp] != undefined &&
                formdata[triggerKeyValue[0] + keyAddOnTemp].length > 0
              ) {
                console.log(
                  "mainFormFields_trigger_triggerKeyValue_formdata",
                  triggerKeyValue,
                  formdata[triggerKeyValue[0] + keyAddOnTemp]
                );
                if (
                  triggerKeyValue[1] != undefined &&
                  triggerKeyValue[1].length > 0
                ) {
                  formdata[formKeyAddOnTemp] = triggerKeyValue[1];
                }
                console.log(
                  "mainFormFields_trigger_key_formdata",
                  key,
                  formdata[formKeyAddOnTemp]
                );
              }
            }

            if (formInElement.elementType.toLowerCase() == "checkbox") {
              if (
                formInElement.elementConfig.type.toLowerCase() ==
                  "multiselectt1" ||
                formInElement.elementConfig.type.toLowerCase() ==
                  "multiselectt2" ||
                formInElement.elementConfig.type.toLowerCase() ==
                  "multiselectt3" ||
                formInElement.elementConfig.type.toLowerCase() ==
                  "multiselectt4" ||
                formInElement.elementConfig.type.toLowerCase() ==
                  "multiselectt5"
              ) {
                //Do Nothing
              } else {
                if (formdata[formKeyAddOnTemp] == undefined) {
                  formdata[formKeyAddOnTemp] = ""; //<- Hold Changes on 25-05-2021
                } else {
                  if (formdata[formKeyAddOnTemp].length > 0) {
                    formdata[formKeyAddOnTemp] = formInElement.value;
                  } else {
                    //DO Nothing
                  }
                }
              }
            }

            conditionalFormsFieldsDataSortedMain[formKeyAddOnTemp] =
              formInElement;
            console.log(
              "formFieldObjectFF-formKeyAddOnTemp1",
              formKeyAddOnTemp
            );
          });
        } else {
          //DoNothing
        }
      } else if (
        val.input.elementType.toLowerCase() == "checkbox" &&
        (val.input.elementConfig.type.toLowerCase() == "multiselectt1" ||
          val.input.elementConfig.type.toLowerCase() == "multiselectt2" ||
          val.input.elementConfig.type.toLowerCase() == "multiselectt3" ||
          val.input.elementConfig.type.toLowerCase() == "multiselectt4" ||
          val.input.elementConfig.type.toLowerCase() == "multiselectt5")
      ) {
        //AddedOn:13-12-2021

        console.log("process_multi_checkbox", val.input);

        val.multiSelectValue.forEach((selectedValue) => {
          console.log("process_multi_checkbox_selectedValue", selectedValue);

          //----------------------------------------------------
          if (
            val.input.condition.conditionStatements[selectedValue] != undefined
          ) {
            let keyAddOnTemp = "" + key + 0;
            conditionalFormsFieldsDataSorted = sortFormFields(
              val.input.condition.conditionStatements[selectedValue]
                .subFormFields.formFields
            );

            conditionalFormsFieldsDataSorted.forEach((formInElement) => {
              let formKeyAddOnTemp =
                formInElement.elementUId + "" + keyAddOnTemp;
              if (formInElement.isGlobal == true) {
                formKeyAddOnTemp = formInElement.elementUId; // + addition2key;
              }

              if (formInElement.elementType.toLowerCase() == "label") {
                formdata[formKeyAddOnTemp] = formInElement.value;
              }

              if (formInElement.elementType == "copyOfInput") {
                let mainParentFieldKey =
                  formInElement.value + "" + keyAddOnTemp;
                //console.log("copyOfInput_condi_mainParentFieldKey",mainParentFieldKey);
                if (formdata[mainParentFieldKey] != undefined) {
                  //console.log("copyOfInput_condi_mainParentFieldKey_form_value",formdata[mainParentFieldKey]);
                  const input = document.querySelector("#" + formKeyAddOnTemp);
                  if (input != null && input != undefined) {
                    // This will work by calling the native setter bypassing Reacts incorrect value change check
                    Object.getOwnPropertyDescriptor(
                      window.HTMLInputElement.prototype,
                      "value"
                    ).set.call(input, formdata[mainParentFieldKey]);
                    // This will trigger a new render wor the component
                    input.dispatchEvent(new Event("change", { bubbles: true }));
                  }
                  //console.log("copyOfInput_formData_"+formKeyAddOnTemp,formdata[formKeyAddOnTemp]);
                }
              }

              if (formInElement.elementType.toLowerCase() == "amount2words") {
                formdata[formKeyAddOnTemp] = digitAmountToWord(
                  formdata[formInElement.value + "" + keyAddOnTemp]
                );
              }

              if (formInElement.elementType.toLowerCase() == "formula") {
                let formulaObject = fetchFormulaObjectForConditionalElementV2(
                  formInElement.value,
                  keyAddOnTemp
                );
                var processFormulaObjectValue =
                  processFormulaObjectForConditionalElementV2(
                    formulaObject,
                    formdata,
                    keyAddOnTemp
                  );
                formdata[formKeyAddOnTemp] = processFormulaObjectValue;
              }

              if (formInElement.elementType.toLowerCase() == "strngformula") {
                let formulaObject =
                  fetchStringFormulaObjectForConditionalElementV2(
                    formInElement.value,
                    keyAddOnTemp
                  );
                let processFormulaObjectValue =
                  processStringFormulaObjectForConditionalElementV2(
                    formulaObject,
                    formdata,
                    keyAddOnTemp,
                    formInElement.elementConfig.type.toLowerCase()
                  );
                formdata[formKeyAddOnTemp] = processFormulaObjectValue;
              }

              if (formInElement.elementType.toLowerCase() == "legalformula") {
                //DevNote:legalformula//added on 24-02-2024//

                console.log("mainFormFields", "---- legalformula ----");
                console.log("mainFormFields_legalformula_key", key);
                console.log(
                  "mainFormFields_legalformula_val.value",
                  formInElement.value
                );
                console.log(
                  "mainFormFieldsformdata[key]_legalformula_" + key,
                  formdata[key]
                );
                let stringLegalObject =
                  fetchLegalFormulaObjectForConditionalElement(
                    formInElement.value,
                    keyAddOnTemp
                  );
                console.log(
                  "mainFormFields_legalformula_formulaObject",
                  stringLegalObject
                );
                let processLegalFormulaObjectValue =
                  processLegalFormulaObjectForConditionalElement(
                    stringLegalObject,
                    formdata,
                    keyAddOnTemp,
                    formInElement.elementConfig.type.toLowerCase()
                  );
                console.log(
                  "mainFormFields_legalformula_processFormulaObjectValue",
                  processLegalFormulaObjectValue
                );
                formdata[formKeyAddOnTemp] = processLegalFormulaObjectValue;

                console.log(
                  "mainFormFields_legalformula_processFormulaObjectValue_key",
                  formdata[formKeyAddOnTemp]
                );
              }

              if (formInElement.elementType.toLowerCase() == "trigger") {
                //DevNote:trigger type input//added on 22-02-2024
                console.log("mainFormFields_trigger_key", key);
                let triggerKeyValue = processTriggerInputKeyValue(
                  formInElement.value
                );
                console.log(
                  "mainFormFields_trigger_triggerKeyValue",
                  triggerKeyValue
                );
                formdata[key] = "";

                if (
                  triggerKeyValue[0] != undefined &&
                  triggerKeyValue[0].length > 0 &&
                  formdata[triggerKeyValue[0] + keyAddOnTemp] != undefined &&
                  formdata[triggerKeyValue[0] + keyAddOnTemp].length > 0
                ) {
                  console.log(
                    "mainFormFields_trigger_triggerKeyValue_formdata",
                    triggerKeyValue,
                    formdata[triggerKeyValue[0] + keyAddOnTemp]
                  );
                  if (
                    triggerKeyValue[1] != undefined &&
                    triggerKeyValue[1].length > 0
                  ) {
                    formdata[formKeyAddOnTemp] = triggerKeyValue[1];
                  }
                  console.log(
                    "mainFormFields_trigger_key_formdata",
                    key,
                    formdata[formKeyAddOnTemp]
                  );
                }
              }

              if (formInElement.elementType.toLowerCase() == "checkbox") {
                if (
                  formInElement.elementConfig.type.toLowerCase() ==
                    "multiselectt1" ||
                  formInElement.elementConfig.type.toLowerCase() ==
                    "multiselectt2" ||
                  formInElement.elementConfig.type.toLowerCase() ==
                    "multiselectt3" ||
                  formInElement.elementConfig.type.toLowerCase() ==
                    "multiselectt4" ||
                  formInElement.elementConfig.type.toLowerCase() ==
                    "multiselectt5"
                ) {
                  //Do Nothing
                } else {
                  if (formdata[formKeyAddOnTemp] == undefined) {
                    formdata[formKeyAddOnTemp] = ""; //<- Hold Changes on 25-05-2021
                  } else {
                    if (formdata[formKeyAddOnTemp].length > 0) {
                      formdata[formKeyAddOnTemp] = formInElement.value;
                    } else {
                      //DO Nothing
                    }
                  }
                }
              }

              conditionalFormsFieldsDataSortedMain[formKeyAddOnTemp] =
                formInElement;
              console.log(
                "formFieldObjectFF-formKeyAddOnTemp1",
                formKeyAddOnTemp
              );
            });
          }
          //----------------------------------------------------
        });
      } else {
        //populateCount
        let ifPopulateCount = 1;
        if (isNaN(val.inputValue)) {
          //DoNothing
        } else {
          if (
            (val.input.elementType.toLowerCase() == "input" ||
              val.input.elementType == "copyOfInput") &&
            (val.input.elementConfig.type.toLowerCase() == "number" ||
              val.input.elementConfig.type.toLowerCase() == "daystring" ||
              val.input.elementConfig.type.toLowerCase() == "monthstring")
          ) {
            ifPopulateCount = parseInt(val.inputValue);
          }
        }

        for (var i = 0; i < ifPopulateCount; i++) {
          let keyAddOnTemp = "" + key + i; //DevNoteDate: on 30-03-2021
          //let keyAddOnTemp = "" + val.input.elementUId + i;////DevNoteDate: on 30-03-2021
          conditionalFormsFieldsDataSorted = sortFormFields(
            val.input.condition.subFormFields.formFields
          );

          conditionalFormsFieldsDataSorted.forEach((formInElement) => {
            let formKeyAddOnTemp = formInElement.elementUId + "" + keyAddOnTemp;
            if (formInElement.isGlobal == true) {
              formKeyAddOnTemp = formInElement.elementUId; // + addition2key;
            }
            if (formInElement.elementType.toLowerCase() == "label") {
              formdata[formKeyAddOnTemp] = formInElement.value;
            }

            if (formInElement.elementType == "copyOfInput") {
              let mainParentFieldKey = formInElement.value + "" + keyAddOnTemp;
              if (formdata[mainParentFieldKey] != undefined) {
                const input = document.querySelector("#" + formKeyAddOnTemp);
                if (input != null && input != undefined) {
                  // This will work by calling the native setter bypassing Reacts incorrect value change check
                  Object.getOwnPropertyDescriptor(
                    window.HTMLInputElement.prototype,
                    "value"
                  ).set.call(input, formdata[mainParentFieldKey]);
                  // This will trigger a new render wor the component
                  input.dispatchEvent(new Event("change", { bubbles: true }));
                }
              }
            }

            if (formInElement.elementType.toLowerCase() == "amount2words") {
              formdata[formKeyAddOnTemp] = digitAmountToWord(
                formdata[formInElement.value + "" + keyAddOnTemp]
              );
            }

            if (formInElement.elementType.toLowerCase() == "formula") {
              let formulaObject = fetchFormulaObjectForConditionalElementV2(
                formInElement.value,
                keyAddOnTemp
              );
              var processFormulaObjectValue =
                processFormulaObjectForConditionalElementV2(
                  formulaObject,
                  formdata,
                  keyAddOnTemp
                );
              formdata[formKeyAddOnTemp] = processFormulaObjectValue;
            }

            if (formInElement.elementType.toLowerCase() == "strngformula") {
              let formulaObject =
                fetchStringFormulaObjectForConditionalElementV2(
                  formInElement.value,
                  keyAddOnTemp
                );
              var processFormulaObjectValue =
                processStringFormulaObjectForConditionalElementV2(
                  formulaObject,
                  formdata,
                  keyAddOnTemp,
                  formInElement.elementConfig.type.toLowerCase()
                );
              formdata[formKeyAddOnTemp] = processFormulaObjectValue;
            }

            if (formInElement.elementType.toLowerCase() == "legalformula") {
              //DevNote:legalformula//added on 24-02-2024//

              console.log("mainFormFields", "---- legalformula ----");
              console.log("mainFormFields_legalformula_key", key);
              console.log(
                "mainFormFields_legalformula_val.value",
                formInElement.value
              );
              console.log(
                "mainFormFieldsformdata[key]_legalformula_" + key,
                formdata[key]
              );
              let stringLegalObject =
                fetchLegalFormulaObjectForConditionalElement(
                  formInElement.value,
                  keyAddOnTemp
                );
              console.log(
                "mainFormFields_legalformula_formulaObject",
                stringLegalObject
              );
              let processLegalFormulaObjectValue =
                processLegalFormulaObjectForConditionalElement(
                  stringLegalObject,
                  formdata,
                  keyAddOnTemp,
                  formInElement.elementConfig.type.toLowerCase()
                );
              console.log(
                "mainFormFields_legalformula_processFormulaObjectValue",
                processLegalFormulaObjectValue
              );
              formdata[formKeyAddOnTemp] = processLegalFormulaObjectValue;

              console.log(
                "mainFormFields_legalformula_processFormulaObjectValue_key",
                formdata[formKeyAddOnTemp]
              );
            }

            if (formInElement.elementType.toLowerCase() == "trigger") {
              //DevNote:trigger type input//added on 22-02-2024
              console.log("mainFormFields_trigger_key", key);
              let triggerKeyValue = processTriggerInputKeyValue(
                formInElement.value
              );
              console.log(
                "mainFormFields_trigger_triggerKeyValue",
                triggerKeyValue
              );
              formdata[key] = "";

              if (
                triggerKeyValue[0] != undefined &&
                triggerKeyValue[0].length > 0 &&
                formdata[triggerKeyValue[0] + keyAddOnTemp] != undefined &&
                formdata[triggerKeyValue[0] + keyAddOnTemp].length > 0
              ) {
                console.log(
                  "mainFormFields_trigger_triggerKeyValue_formdata",
                  triggerKeyValue,
                  formdata[triggerKeyValue[0] + keyAddOnTemp]
                );
                if (
                  triggerKeyValue[1] != undefined &&
                  triggerKeyValue[1].length > 0
                ) {
                  formdata[formKeyAddOnTemp] = triggerKeyValue[1];
                }
                console.log(
                  "mainFormFields_trigger_key_formdata",
                  key,
                  formdata[formKeyAddOnTemp]
                );
              }
            }

            if (formInElement.elementType.toLowerCase() == "checkbox") {
              if (
                formInElement.elementConfig.type.toLowerCase() ==
                  "multiselectt1" ||
                formInElement.elementConfig.type.toLowerCase() ==
                  "multiselectt2" ||
                formInElement.elementConfig.type.toLowerCase() ==
                  "multiselectt3" ||
                formInElement.elementConfig.type.toLowerCase() ==
                  "multiselectt4" ||
                formInElement.elementConfig.type.toLowerCase() ==
                  "multiselectt5"
              ) {
                //Do Nothing
              } else {
                if (formdata[formKeyAddOnTemp] == undefined) {
                  formdata[formKeyAddOnTemp] = ""; //<- Hold Changes on 25-05-2021
                } else {
                  if (formdata[formKeyAddOnTemp].length > 0) {
                    formdata[formKeyAddOnTemp] = formInElement.value;
                  } else {
                    //DO Nothing
                  }
                }
              }
            }

            conditionalFormsFieldsDataSortedMain[formKeyAddOnTemp] =
              formInElement;
            // console.log(
            //   "formFieldObjectFF-formKeyAddOnTemp2",
            //   formKeyAddOnTemp
            // );
          });
        }
      }
    });

    Object.entries(formdata).map(([key, val]) => {
      //console.log("*--key--*", key);
      let formFieldObject = this.state.mainFormFields[key];
      //no_print
      //conditionalFormsFieldsDataSorted
      if (formFieldObject == undefined) {
        //console.log("*--formFieldObjectFF-Condotional1-*", conditionalFormInputs);
        console.log(
          "*--formFieldObjectFF-Condotional2-*",
          conditionalFormsFieldsDataSortedMain
        );
        formFieldObject = conditionalFormsFieldsDataSortedMain[key];
      }
      console.log("*--formFieldObjectFF-Key*", key);
      console.log("*--formFieldObjectFF--*", formFieldObject);

      if (formFieldObject == undefined) {
        template = template.replace(
          new RegExp(inPutFieldStartBlank + key + inPutFieldEndBlank, "gi"),
          val
        );

        console.log("formFieldObject_undefined", formFieldObject);
      } else {
        //console.log("--formFieldObject--", formFieldObject);
        if (formFieldObject.elementType.toLowerCase() == "label") {
          //formdata[key]=val.value
          if (formFieldObject.isHidden == true) {
            template = template.replace(
              new RegExp(inPutFieldStartBlank + key + inPutFieldEndBlank, "gi"),
              "<span class='no_print'>" + val + "</span>"
            );
          } else {
            template = template.replace(
              new RegExp(inPutFieldStartBlank + key + inPutFieldEndBlank, "gi"),
              val
            );
          }
        } else if (formFieldObject.elementType.toLowerCase() == "textarea") {
          if (formFieldObject.isHidden == true) {
            template = template.replace(
              new RegExp(inPutFieldStartBlank + key + inPutFieldEndBlank, "gi"),
              ""
            );
          } else {
            template = template.replace(
              new RegExp(inPutFieldStartBlank + key + inPutFieldEndBlank, "gi"),
              val.replace(new RegExp("\n", "gi"), "<br/>")
            );
          }
        } else if (formFieldObject.elementType.toLowerCase() == "checkbox") {
          //AddedOn: 13-12-2021
          if (
            formFieldObject.elementConfig.type.toLowerCase() ==
              "multiselectt1" ||
            formFieldObject.elementConfig.type.toLowerCase() ==
              "multiselectt2" ||
            formFieldObject.elementConfig.type.toLowerCase() ==
              "multiselectt3" ||
            formFieldObject.elementConfig.type.toLowerCase() ==
              "multiselectt4" ||
            formFieldObject.elementConfig.type.toLowerCase() == "multiselectt5"
          ) {
            // console.log("formFieldObject_Multi",formFieldObject)
            // console.log("formFieldObject_Multi_key",key)
            if (formFieldObject.isHidden == true) {
              // console.log("formFieldObject_Multi","is Hidden")
              template = template.replace(
                new RegExp(
                  inPutFieldStartBlank + key + inPutFieldEndBlank,
                  "gi"
                ),
                ""
              );
              // console.log("formFieldObject_Multi_template",template)
            } else {
              //Hidding Template as its Render as per SeletedValues in populateSubConditonalForm() function
              console.log("formFieldObject_", formFieldObject);
              if (formFieldObject.isConditional === true) {
                template = template.replace(
                  new RegExp(
                    inPutFieldStartBlank + key + inPutFieldEndBlank,
                    "gi"
                  ),
                  ""
                );
              } else {
                template = template.replace(
                  new RegExp(
                    inPutFieldStartBlank + key + inPutFieldEndBlank,
                    "gi"
                  ),
                  val
                );
              }
            }
          } else {
            //console.log("IsHiddenFF",formFieldObject)
            if (formFieldObject.isHidden == true) {
              template = template.replace(
                new RegExp(
                  inPutFieldStartBlank + key + inPutFieldEndBlank,
                  "gi"
                ),
                ""
              );
            } else {
              template = template.replace(
                new RegExp(
                  inPutFieldStartBlank + key + inPutFieldEndBlank,
                  "gi"
                ),
                val
              );
            }
          }
        } else {
          //console.log("IsHiddenFF",formFieldObject)
          if (formFieldObject.isHidden == true) {
            template = template.replace(
              new RegExp(inPutFieldStartBlank + key + inPutFieldEndBlank, "gi"),
              ""
            );
          } else {
            let value2Show = val;
            if (formFieldObject.valueStyle != undefined) {
              console.log("InputValueStyle", formFieldObject.valueStyle);
              console.log("InputValueStyle_formFieldObject", formFieldObject);

              if (
                formFieldObject.elementConfig.type.toLowerCase() == "number"
              ) {
                value2Show = rendringInputValueStyle(
                  formFieldObject.valueStyle,
                  val,
                  (formFieldObject.validation.maxLength + "").length + 1
                );
              } else if (
                formFieldObject.elementConfig.type.toLowerCase() == "text"
              ) {
                value2Show = rendringInputValueStyle(
                  formFieldObject.valueStyle,
                  val,
                  formFieldObject.validation.maxLength
                );
              } else {
                if (isNaN(val)) {
                  //i.e. Val is string/text type

                  console.log("InputValueStyle_isNaN_1", isNaN(val));
                  value2Show = rendringInputValueStyle(
                    formFieldObject.valueStyle,
                    val,
                    formFieldObject.validation.maxLength
                  );
                } else {
                  //is number
                  console.log("InputValueStyle_isNaN_2", isNaN(val));
                  value2Show = rendringInputValueStyle(
                    formFieldObject.valueStyle,
                    val,
                    (val + "").length
                  );
                }
              }

              console.log("InputValueStyle_value2Show", value2Show);
            }
            console.log("template_template_value2Show", value2Show);
            console.log("template_template_pre", template);
            template = template.replace(
              new RegExp(inPutFieldStartBlank + key + inPutFieldEndBlank, "gi"),
              value2Show
            );
            console.log("template_template_post", template);
          }
        }
      }
      //console.log("formFieldObject_template", template);
    });

    return template;
  }

  processConditionalFormFieldTemplate(
    mainFormTemplate,
    conditionalFormFieldInput,
    conditionalFormFieldValue,
    templateKey,
    level
  ) {
    console.log("processConditionalFormFieldTemplate_");
    console.log("processConditionalFormFieldTemplate_", mainFormTemplate);
    console.log(
      "processConditionalFormFieldTemplate_conditionalFormFieldInput",
      conditionalFormFieldInput
    );
    console.log(
      "processConditionalFormFieldTemplate_conditionalFormFieldValue",
      conditionalFormFieldValue
    );
    console.log(
      "this.state.conditionalFormInputs",
      this.state.conditionalFormInputs
    );
    console.log("processConditionalFormFieldTemplate_templateKey", templateKey);
    console.log("processConditionalFormFieldTemplate_level", level);
    console.log(
      "processConditionalFormFieldTemplate_formData",
      this.state.formData
    );

    let conditionalKeyValueTemplate = [];
    // let conditionalKeyValueTemplateTemp = [];
    Object.keys(this.state.formData).forEach((key) => {
      console.log("-------------conditionalKeyValueTemplate------------------");
      console.log("processConditionalFormFieldTemplate_formData_key", key);
      //let formFields=this.props.formsFieldsData.formFields;
      let formFieldObject = this.state.mainFormFields[key];
      let templateKeyTemp = ""; //formFieldObject.elementUId
      let multiSelectedValue = [];
      if (formFieldObject == undefined) {
        if (this.state.conditionalFormInputs[key] != undefined) {
          formFieldObject = this.state.conditionalFormInputs[key].input;
          templateKeyTemp = this.state.conditionalFormInputs[key].templateKey;
        }
      } else {
        templateKeyTemp = formFieldObject.elementUId;
      }

      console.log(
        "processConditionalFormFieldTemplate_formFieldObject",
        formFieldObject
      );
      console.log(
        "processConditionalFormFieldTemplate_TemplateKeyTemp",
        templateKeyTemp
      );

      //AddedOn: 13-12-2021
      if (
        formFieldObject != undefined &&
        formFieldObject.elementType.toLowerCase() == "checkbox" &&
        (formFieldObject.elementConfig.type.toLowerCase() == "multiselectt1" ||
          formFieldObject.elementConfig.type.toLowerCase() == "multiselectt2" ||
          formFieldObject.elementConfig.type.toLowerCase() == "multiselectt3" ||
          formFieldObject.elementConfig.type.toLowerCase() == "multiselectt4" ||
          formFieldObject.elementConfig.type.toLowerCase() == "multiselectt5")
      ) {
        if (
          this.state.conditionalFormInputs[key] != undefined &&
          this.state.conditionalFormInputs[key].multiSelectValue != undefined
        ) {
          console.log(
            "processConditionalFormFieldTemplate_multicheckboxValue_on_test",
            this.state.conditionalFormInputs[key].multiSelectValue
          );
          multiSelectedValue =
            this.state.conditionalFormInputs[key].multiSelectValue;
        }
      }

      //if(level>0){
      //  formFieldObject=conditionalFormFieldInput
      //}

      let formFieldValue = this.state.formData[key];

      console.log(
        "processConditionalFormFieldTemplate_formData_formFieldValue",
        formFieldValue
      );
      if (
        formFieldObject != undefined &&
        formFieldObject.isConditional == true
      ) {
        //console.log("formFieldValue", "IsCondtional");
        //console.log("formFieldValue.length", formFieldValue.length);

        let populateCountTemp = 0;
        if (formFieldValue.length > 0) {
          populateCountTemp = 1;
          if (isNaN(formFieldValue)) {
            //Do Nothing
          } else {
            //Populate Only if data is Number
            if (
              (formFieldObject.elementType.toLowerCase() == "input" ||
                formFieldObject.elementType == "copyOfInput") &&
              (formFieldObject.elementConfig.type.toLowerCase() == "number" ||
                formFieldObject.elementConfig.type.toLowerCase() ==
                  "daystring" ||
                formFieldObject.elementConfig.type.toLowerCase() ==
                  "monthstring")
            ) {
              populateCountTemp = parseInt(formFieldValue);
            }
          }
        }

        //console.log("populateCountTemp", populateCountTemp);
        let conditonalTemplate = "";
        if (populateCountTemp > 0) {
          conditonalTemplate = populateSubConditonalForm(
            formFieldObject,
            populateCountTemp,
            formFieldValue,
            templateKeyTemp,
            multiSelectedValue
          );
        }
        console.log("conditonalTemplate_on_test", conditonalTemplate);

        /*
        let testMainTemplateTemp = this.replaceTemplateKeyWithFormDataViewTT(
          mainFormTemplate,
          formFieldObject.elementUId,
          testTemplateTemp
        );
        console.log("testMainTemplateTemp", testMainTemplateTemp);
        */
        //Old

        conditionalKeyValueTemplate[templateKeyTemp] = conditonalTemplate;
        console.log(
          "conditionalKeyValueTemplate_key_and_template",
          templateKeyTemp,
          conditonalTemplate
        );
        console.log(
          "conditionalKeyValueTemplate_key_and_template_array",
          conditionalKeyValueTemplate
        );
        // conditionalKeyValueTemplateTemp.push({
        //   key: templateKeyTemp,
        //   template: conditonalTemplate,
        // });
        //this.state.cCall++;
        // console.log("conditionalKeyValueTemplate", conditionalKeyValueTemplate);
        // console.log(
        //   "conditionalKeyValueTemplate_temp",
        //   conditionalKeyValueTemplateTemp
        // );
        //New
        // conditionalKeyValueTemplate[
        //   templateKey
        // ] = conditonalTemplate;
      } else {
        console.log("formFieldValue", "IsNoCondtional");
      }
    });

    /*
    console.log("conditionalKeyValueTemplate", conditionalKeyValueTemplate);
    //console.log("conditionalKeyValueTemplate", conditionalKeyValueTemplate.length);
    console.log(
      "conditionalKeyValueTemplate",
      Object.keys(conditionalKeyValueTemplate).length
    );
    */
    //conditionalKeyValueTemplateTemp.push({key:templateKeyTemp,template:conditonalTemplate})
    if (Object.keys(conditionalKeyValueTemplate).length > 0) {
      let testMainTemplateTemp2 = replaceTemplateKeyWithFormDataViewTTV2(
        mainFormTemplate,
        conditionalKeyValueTemplate
      );

      /*
      let testMainTemplateTemp2 = replaceTemplateKeyWithFormDataViewNew(
        mainFormTemplate,
        conditionalKeyValueTemplate,
        conditionalKeyValueTemplateTemp
      );
      */

      console.log("testMainTemplateTemp2", testMainTemplateTemp2);
      this.setState({ mainDocFormTemplate: testMainTemplateTemp2 });
    } else {
      // console.log("conditionalFormFieldValue", conditionalFormFieldValue);

      //AddedOn: 14-12-2021 to Process MultiSelectedCheckBox
      /*
      let multiSelectedValue=[];
      if(conditionalFormFieldInput!=undefined && conditionalFormFieldInput.elementType.toLowerCase() == "checkbox" 
      && (conditionalFormFieldInput.elementConfig.type.toLowerCase() == "multiselectt1" ||
      conditionalFormFieldInput.elementConfig.type.toLowerCase() == "multiselectt2" ||
      conditionalFormFieldInput.elementConfig.type.toLowerCase() == "multiselectt3" ||
      conditionalFormFieldInput.elementConfig.type.toLowerCase() == "multiselectt4" ||
      conditionalFormFieldInput.elementConfig.type.toLowerCase() == "multiselectt5")){
        console.log(
          "processConditionalFormFieldTemplate_-multicheckboxValue",
          this.state.conditionalFormInputs[key].multiSelectValue
        );
        multiSelectedValue=this.state.conditionalFormInputs[key].multiSelectValue;
      }
      */

      let populateCount = 0;
      if (conditionalFormFieldValue.length > 0) {
        populateCount = 1;
        if (isNaN(conditionalFormFieldValue)) {
        } else {
          //conditionalFormFieldInput
          if (
            (conditionalFormFieldInput.elementType.toLowerCase() == "input" ||
              conditionalFormFieldInput.elementType == "copyOfInput") &&
            (conditionalFormFieldInput.elementConfig.type.toLowerCase() ==
              "number" ||
              conditionalFormFieldInput.elementConfig.type.toLowerCase() ==
                "daystring" ||
              conditionalFormFieldInput.elementConfig.type.toLowerCase() ==
                "monthstring")
          ) {
            populateCount = parseInt(conditionalFormFieldValue);
          }
        }
      }

      console.log("populateCount_on_test", populateCount);
      let testTemplate = "";
      if (populateCount > 0) {
        testTemplate = populateSubConditonalForm(
          conditionalFormFieldInput,
          populateCount,
          conditionalFormFieldValue,
          templateKey
        );
      }

      console.log("testTemplate_on_test", testTemplate);
      //console.log("formsTemplate", this.props.formsTemplate);
      console.log("mainFormTemplate_on_test", mainFormTemplate);

      let testMainTemplate = replaceTemplateKeyWithFormDataViewTT(
        mainFormTemplate,
        conditionalFormFieldInput.elementUId,
        testTemplate
      );
      console.log("testMainTemplate_On_test", testMainTemplate);
      this.setState({ mainDocFormTemplate: testMainTemplate });
    }
  }

  /*
  html2Print(htmlString) {
    console.log("html2Print_htmlString", htmlString);
    // let htmlString2Print=processPageBreakForBackEnd(this.state.testTemplateToShow);
    // htmlString=processPageBreakForJsPrint(
    //   document.getElementById("contentToPrint").innerHTML
    // )
    //htmlString=processPageBreakForJsPrint(htmlString)
    // console.log("html2Print_htmlString",htmlString)
    var win2Print = window.open("about:blank", "_new", "width=900,height=650");
    var isChrome = Boolean(win2Print.chrome);
    var isPrinting = false;
    // win2Print.document.open();//No Need Of This
    win2Print.document.write(htmlString);
    win2Print.document.close(); // necessary for IE >= 10 and necessary before onload for chrome
    if (isChrome) {
      win2Print.onload = function () {
        // wait until all resources loaded
        isPrinting = true;
        win2Print.focus(); // necessary for IE >= 10
        win2Print.print(); // change window to mywindow
        win2Print.close(); // change window to mywindow
        isPrinting = false;
      };
      setTimeout(function () {
        if (!isPrinting) {
          win2Print.print();
          win2Print.close();
        }
      }, 300);
    } else {
      win2Print.document.close(); // necessary for IE >= 10
      win2Print.focus(); // necessary for IE >= 10
      win2Print.print();
      win2Print.close();
    }
    return true;
  }
  */

  emailOrDownloadThisDoc(option) {
    //option:0==download PDF
    //option:-1==download WORD
    //option:1==Print
    //option:else email

    //filledDocFOrm
    console.log("-emailThisDoc-");
    //console.log("-emailThisDoc-componentRef", this.componentRef)
    //console.log("-emailThisDoc-componentRef_querySelector", this.componentRef.querySelector("#filledDocFOrm"))
    var content2Print = this.componentRef;
    const targetComponent2Print = content2Print.current || content2Print;

    /*
    html2canvas(targetComponent2Print).then(canvas => {
      //document.body.appendChild(canvas)
      console.log("_canvas",canvas)
    });
    */
    //document.querySelector("#filledDocFOrm")
    //console.log("-emailThisDoc_targetComponent2Print",targetComponent2Print)
    /*
    "@media print { body { -webkit-print-color-adjust: exact; } 
    @page { size: "+this.state.pageType+"; 
    margin: "+this.state.printMarginTop+"mm "
    +this.state.printMarginRight+"mm "
    +this.state.printMarginBottom+"mm "
    +this.state.printMarginLeft+"mm!important }}"
    */
    /*//Old
    var opt = {
      margin: [1, 1, 1, 1],
      filename: "myfile.pdf",
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2, dpi: 192, letterRendering: true },
      jsPDF: { unit: "mm", format: "letter", orientation: "portrait" },
    };
    */
    // margin [top, left, bottom, right]
    //margin: [Number(this.state.printMarginTop), Number(this.state.printMarginLeft), Number(this.state.printMarginBottom), Number(this.state.printMarginRight)],
    //format One of 'a3', 'a4' (Default),'a5' ,'letter' ,'legal'
    //margin: [1, 1, 1, 1],
    var pageTypeFormat = "a4";
    //var pageWidth=
    //A4 - 8.3 x 11.7 in
    //Legal - 8.5 x 14 in
    //Letter - 8.5 x 11 in
    //ForA4
    var pagesWidth = "8.3in"; //In Inches
    var pagesHeight = "11.7in"; //In Inches
    if (this.state.pageType != undefined && this.state.pageType.length > 1) {
      pageTypeFormat = this.state.pageType;
    }

    if (pageTypeFormat.toLowerCase() == "letter") {
      pagesWidth = "8.5in"; //In Inches
      pagesHeight = "11.0in"; //In Inches
    }
    if (pageTypeFormat.toLowerCase() == "legal") {
      pagesWidth = "8.5in"; //In Inches
      pagesHeight = "14.0in"; //In Inches
    }

    //in CM
    //Default Top:2
    //Default Bottom:2
    //Default Right:4
    //Default Left:4

    var setPrintMarginTop = 2;
    if (!isNaN(this.state.printMarginTop)) {
      setPrintMarginTop = Number(this.state.printMarginTop);
    }

    var setPrintMarginLeft = 4;
    if (!isNaN(this.state.printMarginLeft)) {
      setPrintMarginLeft = Number(this.state.printMarginLeft);
    }

    var setPrintMarginBottom = 2;
    if (!isNaN(this.state.printMarginBottom)) {
      setPrintMarginBottom = Number(this.state.printMarginBottom);
    }

    var setPrintMarginRight = 4;
    if (!isNaN(this.state.printMarginRight)) {
      setPrintMarginRight = Number(this.state.printMarginRight);
    }

    var opt = {
      margin: [
        setPrintMarginTop,
        setPrintMarginLeft,
        setPrintMarginBottom,
        setPrintMarginRight,
      ],
      filename: "docmaster_testrun_" + Date.now() + "_.pdf",
      image: { type: "jpeg", quality: 0.96 },
      html2canvas: { scale: 2, letterRendering: true },
      jsPDF: {
        unit: "pt",
        format: pageTypeFormat,
        orientation: "portrait",
        precision: 16,
        putOnlyUsedFonts: true,
        compress: true,
      },
    };
    console.log("ToPrint_", opt);
    //var htmlToPdf=html2pdf().set(opt).from(targetComponent2Print);//.save();
    //htmlToPdf.save(); //To Download

    const userData = reactLocalStorage.getObject("user_data");
    const userId = userData.id;
    const userEmail = userData.email_id;
    //console.log("userData", userData);

    var superThis = this;
    if (option == -1) {
      //Download Word

      let marginStye =
        "margin-right: " +
        setPrintMarginRight * 0.3937 +
        "in" +
        "; margin-left: " +
        setPrintMarginLeft * 0.3937 +
        "in" +
        "; margin-top: " +
        setPrintMarginTop * 0.3937 +
        "in" +
        "; margin-bottm: " +
        setPrintMarginBottom * 0.3937 +
        "in" +
        ";";

      let otherStye =
        "<style> @page{ size:" +
        pagesWidth +
        " " +
        pagesHeight +
        ";" +
        marginStye +
        " padding-left: 0pt; padding-right: 0pt; padding-top: 0pt; padding-bottom: 0pt; } </style>";

      var header =
        "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
        "xmlns:w='urn:schemas-microsoft-com:office:word' " +
        "xmlns='http://www.w3.org/TR/REC-html40'>" +
        "<head><meta charset='utf-8'><title>Export to Word Document</title>" +
        otherStye +
        "</head><body>";
      var footer = "</body></html>";
      //var htmlString=header+"<p>Hello World</p>"+footer//document.getElementById("contentToPrint").innerHTML

      var htmlString =
        header +
        processPageBreakForDoc(targetComponent2Print.innerHTML) +
        footer;
      //document.getElementById("contentToPrint").innerHTML
      console.log("htmlString_", htmlString);

      var source =
        "data:application/vnd.ms-word;charset=utf-8," +
        encodeURIComponent(htmlString);
      var fileDownload = document.createElement("a");
      document.body.appendChild(fileDownload);
      fileDownload.href = source;
      fileDownload.download = "DocMaster_TestRun_" + Date.now() + "_.doc";
      fileDownload.click();
      document.body.removeChild(fileDownload);

      //processPageBreakForDoc
    } else if (option == 0) {
      //Download PDF
      /*
      var htmlToPdf = html2pdf().set(opt).from(targetComponent2Print); //.save();
      htmlToPdf.save(); //To Download
      */
      /*
     console.log("filename_margin",{
      top: setPrintMarginTop + " cm",
      left: setPrintMarginLeft + " cm",
      right: setPrintMarginRight + " cm",
      bottom: setPrintMarginBottom + " cm",
    })
    */
      //console.log("filename_pageTypeFormat",pageTypeFormat)
      // savePDF(targetComponent2Print, {
      //   forcePageBreak: ".pageBreakCode",
      //   scale: 0.76,
      //   paperSize: pageTypeFormat,
      //   fileName: "docmaster_testrun_" + Date.now() + "_.pdf",
      //   margin: {
      //     top: setPrintMarginTop + "cm",
      //     left: setPrintMarginLeft + "cm",
      //     right: setPrintMarginRight + "cm",
      //     bottom: setPrintMarginBottom + "cm",
      //   },
      // });
    } else if (option == 1) {
      //print
      /*
      html2pdf()
        .set(opt)
        .from(targetComponent2Print)
        .toPdf()
        .get("pdf")
        .then(function (pdfObj) {
          // pdfObj has your jsPDF object in it, use it as you please!
          // For instance (untested):
          pdfObj.autoPrint();
          window.open(pdfObj.output("bloburl"), "_blank");
        });
        */

      // let tableStyle =" table{border: inherit;} table,tr{border: inherit;} table,tr,td{border: inherit;}";

      let tableStyle =
        "table{border:inherit;}" + "table,tr{}" + "table,tr,td{}";
      let marginStye =
        "margin-right: " +
        setPrintMarginRight * 0.3937 +
        "in" +
        "; margin-left: " +
        setPrintMarginLeft * 0.3937 +
        "in" +
        "; margin-top: " +
        setPrintMarginTop * 0.3937 +
        "in" +
        "; margin-bottm: " +
        setPrintMarginBottom * 0.3937 +
        "in" +
        ";";

      let otherStye =
        "<style> @page{ size:" +
        pagesWidth +
        " " +
        pagesHeight +
        ";" +
        marginStye +
        " padding-left: 0pt; padding-right: 0pt; padding-top: 0pt; padding-bottom: 0pt; } " +
        tableStyle +
        "</style>";

      var header =
        "<html>" + "<head><meta charset='utf-8'>" + otherStye + "</head><body>";
      var footer = "</body></html>";
      //var htmlString=header+"<p>Hello World</p>"+footer//document.getElementById("contentToPrint").innerHTML

      var htmlString =
        header +
        processPageBreakForJsPrint(targetComponent2Print.innerHTML) +
        footer;
      //document.getElementById("contentToPrint").innerHTML
      console.log("htmlString_", htmlString);
      // this.html2Print(targetComponent2Print);//Done on 20-12-2021
      htmlString2Print(htmlString); //Done on 20-12-2021
      // drawDOM(targetComponent2Print, {
      //   forcePageBreak: ".pageBreakCode",
      //   scale: 0.76,
      //   paperSize: pageTypeFormat,
      //   fileName: "docmaster_testrun_" + Date.now() + "_.pdf",
      //   margin: {
      //     top: setPrintMarginTop + " cm",
      //     left: setPrintMarginLeft + " cm",
      //     right: setPrintMarginRight + " cm",
      //     bottom: setPrintMarginBottom + " cm",
      //   },
      // })
      //   .then((group) => {
      //     return exportPDF(group);
      //   })
      //   .then((dataUri) => {
      //     //console.log("dataUri_",dataUri);
      //     //console.log(dataUri.split(";base64,")[1]);
      //     //window.open(dataUri, "_blank");
      //     var dataFromUri = dataURItoBlob(dataUri);
      //     //window.open(dataFromUri, "_blank");
      //     //var file = new Blob([dataUri.split(";base64,")[1]], {type: 'application/pdf'});
      //     var fileURL = URL.createObjectURL(dataFromUri);
      //     window.open(fileURL, "_blank"); //To Open in Other Tab
      //     /*//ToPrint
      //       var winparams = 'dependent=yes,locationbar=no,scrollbars=yes,menubar=yes,'+
      //       'resizable,screenX=50,screenY=50,width=850,height=1050';
      //         var htmlPop = '<embed width=100% height=100%'
      //                         + ' type="application/pdf"'
      //                         + ' src="'+ fileURL+ '"></embed>';
      //         var printWindow = window.open ("", "PDF", winparams);
      //         printWindow.document.write (htmlPop);
      //         printWindow.print();
      //         */
      //   });
    } else {
      /*
      drawDOM(targetComponent2Print, {
        forcePageBreak: ".pageBreakCode",
        scale: 0.76,
        paperSize: pageTypeFormat,
        fileName: "docmaster_testrun_" + Date.now() + "_.pdf",
        margin: {
          top: setPrintMarginTop + " cm",
          left: setPrintMarginLeft + " cm",
          right: setPrintMarginRight + " cm",
          bottom: setPrintMarginBottom + " cm",
        },
      })
        .then((group) => {
          return exportPDF(group);
        })
        .then((dataUri) => {
          //console.log("dataUri_",dataUri);
          //console.log(dataUri.split(";base64,")[1]);
          //window.open(dataUri, "_blank");
          var dataFromUri = dataURItoBlob(dataUri);
          //window.open(dataFromUri, "_blank");
          //var file = new Blob([dataUri.split(";base64,")[1]], {type: 'application/pdf'});
          //dataFromUri.fileName="docMaster_docForms.pdf"
          //dataFromUri.name="docMaster_docForms.pdf"
          console.log("dataFromUri", dataFromUri);
          const formData = new FormData();
          formData.append("file", dataFromUri); //DataURI To File Converstion
          formData.append("emailAddresses", userEmail);
          formData.append("userId", userId);
          formData.append("docFormId", superThis.state.formId);
          //console.log("file", dataFromUri);
          //console.log("userEmail", userEmail);
          //console.log("userId", userId);
          //console.log("docFormId", superThis.state.formId);

          //formData.append("action", "initial_raw_file_upload");
          //formData.append("adminUserId", userId);
          //formData.append("files", dataURItoBlob(pdfAsString));
          //formData.append("formName", "formName");
          superThis.sendFileToUserEmail(formData);
        });
        */
      /*
      html2pdf()
        .from(targetComponent2Print)
        .set(opt)
        .toPdf()
        .output("datauristring")
        .then(function (pdfAsString) {
          // The PDF has been converted to a Data URI string and passed to this function.
          // Use pdfAsString however you like (send as email, etc)!

          //console.log("pdfAsString1",pdfAsString);
          //var arr = pdfAsString.split(',');
          //pdfAsString= arr[1];
          //console.log("pdfAsString2",pdfAsString);
          //emailAddresses:text(can be multiple comma seperated),
          //userId:text(can be null)(store null if sent -1),
          //docFormId:text

          var dataFromUri = dataURItoBlob(pdfAsString);
          //dataFromUri.fileName="docMaster_docForms.pdf"
          //dataFromUri.name="docMaster_docForms.pdf"
          console.log("dataFromUri", dataFromUri);

          const formData = new FormData();
          formData.append("file", dataFromUri); //DataURI To File Converstion
          formData.append("emailAddresses", userEmail);
          formData.append("userId", userId);
          formData.append("docFormId", superThis.state.formId);

          console.log("file", dataFromUri);
          console.log("userEmail", userEmail);
          console.log("userId", userId);
          console.log("docFormId", superThis.state.formId);

          //formData.append("action", "initial_raw_file_upload");
          //formData.append("adminUserId", userId);
          //formData.append("files", dataURItoBlob(pdfAsString));
          //formData.append("formName", "formName");

          superThis.sendFileToUserEmail(formData);
        });
        */
    }
  }

  /*
  sendFileToUserEmail(formData) {
    //console.log("testings", "sendFileToUserEmail");
    toast.success("Sending DocForm to eMail...", { autoClose: 400 });

    let header2Post = {};
    header2Post["content-type"] = "application/json";
    header2Post[apiKey] = apiKeyValue;

    //WSRawDocUpload
    //WSSendDocToUserByEmail

    // axios
    //   .post(WSSendDocToUserByEmail, formData, {
    //     headers: header2Post,
    //   })
    //   .then((response) => {
    //     console.log("", response.data);
    //     const responseData = response.data;
    //     console.log("", responseData.result_code);
    //     toast.success(responseData.result_message, { autoClose: 1000 });
    //   })
    //   .catch((error) => {
    //     console.log("error", error);
    //   });
  }
  */

  render() {
    return (
      <div className="col-12">
        <Form
          onSubmit={this.onFormSubmit}
          ref={(el2) => (this.componentRef2 = el2)}
          className=""
        >
          <ReactTooltip />
          <div className="row col-12">
            <div
              className="col-4"
              style={{
                backgroundColor: "whitesmoke",
                boxShadow: "0 0 1px gray",
                padding: "5px 10px",
              }}
            >
              {console.log("this.state.formData", this.state.formData)}
              {InputFieldRendring(
                this.state.formsFieldsDataSorted,
                this.state.conditionalFormInputs,
                this.onInputChange.bind(this),
                this.state.formData
              )}
            </div>

            <div
              className="col-8 "
              style={{
                boxShadow: "0 0 1px gray",
              }}
              id="contentToPrint"
            >
              <div
                id="contentToPrintInner"
                style={{
                  fontFamily: "'Times New Roman', Times, serif",
                }}
                className="contentToPrintTableProps"
                ref={(el) => (this.componentRef = el)}
                dangerouslySetInnerHTML={{
                  __html: processPageBreak(this.state.testTemplateToShow),
                }}
                //Old
                // dangerouslySetInnerHTML={{
                //   __html: processPageBreak(
                //     this.replaceTemplateKeyWithFormDataView(
                //       this.state.mainDocFormTemplate,
                //       this.state.formData
                //     )
                //   ),
                // }}
              />
            </div>
            {/* <hr/>
              <div
                className="col-8 outTemplateSectionForPrintSelect px-3 mt-1 mb-1"
                style={{ boxShadow: "0 0 5px gray", fontFamily:"'Times New Roman', Times, serif" }}
                // ref={(el) => (this.componentRef = el)}
                dangerouslySetInnerHTML={{
                  __html: processPageBreak(this.state.testTemplateToShow),
                }}
              /> */}
            <div
              className="col-12 py-3"
              style={{ display: "flex", justifyContent: "space-evenly" }}
            >
              <button type="submit" className="btn btn-primary btn sm">
                Sumbit(Test)
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  this.setState({ showFilledForm: true });
                }}
              >
                Show Printable/Template
              </button>
            </div>
          </div>
        </Form>

        <div className="col-12" id="filledFormRealTimePreview">
          <Modal
            transparent={false}
            ariaHideApp={false}
            isOpen={this.state.showFilledForm}
            onRequestClose={() => {
              this.setState({ showFilledForm: false });
            }}
            style={{ zIndex: 9999 }}
          >
            <div className="row">
              <div className="col-6">
                {/* "@media print { body { -webkit-print-color-adjust: exact; } @page { size: "+this.state.pageType+"; margin: 10mm !important }}" */}
                {/* margin: top right bottom left */}
                <ReactToPrint
                  documentTitle="DocMaster_TestRun_Print"
                  pageStyle={`
                    @media print {
                      @page {
                        size: A4;
                        margin: 0 50px 0 50px !important; 
                        padding:50px 0!important;
                      }
                      body {
                        -webkit-print-color-adjust: exact;
                        margin: 0;
                        padding: 0;
                       
                      }
                    }
                  `}
                  trigger={() => {
                    // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
                    // to the root node of the returned component as it will be overwritten.
                    return (
                      <button className="no_print btn btn-sm btn-outline-primary mb-3">
                        <i
                          style={{ fontSize: 20 }}
                          className="fa fa-print"
                          aria-hidden="true"
                        ></i>{" "}
                        Print
                      </button>
                    );
                  }}
                  content={() => this.componentRef}
                />
                {/* &nbsp; 
                <button
                  style={{ fontSize: 16 }}
                  className="no_print btn btn-outline-primary mb-3"
                  onClick={() => this.emailOrDownloadThisDoc(1)}
                >
                  <i
                    style={{ fontSize: 20 }}
                    className="fa fa-print"
                    aria-hidden="true"
                  ></i>{" "}
                  Print
                </button> */}
                &nbsp; &nbsp;
                <button
                  style={{ fontSize: 16 }}
                  className="no_print btn btn-sm btn-outline-primary mb-3"
                  onClick={() => this.emailOrDownloadThisDoc(-1)}
                >
                  Download(Word/docx)
                </button>
                &nbsp; &nbsp;
                {/* <button
                  style={{ fontSize: 16 }}
                  className="no_print btn btn-outline-primary mb-3"
                  onClick={() => this.emailOrDownloadThisDoc(0)}
                >
                  Download(PDF)
                </button>
                &nbsp; &nbsp; */}
                {/* <button
                  className="no_print btn btn-primary mb-3"
                  onClick={() => this.emailOrDownloadThisDoc(2)}
                >
                  eMail
                </button> */}
              </div>
              <div className="col-6" style={{ textAlign: "end" }}>
                <span
                  className="pointer"
                  onClick={() => {
                    this.setState({ showFilledForm: false });
                  }}
                  style={{ cursor: "pointer" }}
                >
                  X
                </span>
              </div>
            </div>
            <div
              id="filledDocForm"
              className="outTemplateSectionForPrintSelect contentToPrintTableProps"
              style={{
                fontFamily: "'Times New Roman', Times, serif",
              }}
              ref={(el) => (this.componentRef2 = el)}
              dangerouslySetInnerHTML={{
                __html: processPageBreak(this.state.testTemplateToShow),
              }}
              //Old
              // dangerouslySetInnerHTML={{
              //   __html: processPageBreak(
              //     this.replaceTemplateKeyWithFormDataView(
              //       this.state.mainDocFormTemplate,
              //       this.state.formData
              //     )
              //   ),
              // }}
            />
          </Modal>
        </div>
      </div>
    );
  }
}

export default DocmasterCoreTestRunPopUp;
