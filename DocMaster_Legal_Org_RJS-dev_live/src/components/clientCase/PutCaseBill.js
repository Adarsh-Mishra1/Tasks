import React, { useState, useRef, useEffect } from "react";
import { Form, FormGroup, Label, Input, Col } from "reactstrap";
import axios from "axios";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import userStore from "../../zustand/userStore";
import { WsPutCaseBillNew } from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";

const PutCaseBill = (props) => {
  const userData = userStore((state) => state.user);
  const [isAppearancePayment, setIsAppearancePayment] = useState(false);
  const [appearanceDate, setAppearanceDate] = useState("");
  const [isOtherPaymentType, setIsOtherPaymentType] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [isOtherRemark, setIsOtherRemark] = useState(false); // State to handle "Others" remark
  const [customRemark, setCustomRemark] = useState("");
  let titleRef = useRef();
  let typeRef = useRef();
  let amountRef = useRef();
  let detailRef = useRef();
  let dateTimeRef = useRef();
  const remarksRef = useRef(null); // Ref for the dropdown
  const customRemarksRef = useRef(null); // Ref for the custom remark input
  let paymentTypeRef = useRef();
  let receiversNameRef = useRef();
  let paymentModeRef = useRef();
  let customPaymentRef = useRef();

  const [type, setType] = useState();
  const formatDate = (date) => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };
  const chargeableTitles = [
    "Notice",
    "Hearing",
    "Out of Pocket Expenses",
    "Travelling & Conveyance",
    "Typing, Printing & Photocopying",
    "Stamping & Court Fees",
    "On Account",
    "Monthly Retainership",
    "Others",
  ];
  const receivedTitles = [
    "Issuing of Notice",
    "Hearing",
    "Out of Pocket Expenses",
    "Travelling & Conveyance",
    "Typing, Printing & Photocopying",
    "Stamping & Court Fees",
    "On Account",
    "Monthly Retainership",
    "Others",
  ];

  useEffect(
    function () {
      setType(props?.caseBill?.type);
    },
    [props?.caseBill?.type]
  );

  const submitCaseBill = async (e) => {
    e.preventDefault();
  
    try {
      // Fetch user statistics to check case bills total and current billings
      const response = await fetch(
        `https://web1024.ipguide.net:8443/dm_leorg_new1/userStatistics/${userData.org.id}`,
        { headers: apiKeyHeader() }
      );
      const data = await response.json();

      // Assuming the API response contains both case_bills_total and current billings
      const caseBillsTotal = data.resultMessage[0]?.case_bills_total; // Default to 0 if null
      const billings = data.resultMessage[0]?.billings ?? 0; // Default to 0 if null

      console.log("Total allowed bills:", caseBillsTotal);
      console.log("Current number of bills:", billings);

      // Check if the current billings exceed or equal the limit
      // if ( billings  !== 0 &&  billings <= caseBillsTotal) {
      //   alert("You have exceeded the maximum number of case bills.");
      //   return; // Exit the function if the limit is exceeded
      // }

      // Your existing validations
      if (
        typeRef.current.value == null ||
        typeRef.current.value == undefined ||
        typeRef.current.value.length <= 2
      ) {
        alert("Select Nature of Transaction");
      } else if (
        dateTimeRef.current.value == null ||
        dateTimeRef.current.value == undefined ||
        dateTimeRef.current.value.length < 2
      ) {
        alert("Provide a Valid Date Time");
      } else if (
        (typeRef?.current?.value === "receive" ||
          props?.caseBill?.type === "receive") &&
        (paymentTypeRef.current?.value == null ||
          paymentTypeRef.current?.value == undefined ||
          paymentTypeRef.current?.value.length <= 2) &&
        type === "receive"
      ) {
        alert("Select Payment Purpose");
      } else if (
        (typeRef?.current?.value === "receive" ||
          props?.caseBill?.type === "receive") &&
        (receiversNameRef?.current?.value == null ||
          receiversNameRef?.current?.value == undefined ||
          receiversNameRef?.current?.value?.length < 2) &&
        type === "receive"
      ) {
        alert("Enter Payers Name");
      } else if (
        (typeRef?.current?.value === "receive" ||
          props?.caseBill?.type === "receive") &&
        (paymentModeRef?.current?.value == null ||
          paymentModeRef?.current?.value == undefined ||
          paymentModeRef?.current?.value?.length < 2) &&
        type === "receive"
      ) {
        alert("Enter Payment Mode");
      } else {
        putCaseBill(); // Submit case bill only if all validations pass
      }
    } catch (error) {
      console.error("Error fetching case bills data:", error);
      alert("Failed to fetch case bills data. Please try again.");
    }
  };
  

  function putCaseBill() {
    // console.log("Dropdown Value:", paymentTypeRef.current.value); // Log dropdown value
    // console.log("Custom Payment Value:", customPaymentRef.current.value);
    axios
      .post(
        WsPutCaseBillNew,
        JSON.stringify({
          id: props.caseBill?.id != undefined ? props.caseBill?.id : null,
          // title: titleRef.current.value,
          type: typeRef.current.value,
          amount: amountRef.current.value,
          dateTime: dateTimeRef.current.value + " 00:00:00",
          caseId: props.clientCase.id,
          detail:
            detailRef.current?.value.length > 0
              ? detailRef.current.value
              : null,
          userId: userData.id,
          // remarks: type === "receive" ? remarksRef?.current?.value || "" : null,
          remarks: type === "receive"
          ? (
              remarksRef?.current?.value === "others" 
                ? customRemarksRef?.current?.value || "" 
                : remarksRef?.current?.value || ""
            )
          : null,
          paymentType: paymentTypeRef?.current?.value || "",
          // paymentType:
          //   type === "receive"
          //     ? paymentTypeRef.current.value == "others"
          //       ? customPaymentRef.current.value
          //       : paymentTypeRef.current.value
          //     : null,
          // paymentTypeRef.current.value == "others"
          //   ? customPaymentRef.current.value
          //   : paymentTypeRef.current.value,
          modeOfPayment:
            type === "receive" ? paymentModeRef?.current?.value || "" : null,
          name:
            type === "receive" ? receiversNameRef?.current?.value || "" : null,
        }),
        {
          headers: apiKeyHeader(),
        }
      )
      .then((response) => {
        const responseData = response.data;
        console.log("putCaseBill_responseData", responseData);
        if (responseData.resultCode === 1) {
          props.onPutCaseBill(true);
        } else {
          toast.error(responseData.resultMessage, {
            position: "top-center",
            autoClose: 1800,
          });
          props.onPutCaseBill(false);
        }
      })
      .catch((error) => {
        console.error("putCaseBill_error", error);
      });
  }

  return (
    <Form onSubmit={submitCaseBill}>
      {/* Nature of Transaction */}
      <FormGroup row>
        <Label for="type" sm={2}>
          Nature of Transaction
        </Label>
        <Col sm={10}>
          <Input
            type="select"
            id="type"
            aria-describedby="type"
            innerRef={typeRef}
            onChange={(e) => {
              setType(e.target.value); // Dynamically set the type
            }}
            defaultValue={props?.caseBill?.type ? props?.caseBill?.type : ""}
            required
          >
            <option value="">Select Nature of Transaction</option>
            <option value="paid">Amount Chargeable</option>
            <option value="receive">Amount Received</option>
          </Input>
        </Col>
      </FormGroup>

      {/* Render the rest of the form only if a "type" is selected */}
      {type && (
        <>
          {/* Purpose of Payment */}
          <FormGroup row>
            <Label htmlFor="paymentType" sm={2}>
              {/* {type === "paid" ? "Purpose of Payment" : "Purpose of Invoice"} */}
              Payment Purpose
            </Label>
            <Col sm={10}>
              <Input
                type="select"
                className="form-control"
                id="paymentType"
                name="paymentType"
                innerRef={paymentTypeRef}
                defaultValue={props?.caseBill?.paymentType || ""}
                onChange={(e) => {
                  const selectedPaymentType = e.target.value;
                  setIsOtherPaymentType(selectedPaymentType === "others");
                  setIsAppearancePayment(
                    selectedPaymentType.startsWith("payment of appearance")
                  );
                }}
              >
                <option value="">
                  {/* {type === "paid" ? "Select Payment Purpose" : "Select Invoice Purpose"} */}
                  Select Payment Purpose
                </option>
                {/* Dynamic options */}
                {type === "paid" && (
                  <>
                    <option value="issuing notice">
                      Fees on Account of Issuing Notice
                    </option>
                    <option value="out of pocket expenses">
                      Payment of Out of Pocket Expenses
                    </option>
                    <option value="traveling expenses">
                      Payment of Travelling Expenses
                    </option>
                    <option
                      value={`payment of appearance on ${formatDate(
                        appearanceDate
                      )}`}
                    >
                      {`Payment of Appearance ${
                        appearanceDate ? `on ${formatDate(appearanceDate)}` : ""
                      }`}
                    </option>
                    <option value="Payment for drafting a suit/ complaint">
                      Payment for Drafting a Suit/Complaint
                    </option>
                    <option value="Payment for filing a suit/ complaint">
                      Payment for Filing a Suit/Complaint
                    </option>
                    <option value="others">Others</option>
                  </>
                )}
                {type === "receive" && (
                  <>
                    <option value="issuing notice">
                      Fees on Account of Issuing Notice
                    </option>
                    <option value="out of pocket expenses">
                      Payment of Out of Pocket Expenses
                    </option>
                    <option value="traveling expenses">
                      Payment of Travelling Expenses
                    </option>
                    <option
                      value={`payment of appearance on ${formatDate(
                        appearanceDate
                      )}`}
                    >
                      {`Payment of Appearance ${
                        appearanceDate ? `on ${formatDate(appearanceDate)}` : ""
                      }`}
                    </option>
                    <option value="Payment for drafting a suit/ complaint">
                      Payment for Drafting a Suit/Complaint
                    </option>
                    <option value="Payment for filing a suit/ complaint">
                      Payment for Filing a Suit/Complaint
                    </option>
                    <option value="others">Others</option>
                  </>
                )}
              </Input>

              {/* Conditional Fields */}
              {isAppearancePayment && (
                <Input
                  type="date"
                  className="form-control mt-2"
                  id="appearanceDate"
                  name="appearanceDate"
                  onChange={(e) => setAppearanceDate(e.target.value)}
                />
              )}
              {isOtherPaymentType && (
                <Input
                  type="text"
                  className="form-control mt-2"
                  id="otherPaymentType"
                  name="otherPaymentType"
                  placeholder="Enter Custom Payment Purpose"
                  innerRef={customPaymentRef}
                  required
                />
              )}
            </Col>
          </FormGroup>

          {/* Additional fields based on "type" */}
          {type === "receive" && (
            <>
              {/* Mode of Payment Dropdown */}
              <FormGroup row>
                <Label htmlFor="paymentMode" sm={2}>
                  Mode of Payment
                </Label>
                <Col sm={10}>
                  <Input
                    type="select"
                    className="form-control"
                    id="paymentMode"
                    name="paymentMode"
                    innerRef={paymentModeRef}
                    defaultValue={props?.caseBill?.modeOfPayment || ""}
                  >
                    <option value="">Select Payment Mode</option>
                    <option value="online transfer">Account Transfer</option>
                    <option value="upi">UPI</option>
                    <option value="cash">Cash</option>
                    <option value="cheque">Cheque</option>
                    <option value="credit card">Credit/Debit Card</option>
                  </Input>
                </Col>
              </FormGroup>

              {/* Remarks Dropdown */}
              <FormGroup row>
                <Label htmlFor="remarksDropdown" sm={2}>
                  Remarks
                </Label>
                <Col sm={10}>
                  <Input
                    type="select"
                    id="remarksDropdown"
                    name="remarksDropdown"
                    className="form-control"
                    innerRef={remarksRef}
                    value={remarks} // Set value to remarks state
                    onChange={(e) => {
                      const selectedRemark = e.target.value;
                      if (selectedRemark === "Others") {
                        setRemarks(""); // Clear the remarks if 'Others' is selected
                      } else {
                        setRemarks(selectedRemark); // Set selected remark in state
                      }
                    }}
                  >
                    <option value="">Select Remark</option>
                    <option value="All dues to be cleared within 15 days">
                      All dues to be cleared within 15 days
                    </option>
                    <option value="All dues to be cleared within 30 days">
                      All dues to be cleared within 30 days
                    </option>
                    <option value="others">Others</option>
                    <option value="">None</option>
                  </Input>
                </Col>
              </FormGroup>

              {/* Show Custom Remark Input only if 'Others' is selected */}
              {remarks === "others" && (
                <FormGroup row>
                  <Label htmlFor="customRemark" sm={2}>
                    Custom Remark
                  </Label>
                  <Col sm={10}>
                    <Input
                      type="text"
                      id="customRemark"
                      name="customRemark"
                      className="form-control"
                      innerRef={customRemarksRef}
                      placeholder="Enter your custom remark"
                      value={customRemark} // Bind the custom remark input to its state
                      onChange={(e) => setCustomRemark(e.target.value)} // Update customRemark state
                      minLength={3}
                      maxLength={256}
                    />
                  </Col>
                </FormGroup>
              )}
            </>
          )}

          {/* Show an input field if 'Others' is selected */}

          {type === "paid" && (
            <FormGroup row>
              <Label htmlFor="detail" sm={2}>
                Details
              </Label>
              <Col sm={10}>
                <Input
                  type="textarea"
                  className="form-control"
                  id="detail"
                  name="detail"
                  innerRef={detailRef}
                  defaultValue={props?.caseBill?.detail || ""}
                  minLength={3}
                  maxLength={256}
                />
              </Col>
            </FormGroup>
          )}

          {/* Common Fields */}
          <FormGroup row>
            <Col sm={10}>
              <Input
                type="hidden"
                id="receiveName"
                name="receiveName"
                innerRef={receiversNameRef}
                defaultValue={
                  props?.caseBill?.name
                    ? props?.caseBill?.name
                    : props.selectedClient.name
                }
              />
            </Col>
          </FormGroup>

          <FormGroup row>
            <Label htmlFor="amount" sm={2}>
              Amount
            </Label>
            <Col sm={10}>
              <Input
                type="number"
                className="form-control"
                id="amount"
                name="amount"
                innerRef={amountRef}
                defaultValue={props?.caseBill?.amount || ""}
                min={1}
                max={256000000}
                required
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label htmlFor="dateTime" sm={2}>
              Date
            </Label>
            <Col sm={10}>
              <Input
                type="date"
                className="form-control"
                id="dateTime"
                name="dateTime"
                innerRef={dateTimeRef}
                defaultValue={props?.caseBill?.dateTime?.split(" ")[0] || ""}
                required
              />
            </Col>
          </FormGroup>

          <div className="text-end">
            <button className="btn btn-primary m-0" type="submit">
              Submit
            </button>
          </div>
        </>
      )}
    </Form>
  );
};

export default PutCaseBill;
