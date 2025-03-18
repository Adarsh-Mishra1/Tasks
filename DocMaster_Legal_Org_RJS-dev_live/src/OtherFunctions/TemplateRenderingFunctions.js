import {
  atan2,
  chain,
  derivative,
  e,
  evaluate,
  log,
  pi,
  pow,
  round,
  sqrt,
} from "mathjs";
import Moment from "moment";

import {
  getAgeFromDate,
  getDaysFromDate,
  decimalNumberFormatter,
  month2MonthString,
} from "./OtherFunctions";

import {
  calculateLegalFeeCourtDelhiAndChd,
  pecuniaryJuridictionComrclDsptDelhiCrt,
  chequeUnPaidOffenceString,
} from "./legalFeeCalculator/FeeCalculatorSub0";

export const processTriggerInputKeyValue = (keyValue) => {
  console.log("processTriggerInputKeyValue_trigger", keyValue);
  return keyValue.split("::");
};

export const onMultiSelectCheckBoxClick = (
  selectedValues,
  type,
  maxSelect,
  minSelect
) => {
  console.log("onMultiSelectCheckBoxClick_tempValue", selectedValues);
  console.log("onMultiSelectCheckBoxClick_tempValue_type", type);
  var array2Index = "";
  selectedValues = selectedValues.split(",");
  if (selectedValues.length > maxSelect) {
    //console.log("CustomMultiCheckBox_max","Max Select Exuasted");
    // selectedValues.pop();
    alert("Can't Select more than " + maxSelect);
  } else if (selectedValues.length < minSelect) {
    //console.log("CustomMultiCheckBox_min","Min Select Exuasted");
    alert("Select at least " + minSelect);
  } else {
    for (var i = 0; i < selectedValues.length; i++) {
      if (type == "multiselectt1") {
        array2Index += i + 1 + ". " + selectedValues[i] + "<br>";
      } else if (type == "multiselectt2") {
        array2Index += selectedValues[i] + ", ";
      } else if (type == "multiselectt3") {
        array2Index += selectedValues[i] + "<br>";
      } else if (type == "multiselectt4") {
        //Ordered
        array2Index += "<li>" + selectedValues[i] + "</li>";
      } else if (type == "multiselectt5") {
        //UnOrdered
        array2Index += "<li>" + selectedValues[i] + "</li>";
      }
    }
    //DevNote[27-03-2023]: CodeToHandle OL or UL
    if (type == "multiselectt4") {
      //Ordered
      array2Index = "<ol>" + array2Index + "</ol>";
    }
    if (type == "multiselectt5") {
      //UnOrdered
      array2Index = "<ul>" + array2Index + "</ul>";
    }
  }
  console.log("onMultiSelectCheckBoxClick_tempValue_array2Index", array2Index);
  return array2Index;
};

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function rendringInputValueStyle(styles, value, maxLength) {
  if (styles.length > 0) {
    if (styles.some((item) => item === "commasepnum1")) {
      value = numberWithCommas(value);
    }

    if (styles.some((item) => item === "allcaps")) {
      value = value.toUpperCase(); // Returns "HELLO WORLD!"
    }

    if (styles.some((item) => item === "boxed")) {
      value = boxedChars(value, maxLength);
    }
  }
  return value;
}

function boxedChars(value, maxLength) {
  var sp = "";
  for (var i = 0; i < maxLength; i++) {
    var html = value.substr(i, 1);
    //display: inline;
    if (html == "" || html == " ") {
      html = "&nbsp; &nbsp; ";
    } else {
      html = "&nbsp;" + html + "&nbsp;";
    }
    sp +=
      "<span style='display:inline-block; text-align:center; border: 1px solid rgba(0,0,0,0.3); min-width:25px '>" +
      html +
      "</span>&nbsp;";
  }
  return sp;
}

function getKeysFromTemplateString(templateString) {
  var keysFound = [], // an array to collect the strings that are found
    rxp = /{([^}]+)}/g,
    // str = "a {string} with {curly} braces",
    curMatch;
  while ((curMatch = rxp.exec(templateString))) {
    keysFound.push(curMatch[1]);
  }
  // console.log( keysFound );    // ["string", "curly"]
  return keysFound;
}

//TemplateRenderingFunctions.js
export function addAddtionalKeyToSubTemplate(
  formFieldInput,
  inputfields,
  subFormTemplate,
  keyAddOn,
  loopCount
) {
  // console.log(
  //   "addAddtionalKeyToSubTemplate_inputfields",
  //   "---------------------------"
  // );
  // console.log("addAddtionalKeyToSubTemplate_formFieldInput.elementUId");
  // console.log("addAddtionalKeyToSubTemplate_inputfields", inputfields);
  // console.log("addAddtionalKeyToSubTemplate_subFormTemplate", subFormTemplate);
  // console.log("addAddtionalKeyToSubTemplate_keyAddOn", keyAddOn);
  // console.log("addAddtionalKeyToSubTemplate_loopCount", loopCount);

  // console.log(
  //   "addAddtionalKeyToSubTemplate_subParentKey",
  //   keyAddOn.replace(formFieldInput.elementUId, "")
  // );

  // console.log("addAddtionalKeyToSubTemplate_otherFieldsTemplateInKeys_getKeysFromTemplateString",getKeysFromTemplateString(subFormTemplate))
  let otherFieldsTemplateInKeys = getKeysFromTemplateString(subFormTemplate); //subFormTemplate.split(/{([^}]*)}/);
  // console.log(
  //   "addAddtionalKeyToSubTemplate_otherFieldsTemplateInKeys",
  //   otherFieldsTemplateInKeys
  // );

  // var mySubString = subFormTemplate.match(new RegExp(/{([^}]*)}/));
  // console.log("addAddtionalKeyToSubTemplate_otherFieldsTemplateInKeys_mySubString",mySubString)

  if (otherFieldsTemplateInKeys.length > 0) {
    // console.log(
    //   "addAddtionalKeyToSubTemplate_otherFieldsTemplateInKeys.length",
    //   otherFieldsTemplateInKeys.length
    // );

    otherFieldsTemplateInKeys.forEach((otherFieldsTemplateInKey) => {
      // console.log(
      //   "addAddtionalKeyToSubTemplate_otherFieldsTemplateInKey",
      //   otherFieldsTemplateInKey
      // );
      if (otherFieldsTemplateInKey.replace(/\s/g, "").length > 0) {
        // console.log(
        //   "addAddtionalKeyToSubTemplate_otherFieldsTemplateInKey",
        //   otherFieldsTemplateInKey
        // );

        let templateKeyCombination = otherFieldsTemplateInKey.split(".");

        if (templateKeyCombination.length > 1) {
          let templateKeyCombinationString = "";

          // templateKeyCombinationString=templateKeyCombination[1] + templateKeyCombination[0]//DevNote[AddedOn]:old flow
          // console.log("templateKeyCombinationString_pre",templateKeyCombination[1] + templateKeyCombination[0]);

          for (let i = templateKeyCombination.length - 1; i >= 0; i--) {
            // console.log("templateKeyCombinationString_i",i);
            templateKeyCombinationString =
              templateKeyCombinationString + templateKeyCombination[i];
            // console.log("templateKeyCombinationString_templateKeyCombination",templateKeyCombination);
            // console.log("templateKeyCombinationString_templateKeyCombination_add_on",keyAddOn.replace(formFieldInput.elementUId, ""));
            // console.log("templateKeyCombinationString_templateKeyCombination_formFieldInput",formFieldInput);
          }

          //DevNote[AddedOn]:16-03-2022: temperary Solution
          if (templateKeyCombination.length > 3) {
            //DevNote[AddedOn]:22-03-2022, To Be working with Global
            // console.log("templateKeyCombinationString_zero_>3","Start");
            templateKeyCombinationString =
              templateKeyCombinationString +
              "0" +
              keyAddOn.replace(formFieldInput.elementUId, "") +
              "0"; //Old
            // console.log("templateKeyCombinationString_zero_>3","end");
          } else if (templateKeyCombination.length > 2) {
            //DevNote[Flow]:will work with fields at same level
            templateKeyCombinationString =
              templateKeyCombinationString +
              keyAddOn.replace(formFieldInput.elementUId, "") +
              "0"; //Old
            /*NotWorking
            let zeroExtention="";
            for (let j = templateKeyCombination.length-3; j >= 0; j--) {
              zeroExtention=zeroExtention+"0";
            }
            console.log("templateKeyCombinationString_zero","Start");
            console.log("templateKeyCombinationString_zero_keyAddOn",keyAddOn);
            console.log("templateKeyCombinationString_zero_formFieldInput.elementUId",formFieldInput.elementUId);
            console.log("templateKeyCombinationString_zero_templateKeyCombinationString",templateKeyCombinationString);
            console.log("templateKeyCombinationString_zero_keyAddOn.replace",keyAddOn.replace(formFieldInput.elementUId, ""));
            console.log("templateKeyCombinationString_zero_templateKeyCombination",templateKeyCombination);
            console.log("templateKeyCombinationString_zero_zeroExtention",zeroExtention);
            console.log("templateKeyCombinationString_zero_keyAddOn","End");
            // templateKeyCombinationString=templateKeyCombinationString+keyAddOn.replace(formFieldInput.elementUId, "")+zeroExtention;
            console.log("templateKeyCombinationString_zero_templateKeyCombinationString2Return",templateKeyCombinationString);
            console.log("templateKeyCombinationString_zero","End");
            */
          } else {
            //DevNote[Flow]:Below is Original
            templateKeyCombinationString =
              templateKeyCombinationString +
              keyAddOn.replace(formFieldInput.elementUId, "");
          }

          // console.log("templateKeyCombinationString_post",templateKeyCombinationString);
          // console.log(
          //   "addAddtionalKeyToSubTemplate_templateKeyCombination",
          //   templateKeyCombination
          // );
          //DevNotes[ModifyOn]: 16-03-2022
          subFormTemplate = subFormTemplate.replace(
            new RegExp("{" + otherFieldsTemplateInKey + "}", "gi"),
            "{" + templateKeyCombinationString + "}"
          );
          //Old
          // subFormTemplate = subFormTemplate.replace(
          //   new RegExp("{" + otherFieldsTemplateInKey + "}", "gi"),
          //   "{" +
          //     templateKeyCombination[1] +
          //     templateKeyCombination[0] +
          //     keyAddOn.replace(formFieldInput.elementUId, "") +
          //     "}"
          // );
        }
      }
    });
  }

  if (inputfields != null && inputfields != undefined) {
    // console.log("-addAddtionalKeyToSubTemplate-");
    // console.log("inputfields", inputfields);
    // console.log("subFormTemplate", subFormTemplate);
    // console.log("keyAddOn", keyAddOn);
    /*
    Object.keys(inputfields).map(
      (key,val) =>
        (
          subFormTemplate = subFormTemplate.replace(
          new RegExp("{" + key + "}", "gi"),
          "{" + key + keyAddOn + "}"
        )          
        )
        //console.log("ssads")
    );
    */
    Object.keys(inputfields).forEach(function (key) {
      //console.log("-key-", key);
      //console.log("testFields_key", formFields[key]);
      //formsFieldsDataSortedTemp.push(formFields[key]);
      let inputfield = inputfields[key];
      //console.log("inputfield", inputfield);
      if (inputfield.isGlobal == true) {
        subFormTemplate = subFormTemplate.replace(
          new RegExp("{" + key + "}", "gi"),
          "{" + key + "}"
        );
      } else {
        subFormTemplate = subFormTemplate.replace(
          new RegExp("{" + key + "}", "gi"),
          "{" + key + keyAddOn + "}"
        );
      }
      //console.log("subFormTemplate", subFormTemplate);
    });
  }

  console.log(
    "addAddtionalKeyToSubTemplate_subFormTemplate_toreturn",
    subFormTemplate
  );

  //[SHW_CNT]//To Add/Show Count, s.no. like 1,2,3,4,5,6
  //[SHW_CNT_ALP]//To Add/Show Count, s.no. like A,B,C,D,E,F
  //[SHW_CNT_ALP_L]//To Add/Show Count, s.no. like a,b,c,d
  //[SHW_HYN]//To Add/Show HYPHEN(-) i.e. &#8209;
  //[SHW_BLT]//To Add/Show Bullets i.e. &#8226;
  //[SHW_TBLT]//To Add/Show TRIANGULAR BULLET i.e. &#8227;
  //[SHW_SLPA]//To Add/SINGLE LEFT-POINTING ANGLE QUOTATION MARK(<) i.e. &#8249;
  //[SHW_SRPA]//To Add/SINGLE Right-POINTING ANGLE QUOTATION MARK(>) i.e. &#8250;
  //[SHW_DLPA]//To Add/DOUBLE LEFT-POINTING ANGLE QUOTATION MARK(<<) i.e. &#171;
  //[SHW_DRPA]//To Add/DOUBLE Right-POINTING ANGLE QUOTATION MARK(<>) i.e. &#187;
  //[SHW_CNT_RMN]//To Add/Show Roman Counting
  //[SHW_CNT_ORD_SUP]
  if (subFormTemplate.indexOf("[SHW_CNT]") > 0) {
    return subFormTemplate.replace("[SHW_CNT]", loopCount + 1);
  } else if (subFormTemplate.indexOf("[SHW_CNT_ALP]") > 0) {
    return subFormTemplate.replace(
      "[SHW_CNT_ALP]",
      (loopCount + 1 + 9).toString(36).toUpperCase()
    );
  } else if (subFormTemplate.indexOf("[SHW_CNT_ALP_L]") > 0) {
    return subFormTemplate.replace(
      "[SHW_CNT_ALP_L]",
      (loopCount + 1 + 9).toString(36).toLowerCase()
    );
  } else if (subFormTemplate.indexOf("[SHW_CNT_ORD_SUP]") > 0) {
    return subFormTemplate.replace(
      "[SHW_CNT_ORD_SUP]",
      ordinal_suffix_sup_of(loopCount + 1)
    );
  } else if (subFormTemplate.indexOf("[SHW_CNT_RMN]") > 0) {
    // console.log("custom_chw_cnt","[SHW_CNT_RMN]")
    return subFormTemplate.replace("[SHW_CNT_RMN]", intToRoman(loopCount + 1));
  } else {
    return subFormTemplate;
  }
}

function intToRoman(num) {
  // console.log("custom_chw_cnt_intToRoman",num)
  if (typeof num !== "number" || num <= 0 || num > 3999) {
    return "Invalid number. Please enter a positive integer between 1 and 3999.";
  }
  let roman = "";

  roman += "M".repeat(num / 1000);
  num %= 1000;
  roman += "CM".repeat(num / 900);
  num %= 900;
  roman += "D".repeat(num / 500);
  num %= 500;
  roman += "CD".repeat(num / 400);
  num %= 400;
  roman += "C".repeat(num / 100);
  num %= 100;
  roman += "XC".repeat(num / 90);
  num %= 90;
  roman += "L".repeat(num / 50);
  num %= 50;
  roman += "XL".repeat(num / 40);
  num %= 40;
  roman += "X".repeat(num / 10);
  num %= 10;
  roman += "IX".repeat(num / 9);
  num %= 9;
  roman += "V".repeat(num / 5);
  num %= 5;
  roman += "IV".repeat(num / 4);
  num %= 4;
  roman += "I".repeat(num);

  return roman;
}

function ordinal_suffix_of(i) {
  var j = i % 10,
    k = i % 100;
  if (j == 1 && k != 11) {
    return i + "st";
  }
  if (j == 2 && k != 12) {
    return i + "nd";
  }
  if (j == 3 && k != 13) {
    return i + "rd";
  }
  return i + "th";
}

function ordinal_suffix_sup_of(i) {
  var j = i % 10,
    k = i % 100;
  if (j == 1 && k != 11) {
    return i + "<sup>st</sup>";
  }
  if (j == 2 && k != 12) {
    return i + "<sup>nd</sup>";
  }
  if (j == 3 && k != 13) {
    return i + "<sup>rd</sup>";
  }
  return i + "<sup>th</sup>";
}

String.prototype.replaceAt = function (index, replacement) {
  return (
    this.substr(0, index) +
    replacement +
    this.substr(index + replacement.length)
  );
};

export function populateSubConditonalForm(
  formFieldInput,
  populateCount,
  conditionalFormFieldValue,
  templateKey,
  multiSelectedValues
) {
  console.log(
    "----------------------------populateSubConditonalForm--------------------------"
  );
  console.log("populateSubConditonalForm_templateKey", templateKey);

  console.log(
    "populateSubConditonalForm_formFieldInput.elementUId--",
    formFieldInput.elementUId
  );
  //let templateElementIdKey=formFieldInput.elementUId;
  console.log("populateSubConditonalForm_formFieldInput", formFieldInput);

  console.log("populateSubConditonalForm_populateCount", populateCount);
  console.log(
    "populateSubConditonalForm_conditionalFormFieldValue",
    conditionalFormFieldValue
  );
  console.log(
    "populateSubConditonalForm_multiSelectedValues",
    multiSelectedValues
  );

  let templateElementIdKey = templateKey;
  console.log(
    "populateSubConditonalForm_templateElementIdKey-",
    templateElementIdKey
  );
  var rows = "<p></p>";

  //ToProcess copyOfInput Conditional Template
  /*
  if (formFieldInput.elementType == "copyOfInput"){
    
    console.log("copyOfInput_inpopcondi_formFieldInput",formFieldInput);

    console.log("copyOfInput_inpopcondi_formFieldInput.condition.conditionType",formFieldInput.condition.conditionType)

    if(formFieldInput.condition.conditionType=="ValueBased"){
      if (
        formFieldInput.condition.conditionStatements[conditionalFormFieldValue] !=
        undefined
      ) {
        rows = addAddtionalKeyToSubTemplate(
          formFieldInput,
          formFieldInput.condition.conditionStatements[conditionalFormFieldValue]
            .subFormFields.formFields,
          formFieldInput.condition.conditionStatements[conditionalFormFieldValue]
            .subFormTemplate,
          "" + templateElementIdKey + 0,
          0
        );
      } else {
        rows = addAddtionalKeyToSubTemplate(
          formFieldInput,
          {},
          "",
          "" + templateElementIdKey + 0,
          0
        );
      }
    }else{
      rows = addAddtionalKeyToSubTemplate(
        formFieldInput,
        formFieldInput.condition.subFormFields.formFields,
        formFieldInput.condition.subFormTemplate,
        "" + templateElementIdKey + 0,
        0
      );
      for (var i = 1; i < populateCount; i++) {
        rows += addAddtionalKeyToSubTemplate(
          formFieldInput,
          formFieldInput.condition.subFormFields.formFields,
          formFieldInput.condition.subFormTemplate,
          "" + templateElementIdKey + i,
          i
        );
      }
    }
  }else 
  */
  if (
    (formFieldInput.elementType.toLowerCase() == "copyofinput" ||
      formFieldInput.elementType.toLowerCase() == "checkbox") &&
    (formFieldInput.elementConfig.type.toLowerCase() == "multiselectt1" ||
      formFieldInput.elementConfig.type.toLowerCase() == "multiselectt2" ||
      formFieldInput.elementConfig.type.toLowerCase() == "multiselectt3" ||
      formFieldInput.elementConfig.type.toLowerCase() == "multiselectt4" ||
      formFieldInput.elementConfig.type.toLowerCase() == "multiselectt5")
  ) {
    console.log(
      "populateSubConditonalForm_multicheckbox1_formFieldInput",
      formFieldInput
    );
    console.log(
      "populateSubConditonalForm_multicheckbox1_conditionalFormFieldValue",
      conditionalFormFieldValue
    );
    console.log(
      "populateSubConditonalForm_multicheckbox1_multiSelectedValues",
      multiSelectedValues
    );
    //rows="<p>MultiChoiceCheckBox multiSelectedValue</p>";
    let selectedValueRow = "";
    let selectedValueRowJson = {};
    multiSelectedValues.forEach((selectedValue) => {
      console.log(
        "populateSubConditonalForm_multicheckbox_selectedValue",
        selectedValue
      );
      let selectedValueRowTemp = "";
      if (
        formFieldInput.condition.conditionStatements[selectedValue] != undefined
      ) {
        selectedValueRowTemp = addAddtionalKeyToSubTemplate(
          formFieldInput,
          formFieldInput.condition.conditionStatements[selectedValue]
            .subFormFields.formFields,
          formFieldInput.condition.conditionStatements[selectedValue]
            .subFormTemplate,
          "" + templateElementIdKey + 0,
          0
        );
      } else {
        selectedValueRowTemp = addAddtionalKeyToSubTemplate(
          formFieldInput,
          {},
          "",
          "" + templateElementIdKey + 0,
          0
        );
      }
      selectedValueRowJson[selectedValue] = selectedValueRowTemp;
      // console.log("populateSubConditonalForm_multicheckbox_selectedValueRowTemp", selectedValueRowTemp);
      // console.log("populateSubConditonalForm_multicheckbox_selectedValueRowTempV2", conditionalFormFieldValue+selectedValueRowTemp);
      // console.log("populateSubConditonalForm_multicheckbox_selectedValueRowTempV3", conditionalFormFieldValue.replace(selectedValue,selectedValueRowTemp));
      selectedValueRow = selectedValueRow + selectedValueRowTemp;
      //selectedValueRow=selectedValueRow+conditionalFormFieldValue+selectedValueRowTemp;//Concating Value with SubTemplate //Will Not Show Value in main render
      // selectedValueRow=selectedValueRow+conditionalFormFieldValue.replace(selectedValue,selectedValueRowTemp);
    });

    // rows=selectedValueRow;
    // console.log("populateSubConditonalForm_multicheckbox_rows", rows);
    // console.log("populateSubConditonalForm_multicheckbox_selectedValueRowJson", selectedValueRowJson);

    Object.entries(selectedValueRowJson).map(([key, val]) => {
      // console.log("populateSubConditonalForm_multicheckbox_selectedValueRowJson_key", key);
      // console.log("populateSubConditonalForm_multicheckbox_selectedValueRowJson_val", val);
      // if(val.length>0){//No Need Of This Now
      //16-12-2010 To Process: MultiSelectedCheckBox
      let tempVal = "";
      if (val != undefined && val != null && val.length > 0) {
        tempVal = val;
      }
      if (formFieldInput.isHidden == true) {
        // console.log(
        //   "populateSubConditonalForm_multicheckbox_formFieldInput.isHidden",
        //   "formFieldInput.isHidden"
        // );
        //Appending MultiSelcted Option
        // conditionalFormFieldValue = conditionalFormFieldValue.replace(
        //   new RegExp(key, "gi"),
        //   key+" "+val
        // );
        conditionalFormFieldValue = conditionalFormFieldValue.replace(
          new RegExp(key, "gi"),
          tempVal
        );
      } else {
        console.log(
          "populateSubConditonalForm_multicheckbox_formFieldInput.isHidden",
          "formFieldInput.is not Hidden"
        );
        //Appending MultiSelcted Option
        conditionalFormFieldValue = conditionalFormFieldValue.replace(
          new RegExp(key, "gi"),
          key + " " + tempVal
        );
      }
      // }
    });

    console.log(
      "populateSubConditonalForm_multicheckbox_selectedValueRowJson_conditionalFormFieldValue",
      conditionalFormFieldValue
    );
    rows = conditionalFormFieldValue;
  } else if (
    formFieldInput.elementType.toLowerCase() == "select" ||
    formFieldInput.elementType.toLowerCase() == "radio" ||
    formFieldInput.elementType.toLowerCase() == "datalist" ||
    (formFieldInput.elementType == "copyOfInput" &&
      formFieldInput.condition.conditionType == "ValueBased")
  ) {
    /*formId = props.mainDocumentFormField.condition.conditionStatements[props.formFieldValue].subFormId;
        formsFieldsDataDefault = formFieldInput.condition.conditionStatements[conditionalFormFieldValue].subFormFields; //setFormsFieldsData()
        sampleFormDataForEditor = formFieldInput.condition.conditionStatements[conditionalFormFieldValue].subFormTemplate;
    */
    if (
      formFieldInput.condition.conditionStatements[conditionalFormFieldValue] !=
      undefined
    ) {
      rows = addAddtionalKeyToSubTemplate(
        formFieldInput,
        formFieldInput.condition.conditionStatements[conditionalFormFieldValue]
          .subFormFields.formFields,
        formFieldInput.condition.conditionStatements[conditionalFormFieldValue]
          .subFormTemplate,
        "" + templateElementIdKey + 0,
        0
      );
    } else {
      rows = addAddtionalKeyToSubTemplate(
        formFieldInput,
        {},
        "",
        "" + templateElementIdKey + 0,
        0
      );
    }
  } else if (
    formFieldInput.elementType.toLowerCase() == "checkbox" &&
    (formFieldInput.elementConfig.type.toLowerCase() == "multiselectt1" ||
      formFieldInput.elementConfig.type.toLowerCase() == "multiselectt2" ||
      formFieldInput.elementConfig.type.toLowerCase() == "multiselectt3" ||
      formFieldInput.elementConfig.type.toLowerCase() == "multiselectt4" ||
      formFieldInput.elementConfig.type.toLowerCase() == "multiselectt5")
  ) {
    //AddedOn 13-12-2021
    console.log(
      "populateSubConditonalForm_multicheckbox_formFieldInput",
      formFieldInput
    );
    console.log(
      "populateSubConditonalForm_multicheckbox_conditionalFormFieldValue",
      conditionalFormFieldValue
    );

    //rows="<p>MultiChoiceCheckBox multiSelectedValue</p>";
    let selectedValueRow = "";
    let selectedValueRowJson = {};
    multiSelectedValues.forEach((selectedValue) => {
      console.log(
        "populateSubConditonalForm_multicheckbox_selectedValue",
        selectedValue
      );
      let selectedValueRowTemp = "";
      if (
        formFieldInput.condition.conditionStatements[selectedValue] != undefined
      ) {
        selectedValueRowTemp = addAddtionalKeyToSubTemplate(
          formFieldInput,
          formFieldInput.condition.conditionStatements[selectedValue]
            .subFormFields.formFields,
          formFieldInput.condition.conditionStatements[selectedValue]
            .subFormTemplate,
          "" + templateElementIdKey + 0,
          0
        );
      } else {
        selectedValueRowTemp = addAddtionalKeyToSubTemplate(
          formFieldInput,
          {},
          "",
          "" + templateElementIdKey + 0,
          0
        );
      }
      selectedValueRowJson[selectedValue] = selectedValueRowTemp;
      // console.log("populateSubConditonalForm_multicheckbox_selectedValueRowTemp", selectedValueRowTemp);
      // console.log("populateSubConditonalForm_multicheckbox_selectedValueRowTempV2", conditionalFormFieldValue+selectedValueRowTemp);
      // console.log("populateSubConditonalForm_multicheckbox_selectedValueRowTempV3", conditionalFormFieldValue.replace(selectedValue,selectedValueRowTemp));
      selectedValueRow = selectedValueRow + selectedValueRowTemp;
      //selectedValueRow=selectedValueRow+conditionalFormFieldValue+selectedValueRowTemp;//Concating Value with SubTemplate //Will Not Show Value in main render
      // selectedValueRow=selectedValueRow+conditionalFormFieldValue.replace(selectedValue,selectedValueRowTemp);
    });

    // rows=selectedValueRow;
    // console.log("populateSubConditonalForm_multicheckbox_rows", rows);
    // console.log("populateSubConditonalForm_multicheckbox_selectedValueRowJson", selectedValueRowJson);

    Object.entries(selectedValueRowJson).map(([key, val]) => {
      // console.log("populateSubConditonalForm_multicheckbox_selectedValueRowJson_key", key);
      // console.log("populateSubConditonalForm_multicheckbox_selectedValueRowJson_val", val);
      // if(val.length>0){//No Need Of This Now
      //16-12-2010 To Process: MultiSelectedCheckBox
      let tempVal = "";
      if (val != undefined && val != null && val.length > 0) {
        tempVal = val;
      }
      if (formFieldInput.isHidden == true) {
        // console.log(
        //   "populateSubConditonalForm_multicheckbox_formFieldInput.isHidden",
        //   "formFieldInput.isHidden"
        // );
        //Appending MultiSelcted Option
        // conditionalFormFieldValue = conditionalFormFieldValue.replace(
        //   new RegExp(key, "gi"),
        //   key+" "+val
        // );
        conditionalFormFieldValue = conditionalFormFieldValue.replace(
          new RegExp(key, "gi"),
          tempVal
        );
      } else {
        console.log(
          "populateSubConditonalForm_multicheckbox_formFieldInput.isHidden",
          "formFieldInput.is not Hidden"
        );
        //Appending MultiSelcted Option
        conditionalFormFieldValue = conditionalFormFieldValue.replace(
          new RegExp(key, "gi"),
          key + " " + tempVal
        );
      }
      // }
    });

    console.log(
      "populateSubConditonalForm_multicheckbox_selectedValueRowJson_conditionalFormFieldValue",
      conditionalFormFieldValue
    );
    rows = conditionalFormFieldValue;
  } else {
    // console.log(
    //   "formFieldInput.condition.subFormTemplate",
    //   formFieldInput.condition.subFormTemplate
    // );
    // console.log(
    //   "formFieldInput.condition.subFormFields.formFields",
    //   formFieldInput.condition.subFormFields.formFields
    // );
    rows = addAddtionalKeyToSubTemplate(
      formFieldInput,
      formFieldInput.condition.subFormFields.formFields,
      formFieldInput.condition.subFormTemplate,
      "" + templateElementIdKey + 0,
      0
    );
    for (var i = 1; i < populateCount; i++) {
      rows += addAddtionalKeyToSubTemplate(
        formFieldInput,
        formFieldInput.condition.subFormFields.formFields,
        formFieldInput.condition.subFormTemplate,
        "" + templateElementIdKey + i,
        i
      );
    }
  }
  //console.log("--------rows----------",rows.replace("<p>", "<p class='inlineSubField'>"))
  return rows.replace("<p>", "<p class='inlineSubField'>");
}

export function replaceTemplateKeyWithFormDataViewTT(
  mainTemplate,
  formFieldKey,
  conditionalTemplate
) {
  mainTemplate = mainTemplate.replace(
    new RegExp("{" + formFieldKey + "}", "gi"),
    "{" + formFieldKey + "}" + conditionalTemplate
  );
  return mainTemplate;
}

export function replaceTemplateKeyWithFormDataViewTTV2(
  mainTemplate,
  keyValueTemplates
) {
  console.log(
    "replaceTemplateKeyWithFormDataViewTTV2_mainTemplate",
    mainTemplate
  );
  console.log(
    "replaceTemplateKeyWithFormDataViewTTV2_keyValueTemplates",
    keyValueTemplates
  );

  //ToProcess Golbal InoutTemplae field for template that is render after selecting main i.e. sub condition is below main
  //use above for that Object.keys(keyValueTemplates).slice().reverse().forEach((key) => {
  //Above 2 Lines added on 31-01-2022

  Object.keys(keyValueTemplates).forEach((key) => {
    console.log("replaceTemplateKeyWithFormDataViewTTV2_key", key);
    console.log(
      "replaceTemplateKeyWithFormDataViewTTV2_keyValueTemplates[key]",
      keyValueTemplates[key]
    );
    console.log(
      "replaceTemplateKeyWithFormDataViewTTV2_pre_" + key + "_mainTemplate",
      mainTemplate
    );
    mainTemplate = mainTemplate.replace(
      new RegExp("{" + key + "}", "gi"),
      "{" + key + "}" + keyValueTemplates[key]
    );
    console.log(
      "replaceTemplateKeyWithFormDataViewTTV2_post_" + key + "_mainTemplate",
      mainTemplate
    );
  });
  console.log(
    "replaceTemplateKeyWithFormDataViewTTV2_mainTemplate",
    mainTemplate
  );

  let mainTemplate2 = mainTemplate.replace(
    new RegExp("</p><p class='inlineSubField'>", "gi"),
    ""
  );
  //console.log("*****************--mainTemplate2---",mainTemplate2)

  mainTemplate = mainTemplate2;
  let mainTemplate3 = mainTemplate.replace(
    new RegExp("<p class='inlineSubField'>", "gi"),
    ""
  );
  //console.log("*****************--mainTemplate3---",mainTemplate3)
  mainTemplate = mainTemplate3;
  console.log(
    "replaceTemplateKeyWithFormDataViewTTV2_mainTemplate",
    mainTemplate
  );
  return mainTemplate;
}

export function replaceTemplateKeyWithFormDataViewNew(
  mainTemplate,
  keyValueTemplates,
  keyValueTemplatesTemp
) {
  console.log(
    "*---------------replaceTemplateKeyWithFormDataViewNew---------------*"
  );
  console.log(
    "replaceTemplateKeyWithFormDataViewTTV2_mainTemplate",
    mainTemplate
  );
  console.log(
    "replaceTemplateKeyWithFormDataViewTTV2_keyValueTemplates",
    keyValueTemplates
  );
  console.log(
    "replaceTemplateKeyWithFormDataViewTTV2_keyValueTemplatesTemp",
    keyValueTemplatesTemp
  );
  Object.keys(keyValueTemplates).forEach((key) => {
    console.log("replaceTemplateKeyWithFormDataViewTTV2_key", key);
    console.log(
      "replaceTemplateKeyWithFormDataViewTTV2_keyValueTemplates[key]",
      keyValueTemplates[key]
    );
    console.log(
      "replaceTemplateKeyWithFormDataViewTTV2_pre_" + key + "_mainTemplate",
      mainTemplate
    );
    mainTemplate = mainTemplate.replace(
      new RegExp("{" + key + "}", "gi"),
      "{" + key + "}" + keyValueTemplates[key]
    );
    console.log(
      "replaceTemplateKeyWithFormDataViewTTV2_post_" + key + "_mainTemplate",
      mainTemplate
    );
  });
  console.log(
    "replaceTemplateKeyWithFormDataViewTTV2_mainTemplate",
    mainTemplate
  );

  let mainTemplate2 = mainTemplate.replace(
    new RegExp("</p><p class='inlineSubField'>", "gi"),
    ""
  );
  //console.log("*****************--mainTemplate2---",mainTemplate2)

  mainTemplate = mainTemplate2;
  let mainTemplate3 = mainTemplate.replace(
    new RegExp("<p class='inlineSubField'>", "gi"),
    ""
  );
  //console.log("*****************--mainTemplate3---",mainTemplate3)
  mainTemplate = mainTemplate3;
  console.log(
    "replaceTemplateKeyWithFormDataViewTTV2_mainTemplate",
    mainTemplate
  );
  return mainTemplate;
}

export function fetchFormulaObjectV2(formulaValue) {
  var formulaObject = {};
  console.log("mainFormFields_fetchFormulaObject:Start---");
  console.log("mainFormFields_fetchFormulaObject_formulaValue", formulaValue);

  formulaObject["action"] = formulaValue.split("(")[0];

  console.log(
    "mainFormFields_fetchFormulaObject_formulaObject[action]",
    formulaObject["action"]
  );

  var noOfFieldsKeys = [];
  var formulaObjectVars = formulaValue.substring(
    formulaValue.indexOf("(") + 1,
    formulaValue.lastIndexOf(")")
  );
  console.log(
    "mainFormFields_fetchFormulaObject_formulaObjectVars",
    formulaObjectVars
  );
  formulaObject["actionString"] = formulaObjectVars;

  if (formulaObject["action"] == "eval") {
    //var formulaObjectVarsTest=formulaObjectVars.replace("(","");
    //formulaObjectVarsTest=formulaObjectVarsTest.replace(")","");
    var formulaObjectVarsClean = formulaObjectVars.replace(/[()]/g, "");
    noOfFieldsKeys = formulaObjectVarsClean
      .split(/[+-/%*]+/)
      .map((item) => item.trim());
    formulaObject["noOfFieldsKeys"] = noOfFieldsKeys;
  } else if (
    formulaObject["action"] == "sum" ||
    formulaObject["action"] == "diff" ||
    formulaObject["action"] == "average" ||
    formulaObject["action"] == "multiple"
  ) {
    noOfFieldsKeys[0] = formulaObjectVars;
    formulaObject["noOfFieldsKeys"] = noOfFieldsKeys;
    formulaObject["parentKey"] = formulaObjectVars.split(".")[0];
    formulaObject["childKey"] = formulaObjectVars.split(".")[1];
  } else if (
    formulaObject["action"] == "sumOf" ||
    formulaObject["action"] == "diffOf" ||
    formulaObject["action"] == "averageOf" ||
    formulaObject["action"] == "multipleOf" ||
    formulaObject["action"] == "dateDiffInDays" ||
    formulaObject["action"] == "dateAddDays" ||
    formulaObject["action"] == "dateAdd"

  ) {
    noOfFieldsKeys = formulaObjectVars.split(",").map((item) => item.trim());
    formulaObject["noOfFieldsKeys"] = noOfFieldsKeys;
  } else if (formulaObject["action"] == "formatnumber") {
    formulaObject["noOfFieldsKeys"] = 0;
    formulaObject["fieldKey"] = formulaObjectVars.split(",")[0];
    formulaObject["decimalLevel"] = formulaObjectVars.split(",")[1];
  } else if (
    formulaObject["action"] == "agefrom" ||
    formulaObject["action"] == "daysfrom" ||
    formulaObject["action"] == "isminor"
  ) {
    formulaObject["noOfFieldsKeys"] = 0;
    formulaObject["fieldKey"] = formulaObjectVars.split(",")[0];
    // formulaObject["decimalLevel"] = formulaObjectVars.split(",")[1];
  } else if (formulaObject["action"] == "dateToWord") {
    //DevNote[AddedOn]:12-10-2023
    formulaObject["noOfFieldsKeys"] = 0;
    formulaObject["fieldKey"] = formulaObjectVars.split(",")[0];
    formulaObject["langCode"] = formulaObjectVars.split(",")[1];
  }

  console.log("mainFormFields_fetchFormulaObject:End---");
  return formulaObject;
}

export function fetchFormulaObjectForConditionalElementV2(
  formulaValue,
  superParentTemplateKey
) {
  var formulaObject = {};

  console.log(
    "conditionalFormInputs_fetchFormulaObjectForConditionalElementV2:start----"
  );

  console.log("conditionalFormInputs_formulaValue", formulaValue);

  formulaObject["action"] = formulaValue.split("(")[0];
  console.log(
    "conditionalFormInputs_formulaValue_action",
    formulaObject["action"]
  );

  var noOfFieldsKeys = [];
  var formulaObjectVars = formulaValue.substring(
    formulaValue.indexOf("(") + 1,
    formulaValue.lastIndexOf(")")
  );

  formulaObject["actionString"] = formulaObjectVars;

  console.log("conditionalFormInputs_formulaObjectVars", formulaObjectVars);

  /*
  formulaObject["parentKey"] =
    formulaObjectVars.split(".")[0] + superParentTemplateKey;
  formulaObject["childKey"] = formulaObjectVars.split(".")[1];
    */

  if (formulaObject["action"] == "eval") {
    //var formulaObjectVarsClean=formulaObjectVars.replace("(","");
    //formulaObjectVarsClean=formulaObjectVarsClean.replace(")","");
    var formulaObjectVarsClean = formulaObjectVars.replace(/[()]/g, "");
    noOfFieldsKeys = formulaObjectVarsClean
      .split(/[+-/%*]+/)
      .map((item) => item.trim());
    //noOfFieldsKeys = formulaObjectVars.split(/[+-/%*]+/).map(item => item.trim());
    formulaObject["noOfFieldsKeys"] = noOfFieldsKeys;
  } else if (
    formulaObject["action"] == "sum" ||
    formulaObject["action"] == "diff" ||
    formulaObject["action"] == "average" ||
    formulaObject["action"] == "multiple"
  ) {
    noOfFieldsKeys[0] = formulaObjectVars;
    formulaObject["noOfFieldsKeys"] = noOfFieldsKeys;
    formulaObject["parentKey"] = formulaObjectVars.split(".")[0];
    formulaObject["childKey"] = formulaObjectVars.split(".")[1];
  } else if (
    formulaObject["action"] == "sumOf" ||
    formulaObject["action"] == "diffOf" ||
    formulaObject["action"] == "averageOf" ||
    formulaObject["action"] == "multipleOf" ||
    formulaObject["action"] == "dateDiffInDays" ||
    formulaObject["action"] == "dateAddDays" ||
    formulaObject["action"] == "dateAdd"
  ) {
    noOfFieldsKeys = formulaObjectVars.split(",").map((item) => item.trim());
    formulaObject["noOfFieldsKeys"] = noOfFieldsKeys;
  } else if (formulaObject["action"] == "formatnumber") {
    formulaObject["noOfFieldsKeys"] = 0;
    formulaObject["fieldKey"] = formulaObjectVars.split(",")[0];
    formulaObject["decimalLevel"] = formulaObjectVars.split(",")[1];
  } else if (
    formulaObject["action"] == "agefrom" ||
    formulaObject["action"] == "daysfrom" ||
    formulaObject["action"] == "isminor"
  ) {
    formulaObject["noOfFieldsKeys"] = 0;
    formulaObject["fieldKey"] = formulaObjectVars.split(",")[0];
    // formulaObject["decimalLevel"] = formulaObjectVars.split(",")[1];
  } else if (formulaObject["action"] == "dateToWord") {
    //DevNote[AddedOn]:12-10-2023
    formulaObject["noOfFieldsKeys"] = 0;
    formulaObject["fieldKey"] = formulaObjectVars.split(",")[0];
    formulaObject["langCode"] = formulaObjectVars.split(",")[1];
  }

  console.log(
    "conditionalFormInputs_fetchFormulaObjectForConditionalElementV2:end----"
  );
  return formulaObject;
}

export function fetchStringFormulaObject(formulaValue) {
  var formulaObject = {};
  console.log("mainFormFields_strngformula_fetchFormulaObject:Start---");
  console.log(
    "mainFormFields_strngformula_fetchFormulaObject_formulaValue",
    formulaValue
  );

  formulaObject["action"] = formulaValue.split("(")[0];

  console.log(
    "mainFormFields_strngformula_fetchFormulaObject_formulaObject[action]",
    formulaObject["action"]
  );

  var noOfFieldsKeys = [];
  var formulaObjectVars = formulaValue.substring(
    formulaValue.indexOf("(") + 1,
    formulaValue.lastIndexOf(")")
  );
  console.log(
    "mainFormFields_strngformula_fetchFormulaObject_formulaObjectVars",
    formulaObjectVars
  );
  formulaObject["actionString"] = formulaObjectVars;

  //unique_values
  if (formulaObject["action"] == "unique_values") {
    noOfFieldsKeys = formulaObjectVars.split(",").map((item) => item.trim());
    formulaObject["noOfFieldsKeys"] = noOfFieldsKeys;
    console.log("mainFormFields_strngformula_noOfFieldsKeys", noOfFieldsKeys);
  }
  if (formulaObject["action"] == "uniqueValuesSortAsc") {
    noOfFieldsKeys = formulaObjectVars.split(",").map((item) => item.trim());
    formulaObject["noOfFieldsKeys"] = noOfFieldsKeys;
    console.log("mainFormFields_strngformula_noOfFieldsKeys", noOfFieldsKeys);
  }
  if (formulaObject["action"] == "uniqueValuesSortDsc") {
    noOfFieldsKeys = formulaObjectVars.split(",").map((item) => item.trim());
    formulaObject["noOfFieldsKeys"] = noOfFieldsKeys;
    console.log(
      "mainFormFields_strngformula_noOfFieldsKeysSortDsc",
      noOfFieldsKeys
    );
  }
  console.log("mainFormFields_strngformula_fetchFormulaObject:End---");
  return formulaObject;
}

export function processStringFormulaObject(formulaObject, formData, type) {
  var returnResult = "";

  console.log("mainFormFields_strngformula_processFormulaObjectV2:Start----");
  console.log(
    "mainFormFields_strngformula_processFormulaObjectV2_formulaObject",
    formulaObject
  );
  console.log(
    "mainFormFields_strngformula_processFormulaObjectV2_formData",
    formData
  );
  console.log(
    "mainFormFields_strngformula_processFormulaObjectV2_formulaObject.noOfFieldsKeys",
    formulaObject.noOfFieldsKeys
  );

  var toFormInputTemplateKeys = [];
  if (formulaObject.noOfFieldsKeys != 0) {
    toFormInputTemplateKeys = keysToFormInputTemplateKeys(
      formulaObject.noOfFieldsKeys
    );
  }
  console.log(
    "mainFormFields_strngformula_processFormulaObjectV2_toFormInputTemplateKeys",
    toFormInputTemplateKeys
  );
  if (
    formulaObject.action == "unique_values" ||
    formulaObject.action == "uniqueValuesSortAsc" ||
    formulaObject.action == "uniqueValuesSortDsc"
  ) {
    let formDataAllValues = [];

    toFormInputTemplateKeys.forEach((fieldKey) => {
      console.log(
        "mainFormFields_strngformula_processFormulaObjectV2_formData[fieldKey]",
        fieldKey,
        formData[fieldKey]
      );
      if (formData[fieldKey] != undefined && formData[fieldKey].length > 1) {
        formDataAllValues = formDataAllValues.concat(
          formData[fieldKey].split(",").map((item) => item.trim())
        );
      }
    });

    console.log(
      "mainFormFields_strngformula_processFormulaObjectV2_formDataAllValues",
      formDataAllValues
    );
    let uniqueFormDataAllValues = formDataAllValues.filter(
      (value, index, array) => array.indexOf(value) === index
    );

    if (formulaObject.action == "uniqueValuesSortAsc") {
      uniqueFormDataAllValues = uniqueFormDataAllValues.sort();
    }
    if (formulaObject.action == "uniqueValuesSortDsc") {
      uniqueFormDataAllValues = uniqueFormDataAllValues.sort().reverse();
    }
    console.log(
      "mainFormFields_strngformula_processFormulaObjectV2_uniqueFormDataAllValues",
      uniqueFormDataAllValues
    );
    if (uniqueFormDataAllValues.length > 0) {
      returnResult = formatMulitSelectedData(uniqueFormDataAllValues, type);
    }
  }
  // console.log(
  //   "mainFormFields_strngformula_processFormulaObjectV2_returnResult",
  //   returnResult
  // );
  // console.log("mainFormFields_strngformula_processFormulaObjectV2:End----");
  return returnResult;
}

export const onMultiValueToFormatedString = (selectedValueArray, type) => {
  console.log("onMultiValueToFormatedString_tempValue", selectedValueArray);
  console.log("onMultiValueToFormatedString_tempValue_type", type);
  let array2Index = "";
  // selectedValues = selectedValues.split(",");
  if (selectedValueArray.length <= 0) {
    return "";
  } else {
    for (let i = 0; i < selectedValueArray.length; i++) {
      if (type == "multiselectt1") {
        array2Index += i + 1 + ". " + selectedValueArray[i] + "<br>";
      } else if (type == "multiselectt2") {
        array2Index += selectedValueArray[i] + ", ";
      } else if (type == "multiselectt3") {
        array2Index += selectedValueArray[i] + "<br>";
      } else if (type == "multiselectt4") {
        //Ordered
        array2Index += "<li>" + selectedValueArray[i] + "</li>";
      } else if (type == "multiselectt5") {
        //UnOrdered
        array2Index += "<li>" + selectedValueArray[i] + "</li>";
      }
    }
    if (type == "multiselectt4") {
      //Ordered
      array2Index = "<ol>" + array2Index + "</ol>";
    }
    if (type == "multiselectt5") {
      //UnOrdered
      array2Index = "<ul>" + array2Index + "</ul>";
    }
  }
  console.log(
    "onMultiValueToFormatedString_tempValue_array2Index",
    array2Index
  );
  return array2Index;
};

export const formatMulitSelectedData = (valueArray, type) => {
  if (type == "multiselectt1") {
    // array2Index += i + 1 + ". " + selectedValues[i] + "<br>";
    return onMultiValueToFormatedString(valueArray, type);
  } else if (type == "multiselectt2") {
    // array2Index += selectedValues[i] + ", ";
    return valueArray.join(", ");
  } else if (type == "multiselectt3") {
    // array2Index += selectedValues[i] + "<br>";
    return valueArray.join("<br>");
  } else if (type == "multiselectt4") {
    //Ordered
    // array2Index += "<li>" + selectedValues[i] + "</li>";
    return onMultiValueToFormatedString(valueArray, type);
  } else if (type == "multiselectt5") {
    //UnOrdered
    // array2Index += "<li>" + selectedValues[i] + "</li>";
    return onMultiValueToFormatedString(valueArray, type);
  } else {
    return valueArray.join(", ");
  }
};

export function fetchLegalFormulaObject(formulaValue) {
  let formulaObject = {};
  console.log("mainFormFields_legalformula_fetchFormulaObject:Start---");
  console.log(
    "mainFormFields_legalformula_fetchFormulaObject_formulaValue",
    formulaValue
  );

  formulaObject["action"] = formulaValue.split("(")[0];

  console.log(
    "mainFormFields_legalformula_fetchFormulaObject_formulaObject[action]",
    formulaObject["action"]
  );

  let noOfFieldsKeys = [];
  let formulaObjectVars = formulaValue.substring(
    formulaValue.indexOf("(") + 1,
    formulaValue.lastIndexOf(")")
  );
  console.log(
    "mainFormFields_legalformula_fetchFormulaObject_formulaObjectVars",
    formulaObjectVars
  );
  formulaObject["actionString"] = formulaObjectVars;

  //legalFeeDelhiAndChnds
  if (formulaObject["action"] == "legalFeeDelhiAndChnd") {
    //noOfFieldsKeys = formulaObjectVars.split(",").map((item) => item.trim());
    //formulaObject["noOfFieldsKeys"] = noOfFieldsKeys;
    formulaObject["noOfFieldsKeys"] = 0;
    formulaObject["fieldKey"] = formulaObjectVars.split(",")[0];
    console.log("mainFormFields_legalformula_noOfFieldsKeys", noOfFieldsKeys);
  }

  if (formulaObject["action"] == "pecuniaryJuriComrclDsptDelhiCrt") {
    //noOfFieldsKeys = formulaObjectVars.split(",").map((item) => item.trim());
    //formulaObject["noOfFieldsKeys"] = noOfFieldsKeys;
    formulaObject["noOfFieldsKeys"] = 0;
    formulaObject["fieldKey"] = formulaObjectVars.split(",")[0];
    console.log("mainFormFields_legalformula_noOfFieldsKeys", noOfFieldsKeys);
  }

  if (formulaObject["action"] == "chequeunpaidoffence") {
    formulaObject["noOfFieldsKeys"] = 0;
    formulaObject["fieldKey"] = formulaObjectVars.split(",")[0];
    console.log("mainFormFields_legalformula_noOfFieldsKeys", noOfFieldsKeys);
  }

  console.log("mainFormFields_legalformula_fetchFormulaObject", formulaObject);
  console.log("mainFormFields_legalformula_fetchFormulaObject:End---");
  return formulaObject;
}

export const processLegalFormulaObject = (formulaObject, formData, type) => {
  // let returnResult = "";

  console.log("mainFormFields_legalformula_processFormulaObjectV2:Start----");
  console.log(
    "mainFormFields_legalformula_processFormulaObjectV2_formulaObject",
    formulaObject
  );
  console.log(
    "mainFormFields_legalformula_processFormulaObjectV2_formData",
    formData
  );
  console.log(
    "mainFormFields_legalformula_processFormulaObjectV2_formulaObject.noOfFieldsKeys",
    formulaObject.noOfFieldsKeys
  );

  let toFormInputTemplateKeys = [];
  if (formulaObject.noOfFieldsKeys != 0) {
    toFormInputTemplateKeys = keysToFormInputTemplateKeys(
      formulaObject.noOfFieldsKeys
    );
  }
  console.log(
    "mainFormFields_legalformula_processFormulaObjectV2_toFormInputTemplateKeys",
    toFormInputTemplateKeys
  );
  if (formulaObject.action == "legalFeeDelhiAndChnd") {
    if (
      formData[formulaObject.fieldKey] != undefined &&
      Number(formData[formulaObject.fieldKey]) > -1 &&
      !isNaN(formData[formulaObject.fieldKey])
    ) {
      return calculateLegalFeeCourtDelhiAndChd(
        Number(formData[formulaObject.fieldKey])
      );
    }
  }

  if (formulaObject.action == "pecuniaryJuriComrclDsptDelhiCrt") {
    if (
      formData[formulaObject.fieldKey] != undefined &&
      Number(formData[formulaObject.fieldKey]) > -1 &&
      !isNaN(formData[formulaObject.fieldKey])
    ) {
      return pecuniaryJuridictionComrclDsptDelhiCrt(
        Number(formData[formulaObject.fieldKey])
      );
    }
  }

  if (formulaObject.action == "chequeunpaidoffence") {
    if (
      formData[formulaObject.fieldKey] != undefined &&
      Number(formData[formulaObject.fieldKey]) > -1 &&
      !isNaN(formData[formulaObject.fieldKey])
    ) {
      return chequeUnPaidOffenceString(
        Number(formData[formulaObject.fieldKey]),
        formData
      );
    }
  }
};

export function fetchLegalFormulaObjectForConditionalElement(
  formulaValue,
  superParentTemplateKey
) {
  let formulaObject = {};
  console.log("mainFormFields_legalformula_fetchFormulaObject:Start---");
  console.log(
    "mainFormFields_legalformula_fetchFormulaObject_formulaValue",
    formulaValue
  );

  formulaObject["action"] = formulaValue.split("(")[0];

  console.log(
    "mainFormFields_legalformula_fetchFormulaObject_formulaObject[action]",
    formulaObject["action"]
  );

  let noOfFieldsKeys = [];
  let formulaObjectVars = formulaValue.substring(
    formulaValue.indexOf("(") + 1,
    formulaValue.lastIndexOf(")")
  );
  console.log(
    "mainFormFields_legalformula_fetchFormulaObject_formulaObjectVars",
    formulaObjectVars
  );
  formulaObject["actionString"] = formulaObjectVars;

  //legalFeeDelhiAndChnds
  if (formulaObject["action"] == "legalFeeDelhiAndChnd") {
    //noOfFieldsKeys = formulaObjectVars.split(",").map((item) => item.trim());
    //formulaObject["noOfFieldsKeys"] = noOfFieldsKeys;
    formulaObject["noOfFieldsKeys"] = 0;
    formulaObject["fieldKey"] = formulaObjectVars.split(",")[0];
    console.log("mainFormFields_legalformula_noOfFieldsKeys", noOfFieldsKeys);
  }

  if (formulaObject["action"] == "pecuniaryJuriComrclDsptDelhiCrt") {
    //noOfFieldsKeys = formulaObjectVars.split(",").map((item) => item.trim());
    //formulaObject["noOfFieldsKeys"] = noOfFieldsKeys;
    formulaObject["noOfFieldsKeys"] = 0;
    formulaObject["fieldKey"] = formulaObjectVars.split(",")[0];
    console.log("mainFormFields_legalformula_noOfFieldsKeys", noOfFieldsKeys);
  }

  if (formulaObject["action"] == "chequeunpaidoffence") {
    formulaObject["noOfFieldsKeys"] = 0;
    formulaObject["fieldKey"] = formulaObjectVars.split(",")[0];
    console.log("mainFormFields_legalformula_noOfFieldsKeys", noOfFieldsKeys);
  }

  console.log("mainFormFields_legalformula_fetchFormulaObject", formulaObject);
  console.log("mainFormFields_legalformula_fetchFormulaObject:End---");
  return formulaObject;
}

export const processLegalFormulaObjectForConditionalElement = (
  formulaObject,
  formData,
  superParentTemplateKey,
  type
) => {
  // var returnResult = "";

  console.log("mainFormFields_legalformula_processFormulaObjectV2:Start----");
  console.log(
    "mainFormFields_legalformula_processFormulaObjectV2_formulaObject",
    formulaObject
  );
  console.log(
    "mainFormFields_legalformula_processFormulaObjectV2_formData",
    formData
  );
  console.log(
    "mainFormFields_legalformula_processFormulaObjectV2_formulaObject.noOfFieldsKeys",
    formulaObject.noOfFieldsKeys
  );

  let toFormInputTemplateKeys = [];
  if (formulaObject.noOfFieldsKeys != 0) {
    toFormInputTemplateKeys = keysToFormInputTemplateKeys(
      formulaObject.noOfFieldsKeys
    );
  }
  console.log(
    "mainFormFields_legalformula_processFormulaObjectV2_toFormInputTemplateKeys",
    toFormInputTemplateKeys
  );

  let formKeyToCalculate = formulaObject.fieldKey + "" + superParentTemplateKey; // + "" + 0;
  if (formulaObject.action == "legalFeeDelhiAndChnd") {
    if (
      formData[formKeyToCalculate] != undefined &&
      Number(formData[formKeyToCalculate]) > -1 &&
      !isNaN(formData[formKeyToCalculate])
    ) {
      return calculateLegalFeeCourtDelhiAndChd(
        Number(formData[formKeyToCalculate])
      );
    }
  }

  if (formulaObject.action == "pecuniaryJuriComrclDsptDelhiCrt") {
    if (
      formData[formKeyToCalculate] != undefined &&
      Number(formData[formKeyToCalculate]) > -1 &&
      !isNaN(formData[formKeyToCalculate])
    ) {
      return pecuniaryJuridictionComrclDsptDelhiCrt(
        Number(formData[formKeyToCalculate])
      );
    }
  }

  if (formulaObject.action == "chequeunpaidoffence") {
    if (
      formData[formKeyToCalculate] != undefined &&
      Number(formData[formKeyToCalculate]) > -1 &&
      !isNaN(formData[formKeyToCalculate])
    ) {
      return chequeUnPaidOffenceString(
        Number(formData[formKeyToCalculate]),
        formData
      );
    }
  }
};

export function fetchStringFormulaObjectForConditionalElementV2(
  formulaValue,
  superParentTemplateKey
) {
  let formulaObject = {};

  console.log(
    "conditionalFormInputs_strngformula_fetchFormulaObjectForConditionalElementV2:start----"
  );

  console.log("conditionalFormInputs_strngformula_formulaValue", formulaValue);

  formulaObject["action"] = formulaValue.split("(")[0];
  console.log(
    "conditionalFormInputs_formulaValue_action",
    formulaObject["action"]
  );

  let noOfFieldsKeys = [];
  let formulaObjectVars = formulaValue.substring(
    formulaValue.indexOf("(") + 1,
    formulaValue.lastIndexOf(")")
  );

  formulaObject["actionString"] = formulaObjectVars;

  console.log(
    "conditionalFormInputs_strngformula_formulaObjectVars",
    formulaObjectVars
  );

  if (formulaObject["action"] == "unique_values") {
    noOfFieldsKeys = formulaObjectVars.split(",").map((item) => item.trim());
    formulaObject["noOfFieldsKeys"] = noOfFieldsKeys;
    console.log("mainFormFields_strngformula_noOfFieldsKeys", noOfFieldsKeys);
  }
  if (formulaObject["action"] == "uniqueValuesSortAsc") {
    noOfFieldsKeys = formulaObjectVars.split(",").map((item) => item.trim());
    formulaObject["noOfFieldsKeys"] = noOfFieldsKeys;
    console.log("mainFormFields_strngformula_noOfFieldsKeys", noOfFieldsKeys);
  }
  if (formulaObject["action"] == "uniqueValuesSortDsc") {
    noOfFieldsKeys = formulaObjectVars.split(",").map((item) => item.trim());
    formulaObject["noOfFieldsKeys"] = noOfFieldsKeys;
    console.log(
      "mainFormFields_strngformula_noOfFieldsKeysSortDsc",
      noOfFieldsKeys
    );
  }
  console.log(
    "conditionalFormInputs_strngformula_fetchFormulaObjectForConditionalElementV2:end----"
  );
  return formulaObject;
}

export function processStringFormulaObjectForConditionalElementV2(
  formulaObject,
  formData,
  superParentTemplateKey,
  type
) {
  let returnResult = 0;

  console.log(
    "conditionalFormInputs_processStringFormulaObjectForConditionalElementV2:Start------"
  );

  console.log(
    "conditionalFormInputs_strngformula_formulaObject",
    formulaObject
  );

  console.log(
    "conditionalFormInputs_strngformula_superParentTemplateKey",
    superParentTemplateKey
  );

  console.log(
    "conditionalFormInputs_strngformula_processFormulaObjectV2_formulaObject.noOfFieldsKeys",
    formulaObject.noOfFieldsKeys
  );

  let toFormInputTemplateKeys = [];
  if (formulaObject.noOfFieldsKeys != 0) {
    toFormInputTemplateKeys = keysToFormInputTemplateKeys(
      formulaObject.noOfFieldsKeys
    );
  }

  if (
    formulaObject.action == "unique_values" ||
    formulaObject.action == "uniqueValuesSortAsc" ||
    formulaObject.action == "uniqueValuesSortDsc"
  ) {
    let formDataAllValues = [];

    toFormInputTemplateKeys.forEach((fieldKey) => {
      let formKeyToCalculate = fieldKey + "" + superParentTemplateKey; // + "" + 0;
      console.log(
        "mainFormFields_strngformula_processFormulaObjectV2_formData[formKeyToCalculate]",
        formKeyToCalculate,
        formData[formKeyToCalculate]
      );
      if (
        formData[formKeyToCalculate] != undefined &&
        formData[formKeyToCalculate].length > 1
      ) {
        formDataAllValues = formDataAllValues.concat(
          formData[formKeyToCalculate].split(",").map((item) => item.trim())
        );
      }
    });

    console.log(
      "mainFormFields_strngformula_processFormulaObjectV2_formDataAllValues",
      formDataAllValues
    );
    let uniqueFormDataAllValues = formDataAllValues.filter(
      (value, index, array) => array.indexOf(value) === index
    );
    if (formulaObject.action == "uniqueValuesSortAsc") {
      uniqueFormDataAllValues = uniqueFormDataAllValues.sort();
    }
    if (formulaObject.action == "uniqueValuesSortDsc") {
      uniqueFormDataAllValues = uniqueFormDataAllValues.sort().reverse();
    }
    console.log(
      "mainFormFields_strngformula_processFormulaObjectV2_uniqueFormDataAllValues",
      uniqueFormDataAllValues
    );
    if (uniqueFormDataAllValues.length > 0) {
      returnResult = formatMulitSelectedData(uniqueFormDataAllValues, type);
    }
  }
  return returnResult;
}

function processParentChildKeyRelation(noOfFieldsKeys) {
  return noOfFieldsKeys[1] + "" + noOfFieldsKeys[0];
}

const keysToFormInputTemplateKeys = (fieldKeys) => {
  let formInputTemplateKeys = [];
  if (fieldKeys != undefined && fieldKeys.length > 0) {
    fieldKeys.forEach((fieldKey) => {
      fieldKey = fieldKey.replace(/\s/g, "");

      console.log(
        "mainFormFields_keysToFormInputTemplateKeys_fieldKey",
        fieldKey
      );
      let noOfFieldsKeys = fieldKey.split(".");
      console.log(
        "mainFormFields_keysToFormInputTemplateKeys_noOfFieldsKeys",
        noOfFieldsKeys
      );
      console.log(
        "mainFormFields_keysToFormInputTemplateKeys_noOfFieldsKeys.length",
        noOfFieldsKeys.length
      );

      if (noOfFieldsKeys.length == 1) {
        //process Key without parentKeyStructure
        /*      
      formInputTemplateKeys.push(fieldKey.replace(/\s/g,''));      
      console.log(
        "mainFormFields_validateFormfieldKey",
        validateFormfieldKey(fieldKey.replace(/\s/g,''))
      );
      console.log(
        "mainFormFields_validateFormfieldKey_test",
        validateFormfieldKey("4")
      );
      */
        if (validateFormfieldKey(fieldKey)) {
          formInputTemplateKeys.push(fieldKey);
        }
      } else {
        //process For internal Conditional element
        formInputTemplateKeys.push(
          processParentChildKeyRelation(noOfFieldsKeys).replace(/\s/g, "")
        );
      }
    });
  }
  return formInputTemplateKeys;
};

function validateFormfieldKey(key2validate) {
  let regExp = /[a-zA-Z]/g;

  if (regExp.test(key2validate)) {
    /* do something if letters are found in your string */
    return true;
  } else {
    /* do something if letters are not found in your string */
    return false;
  }
}

export function processFormulaObjectV2(formulaObject, formData) {
  let returnResult = 0;
  //Number
  console.log("mainFormFields_processFormulaObjectV2:Start----");
  console.log(
    "mainFormFields_processFormulaObjectV2_formulaObject",
    formulaObject
  );
  console.log("mainFormFields_processFormulaObjectV2_formData", formData);

  console.log(
    "mainFormFields_processFormulaObjectV2_formulaObject.noOfFieldsKeys",
    formulaObject.noOfFieldsKeys
  );

  let toFormInputTemplateKeys = [];
  if (formulaObject.noOfFieldsKeys != 0) {
    toFormInputTemplateKeys = keysToFormInputTemplateKeys(
      formulaObject.noOfFieldsKeys
    );
  }

  console.log(
    "mainFormFields_processFormulaObjectV2_toFormInputTemplateKeys",
    toFormInputTemplateKeys
  );
  //evaluate if formulaObject.action=eval

  if (formulaObject.action == "eval") {
    let actionStringtoCalulate = formulaObject.actionString;
    toFormInputTemplateKeys.forEach((fieldKey) => {
      console.log(
        "mainFormFields_processFormulaObjectV2_formData[fieldKey]",
        formData[fieldKey]
      );
      if (formData[fieldKey] == undefined) {
        actionStringtoCalulate = actionStringtoCalulate.replace(
          new RegExp(fieldKey, "gi"),
          Number("0")
        );
      } else {
        actionStringtoCalulate = actionStringtoCalulate.replace(
          new RegExp(fieldKey, "gi"),
          Number(formData[fieldKey])
        );
      }
    });
    console.log(
      "mainFormFields_processFormulaObjectV2_actionStringtoCalulate",
      actionStringtoCalulate
    );
    returnResult = evaluate(actionStringtoCalulate);
  } else if (formulaObject.action == "sumOf") {
    console.log("mainFormFields_sumOf_Start");
    toFormInputTemplateKeys.forEach((fieldKey) => {
      console.log(
        "mainFormFields_sumOf_formData[fieldKey]",
        formData[fieldKey]
      );
      console.log(
        "mainFormFields_sumOf_formData[fieldKey]",
        Number(formData[fieldKey])
      );
      if (formData[fieldKey] == undefined) {
        returnResult = returnResult + 0;
      } else {
        returnResult = returnResult + Number(formData[fieldKey]);
      }
    });
    console.log("mainFormFields_sumOf_returnResult", returnResult);
    console.log("mainFormFields_sumOf_END");
  } else if (formulaObject.action == "diffOf") {
    toFormInputTemplateKeys.forEach((fieldKey) => {
      console.log(
        "mainFormFields_processFormulaObjectV2_formData[fieldKey]",
        formData[fieldKey]
      );
      if (formData[fieldKey] == undefined) {
        returnResult = returnResult - 0;
      } else {
        // returnResult = returnResult - Number(formData[fieldKey]);
        if (returnResult > 0) {
          returnResult = returnResult - Number(formData[fieldKey]);
        } else {
          returnResult = Number(formData[fieldKey]) - returnResult;
        }
      }
    });
  } else if (formulaObject.action == "averageOf") {
    toFormInputTemplateKeys.forEach((fieldKey) => {
      console.log(
        "mainFormFields_processFormulaObjectV2_formData[fieldKey]",
        formData[fieldKey]
      );
      if (formData[fieldKey] == undefined) {
        returnResult = returnResult + 0;
      } else {
        returnResult = returnResult + Number(formData[fieldKey]);
      }
    });

    returnResult = returnResult / toFormInputTemplateKeys.length;
  } else if (formulaObject.action == "multipleOf") {
    returnResult = 1;
    toFormInputTemplateKeys.forEach((fieldKey) => {
      console.log(
        "mainFormFields_processFormulaObjectV2_formData[fieldKey]",
        formData[fieldKey]
      );
      if (formData[fieldKey] == undefined) {
        returnResult = returnResult * 1;
      } else {
        returnResult = returnResult * Number(formData[fieldKey]);
      }
    });
  } else if (formulaObject.action == "dateDiffInDays") {
    //DevNote[AddedOn]:12-10-2023
    if (
      formData[toFormInputTemplateKeys[0]] != undefined &&
      formData[toFormInputTemplateKeys[1]] != undefined
    ) {
      returnResult = dateDiffs(
        formData[toFormInputTemplateKeys[0]],
        formData[toFormInputTemplateKeys[1]],
        1
      );
    }
  } else if (formulaObject.action == "dateAddDays") {
    //DevNote[AddedOn]:15-12-2023
    if (
      formData[toFormInputTemplateKeys[0]] != undefined &&
      formData[toFormInputTemplateKeys[1]] != undefined
    ) {
      returnResult = dateAddDays(
        formData[toFormInputTemplateKeys[0]],
        formData[toFormInputTemplateKeys[1]]
      );
    }
  } else if (formulaObject.action == "dateAdd") {
    //DevNote[AddedOn]:15-12-2023
    if (
      formData[toFormInputTemplateKeys[0]] != undefined &&
      formData[toFormInputTemplateKeys[1]] != undefined
    ) {
      returnResult = dateAdd(
        formData[toFormInputTemplateKeys[0]],
        formData[toFormInputTemplateKeys[1]]
      );
    }
  }
   else if (formulaObject.action == "sum") {
    returnResult = 0;
    console.log("mainFormFields_ActionSum:Start");
    let parentValue = formData[formulaObject.parentKey];

    console.log("mainFormFields_ActionSum_parentValue", parentValue);

    if (parentValue !== undefined) {
      let ifPopulateCount = 1;
      if (isNaN(parentValue)) {
        //Do Nothing
      } else {
        ifPopulateCount = parseInt(parentValue);
      }

      for (let i = 0; i < ifPopulateCount; i++) {
        //let formKeyToCalculate = formulaObject.childKey + "" +formulaObject.parentKey + "" + i;
        let formKeyToCalculate = toFormInputTemplateKeys[0] + "" + i;
        console.log(
          "mainFormFields_formData_value_" + formKeyToCalculate + "_",
          formData[formKeyToCalculate]
        );

        if (formData[formKeyToCalculate] == undefined) {
          //console.log("mainFormFields_ResultSet_at_before_"+formKeyToCalculate,returnResult);
          returnResult = returnResult + 0;
          //console.log("mainFormFields_ResultSet_at_after_"+formKeyToCalculate,returnResult);
        } else {
          //console.log("mainFormFields_ResultSet_at_before_"+formKeyToCalculate,returnResult);
          returnResult = returnResult + Number(formData[formKeyToCalculate]);
          //returnResult = returnResult + formData[formKeyToCalculate];
          //console.log("mainFormFields_ResultSet_at_after_"+formKeyToCalculate,returnResult);
        }
      }
    }

    console.log("mainFormFields_ActionSum:returnResult", returnResult);
    console.log("mainFormFields_ActionSum:END");
  } else if (formulaObject.action == "diff") {
    let parentValue = formData[formulaObject.parentKey];
    console.log(
      "mainFormFields_processFormulaObjectV2_parentValue",
      parentValue
    );

    if (parentValue !== undefined) {
      let ifPopulateCount = 1;
      if (isNaN(parentValue)) {
        //Do Nothing
      } else {
        ifPopulateCount = parseInt(parentValue);
      }

      for (var i = 0; i < ifPopulateCount; i++) {
        //let formKeyToCalculate = formulaObject.childKey + "" +formulaObject.parentKey + "" + i;
        let formKeyToCalculate = toFormInputTemplateKeys[0] + "" + i;
        console.log(
          "mainFormFields_processFormulaObjectV2_formKeyToCalculate",
          formKeyToCalculate
        );
        console.log(
          "mainFormFields_processFormulaObjectV2_formData[formKeyToCalculate]",
          formData[formKeyToCalculate]
        );

        if (formData[formKeyToCalculate] == undefined) {
          returnResult = returnResult - 0;
        } else {
          returnResult = returnResult - Number(formData[formKeyToCalculate]);
        }
      }
    }
  } else if (formulaObject.action == "multiple") {
    var parentValue = formData[formulaObject.parentKey];
    console.log(
      "mainFormFields_processFormulaObjectV2_parentValue",
      parentValue
    );

    if (parentValue !== undefined) {
      returnResult = 1;
      let ifPopulateCount = 1;
      if (isNaN(parentValue)) {
        //Do Nothing
      } else {
        ifPopulateCount = parseInt(parentValue);
      }

      for (var i = 0; i < ifPopulateCount; i++) {
        //let formKeyToCalculate = formulaObject.childKey + "" +formulaObject.parentKey + "" + i;
        let formKeyToCalculate = toFormInputTemplateKeys[0] + "" + i;
        console.log(
          "mainFormFields_processFormulaObjectV2_formKeyToCalculate",
          formKeyToCalculate
        );
        console.log(
          "mainFormFields_processFormulaObjectV2_formData[formKeyToCalculate]",
          formData[formKeyToCalculate]
        );

        if (formData[formKeyToCalculate] == undefined) {
          returnResult = returnResult * 1;
        } else {
          returnResult = returnResult * Number(formData[formKeyToCalculate]);
        }
      }
    }
  } else if (formulaObject.action == "average") {
    var parentValue = formData[formulaObject.parentKey];
    console.log(
      "mainFormFields_processFormulaObjectV2_parentValue",
      parentValue
    );

    if (parentValue !== undefined) {
      let ifPopulateCount = 1;
      if (isNaN(parentValue)) {
        //Do Nothing
      } else {
        ifPopulateCount = parseInt(parentValue);
      }

      for (var i = 0; i < ifPopulateCount; i++) {
        let formKeyToCalculate = toFormInputTemplateKeys[0] + "" + i;
        console.log(
          "mainFormFields_processFormulaObjectV2_formKeyToCalculate",
          formKeyToCalculate
        );
        console.log(
          "mainFormFields_processFormulaObjectV2_formData[formKeyToCalculate]",
          formData[formKeyToCalculate]
        );

        if (formData[formKeyToCalculate] == undefined) {
          returnResult = returnResult + 0;
        } else {
          returnResult = returnResult + Number(formData[formKeyToCalculate]);
        }
      }
      returnResult = returnResult / ifPopulateCount;
    }
  } else if (formulaObject.action == "formatnumber") {
    console.log("formatnumber_", formulaObject);
    const keyToFormat = formulaObject.fieldKey;

    console.log("formatnumber_value22calulate", formData[keyToFormat]);

    return decimalNumberFormatter(
      formData[keyToFormat],
      formulaObject.decimalLevel
    );
  } else if (formulaObject.action == "agefrom") {
    //Added On 17-11-2021

    // console.log(
    //   "agefrom_",
    //   formulaObject
    // );
    const keyToFormat = formulaObject.fieldKey;

    // console.log(
    //   "agefrom_value22calulate",
    //   formData[keyToFormat]
    // );

    if (formData[keyToFormat] != undefined) {
      var dateForAge = formData[keyToFormat].split("-").reverse().join("-");
      // console.log("agefrom_dateForAge",dateForAge)
      // console.log("agefrom_getAgeFromDate",getAgeFromDate(dateForAge))
      return getAgeFromDate(dateForAge);
    }
    return 0;
  } else if (formulaObject.action == "daysfrom") {
    //Added On 25-05-2024

    // console.log(
    //   "agefrom_",
    //   formulaObject
    // );
    const keyToFormat = formulaObject.fieldKey;

    // console.log(
    //   "agefrom_value22calulate",
    //   formData[keyToFormat]
    // );

    if (formData[keyToFormat] != undefined) {
      let dateForAge = formData[keyToFormat].split("-").reverse().join("-");
      // console.log("agefrom_dateForAge",dateForAge)
      // console.log("agefrom_getAgeFromDate",getAgeFromDate(dateForAge))
      return getDaysFromDate(dateForAge);
    }
    return 0;
  } else if (formulaObject.action == "isminor") {
    const keyToFormat = formulaObject.fieldKey;
    console.log("agefrom_isminor_formData[keyToFormat]", formData[keyToFormat]);
    if (formData[keyToFormat] != undefined) {
      if (Number(formData[keyToFormat]) < 18) {
        return "Minor";
      }
      return "Not Minor";
    }
    return "";
  } else if (formulaObject.action == "dateToWord") {
    //DevNote[AddedOn]:12-10-2023
    console.log("dateToWord_", formulaObject);
    const keyToFormat = formulaObject.fieldKey;
    console.log("dateToWord_value22calulate", formData[keyToFormat]);
    return dateToWords(formData[keyToFormat], formulaObject.langCode);
  }

  //getAgeFromDate

  console.log(
    "mainFormFields_processFormulaObjectV2_returnResult",
    returnResult
  );
  console.log("mainFormFields_processFormulaObjectV2:End----");
  //return returnResult;
  // return returnResult.toFixed(2);
  //return Number(returnResult.toFixed(2));
  if (
    formulaObject.action == "dateDiffInDays" ||
    formulaObject.action == "dateAddDays" ||
    formulaObject.action == "dateAdd" 
  ) {
    return returnResult;
  } else {
    return returnResult.toFixed(2);
  }
}

export function processFormulaObjectForConditionalElementV2(
  formulaObject,
  formData,
  superParentTemplateKey
) {
  var returnResult = 0;

  console.log(
    "conditionalFormInputs_processFormulaObjectForConditionalElementV2:Start------"
  );

  console.log("conditionalFormInputs_formulaObject", formulaObject);

  console.log(
    "conditionalFormInputs_superParentTemplateKey",
    superParentTemplateKey
  );

  console.log(
    "conditionalFormInputs_processFormulaObjectV2_formulaObject.noOfFieldsKeys",
    formulaObject.noOfFieldsKeys
  );

  var toFormInputTemplateKeys = [];
  if (formulaObject.noOfFieldsKeys != 0) {
    toFormInputTemplateKeys = keysToFormInputTemplateKeys(
      formulaObject.noOfFieldsKeys
    );
  }

  // console.log(
  //   "conditionalFormInputs_processFormulaObjectV2_toFormInputTemplateKeys",
  //   toFormInputTemplateKeys
  // );

  if (formulaObject.action == "eval") {
    var actionStringtoCalulate = formulaObject.actionString;

    toFormInputTemplateKeys.forEach((fieldKey) => {
      let formKeyToCalculate = fieldKey + "" + superParentTemplateKey; // + "" + 0;

      console.log("conditionalFormInputs_fieldKey", fieldKey);

      console.log(
        "conditionalFormInputs_formKeyToCalculate",
        formKeyToCalculate
      );

      console.log(
        "conditionalFormInputs_processFormulaObjectV2_formData[formKeyToCalculate]",
        formData[formKeyToCalculate]
      );

      if (formData[formKeyToCalculate] == undefined) {
        actionStringtoCalulate = actionStringtoCalulate.replace(
          new RegExp(fieldKey, "gi"),
          Number("0")
        );
      } else {
        actionStringtoCalulate = actionStringtoCalulate.replace(
          new RegExp(fieldKey, "gi"),
          Number(formData[formKeyToCalculate])
        );
      }
    });
    console.log(
      "conditionalFormInputs_processFormulaObjectV2_actionStringtoCalulate",
      actionStringtoCalulate
    );

    returnResult = evaluate(actionStringtoCalulate);
  } else if (formulaObject.action == "sumOf") {
    toFormInputTemplateKeys.forEach((fieldKey) => {
      let formKeyToCalculate = fieldKey + "" + superParentTemplateKey; // + "" + 0;

      console.log(
        "conditionalFormInputs_processFormulaObjectV2_formData[fieldKey]",
        formData[formKeyToCalculate]
      );
      if (formData[formKeyToCalculate] == undefined) {
        returnResult = returnResult + 0;
      } else {
        returnResult = returnResult + Number(formData[formKeyToCalculate]);
      }
    });
  } else if (formulaObject.action == "diffOf") {
    toFormInputTemplateKeys.forEach((fieldKey) => {
      let formKeyToCalculate = fieldKey + "" + superParentTemplateKey; // + "" + 0;
      console.log(
        "conditionalFormInputs_processFormulaObjectV2_formData[fieldKey]",
        formData[formKeyToCalculate]
      );
      if (formData[formKeyToCalculate] == undefined) {
        returnResult = returnResult - 0;
      } else {
        // returnResult = returnResult - Number(formData[formKeyToCalculate]);
        if (returnResult > 0) {
          returnResult = returnResult - Number(formData[formKeyToCalculate]);
        } else {
          returnResult = Number(formData[formKeyToCalculate]) - returnResult;
        }
      }
    });
  } else if (formulaObject.action == "dateDiffInDays") {
    //DevNote[AddedOn]:12-10-2023
    if (
      formData[toFormInputTemplateKeys[0] + "" + superParentTemplateKey] !=
        undefined &&
      formData[toFormInputTemplateKeys[1] + "" + superParentTemplateKey] !=
        undefined
    ) {
      returnResult = dateDiffs(
        formData[toFormInputTemplateKeys[0] + "" + superParentTemplateKey],
        formData[toFormInputTemplateKeys[1] + "" + superParentTemplateKey],
        1
      );
    }
  } else if (formulaObject.action == "dateAddDays") {
    //DevNote[AddedOn]:15-12-2023
    if (
      formData[toFormInputTemplateKeys[0] + "" + superParentTemplateKey] !=
        undefined &&
      formData[toFormInputTemplateKeys[1] + "" + superParentTemplateKey] !=
        undefined
    ) {
      returnResult = dateAddDays(
        formData[toFormInputTemplateKeys[0] + "" + superParentTemplateKey],
        formData[toFormInputTemplateKeys[1] + "" + superParentTemplateKey]
      );
    }
  }else if (formulaObject.action == "dateAdd") {
    //DevNote[AddedOn]:15-12-2023
    if (
      formData[toFormInputTemplateKeys[0] + "" + superParentTemplateKey] !=
        undefined &&
      formData[toFormInputTemplateKeys[1] + "" + superParentTemplateKey] !=
        undefined
    ) {
      returnResult = dateAdd(
        formData[toFormInputTemplateKeys[0] + "" + superParentTemplateKey],
        formData[toFormInputTemplateKeys[1] + "" + superParentTemplateKey]
      );
    }
  } 
  else if (formulaObject.action == "averageOf") {
    toFormInputTemplateKeys.forEach((fieldKey) => {
      let formKeyToCalculate = fieldKey + "" + superParentTemplateKey; // + "" + 0;
      console.log(
        "conditionalFormInputs_processFormulaObjectV2_formData[fieldKey]",
        formData[formKeyToCalculate]
      );
      if (formData[formKeyToCalculate] == undefined) {
        returnResult = returnResult + 0;
      } else {
        returnResult = returnResult + Number(formData[formKeyToCalculate]);
      }
    });
    returnResult = returnResult / toFormInputTemplateKeys.length;
  } else if (formulaObject.action == "multipleOf") {
    returnResult = 1;
    toFormInputTemplateKeys.forEach((fieldKey) => {
      let formKeyToCalculate = fieldKey + "" + superParentTemplateKey; // + "" + 0;
      console.log(
        "conditionalFormInputs_processFormulaObjectV2_formData[fieldKey]",
        formData[formKeyToCalculate]
      );
      if (formData[formKeyToCalculate] == undefined) {
        returnResult = returnResult * 1;
      } else {
        returnResult = returnResult * Number(formData[formKeyToCalculate]);
      }
    });
  } else if (formulaObject.action == "sum") {
    console.log(
      "conditionalFormInputs_superParentTemplateKey",
      superParentTemplateKey
    );

    console.log(
      "conditionalFormInputs_formulaObject.parentKey",
      formulaObject.parentKey
    );

    console.log(
      "conditionalFormInputs_formulaObject.parentKey+superParentTemplateKey",
      formulaObject.parentKey + "" + superParentTemplateKey
    );

    var parentValue =
      formData[formulaObject.parentKey + "" + superParentTemplateKey];
    console.log(
      "conditionalFormInputs_processFormulaObjectV2_parentValue",
      parentValue
    );

    if (parentValue !== undefined) {
      let ifPopulateCount = 1;
      if (isNaN(parentValue)) {
        //Do Nothing
      } else {
        ifPopulateCount = parseInt(parentValue);
      }

      for (var i = 0; i < ifPopulateCount; i++) {
        let formKeyToCalculate =
          toFormInputTemplateKeys[0] + "" + superParentTemplateKey + "" + i;
        console.log(
          "conditionalFormInputs_processFormulaObjectV2_formKeyToCalculate",
          formKeyToCalculate
        );
        console.log(
          "conditionalFormInputs_processFormulaObjectV2_formData[formKeyToCalculate]",
          formData[formKeyToCalculate]
        );

        if (formData[formKeyToCalculate] == undefined) {
          returnResult = returnResult + 0;
        } else {
          returnResult = returnResult + Number(formData[formKeyToCalculate]);
        }
      }
    }
  } else if (formulaObject.action == "diff") {
    console.log(
      "conditionalFormInputs_superParentTemplateKey",
      superParentTemplateKey
    );

    console.log(
      "conditionalFormInputs_formulaObject.parentKey",
      formulaObject.parentKey
    );

    console.log(
      "conditionalFormInputs_formulaObject.parentKey+superParentTemplateKey",
      formulaObject.parentKey + "" + superParentTemplateKey
    );

    var parentValue =
      formData[formulaObject.parentKey + "" + superParentTemplateKey];
    console.log(
      "conditionalFormInputs_processFormulaObjectV2_parentValue",
      parentValue
    );

    if (parentValue !== undefined) {
      let ifPopulateCount = 1;
      if (isNaN(parentValue)) {
        //Do Nothing
      } else {
        ifPopulateCount = parseInt(parentValue);
      }

      for (var i = 0; i < ifPopulateCount; i++) {
        let formKeyToCalculate =
          toFormInputTemplateKeys[0] + "" + superParentTemplateKey + "" + i;
        console.log(
          "conditionalFormInputs_processFormulaObjectV2_formKeyToCalculate",
          formKeyToCalculate
        );
        console.log(
          "conditionalFormInputs_processFormulaObjectV2_formData[formKeyToCalculate]",
          formData[formKeyToCalculate]
        );

        if (formData[formKeyToCalculate] == undefined) {
          returnResult = returnResult - 0;
        } else {
          returnResult = returnResult - Number(formData[formKeyToCalculate]);
        }
      }
    }
  } else if (formulaObject.action == "multiple") {
    console.log(
      "conditionalFormInputs_superParentTemplateKey",
      superParentTemplateKey
    );

    console.log(
      "conditionalFormInputs_formulaObject.parentKey",
      formulaObject.parentKey
    );

    console.log(
      "conditionalFormInputs_formulaObject.parentKey+superParentTemplateKey",
      formulaObject.parentKey + "" + superParentTemplateKey
    );

    var parentValue =
      formData[formulaObject.parentKey + "" + superParentTemplateKey];
    console.log(
      "conditionalFormInputs_processFormulaObjectV2_parentValue",
      parentValue
    );

    if (parentValue !== undefined) {
      returnResult = 1;
      let ifPopulateCount = 1;
      if (isNaN(parentValue)) {
        //Do Nothing
      } else {
        ifPopulateCount = parseInt(parentValue);
      }

      for (var i = 0; i < ifPopulateCount; i++) {
        let formKeyToCalculate =
          toFormInputTemplateKeys[0] + "" + superParentTemplateKey + "" + i;
        console.log(
          "conditionalFormInputs_processFormulaObjectV2_formKeyToCalculate",
          formKeyToCalculate
        );
        console.log(
          "conditionalFormInputs_processFormulaObjectV2_formData[formKeyToCalculate]",
          formData[formKeyToCalculate]
        );

        if (formData[formKeyToCalculate] == undefined) {
          returnResult = returnResult * 1;
        } else {
          returnResult = returnResult * Number(formData[formKeyToCalculate]);
        }
      }
    }
  } else if (formulaObject.action == "average") {
    console.log(
      "conditionalFormInputs_superParentTemplateKey",
      superParentTemplateKey
    );

    console.log(
      "conditionalFormInputs_formulaObject.parentKey",
      formulaObject.parentKey
    );

    console.log(
      "conditionalFormInputs_formulaObject.parentKey+superParentTemplateKey",
      formulaObject.parentKey + "" + superParentTemplateKey
    );

    var parentValue =
      formData[formulaObject.parentKey + "" + superParentTemplateKey];
    console.log(
      "conditionalFormInputs_processFormulaObjectV2_parentValue",
      parentValue
    );

    if (parentValue !== undefined) {
      let ifPopulateCount = 1;
      if (isNaN(parentValue)) {
        //Do Nothing
      } else {
        ifPopulateCount = parseInt(parentValue);
      }

      for (var i = 0; i < ifPopulateCount; i++) {
        let formKeyToCalculate =
          toFormInputTemplateKeys[0] + "" + superParentTemplateKey + "" + i;
        console.log(
          "conditionalFormInputs_processFormulaObjectV2_formKeyToCalculate",
          formKeyToCalculate
        );
        console.log(
          "conditionalFormInputs_processFormulaObjectV2_formData[formKeyToCalculate]",
          formData[formKeyToCalculate]
        );

        if (formData[formKeyToCalculate] == undefined) {
          returnResult = returnResult + 0;
        } else {
          returnResult = returnResult + Number(formData[formKeyToCalculate]);
        }
      }
      returnResult = returnResult / ifPopulateCount;
    }
  } else if (formulaObject.action == "formatnumber") {
    // console.log(
    //   "formatnumber_condition",
    //   formulaObject
    // );
    //formulaObject.parentKey + "" + superParentTemplateKey

    const keyToFormat = formulaObject.fieldKey + "" + superParentTemplateKey;
    //formData[keyToFormat]

    // console.log(
    //   "formatnumber_condition_value22calulate",
    //   formData[keyToFormat]
    // );
    return decimalNumberFormatter(
      formData[keyToFormat],
      formulaObject.decimalLevel
    );
  } else if (formulaObject.action == "agefrom") {
    //added on 17-11-2021

    // console.log(
    //   "agefrom_",
    //   formulaObject
    // );

    const keyToFormat = formulaObject.fieldKey + "" + superParentTemplateKey;

    // console.log(
    //   "agefrom_value22calulate",
    //   formData[keyToFormat]
    // );

    if (formData[keyToFormat] != undefined) {
      var dateForAge = formData[keyToFormat].split("-").reverse().join("-");
      // console.log("agefrom_dateForAge", dateForAge);
      // console.log("agefrom_getAgeFromDate", getAgeFromDate(dateForAge));
      return getAgeFromDate(dateForAge);
    }
    return 0;
  } else if (formulaObject.action == "daysfrom") {
    //added on 25-05-2024

    // console.log(
    //   "agefrom_",
    //   formulaObject
    // );

    const keyToFormat = formulaObject.fieldKey + "" + superParentTemplateKey;

    // console.log(
    //   "agefrom_value22calulate",
    //   formData[keyToFormat]
    // );

    if (formData[keyToFormat] != undefined) {
      let dateForAge = formData[keyToFormat].split("-").reverse().join("-");
      // console.log("agefrom_dateForAge", dateForAge);
      // console.log("agefrom_getAgeFromDate", getAgeFromDate(dateForAge));
      return getDaysFromDate(dateForAge);
    }
    return 0;
  } else if (formulaObject.action == "isminor") {
    const keyToFormat = formulaObject.fieldKey;
    console.log("agefrom_isminor_formData[keyToFormat]", formData[keyToFormat]);
    if (formData[keyToFormat] != undefined) {
      if (Number(formData[keyToFormat]) < 18) {
        return "Minor";
      }
      return "Not Minor";
    }
    return "";
  } else if (formulaObject.action == "dateToWord") {
    //DevNote[AddedOn]:12-10-2023
    console.log("dateToWord_", formulaObject);
    const keyToFormat = formulaObject.fieldKey;
    console.log("dateToWord_value22calulate", formData[keyToFormat]);
    return dateToWords(formData[keyToFormat], formulaObject.langCode);
  }

  console.log(
    "conditionalFormInputs_processFormulaObjectForConditionalElementV2_returnResult",
    returnResult
  );
  console.log(
    "conditionalFormInputs_processFormulaObjectForConditionalElementV2:END------"
  );

  //return returnResult;//Old
  // return returnResult.toFixed(2);
  //return Number(returnResult.toFixed(2));

  if (
    formulaObject.action == "dateDiffInDays" ||
    formulaObject.action == "dateAddDays" ||
    formulaObject.action == "dateAdd"
  ) {
    return returnResult;
  } else {
    return returnResult.toFixed(2);
  }
}

function dateToWords(dateVal, langCode) {
  console.log("dateToWords_dateVal", dateVal);
  if (dateVal != undefined) {
    var dateObj1 = new Date(Moment(dateVal, "DD-MM-YYYY").format("L"));
    console.log("dateToWords_dateObj1", dateObj1);

    var dateValArray = dateVal.split("-");
    console.log("dateToWords_dateValArray", dateValArray);

    var dayToOrdinalWord = stringifyNumber(parseInt(dateValArray[0]));
    var monthWord = month2MonthString(dateValArray[1]);
    var yearWords = yearToWords(dateValArray[2]);
    // var testDate1=Moment(dateObj);
    // Moment.locale("fr");
    // console.log("dateDiffs_date1_moment_fr_1",testDate1.format("Do MMMM YYYY"));
    // console.log("dateDiffs_date1_moment_fr_2",Moment(dateObj).locale("fr").format("Do MMMM YYYY"));
    // console.log("dateDiffs_date1_moment_hi_2",Moment(dateObj).locale("hi").format("Do MMMM YYYY"));
    /*import frLocale from 'moment/locale/fr';
  import hiLocale from 'moment/locale/hi';
  */
    // Moment.locale("hi");
    // console.log("dateDiffs_date1_moment_hi",Moment(dateObj1).locale("hi").format("Do MMMM YYYY"));
    return dayToOrdinalWord + " " + monthWord + " " + yearWords;
  } else {
    return "";
  }
}

function stringifyNumber(n) {
  var special = [
    "Zeroth",
    "First",
    "Second",
    "Third",
    "Fourth",
    "Fifth",
    "Sixth",
    "Seventh",
    "Eighth",
    "Ninth",
    "Tenth",
    "Eleventh",
    "Twelvth",
    "Thirteenth",
    "Fourteenth",
    "Fifteenth",
    "Sixteenth",
    "Seventeenth",
    "Eighteenth",
    "Nineteenth",
  ];
  var deca = [
    "Twent",
    "Thirt",
    "Fourt",
    "Fift",
    "Sixt",
    "Sevent",
    "Eight",
    "Ninet",
  ];

  if (n < 20) return special[n];
  if (n % 10 === 0) return deca[Math.floor(n / 10) - 2] + "ieth";
  return deca[Math.floor(n / 10) - 2] + "y-" + special[n % 10];
}

export function yearToWords(year) {
  if (year == undefined) {
    return "";
  } else {
    var nums = year.toString().split(".");
    //var whole = digitAmountToWordWithDecimal(nums[0])
    var whole = convertNumberToWords(nums[0]);
    if (nums.length == 2) {
      //var fraction = digitAmountToWordWithDecimal(nums[1])
      var fraction = convertNumberToWords(nums[1]);
      return whole + " " + fraction + " ";
    } else {
      return whole + " ";
    }
  }
}

//DevNote[AddedOn]:12-10-2023
function dateDiffs(date1, date2, type) {
  // dateToWords(date1,"en");//Testing
  console.log("dateDiffs_date1", date1);
  console.log("dateDiffs_date2", date2);
  console.log(
    "dateDiffs_date1_moment",
    Moment(date1, "DD-MM-YYYY").format("L")
  );
  console.log(
    "dateDiffs_date2_moment",
    Moment(date2, "DD-MM-YYYY").format("L")
  );
  var dateObj1 = new Date(Moment(date1, "DD-MM-YYYY").format("L"));
  var dateObj2 = new Date(Moment(date2, "DD-MM-YYYY").format("L"));
  // console.log("dateDiffs_dateObj1",dateObj1);
  // console.log("dateDiffs_dateObj2",dateObj2);

  if (type == 1) {
    //DevNote[Remark]:In Days
    const diffTime = Math.abs(dateObj1 - dateObj2);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // console.log("dateDiffs_milliseconds",diffTime + " milliseconds");
    // console.log("dateDiffs_days",diffDays + " days");
    // console.log("dateDiffs_diffDays",diffDays);
    // return parseInt(diffDays);
    return diffDays;
  }
}

//DevNote[AddedOn]:15-12-2023
function dateAddDays(dateValue, daysValue) {
  // var newDate=new Date(Moment(dateValue,"DD-MM-YYYY").add(Number(daysValue),"days"));
  // return Moment(newDate).format("DD-MM-YYYY");
  return Moment(
    new Date(Moment(dateValue, "DD-MM-YYYY").add(Number(daysValue), "days"))
  ).format("DD-MM-YYYY");
}
function dateAdd(dateValue, duration) {
  const startDate = Moment(dateValue, "DD-MM-YYYY"); // Parse the input date
  if (!startDate.isValid()) {
    throw new Error("Invalid date format. Use DD-MM-YYYY.");
  }

  // Handle empty or undefined duration
  if (!duration || duration.trim() === "") {
    return startDate.format("DD-MM-YYYY"); // Return the original date unchanged
  }

  // Normalize duration to remove invalid characters and handle decimals
  duration = duration.replace(/[^0-9.ymd]/gi, "").trim();

  let value, unit;

  if (/^\d+(\.\d+)?$/.test(duration)) {
    // If the duration is just a number or a decimal, default to years
    value = Math.floor(parseFloat(duration)); // Treat 4.00 as 4
    unit = "y";
  } else {
    // Match a number (or decimal) followed by 'y', 'm', or 'd'
    const match = duration.match(/^(\d+(\.\d+)?)([ymd])$/);
    if (!match) {
      throw new Error("Invalid duration format. Use a number or a number followed by 'y', 'm', or 'd'.");
    }

    value = Math.floor(parseFloat(match[1])); // Extract the numeric value and floor it
    unit = match[3]; // Extract the unit (y, m, d)
  }

  // Add the duration to the start date
  let newDate;
  switch (unit) {
    case "y":
      newDate = startDate.add(value, "years");
      break;
    case "m":
      newDate = startDate.add(value, "months");
      break;
    case "d":
      newDate = startDate.add(value, "days");
      break;
    default:
      throw new Error("Invalid unit. Use 'y' for years, 'm' for months, or 'd' for days.");
  }

  // Format and return the final date
  return newDate.format("DD-MM-YYYY");
}

export function fetchFormulaObject(formulaValue) {
  var formulaObject = {};

  console.log("mainFormFields_fetchFormulaObject_formulaValue", formulaValue);
  formulaObject["action"] = formulaValue.split("=")[0];

  var formulaObjectVars = formulaValue.substring(
    formulaValue.lastIndexOf("(") + 1,
    formulaValue.lastIndexOf(")")
  );

  console.log(
    "mainFormFields_fetchFormulaObject_formulaObjectVars",
    formulaObjectVars
  );

  formulaObject["parentKey"] = formulaObjectVars.split(".")[0];
  formulaObject["childKey"] = formulaObjectVars.split(".")[1];

  return formulaObject;
}

export function processFormulaObject(formulaObject, parentValue, formData) {
  var returnResult = 0;

  console.log(
    "mainFormFields_processFormulaObject_formulaObject",
    formulaObject
  );
  console.log("mainFormFields_processFormulaObject_parentValue", parentValue);

  if (parentValue !== undefined) {
    let ifPopulateCount = 1;
    if (isNaN(parentValue)) {
      //Do Nothing
    } else {
      ifPopulateCount = parseInt(parentValue);
    }

    //pricenoofitems0
    for (var i = 0; i < ifPopulateCount; i++) {
      let formKeyToCalculate =
        formulaObject.childKey + "" + formulaObject.parentKey + "" + i;
      console.log(
        "mainFormFields_processFormulaObject_formKeyToCalculate",
        formKeyToCalculate
      );
      console.log(
        "mainFormFields_processFormulaObject_formData[formKeyToCalculate]",
        formData[formKeyToCalculate]
      );

      if (formulaObject.action == "sum") {
        if (formData[formKeyToCalculate] == undefined) {
          returnResult = returnResult + 0;
        } else {
          returnResult = returnResult + Number(formData[formKeyToCalculate]);
        }
      } else if (formulaObject.action == "subtraction") {
        if (formData[formKeyToCalculate] == undefined) {
          returnResult = returnResult - 0;
        } else {
          returnResult = returnResult - Number(formData[formKeyToCalculate]);
        }
      }
    }
  }

  return returnResult;
}

export function fetchFormulaObjectForConditionalElement(
  formulaValue,
  superParentTemplateKey
) {
  var formulaObject = {};

  console.log(
    "conditionalFormInputs_fetchFormulaObject_formulaValue",
    formulaValue
  );
  formulaObject["action"] = formulaValue.split("=")[0];

  var formulaObjectVars = formulaValue.substring(
    formulaValue.lastIndexOf("(") + 1,
    formulaValue.lastIndexOf(")")
  );

  console.log(
    "conditionalFormInputs_fetchFormulaObject_formulaObjectVars",
    formulaObjectVars
  );

  formulaObject["parentKey"] =
    formulaObjectVars.split(".")[0] + superParentTemplateKey;
  formulaObject["childKey"] = formulaObjectVars.split(".")[1];
  return formulaObject;
}

export function processFormulaObjectForConditionalElement(
  formulaObject,
  parentValue,
  formData
) {
  var returnResult = 0;

  console.log(
    "mainFormFields_processFormulaObject_formulaObject",
    formulaObject
  );
  console.log("mainFormFields_processFormulaObject_parentValue", parentValue);

  if (parentValue !== undefined) {
    let ifPopulateCount = 1;
    if (isNaN(parentValue)) {
      //Do Nothing
    } else {
      ifPopulateCount = parseInt(parentValue);
    }

    for (var i = 0; i < ifPopulateCount; i++) {
      //pricenoofitemsinshowitemtables00
      let formKeyToCalculate =
        formulaObject.childKey + "" + formulaObject.parentKey + "" + i;
      console.log(
        "mainFormFields_processFormulaObject_formKeyToCalculate",
        formKeyToCalculate
      );
      console.log(
        "mainFormFields_processFormulaObject_formData[formKeyToCalculate]",
        formData[formKeyToCalculate]
      );

      if (formulaObject.action == "sum") {
        if (formData[formKeyToCalculate] == undefined) {
          returnResult = returnResult + 0;
        } else {
          returnResult = returnResult + Number(formData[formKeyToCalculate]);
        }
      } else if (formulaObject.action == "subtraction") {
        if (formData[formKeyToCalculate] == undefined) {
          returnResult = returnResult - 0;
        } else {
          returnResult = returnResult - Number(formData[formKeyToCalculate]);
        }
      }
    }
  }

  return returnResult;
}

function digitAmountToWordWithDecimal(amount) {
  const a = [
    "",
    "one ",
    "two ",
    "three ",
    "four ",
    "five ",
    "six ",
    "seven ",
    "eight ",
    "nine ",
    "ten ",
    "eleven ",
    "twelve ",
    "thirteen ",
    "fourteen ",
    "fifteen ",
    "sixteen ",
    "seventeen ",
    "eighteen ",
    "nineteen ",
  ];

  const b = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];

  const regex = /^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/;

  const getLT20 = (n) => a[Number(n)];
  const getGT20 = (n) => b[n[0]] + " " + a[n[1]];

  const num = Number(amount);
  if (isNaN(num)) return "";
  if (num === 0) return "zero";

  const numStr = num.toString();
  if (numStr.length > 9) {
    throw new Error("overflow"); // Does not support converting more than 9 digits yet
  }

  const [, n1, n2, n3, n4, n5] = ("000000000" + numStr).substr(-9).match(regex); // left pad zeros

  let str = "";
  str += n1 != 0 ? (getLT20(n1) || getGT20(n1)) + "crore " : "";
  str += n2 != 0 ? (getLT20(n2) || getGT20(n2)) + "lakh " : "";
  str += n3 != 0 ? (getLT20(n3) || getGT20(n3)) + "thousand " : "";
  str += n4 != 0 ? getLT20(n4) + "hundred " : "";
  str += n5 != 0 && str != "" ? "and " : "";
  str += n5 != 0 ? getLT20(n5) || getGT20(n5) : "";

  return str.trim();
}

function convertNumberToWords(amount) {
  var words = new Array();
  words[0] = "";
  words[1] = "One";
  words[2] = "Two";
  words[3] = "Three";
  words[4] = "Four";
  words[5] = "Five";
  words[6] = "Six";
  words[7] = "Seven";
  words[8] = "Eight";
  words[9] = "Nine";
  words[10] = "Ten";
  words[11] = "Eleven";
  words[12] = "Twelve";
  words[13] = "Thirteen";
  words[14] = "Fourteen";
  words[15] = "Fifteen";
  words[16] = "Sixteen";
  words[17] = "Seventeen";
  words[18] = "Eighteen";
  words[19] = "Nineteen";
  words[20] = "Twenty";
  words[30] = "Thirty";
  words[40] = "Forty";
  words[50] = "Fifty";
  words[60] = "Sixty";
  words[70] = "Seventy";
  words[80] = "Eighty";
  words[90] = "Ninety";
  amount = amount.toString();
  var atemp = amount.split(".");
  var number = atemp[0].split(",").join("");
  var n_length = number.length;
  var words_string = "";
  if (n_length <= 9) {
    var n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
    var received_n_array = new Array();
    for (var i = 0; i < n_length; i++) {
      received_n_array[i] = number.substr(i, 1);
    }
    for (var i = 9 - n_length, j = 0; i < 9; i++, j++) {
      n_array[i] = received_n_array[j];
    }
    for (var i = 0, j = 1; i < 9; i++, j++) {
      if (i == 0 || i == 2 || i == 4 || i == 7) {
        if (n_array[i] == 1) {
          n_array[j] = 10 + parseInt(n_array[j]);
          n_array[i] = 0;
        }
      }
    }
    var value = "";
    for (var i = 0; i < 9; i++) {
      if (i == 0 || i == 2 || i == 4 || i == 7) {
        value = n_array[i] * 10;
      } else {
        value = n_array[i];
      }
      if (value != 0) {
        words_string += words[value] + " ";
      }
      if (
        (i == 1 && value != 0) ||
        (i == 0 && value != 0 && n_array[i + 1] == 0)
      ) {
        words_string += "Crores ";
      }
      if (
        (i == 3 && value != 0) ||
        (i == 2 && value != 0 && n_array[i + 1] == 0)
      ) {
        words_string += "Lakhs ";
      }
      if (
        (i == 5 && value != 0) ||
        (i == 4 && value != 0 && n_array[i + 1] == 0)
      ) {
        words_string += "Thousand ";
      }
      if (i == 6 && value != 0 && n_array[i + 1] != 0 && n_array[i + 2] != 0) {
        words_string += "Hundred and ";
      } else if (i == 6 && value != 0) {
        words_string += "Hundred ";
      }
    }
    words_string = words_string.split("  ").join(" ");
  }
  return words_string;
}

export function digitAmountToWord(amount) {
  if (amount == undefined) {
    return "";
  } else {
    var nums = amount.toString().split(".");
    //var whole = digitAmountToWordWithDecimal(nums[0])
    var whole = convertNumberToWords(nums[0]);
    if (nums.length == 2 && nums[1] > 0) {
      //var fraction = digitAmountToWordWithDecimal(nums[1])
      var fraction = convertNumberToWords(nums[1]);
      return whole + " and " + fraction + " only";
    } else {
      return whole + " only";
    }
  }
  //return digitAmountToWordWithDecimal(amount) + " only"
}
