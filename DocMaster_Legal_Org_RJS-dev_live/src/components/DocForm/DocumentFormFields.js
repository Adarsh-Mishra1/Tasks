//DocumentFormFields.js
import { FormGroup } from "reactstrap";
import React, { Component } from "react";
import Modal from "react-modal";

import {
  RenderInputAsPerType,
  sortFormFields,
} from "../../OtherFunctions/FormRenderingFunctions";
import DesignDevelopDocForms from "./DesignDevelopDocForms";
import MultiChoiceValueConditionPopUp from "./MultiChoiceValueConditionPopUp";
import AddEditFormFields from "./AddEditFormFields"; //ToEditAlreadyGeneratedFormFields

class DocumentFormFields extends Component {
  constructor(props) {
    super(props);
    // console.log(
    //   "DocumentFormFields" + this.props.formType,
    //   this.props.formsFieldsData
    // );
    console.log("DocumentFormFields_constructor", props.formsFieldsData);

    this.state = {
      multiChoiceConditionValueSelectModel: false,
      valuesForMultiChoiceSelectCondition: [],
      subFormModalIsOpen: false,
      formsFieldsData: this.props.formsFieldsData,
      formsFieldsDataSorted: sortFormFields(
        this.props.formsFieldsData.formFields,
      ),
      conditionForSelectedFormField: "",
      conditionForSelectedFormFieldKey: null,
      conditionForSelectedFormFieldValue: "",
      formFieldToEdit: {},
      editFormFieldModalIsOpen: false,
    };
  }

  /*
  componentWillReceiveProps(nextProps) {
    // console.log("componentWillReceiveProps ");
    // console.log(
    //   "DocumentFormFields" + this.props.formType,
    //   this.props.formsFieldsData
    // );
    this.setState({
      formsFieldsData: this.props.formsFieldsData,
      formsFieldsDataSorted: sortFormFields(
        this.props.formsFieldsData.formFields
      ),
    });
  }*/

  //New to Replace componentWillReceiveProps
  static getDerivedStateFromProps(props, state) {
    console.log(
      "DocumentFormFields_getDerivedStateFromProps",
      props.formsFieldsData,
    );
    //if (props.formsFieldsData !== state.formsFieldsData) {
    return {
      formsFieldsData: props.formsFieldsData,
      formsFieldsDataSorted: sortFormFields(props.formsFieldsData.formFields),
    };
    //}

    // Return null to indicate no change to state.
    //return null;
  }

  /*
  componentDidMount() {
    // console.log("componentDidMount ");
    // console.log(this.props.inputFields);
    // console.log(
    //   "DocumentFormFields" + this.props.formType,
    //   this.props.formsFieldsData
    // );
  }

  componentDidUpdate() {
    //console.log("componentDidUpdate");
  }
  */

  //toProcess copyOfInput
  processAddCondition(copyInputField, parentInputField, copyFormFieldkey) {
    console.log(
      "processAddCondition_copyOfInput_copyInputField",
      copyInputField,
    );
    console.log(
      "processAddCondition_copyOfInput_parentInputField",
      parentInputField,
    );
    console.log(
      "processAddCondition_copyOfInput_copyFormFieldkey",
      copyFormFieldkey,
    );

    if (parentInputField.elementType == "copyOfInput") {
      window.alert(
        "Invalid: Do not make Copy Input Field of Copy Input Fields",
      );
      // console.log("copyOfInput_addCondition_fieldElement.elementType", fieldElement.elementType);
      // console.log("copyOfInput_addCondition_fieldElement.value",fieldElement.value);
      // console.log("copyOfInput_addCondition_this.state.formsFieldsData.formFields",this.state.formsFieldsData.formFields);
      // let parentInputFields=this.state.formsFieldsData.formFields[fieldElement.value];
      // console.log("copyOfInput_addCondition_parentInputFields",parentInputFields);
      // if(parentInputFields!=undefined){
      //   this.processAddCondition(fieldElement,parentInputFields,formFieldkey);
      // }else{
      // }
    } else if (parentInputField.elementType.toLowerCase() == "select") {
      //select
      //ToDo: show multichoice popup and poceed after setting : conditionForSelectedFormFieldValue
      let inputValues = parentInputField.value.split(",");

      if (inputValues.length < 1) {
        window.alert(
          "Invalid: No Value Provided for this Multi choice Parent Input Field",
        );
      } else {
        this.setState({
          conditionForSelectedFormField: copyInputField,
          conditionForSelectedFormFieldKey: copyFormFieldkey,
          valuesForMultiChoiceSelectCondition: inputValues,
        });
        this.setState({ multiChoiceConditionValueSelectModel: true });
      }
    } else if (parentInputField.elementType.toLowerCase() == "radio") {
      //radio
      let inputValues = parentInputField.value.split(",");
      if (inputValues.length < 1) {
        window.alert(
          "Invalid: No Value Provided for this Multi choice Parent Input Field",
        );
      } else {
        this.setState({
          conditionForSelectedFormField: copyInputField,
          conditionForSelectedFormFieldKey: copyFormFieldkey,
          valuesForMultiChoiceSelectCondition: inputValues,
        });
        this.setState({ multiChoiceConditionValueSelectModel: true });
      }
    } else if (parentInputField.elementType.toLowerCase() == "datalist") {
      //datalist
      let inputValues = parentInputField.value.split(",");
      if (inputValues.length < 1) {
        window.alert(
          "Invalid: No Value Provided for this Multi choice Parent Input Field",
        );
      } else {
        this.setState({
          conditionForSelectedFormField: copyInputField,
          conditionForSelectedFormFieldKey: copyFormFieldkey,
          valuesForMultiChoiceSelectCondition: inputValues,
        });
        this.setState({ multiChoiceConditionValueSelectModel: true });
      }
    } else if (
      parentInputField.elementType.toLowerCase() == "checkbox" &&
      (parentInputField.elementConfig.type.toLowerCase() == "multiselectt1" ||
        parentInputField.elementConfig.type.toLowerCase() == "multiselectt2" ||
        parentInputField.elementConfig.type.toLowerCase() == "multiselectt3" ||
        parentInputField.elementConfig.type.toLowerCase() == "multiselectt4" ||
        parentInputField.elementConfig.type.toLowerCase() == "multiselectt5")
    ) {
      //MultiSelectedCheckBox
      let inputValues = parentInputField.value.split("\n");
      if (inputValues.length < 1) {
        window.alert(
          "Invalid: No Value Provided for this Multi choice Input Field",
        );
      } else {
        this.setState({
          conditionForSelectedFormField: copyInputField,
          conditionForSelectedFormFieldKey: copyFormFieldkey,
          valuesForMultiChoiceSelectCondition: inputValues,
          multiChoiceConditionValueSelectModel: true,
        });
      }
    } else {
      this.setState({
        conditionForSelectedFormField: copyInputField,
        conditionForSelectedFormFieldKey: copyFormFieldkey,
      });
      this.showAddSubForms();
    }
  }

  addCondition(fieldElement, formFieldkey) {
    console.log("addCondition");
    console.log("fieldElement", fieldElement);
    console.log("formFieldkey", formFieldkey);
    console.log("fieldElement.elementType", fieldElement.elementType);

    // this.state.conditionForSelectedFormField = fieldElement;
    // this.state.conditionForSelectedFormFieldKey = formFieldkey;
    //console.log("addConditionMain", this.state.formInputFields);
    //AddSubDocFormsPopUp
    if (fieldElement.elementType == "copyOfInput") {
      console.log(
        "copyOfInput_addCondition_fieldElement.elementType",
        fieldElement.elementType,
      );
      console.log(
        "copyOfInput_addCondition_fieldElement.value",
        fieldElement.value,
      );
      console.log(
        "copyOfInput_addCondition_this.state.formsFieldsData.formFields",
        this.state.formsFieldsData.formFields,
      );
      let parentInputFields =
        this.state.formsFieldsData.formFields[fieldElement.value];
      console.log(
        "copyOfInput_addCondition_parentInputFields",
        parentInputFields,
      );

      if (parentInputFields != undefined) {
        this.processAddCondition(fieldElement, parentInputFields, formFieldkey);
      } else {
        window.alert("Invalid: Invalid Parent Input Field");
      }
    } else if (fieldElement.elementType.toLowerCase() == "select") {
      console.log("multichoice condition");

      //conditionForSelectedFormFieldValue
      //ToDo: show multichoice popup and poceed after setting : conditionForSelectedFormFieldValue
      let inputValues = fieldElement.value.split(",");
      console.log("fieldElementvalueArray", inputValues);

      if (inputValues.length < 1) {
        window.alert(
          "Invalid: No Value Provided for this Multi choice Input Field",
        );
      } else {
        this.setState({
          conditionForSelectedFormField: fieldElement,
          conditionForSelectedFormFieldKey: formFieldkey,
          valuesForMultiChoiceSelectCondition: inputValues,
        });
        this.setState({ multiChoiceConditionValueSelectModel: true });
      }
    } else if (fieldElement.elementType.toLowerCase() == "radio") {
      console.log("multichoice condition");

      //conditionForSelectedFormFieldValue
      //ToDo: show multichoice popup and poceed after setting : conditionForSelectedFormFieldValue
      let inputValues = fieldElement.value.split(",");
      console.log("fieldElementvalueArray", inputValues);

      if (inputValues.length < 1) {
        window.alert(
          "Invalid: No Value Provided for this Multi choice Input Field",
        );
      } else {
        this.setState({
          conditionForSelectedFormField: fieldElement,
          conditionForSelectedFormFieldKey: formFieldkey,
          valuesForMultiChoiceSelectCondition: inputValues,
        });
        this.setState({ multiChoiceConditionValueSelectModel: true });
      }
    } else if (fieldElement.elementType.toLowerCase() == "datalist") {
      console.log("multichoice condition");

      //conditionForSelectedFormFieldValue
      //ToDo: show multichoice popup and poceed after setting : conditionForSelectedFormFieldValue
      let inputValues = fieldElement.value.split(",");
      console.log("fieldElementvalueArray", inputValues);

      if (inputValues.length < 1) {
        window.alert(
          "Invalid: No Value Provided for this Multi choice Input Field",
        );
      } else {
        this.setState({
          conditionForSelectedFormField: fieldElement,
          conditionForSelectedFormFieldKey: formFieldkey,
          valuesForMultiChoiceSelectCondition: inputValues,
        });
        this.setState({ multiChoiceConditionValueSelectModel: true });
      }
    } else if (
      fieldElement.elementType.toLowerCase() == "checkbox" &&
      (fieldElement.elementConfig.type.toLowerCase() == "multiselectt1" ||
        fieldElement.elementConfig.type.toLowerCase() == "multiselectt2" ||
        fieldElement.elementConfig.type.toLowerCase() == "multiselectt3" ||
        fieldElement.elementConfig.type.toLowerCase() == "multiselectt4" ||
        fieldElement.elementConfig.type.toLowerCase() == "multiselectt5")
    ) {
      console.log("Adding-Condition-for-multiselectt1-checkbox");
      let inputValues = fieldElement.value.split("\n");
      console.log("multiselectt1-checkbox_fieldElementvalueArray", inputValues);
      if (inputValues.length < 1) {
        window.alert(
          "Invalid: No Value Provided for this Multi choice Input Field",
        );
      } else {
        this.setState({
          conditionForSelectedFormField: fieldElement,
          conditionForSelectedFormFieldKey: formFieldkey,
          valuesForMultiChoiceSelectCondition: inputValues,
          multiChoiceConditionValueSelectModel: true,
        });
      }
    } else {
      this.setState({
        conditionForSelectedFormField: fieldElement,
        conditionForSelectedFormFieldKey: formFieldkey,
      });
      this.showAddSubForms();
    }
  }

  onChoiceValueSelect(formField, formFieldKey, value) {
    console.log("onChoiceValueSelect");
    console.log("formField", formField);
    console.log("formFieldKey", formFieldKey);
    console.log("value", value);

    if (value.length > 0) {
      this.setState({
        conditionForSelectedFormField: formField,
        conditionForSelectedFormFieldKey: formFieldKey,
        conditionForSelectedFormFieldValue: value,
        multiChoiceConditionValueSelectModel: false,
        valuesForMultiChoiceSelectCondition: [],
      });
      this.showAddSubForms();
    } else {
      window.alert("No Value selected");
    }
  }

  removeCondition(fieldElement, formFieldKey) {
    console.log("removeCondition", fieldElement);
    console.log("removeCondition", formFieldKey);

    console.log("removeCondition", this.state.formsFieldsData.formFields);

    if (
      window.confirm(
        "Are you sure you want to delete condition for this Input Field?",
      ) === true
    ) {
      this.state.formsFieldsData.formFields[formFieldKey].isConditional = false;
      this.state.formsFieldsData.formFields[formFieldKey].condition = {};
      console.log(
        "removeCondition",
        this.state.formsFieldsData.formFields[formFieldKey],
      );
      //formsFieldsData: this.props.formsFieldsData,
      this.props.onDocFormInputFieldChangeHandler(this.state.formsFieldsData);
    }
  }

  deleteThisInputFormField(fieldElement, formFieldkey) {
    console.log("deleteThisInputFormField", fieldElement);
    console.log("deleteThisInputFormField", formFieldkey);
    console.log(this.props);
    this.props.onInputFormFieldsDelete(fieldElement);
  }

  editInputFormFieldsCondition(fieldElement, formFieldKey) {
    console.log("editInputFormFieldsCondition", fieldElement);
    console.log("editInputFormFieldsCondition", formFieldKey);
    if (
      window.confirm("Are you sure you want to Edit this Input Field?") === true
    ) {
      this.setState({
        formFieldToEdit: fieldElement,
        editFormFieldModalIsOpen: true,
      });
    }
  }

  showAddSubForms() {
    this.setState({ subFormModalIsOpen: true });
  }

  reflectInputFieldChangesOnMainVariable() {}

  onConditionalFormCreate(
    formField,
    formFieldKey,
    formFieldSelectedValue,
    subFormId,
    subFormTemplate,
    subFormFields,
    conditionType,
  ) {
    console.log("onConditionalFormCreate");
    console.log("onConditionalFormCreate_formField", formField);
    console.log("onConditionalFormCreate_formFieldKey", formFieldKey);
    console.log(
      "onConditionalFormCreate_formFieldSelectedValue",
      formFieldSelectedValue,
    );
    console.log("onConditionalFormCreate_subFormId", subFormId);
    console.log("onConditionalFormCreate_subFormTemplate", subFormTemplate);
    console.log("onConditionalFormCreate_subFormFields", subFormFields);
    console.log("onConditionalFormCreate_conditionType", conditionType);
    console.log(
      "onConditionalFormCreate_onConditionalFormCreate",
      this.state.formsFieldsData.formFields,
    );

    if (formField.elementType == "copyOfInput") {
      if (
        formFieldSelectedValue != undefined &&
        formFieldSelectedValue != null &&
        formFieldSelectedValue.trim().length > 0
      ) {
        console.log("copyOfInput_conditional_type", "ValueBased");

        this.state.formsFieldsData.formFields[formFieldKey].isConditional =
          true;
        this.state.formsFieldsData.formFields[
          formFieldKey
        ].condition.conditionType = "ValueBased";

        if (
          this.state.formsFieldsData.formFields.hasOwnProperty(formFieldKey)
        ) {
          if (
            this.state.formsFieldsData.formFields[formFieldKey].condition
              .conditionStatements == undefined
          ) {
            let fieldElement4 = {};
            fieldElement4["conditionStatements"] = {};

            this.state.formsFieldsData.formFields[formFieldKey].condition =
              Object.assign(
                this.state.formsFieldsData.formFields[formFieldKey].condition,
                fieldElement4,
              );

            this.state.formsFieldsData.formFields[
              formFieldKey
            ].condition.conditionStatements[formFieldSelectedValue] = {
              subFormId: subFormId,
              subFormTemplate: subFormTemplate,
              subFormFields: subFormFields,
            };
          } else {
            //Use This in case you want to Update Existing
            this.state.formsFieldsData.formFields[
              formFieldKey
            ].condition.conditionStatements[formFieldSelectedValue] = {
              subFormId: subFormId,
              subFormTemplate: subFormTemplate,
              subFormFields: subFormFields,
            };
          }
        } else {
          let fieldElement4 = {};
          fieldElement4[formFieldKey] = {};

          this.state.formsFieldsData.formFields = Object.assign(
            this.state.formsFieldsData.formFields,
            {},
          );

          this.state.formsFieldsData.formFields[
            formFieldKey
          ].condition.conditionStatements[formFieldSelectedValue] = {
            subFormId: subFormId,
            subFormTemplate: subFormTemplate,
            subFormFields: subFormFields,
          };
        }
      } else {
        console.log("copyOfInput_conditional_type", "Populate");
        this.state.formsFieldsData.formFields[formFieldKey].isConditional =
          true;
        this.state.formsFieldsData.formFields[
          formFieldKey
        ].condition.conditionType = conditionType;

        this.state.formsFieldsData.formFields[
          formFieldKey
        ].condition.subFormId = subFormId;
        this.state.formsFieldsData.formFields[
          formFieldKey
        ].condition.subFormTemplate = subFormTemplate;
        this.state.formsFieldsData.formFields[
          formFieldKey
        ].condition.subFormFields = subFormFields;
      }
    } else if (formField.elementType.toLowerCase() == "select") {
      this.state.formsFieldsData.formFields[formFieldKey].isConditional = true;
      this.state.formsFieldsData.formFields[
        formFieldKey
      ].condition.conditionType = "ValueBased";

      if (this.state.formsFieldsData.formFields.hasOwnProperty(formFieldKey)) {
        if (
          this.state.formsFieldsData.formFields[formFieldKey].condition
            .conditionStatements == undefined
        ) {
          console.log("-----------------------------------------------");

          let fieldElement4 = {};
          fieldElement4["conditionStatements"] = {};

          this.state.formsFieldsData.formFields[formFieldKey].condition =
            Object.assign(
              this.state.formsFieldsData.formFields[formFieldKey].condition,
              fieldElement4,
            );

          console.log(
            "----",
            this.state.formsFieldsData.formFields[formFieldKey],
          );

          this.state.formsFieldsData.formFields[
            formFieldKey
          ].condition.conditionStatements[formFieldSelectedValue] = {
            subFormId: subFormId,
            subFormTemplate: subFormTemplate,
            subFormFields: subFormFields,
          };
        } else {
          //Use This in case you want to Update Existing
          this.state.formsFieldsData.formFields[
            formFieldKey
          ].condition.conditionStatements[formFieldSelectedValue] = {
            subFormId: subFormId,
            subFormTemplate: subFormTemplate,
            subFormFields: subFormFields,
          };
        }
      } else {
        let fieldElement4 = {};
        fieldElement4[formFieldKey] = {};

        this.state.formsFieldsData.formFields = Object.assign(
          this.state.formsFieldsData.formFields,
          {},
        );

        this.state.formsFieldsData.formFields[
          formFieldKey
        ].condition.conditionStatements[formFieldSelectedValue] = {
          subFormId: subFormId,
          subFormTemplate: subFormTemplate,
          subFormFields: subFormFields,
        };
      }
    } else if (
      formField.elementType.toLowerCase() == "checkbox" &&
      (formField.elementConfig.type.toLowerCase() == "multiselectt1" ||
        formField.elementConfig.type.toLowerCase() == "multiselectt2" ||
        formField.elementConfig.type.toLowerCase() == "multiselectt3" ||
        formField.elementConfig.type.toLowerCase() == "multiselectt4" ||
        formField.elementConfig.type.toLowerCase() == "multiselectt5")
    ) {
      //AddedOn: 13-12-2021
      this.state.formsFieldsData.formFields[formFieldKey].isConditional = true;
      this.state.formsFieldsData.formFields[
        formFieldKey
      ].condition.conditionType = "ValueBased";

      if (this.state.formsFieldsData.formFields.hasOwnProperty(formFieldKey)) {
        if (
          this.state.formsFieldsData.formFields[formFieldKey].condition
            .conditionStatements == undefined
        ) {
          console.log("-----------------------------------------------");

          let fieldElement4 = {};
          fieldElement4["conditionStatements"] = {};

          this.state.formsFieldsData.formFields[formFieldKey].condition =
            Object.assign(
              this.state.formsFieldsData.formFields[formFieldKey].condition,
              fieldElement4,
            );

          console.log(
            "----",
            this.state.formsFieldsData.formFields[formFieldKey],
          );

          this.state.formsFieldsData.formFields[
            formFieldKey
          ].condition.conditionStatements[formFieldSelectedValue] = {
            subFormId: subFormId,
            subFormTemplate: subFormTemplate,
            subFormFields: subFormFields,
          };
        } else {
          //Use This in case you want to Update Existing
          this.state.formsFieldsData.formFields[
            formFieldKey
          ].condition.conditionStatements[formFieldSelectedValue] = {
            subFormId: subFormId,
            subFormTemplate: subFormTemplate,
            subFormFields: subFormFields,
          };
        }
      } else {
        let fieldElement4 = {};
        fieldElement4[formFieldKey] = {};

        this.state.formsFieldsData.formFields = Object.assign(
          this.state.formsFieldsData.formFields,
          {},
        );

        this.state.formsFieldsData.formFields[
          formFieldKey
        ].condition.conditionStatements[formFieldSelectedValue] = {
          subFormId: subFormId,
          subFormTemplate: subFormTemplate,
          subFormFields: subFormFields,
        };
      }
    } else if (formField.elementType.toLowerCase() == "radio") {
      this.state.formsFieldsData.formFields[formFieldKey].isConditional = true;
      this.state.formsFieldsData.formFields[
        formFieldKey
      ].condition.conditionType = "ValueBased";

      this.state.formsFieldsData.formFields[
        formFieldKey
      ].condition.conditionStatements[formFieldSelectedValue] = {
        subFormId: subFormId,
        subFormTemplate: subFormTemplate,
        subFormFields: subFormFields,
      };
    } else if (formField.elementType.toLowerCase() == "datalist") {
      this.state.formsFieldsData.formFields[formFieldKey].isConditional = true;
      this.state.formsFieldsData.formFields[
        formFieldKey
      ].condition.conditionType = "ValueBased";

      this.state.formsFieldsData.formFields[
        formFieldKey
      ].condition.conditionStatements[formFieldSelectedValue] = {
        subFormId: subFormId,
        subFormTemplate: subFormTemplate,
        subFormFields: subFormFields,
      };
    } else {
      this.state.formsFieldsData.formFields[formFieldKey].isConditional = true;
      this.state.formsFieldsData.formFields[
        formFieldKey
      ].condition.conditionType = conditionType;

      this.state.formsFieldsData.formFields[formFieldKey].condition.subFormId =
        subFormId;
      this.state.formsFieldsData.formFields[
        formFieldKey
      ].condition.subFormTemplate = subFormTemplate;
      this.state.formsFieldsData.formFields[
        formFieldKey
      ].condition.subFormFields = subFormFields;
    }
    /*
    console.log(
      "onConditionalFormCreate",
      this.state.formsFieldsData.formFields[formFieldKey]
    );
    //formsFieldsData: this.props.formsFieldsData,
    */
    this.props.onDocFormInputFieldChangeHandler(this.state.formsFieldsData);
    this.setState({ subFormModalIsOpen: false });
  }

  onAddEditDocumentFormFieldsSubmit(formField) {
    //console.log("onAddEditDocumentFormFieldsSubmit", formField);
    /*
    var formFieldKey = Object.keys(formField).map(function (key) {
      //console.log("DesignDevelopDocForms"+props.formType, key);
      return key;
    });
    console.log("formsFieldsData_Pre", this.state.formsFieldsData);
    console.log("formField.elementUId", formField[formFieldKey].elementUId);
    console.log("this.state.formsFieldsData.formFields[formField.elementUId]", this.state.formsFieldsData.formFields[formFieldKey]);
    */
    this.state.formsFieldsData.formFields = Object.assign(
      this.state.formsFieldsData.formFields,
      formField,
    );
    //this.state.formsFieldsData.formFields[formField.elementUId]=formField
    //console.log("this.state.formsFieldsData.formFields[formField.elementUId]", this.state.formsFieldsData.formFields[formFieldKey]);
    //console.log("formsFieldsData_Post", this.state.formsFieldsData);
    this.setState({ editFormFieldModalIsOpen: false });
    this.props.onDocFormInputFieldChangeHandler(this.state.formsFieldsData);
  }

  render() {
    return (
      <>
        <Modal
          // transparent={false}
          // ariaHideApp={false}
          isOpen={this.state.editFormFieldModalIsOpen}
          onRequestClose={() =>
            this.setState({ editFormFieldModalIsOpen: false })
          }
          style={{
            overlay: {
              // border: "1px solid gray",
              // width: "45vw",
              width: "99vw",
              height: "100vh",
              // left: "27%",
              left: 0,
              top: "0%",
              // background: "",
              zIndex: "5",
            },
            content: {
              left: "20%",
              width: "69vw",
              // background: "transparent",
              // border: "none",
              // boxShadow:"0 0 5px black"
              zIndex: "4",
            },
          }}
        >
          <div className="row">
            <div className="col-6">
              <h5>Form fields to Edit</h5>
            </div>
            <div className="col-6" style={{ textAlign: "end" }}>
              <button
                className="btn btn-sm btn-danger"
                onClick={() =>
                  this.setState({ editFormFieldModalIsOpen: false })
                }
                style={{ cursor: "pointer" }}
              >
                <i className="fa fa-times"></i>
              </button>
            </div>
          </div>
          <div className="">
            <AddEditFormFields
              // onAddEditDocumentFormFieldsSubmit={(formField) =>
              //   onAddEditDocumentFormFieldsSubmit(formField)
              // }
              onAddEditDocumentFormFieldsSubmit={this.onAddEditDocumentFormFieldsSubmit.bind(
                this,
              )}
              action="edit"
              formFieldToEdit={this.state.formFieldToEdit}
            />
          </div>
        </Modal>

        <Modal
          transparent={false}
          ariaHideApp={false}
          isOpen={this.state.subFormModalIsOpen}
          // onRequestClose={() => this.setState({ subFormModalIsOpen: false })}
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
              zIndex: "5",
            },
            content: {
              left: "29%",
              width: "69vw",
              // background: "transparent",
              // border: "none",
              // boxShadow:"0 0 5px black"
              zIndex: "4",
            },
          }}
        >
          <div className="row">
            <div className="col-6">
              <h5>Add Condition</h5>
            </div>
            <div className="col-6" style={{ textAlign: "end" }}>
              <span
                className="pointer"
                onClick={() => this.setState({ subFormModalIsOpen: false })}
                style={{ cursor: "pointer" }}
              >
                <button className="btn-sm btn-danger mb-3">X</button>
              </span>
            </div>
          </div>
          <div className="row">
            <DesignDevelopDocForms
              formType="subform"
              mainDocumentFormField={this.state.conditionForSelectedFormField}
              formFieldkey={this.state.conditionForSelectedFormFieldKey}
              formFieldValue={this.state.conditionForSelectedFormFieldValue}
              onConditionalFormCreate={this.onConditionalFormCreate.bind(this)}
            />
          </div>
        </Modal>

        <Modal
          transparent={false}
          ariaHideApp={false}
          isOpen={this.state.multiChoiceConditionValueSelectModel}
          // onRequestClose={() =>
          //   this.setState({ multiChoiceConditionValueSelectModel: false })
          // }
          // style={{ zIndex: "2" }}
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
              zIndex: "5",
            },
            content: {
              left: "29%",
              width: "69vw",
              // background: "transparent",
              // border: "none",
              // boxShadow:"0 0 5px black"
              zIndex: "4",
            },
          }}
        >
          <div className="row">
            <div className="col-6">MultiChoice Condition</div>
            <div className="col-6" style={{ textAlign: "end" }}>
              <span
                className="pointer"
                onClick={() =>
                  this.setState({
                    multiChoiceConditionValueSelectModel: false,
                    valuesForMultiChoiceSelectCondition: [],
                  })
                }
                style={{ cursor: "pointer" }}
              >
                <button className="btn-sm btn-danger"><i className="fa fa-times"></i></button>
              </span>
            </div>
          </div>
          <div className="row">
            {/* Changed On 13-12-2021 */}
            <MultiChoiceValueConditionPopUp
              mainDocumentFormField={this.state.conditionForSelectedFormField}
              formFieldkey={this.state.conditionForSelectedFormFieldKey}
              onChoiceValueSelect={this.onChoiceValueSelect.bind(this)}
              valuesForMultiChoiceSelectCondition={
                this.state.valuesForMultiChoiceSelectCondition
              }
            />
          </div>
        </Modal>

        <div className="">
          <strong>
            <i>Form Fields</i>
          </strong>
        </div>
        {this.state.formsFieldsDataSorted.map((tempField) => (
          <div key={tempField.elementUId} className="">
            {RenderInputAsPerType(
              false,
              0,
              tempField,
              tempField.elementUId,
              false,
              function () {},
              this.editInputFormFieldsCondition.bind(this),
              this.addCondition.bind(this),
              this.removeCondition.bind(this),
              this.deleteThisInputFormField.bind(this),
              "",
              true,
              {},
            )}
          </div>
        ))}
        {/* <p> OldWay </p>
        {Object.keys(this.state.formsFieldsData.formFields).map((key) => (
          <FormGroup
            key={this.state.formsFieldsData.formFields[key].elementUId}
            className="row"
          >
            {RenderInputAsPerType(
              false,
              0,
              this.state.formsFieldsData.formFields[key],
              key,
              false,
              null,
              this.editInputFormFieldsCondition.bind(this),
              this.addCondition.bind(this),
              this.removeCondition.bind(this),
              this.deleteThisInputFormField.bind(this),
              ""
            )}
          </FormGroup>
        ))} */}
      </>
    );
  }
}

export default DocumentFormFields;
