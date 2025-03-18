import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import ReactToPrint from "react-to-print";
import userStore from "../../zustand/userStore";
import { digitAmountToWord } from "../../OtherFunctions/TemplateRenderingFunctions";
import axios from "axios";
import { apiKeyHeader } from "../../configs/ApiKeys";

const CaseBillGenerate = (props) => {
  const [bankData, setBankData] = useState({});
  const { selectedClient } = props;
  console.log("Selected Client:", selectedClient);
  console.log("Selected Client Email:", selectedClient?.clientEmail);
  const userData = userStore((state) => state.user);
  const componentToPrintRef = useRef(null);
  const location = useLocation();
  console.log(userData);
  console.log();
  const cCase = location?.state?.clientCase;
  const client = cCase?.client;
  console.log(props.caseBill.dateTime);
  console.log(props.caseBill);
  console.log("_location_", cCase);
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "https://web1024.ipguide.net:5000/profile",
          JSON.stringify({
            org_id: userData.org.id,
            user_id: userData.id,
          }),
          {
            headers: apiKeyHeader(),
          }
        );
        console.log("B0ankdata", response.data.data);
        setBankData(response.data.data || {});
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        // setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="row">
      <div className="col-md-12 d-flex justify-content-between">
        <ReactToPrint
          documentTitle="LeOrgDocMaster_Print"
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
              <button className="no_print btn btn-outline-primary mb-3">
                <i className="fa fa-print" aria-hidden="true"></i> Print
              </button>
            );
          }}
          // documentTitle="LeOrgDocMaster_Print"
          // trigger={() => {
          //   return (
          //     <button>
          //       <i className="fa fa-print" aria-hidden="true"></i> Print
          //     </button>
          //   );
          // }}
          content={() => componentToPrintRef.current}
        />
        <button
          className="btn btn-sm btn-outline-danger align-content-end"
          onClick={props.onCloseClik}
        >
          <i
            className="fa fa-times"
            title="Close"
            style={{ fontSize: "18px" }}
            aria-hidden="true"
          />
        </button>
      </div>
      <div
        ref={componentToPrintRef}
        className="col-12"
        style={{ color: "#000" }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            fontWeight: "bold",
            marginBottom: "10px",
          }}
        >
          <img src="images/advocate.png" width={80} />
          {/* <h2>
            {props.caseBill.type === "paid" ? "Memorandum of Fees" : "Receipt of Payment"}
          </h2> */}
          <h5 className="mb-0">{userData.org.name.toUpperCase()}</h5>
          <h5 className="mb-0">{userData.org.address}</h5>
          <h6 className="mobile-hide">
            Email: {userData.email_id} Tel: {userData.mobile_no}
          </h6>
          <h6 className="mobile-show">
            Email: {userData.email_id} <br></br>Tel: {userData.mobile_no}
          </h6>
          {/* <hr /> */}
          <h4 className="pt-2 mb-3 text-b">
            <b>
              {" "}
              {props.caseBill.type === "paid" ? "INVOICE" : "Payment Receipt"}
            </b>
          </h4>
        </div>

        {/* Bill Info */}

        <br />

        {/* Table */}
        {props.caseBill.type === "paid" ? (
          <div className="mx-3">
            <div>
              <div>
                {/* Bill No: 01/24 <br /> */}
                <p className="text-16 mb-0">
                  Date. {formatDate(props.caseBill.dateTime)}
                </p>

                <p className="text-16 mb-0">Mr. / Ms. {selectedClient?.name}</p>
                <p className="text-16 mb-0">{selectedClient?.address}</p>
                {/* <p className="mb-3 text-16">
                  {selectedClient?.clientEmail} & {selectedClient?.mobileNo}
                </p> */}
              </div>
            </div>
            <table className="table table-borderless" >
              <thead>
                <tr>
                  <th style={{ width: "4%" }}>S. No.</th>
                  <th style={{ width: "60%" }}>Particulars</th>
                  <th style={{ width: "20%", textAlign: "right" }}>
                    Amount(₹)
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ textAlign: "right" }}>1</td>
                  <td>
                    {props.caseBill.title}
                    {props.caseBill.title !== null ? "," : ""}
                    {props.caseBill.detail}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {/* {formatter.format(props.caseBill.amount)} */}
                    {props.caseBill.amount}.00
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td>
                    <strong>Total</strong>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <strong>
                      {/* {formatter.format(props.caseBill.amount)} */}
                      {props.caseBill.amount}.00
                    </strong>
                  </td>
                </tr>
              </tbody>
            </table>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              Total Amount Payable is Rupees&nbsp;
              <span>
                {digitAmountToWord(
                  (Math.round(props.caseBill.amount * 100) / 100).toFixed(2)
                )}
                .
              </span>
            </div>

            {/* Footer */}
            <div className="mt-2" style={{ textAlign: "left" }}>
              {/* PAN No.: XXXXXXXXX <br />
            BANK: XXXXXXX <br />
            Branch: XXXXXXX <br />
            Account No.: XXXXXXX <br />
            IFSC Code: XXXXXXX <br /> */}
              {/* <strong>For {props.caseBill.name}</strong> */}
              <p>For {userData.org.name}</p>
              <div className="mt-4 mb-4">
                <p className="text-16 mb-0">Note:</p>
                <p className="text-16 mb-0">Errors and Omissions Exempted</p>
                <p className="text-16 mb-4">
                  All dues to be cleared within 15 days from the date of invoice{" "}
                </p>

                <p className="text-16 mb-0">Send Payment To.</p>
                <div className="send-payment-to"
                  style={{
                    display: "flex",
                    gap: "5px",
                  }}
                >
                  <p className="text-16 mb-0"  style={{
                  margin:"0px"
                  }}>
                    Account Number.
                    <span>
                      {bankData?.bankDetails?.accountNumber?.replace(
                        /\d{4}(?=\d)/g,
                        "$& "
                      )}
                    </span>
                  </p>|
                  <p className="text-16 mb-0" style={{
                  margin:"0px"
                  }}>
                    IFSC Code:
                    <span>
                      {bankData?.bankDetails?.ifscCode?.replace(
                        /\d{4}(?=\d)/g,
                        "$& "
                      )}
                    </span>
                  </p>|
                  <p className="text-16 mb-0" style={{
                  margin:"0px"
                  }}>
                    Bank Name.<span>{bankData?.bankDetails?.bankName}</span>
                  </p>
                </div>
                <p className="text-16 mb-0">
                  Account Holder's Name.
                  <span>{bankData?.bankDetails?.BankHolderName}</span>
                </p>
                <p className="text-16 mb-0">
                  PAN Number.<span>{bankData?.bankDetails?.PanNumber}</span>
                </p>
                <p className="text-16 mb-0">
                  UPI ID.<span></span>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-3">
            <p className="text-16 mb-0">{selectedClient?.name}</p>
            <p className="text-16 mb-0">{selectedClient?.address}</p>
            <p
              className="mb-4 text-16"
              style={{ borderBottom: "1px solid #000" }}
            >
              {selectedClient?.clientEmail} & {selectedClient?.mobileNo}
            </p>

            <p className="text-16">
              Received with thanks a sum of rupees{" "}
              <b>
                {digitAmountToWord(
                  (Math.round(props.caseBill.amount * 100) / 100).toFixed(2)
                )}{" "}
                ({formatter.format(props.caseBill.amount)})
              </b>{" "}
              from {selectedClient?.name} through {props.caseBill.modeOfPayment}{" "}
              towards {props.caseBill.paymentType.toLowerCase()} <br /> <br />
              {/* {props.caseBill.remarks && (
                <>Remarks - {props.caseBill.remarks}</>
              )} */}
              <br />
              <br />
            </p>
            <p className="text-16">For {userData.org.name}</p>
            <p className="text-16">
              Dated. {formatDate(props.caseBill.dateTime)}
            </p>
          </div>
        )}

        {/* Amount in Words */}
      </div>
    </div>
  );
};

export default CaseBillGenerate;
