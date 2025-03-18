import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../stylesheets/SignUp.css";
import Stage1 from "./stage1";
import axios from "axios";
import CardContents from "../cardcontent";
import {
  WSregistrationLegal,
  WSPutorgNew,
  WSPutOrgUserCrudAccess,
  WSPutOrgUserLimit,
  WSGeneralUserResendOTP,
  WSGeneralUsernodejs,
  WSuser_order,
} from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";
import Terms_and_Conditions from "../Terms_and_Conditions";
import "../../stylesheets/customModal.css";
import LoadingSpinner from "../../components/LoadingSpinner";

const SignUp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [formData1, setFormData1] = useState({
    orgName: "",
    userType: "single",
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    password: "",
    confirmPassword: "",
    address: "",
    state: "",
    pincode: "",
    landmark: "",
    refcode: "",
    agree: false,
  });

  const handleAgreeChange = (checked) => {
    setFormData1((prevFormData) => ({
      ...prevFormData,
      agree: checked,
    }));
    setIsOpen(false);
  };

  const navigate = useNavigate();

  const handleSubmit = (formData) => {
    const payload = {
      name: formData.firstName + formData.lastName,
      mobileNo: formData.phoneNo,
      email: formData.email,
      referralCode: formData.refcode,
      password: formData.password,
    };

    setLoader(true);
    axios
      .post(WSregistrationLegal, JSON.stringify(payload), {
        headers: apiKeyHeader(),
      })
      .then((response) => {
        const responseData = response.data;
        if (responseData.result_code === 1) {
          createOrg(responseData.result_message.id);
        } else {
          alert(responseData.result_message);
          window.location.reload();
        }
      })
      .catch((error) => {
        console.error("error", error);
      });
  };

  const createOrg = (userId) => {
    const currentDate = new Date();
    const futureDate = new Date();
    futureDate.setDate(currentDate.getDate() + 45);

    const formattedFutureDate = futureDate.toISOString().slice(0, 16);
    const userAccess = formData1.userType === "single" ? 0 : 1;

    const payload = {
      adminUserId: 4,
      userId: userId,
      name: formData1.orgName,
      address: formData1.address,
      city: "",
      state: 1,
      pincode: formData1.pincode,
      landmark: formData1.landmark || "",
      email: formData1.email,
      contactNo: formData1.phoneNo,
      country: 1,
      isAccessToOrg: 0,
      isAccessToLeglOrg: 1,
      orgModulesAccess: JSON.stringify({
        docForm: 1,
        docFormCat: 0,
        user: 0,
        userGroup: 0,
        priceQuotation: 0,
        docFormPreFill: 0,
      }),
      leglOrgModulesAccess: JSON.stringify({
        user: userAccess,
        probInfo: 1,
        client: 1,
        clientCase: 1,
        research: 1,
        fileMerge: 1,
        feeCal: 1,
      }),
      expiredOn: formattedFutureDate,
    };

    axios
      .post(WSPutorgNew, payload, {
        headers: apiKeyHeader(),
      })
      .then((response) => {
        const responseData = response.data;
        if (responseData.resultCode === 1) {
          console.log("Response:", responseData);
          updateOrgCRUDAccess(userId, responseData.id, userAccess);
        } else {
          alert("Failed to create organization: " + responseData.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred: " + error.message);
      });
  };

  async function updateOrgCRUDAccess(userId, orgId, userAccess) {
    try {
      const payload = {
        adminUserId: 4,
        orgId: orgId,
        userId: userId,
        crudAccess: JSON.stringify({
          docForm: { c: 0, r: 0, u: 0, d: 0 },
          user: { c: 1, r: 1, u: 1, d: 1 },
          userGroup: {
            c: 1,
            r: 1,
            u: 1,
            d: 1,
          },
          docFormCat: { c: 0, r: 0, u: 0, d: 0 },
          priceQuotation: { c: 0, r: 0, u: 0, d: 0 },
          docFormPreFill: { c: 0, r: 0, u: 0, d: 0 },
          client: { c: 1, r: 1, u: 1, d: 1 },
          probInfo: { c: 1, r: 1, u: 1, d: 1 },
          clientCase: { c: 1, r: 1, u: 1, d: 1 },
          research: { c: 1, r: 1, u: 1, d: 1 },
          fileMerge: { c: 1, r: 1, u: 1, d: 1 },
        }),
        docFormId: null,
      };

      const response = await axios.post(WSPutOrgUserCrudAccess, payload, {
        headers: apiKeyHeader(),
      });

      console.log("Response:", response.data);

      await setuserOrder(orgId, userId);

      // Set user limit unconditionally before OTP API call
      await setuserLimit(orgId);

      const payload1 = {
        // otpType: "email",
        to: formData1.email,
      };

      const otpResponse = await axios.post(WSGeneralUsernodejs, payload1, {
        headers: apiKeyHeader(),
      });
      console.log("OTP Response:", otpResponse.data);
      setLoader(false);
      navigate("/Verifyotp", {
        state: { email: formData1.email, mobile: formData1.phoneNo },
      });
    } catch (error) {
      console.error("Error while updating CRUD Access:", error.message);
      alert("An error occurred: " + error.message);
    }
  }
  async function setuserOrder(orgId, userId) {
    try {
      const payload = {
        userId: userId,
        orgId: orgId,
      };

      // Update user limit and wait for the response
      const response = await axios.post(WSuser_order, payload, {
        headers: apiKeyHeader(),
      });

      console.log("Response:", response.data);
      // setLoader(false);

      // alert("Registration successful. Thank you!");
      return response;
    } catch (error) {
      console.error("Error while processing:", error.message);
      alert("An error occurred: " + error.message);
      return null;
    }
  }

  async function setuserLimit(orgId) {
    try {
      const payload = {
        userId: "4",
        orgId: orgId,
        limit: 4,
      };

      // Update user limit and wait for the response
      const response = await axios.post(WSPutOrgUserLimit, payload, {
        headers: apiKeyHeader(),
      });

      console.log("Response:", response.data);
      // setLoader(false);

      // alert("Registration successful. Thank you!");
      return response;
    } catch (error) {
      console.error("Error while processing:", error.message);
      alert("An error occurred: " + error.message);
      return null;
    }
  }

  const [currentIndex, setCurrentIndex] = useState(1);
  const totalSlides = 4;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex % totalSlides) + 1);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {loader && <LoadingSpinner />}
      {isOpen && (
        <div className="modal-overlay-a my-4">
          <span className="modal-content-a">
            <i
              className="fa fa-times-circle modal-close-a"
              onClick={() => setIsOpen(false)}
              style={{ color: "red" }}
            ></i>

            <Terms_and_Conditions
              navBar={false}
              isOpen={isOpen}
              onAgreeChange={handleAgreeChange}
              agree={formData1.agree}
            />

            {/* <div className="d-flex justify-content-center" style={{background:"#1c46f2 ", color:"#fff",padding:"10px"}}>
              <label class="form-check-label" for="termsConditions">
              <input
                class="form-check-input"
                type="checkbox"
                value=""
                id="termsConditions"
                required
              /> I agree to the Terms & Conditions
              </label>
            </div> */}
          </span>
        </div>
      )}
      <div
        className="d-flex align-items-start justify-content-between flex-column w-100"
        style={{ height: "100vh", overflowY: "auto" }}
      >
        <div className="d-flex align-content-start w-100">
          <nav class="navbar navbar-expand-lg navbar-light bg-white py-0 w-100">
            <div class="container-fluid">
              {/* <button
                class="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span class="navbar-toggler-icon"></span>
              </button> */}
               
              <a class="navbar-brand ms-auto me-0 home-nav-sec" href="/">
                <img
                  src="images/logo/docmaster.png"
                  alt="Logo"
                  class="logo img-fluid"
                />
              </a>
            </div>
          </nav>
        </div>
        <div class="row mx-0 text-center w-100  mobile-show">
          <div class="col-12">
            <h3 class="text-center mb-0 mt-0 text-blue fw-bold page-tit">
              {/* All in One Case Management Software For Lawyers */}
              All in One Solution for Advocates
            </h3>
          </div>
        </div>
        <div className="d-flex align-content-center w-100">
          <div className="login w-100">
            <div class="container-fluid pb-0 bg-white login">
              
              <div class="row  mx-4  content-align-center justify-content-center align-items-center d-flex">
                {/* <!-- <div class="col-md-6  d-lg-block"> --> */}
                {/* <div class="  col-lg-1 d-lg-block"></div> */}
                <div class="col-md-12 order-lg-2 col-lg-4 d-lg-block">
                  <h3 class="text-center mt-0 mb-1 sign-in-title text-blue">Sign Up</h3>

                  {/* <!-- <div class="col-6 col-md-6 col-lg-4 mx-auto"> --> */}
                  <div class="card card-custom-login p-1 bg bg-white">
                    <div class="  ">
                      <div class="">
                        <Stage1
                          handleSubmit={handleSubmit}
                          setFormData={setFormData1}
                          formData={formData1}
                          setIsOpen={setIsOpen}
                          agree={formData1.agree}
                        />

                        {/* <div className="form-footer">
                          <p>
                            Already a member?{" "}
                            <span
                              className="sign-in-link"
                              onClick={() => navigate("/login")}
                              style={{ cursor: "pointer", color: "blue" }}
                            >
                              Sign In
                            </span>
                          </p>
                        </div> */}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-12 order-lg-1 col-lg-7 d-lg-block">
                  <h3 class="text-center mt-0 text-blue fw-bold page-tit mobile-hide">
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
                                className="wrap  text-18"
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
                                  alt="Judgement & Court Fees"
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
                <div class="  col-lg-1 d-lg-block"></div>
              </div>
            </div>
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
                    DocMaster, A 75 Sector 63, Noida - 201301,<br></br>Uttar Pradesh,
                    India, +91 9289-44-0048, info@docmaster.in
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
                  <div className="row mx-auto ">
                    <div className="col-5 col-md-4">
                      <a
                        href="/Disclaimer"
                        class="text-dark mx-1"
                        target="_blank"
                      >
                        Disclaimer
                      </a>
                    </div>
                    <div className="col-7 col-md-4">
                      <a
                        href="/Terms_and_Conditions"
                        class="text-dark mx-1"
                        target="_blank"
                      >
                        Terms & Conditions
                      </a>
                    </div>
                    <div className="col-5 col-md-4">
                      <a
                        href="/Privacy_Policy"
                        class="text-dark mx-1"
                        target="_blank"
                      >
                        Privacy Policy
                      </a>
                    </div>
                    <div className="col-7 col-md-4">
                      <a
                        href="/ipr_copyrights"
                        class="text-dark mx-1"
                        target="_blank"
                      >
                        IPR &amp; Copyright
                      </a>
                    </div>
                    <div className="col-5 col-md-4">
                      <a href="/Pricing" class="text-dark mx-1">
                        Pricing Plan
                      </a>
                    </div>
                    <div className="col-7 col-md-4">
                      <a
                        class="text-dark mx-1"
                        href="/Cancellation_Policy"
                        target="_blank"
                      >
                        Cancellation & Refund Policy
                      </a>
                    </div>
                    <div className="col-5 col-md-4">
                      <a href="home#aboutus" class="text-dark mx-1">
                        About Us
                      </a>
                    </div>
                    <div className="col-7 col-md-4">
                      <a href="home#faq" class="text-dark mx-1">
                        FAQs
                      </a> | 
                      <a href="home#contactus" class="text-dark mx-1">
                        Write to Us
                      </a>
                    </div>
                    {/* <div className="col-12"><div className="divider"></div></div> */}
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

export default SignUp;
