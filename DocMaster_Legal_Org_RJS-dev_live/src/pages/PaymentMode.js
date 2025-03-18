import React, { useEffect, useState } from "react";
import userStore from "../zustand/userStore";
import { QRCodeCanvas } from "qrcode.react";
import Popup from "./caseDiary/Popup";

// jan 17
import { useNavigate } from "react-router-dom";

const GetSubscriptionPlans =
  "https://web1024.ipguide.net:5000/payment/get-subscription-plans";
const InitialTranscation =
  "https://web1024.ipguide.net:5000/payment/intialtransaction";

function PaymentMode({ navBar = true }) {
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [isQrVisible, setIsQrVisible] = useState(false);
  const [isQrVisibles, setIsQrVisibles] = useState(false);
  const [timer, setTimer] = useState(300);
  const [transactionId, setTransactionId] = useState(null);
  const [payload, setPayload] = useState(null);
  const [plans, setPlan] = useState([]);
  const userData = userStore((state) => state.user);
  const navigate = useNavigate(); // jan 17

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
      <div className="d-flex flex-column justify-content-between h-100">
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
                  <li className="nav-item">
                    <a className="nav-link" href="/home#pricing">
                      Pricing
                    </a>
                  </li>
                  {/* <li className="nav-item">
                    <a className="nav-link" href="/home#">
                      Career
                    </a>
                  </li> */}
                  <li className="nav-item">
                    <a className="nav-link" href="/home#contactus">
                      Write to Us
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
              <section id="pricing-section" className="pricing-section py-3">
                <div className="payment bg-white  ">
                  <div className="container-fluid py-5  box-inner-1 bg-white">
                    <div className="row radiobtn">
                      <div className="col-md-3"></div>
                      <div className="col-md-3">
                        <input type="radio" name="box" id="one" />
                        <label
                          for="one"
                          class="box py-2 first"
                          onClick={() => handlePaySelection()} style={{
                            boxShadow: 'rgba(0, 0, 0, 0.2) 0px 8px 16px',
                            background: 'rgb(11 33 117) url(images/RazorPay.png) no-repeat left center / contain',
                            borderRadius: '10px',
                            minHeight: '200px',
                            height: '200px',
                            // borderColor:'#fff',
                            borderWidth:'3px',
                            color:"#fff"
                             }}
                        >
                          <div class="d-flex align-items-start justify-content-between text-end h-100">
                            <span class="circle" style={{width:"16px",height:'15px'}}></span>
                            <div class="course d-flex flex-column justify-content-between h-100">
                              <div class="text-end mb-2">
                                <span class="fw-bold"> </span>
                                <span class="fas fa-dollar-sign">
                                  ₹ 5000.00
                                </span>
                              </div>
                              <div className="d-flex   w-100 justify-content-between">
                              <div className="w-50 d-flex align-items-end"></div>
                                <div className="w-50 d-flex align-items-end">
                                    <div className="w-100 align-items-end">
                                        <div class="d-flex w-100 my-2 align-items-end justify-content-between">
                                            <span>Charges</span>
                                            <span>00.00</span>
                                        </div>

                                        <div class="d-flex w-100 my-2 align-items-end justify-content-between">
                                            <span>
                                                <b>Total:</b>
                                            </span>
                                            <span>
                                                <b>₹ 5000.00</b>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </label>
                      </div>
                      <div className="col-md-3">
                        <input type="radio" name="box" id="three" />
                        <label
                          for="three"
                          class="box py-2 third" style={{
                            boxShadow: 'rgba(0, 0, 0, 0.2) 0px 8px 16px',
                            background: 'rgb(227, 82, 15) url(images/icici-bank.png) no-repeat left center / contain',
                            borderRadius: '10px',
                            minHeight: '200px',
                            height: '200px',
                            borderWidth:"3px",
                            color:'#fff'
                        }}
                          // onClick={() => handlePayUpiSelection()} 
                        >
                          <div class="d-flex align-items-start justify-content-between text-end h-100">
                            <span class="circle" style={{width:"16px",height:'15px'}}></span>
                            <div class="course d-flex flex-column justify-content-between h-100">
                              <div class="text-end mb-2">
                                <span class="fw-bold"> </span>
                                <span class="fas fa-dollar-sign">
                                  ₹ 5000.00
                                </span>
                              </div>
                              <div className="d-flex   w-100 justify-content-between">
                              <div className="w-50 d-flex align-items-end"></div>
                                <div className="w-50 d-flex align-items-end">
                                    <div className="w-100 align-items-end">
                                        <div class="d-flex w-100  align-items-end justify-content-between">
                                            <span>Charges</span>
                                            <span>00.00</span>
                                        </div>

                                        <div class="d-flex w-100 my-2 align-items-end justify-content-between">
                                            <span>
                                                <b>Total:</b>
                                            </span>
                                            <span>
                                                <b>₹ 5000.00</b>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </label>
                      </div>
                      <div className="col-md-2"></div>
                    </div>
                    <div className="row py-5 my-4">
                        <div className="col-md-12 my-3 text-center">
                                <button className="btn btn-outline-primary">Pay Now</button>
                        </div>
                    </div>
                  </div>
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
                    DocMaster, A 75 Sector 63, Noida - 201301,
                    Uttar Pradesh, India, +91 9289-44-0048, info@docmaster.in
                  </p>
                </div>
                <div className="col-12">
                  <p className="mb-1 text-center">
                    <nav class="footer-nav text-center justify-content-center">
                        <a href="/Disclaimer" class="text-dark mx-2">
                          Disclaimer
                        </a>
                        |
                        <a href="/Terms_and_Conditions" class="text-dark mx-2">
                          Terms & Conditions
                        </a>
                        |
                        <a href="/Privacy_Policy" class="text-dark mx-2">
                          Privacy Policy
                        </a>
                        |
                        <a
                          href="/ipr_copyrights"
                          class="text-dark mx-2"
                          target="_blank"
                        >
                          IPR &amp; Copyright
                        </a>
                        |
                        <a href="/Pricing" class="text-dark mx-2">
                          Pricing Plan
                        </a>
                        |
                        <a class="text-dark mx-2" href="/Cancellation_Policy">
                          Cancellation & Refund Policy
                        </a>
                        |
                        <a href="home#faq" class="text-dark mx-2">
                          FAQs
                        </a>
                        |
                        <a href="home#contactus" class="text-dark mx-2">
                          Write to Us
                        </a>
                        <span class="separator mx-1 my-0 p-0">|</span>
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
                          <img src="images/fb.png" width={20} />
                        </a>
                        <a
                          href="https://www.linkedin.com/company/the-docmaster/?originalSubdomain=in"
                          target="_blank"
                          class="footer-link mx-1"
                          rel="noreferrer"
                        >
                          {/* <i className="fa fa-linkedin-square"></i> */}
                          <img src="images/li.png" width={20} />
                        </a>
                        <a
                          href="https://www.instagram.com/docmaster_in/"
                          target="_blank"
                          class="footer-link mx-1"
                          rel="noreferrer"
                        >
                          <img src="images/Instagram.png" width={20} />
                        </a>
                        <a href="#" target="_blank" class="footer-link mx-1">
                          <img src="images/twitter.png" width="16" />
                        </a>
                      </nav>
                  </p>
                </div>
              </div>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}

export default PaymentMode;
