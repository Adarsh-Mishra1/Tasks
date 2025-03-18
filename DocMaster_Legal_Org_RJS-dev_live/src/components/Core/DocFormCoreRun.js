//DocFormCoreRun.js
import React, { Component, useState } from "react";
import { Form } from "reactstrap";
import { Tooltip as ReactTooltip } from "react-tooltip";
import axios from "axios";
import Moment from "moment";
import ReactToPrint from "react-to-print";
import Table from "../table";
import Modal from "react-modal";
// import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { confirmAlert } from "react-confirm-alert"; // Import Dep
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

// import { withRouter } from "../Other/NavComponents";
import SampleHeading from "./sampleHeading";
import TinyMce from "../../components/Other/TinyMce";
import { InputFieldRendring } from "./InputFieldRendring";
import { sortFormFields } from "../../OtherFunctions/FormRenderingFunctions";
import { htmlString2Print } from "../../OtherFunctions/OtherUIFunctions";
import { useNavigate, useLocation } from "react-router-dom";
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
  GetRecordsWithDynamicParameters,
  WSPutOrgDocFormUserInputData,
  getFieldsURL,
  WsPutClientDocFormDraftData,
  WsPutClientDocFormDraftDataNew,
  askGenerateAiProbelmInfo,
  uploadSingleFileExt,
} from "../../configs/WebService";
import {
  apiKeyHeader,
  apiKeyHeaderMultiPartFormData,
} from "../../configs/ApiKeys";
import {
  ordinal_suffix_of,
  month2MonthString,
  processPageBreak,
  processPageBreakForBackEnd,
  processPageBreakForDoc,
  processPageBreakForJsPrint,
  timeTo12HourFormat,
  dataURItoBlob,
  validEmailAddress,
  validatePhoneNumber,
  getFieldFromFieldArray,
  processPageBreakandContent,
  formatAiResponse,
  processPageBreakandWebContent,
} from "../../OtherFunctions/OtherFunctions";
import {
  processPreFilledDataFormInput,
  processUserPrefilledForTemplate,
} from "../../OtherFunctions/PreFilledInputDataProcess";

import {
  processDocFormDraftDataFormInput,
  processDraftForTemplate,
} from "../../OtherFunctions/DraftDataProcess";

import {
  inPutFieldStart,
  inPutFieldEnd,
  inPutFieldStartBlank,
  inPutFieldEndBlank,
} from "../../configs/GeneralConfigs";
import InputFieldToggle from "../Other/InputFieldToggle";
import ContentToPrint from "../ContentToPrint";
import { getWebContentByCode } from "../../customHooks/webContentHook";
import AutoFill from "../AutoFill";
import Popup from "../../pages/caseDiary/Popup";

// toast.configure();
class DocFormCoreRun extends Component {
  constructor(props) {
    super(props);

    // console.log(
    //   "DocmasterCoreRunGeneralUser_constructor",
    //   this.props.filledDocForm
    // );

    let formDataTemp = {};
    if (
      this.props.filledDocForm != undefined &&
      this.props.filledDocForm.inputData != undefined &&
      this.props.filledDocForm.inputData != null &&
      this.props.filledDocForm.inputData.length > 5
    ) {
      formDataTemp = JSON.parse(this.props.filledDocForm.inputData);
    }

    console.log("DocFormCoreRun_userData", this.props.userData); //set it to below Form Data
    console.log("DocFormCoreRun_draft", this.props.draft); //set it to below Form Data

    let processInitialProps = this.processReceivedProps();
    console.log(
      "DocFormCoreRun_InConstruct_processInitialProps",
      processInitialProps
    );

    this.state = {
      userData: this.props.userData,
      submittedBy: this.props.submittedBy,
      storeRecordId: 0,
      gUserEmail: "",
      gUserSMSNo: "",
      gUserWhatsAppNo: "",
      showActionButtons: false,
      showOtherButton: true,
      showSendToEmailModal: false,
      showSendToSMSModal: false,
      showSendToWhatsAppModal: false,
      printDoc: false,
      docForm: props.docForm,
      selectedConditionalFormInput: {},
      selectedConditionalFormInputValue: "",
      printMarginLeft: this.props.formsFieldsData?.printMarginLeft,
      printMarginRight: this.props.formsFieldsData?.printMarginRight,
      printMarginTop: this.props.formsFieldsData?.printMarginTop,
      printMarginBottom: this.props.formsFieldsData?.printMarginBottom,
      pageType: this.props.formsFieldsData?.pageType,
      mainFormFields: this.props.formsFieldsData?.formFields,
      showEditor: false,
      // formsFieldsDataSorted: sortFormFields(//old
      //   this.props.formsFieldsData.formFields
      // ),
      // formData: formDataTemp,
      formData: processInitialProps.formData,
      mainDocFormTemplate: this.props.formsTemplate,
      // testTemplateToShow: this.props.formsTemplate,
      testTemplateToShow: processInitialProps.testTemplateToShow,
      // formsFieldsDataSorted: processPreFilledDataFormInput(
      //   sortFormFields(this.props.formsFieldsData.formFields),
      //   this.props.userPrefilledFields,
      //   this.props.filledDocForm
      // ),
      formsFieldsDataSorted: processInitialProps.formsFieldsDataSorted,
      // conditionalFormInputs: {},
      conditionalFormInputs: processInitialProps.conditionalFormInputs,
      userPrefilledFields: this.props.userPrefilledFields,
      errors: "",
      docFormError: "",
      showSubmitButton: false,
      usingEditor: false,
      doSavePdfOnServer: 0,
      filledFormPdfFileUrl: "",
      additionalMessage: "",
      filledDocForm: this.props.filledDocForm,
      draft: this.props.draft,
      title: processInitialProps.title,
      changeCount: 0,
      multiSelectValueInputs: {},
      savingType: "submit",
      responseResult: [],
      caseHearingDiary: {},
      aiResponse: "",
      jsonState: {},
      processedContent: "",
      displayAutoFillPopup: false,
      seletedBill: {},
      seletedBills: [],
      fieldsList: [],
      inputDisplay: false,
      displayComparePopup: false,
      comparedAiContent: "",
      submitbtnLoader: false,
    };
    // const [responseData, setResponseData] = useState([]);
    //formData: JSON.parse(this.props.filledDocForm.inputData),
    // console.log("DocFormCoreRun_draft_id",(this.props.draft?.id>0)?this.props.draft?.id:0)

    console.warn("this.props.clientFormType: ", this.props.clientFormType);
    // this.sample();
  }

  async sample() {
    const webPageContent = await getWebContentByCode("0001");
    const tempSpanTag = document.createElement("span");
    tempSpanTag.innerHTML = webPageContent.content;
    console.log("tempSpanTag_textContent: ", tempSpanTag.innerText);
    this.setState((prev) => ({
      ...prev,
      formData: { ...prev.formData, web_code_0001: webPageContent.content },
      // formData: { ...prev.formData, web_code_0001: tempSpanTag.innerHTML },
    }));
  }
  async getFields() {
    const apiUrl = getFieldsURL;
    axios
      .get(apiUrl)
      .then((response) => {
        this.setState({
          fieldsList: response.data, // Store the data in state
          loading: false, // Set loading to false when data is fetched
        });
      })
      .catch((error) => {
        this.setState({
          error: error.message, // Store the error message
          loading: false, // Set loading to false in case of error
        });
      });
  }

  processReceivedProps() {
    console.log("DocFormCoreRun_processReceivedProps");
    console.log(
      "DocFormCoreRun_processReceivedProps_this.props.formsFieldsData",
      this.props.formsFieldsData
    );
    console.log(
      "DocFormCoreRun_processReceivedProps_this.props.formsFieldsData",
      this.props.formsTemplate
    );

    //DevNote[Remark]:Start- Processing User Draft Data
    let tempFormsFieldSorted = sortFormFields(
      this.props.formsFieldsData.formFields
    );
    let tempConditionalFormInputs = {};
    let tempTestTemplateToShow = this.props.formsTemplate;
    let formData = {};

    let title =
      this.props?.draft?.title != undefined &&
      this.props?.draft?.title.length > 0
        ? this.props.draft?.title
        : this.props.docForm.formNameTitle != undefined
        ? this.props.docForm.formNameTitle
        : this.props.docForm.nameTitle;

    // console.log(
    //   "DocFormCoreRun_processReceivedProps_this.docForm",
    //   this.props.docForm
    // );

    // console.log(
    //   "DocFormCoreRun_processReceivedProps_this.context?.template_old",
    //   this.props.formsTemplate
    // );

    if (this.props?.draft?.id != undefined && this.props?.draft?.id > 0) {
      // console.log(
      //   "DocFormCoreRun_processReceivedProps_this.props?.draft",
      //   this.props?.draft
      // );

      formData = this.props.draft?.inputData;

      //AS per User Saved Draft
      tempTestTemplateToShow = this.props.draft?.htmlData;
      let tempFormsFieldSortedReturn = processDocFormDraftDataFormInput(
        tempFormsFieldSorted,
        formData
      );

      // tempFormsFieldSorted = tempFormsFieldSortedReturn.formsFieldsDataSorted;
      tempConditionalFormInputs =
        tempFormsFieldSortedReturn.conditionalFormInputs;

      console.log(
        "DocFormCoreRun_processReceivedProps_sortFormFields",
        tempFormsFieldSorted
      );

      console.log(
        "DocFormCoreRun_processReceivedProps_tempFormsFieldSortedReturn",
        tempFormsFieldSortedReturn
      );

      console.log(
        "DocFormCoreRun_processReceivedProps_this.props.docFormDraftData?.formData",
        formData
      );
      console.log(
        "DocFormCoreRun_processReceivedProps_this.props.docFormDraftData?.htmlData_draft",
        this.props.draft?.htmlData
      );
      console.log(
        "DocFormCoreRun_processReceivedProps_tempFormsFieldSorted",
        tempFormsFieldSorted
      );
    } else if (
      this.props?.oldFilledData != null &&
      this.props?.oldFilledData != undefined &&
      Object.keys(this.props?.oldFilledData?.data).length > 0
    ) {
      console.log(
        "DocFormCoreRun_processReceivedProps_this.props?.oldFilledData",
        this.props?.oldFilledData
      );
      formData = this.props?.oldFilledData?.data.inputData;
      tempTestTemplateToShow = this.props?.oldFilledData?.data.htmlData;

      let tempFormsFieldSortedReturn = processDocFormDraftDataFormInput(
        tempFormsFieldSorted,
        formData
      );

      // tempFormsFieldSorted = tempFormsFieldSortedReturn.formsFieldsDataSorted;
      tempConditionalFormInputs =
        tempFormsFieldSortedReturn.conditionalFormInputs;

      title = this.props?.oldFilledData?.title;
    } else {
      // console.log("this.props.userPrefilledFields",this.props.userPrefilledFields)
      // console.log("this.props.docFormPreFills",this.props.docFormPreFills)

      if (this.props.userPrefilledFields.length > 0) {
        //We can use Below Simplified Method
        // console.log("this.props.docFormPreFills","Process using userPrefilledFields")
        tempFormsFieldSorted = processPreFilledDataFormInput(
          tempFormsFieldSorted,
          this.props.userPrefilledFields,
          this.props.filledDocForm,
          "usr"
        );
      } else {
        //DevNote[Note]:20-12-2022 New Way to Handle Org Prefilled Data
        // console.log("this.props.docFormPreFills","Process using userPrefilledFields")
        // console.log("this.props.docFormPreFills_tempFormsFieldSorted",tempFormsFieldSorted)
        // tempFormsFieldSorted = processPreFilledDataFormInput(
        //   tempFormsFieldSorted,
        //   this.props.docFormPreFills,
        //   this.props.filledDocForm,
        //   "org"
        // );
        if (this.props.docFormPreFills != null) {
          this.props.docFormPreFills.map((docFormPreFill) => {
            // formData[docFormPreFill.fieldKey]=docFormPreFill.value;
            // console.log("this.props.docFormPreFills_tempFormsFieldSorted_isExists",docFormPreFill.fieldKey,getFieldFromFieldArray(docFormPreFill.fieldKey,tempFormsFieldSorted));
            // if(getFieldFromFieldArray(docFormPreFill.fieldKey,tempFormsFieldSorted)!=undefined){
            //   formData[docFormPreFill.fieldKey]=docFormPreFill.value;
            // }
            // formData[docFormPreFill.fieldKey]=docFormPreFill.value;
          });
        }
      }
      // formData = this.props.docFormPreFills;
      // console.log("this.props.docFormPreFills_formData",formData)
    }

    // console.log(
    //   "DocFormCoreRun_Pricess_return",
    //   {
    //     testTemplateToShow: tempTestTemplateToShow,
    //     formsFieldsDataSorted: tempFormsFieldSorted,
    //     conditionalFormInputs: tempConditionalFormInputs,
    //     formData: formData!=undefined?formData:{},
    //     title:title
    //   }
    // );
    //this.props.formsTemplate
    //!=undefined?tempTestTemplateToShow:this.props.formsTemplate
    //!=undefined?formData:{}
    // console.log(
    //   "DocFormCoreRun_processReceivedProps_.title",
    //   title
    // );

    if (typeof formData === "string") {
      formData = JSON.parse(formData || "{}");
    }

    return {
      testTemplateToShow: tempTestTemplateToShow,
      formsFieldsDataSorted: tempFormsFieldSorted,
      conditionalFormInputs: tempConditionalFormInputs,
      formData: formData,
      title: title,
    };
  }

  // isExists(data, key, value){
  //   return data.selfExclusionMessage[key].includes(value)? 'Exists' : 'Does not exists';
  // }

  /*
  componentWillReceiveProps(nextProps) {
    // console.log("componentWillReceiveProps");
    this.setState({
      mainDocFormTemplate: this.props.formsTemplate,
      testTemplateToShow: this.props.formsTemplate,
      printMarginLeft: this.props.formsFieldsData?.printMarginLeft,
      printMarginRight: this.props.formsFieldsData?.printMarginRight,
      printMarginTop: this.props.formsFieldsData?.printMarginTop,
      printMarginBottom: this.props.formsFieldsData?.printMarginBottom,
      pageType: this.props.formsFieldsData.pageType,
      mainFormFields: this.props.formsFieldsData.formFields,
      formsFieldsDataSorted: processPreFilledUserDataFormInput(
        sortFormFields(this.props.formsFieldsData.formFields),
        this.props.userPrefilledFields,
        this.props.filledDocForm
      ),
      userPrefilledFields: this.props.userPrefilledFields,
      filledDocForm: this.props.filledDocForm,
    });
  }
  */
  async componentDidUpdate(prevProps, prevState) {
    console.log("----componentDidUpdate----");
    console.log(
      "----componentDidUpdate_!this.state.usingEditor",
      !this.state.usingEditor
    );

    /* Shashi kumar 08-11-2024 external doc forms */
    /*
    if (this.state?.formData?.number && this.props.clientFormType == "othr") {
      const number = this.state.formData.number;
      for (let i = 0; i < number; i++) {
        if (
          this.state.formData[`filenumber${i}`] &&
          !this.state.formData[`filenumber${i}`]?.includes("data-message")
        ) {
          const srcMatch =
            this.state.formData[`filenumber${i}`].match(/src=['"]([^'"]*)['"]/);
          const srcValue = srcMatch ? srcMatch[1] : null;
          console.log("srcValue_srcValue: " + i + ":", srcValue);
          const serverUrl = await this.uploadFile(srcValue);
          const imageUrl = `<img src='${serverUrl}' alt='' data-message='from_server' width='120' height='120'/>`;
          this.state.formData[`filenumber${i}`] = imageUrl;
        }
      }
    }*/

    if (!this.state.usingEditor) {
      let template = this.replaceTemplateKeyWithFormDataView(
        this.state.mainDocFormTemplate,
        this.state.formData
      );
      console.log("----componentDidUpdate_template_1", template);
      console.log(
        "----componentDidUpdate_!this.state.changeCount",
        this.state.changeCount
      );
      console.log(
        "----componentDidUpdate_!this.state.usedraft",
        this.state.changeCount == 0 &&
          this.props?.draft?.id != undefined &&
          this.props?.draft?.id > 0
      );

      if (
        this.state.changeCount == 0 &&
        this.props?.draft?.id != undefined &&
        this.props?.draft?.id > 0
      ) {
        //DevNote[AddedOn]:18-08-2022
        this.processAsPerUserDraftFields();
        console.log(
          "----componentDidUpdate_processAsPerUserDraftFields",
          "processAsPerUserDraftFields"
        );
      } else {
        if (this.state.testTemplateToShow !== template) {
          this.setState({ testTemplateToShow: template });
        }
      }
      this.state.changeCount = this.state.changeCount + 1;
    }
  }

  async componentDidMount() {
    console.log("componentDidMount_this.state.userData", this.state.userData);
    if (
      this.state.userData != undefined &&
      this.state.userData.mobile_no != undefined
    ) {
      //this.state.docForm.isOrgDoc
      this.setState({ showSubmitButton: true });
    } else {
      this.setState({
        showSubmitButton: false,
        docFormError: (
          <>
            *Please{" "}
            <strong>
              <a href="/customerlogin">login</a>
            </strong>{" "}
            to enable submit button
          </>
        ),
      });
    }
  }

  // uploadFile = async (blobUrl) => {
  //   const blob = await fetch(blobUrl).then((res) => res.blob());
  //   const formData = new FormData();
  //   formData.append("file", blob, "otherDocFile.png");

  //   const response = await fetch(uploadSingleFileExt, {
  //     method: "POST",
  //     body: formData,
  //   });

  //   if (response.ok) {
  //     const data = await response.json();
  //     const fileUrl = data.file;

  //     return fileUrl;
  //   } else {
  //     console.error("Error uploading image:", await response.text());
  //   }
  // };

  async handleFileUpload(file) {
    const formData = new FormData();
    formData.append("file", file);

    // const localAPI = "http://localhost:4000/uploadSingle";
    // uploadSingleFileExt

    try {
      const response = await fetch(uploadSingleFileExt, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        const fileUrl = data.file;

        return fileUrl;
      } else {
        console.error("Error uploading file:", await response.text());
      }
    } catch (error) {
      console.error("Error during file upload:", error);
    }
  }

  //DevNote[AddedOn]:18-08-2022
  processAsPerUserDraftFields() {
    this.state.formsFieldsDataSorted?.map((formsFieldsData) => {
      console.log(
        "processAsPerUserDraftFields_formsFieldsData",
        formsFieldsData
      );
      // this.processOtherCondition(formsFields, formsFieldsData.for)
      let templateKey = formsFieldsData.elementUId;
      if (
        formsFieldsData.otherConditions !== undefined &&
        formsFieldsData.otherConditions?.length > 0
      ) {
        this.processOtherCondition(formsFieldsData, templateKey);
      }

      let tempValue = this.state.formData[templateKey];
      if (formsFieldsData.isConditional == true) {
        // console.log("formsFieldsData.isConditional", "-----------------------");

        this.setState({
          selectedConditionalFormInputValue: tempValue?.trim(),
          selectedConditionalFormInput: formsFieldsData,
        });

        //Way 1
        // this.state.conditionalFormInputs[formsFieldsData.elementUId] = {
        //   inputValue: e.target.value.trim(),
        //   input: formsFieldsData,
        // };

        let valueKey = null;
        let multiSelectValue = []; //AddedOn 13-12-2021
        //For Selectv2
        if (formsFieldsData.elementType.toLowerCase() === "selectv2") {
          valueKey = tempValue.split(":")[0];
          tempValue = tempValue.split(":")[1];
        }

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
            // tempValue = event.target.value.trim();//AddedOn 13-12-2021
            multiSelectValue = tempValue
              ?.split(",")
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
              formsFieldsData.validation.minLength
            );
            console.log(
              "multiselectt1_tempValue_formsFieldsData.elementConfig.type",
              formsFieldsData.elementConfig.type
            );
            console.log("multiselectt1_tempValue", tempValue);
            //   multiSelectValue = event.target.tempValue; //DevNote: ToBeDone
            console.log(
              "multiselectt1_tempValue_multiSelectValue",
              multiSelectValue
            ); //AddedOn 13-12-2021

            console.log(
              "multiselectt1_tempValue_multiSelectValue",
              multiSelectValue
            ); //AddedOn 13-12-2021
          } /*else {
            //DevNote: ToBeDone
            //console.log("checkBoxChecked", event.target.checked);
            //   if (event.target.checked) {
            //     tempValue = event.target.value.trim();
            //   } else {
            //     tempValue = "";
            //   }
          }*/
        }
        //          valueKey: valueKey,
        this.state.conditionalFormInputs[templateKey] = {
          inputValue: tempValue?.trim(),
          input: formsFieldsData,
          templateKey: templateKey,
          multiSelectValue: multiSelectValue,
        };
        console.log(
          "conditionalFormInputs_state",
          this.state.conditionalFormInputs
        );
        //this.props.inputFieldsAndTemplate.inputFields

        //Way 3
        // this.state.mainFormFields[templateKey] = formsFieldsData
        // // console.log("-templateKey-",templateKey);
        // // console.log("-conditionalFormInputs-",this.state.mainFormFields);
        // this.setState({mainFormFields:this.state.mainFormFields });

        //this.state.conditionalFormInputs = conditionalFormInputsTemp
        /* //No Need of this for now
        this.setState({
          conditionalFormInputs: this.state.conditionalFormInputs,
        });

        console.log("conditionalFormInputs", this.state.conditionalFormInputs);
        */
        //this.state.mainDocFormTemplate
        //this.props.inputFieldsAndTemplate.template
        // console.log("processConditionalFormFieldTemplate", "Called");
        // console.log("processConditionalFormFieldTemplate_formsFieldsData", this.props.draft);
        this.processConditionalFormFieldTemplate(
          this.props.formsTemplate,
          formsFieldsData,
          tempValue?.trim(),
          templateKey
        );
      }
    });
  }

  nodeApi = async (body) => {
    const formData = new FormData();
    this.setState(
      {
        jsonData: { body },
        inputDisplay: true,
      }
      // () => {
      //   // Safely log the updated `jsonData` here
      //   console.log("Updated jsonData:", this.state.jsonData);
      // }
    );

    formData.append("params", JSON.stringify(body));
    formData.append("user_id", this.state.userData.id);
    formData.append("org_id", this.state.userData.org.id);

    const loader = toast.success("Loading...", { autoClose: false });
    try {
      const getFields = await fetch(getFieldsURL, {
        method: "GET",
      });
      if (!getFields.ok) {
        throw new Error(`Issues in getting fields: ${getFields.status}`);
      }
      const data = await getFields.json();
      this.setState((prev) => ({
        ...prev,
        fieldsList: [...data],
      }));
    } catch (error) {
      console.error("error");
    }

    try {
      const response = await fetch(GetRecordsWithDynamicParameters, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Response data:", data);
      await toast.dismiss(loader);
      this.setState((prev) => ({
        responseResult: [...data],
        submitbtnLoader: false,
      }));
    } catch (error) {
      console.error("Error making the request:", error);
      await toast.dismiss(loader);
      toast.error("Error Getting Data..", { autoClose: 5000 });
    }
  };

  async askiAI() {
    const element = document.getElementById("contentToPrint");
    const textContent = element.textContent.replace(/\n\s*\n/g, "\n");

    const aiQuery = `I have listed few points below for a legal problem faced by me

      ${textContent}

      Please guide me for possible solutions
      1) Under Which act and section I can execute or take help of the solutions suggested
      2) I would also like to know the relevant jurisdictions where I can file the case
      3) I need to know both the Jurisdiction territorial and pecuniary
      4) What are the limitations when I can file the case to seek the possible remedies`;

    const body = await {
      query: `${aiQuery}`,
    };
    const loader = toast.success(
      "Generating content with AI... Please wait...",
      {
        autoClose: false,
      }
    );

    // const localAPI = "http://localhost:4000/askAi";
    const response = await fetch(askGenerateAiProbelmInfo, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const { aiResponse } = await response.json();
    const formattedResponse = formatAiResponse(aiResponse);

    this.setState({ aiResponse: formattedResponse }, () => {
      const aiResponseElement = document.getElementById("AiResponseEl");
      aiResponseElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });

    toast.dismiss(loader);
  }
  async askiAILeft() {
    // const textContent = this.state.jsonState;
    const textContent = JSON.stringify(this.state.jsonState, null, 2);

    const aiQuery = `I have listed few points below for a legal problem faced by me:

      ${textContent}

      Please guide me for possible solutions
      1) Under Which act and section I can execute or take help of the solutions suggested
      2) I would also like to know the relevant jurisdictions where I can file the case
      3) I need to know both the Jurisdiction territorial and pecuniary
      4) What are the limitations when I can file the case to seek the possible remedies`;

    const body = await {
      query: `${aiQuery}`,
    };
    const loader = toast.success(
      "Generating content with AI... Please wait...",
      {
        autoClose: false,
      }
    );

    // const localAPI = "http://localhost:4000/askAi";
    const response = await fetch(askGenerateAiProbelmInfo, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const { aiResponse } = await response.json();
    const formattedResponse = formatAiResponse(aiResponse);

    // this.setState({ aiResponse: formattedResponse }, () => {
    //   const aiResponseElement = document.getElementById("AiResponseEl");
    //   aiResponseElement.scrollIntoView({
    //     behavior: "smooth",
    //     block: "start",
    //   });
    // });
    this.setState({ aiResponse: formattedResponse });

    toast.dismiss(loader);
  }

  onFormSubmit = (e) => {
    e.preventDefault();

    if (this.props.clientFormType === "judgement") {
      let textContent = `${
        document.getElementById("contentToPrint").textContent
      }`;
      textContent = textContent.replace(/{.*?}/g, "");
      console.log("textContent_770: ", textContent);
      textContent = textContent.replace(/“|”/g, '"');
      textContent = textContent.replace(/\u00A0/g, " ");
      textContent = textContent.replace(/"([a-zA-Z0-9_]+)"\s*:/g, "$1:");
      textContent = textContent.trim();
      const jsonObject = eval(`({${textContent}})`);

      // this.setState((prev) => ({
      //   responseResult: [],
      //   submitbtnLoader: true,
      // }));
      this.state.responseResult = [];
      this.state.submitbtnLoader = true;
      this.nodeApi(jsonObject);

      console.log("jsonObject", jsonObject);
    } else {
      //Handling UI Transitions
      document.querySelector("#docFormInputFields")?.classList.add("none");
      document.querySelector("#editDocFormDiv")?.classList.add("none");

      document.querySelector("#actionsButtons")?.classList.remove("none");
      document.getElementById("docFormPreview")?.classList.add("width-78");

      if (
        this.props.clientFormType === "clntInfoInit" ||
        this.props.clientFormType === "clntinfo"
      ) {
        const element = document.getElementById("docFormPreview");

        if (element) {
          element.style.display = "block";
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }

      // document.querySelector("#docFormPreview").classList.remove("defaultDocForm");
      // document.querySelector("#docFormPreview").classList.add("full-width");
      // document
      //   .querySelector("#docFormPreview")
      //   .classList.remove("showDocFormPreview");
      // document
      //   .querySelector("#docFormPreview")
      //   .classList.remove("hideDocFormPreview");
      document
        .getElementById("TemplateToggle")
        .classList.add("HideTemplateToggleButton");

      // if (this.props.clientFormType === "clntInfoInit") {
      //   // this.askiAI();
      //   this.askiAILeft();
      // }

      this.setState((prev) => ({ ...prev, savingType: "submit" }));
    }
  };

  // render() {
  //   const { jsonData } = this.state;
  //   console.log("jsonData_853", jsonData);
  //   // Map through the keys and values of jsonData to display them
  //   return (
  //     <div>
  //       <h2>Judgement Details</h2>
  //       <p>
  //         {Object.entries(jsonData).map(([key, value], index) => (
  //           <span key={index}>
  //             {key}: {value}
  //             {index < Object.entries(jsonData).length - 1 && " > "}
  //           </span>
  //         ))}
  //       </p>
  //     </div>
  //   );
  // }

  handleGenerateUsingAI = () => {
    if (
      this.props.clientFormType === "clntInfoInit" ||
      this.props.clientFormType === "clntinfo"
    ) {
      // this.askiAI();
      this.askiAILeft();
    } else {
      console.log("Client form type is not clntInfoInit.");
    }
  };

  handleCompareusingAI = async () => {
    const option1 = document.getElementById("contentToPrint").textContent;
    const option2 = document.getElementById("AiResponseEl").textContent;

    const aiQuery = `Compare Docmaster Response and Ai Generated Response, and give a summary:

    Docmaster Response: ${option1.trim()},
    AI Generated Response: ${option2}
    `;

    try {
      const body = { query: aiQuery };

      const response = await fetch(askGenerateAiProbelmInfo, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const { aiResponse } = await response.json();
      const formattedResponse = formatAiResponse(aiResponse);

      this.setState({
        comparedAiContent: formattedResponse,
        displayComparePopup: true,
      });
    } catch (error) {
      console.error("Error fetching AI response:", error);
    }

    // first get the contents.
    // display popup form here
    // askGenerateAiProbelmInfo
    // integrate above api: and display content in popup and format as well
  };

  handleEditorChange = (content, editor) => {
    // if(this.state.mainDocFormTemplate!=content){
    //   this.setState({ mainDocFormTemplate: content });
    //   console.log(content, this.state.mainDocFormTemplate);
    // }
    // if(this.state.testTemplateToShow!=content){
    //   this.setState({ testTemplateToShow: content });
    //   console.log(content, this.state.testTemplateToShow);
    // }
    this.setState({ testTemplateToShow: content });
  };

  /*
  ValidateUserDocFormAcessLevel() {
    // toast.success("Validating User...", { autoClose: 400 });
    axios
      .post(WSValidateUserDocFormAcessLevel, JSON.stringify({
        userId: this.state.userData.id,
        formId: this.state.docForm.formId,
      }), {
        headers: apiKeyHeader(),
      })
      .then((response) => {
        const responseData = response.data;
        if (responseData.result_code == 1) {
          this.setState({ showSubmitButton: true });
        } else {
          this.setState({
            showSubmitButton: false,
            docFormError: "* " + responseData.result_message,
          });
          alert(responseData.result_message);
        }
      })
      .catch((error) => {
        // console.log("error", error);
        this.setState({ errors: "Error, Try Again" });
      });
  }*/

  handleEventJson(event) {
    const nameAttr = event.target.getAttribute("name");
    const valueAttr = event.target.value;
    const isCheckboxOrRadio =
      event.target.type === "checkbox" || event.target.type === "radio";

    if (isCheckboxOrRadio) {
      const checked = event.target.checked;

      if (checked) {
        this.setState((prevState) => ({
          jsonState: {
            ...prevState.jsonState,
            [nameAttr]: valueAttr,
          },
        }));
      } else {
        this.setState((prevState) => {
          const newJsonState = { ...prevState.jsonState };
          delete newJsonState[nameAttr];
          return { jsonState: newJsonState };
        });
      }
    } else {
      const valueAttr = event.target.value;
      this.setState((prevState) => ({
        jsonState: {
          ...prevState.jsonState,
          [nameAttr]: valueAttr,
        },
      }));
    }
  }
  // onInputChange = (event, formsFieldsData, fieldKey, templateKey, level) => {//Old
  onInputChange = async (
    event,
    formsFieldsData,
    fieldKey,
    templateKey,
    level
  ) => {
    this.handleEventJson(event);

    if (
      event.target.value === "Telephone Bill" ||
      event.target.value === "Electricity Bill"
    ) {
      this.resetBills();
    }

    setTimeout(function () {
      const div = document.getElementById("contentToPrint");
      if (div) {
        const spans = div.getElementsByTagName("span");
        for (let span of spans) {
          if (
            span.textContent.includes(
              "As per The dishonour memo date you have entered"
            )
          ) {
            span.innerHTML = span.innerHTML.replace(
              "proceeding .",
              "proceeding."
            );
          }
        }
      }
    }, 1000);
    //ToDo: if target type is date show/convert input value in Provided Format
    let tempValue = event.target.value.trim();
    let multiSelectValue = []; //AddedOn 14-12-2021

    if (
      event.target.type.toLowerCase() == "input" ||
      event.target.type.toLowerCase() == "file"
    ) {
      if (formsFieldsData.elementConfig.type.toLowerCase() == "image") {
        tempValue =
          "<img src='" +
          URL.createObjectURL(event.target.files[0]) +
          "' alt='' width='" +
          formsFieldsData.validation.maxLength +
          "' height='" +
          formsFieldsData.validation.minLength +
          "'/>";
      } else if (
        this.props.clientFormType === "othr" &&
        formsFieldsData.elementConfig.type.toLowerCase() === "file"
      ) {
        const file = event.target.files[0];
        const serverUrl = await this.handleFileUpload(file);
        tempValue = `<a href='${serverUrl}' target='_blank'>${event.target.files[0]?.name}</a>`;
        // if (file.type.includes("image")) {
        //   tempValue =
        //     "<img src='" +
        //     serverUrl +
        //     "' alt='' width='" +
        //     formsFieldsData.validation.maxLength +
        //     "' height='" +
        //     formsFieldsData.validation.minLength +
        //     "'/>";
        // }
        // if (file.type === "application/pdf") {
        //   tempValue = `
        //     <iframe src="${serverUrl}"
        //             width="${formsFieldsData.validation.maxLength}"
        //             height="${formsFieldsData.validation.minLength}">
        //     </iframe>
        //   `;
        // }
        // if (
        //   file.type ===
        //     "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        //   file.type === "application/msword" ||
        //   file.type === "application/vnd.ms-excel" ||
        //   file.type ===
        //     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        // ) {
        //   tempValue = `
        //    <iframe src="https://docs.google.com/gview?url=${serverUrl}&embedded=true" width="600px" frameborder="0" height="600px"></iframe>
        //   `;
        // }
        //
        // else {
        //   tempValue = `<a href='${serverUrl}' target='_blank'>${event.target.files[0]?.name}</a>`;
        // }
      }
    }

    if (event.target.type.toLowerCase() == "date") {
      if (formsFieldsData.elementConfig.type.toLowerCase() == "date") {
        if (formsFieldsData.value.length >= 10) {
          tempValue = Moment(tempValue).format(formsFieldsData.value); //To Change into Provided Format
        } else {
          tempValue = Moment(tempValue).format("DD-MM-YYYY"); //To Change into dd-mm-yyyy
        }
      } else if (
        formsFieldsData.elementConfig.type.toLowerCase() == "date_l1"
      ) {
        tempValue = Moment(tempValue).format("DD-MM-YYYY"); //To Change into dd-mm-yyyy
        const tempValueDate = tempValue.split("-");
        //const tempValueDay=ordinal_suffix_of(tempValueDate[0])
        //const tempValueMonth=month2MonthString(tempValueDate[1])
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
        const tempValueDate = tempValue.split("-");
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
        console.log("tempValue_1062: ", tempValue);
        console.log("formsFieldsData_1062: ", formsFieldsData);

        const tempValueArr = tempValue.split(",");
        const formsFieldsDataArr = formsFieldsData.value.split("\n");

        const filtredArr = tempValueArr.filter((each) =>
          formsFieldsDataArr.some((field) => each.trim().includes(field.trim()))
        );
        const joinedArr = filtredArr.join(",");

        console.log("tempValueArr_1068: ", tempValueArr);
        console.log("formsFieldsDataArr_1069: ", formsFieldsDataArr);
        console.log("filtredArr_1074: ", filtredArr);
        console.log("joinedArr_1076: ", joinedArr);
        tempValue = onMultiSelectCheckBoxClick(
          tempValue,
          // joinedArr,
          formsFieldsData.elementConfig.type,
          formsFieldsData.validation.maxLength,
          formsFieldsData.validation.minLength
        );
        console.log("multiselectt1_tempValue_main", tempValue);
        multiSelectValue = event.target.tempValue; //AddedOn 14-12-2021 For MultiSelectedCheckBox
        console.log(
          "multiselectt1_tempValue_multiSelectValue",
          multiSelectValue
        ); //AddedOn 13-12-2021
      } else {
        if (event.target.checked) {
          tempValue = event.target.value.trim();
        } else {
          tempValue = "";
        }
      }
    }

    //Remark[Flow]:18-04-2023 CopyOfMultiSelectValue Process
    if (
      formsFieldsData.elementType.toLowerCase() == "copyofinput" &&
      (formsFieldsData.elementConfig.type.toLowerCase() == "multiselectt1" ||
        formsFieldsData.elementConfig.type.toLowerCase() == "multiselectt2" ||
        formsFieldsData.elementConfig.type.toLowerCase() == "multiselectt3" ||
        formsFieldsData.elementConfig.type.toLowerCase() == "multiselectt4" ||
        formsFieldsData.elementConfig.type.toLowerCase() == "multiselectt5")
    ) {
      console.log(
        "onInputChange_isFieldIsCopyOfInput_formsFieldsData",
        formsFieldsData
      );

      console.log(
        "onInputChange_multiSelectValueInputs",
        this.state.multiSelectValueInputs
      );
      multiSelectValue =
        this.state.multiSelectValueInputs[formsFieldsData.value];
      console.log(
        "onInputChange_multiSelectValueInputs_copyField_multiSelectValue",
        multiSelectValue
      );
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
    // this.state.formData[templateKey] = tempValue.trim();
    /*//Not Needed
    if (formsFieldsData.elementType.toLowerCase() == "checkbox") {
      if (
        formsFieldsData.elementConfig.type.toLowerCase() == "multiselectt1" ||
        formsFieldsData.elementConfig.type.toLowerCase() == "multiselectt2" ||
        formsFieldsData.elementConfig.type.toLowerCase() == "multiselectt3" ||
        formsFieldsData.elementConfig.type.toLowerCase() == "multiselectt4" ||
        formsFieldsData.elementConfig.type.toLowerCase() == "multiselectt5"
      ) {
        this.state.formData[templateKey] = event.target.tempValue.join();
      } else {
        this.state.formData[templateKey] = tempValue.trim();
      }
    } else {
      this.state.formData[templateKey] = tempValue.trim();
    }
    */
    this.setState({ formData: this.state.formData });
    console.log("formData_", this.state.formData);
    //DevNote: Process Below on Submit Also
    if (
      formsFieldsData.otherConditions !== undefined &&
      formsFieldsData.otherConditions.length > 0
    ) {
      this.processOtherCondition(formsFieldsData, templateKey);
    }

    if (formsFieldsData.isConditional == true) {
      // const caseDairydata =
      //   formsFieldsData.condition.conditionStatements[event.target.value]
      //     ?.subFormFields?.caseDiary || null;

      // console.log("caseDairydata_1203: ", caseDairydata);

      // if (caseDairydata) {
      //   caseDairydata.dateKey_value =
      //     this.state.formData[caseDairydata?.dateKey];

      //   this.setState({ caseDairydata });

      //   console.log("__x_1200: ", caseDairydata);
      // }

      this.setState({
        selectedConditionalFormInputValue: tempValue.trim(),
        selectedConditionalFormInput: formsFieldsData,
      });

      //Way 1
      // this.state.conditionalFormInputs[formsFieldsData.elementUId] = {
      //   inputValue: e.target.value.trim(),
      //   input: formsFieldsData,
      // };

      //Way 2 //Changed on 14-12-2021 to process MultiSelectedCheckBox
      this.state.conditionalFormInputs[templateKey] = {
        inputValue: tempValue.trim(),
        input: formsFieldsData,
        templateKey: templateKey,
        multiSelectValue: multiSelectValue,
      };

      //this.props.formsFieldsData.formFields

      //Way 3
      //this.state.mainFormFields[templateKey] = formsFieldsData
      //this.setState({mainFormFields:this.state.mainFormFields });
      //this.state.conditionalFormInputs = conditionalFormInputsTemp
      this.setState({
        conditionalFormInputs: this.state.conditionalFormInputs,
      });

      //this.state.mainDocFormTemplate
      //this.props.formsTemplate
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
    let conditionAction = formsFields.otherConditions.split("(")[0];
    var conditionVars = formsFields.otherConditions.substring(
      formsFields.otherConditions.indexOf("(") + 1,
      formsFields.otherConditions.lastIndexOf(")")
    );

    let parentKeyTemp = this.filterOutParentKey(
      mainFieldTemplateKey,
      formsFields.elementUId
    );
    if (parentKeyTemp != undefined && parentKeyTemp.length > 0) {
      conditionVars = conditionVars + parentKeyTemp;
    }

    if (
      this.state.formData[conditionVars] != undefined &&
      this.state.formData[mainFieldTemplateKey] != undefined
    ) {
      if (conditionAction == "lessThanEqualTo") {
        if (
          Number(this.state.formData[mainFieldTemplateKey]) <=
          Number(this.state.formData[conditionVars])
        ) {
          // console.log("processOtherCondition_conditionAction_test","Ok");
        } else {
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
          // console.log("processOtherCondition_conditionAction_test","Ok");
        } else {
          //alert("Please check value of "+mainFieldTemplateKey+" and "+conditionVars);
          alert(
            "Please check input of " + formsFields.elementConfig.inputLabel
          );
        }
      }
    }
  }

  filterOutParentKey(inputAndTemplateKey, fieldUid) {
    return inputAndTemplateKey.replace(fieldUid, "");
  }

  replaceTemplateKeyWithFormDataView(template, formdata) {
    formdata = processUserPrefilledForTemplate(
      this.state.userPrefilledFields,
      formdata
    );

    if (this.props?.draft?.id != undefined && this.props?.draft?.id > 0) {
      // formdata = processDraftForTemplate(this.context?.formData, formdata);
      formdata = processDraftForTemplate(this.props.draft?.inputData, formdata);
    }

    console.log("replaceTemplateKeyWithFormDataView_post2", formdata);

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
    if (
      this.state.mainFormFields != null &&
      this.state.mainFormFields != undefined
    ) {
      Object.entries(this.state.mainFormFields).map(([key, val]) => {
        //let formFieldObject = this.state.mainFormFields[key];
        if (val.elementType.toLowerCase() == "label") {
          formdata[key] = val.value;
        } else if (val.elementType == "copyOfInput") {
          // console.log("copyOfInput_val",val);
          // console.log("copyOfInput_key",key);
          // console.log("copyOfInput_val.value",val.value);
          //formdata[key] = val.value;
          if (formdata[val.value] != undefined) {
            // console.log("copyOfInput_formData_val.value",formdata[val.value]);
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
          }
        } else if (val.elementType.toLowerCase() == "amount2words") {
          formdata[key] = digitAmountToWord(formdata[val.value]);
        } else if (val.elementType.toLowerCase() == "formula") {
          let formulaObject = fetchFormulaObjectV2(val.value);
          var processFormulaObjectValue = processFormulaObjectV2(
            formulaObject,
            formdata
          );
          formdata[key] = processFormulaObjectValue;
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

          console.log(
            "mainFormFields_trigger_triggerKeyValue",
            triggerKeyValue
          );
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
              formdata[key] = "";
            } else {
              if (formdata[key].length > 0) {
                formdata[key] = val.value;
              } else {
                //DO Nothing
              }
            }
          }
        }
      });
    }

    if (
      this.state.conditionalFormInputs != null &&
      this.state.conditionalFormInputs != undefined
    ) {
      Object.entries(this.state.conditionalFormInputs).map(([key, val]) => {
        //Remark[Flow]:18-04-2023 CopyOfMultiSelectValue Process
        if (
          (val.input.elementType.toLowerCase() == "checkbox" ||
            val.input.elementType == "copyOfInput") &&
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

            if (
              val.input.condition.conditionStatements[selectedValue] !=
              undefined
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
                    const input = document.querySelector(
                      "#" + formKeyAddOnTemp
                    );
                    if (input != null) {
                      // This will work by calling the native setter bypassing Reacts incorrect value change check
                      Object.getOwnPropertyDescriptor(
                        window.HTMLInputElement.prototype,
                        "value"
                      ).set.call(input, formdata[mainParentFieldKey]);
                      // This will trigger a new render wor the component
                      input.dispatchEvent(
                        new Event("change", { bubbles: true })
                      );
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
            }
            //----------------------------------------------------
          });
        } else if (
          val.input.elementType.toLowerCase() == "select" ||
          val.input.elementType.toLowerCase() == "radio" ||
          val.input.elementType.toLowerCase() == "datalist" ||
          (val.input.elementType == "copyOfInput" &&
            val.input.condition.conditionType == "ValueBased")
        ) {
          if (
            val.input.condition.conditionStatements[val.inputValue] != undefined
          ) {
            //let keyAddOnTemp = "" + val.input.elementUId + 0;
            let keyAddOnTemp = "" + key + 0;
            conditionalFormsFieldsDataSorted = sortFormFields(
              val.input.condition.conditionStatements[val.inputValue]
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
                    formdata[formKeyAddOnTemp] = "";
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
            });
          } else {
            //DoNothing
          }
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
            conditionalFormsFieldsDataSorted = sortFormFields(
              val.input.condition.subFormFields.formFields
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
                    formdata[formKeyAddOnTemp] = "";
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
            });
          }
        }
      });
    }

    Object.entries(formdata).map(([key, val]) => {
      let formFieldObject = this.state.mainFormFields[key];
      //no_print
      if (formFieldObject == undefined) {
        formFieldObject = conditionalFormsFieldsDataSortedMain[key];
      }

      if (formFieldObject == undefined) {
        template = template.replace(
          new RegExp(inPutFieldStartBlank + key + inPutFieldEndBlank, "gi"),
          val
        );
      } else {
        if (formFieldObject.elementType.toLowerCase() == "label") {
          if (formFieldObject.isHidden == true) {
            template = template.replace(
              new RegExp(inPutFieldStartBlank + key + inPutFieldEndBlank, "gi"),
              "<span className='no_print'>" + val + "</span>"
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
          //AddedOn: 14-12-2021 to Process MultiSelectCheckBox
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
            console.log(
              "tamplevaluereple_val_checkbox",
              val,
              key,
              formFieldObject
            );
            if (formFieldObject.isHidden == true) {
              template = template.replace(
                new RegExp(
                  inPutFieldStartBlank + key + inPutFieldEndBlank,
                  "gi"
                ),
                ""
              );
            } else {
              //Hidding Template as its Render as per SeletedValues in populateSubConditonalForm() function
              if (formFieldObject.isConditional === true) {
                template = template.replace(
                  new RegExp(
                    inPutFieldStartBlank + key + inPutFieldEndBlank,
                    "gi"
                  ),
                  ""
                );
              } else {
                console.log(
                  "tamplevaluereple_val_checkbox_split",
                  val.split(",")
                );
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
        } else if (formFieldObject.elementType.toLowerCase() == "copyofinput") {
          //Remark[Flow]:18-04-2023 CopyOfMultiSelectValue Process
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
          if (formFieldObject.isHidden == true) {
            template = template.replace(
              new RegExp(inPutFieldStartBlank + key + inPutFieldEndBlank, "gi"),
              ""
            );
          } else {
            let value2Show = val;

            if (formFieldObject.valueStyle != undefined) {
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
                  value2Show = rendringInputValueStyle(
                    formFieldObject.valueStyle,
                    val,
                    formFieldObject.validation.maxLength
                  );
                } else {
                  //is number
                  value2Show = rendringInputValueStyle(
                    formFieldObject.valueStyle,
                    val,
                    (val + "").length
                  );
                }
              }
            }
            console.log("template_value2Show_value2Show", value2Show);
            console.log("template_value2Show_pre_template", template);
            template = template.replace(
              new RegExp(inPutFieldStartBlank + key + inPutFieldEndBlank, "gi"),
              value2Show
            );
            console.log("template_value2Show_", template);
          }
        }
      }
    });

    //DevNote[Flow]:Processing DocForm PreFill
    if (
      this.props.docFormPreFills != null &&
      this.props.docFormPreFills != undefined &&
      this.props.docFormPreFills.length > 0
    ) {
      this.props.docFormPreFills.map((docFormPreFill) => {
        template = template.replace(
          new RegExp(
            inPutFieldStartBlank + docFormPreFill.fieldKey + inPutFieldEndBlank,
            "gi"
          ),
          docFormPreFill?.value
        );
      });
    }

    return template;
  }

  processConditionalFormFieldTemplate(
    mainFormTemplate,
    conditionalFormFieldInput,
    conditionalFormFieldValue,
    templateKey,
    level
  ) {
    console.log(
      "processConditionalFormFieldTemplate_mainFormTemplate",
      mainFormTemplate
    );
    let conditionalKeyValueTemplate = [];
    Object.keys(this.state.formData).forEach((key) => {
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

      //AddedOn: 14-12-2021 to Process MultiSelectedCheckBox
      if (
        formFieldObject != undefined &&
        (formFieldObject.elementType.toLowerCase() == "checkbox" ||
          formFieldObject.elementType.toLowerCase() == "copyofinput") &&
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
            "processConditionalFormFieldTemplate_multicheckboxValue_on_main",
            this.state.conditionalFormInputs[key].multiSelectValue
          );
          multiSelectedValue =
            this.state.conditionalFormInputs[key].multiSelectValue;
        }
      }

      let formFieldValue = this.state.formData[key];

      if (
        formFieldObject != undefined &&
        formFieldObject.isConditional == true
      ) {
        let populateCountTemp = 0;
        if (formFieldValue.length > 0) {
          populateCountTemp = 1;
          if (isNaN(formFieldValue)) {
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
        console.log("conditonalTemplate_on_main", conditonalTemplate);
        //Old
        conditionalKeyValueTemplate[templateKeyTemp] = conditonalTemplate;
        //New
        // conditionalKeyValueTemplate[
        //   templateKey
        // ] = conditonalTemplate;
      } else {
        //DoNothing
      }
    });

    if (Object.keys(conditionalKeyValueTemplate).length > 0) {
      let testMainTemplateTemp2 = replaceTemplateKeyWithFormDataViewTTV2(
        mainFormTemplate,
        conditionalKeyValueTemplate
      );
      this.setState({ mainDocFormTemplate: testMainTemplateTemp2 });
    } else {
      let populateCount = 0;
      if (conditionalFormFieldValue?.length > 0) {
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

      console.log("populateCount_on_main", populateCount);
      let testTemplate = "";
      if (populateCount > 0) {
        testTemplate = populateSubConditonalForm(
          conditionalFormFieldInput,
          populateCount,
          conditionalFormFieldValue,
          templateKey
        );
      }

      console.log("testTemplate_on_main", testTemplate);
      //console.log("formsTemplate", this.props.formsTemplate);
      console.log("mainFormTemplate_on_main", mainFormTemplate);
      let testMainTemplate = replaceTemplateKeyWithFormDataViewTT(
        mainFormTemplate,
        conditionalFormFieldInput.elementUId,
        testTemplate
      );
      console.log("testMainTemplate_On_main", testMainTemplate);
      this.setState({ mainDocFormTemplate: testMainTemplate });
    }
  }

  confirmSubmittedForm() {
    this.emailOrDownloadThisDoc(6, 1); //main flow
    let confirmButton = document.getElementById("confirmButton");
    setTimeout(() => {
      confirmButton.disabled = false;
    }, 10000);
  }

  saveDocFormDraft() {
    this.emailOrDownloadThisDoc(6, 0); //main flow

    /*
    let saveDraftButton = document.getElementById("saveDraftButton");
    setTimeout(() => {
      saveDraftButton.disabled = false;
    }, 10000);
    */

    /*
    //Handling UI Transitions
    document.querySelector("#docFormInputFields").classList.add("none");
    document.querySelector("#actionsButtons").classList.remove("none");
    // document.querySelector("#docFormPreview").classList.remove("col-lg-8");
    // document.querySelector("#docFormPreview").classList.add("col-lg-12");
    document.querySelector("#docFormPreview").classList.remove("pl-40");
    document
      .querySelector("#docFormPreview")
      .classList.remove("showDocFormPreview");
    document
      .querySelector("#docFormPreview")
      .classList.remove("hideDocFormPreview");
    document
      .getElementById("TemplateToggle")
      .classList.add("HideTemplateToggleButton");
      */
  }

  setShowActionButtons(option) {
    if (option) {
      this.setState({ showActionButtons: true, showOtherButton: false });
    } else {
      this.setState({ showActionButtons: false, showOtherButton: true });
    }
  }

  emailOrDownloadThisDoc(option, isSubmitted) {
    //option 0: download (after confirmed checkDocFormsLimit to process)
    //Option 5: Download(after checkDocFormsLimit)
    //Option 6: SubmitConfirmation

    if (
      this.state.userData != undefined &&
      this.state.userData.mobile_no != undefined
    ) {
      if (option == 0) {
        //Download
        this.sendDocToUser(0, isSubmitted);
        //this.checkDocFormsLimit(1);
      } else if (option == 6) {
        //SubmitConfirmation
        this.sendDocToUser(option, isSubmitted);
      }
      //ToDo: call here print and download confim
    } else {
      const win = window.open("/customerlogin", "_blank");
      win.focus();
    }
  }

  async sendDocToUser(option, isSubmitted) {
    // const userDataThis = reactLocalStorage.getObject("user_data");
    // console.log("sendDocToUser_option", option);

    //option -1: download word (after confirmed checkDocFormsLimit to process)
    //option 0: download (after confirmed checkDocFormsLimit to process)
    //Option 6: SubmitConfirmation
    const content2Print = this.componentRef;
    const targetComponent2Print = content2Print.current || content2Print;
    //document.querySelector("#filledDocFOrm")
    // console.log("targetComponent2Print_", targetComponent2Print);
    //margin: [1, 1, 1, 1],//Old
    //html2canvas: { scale: 2, dpi: 192, letterRendering: true },Old
    //jsPDF: { unit: "mm", format: "letter", orientation: "portrait" }, //Old
    //console.log("this.state.printMarginLeft",this.state.printMarginLeft)
    var pagesWidth = "8.3in"; //In Inches
    var pagesHeight = "11.7in"; //In Inches

    var pageTypeFormat = "a4";
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

    //Default Top:1
    //Default Bottom:1
    //Default Right:2
    //Default Left:2

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

    console.log("setPrintMarginRight_", setPrintMarginRight);
    let fileName2Process =
      this.state.docForm.formNameTitle + "docmaster_" + Date.now();

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
        "<head><meta charset='utf-8'><title>" +
        fileName2Process +
        "</title>" +
        otherStye +
        "</head><body>";
      var footer = "</body></html>";
      let htmlString =
        header +
        processPageBreakForDoc(targetComponent2Print.innerHTML) +
        footer;
      // document.getElementById("contentToPrint").innerHTML
      // console.log("htmlString_", htmlString);

      var source =
        "data:application/vnd.ms-word;charset=utf-8," +
        encodeURIComponent(htmlString);
      var fileDownload = document.createElement("a");
      document.body.appendChild(fileDownload);
      fileDownload.href = source;
      fileDownload.download = fileName2Process + ".doc";
      fileDownload.click();
      document.body.removeChild(fileDownload);

      //processPageBreakForDoc
    } else if (option == 4) {
      //To Print
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

      var header = "<html>" + "<head>" + otherStye + "</head><body>";
      var footer = "</body></html>";
      //var htmlString=header+"<p>Hello World</p>"+footer//document.getElementById("contentToPrint").innerHTML

      let htmlString =
        header +
        processPageBreakForJsPrint(targetComponent2Print.innerHTML) +
        footer;
      //document.getElementById("contentToPrint").innerHTML
      // console.log("htmlString_", htmlString);
      // this.html2Print(targetComponent2Print);//Done on 20-12-2021
      htmlString2Print(htmlString); //Done on 20-12-2021 //For Version 3
    } else {
      const spanTag = document.createElement("span");
      spanTag.innerHTML = this.state.processedContent;
      let html2String = processPageBreakForBackEnd(spanTag.innerHTML);
      // let html2String = processPageBreakForBackEnd(
      //   this.state.testTemplateToShow
      // );

      if (option == 6) {
        if (this.props.clientFormType == "clntInfoInit") {
          //returnToPropsFunction
          if (this.props.onReturnDraftRecord != undefined) {
            await this.handleTextExtraction();
            this.props.onReturnDraftRecord({
              title:
                this.state.title != undefined && this.state.title?.length > 0
                  ? this.state.title
                  : this.props.docForm.formNameTitle,
              inputData: this.state.formData,
              htmlData: html2String,
              caseHearingDiary: this.state.caseHearingDiary,
              caseDairydata: this.state.caseDairydata,
              caseHearingDate: this.state.formData.receipt_date,
              notice: this.state.formData.notice,
              mediation: this.state.formData.glbl_mediation,
              aiResponse: this.state.aiResponse,
            });
          }
        } else {
          this.processSubmitConfirmationForOrgDoc(html2String, isSubmitted);
        }
      }
    }
  }

  async processSubmitConfirmationForOrgDoc(htmlString, isSubmitted) {
    toast.success("Verifying...", { autoClose: 50 });
    toast.success("Loading...", { autoClose: false });

    let title2save =
      this.state.title != undefined && this.state.title?.length > 0
        ? this.state.title
        : this.props.docForm.formNameTitle;
    // console.log("this.state.draft", this.state.draft);
    console.log("processSubmitConfirmationForOrgDoc_title2save", title2save);

    let formData2Post = new FormData();

    formData2Post.append("htmlString", htmlString);
    formData2Post.append("inputData", JSON.stringify(this.state.formData));
    formData2Post.append("title", title2save); //DevNote[Remarks] ToBeDone:Added On: 13-08-2022
    formData2Post.append(
      "recordId",
      this.state.draft?.id > 0 ? this.state.draft?.id : 0
    ); //DevNote[Remarks] ToBeDone:Added On: 13-08-2022

    if (this.props.isClientDocForm) {
      if (this.props.clientCase != null && this.props.clientCase != undefined) {
        formData2Post.append("caseId", this.props.clientCase.id);
        console.log(
          "processSubmitConfirmationForOrgDoc_caseId",
          this.props?.clientCase?.id
        );
      }
      formData2Post.append("userId", this.state.userData.id);
      formData2Post.append("docFormId", this.state.docForm.id);
      formData2Post.append("sType", this.props.clientFormType);
      formData2Post.append(
        "isFilled",
        this.state.savingType === "save" ? 0 : 1
      );

      //DataFields2Post: (caseId,userId,docFormId,htmlString,inputData,title,recordId);
    } else {
      formData2Post.append("saveDataOnServer", Number(1));
      formData2Post.append("fromDeviceType", "Web");

      formData2Post.append("submitted", isSubmitted); //DevNote[Remarks] ToDo:Added On: 13-08-2022
      formData2Post.append("submittedById", this.state.userData.id); //DevNote[Remark]:This will always be current User
      // console.log("PutOrgDocFormUserData_recordId", this.state.draft?.id > 0 ? this.state.draft?.id : 0);
      // console.log("PutOrgDocFormUserData_formData",formData);
      // console.log("PutOrgDocFormUserData_isSubmitted",isSubmitted);
      formData2Post.append("docFormId", this.state.docForm.formId);
      formData2Post.append("userId", this.state.submittedBy.id); //DevNote[Remark]:User Who have or will Submitted Record
    }
    // const localAPI =
    //   "http://164.52.210.124:4001/dm_leorg_test/putClientDocFormDraftData";
    // const localAPI = "http://localhost:8080/dm_leorg/putClientDocFormDraftData";
    // WsPutClientDocFormDraftDataNew

    await axios
      .post(
        this.props.isClientDocForm == true
          ? WsPutClientDocFormDraftDataNew //localAPI //WsPutClientDocFormDraftData
          : WSPutOrgDocFormUserInputData,
        formData2Post,
        {
          headers: apiKeyHeaderMultiPartFormData(),
        }
      )
      .then((response) => {
        const responseData = response.data;
        if (this.props?.isClientDocForm) {
          console.log(
            "PutClientCaseDocFormDraftData_responseData",
            responseData
          );

          if (responseData.resultCode === 1) {
            if (this.state.savingType === "save") {
              return alert("Document Saved Successfully");
            }
            if (this.props.onReturnDraftRecord != undefined) {
              this.props.onReturnDraftRecord({
                id: responseData.recordId,
                title: title2save,
                inputData: this.state.formData,
                htmlData: htmlString,
              });
            }
          } else {
            window.alert(responseData.resultMessage);
          }
        } else {
          console.log("PutOrgDocFormUserData_responseData", responseData);
          if (responseData.result_code == 1) {
            this.setState({
              errors: "",
              additionalMessage: responseData.additional_message,
            });

            //id:,title:,inputData:,htmlString:
            if (this.state.draft?.id > 0) {
            } else {
              //id:,title:,inputData:,htmlString:---------
              //,inputData:this.state.formData,htmlString:htmlString
              // console.log("PutOrgDocFormUserData_SetDraft", {id:responseData.recordId,title:title2save});
              this.setState({
                draft: { id: responseData.recordId, title: title2save },
              });
            }

            if (isSubmitted > 0) {
              this.setShowActionButtons(true);
              if (this.props?.toMerge) {
                if (this.props.onReturnDraftRecord != undefined) {
                  this.props.onReturnDraftRecord({
                    id: responseData.recordId,
                    title: title2save,
                  });
                }
              }
            }
          } else {
            window.alert(responseData.result_message);
            this.setState({ errors: responseData.result_message });
          }
        }
      })
      .catch((error) => {
        console.error("PutOrgDocFormUserData_error", error);
      });

    toast.dismiss();
  }

  showText = () => {
    let readMoreToggler = document.querySelector(".readMoreToggler");
    let contentIn4Lines = document.querySelector(".contentIn4Lines");

    readMoreToggler.addEventListener("mousedown", (e) => {
      contentIn4Lines.classList.toggle("show-more");
      if (readMoreToggler.innerText === "...Read more") {
        readMoreToggler.innerText = "...Read less";
      } else {
        readMoreToggler.innerText = "...Read more";
      }
    });
  };

  onEditorChange(content) {
    this.setState({ usingEditor: true, testTemplateToShow: content });
  }

  editTitle() {
    confirmAlert({
      title: "Confirm to Edit!",
      message:
        "Are you sure to edit Title, this will use to save this document",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            this.proceed2EditTitle();
          },
        },
        {
          label: "No",
        },
      ],
    });
  }

  proceed2EditTitle() {
    let person = prompt("Edit/Provide Title", this.state.title);
    if (person != null && person != undefined && person.length > 3) {
      this.setState({ title: person });
    }
  }

  async handleTextExtraction() {
    const divElement = document.createElement("div");
    divElement.innerHTML = await processPageBreak(
      this.state.testTemplateToShow
    );

    const arr = [
      "cd-hearingdate",
      "cd-purposecurhearing",
      "cd-outcome",
      "cd-attende",
      "cd-nextdate",
      "cd-purposenexhearing",
    ];

    const newStateUpdates = {};
    arr.forEach((tag) => {
      const regex = new RegExp(`\\[${tag}\\](.*?)\\[\\/${tag}\\]`, "gis");
      let match;
      while ((match = regex.exec(divElement.textContent)) !== null) {
        newStateUpdates[tag.slice(3)] = match[1].trim();
      }
    });
    this.setState((prevState) => ({
      caseHearingDiary: {
        ...prevState.caseHearingDiary,
        ...newStateUpdates,
      },
    }));

    return 1;
  }

  getProcessedContent(content) {
    this.setState((prev) => ({ ...prev, processedContent: content }));
  }

  handleAutoFillData(e) {
    e.preventDefault();
    this.setState({
      displayAutoFillPopup: true,
    });
  }

  CloseAutoFillPopup() {
    this.setState({
      displayAutoFillPopup: false,
    });
  }

  handleAddAutoFillData(type, details) {
    if (type === "Single") {
      this.setState((prev) => ({
        ...prev,
        formData: {
          ...prev.formData,
          t_offtelephonetypes00: details.name,
          t_paytelephonetypes00: details.number,
        },
        seletedBill: details,
        displayAutoFillPopup: false,
      }));
    }
    if (type === "Multiple") {
      this.handleMultipleAutoFillData(
        details,
        "numbertelephonetypes00",
        "t_pay",
        "t_off"
      );
    }
    if (type === "sanction") {
      this.handleMultipleAutoFillData(
        details,
        "numbertelephoneexpenses00",
        "tel_no",
        "user"
      );
    }
  }

  handleMultipleAutoFillData(details, templateKey, numkey, nKey) {
    details.sort((a, b) => a.index - b.index);
    const num =
      this.state.formData.telephonetypes0?.length > 0
        ? Number(this.state.formData.numbertelephonetypes00)
        : Number(this.state.formData.numbertelephoneexpenses00);
    // const num = Number(this.state.formData.numbertelephonetypes00);
    for (let index = 0; index < num; index++) {
      const eachName = details[index] ? details[index].details.name : "";
      const eachNumber = details[index]
        ? String(details[index].details.number)
        : "";
      // const customIndex = index < 10 ? index : "00" + index;
      const customIndex = index;
      const numberKey = numkey + templateKey + customIndex;
      const nameKey = nKey + templateKey + customIndex;
      // const numberKey = "t_pay" + templateKey + customIndex;
      // const nameKey = "t_off" + templateKey + customIndex;

      this.setState((prev) => ({
        ...prev,
        formData: {
          ...prev.formData,
          [numberKey]: eachNumber,
          [nameKey]: eachName,
        },
      }));
    }
    this.setState((prev) => ({
      ...prev,
      seletedBills: details,
      displayAutoFillPopup: false,
    }));
  }

  resetBills() {
    this.setState((prev) => ({ ...prev, seletedBills: [], seletedBill: {} }));
  }

  closeComparePopup() {
    this.setState({ displayComparePopup: false });
  }

  render() {
    return (
      <div style={{ width: "100%", gap: "2%" }}>
        {this.state.displayComparePopup && (
          <Popup
            title={"Compared Response"}
            height="760px"
            maxWidth="950px"
            onClose={this.closeComparePopup.bind(this)}
          >
            <div style={{ padding: "8px" }}>
              <div
                style={{
                  color: "black",
                  overflow: "auto",
                  padding: "8px",
                  fontFamily: "'Times New Roman', Times, serif",
                }}
                className="contentToPrintTableProps"
                dangerouslySetInnerHTML={{
                  __html: this.state.comparedAiContent,
                }}
              ></div>
            </div>
          </Popup>
        )}
        <ReactTooltip />
        {this.state.jsonData?.body &&
          this.props.clientFormType === "judgement" && (
            <div style={{ display: "flex" }}>
              {this.state.inputDisplay && (
                <span
                  title="Go back to the form"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    this.setState({
                      jsonData: {},
                      inputDisplay: false,
                      fieldsList: [],
                      responseResult: [],
                    });
                  }}
                >
                  {" "}
                  ⬅️
                </span>
              )}
              <SampleHeading formdata={this.state.jsonData} />
            </div>
          )}
        <div className="form_container" id="formFieldsContainer">
          {/* <div className="row">
            <div
              className="categoryNameHeading col-lg-11 col-11"
              style={{ margin: 0 }}
            ></div> */}

          <div
            className="desktop_only"
            style={{
              display:
                this.props.clientFormType === "judgement" ||
                this.props.clientFormType === "clntInfoInit" ||
                this.props.clientFormType === "clntinfo"
                  ? "none"
                  : "block",
            }}
          >
            <InputFieldToggle />
          </div>

          {/* </div> */}

          {this.state.displayAutoFillPopup && (
            <Popup
              title="Auto fill Data"
              height="500px"
              maxWidth="750px"
              onClose={this.CloseAutoFillPopup.bind(this)}
            >
              <AutoFill
                resetBills={this.resetBills.bind(this)}
                billType={this.state.formData.types}
                type={
                  this.state.formData.telephonetypes0?.length > 0
                    ? this.state.formData.telephonetypes0
                    : "sanction"
                }
                // type={this.state.formData.telephonetypes0}
                // typeMultiple={this.state.formData.numbertelephonetypes00}
                typeMultiple={
                  this.state.formData.telephonetypes0?.length > 0
                    ? this.state.formData.numbertelephonetypes00
                    : this.state.formData.numbertelephoneexpenses00
                }
                handleAddAutoFillData={this.handleAddAutoFillData.bind(this)}
                existingBill={
                  this.state.formData.telephonetypes0 === "Single"
                    ? this.state.seletedBill
                    : this.state.seletedBills
                }
              />
            </Popup>
          )}

          <div className="">
            <div
              id="actionsButtons"
              className="none padding-0 p-sm-16"
              // style={{ textAlign: "end" }}
            >
              {(() => {
                if (this.state.showActionButtons == true) {
                  return (
                    <>
                      <ReactToPrint
                        documentTitle={
                          this.state.docForm.formNameTitle +
                          "_DocMaster_" +
                          Date.now()
                        }
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
                            <button
                              id="docformprintbutton1"
                              style={{ fontSize: 16 }}
                              className="no_print mb-3 outlineButton"
                            >
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

                      <button
                        className="ml-lg-2 mb-3 outlineButton"
                        onClick={() => this.sendDocToUser(-1, 0)}
                      >
                        <i
                          style={{ fontSize: 20 }}
                          className="fa fa-download"
                          aria-hidden="true"
                        ></i>{" "}
                        Download As Word/Docx
                      </button>

                      <button
                        style={{ fontSize: 16 }}
                        className="ml-lg-2 mb-3 outlineButton w-150"
                        onClick={() => this.setState({ showEditor: true })}
                      >
                        <i
                          style={{ fontSize: 20 }}
                          className="fa fa-edit"
                          aria-hidden="true"
                        ></i>{" "}
                        Edit
                      </button>
                    </>
                  );
                } else {
                  return (
                    <>
                      <button
                        id="confirmButton"
                        // style={{ fontSize: 16 }}
                        className="outlineButton mb-3"
                        onClick={() => {
                          this.confirmSubmittedForm();
                        }}
                      >
                        <i
                          style={{ fontSize: 20 }}
                          className="fa fa-check"
                          aria-hidden="true"
                        ></i>{" "}
                        Confirm
                      </button>

                      <button
                        style={{ fontSize: 16 }}
                        className="outlineButton mb-3 ml-lg-2 w-150"
                        onClick={() => {
                          // navigate(-1);
                          this.setState((prev) => ({
                            ...prev,
                            aiResponse: "",
                          }));
                          document
                            .querySelector("#docFormInputFields")
                            ?.classList.remove("none");
                          document
                            .querySelector("#editDocFormDiv")
                            ?.classList.remove("none");

                          document
                            .querySelector("#actionsButtons")
                            ?.classList.add("none");
                          document
                            .getElementById("TemplateToggle")
                            ?.classList.remove("HideTemplateToggleButton");
                          document
                            .getElementById("docFormPreview")
                            ?.classList.remove("width-78");

                          if (
                            this.props.clientFormType === "clntInfoInit" ||
                            this.props.clientFormType === "clntinfo"
                          ) {
                            const element =
                              document.getElementById("docFormPreview");

                            if (element) {
                              element.style.display = "none";
                              element.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                              });
                            }
                          }

                          // document
                          //   .querySelector("#docFormPreview")
                          //   .classList.add("col-lg-8");
                          // document
                          //   .querySelector("#docFormPreview")
                          //   .classList.remove("col-lg-12");
                          // document
                          //   .querySelector("#docFormPreview")
                          //   .classList.add("pl-40");
                          // document
                          //   .getElementById("TemplateToggle")
                          //   .classList.remove("HideTemplateToggleButton");
                          // document
                          //   .querySelector("#docFormPreview")
                          //   .classList.add("showDocFormPreview");
                          //   document
                          //     .getElementById("docFormPreview")
                          //     .classList.remove("full-width");
                          // document
                          //   .querySelector("#docFormPreview")
                          //   .classList.add("defaultDocForm");
                          // document
                          //   .getElementById("docFormInputFields")
                          //   .classList.remove("expandFormField");
                        }}
                      >
                        <i
                          style={{ fontSize: 20 }}
                          className="fa fa-arrow-left"
                          aria-hidden="true"
                        ></i>{" "}
                        Back
                      </button>

                      {(this.props.clientFormType === "clntInfoInit" ||
                        this.props.clientFormType === "clntinfo") && (
                        <>
                          <button
                            onClick={this.handleGenerateUsingAI}
                            className="outlineButton mb-3"
                          >
                            Generate Using AI
                          </button>
                          {/* {this.state.aiResponse.length > 0 && (
                            <button
                              onClick={this.handleCompareusingAI}
                              className="outlineButton mb-3"
                            >
                              Compare
                            </button>
                          )} */}
                        </>
                      )}

                      {/* {this.props.clientFormType === "clntInfoInit" && (
                        <button
                          style={{ fontSize: 16 }}
                          className="outlineButton mb-3 ml-lg-2 w-150"
                          onClick={this.handleTextExtraction.bind(this)}
                        >
                          Get Text
                        </button>
                      )} */}
                    </>
                  );
                }
              })()}
            </div>

            {(() => {
              if (
                this.state.docFormError != null ||
                this.state.docFormError.length > 0
              ) {
                return (
                  <>
                    <div className="docFormError">
                      {this.state.docFormError}
                    </div>
                  </>
                );
              }
            })()}

            {/* <div id="editDocFormDiv">
              Title: {this.state.title}{" "}
              <button
                className="customSmallButton"
                onClick={() => this.editTitle()}
              >
                Edit
              </button>
            </div> */}

            {(this.state.formData.telephonetypes0 === "Single" ||
              (this.state.formData.telephonetypes0 === "Multiple" &&
                this.state.formData.numbertelephonetypes00 > 0) ||
              this.state.formData.numbertelephoneexpenses00 > 0) && (
              <button
                className="btn btn-primary"
                onClick={this.handleAutoFillData.bind(this)}
              >
                Auto filldata
              </button>
            )}

            <div className="formFieldAndTemplateContainer">
              <div className="d-flex file-edit-sections">
                <div
                  id="docFormInputFields"
                  className="generalUserInputField "
                  // style={{
                  //   display: !this.state.inputDisplay ? "block" : "none",
                  //   width:
                  //     this.props.clientFormType === "judgement"
                  //       ? "100%"
                  //       : "40vw",
                  // }}

                  style={{
                    ...(this.props.clientFormType === "judgement"
                      ? {
                          display: !this.state.inputDisplay ? "block" : "none",
                          width: "100%",
                        }
                      : {}),
                    ...(this.props.clientFormType === "clntInfoInit" ||
                    this.props.clientFormType === "clntinfo"
                      ? { width: "100%" }
                      : {}),
                  }}
                >
                  {/* {(this.state.formData.telephonetypes0 === "Single" ||
                    (this.state.formData.telephonetypes0 === "Multiple" &&
                      this.state.formData.numbertelephonetypes00 > 0) ||
                    this.state.formData.numbertelephoneexpenses00 > 0) && (
                    <button
                      className="btn btn-primary"
                      onClick={this.handleAutoFillData.bind(this)}
                    >
                      Auto filldata
                    </button>
                  )} */}

                  <Form onSubmit={this.onFormSubmit}>
                    {InputFieldRendring(
                      this.state.formsFieldsDataSorted,
                      this.state.conditionalFormInputs,
                      this.onInputChange.bind(this),
                      this.state.formData
                    )}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      {this.state.showSubmitButton ? (
                        <>
                          {this.props?.toMerge == true ? null : (
                            <button
                              id="saveDraftButton"
                              className="outlineButton btn-sm"
                              style={{
                                width: "44%",
                                borderRadius: 0,
                              }}
                              onClick={() => {
                                this.saveDocFormDraft();
                              }}
                              type="button"
                            >
                              <i
                                style={{ fontSize: 20 }}
                                className="fa fa-floppy-o"
                                aria-hidden="true"
                              ></i>{" "}
                              Save
                            </button>
                          )}

                          <button
                            type="Submit"
                            // className="outlineButton btn-sm"
                            className="btn mt-2 btn-outline-primary"
                            style={{
                              // width: "44%",
                              margin: 0,
                              borderRadius: 0,
                            }}
                          >
                            <i
                              style={{ fontSize: 20 }}
                              className="fa fa-check"
                              aria-hidden="true"
                            ></i>{" "}
                            Submit
                          </button>
                        </>
                      ) : (
                        <div className="docFormError">
                          {this.state.docFormError}
                        </div>
                      )}
                    </div>
                  </Form>

                  {this.props.clientFormType === "drftng" && (
                    <button
                      className="btn btn-outline-primary my-2"
                      style={{
                        borderRadius: 0,
                        marginTop: "5px",
                      }}
                      onClick={() => {
                        this.setState({ savingType: "save" }, () => {
                          this.confirmSubmittedForm();
                        });
                      }}
                    >
                      <i
                        style={{ fontSize: 20 }}
                        className="fa fa-check"
                        aria-hidden="true"
                      ></i>
                      Save Draft
                    </button>
                  )}
                </div>
                {/* {this.props.clientFormType !== "judgement" && ( */}
                <div
                  id="docFormPreview"
                  className="defaultDocForm showDocFormPreview pl-40 "
                  style={{
                    display:
                      this.props.clientFormType === "judgement" ||
                      this.props.clientFormType === "clntInfoInit" ||
                      this.props.clientFormType === "clntinfo"
                        ? "none"
                        : "block",
                  }}
                >
                  <div
                    className="liveRenderingOfForm"
                    style={{
                      display:
                        this.props.clientFormType === "judgement"
                          ? "none"
                          : "block",
                    }}
                  >
                    {this.state.aiResponse.length === 0 && (
                      <div
                        id="contentToPrint"
                        ref={(el) => (this.componentRef = el)}
                        style={{
                          fontFamily: "'Times New Roman', Times, serif",
                        }}
                        className="contentToPrintTableProps"
                      >
                        <ContentToPrint
                          testTemplateToShow={this.state.testTemplateToShow}
                          getProcessedContent={this.getProcessedContent.bind(
                            this
                          )}
                        />
                      </div>
                      // <div
                      //   id="contentToPrint"
                      //   ref={(el) => (this.componentRef = el)}
                      //   style={{
                      //     fontFamily: "'Times New Roman', Times, serif",
                      //   }}
                      //   className="contentToPrintTableProps"
                      //   dangerouslySetInnerHTML={{
                      //     __html: this.state.processedContent,
                      //   }}
                      //   // dangerouslySetInnerHTML={{
                      //   //   __html: processPageBreakandWebContent(
                      //   //     this.state.testTemplateToShow
                      //   //   ),
                      //   // }}
                      //   // dangerouslySetInnerHTML={{
                      //   //   __html: processPageBreakandContent(
                      //   //     this.state.testTemplateToShow
                      //   //   ),
                      //   // }}
                      // />
                    )}

                    {this.state.aiResponse.length > 0 && (
                      <div className="row">
                        <div className="col-md-6 pb-border-right">
                          <div
                            id="contentToPrint"
                            ref={(el) => (this.componentRef = el)}
                            style={{
                              fontFamily: "'Times New Roman', Times, serif",
                            }}
                            className="contentToPrintTableProps"
                            dangerouslySetInnerHTML={{
                              __html: this.state.processedContent,
                            }}
                          />
                        </div>
                        <div className="col-md-6">
                          <>
                            <div className="text-center mb-3">
                              <u
                                style={{
                                  fontWeight: 600,
                                  color: "black",
                                  fontSize: "12pt",
                                }}
                              >
                                AI Generated Response
                              </u>
                            </div>
                            <div
                              id="AiResponseEl"
                              style={{
                                fontFamily: "'Times New Roman', Times, serif",
                              }}
                              className="contentToPrintTableProps"
                              dangerouslySetInnerHTML={{
                                __html: this.state.aiResponse,
                              }}
                            />
                          </>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {/* )} */}
                {this.props.clientFormType === "judgement" &&
                  this.state.fieldsList.length > 0 && (
                    <div
                      id="docFormPreview"
                      className="defaultDocForm showDocFormPreview pl-40 "
                    >
                      {/* {this.props.clientFormType === "judgement" &&
                        this.state.fieldsList.length > 0 && (
                          <Table
                            response={this.state.responseResult}
                            fields={this.state.fieldsList}
                          />
                        )} */}
                      {this.props.clientFormType === "judgement" &&
                        this.state.submitbtnLoader && (
                          <div className="spinner"></div>
                        )}
                      {this.props.clientFormType === "judgement" &&
                        !this.state.submitbtnLoader &&
                        this.state.responseResult.length > 0 && (
                          <Table
                            response={this.state.responseResult}
                            fields={this.state.fieldsList}
                          />
                        )}
                      {this.props.clientFormType === "judgement" &&
                        !this.state.submitbtnLoader &&
                        this.state.responseResult.length === 0 && (
                          <p
                            style={{
                              textAlign: "center",
                              marginTop: "2%",
                              color: "black",
                            }}
                          >
                            No Data found
                          </p>
                        )}
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
        <div className="none" id="filledFormRealTimePreview">
          <div className="">
            <div className="col-lg-9 col-12 padding-0 pr-20">
              <div className="">
                {document.addEventListener("contextmenu", (event) =>
                  event.preventDefault()
                )}

                <Modal
                  transparent={false}
                  ariaHideApp={false}
                  isOpen={this.state.showEditor}
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
                      left: "20%",
                      width: "70vw",
                      // background: "transparent",
                      // border: "none",
                      // boxShadow:"0 0 5px black"
                    },
                  }}
                  onRequestClose={() => {
                    this.setState({ showEditor: false });
                  }}
                >
                  <div style={{ textAlign: "" }}>
                    <button
                      onClick={() => {
                        this.setState({ showEditor: false });
                      }}
                      className="btn btn-sm btn-primary mb-1"
                    >
                      <i className="fa fa-floppy-o" aria-hidden="true"></i> Done
                    </button>
                  </div>

                  <div>
                    <TinyMce
                      formId={0}
                      intitialContent={this.state.testTemplateToShow}
                      onEditorChange={this.onEditorChange.bind(this)}
                    />
                  </div>
                </Modal>
                <div>{this.state.errors}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default DocFormCoreRun;
