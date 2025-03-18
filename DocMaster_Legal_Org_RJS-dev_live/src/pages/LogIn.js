// LogIn.js
import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { apiKeyHeader } from "../configs/ApiKeys";
import { WSLogIn } from "../configs/WebService";

import userStore from "../zustand/userStore";
import Footer from "../components/Footer";
import CardContents from "./cardcontent";
const LogIn = () => {
  const { userData, setUser } = userStore((state) => ({
    userData: state.user,
    setUser: state.setUser,
  }));

  let navigate = useNavigate();
  const userNameRef = useRef();
  const userPasswordRef = useRef();
  const [errorMsg, setErrorMsg] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const submitLogInForm = (e) => {
    e.preventDefault();

    if (rememberMe) {
      localStorage.setItem("username", username);
      localStorage.setItem("rememberMe", rememberMe);
    } else {
      localStorage.removeItem("username");
      localStorage.removeItem("rememberMe");
    }

    // Proceed with login logic (authentication)
    console.log("Username:", username);
    console.log("Password:", password);

    console.log("submitLogInForm_userName", userNameRef.current.value);
    console.log("submitLogInForm_userPassword", userPasswordRef.current.value);

    if (userPasswordRef.current.value.length < 5) {
      showModalWithMessage("Check Password!");
    } else {
      orgUserLoginProcess();
    }
  };

  useEffect(() => {
    document.title = "LogIn";
    if (Object.keys(userData).length === 0) {
      // User not logged in
    } else {
      if (userData.isLoggedIn) {
        window.location.href = "/";
      }
    }
  }, []);

  // function orgUserLoginProcess() {
  //   axios
  //     .post(
  //       WSLogIn,
  //       JSON.stringify({
  //         userid: userNameRef.current.value,
  //         password: userPasswordRef.current.value,
  //         orgTypeCode: "leorg",
  //       }),
  //       {
  //         headers: apiKeyHeader(),
  //       }
  //     )
  //     .then((response) => {
  //       const responseData = response.data;
  //       if (responseData.resultCode === 1) {
  //         const createdOn = new Date(responseData.resultMessage.org.expireOn);
  //         const currentDate = new Date();
  //         const differenceInMilliseconds = createdOn-currentDate ;
  //         const differenceInDays = Math.floor(
  //           differenceInMilliseconds / (1000 * 60 * 60 * 24)
  //         );
  //         console.log(differenceInDays,currentDate,createdOn);

  //         if (differenceInDays <= 7) {
  //           const userData = responseData.resultMessage;
  //           userData.isLoggedIn = true;
  //           setUser(userData);
  //           navigate("/");
  //           showModalWithMessage(`You are logged in as a trial user for 7 days. Your demo expires in ${7 - differenceInDays} day(s). Please subscribe for continuation of services.`);
  //         } else {
  //           showModalWithMessage("Your 7 days trial has expired on 18/08/2024. To access your account, please complete your payment. Contact docmaster.in for further info.");
  //         }
  //       } else {
  //         showModalWithMessage(responseData.resultMessage);
  //         setErrorMsg(responseData.resultMessage);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("OrgUserLogIn_error", error);
  //       showModalWithMessage("Error while processing");
  //       setErrorMsg("Error while processing");
  //     });
  // }

  function orgUserLoginProcess() {
    axios
      .post(
        WSLogIn,
        JSON.stringify({
          userid: userNameRef.current.value,
          password: userPasswordRef.current.value,
          orgTypeCode: "leorg",
        }),
        {
          headers: apiKeyHeader(),
        }
      )
      .then((response) => {
        const responseData = response.data;

        // Handle email or mobile verification
        if (
          responseData.resultCode === 0 &&
          responseData.resultMessage ===
            "User not verified Please provide correct Email and OTP"
        ) {
          window.alert(
            "The email is not verified. Please provide the correct Email and OTP."
          );
          window.location.href = "/VerifyEmailotp";
          return;
        }

        if (
          responseData.resultCode === 0 &&
          responseData.resultMessage === "User mobile number is not verified"
        ) {
          window.alert("User mobile number is not verified.");
          window.location.href = "/mobileotp";
          return;
        }

        // Handle valid login
        if (responseData.resultCode === 1) {
          const expiredOn = new Date(responseData.resultMessage.org.expireOn);
          const currentDate = new Date();
          const differenceInMilliseconds = expiredOn - currentDate;
          const differenceInDays = Math.floor(
            differenceInMilliseconds / (1000 * 60 * 60 * 24)
          );
          console.log(expiredOn);
          const ExDate = `${String(expiredOn.getDate()).padStart(
            2,
            "0"
          )}/${String(expiredOn.getMonth() + 1).padStart(
            2,
            "0"
          )}/${expiredOn.getFullYear()}`;
          console.log(ExDate);

          // Check if the trial period (15 days) has not expired
          if (differenceInDays <= 45 && differenceInDays > 0) {
            const userData = responseData.resultMessage;
            userData.isLoggedIn = true;
            setUser(userData);
            navigate(`/?Exdate=${ExDate}`);
          } else {
            // Check if the expiration date has passed
            if (differenceInDays <= 0) {
              showModalWithMessage(
                `Your demo has expired, Please subscribe for continuation of services.`
              );
            } else {
              // Grant access if not expired, regardless of year
              const userData = responseData.resultMessage;
              userData.isLoggedIn = true;
              setUser(userData);
              navigate("/");
            }
          }
        } else {
          // Handle error message when login fails
          if (responseData.resultMessage === "Organisation Access Expired") {
            showModalWithMessage(
              `Your 45-day trial has expired. To access your account, please complete your payment. Contact docmaster.in for further info.`
            );
          } else {
            showModalWithMessage(responseData.resultMessage);
          }
          setErrorMsg(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("OrgUserLogIn_error", error);
        setErrorMsg("Error while processing");
      });
  }

  function showModalWithMessage(message, callback = null) {
    setModalMessage(message);
    setShowModal(true);

    // Make sure to attach this closeHandler to the modal's close button or event
  }

  function handleCloseModal() {
    setShowModal(false);
    navigate("/");
  }
  const [currentIndex, setCurrentIndex] = useState(1);
  const totalSlides = 4;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex % totalSlides) + 1);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // State to track password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Load saved credentials from localStorage when the component mounts
  useEffect(() => {
    const savedUsername =
      localStorage.getItem("rememberMe") === "true"
        ? localStorage.getItem("username")
        : "";
    setUsername(savedUsername);
    setRememberMe(savedUsername !== ""); // Check if the user has saved login
  }, []);

  return (
    <>
      <div
        className="d-flex align-items-start justify-content-between flex-column w-100"
        style={{ height: "100vh", overflowY: "auto" }}
      >
        <div className="d-flex align-content-start w-100">
          <nav className="navbar navbar-expand-lg navbar-light bg-white py-0 w-100">
            <div className="container-fluid">
              {/* <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button> */}
              
               
              <a className="navbar-brand ms-auto home-nav-sec" href="/">
                <img
                  src="images/logo/docmaster.png"
                  alt="Logo"
                  className="logo img-fluid"
                />
              </a>
            </div>
          </nav>
        </div>
        <div class="row mx-0 w-100 mobile-show">
          <div class="col-12">
            <h3 class="text-center mt-0 mb-0 text-blue fw-bold  page-tit">
              {/* All in One Case Management Software For Lawyers */}
              All in One Solution for Advocates
            </h3>
          </div>
        </div>
        <div className="d-flex align-content-center w-100">
          <div className="login mb-3" style={{ width: "100%" }}>
            <div className="container-fluid  bg-white login ">
              {/* <div className="row">
                <div className=" col-md-1 col-lg-1"></div>
                <div className="col-md-7  col-xs-12">
                  
                </div>
              </div> */}
              <div className="row mx-4  align-items-center  ">
                <div className="col-md-12   order-lg-3 col-lg-3 mx-auto">
                  <div className="text-center  ">
                    <h3 className="text-blue sign-in-title my-0"> Sign In</h3>
                  </div>

                  <div
                    className="card card-custom-login p-2 py-2"
                    style={{ maxWidth: "300px" }}
                  >
                    <form onSubmit={submitLogInForm}>
                      <div className="form-group pt-3 mb-3">
                        <div className="input-group">
                          <span className="input-group-text">
                            <img
                              src="images/icons/5.png"
                              alt="User Icon"
                              style={{ width: "20px", height: "auto" }}
                            />
                          </span>
                          <input
                            type="text"
                            className="form-control form-control-lg"
                            placeholder="Enter email id / Phone"
                            name="username"
                            id="username"
                            value={username}
                            ref={userNameRef}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group mb-3">
                        <div className="input-group">
                          <span className="input-group-text">
                            <img
                              src="images/icons/7.png"
                              alt="Password Icon"
                              style={{ width: "20px", height: "auto" }}
                            />
                          </span>
                          <input
                            type={showPassword ? "text" : "password"}
                            className="form-control form-control-lg"
                            placeholder="Password"
                            name="userPassword"
                            id="userPassword"
                            value={password}
                            ref={userPasswordRef}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />

                          <span
                            className="input-group-text"
                            id="togglePassword"
                            onClick={togglePasswordVisibility}
                          >
                            {showPassword ? (
                              <i class="fa fa-eye-slash" aria-hidden="true"></i>
                            ) : (
                              <i
                                class="fa fa-eye"
                                aria-hidden="true"
                                fontSize="20px"
                              ></i>
                            )}
                            {/* <img
                              src="images/icons/3.png"
                              alt="Show Password Icon"
                              style={{ width: "20px", height: "auto" }}
                            /> */}
                          </span>
                        </div>

                        <div className="d-flex justify-content-between py-4">
                          <a
                            href="/forgotPassword"
                            className="text-decoration-none"
                          >
                            Forgot Password?
                          </a>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="keepSignedIn"
                              checked={rememberMe}
                              onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <label
                              className="form-check-label"
                              for="keepSignedIn"
                            >
                              Keep me signed in
                            </label>
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="btn btn-primary w-100 p-2"
                      >
                        LOGIN
                      </button>

                      <div className="d-flex justify-content-center py-4">
                        <a
                          href="/signup"
                          className="text-decoration-none"
                          style={{ color: "#333" }}
                        >
                          New User?&nbsp;
                          <span
                            style={{ color: "blue" }}
                            onClick={() => navigate("/signup")}
                          >
                            Sign Up
                          </span>
                        </a>
                      </div>
                    </form>
                  </div>
                </div>

                <div className="col-md-12 order-lg-2 col-xs-12 col-lg-7 d-lg-block">
                  <h3 className="text-center mb-0 text-blue fw-bold page-tit mobile-hide">
                    {/* All in One Case Management Software For Lawyers */}
                    All in One Solution for Advocates
                  </h3>
                  <div className=" ">
                    <section
                      id="slider"
                      style={{
                        width: "300px",
                        height: "410px",
                        margin: "50px auto 0",
                      }}
                    >
                      {[...Array(totalSlides)].map((_, index) => (
                        <input
                          key={index}
                          type="radio"
                          name="slider"
                          id={`s${index + 1}`}
                          checked={currentIndex === index + 1}
                          readOnly
                        />
                      ))}

                      <label htmlFor="s1" id="slide1">
                        <div
                          className="card card-custom"
                          style={{ minHeight: "400px" }}
                        >
                          <a href="#" className="card-link">
                            <div className="card-header-bg">
                              <div className="card-icon">
                                <img
                                  src="images/icons/8.png"
                                  alt="Case Preparation Icon"
                                  width="60px"
                                />
                              </div>
                              <h4
                                className="card-title text-white"
                                style={{
                                  fontSize: "65px",
                                  marginLeft: "calc(25% - 45px)",
                                }}
                              >
                                1
                              </h4>
                              <h4 className="text-white">
                                Client & Case Information
                              </h4>
                            </div>
                            <div className="card-body mb-4">
                              <h4
                                className="wrap text-18"
                                style={{ textAlign: "justify" }}
                              >
                                {" "}
                                <CardContents cardId={1} />
                              </h4>
                            </div>
                          </a>
                        </div>
                      </label>
                      <label htmlFor="s2" id="slide2">
                        <div
                          className="card card-custom"
                          style={{ minHeight: "400px" }}
                        >
                          <a href="#" className="card-link">
                            <div className="card-header-bg">
                              <div className="card-icon">
                                <img
                                  src="images/icons/11.png"
                                  alt="Document Management Icon"
                                  width="60px"
                                />
                              </div>
                              <h4
                                className="card-title text-white"
                                style={{
                                  fontSize: "65px",
                                  marginLeft: "calc(25% - 45px)",
                                }}
                              >
                                2
                              </h4>
                              <h4 className="text-white">Case Preparation</h4>
                            </div>
                            <div className="card-body mb-4">
                              <h4
                                className="wrap text-18"
                                style={{ textAlign: "justify" }}
                              >
                                {" "}
                                <CardContents cardId={2} />
                              </h4>
                            </div>
                          </a>
                        </div>
                      </label>
                      <label htmlFor="s3" id="slide3">
                        <div
                          className="card card-custom"
                          style={{ minHeight: "400px" }}
                        >
                          <a href="#" className="card-link">
                            <div className="card-header-bg">
                              <div className="card-icon">
                                <img
                                  src="images/icons/9.png"
                                  alt="Client & Case Information"
                                  width="60px"
                                />
                              </div>
                              <h4
                                className="card-title text-white"
                                style={{
                                  fontSize: "65px",
                                  marginLeft: "calc(25% - 45px)",
                                }}
                              >
                                3
                              </h4>
                              <h4 className="text-white">
                                Document Management
                              </h4>
                            </div>
                            <div className="card-body mb-4">
                              <h4
                                className="wrap text-18"
                                style={{ textAlign: "justify" }}
                              >
                                {" "}
                                <CardContents cardId={3} />
                              </h4>
                            </div>
                          </a>
                        </div>
                      </label>
                      <label htmlFor="s4" id="slide4">
                        <div
                          className="card card-custom"
                          style={{ minHeight: "400px" }}
                        >
                          <a href="#" className="card-link">
                            <div className="card-header-bg">
                              <div className="card-icon">
                                <img
                                  src="images/icons/12.png"
                                  alt="Others"
                                  width="60px"
                                />
                              </div>
                              <h4
                                className="card-title text-white"
                                style={{
                                  fontSize: "65px",
                                  marginLeft: "calc(25% - 45px)",
                                }}
                              >
                                4
                              </h4>
                              <h4 className="text-white">Others</h4>
                            </div>

                            <div className="card-body mb-4">
                              <h4
                                className="wrap text-18"
                                style={{ textAlign: "justify" }}
                              >
                                {" "}
                                <CardContents cardId={4} />
                              </h4>
                            </div>
                          </a>
                        </div>
                      </label>
                    </section>
                  </div>
                </div>
                <div className=" col-md-1 order-md-12 col-xs-12 col-lg-2 mx-auto"></div>
                {/* <div className="col-md-12 order-md-4 col-xs-12 col-lg-2 mx-auto"></div> */}
              </div>
            </div>

            {/* Modal for displaying messages */}
            {showModal && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <p>{modalMessage}</p>
                  <button onClick={handleCloseModal} className="modal-button">
                    Ok
                  </button>
                </div>
              </div>
            )}

            <style jsx>{`
              .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(
                  0,
                  0,
                  0,
                  0.5
                ); /* Semi-transparent background */
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000; /* Ensure it is above other content */
              }

              .modal-content {
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                text-align: center;
                width: 300px; /* Set a fixed width */
                height: 200px; /* Set a fixed height */
                display: flex;
                flex-direction: column;
                justify-content: center; /* Center content vertically */
                align-items: center; /* Center content horizontally */
              }

              .modal-button {
                margin-top: 15px;
                padding: 10px 20px;
                background-color: #007bff;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
              }

              .modal-button:hover {
                background-color: #0056b3;
              }
            `}</style>
          </div>
        </div>
        <div className="d-flex align-content-end w-100">
          <footer className="bg-footer text-dark pt-3 w-100">
            <div className="container-fluid">
              <div className="row px-5">
                <div className="col-12">
                  <p className="mb-1 text-center mobile-hide">
                    DocMaster, A 75 Sector 63, Noida - 201301, Uttar Pradesh,
                    India, +91 9289-44-0048, info@docmaster.in
                  </p>
                  <p className="mb-1 text-center mobile-show">
                    DocMaster, A 75 Sector 63, Noida - 201301,<br></br> +91 9289-44-0048, info@docmaster.in
                  </p>
                </div>

                <div className="col-md-12 px-0  text-center mobile-hide">
                  <nav class="footer-nav justify-content-center">
                    <a
                      href="/Disclaimer"
                      class="text-dark mx-1"
                      target="_blank"
                    >
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
                      </a>|
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
        </div>
      </div>
    </>
  );
};

export default LogIn;
