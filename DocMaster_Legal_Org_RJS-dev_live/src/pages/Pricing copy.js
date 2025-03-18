import React, { useEffect, useState } from "react";
import userStore from "../zustand/userStore";
import { QRCodeCanvas } from "qrcode.react";
import Popup from "./caseDiary/Popup";
import { toast } from "react-toastify";

const GetSubscriptionPlans =
  "https://web1024.ipguide.net:5000/payment/get-subscription-plans";
const InitialTranscation =
  "https://web1024.ipguide.net:5000/payment/intialtransaction";

function PricingPage({ navBar = true }) {
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [isQrVisible, setIsQrVisible] = useState(false);
  const [isQrVisibles, setIsQrVisibles] = useState(false);
  const [timer, setTimer] = useState(300);
  const [transactionId, setTransactionId] = useState(null);
  const [payload, setPayload] = useState(null);
  const [plans, setPlan] = useState([]);
  const userData = userStore((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(GetSubscriptionPlans);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("New Payload", data);
        setPlan(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let interval;
    if (isQrVisible && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsQrVisible(false);
    }

    return () => clearInterval(interval);
  }, [isQrVisible, timer]);

  const handlePaySelection = async () => {
    setIsQrVisibles(true);
  };

  const handlePlanSelection = async (plan) => {
    const payload = {
      User_id: userData.id,
      org_id: userData.org.id,
      order_id: plan.subscription_id,
      order_type: plan.subscription_plan,
      // User_id: 310,
      // org_id: 310,
      // order_id: 310,
      // order_type: plan.subscription_plan,
    };

    console.log("First API payload:", payload);

    try {
      const toastLoader = toast.success("Loading....", { autoClose: false });
      const response = await fetch(InitialTranscation, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log("First API response:", result);

      if (response.ok) {
        const { transaction_id, orderId } = result;
        console.log("Order ID from first API:", orderId);
        const amount = 1;
        const secondApiUrl = `https://docmaster.in/payment/sample.php?transaction_id=${transaction_id}&amount=${amount}`;
        console.log("Second API URL:", secondApiUrl);
        const secondResponse = await fetch(secondApiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const secondResult = await secondResponse.json();
        const outerData = JSON.parse(secondResult.response);
        const innerData = JSON.parse(outerData.data);
        console.log("Parsed data from second API:", innerData);

        const { refId } = innerData;
        console.log("RefId:", refId);

        const otherParams = "upi://pay?pa=docmaster@icici&pn=Abc";
        const endParams = "&cu=INR&mc=5411";
        const qrCodeUrl = `${otherParams}&tr=${refId}&am=${amount}${endParams}`;
        console.log("QR Code URL:", qrCodeUrl);

        setQrCodeUrl(qrCodeUrl);
        setTransactionId(transaction_id);
        setIsQrVisible(true);
        setTimeout(() => {
          setIsQrVisible(false);
        }, 300000);

        if (secondResponse.ok) {
          const thirdPayload = {
            orderId: orderId,
            refId: refId,
          };

          console.log("Third API payload:", thirdPayload);
          setPayload(thirdPayload);
          toast.dismiss(toastLoader);
        } else {
          console.error("Second API call failed:", secondResult);
          await toast.dismiss(toastLoader);
          toast.error("Second API call failed");
        }
      } else {
        console.error("First API call failed:", result.message);
        await toast.dismiss(toastLoader);
        toast.error("First API call failed", { autoClose: 3000 });
      }
    } catch (error) {
      console.error("Error during API calls:", error);
      toast.error("Error during API calls", { autoClose: 3000 });
    }
  };

  const transactionStatus = async (transactionId, thirdPayload) => {
    try {
      const toastLoader = toast.success("Loading....", { autoClose: false });
      const response = await fetch(
        "https://web1024.ipguide.net:5000/payment/transaction-status",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ transaction_id: transactionId }),
        }
      );
      toast.dismiss(toastLoader);
      if (response.ok) {
        const data = await response.json();
        console.log("Transaction Status:", data);
        const outerData = JSON.parse(data.data);
        console.log("Outer Data", outerData);

        // if (outerData.status === "PENDING") {
        //   console.log("Status:", outerData.status === "PENDING");
        //   toast.error("Payment is pending", { autoClose: 3000 });
        // }
        // if (outerData.status === "SUCCESS") {
        //   const toastLoader = toast.success("Loading....", {
        //     autoClose: false,
        //   });
        //   const thirdResponse = await fetch(
        //     "https://web1024.ipguide.net:5000/payment/updateRefId",
        //     {
        //       method: "PUT",
        //       headers: {
        //         "Content-Type": "application/json",
        //       },
        //       body: JSON.stringify(thirdPayload),
        //     }
        //   );
        //   toast.dismiss(toastLoader);
        //   const thirdResult = await thirdResponse.json();
        //   console.log("Third API response:", thirdResult);
        //   toast.success("Payment is SUCCESS");
        //   toast.dismiss(toastLoader);
        //   setIsQrVisible(false);
        // }
        if (outerData.status === "PENDING" || outerData.status === "SUCCESS") {
          const toastLoader =
            outerData.status === "SUCCESS"
              ? toast.success("Loading....", { autoClose: false })
              : null;
          const orderStatus = outerData.status === "PENDING" ? 3 : 2;
          const payload = {
            ...thirdPayload,
            order_status: orderStatus,
          };

          const thirdResponse = await fetch(
            "https://web1024.ipguide.net:5000/payment/updateRefId",
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            }
          );

          const thirdResult = await thirdResponse.json();
          console.log("Third API response:", thirdResult);
          if (outerData.status === "PENDING") {
            toast.error("Payment is pending", { autoClose: 3000 });
          } else if (outerData.status === "SUCCESS") {
            toast.dismiss(toastLoader);
            toast.success("Payment is SUCCESS");
            setIsQrVisible(false);
          }
        }
      } else {
        console.error("API call failed:", response.status);
        toast.error("Failed to fetch transaction status", { autoClose: 3000 });
      }
    } catch (error) {
      console.error("Error occurred while calling the API:", error);
      toast.error("Error occurred while calling the API", { autoClose: 3000 });
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };
  return (
    <div className="" style={{ height: "100vh", overflowY: "auto" }}>
      {navBar && (
        <nav
          className="navbar navbar-expand-lg navbar-light bg-white px-4 py-0"
          style={{
            position: "fixed",
            width: "100%",
            top: "0",
            background: "#FFF",
            zIndex: "9",
          }}
        >
          <div className="container-fluid">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse justify-content-start text-center"
              id="navbarNav"
            >
              <ul className="navbar-nav ps-0">
                <li className="nav-item">
                  <a className="nav-link" href="/">
                    Home
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/home#aboutus">
                    About Us
                  </a>
                </li>
                {/* <li className="nav-item">
                  <a className="nav-link" href="/home#feedback">
                    Feedback
                  </a>
                </li> */}
                {/* <li className="nav-item">
                  <a className="nav-link" href="/home#pricing">
                    Pricing
                  </a>
                </li> */}
                <li className="nav-item">
                  <a className="nav-link" href="/home#">
                    Career
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/home#contactus">
                    Contact Us
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/home#faq">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <a className="navbar-brand ms-auto" href="/">
              <img
                src="images/logo/docmaster.png"
                alt="Logo"
                className="logo img-fluid"
              />
            </a>
          </div>
        </nav>
      )}
      <div className="container-fluid mt-4">
        <div className="row">
          <div className="col-md-12">
            <section
              id="pricing-section"
              className="pricing-section py-3"
              style={{ background: "#f7f7f7" }}
            >
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-12">
                    <h1 className="bg-primary text-30 p-3 text-white">
                      Pricing Plan
                    </h1>
                  </div>
                </div>
                <div className="row mt-3 g-4">
                  {plans.map((plan) => (
                    <div
                      className="col-lg-4 col-md-6"
                      key={plan.subscription_id}
                    >
                      <div className="card h-100 shadow-sm">
                        <div className="card-header bg-primary text-white text-center">
                          <h3 className="card-title text-center text-white">
                            <b>{plan.subscription_plan}</b>
                          </h3>
                          <h2 className="text-white">₹{plan.amount}</h2>
                        </div>
                        <div className="card-body d-flex flex-column align-items-center justify-content-center">
                          <ul className="list-unstyled">
                            {/* {plan.planList.map((feature, index) => (
                              <li key={index} className="text-16">
                                <i className="fa fa-check-circle text-success me-2"></i>
                                {feature}
                              </li>
                            ))} */}
                            <li className="text-16">
                              <i className="fa fa-check-circle text-success me-2"></i>
                              {plan.user_limit}{" "}
                              {plan.user_limit === "1" ? "User" : "Users"}
                            </li>
                            <li className="text-16">
                              <i className="fa fa-check-circle text-success me-2"></i>
                              {plan.max_cases} Max Cases
                            </li>
                            <li className="text-16">
                              <i className="fa fa-check-circle text-success me-2"></i>
                              {plan.Storage} MB Storage
                            </li>
                            <li className="text-16">
                              <i className="fa fa-check-circle text-success me-2"></i>
                              {plan.Problem_Info} Problem Info Cases
                            </li>
                            <li className="text-16">
                              <i className="fa fa-check-circle text-success me-2"></i>
                              {plan.Researches} Researches
                            </li>
                            <li className="text-16">
                              <i className="fa fa-check-circle text-success me-2"></i>
                              {plan.Online_Filings} Online Filings
                            </li>
                            <li className="text-16">
                              <i className="fa fa-check-circle text-success me-2"></i>
                              {plan.Case_Hearing_Dairy} Case Hearing Dairies
                            </li>
                            <li className="text-16">
                              <i className="fa fa-check-circle text-success me-2"></i>
                              {plan.scheduler_On_What} Scheduler on Whatsapp
                            </li>
                            <li className="text-16">
                              <i className="fa fa-check-circle text-success me-2"></i>
                              {plan.Scheduler_On_Sms} Scheduler on SMS
                            </li>
                            <li className="text-16">
                              <i className="fa fa-check-circle text-success me-2"></i>
                              {plan.Scheduler_On_Email} Scheduler on Email
                            </li>
                            <li className="text-16">
                              <i className="fa fa-check-circle text-success me-2"></i>
                              {plan.Judgement_Searches} Judgement Searches
                            </li>
                            <li className="text-16">
                              <i className="fa fa-check-circle text-success me-2"></i>
                              {plan.Billings} Billings
                            </li>
                            <li className="text-16">
                              <i className="fa fa-check-circle text-success me-2"></i>
                              {plan.Events} Events
                            </li>
                            <li className="text-16">
                              <i className="fa fa-check-circle text-success me-2"></i>
                              {plan.Draftings} Draftings
                            </li>
                            <li className="text-16">
                              <i className="fa fa-check-circle text-success me-2"></i>
                              {plan.duration_months} Months Duration
                            </li>
                          </ul>
                          <a className="w-100" href="/payment"><button
                            className="btn btn-primary w-100"
                            // onClick={() => handlePlanSelection(plan)}
                          >
                            Select {plan.subscription_plan} Plan
                          </button></a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {isQrVisible && qrCodeUrl && (
                  <Popup
                    title="Payment Details"
                    onClose={() => setIsQrVisible(false)}
                    minHeight="450px"
                    maxWidth="600px"
                    children={
                      <div
                        style={{
                          textAlign: "center",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <div className="pb-5">
                          <div className="w-100 p-3 mt-2 ">
                            <table
                              className="w-100 rounded mb-0 px-4 table table-striped table-hover"
                              border={1}
                            >
                              <tr>
                                <td
                                  rowspan="3"
                                  style={{ border: "1px solid #ddd" }}
                                  className="text-start p-2 w-25"
                                >
                                  <label className="d-flex align-content-center text-black text-16">
                                    {/* <input
                                      type="radio"
                                      name="option"
                                      value="option1"
                                      checked={selectedOption === "option1"}
                                      onChange={handleOptionChange}
                                    /> */}
                                    &nbsp; QR Code
                                  </label>
                                </td>
                                <td
                                  style={{ border: "1px solid #ddd" }}
                                  className="text-start p-2"
                                >
                                  Amount
                                </td>
                                <td
                                  style={{ border: "1px solid #ddd" }}
                                  className="text-end p-2"
                                >
                                  5000
                                </td>
                                <td
                                  rowSpan="3"
                                  style={{ border: "1px solid #ddd" }}
                                >
                                  <button
                                    className="btn m-0 btn-primary btn-sm"
                                    onClick={() => handlePaySelection()}
                                  >
                                    Pay now
                                  </button>
                                </td>
                              </tr>
                              <tr>
                                <td
                                  style={{ border: "1px solid #ddd" }}
                                  className="text-start p-2"
                                >
                                  Charges
                                </td>
                                <td
                                  style={{ border: "1px solid #ddd" }}
                                  className="text-end p-2"
                                >
                                  0
                                </td>
                              </tr>
                              <tr>
                                <td
                                  style={{ border: "1px solid #ddd" }}
                                  className="text-start p-2"
                                >
                                  Total
                                </td>
                                <td
                                  style={{ border: "1px solid #ddd" }}
                                  className="text-end p-2"
                                >
                                  5000
                                </td>
                              </tr>
                              <tr>
                                <td
                                  rowSpan="3"
                                  style={{ border: "1px solid #ddd" }}
                                  className="text-start p-2 w-25"
                                >
                                  <label className="d-flex align-content-center text-black text-16">
                                    {/* <input
                                      type="radio"
                                      name="option"
                                      value="option3"
                                      checked={selectedOption === "option3"}
                                      onChange={handleOptionChange}
                                    /> */}
                                    &nbsp; Credit Card
                                  </label>
                                </td>
                                <td
                                  style={{ border: "1px solid #ddd" }}
                                  className="text-start p-2"
                                >
                                  Amount
                                </td>
                                <td
                                  style={{ border: "1px solid #ddd" }}
                                  className="text-end p-2"
                                >
                                  5000
                                </td>
                                <td
                                  rowSpan="3"
                                  style={{ border: "1px solid #ddd" }}
                                >
                                  <button className="btn m-0 btn-primary btn-sm">
                                    Pay now
                                  </button>
                                </td>
                              </tr>
                              <tr>
                                <td
                                  style={{ border: "1px solid #ddd" }}
                                  className="text-start p-2"
                                >
                                  Charges
                                </td>
                                <td
                                  style={{ border: "1px solid #ddd" }}
                                  className="text-end p-2"
                                >
                                  100
                                </td>
                              </tr>
                              <tr>
                                <td
                                  style={{ border: "1px solid #ddd" }}
                                  className="text-start p-2"
                                >
                                  Total
                                </td>
                                <td
                                  style={{ border: "1px solid #ddd" }}
                                  className="text-end p-2"
                                >
                                  5100
                                </td>
                              </tr>
                              <tr>
                                <td
                                  rowSpan="3"
                                  style={{ border: "1px solid #ddd" }}
                                  className="text-start p-2 w-25"
                                >
                                  <label className="d-flex align-content-center text-black text-16">
                                    {/*<input
                                      type="radio"
                                      name="option"
                                      value="option2"
                                      checked={selectedOption === "option2"}
                                      onChange={handleOptionChange}
                                    /> */}
                                    &nbsp; Debit Card
                                  </label>
                                </td>
                                <td
                                  style={{ border: "1px solid #ddd" }}
                                  className="text-start p-2"
                                >
                                  Amount
                                </td>
                                <td
                                  style={{ border: "1px solid #ddd" }}
                                  className="text-end p-2"
                                >
                                  5000
                                </td>
                                <td
                                  rowSpan="3"
                                  style={{ border: "1px solid #ddd" }}
                                >
                                  <button className="btn m-0 btn-primary btn-sm">
                                    Pay now
                                  </button>
                                </td>
                              </tr>
                              <tr>
                                <td
                                  style={{ border: "1px solid #ddd" }}
                                  className="text-start p-2"
                                >
                                  Charges
                                </td>
                                <td
                                  style={{ border: "1px solid #ddd" }}
                                  className="text-end p-2"
                                >
                                  50
                                </td>
                              </tr>
                              <tr>
                                <td
                                  style={{ border: "1px solid #ddd" }}
                                  className="text-start p-2"
                                >
                                  Total
                                </td>
                                <td
                                  style={{ border: "1px solid #ddd" }}
                                  className="text-end p-2"
                                >
                                  5050
                                </td>
                              </tr>
                            </table>
                          </div>

                          {/* Conditional rendering of divs */}
                          {selectedOption === "option1" && (
                            <div style={{ padding: "10px" }}>
                              <QRCodeCanvas
                                value={qrCodeUrl}
                                size={150}
                                style={{
                                  border: "2px solid blue",
                                  padding: "10px",
                                  borderRadius: "10px",
                                  marginBottom: "40px",
                                  marginTop: "20px",
                                }}
                              />
                              <p>
                                QR Code will disappear in {formatTime(timer)}
                              </p>
                              <p>Transaction ID: {transactionId}</p>
                              {/* <button
                                onClick={() =>
                                  transactionStatus(transactionId, payload)
                                }
                                style={{
                                  marginTop: "20px",
                                  padding: "10px 20px",
                                  backgroundColor: "#4CAF50",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "5px",
                                  cursor: "pointer",
                                }}
                              >
                                click me if payment completed
                              </button> */}
                            </div>
                          )}
                          {selectedOption === "option2" && (
                            <div style={{ marginTop: "20px" }}>
                              <div className="mx-4 rounded">
                                <div className="w-100 text-center">
                                  <button className="btn m-0 btn-primary btn-sm">
                                    Pay now
                                  </button>
                                </div>
                                {/* <button
                                  onClick={() =>
                                    transactionStatus(transactionId, payload)
                                  }
                                  style={{
                                    marginTop: "20px",
                                    padding: "10px 20px",
                                    backgroundColor: "#4CAF50",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                  }}
                                >
                                  click me if payment completed
                                </button> */}
                              </div>
                            </div>
                          )}
                          {selectedOption === "option3" && (
                            <div style={{ marginTop: "20px" }}>
                              <div className="mx-4 rounded">
                                <div className="w-100 text-center">
                                  <button className="btn m-0 btn-primary btn-sm">
                                    Pay now
                                  </button>
                                </div>
                                {/* <button
                                  onClick={() =>
                                    transactionStatus(transactionId, payload)
                                  }
                                  style={{
                                    marginTop: "20px",
                                    padding: "10px 20px",
                                    backgroundColor: "#4CAF50",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                  }}
                                >
                                  click me if payment completed
                                </button> */}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    }
                  />
                )}
                {isQrVisibles && qrCodeUrl && (
                  <Popup
                    title="QR Payment"
                    onClose={() => setIsQrVisibles(false)}
                    height="350px"
                    maxWidth="400px"
                    children={
                      <div
                        style={{
                          textAlign: "center",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <div className="pb-5">
                          <div style={{ padding: "10px" }}>
                            <QRCodeCanvas
                              value={qrCodeUrl}
                              size={150}
                              style={{
                                border: "2px solid blue",
                                padding: "10px",
                                borderRadius: "10px",
                                marginBottom: "40px",
                                marginTop: "20px",
                              }}
                            />
                            <p>QR Code will disappear in {formatTime(timer)}</p>
                            <p>Transaction ID: {transactionId}</p>
                            {/* <button
                              onClick={() =>
                                transactionStatus(transactionId, payload)
                              }
                              style={{
                                marginTop: "20px",
                                padding: "10px 20px",
                                backgroundColor: "#4CAF50",
                                color: "white",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                              }}
                            >
                              click me if payment completed
                            </button> */}
                          </div>
                        </div>
                      </div>
                    }
                  />
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
      {navBar && (
        <footer className="bg-footer text-dark pt-3">
          <div className="container-fluid">
            <div className="row px-5">
              <div className="col-12">
                <p className="mb-1 text-center">
                  Docmaster, A 75 Sector 63, Noida - 201301,
                  Uttar Pradesh, India, +91 9289-44-0048, info@docmaster.in
                </p>
              </div>
              <div className="col-12">
                <p className="mb-1 text-center">
                  <span className="mx-1">
                    <a
                      href="/Terms_and_Conditions"
                      className="text-dark"
                      target="_blank"
                    >
                      Terms & Conditions
                    </a>
                  </span>
                  |
                  <span className="mx-1">
                    <a href="/Disclaimer" className="text-dark" target="_blank">
                      Disclaimer
                    </a>
                  </span>
                  |
                  <span className="mx-1">
                    <a
                      href="/Cancellation_Policy"
                      className="text-dark"
                      target="_blank"
                    >
                      Cancellation Policy
                    </a>
                  </span>
                  |
                  <span className="mx-1">
                    <a
                      href="/ipr_copyrights"
                      className="text-dark"
                      target="_blank"
                    >
                      IPR & Copyright
                    </a>
                  </span>
                  |<span> All rights reserved © Docmaster </span>|
                  <a
                    href="https://wa.me/9289440046"
                    target="_blank"
                    class="footer-link mx-1"
                  >
                    <img src="images/WApp_icon.png" width={18} />
                  </a>
                  <a
                    href="https://www.facebook.com/docmasterin/"
                    target="_blank"
                    class="footer-link mx-1"
                  >
                    <img src="images/fb.png" width={16} />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/the-docmaster/?originalSubdomain=in"
                    target="_blank"
                    class="footer-link mx-1"
                  >
                    <img src="images/li.png" width={16} />
                  </a>
                  <a
                    href="https://www.instagram.com/docmaster_in/"
                    target="_blank"
                    class="footer-link mx-1"
                  >
                    <img src="images/Instagram.png" width={16} />
                  </a>
                  <a href="#" target="_blank" class="footer-link mx-1">
                    <img src="images/twitter.png" width={16} />
                  </a>
                </p>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default PricingPage;
