import React, { useEffect, useState } from "react";
import userStore from "../zustand/userStore";
import { QRCodeCanvas } from "qrcode.react";
import Popup from "./caseDiary/Popup";
import { toast } from "react-toastify";

// jan 17
import { useNavigate } from "react-router-dom";
import { apiKeyHeader } from "../configs/ApiKeys";
import axios from "axios";

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
  const [profileData, setProfileData] = useState(null);
  const userData = userStore((state) => state.user);
  const navigate = useNavigate(); // jan 17

  useEffect(() => {
    const userPlanDetails = async () => {
      try {
        const response = await axios.post(
          "https://web1024.ipguide.net:5000/profile",
          {
            org_id: userData.org.id,
            user_id: userData.id,
          },
          {
            headers: apiKeyHeader(),
          }
        );
        setProfileData(response.data.data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    userPlanDetails();
  }, []);

  console.log("profileData", profileData);

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
  const [showMore, setShowMore] = useState(false);

  const handleToggle = () => {
    setShowMore(!showMore);
  };
  // const handlePlanSelection = async (plan) => {
  //   const payload = {
  //     User_id: userData.id,
  //     org_id: userData.org.id,
  //     order_id: plan.subscription_id,
  //     order_type: plan.subscription_plan,
  //   };
  //   // User_id: 310,
  //   // org_id: 310,
  //   // order_id: 310,
  //   // order_type: plan.subscription_plan,

  //   console.log("First API payload:", payload);

  //   try {
  //     const toastLoader = toast.success("Loading....", { autoClose: false });
  //     const response = await fetch(InitialTranscation, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(payload),
  //     });

  //     const result = await response.json();
  //     console.log("First API response:", result);

  //     if (response.ok) {
  //       const { transaction_id, orderId } = result;
  //       console.log("Order ID from first API:", orderId);
  //       const amount = 1;
  //       const secondApiUrl = `https://docmaster.in/payment/sample.php?transaction_id=${transaction_id}&amount=${amount}`;
  //       console.log("Second API URL:", secondApiUrl);
  //       const secondResponse = await fetch(secondApiUrl, {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       });

  //       const secondResult = await secondResponse.json();
  //       const outerData = JSON.parse(secondResult.response);
  //       const innerData = JSON.parse(outerData.data);
  //       console.log("Parsed data from second API:", innerData);

  //       const { refId } = innerData;
  //       console.log("RefId:", refId);

  //       const otherParams = "upi://pay?pa=docmaster@icici&pn=Abc";
  //       const endParams = "&cu=INR&mc=5411";
  //       const qrCodeUrl = `${otherParams}&tr=${refId}&am=${amount}${endParams}`;
  //       console.log("QR Code URL:", qrCodeUrl);

  //       setQrCodeUrl(qrCodeUrl);
  //       setTransactionId(transaction_id);
  //       setIsQrVisible(true);
  //       setTimeout(() => {
  //         setIsQrVisible(false);
  //       }, 300000);

  //       if (secondResponse.ok) {
  //         const thirdPayload = {
  //           orderId: orderId,
  //           refId: refId,
  //         };

  //         console.log("Third API payload:", thirdPayload);
  //         setPayload(thirdPayload);
  //         toast.dismiss(toastLoader);
  //       } else {
  //         console.error("Second API call failed:", secondResult);
  //         await toast.dismiss(toastLoader);
  //         toast.error("Second API call failed");
  //       }
  //     } else {
  //       console.error("First API call failed:", result.message);
  //       await toast.dismiss(toastLoader);
  //       toast.error("First API call failed", { autoClose: 3000 });
  //     }
  //   } catch (error) {
  //     console.error("Error during API calls:", error);
  //     toast.error("Error during API calls", { autoClose: 3000 });
  //   }
  // };

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
          className="navbar navbar-expand-lg navbar-light bg-white px-3 py-0"
          style={{
            position: "fixed",
            width: "100%",
            top: "0",
            background: "#FFF",
            zIndex: "9",
          }}
        >
          <div className="container-fluid">
            <a className="navbar-brand w-100 home-nav-sec ms-auto" href="/">
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
                <div className="row g-4">
                  {plans.map((plan) => (
                    <div
                      className="col-lg-3 col-md-6"
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
                              {plan.max_cases} Cases
                            </li>
                            <li className="text-16">
                              <i className="fa fa-check-circle text-success me-2"></i>
                              {plan.Problem_Info} Problem Info
                            </li>
                            <li className="text-16">
                              <i className="fa fa-check-circle text-success me-2"></i>
                              {plan.Researches} Case Researches
                            </li>
                            <li className="text-16">
                              <i className="fa fa-check-circle text-success me-2"></i>
                              {/* {plan.Events} */}
                              List Of Events
                            </li>
                            <li className="text-16">
                              <i className="fa fa-check-circle text-success me-2"></i>
                              {plan.Draftings} Drafting
                            </li>
                            <li className="text-16">
                              <i className="fa fa-check-circle text-success me-2"></i>
                              {plan.Judgement_Searches} Judgement Searches
                            </li>

                            <li className="text-16">
                              <i className="fa fa-check-circle text-success me-2"></i>
                              {plan.Online_Filings} Online Filings
                            </li>

                            {/* <li className="text-16">
                              <i className="fa fa-check-circle text-success me-2"></i>
                              {plan.Case_Hearing_Dairy} Case Hearing Diaries
                            </li> */}
                            <li className="text-16">
                              {/* <i className="fa fa-check-circle text-success me-2"></i> */}
                              {plan.Billings === 30 ? (
                                <i
                                  class="fa fa-times-circle text-danger me-2"
                                  aria-hidden="true"
                                ></i>
                              ) : (
                                <i className="fa fa-check-circle text-success me-2"></i>
                              )}
                              Billing and Payment
                            </li>
                            {/* <li className="text-16">
                              {plan.scheduler_On_What === 0 ? <i class="fa fa-times-circle text-danger me-2" aria-hidden="true"></i>: <i className="fa fa-check-circle text-success me-2"></i>}
                              Whatsapp Alerts 
                            
                              {plan.scheduler_On_What} Scheduler on Whatsapp
                            </li> */}
                            <li className="text-16">
                              <i className="fa fa-check-circle text-success me-2"></i>
                              360° Organiser
                            </li>
                            <li className="text-16">
                              {plan.scheduler_On_What === 0 ? (
                                <>
                                  <i
                                    className="fa fa-times-circle text-danger me-2"
                                    aria-hidden="true"
                                  ></i>
                                  Whatsapp Alerts
                                </>
                              ) : (
                                <>
                                  <i className="fa fa-check-circle text-success me-2"></i>
                                  {plan.scheduler_On_What} Whatsapp Alerts
                                </>
                              )}
                            </li>

                            {/* <li className="text-16">
                              <i className="fa fa-check-circle text-success me-2"></i>
                              {plan.Scheduler_On_Sms === 0 ? <i class="fa fa-times-circle text-danger me-2" aria-hidden="true"></i>: <i className="fa fa-check-circle text-success me-2"></i>}
                              {plan.Scheduler_On_Sms} Scheduler on SMS
                            </li> */}
                            <li className="text-16">
                              {plan.Scheduler_On_Sms === 0 ? (
                                <>
                                  <i
                                    className="fa fa-times-circle text-danger me-2"
                                    aria-hidden="true"
                                  ></i>
                                  SMS Alerts
                                </>
                              ) : (
                                <>
                                  <i className="fa fa-check-circle text-success me-2"></i>
                                  {plan.Scheduler_On_Sms} SMS Alerts
                                </>
                              )}
                            </li>
                            <li className="text-16">
                              {plan.Scheduler_On_Email === "0" ? (
                                <>
                                  <i
                                    className="fa fa-times-circle text-danger me-2"
                                    aria-hidden="true"
                                  ></i>
                                  Email Alerts
                                </>
                              ) : (
                                <>
                                  <i className="fa fa-check-circle text-success me-2"></i>
                                  Email Alerts
                                </>
                              )}
                            </li>

                            {/* <li className="text-16">
                              <i className="fa fa-check-circle text-success me-2"></i>
                              {plan.Scheduler_On_Email} Scheduler on Email
                            </li> */}
                            <li className="text-16">
                              <i className="fa fa-check-circle text-success me-2"></i>
                              {plan.Storage} GB Storage
                            </li>

                            <li className="text-16">
                              <i className="fa fa-check-circle text-success me-2"></i>
                              {plan.subscription_plan === "Free Trial"
                                ? plan.duration_days
                                : plan.duration_months}{" "}
                              {plan.subscription_plan === "Free Trial"
                                ? "Days"
                                : "Months"}{" "}
                              Validity
                            </li>
                          </ul>
                          {/* <a className="w-100" href="/payment"> */}
                          {/* <button
                            className="btn btn-primary w-100"
                            onClick={() => {
                              const localState = {
                                amount: `${plan.amount}`,
                                initial_payload: {
                                  User_id: userData.id,
                                  org_id: userData.org.id,
                                  order_id: plan.subscription_id,
                                  order_type: plan.subscription_plan,
                                },
                              }; // Example state
                              navigate("/payment", { state: localState }); // Pass state while navigating
                            }} */}
                          <button
                            className="btn btn-primary w-100"
                            onClick={() => {
                              if (plan.subscription_plan === "Trial") {
                                // Always navigate to signup for Trial
                                navigate("/signup");
                              } else if (
                                userData &&
                                Object.keys(userData).length > 0
                              ) {
                                // If logged in, go to Payment Page
                                const localState = {
                                  amount: `${plan.amount}`,
                                  initial_payload: {
                                    User_id: userData.id,
                                    org_id: userData.org.id,
                                    order_id: plan.subscription_id,
                                    order_type: plan.subscription_plan,
                                  },
                                };
                                navigate("/payment", { state: localState });
                              } else {
                                // If not logged in, go to Register Page
                                navigate("/signup");
                              }
                            }}
                          >
                            {plan.subscription_plan === "Trial"
                              ? "Register Now"
                              : "Buy Now"}
                          </button>
                          {/* <button
                            className="btn btn-primary w-100"
                            onClick={() => {
                              if (
                                !userData ||
                                Object.keys(userData).length === 0
                              ) {
                                // User is not logged in, navigate to signup page
                                navigate("/signup");
                              } else {
                                // User is logged in
                                if (
                                  plan.subscription_plan ===
                                  profileData.userOrder.subscriptionPlan
                                ) {
                                  alert(
                                    "You are currently subscribed to this plan."
                                  );
                                } else {
                                  const localState = {
                                    amount: `${plan.amount}`,
                                    initial_payload: {
                                      User_id: userData.id,
                                      org_id: userData.org.id,
                                      order_id: plan.subscription_id,
                                      order_type: plan.subscription_plan,
                                    },
                                  };
                                  navigate("/payment", { state: localState });
                                }
                              }
                            }}
                          >
                            {plan.subscription_plan === "Trial"
                              ? "Register Now"
                              : "Buy Now"}
                          </button> */}

                          {/* </a> */}
                        </div>
                      </div>
                    </div>
                  ))}
                   <div className="col-lg-3 col-md-6">
      <div className="card h-100 shadow-sm">
        <div className="card-header bg-primary text-white text-center">
          <h3 className="card-title text-center text-white">
            <b>Custom Plan</b>
          </h3>
          <h2 className="text-white"></h2>
        </div>
        <div className="card-body d-flex flex-column align-items-center justify-content-center">
          <div className="text-container">
            <h5 style={{ textAlign: 'center' }}>
              We are pleased to offer customized plans tailored specifically to meet the unique needs of students, law firms, and organizations handling a large volume of business. Our plans are designed with flexibility, efficiency, and precision in mind, ensuring that you receive solutions perfectly aligned with your goals.
              {!showMore && (
                <a href="#" onClick={handleToggle} style={{ color: 'blue' }}> click here to view more</a>
              )}
            </h5>
            {showMore && (
              <h5 style={{ textAlign: 'center' }}>
                Whether you're a student seeking streamlined tools for academic excellence, a law firm requiring comprehensive legal support, or an organization managing extensive operations, we have the right plan for you. Let us help you simplify complexities and achieve excellence.
                <a href="#" onClick={handleToggle} style={{ color: 'blue' }}> click here to view less</a>
              </h5>
            )}
          </div>
          <button className="btn btn-primary w-100 mt-2">Buy Now</button>
        </div>
      </div>
    </div>
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
                        {/* qr related  */}
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
        <footer className="bg-footer text-dark pt-3 w-100">
          <div className="container-fluid">
            <div className="row px-5">
              <div className="col-12">
                <p className="mb-1 text-center mobile-hide">
                  DocMaster, A 75 Sector 63, Noida - 201301, Uttar Pradesh,
                  India, +91 9289-44-0048, info@docmaster.in
                </p>
                <p className="mb-1 text-center mobile-show">
                  DocMaster, A 75 Sector 63, Noida - 201301,<br></br> +91
                  9289-44-0048, info@docmaster.in
                </p>
              </div>

              <div className="col-md-12 px-0  text-center mobile-hide">
                <nav class="footer-nav justify-content-center">
                  <a href="/Disclaimer" class="text-dark mx-1" target="_blank">
                    Disclaimer
                  </a>
                  |
                  <a
                    href="/Terms_and_Conditions"
                    class="text-dark mx-1"
                    target="_blank"
                  >
                    Terms & Conditions
                  </a>
                  |
                  <a
                    href="/Privacy_Policy"
                    class="text-dark mx-1"
                    target="_blank"
                  >
                    Privacy Policy
                  </a>
                  |
                  <a
                    href="/ipr_copyrights"
                    class="text-dark mx-1"
                    target="_blank"
                  >
                    IPR &amp; Copyright
                  </a>
                  |
                  <a href="/Pricing" class="text-dark mx-1">
                    Pricing Plan
                  </a>
                  |
                  <a
                    class="text-dark mx-1"
                    href="/Cancellation_Policy"
                    target="_blank"
                  >
                    Cancellation & Refund Policy
                  </a>
                  |
                  <a href="home#aboutus" class="text-dark mx-1">
                    About Us
                  </a>
                  |
                  <a href="home#faq" class="text-dark mx-1">
                    FAQs
                  </a>
                  |
                  <a href="home#contactus" class="text-dark mx-1">
                    Write to Us
                  </a>
                  <div class="separator mx-1 my-0 p-0">|</div>
                  <a
                    href="https://wa.me/9289440046"
                    target="_blank"
                    class="footer-link mx-1"
                    rel="noreferrer"
                  >
                    {/* <i className="fa fa-phone-square"></i> */}
                    <img src="images/WApp_icon.png" width={20} />
                  </a>
                  <a
                    href="https://www.facebook.com/docmasterin/"
                    target="_blank"
                    class="footer-link mx-1"
                    rel="noreferrer"
                  >
                    {/* <i className="fa fa-facebook-square"></i> */}
                    <img src="images/fb.png" width={16} />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/the-docmaster/?originalSubdomain=in"
                    target="_blank"
                    class="footer-link mx-1"
                    rel="noreferrer"
                  >
                    {/* <i className="fa fa-linkedin-square"></i> */}
                    <img src="images/li.png" width={16} />
                  </a>
                  <a
                    href="https://www.instagram.com/docmaster_in/"
                    target="_blank"
                    class="footer-link mx-1"
                    rel="noreferrer"
                  >
                    <img src="images/Instagram.png" width={16} />
                  </a>
                  <a href="#" target="_blank" class="footer-link mx-1">
                    <img src="images/twitter.png" width={16} />
                  </a>
                </nav>
              </div>
              <div className="mobile-show">
                <div className="row mx-auto px-2 ">
                  <div className="col-5">
                    <a
                      href="/Disclaimer"
                      class="text-dark mx-1"
                      target="_blank"
                    >
                      Disclaimer
                    </a>
                  </div>
                  <div className="col-7">
                    <a
                      href="/Terms_and_Conditions"
                      class="text-dark mx-1"
                      target="_blank"
                    >
                      Terms & Conditions
                    </a>
                  </div>
                  <div className="col-5">
                    <a
                      href="/Privacy_Policy"
                      class="text-dark mx-1"
                      target="_blank"
                    >
                      Privacy Policy
                    </a>
                  </div>
                  <div className="col-7">
                    <a href="/Pricing" class="text-dark mx-1">
                      Pricing Plan
                    </a>
                  </div>
                  <div className="col-5">
                    <a
                      href="/ipr_copyrights"
                      class="text-dark mx-1"
                      target="_blank"
                    >
                      IPR &amp; Copyright
                    </a>
                  </div>

                  <div className="col-7">
                    <a
                      class="text-dark mx-1"
                      href="/Cancellation_Policy"
                      target="_blank"
                    >
                      Cancellation & Refund Policy
                    </a>
                  </div>
                  <div className="col-5">
                    <a href="home#aboutus" class="text-dark mx-1">
                      About Us
                    </a>
                  </div>
                  <div className="col-7">
                    <a href="home#faq" class="text-dark mx-1">
                      FAQs
                    </a>
                    |
                    <a href="home#contactus" class="text-dark mx-1">
                      Write to Us
                    </a>
                  </div>
                  <div className="col-12 text-center">
                    <a
                      href="https://wa.me/9289440046"
                      target="_blank"
                      class="footer-link mx-1"
                      rel="noreferrer"
                    >
                      {/* <i className="fa fa-phone-square"></i> */}
                      <img src="images/WApp_icon.png" width={20} />
                    </a>
                    <a
                      href="https://www.facebook.com/docmasterin/"
                      target="_blank"
                      class="footer-link mx-1"
                      rel="noreferrer"
                    >
                      {/* <i className="fa fa-facebook-square"></i> */}
                      <img src="images/fb.png" width={16} />
                    </a>
                    <a
                      href="https://www.linkedin.com/company/the-docmaster/?originalSubdomain=in"
                      target="_blank"
                      class="footer-link mx-1"
                      rel="noreferrer"
                    >
                      {/* <i className="fa fa-linkedin-square"></i> */}
                      <img src="images/li.png" width={16} />
                    </a>
                    <a
                      href="https://www.instagram.com/docmaster_in/"
                      target="_blank"
                      class="footer-link mx-1"
                      rel="noreferrer"
                    >
                      <img src="images/Instagram.png" width={16} />
                    </a>
                    <a href="#" target="_blank" class="footer-link mx-1">
                      <img src="images/twitter.png" width={16} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default PricingPage;
