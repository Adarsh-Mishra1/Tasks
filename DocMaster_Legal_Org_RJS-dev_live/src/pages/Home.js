import React, { Suspense, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const Home = () => {
  const location = useLocation();
  const aboutUsRef = useRef(null);
  const pricingRef = useRef(null);
  const careerRef = useRef(null);
  const faqRef = useRef(null);
  const feedbackRef = useRef(null);
  const contactUsRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({});
    // ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(
    function () {
      switch (location.hash) {
        case "#aboutUs": {
          scrollToSection(aboutUsRef);
          break;
        }
        case "#pricing": {
          scrollToSection(pricingRef);
          break;
        }
        case "#career": {
          scrollToSection(careerRef);
          break;
        }
        case "#faq": {
          scrollToSection(faqRef);
          break;
        }
        case "#feedback": {
          scrollToSection(feedbackRef);
          break;
        }
        case "#contactus": {
          scrollToSection(contactUsRef);
          break;
        }
        default: {
          scrollToSection(aboutUsRef);
        }
      }
    },
    [location.hash]
  );

  // State to control the position (left: 0 or left: 250)
  const [isOpen, setIsOpen] = useState(true);

  // Function to toggle the position
  const togglePosition = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Suspense fallback={<>Loading...</>}>
      <div className="main_container " style={{ paddingTop: "100px" }}>
        <div className=" ">
          <div class="d-flex mt-5 w-100 py-2">
            <div
              class="d-flex w-20 py-4 px-2 bg-primary flex-column align-content-around flex-wrap left-prof-menu  "
              style={{
                left: isOpen ? "-260px" : "0px",
                transition: "left 0.3s ease",
              }}
            >
              <div class="profile pt-5">
                {/* <div class="bg-white mt-5 center-logo p-4 rounded-20 mb-4">
                  <img
                    class="justify-content-center align-items-center"
                    src="images/logo/docmaster.png"
                    alt="User Profile"
                    width="100%"
                    height="auto"
                  />
                </div> */}
                <h2
                  class="text-center text-white fw-700 mb-3"
                  style={{ fontSize: "1.2rem", fontWeight: "600" }}
                >
                  All in One Web Solutions
                </h2>
              </div>
              <div class="nav flex-column  gap-2 ">
                <a class="nav-item nav-link px-0 text-white d-flex gap-3 align-items-center">
                  {/* <img src="images/icons/8.png" class="w-20" /> */}
                  <span className="circle border rounded px-3 py-2">
                    <i class="fa fa-info px-1"></i>
                  </span>
                  <span>Client & Case Information</span>
                </a>
                <a class="nav-item nav-link px-0 text-white d-flex gap-3 align-items-center">
                  {/* <img src="images/icons/11.png" class="w-20" /> */}
                  <span className="circle border rounded px-3 py-2">
                    <i className="fa fa-folder"></i>
                  </span>
                  <span>Case Preparation</span>
                </a>
                <a class="nav-item nav-link px-0 text-white d-flex gap-3 align-items-center">
                  {/* <img src="images/icons/9.png" class="w-20" /> */}
                  <span className="circle border rounded px-3 py-2">
                    <i className="fa fa-file"></i>
                  </span>
                  <span>Document Management</span>
                </a>
                <a class="nav-item nav-link px-0 text-white d-flex gap-3 align-items-center">
                  <span className="circle border rounded px-3 py-2">
                    <i className="fa fa-gavel"></i>
                  </span>
                  <span>Others</span>
                </a>
                <a class="nav-item nav-link px-0 text-white d-flex gap-3 align-items-center">
                  <span className="circle border rounded px-3 py-2">
                    <i className="fa fa-calendar"></i>
                  </span>
                  <span>Case Diary Organizer </span>
                </a>
                <a class="nav-item nav-link px-0 text-white d-flex gap-3 align-items-center">
                  <span className="circle border rounded px-3 py-2">
                    <i className="fa fa-ticket"></i>
                  </span>
                  <span>Raise Your Concern</span>
                </a>
              </div>
              <button
                className="btn btn-primary m-0"
                id="toggle-btn"
                onClick={togglePosition}
                style={{ position: "absolute", right: "-50px", top: "4px" }}
              >
                {isOpen ? (
                  <i class="fa fa-bars" aria-hidden="true"></i>
                ) : (
                  <i class="fa fa-times" aria-hidden="true"></i>
                )}
              </button>
            </div>

            <div class="h-100 w-80  d-flex flex-column  home-right-col rgt-col-sec">
              <nav
                className="navbar navbar-expand-lg navbar-light bg-white px-4 py-0 home-nav-bar"
                style={{
                  position: "fixed",
                  width: "80%",
                  top: "0",
                  background: "#FFF",
                  zIndex: "9",
                }}
              >
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
              <div className="w-100 px-5">
                {/* About Us section */}
                <section
                  ref={aboutUsRef}
                  id="about-us-section"
                  className="about-us-section  "
                >
                  <nav class="navbar navbar-light bg-white pt-5">
                    <div class="container-fluid px-0">
                      <a class="navbar-brand"></a>
                      <div class=" gap-4 d-flex align-content-center flex-wrap">
                        <a
                          href="/"
                          class=" py-1 text-decoration-none text-dark"
                        >
                          Login
                        </a>
                        <a
                          href="/signup"
                          class="btn m-0 btn-sm bg-primary text-white btn-sm ps-3"
                          type="submit"
                        >
                          Sign Up Free
                        </a>
                        {/* <a class="user-icon-right" href="#">
                        <div class="profile_pic">
                          <i
                            className="fa fa-user img-circle profile_img m-0"
                            style={{ padding: "4px 7px", fontSize: "1.5rem" }}
                          ></i>
                        </div>
                      </a> */}
                      </div>
                    </div>
                  </nav>
                  <div className="container-fluid">
                    <div class="row">
                      <div class="col-md-12 ">
                        <div>
                          {" "}
                          <h1 class="bg-primary text-30 p-3 text-white">
                            About Us
                          </h1>{" "}
                        </div>
                        <div className="px-2">
                          {/* <h2>From Founder's Desk</h2> */}
                          <p className="text-16 text-black">
                            {/* At DocMaster, we are revolutionising the
                          correspondence world with technology, innovation and
                          content expertise. From frequently used documents,
                          letters, business correspondence or professional
                          documents, You name it, We have it. */}
                            {/* We introduce ourselves as the only tech-solution creator for legal professionals, who are more than two million in India. At DocMaster, we are revolutionising the correspondence world with technology, innovation and content expertise. From frequently used documents such as notices, plaints, suits, agreements  You name it, We have it. */}
                            DocMaster.legal is an offshoot of Docmaster.in
                            bouquet It is an innovative tech-solution for legal
                            professionals in India. It is the only solution
                            which plays multiple roles at one place for any
                            advocate, be it meeting with a new client,
                            researching on a case, drafting, online filing
                            process or record management. You will find it
                            helpful everywhere. To know more, register free and
                            experience 45 days free trial offer.
                          </p>

                          {/*  */}
                        </div>
                      </div>
                    </div>

                    <div class="d-flex flex-column ">
                      <div class="d-flex my-2 py-3 our-ms-sec card-rounded h-150 card-box-shadow">
                        <div class="w-25 mx-2 border card-rounded align-content-center">
                          <h3 class="p-3  text-black text-center">
                            Our Mission
                          </h3>
                        </div>

                        <div class="w-75 px-3 py-4 ">
                          <p
                            className="text-16 mb-0 text-black "
                            style={{ textAlign: "justify" }}
                          >
                            The DocMaster in aims to simplify writing a document
                            and bridging the gaps in the process of written
                            communication by innovation & technologies. We aim
                            to deliver documents used within diverse industries
                            including but not limited to real estate, education,
                            utilities, banking and finance, insurance, human
                            resources and legal. You name the document, we will
                            make it.
                          </p>
                        </div>
                      </div>

                      <div class="d-flex my-2 py-3 our-ms-sec card-rounded h-150 card-box-shadow ">
                        <div class="w-25 border mx-2 card-rounded align-content-center">
                          <h3 class="p-3 text-black text-center">Our Vision</h3>
                        </div>

                        <div class="w-75 px-3 py-4 ">
                          <p
                            className="text-16 mb-0 text-black"
                            style={{ textAlign: "justify" }}
                          >
                            Revolutionising the correspondence world with simple
                            language, grammar accuracy, subject matter clarity,
                            technology and Innovation.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Pricing section */}
                <section
                  ref={pricingRef}
                  id="pricing-section"
                  className="pricing-section py-5  "
                >
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-md-12">
                        <h1 className="bg-primary text-30 p-3 text-white">
                          Pricing Plan
                        </h1>
                      </div>
                    </div>
                    <div class="row mt-3 g-4">
                      <div class="col-lg-4 col-md-6">
                        <div class="card h-100 shadow-sm ">
                          <div class="card-header bg-primary text-white text-center">
                            <h3 class="card-title text-center text-white">
                              <b>Basic</b>
                            </h3>
                            <h2 className="text-white">₹3540</h2>
                          </div>
                          <div class="card-body d-flex flex-column align-items-center justify-content-center">
                            <ul class="list-unstyled">
                              <li className="text-16">
                                <i className="fa fa-check-circle text-success me-2"></i>
                                Single User
                              </li>
                              <li className="text-16">
                                <i className="fa fa-check-circle text-success me-2"></i>
                                20 Max Cases{" "}
                              </li>
                              <li className="text-16">
                                <i className="fa fa-check-circle text-success me-2"></i>
                                50 MB Storage
                              </li>
                              <li className="text-16">
                                <i className="fa fa-check-circle text-success me-2"></i>
                                30 Problem Info Cases
                              </li>
                              <li className="text-16">
                                <i className="fa fa-check-circle text-success me-2"></i>
                                25 Researches
                              </li>
                              <li className="text-16">
                                <i className="fa fa-check-circle text-success me-2"></i>
                                50 Online Filings{" "}
                              </li>
                              <li className="text-16">
                                <i className="fa fa-check-circle text-success me-2"></i>
                                30 Case Hearing Dairies{" "}
                              </li>
                              <li className="text-16">
                                <i className="fa fa-check-circle text-success me-2"></i>
                                50 Scheduler on{" "}
                                <span>
                                  <i className="fa fa-whatsapp"></i>
                                </span>
                              </li>
                              <li className="text-16">
                                <i className="fa fa-check-circle text-success me-2"></i>
                                500 Scheduler on SMS{" "}
                              </li>
                              <li className="text-16">
                                <i className="fa fa-check-circle text-success me-2"></i>
                                Unlimited Scheduler on Email{" "}
                              </li>
                              <li className="text-16">
                                <i className="fa fa-check-circle text-success me-2"></i>
                                80 Judgement Searches
                              </li>
                              <li className="text-16">
                                <i className="fa fa-check-circle text-success me-2"></i>
                                30 Billings
                              </li>
                              <li className="text-16">
                                <i className="fa fa-check-circle text-success me-2"></i>
                                30 Events{" "}
                              </li>
                              <li className="text-16">
                                <i className="fa fa-check-circle text-success me-2"></i>
                                50 Draftings
                              </li>
                            </ul>
                            <a
                              href="/pricing"
                              class="btn btn-primary bg-primary w-100"
                            >
                              Register Now
                            </a>
                          </div>
                        </div>
                      </div>
                      <div class="col-lg-4 col-md-6">
                        <div class="card h-100 shadow-sm">
                          <div class="card-header bg-primary text-white text-center">
                            <h3 class="card-title text-center text-white">
                              <b>Silver</b>
                            </h3>
                            <h2 className="text-white">₹6490</h2>
                          </div>
                          <div class="card-body d-flex flex-column align-items-center justify-content-center">
                            <ul class="list-unstyled">
                              <li className="text-16">
                                <i className="fa fa-check-circle text-success me-2"></i>{" "}
                                1 + 2 Users
                              </li>
                              <li className="text-16">
                                <i className="fa fa-check-circle text-success me-2"></i>{" "}
                                60 Max Cases
                              </li>
                              <li className="text-16">
                                <i className="fa fa-check-circle text-success me-2"></i>{" "}
                                150 MB Storage
                              </li>
                              <li className="text-16">
                                <i className="fa fa-check-circle text-success me-2"></i>{" "}
                                90 Problem Info Cases
                              </li>
                              <li className="text-16">
                                <i className="fa fa-check-circle text-success me-2"></i>{" "}
                                75 Researches
                              </li>
                              <li className="text-16">
                                <i className="fa fa-check-circle text-success me-2"></i>{" "}
                                150 Online Filings
                              </li>
                              <li className="text-16">
                                <i className="fa fa-check-circle text-success me-2"></i>{" "}
                                90 Case Hearing Dairies
                              </li>
                              <li className="text-16">
                                <i className="fa fa-check-circle text-success me-2"></i>{" "}
                                150 Scheduler on{" "}
                                <span>
                                  <i className="fa fa-whatsapp"></i>
                                </span>
                              </li>
                              <li className="text-16">
                                <i className="fa fa-check-circle text-success me-2"></i>{" "}
                                1500 Scheduler on SMS
                              </li>
                              <li className="text-16">
                                <i className="fa fa-check-circle text-success me-2"></i>{" "}
                                Unlimited Scheduler on Email
                              </li>
                              <li className="text-16">
                                <i className="fa fa-check-circle text-success me-2"></i>{" "}
                                300 Judgement Searches
                              </li>
                              <li className="text-16">
                                <i className="fa fa-check-circle text-success me-2"></i>{" "}
                                100 Billings
                              </li>
                              <li className="text-16">
                                <i className="fa fa-check-circle text-success me-2"></i>{" "}
                                100 Events
                              </li>
                              <li className="text-16">
                                <i className="fa fa-check-circle text-success me-2"></i>{" "}
                                150 Draftings
                              </li>
                            </ul>

                            <a
                              href="/pricing"
                              class="btn btn-primary bg-primary w-100"
                            >
                              Register Now
                            </a>
                          </div>
                        </div>
                      </div>
                      <div class="col-lg-4 col-md-6">
                        <div class="card h-100 shadow-sm">
                          <div class="card-header bg-primary text-white text-center">
                            <h3 class="card-title text-center text-white">
                              <b>Gold</b>
                            </h3>
                            <h2 className="text-white">₹14160</h2>
                          </div>
                          <div class="card-body d-flex flex-column align-items-center justify-content-center">
                            <ul class="list-unstyled">
                              <li className="text-16">
                                <i className="fa fa-check-circle text-success me-2"></i>
                                1 + 5 Users{" "}
                              </li>
                              <li className="text-16">
                                <i className="fa fa-check-circle text-success me-2"></i>
                                200 Max Cases
                              </li>
                              <li className="text-16">
                                <i className="fa fa-check-circle text-success me-2"></i>
                                500 MB Storage
                              </li>
                              <li className="text-16">
                                <i className="fa fa-check-circle text-success me-2"></i>
                                300 Problem Info Cases
                              </li>
                              <li className="text-16">
                                <i className="fa fa-check-circle text-success me-2"></i>
                                250 Researches
                              </li>
                              <li className="text-16">
                                <i className="fa fa-check-circle text-success me-2"></i>
                                500 Online Filings
                              </li>
                              <li className="text-16">
                                <i className="fa fa-check-circle text-success me-2"></i>
                                300 Case Hearing Dairies
                              </li>
                              <li className="text-16">
                                <i className="fa fa-check-circle text-success me-2"></i>
                                500 Scheduler on{" "}
                                <span>
                                  <i className="fa fa-whatsapp"></i>
                                </span>
                              </li>
                              <li className="text-16">
                                <i className="fa fa-check-circle text-success me-2"></i>
                                3000 Scheduler on SMS
                              </li>
                              <li className="text-16">
                                <i className="fa fa-check-circle text-success me-2"></i>
                                Unlimited Scheduler on Email
                              </li>
                              <li className="text-16">
                                <i className="fa fa-check-circle text-success me-2"></i>
                                750 Judgement Searches
                              </li>
                              <li className="text-16">
                                <i className="fa fa-check-circle text-success me-2"></i>
                                350 Billings
                              </li>
                              <li className="text-16">
                                <i className="fa fa-check-circle text-success me-2"></i>
                                350 Events
                              </li>
                              <li className="text-16">
                                <i className="fa fa-check-circle text-success me-2"></i>
                                500 Drafings
                              </li>
                            </ul>
                            <a
                              href="/pricing"
                              class="btn btn-primary bg-primary w-100"
                            >
                              Register Now
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Career section */}
                {/* <section
                ref={careerRef}
                id="career-section"
                className="career-section py-5 "
              >
                <div class="container-fluid">
                  <h1 className="bg-primary p-3 text-30 text-white">Careers</h1>
                  <div class="card card-custom-login p-0">
                    <div class="card-bg-img">
                      <h2
                        class="heading header-bg-img text-white px-3 pt-5 m-0"
                        style={{ fontSize: "2rem" }}
                      >
                        DocMaster <b>Careers</b>
                      </h2>
                      <div class="d-flex ">
                        <div class="w-50 ">
                          <div class="   p-3  w-100 h-700">
                            <form class="mt-5 career-form">
                              <div class="form-group mb-4">
                                <label for="name">Name</label>
                                <input
                                  type="text"
                                  class="form-control"
                                  id="name"
                                  placeholder=""
                                />
                              </div>
                              <div class="form-group mb-4">
                                <label for="lastname">Last Name</label>
                                <input
                                  type="text"
                                  class="form-control"
                                  id="last_name"
                                  placeholder=""
                                />
                              </div>
                              <div class="form-group mb-4">
                                <label for="mobile-no">Mobile No</label>
                                <input
                                  type="tel"
                                  class="form-control"
                                  id="mobile-no"
                                  placeholder=""
                                />
                              </div>
                              <div class="form-group mb-4">
                                <label for="email">Email</label>
                                <input
                                  type="email"
                                  class="form-control"
                                  id="email"
                                  placeholder=""
                                />
                              </div>
                              <div class="form-group mb-4">
                                <label for="position">
                                  Position Interested in
                                </label>
                                <input
                                  type="text"
                                  class="form-control"
                                  id="role-requirement"
                                  placeholder=""
                                />
                              </div>
                              <div class="form-group mb-4">
                                <label for="resume">
                                  Upload Resume (Max:2MB)
                                </label>
                                <input
                                  type="file"
                                  class="form-control"
                                  id="Upload-Resume"
                                />
                                <p class="text-muted mt-2">
                                  Please upload only .doc, .docx, and .pdf files
                                </p>
                              </div>
                              <div class="mt-4 d-flex justify-content-end">
                                <button type="submit" class="btn btn-primary">
                                  Submit
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                        <div class="w-50 ">
                          <img
                            src="images/career-pic1.png"
                            class="img-fluid w-100 h-100"
                            alt="career-pic"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section> */}

                {/* FAQ section */}
                <section
                  ref={faqRef}
                  id="faq-section"
                  className="faq-section py-5"
                >
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-md-12">
                        <h1 className="p-3 text-30 bg-primary text-white">
                          FAQ's | Frequently Asked Questions
                        </h1>
                      </div>
                    </div>
                    <div
                      class="accordion accordion-flush"
                      id="accordionFlushExample"
                    >
                      <div class="accordion-item">
                        <h2 class="accordion-header" id="flush-headingOne">
                          <button
                            class="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#flush-collapseOne"
                            aria-expanded="false"
                            aria-controls="flush-collapseOne"
                          >
                            <strong>Q. </strong> What are the services offered
                            by Docmaster.Legal?
                          </button>
                        </h2>
                        <div
                          id="flush-collapseOne"
                          class="accordion-collapse collapse"
                          aria-labelledby="flush-headingOne"
                          data-bs-parent="#accordionFlushExample"
                        >
                          <div class="accordion-body">
                            <strong>A.</strong> Docmaster modules help execution
                            of different tasks one needed in day-to-day life.
                            It’s All in One Legal Module for Advocates offer
                            multiple options any advocate requires like Client
                            Meeting, Research, Automated Drafting, Judgement
                            Search, Online filing, Case hearing diary and
                            Document management. It helps saving time at every
                            place besides help keep track of activity. This tool
                            supports legal professionals from the very first
                            point, the initial client discussion and remains a
                            24/7 assistant throughout the litigation process. It
                            is all in one management system that manages all
                            legal and procedural aspects in one go without
                            errors.
                          </div>
                        </div>
                      </div>
                      <div class="accordion-item">
                        <h2 class="accordion-header" id="flush-headingTwo">
                          <button
                            class="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#flush-collapseTwo"
                            aria-expanded="false"
                            aria-controls="flush-collapseTwo"
                          >
                            <strong>Q. </strong>Does Docmaster.Legal offer legal
                            advice?
                          </button>
                        </h2>
                        <div
                          id="flush-collapseTwo"
                          class="accordion-collapse collapse"
                          aria-labelledby="flush-headingTwo"
                          data-bs-parent="#accordionFlushExample"
                        >
                          <div class="accordion-body">
                            <strong>A.</strong> DocMaster does not offer any
                            Legal advice.
                          </div>
                        </div>
                      </div>
                      <div class="accordion-item">
                        <h2 class="accordion-header" id="flush-headingThree">
                          <button
                            class="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#flush-collapseThree"
                            aria-expanded="false"
                            aria-controls="flush-collapseThree"
                          >
                            <strong>Q. </strong> Who all can use this website?
                          </button>
                        </h2>
                        <div
                          id="flush-collapseThree"
                          class="accordion-collapse collapse"
                          aria-labelledby="flush-headingThree"
                          data-bs-parent="#accordionFlushExample"
                        >
                          <div class="accordion-body">
                            <strong>A.</strong> Docmaster has domain specific
                            module for the use of professionals, individuals and
                            businesses. DocMaster.Legal is being developed for
                            the advocates engage in litigations in courts.
                          </div>
                        </div>
                      </div>

                      <div class="accordion-item">
                        <h2 class="accordion-header" id="flush-headingFour">
                          <button
                            class="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#flush-collapseFour"
                            aria-expanded="false"
                            aria-controls="flush-collapseFour"
                          >
                            <strong>Q. </strong> What is the use of Client
                            Management?
                          </button>
                        </h2>
                        <div
                          id="flush-collapseFour"
                          class="accordion-collapse collapse"
                          aria-labelledby="flush-headingFour"
                          data-bs-parent="#accordionFlushExample"
                        >
                          <div class="accordion-body">
                            <strong>A.</strong> In DocMaster.Legal the user (an
                            Advocate) can record, manage and update all
                            information of a client at one place.
                          </div>
                        </div>
                      </div>

                      <div class="accordion-item">
                        <h2 class="accordion-header" id="flush-headingFive">
                          <button
                            class="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#flush-collapseFive"
                            aria-expanded="false"
                            aria-controls="flush-collapseFive"
                          >
                            <strong>Q. </strong> What is the use of Case
                            Management?
                          </button>
                        </h2>
                        <div
                          id="flush-collapseFive"
                          class="accordion-collapse collapse"
                          aria-labelledby="flush-headingFive"
                          data-bs-parent="#accordionFlushExample"
                        >
                          <div class="accordion-body">
                            <strong>A.</strong> In DocMaster.Legal the user (an
                            Advocate) can manage and update cases related to
                            clients at one place. Can also create and view all
                            the cases of clients at a glance.
                          </div>
                        </div>
                      </div>

                      <div class="accordion-item">
                        <h2 class="accordion-header" id="flush-headingSix">
                          <button
                            class="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#flush-collapseSix"
                            aria-expanded="false"
                            aria-controls="flush-collapseSix"
                          >
                            <strong>Q. </strong> Is it a paid service?
                          </button>
                        </h2>
                        <div
                          id="flush-collapseSix"
                          class="accordion-collapse collapse"
                          aria-labelledby="flush-headingSix"
                          data-bs-parent="#accordionFlushExample"
                        >
                          <div class="accordion-body">
                            <strong>A.</strong> Yes. it is a paid annual
                            subscription-based module. To know more visit{" "}
                            <a href="/Pricing">
                              <u>Pricing Plans</u>
                            </a>{" "}
                            choose one best suited your requirements. We also
                            offer 45 days free trail.
                          </div>
                        </div>
                      </div>

                      <div class="accordion-item">
                        <h2 class="accordion-header" id="flush-headingSeven">
                          <button
                            class="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#flush-collapseSeven"
                            aria-expanded="false"
                            aria-controls="flush-collapseSeven"
                          >
                            <strong>Q. </strong> Is there any free trial period?
                          </button>
                        </h2>
                        <div
                          id="flush-collapseSeven"
                          class="accordion-collapse collapse"
                          aria-labelledby="flush-headingSeven"
                          data-bs-parent="#accordionFlushExample"
                        >
                          <div class="accordion-body">
                            <strong>A.</strong> Yes, we offer 45 days free
                            trial.
                          </div>
                        </div>
                      </div>

                      <div class="accordion-item">
                        <h2 class="accordion-header" id="flush-headingEight">
                          <button
                            class="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#flush-collapseEight"
                            aria-expanded="false"
                            aria-controls="flush-collapseEight"
                          >
                            <strong>Q. </strong> How can I subscribe for
                            Docmaster.Legal?
                          </button>
                        </h2>
                        <div
                          id="flush-collapseEight"
                          class="accordion-collapse collapse"
                          aria-labelledby="flush-headingEight"
                          data-bs-parent="#accordionFlushExample"
                        >
                          <div class="accordion-body">
                            <strong>A.</strong> Visit the website, submit the
                            required details and get registered.
                          </div>
                        </div>
                      </div>

                      <div class="accordion-item">
                        <h2 class="accordion-header" id="flush-headingNine">
                          <button
                            class="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#flush-collapseNine"
                            aria-expanded="false"
                            aria-controls="flush-collapseNine"
                          >
                            <strong>Q. </strong> If I wish to cancel my
                            subscription, will I be entitled for any refund?
                          </button>
                        </h2>
                        <div
                          id="flush-collapseNine"
                          class="accordion-collapse collapse"
                          aria-labelledby="flush-headingNine"
                          data-bs-parent="#accordionFlushExample"
                        >
                          <div class="accordion-body">
                            <strong>A.</strong> DocMaster does not have a refund
                            policy. We give a free version to experience the
                            quality of our services before any subscription to
                            all the users.
                          </div>
                        </div>
                      </div>

                      <div class="accordion-item">
                        <h2 class="accordion-header" id="flush-headingten">
                          <button
                            class="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#flush-collapseTen"
                            aria-expanded="false"
                            aria-controls="flush-collapseTen"
                          >
                            <strong>Q. </strong> Is the information I submit
                            kept confidential?
                          </button>
                        </h2>
                        <div
                          id="flush-collapseTen"
                          class="accordion-collapse collapse"
                          aria-labelledby="flush-headingten"
                          data-bs-parent="#accordionFlushExample"
                        >
                          <div class="accordion-body">
                            <strong>A.</strong> All the information saved on our
                            server is in encrypted form only. Most importantly
                            it is only accessible to the user.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Feedback section */}
                {/* <section
                ref={feedbackRef}
                id="feedback-section"
                className="feedback-section py-5"
              >
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-12">
                      <h1 class="p-3 bg-primary text-white text-30">
                        Feedback
                      </h1>
                    </div>
                  </div>
                </div>
              </section> */}

                {/* Contact Us section */}
                <section
                  ref={contactUsRef}
                  id="contact-us-section"
                  className="contact-us-section py-5 "
                >
                  <div className="container-fluid">
                    <div>
                      <h1 class="p-3 text-30 bg-primary text-white">
                        Write to Us
                      </h1>{" "}
                    </div>

                    <div class="row px-2 justify-content-center align-items-center">
                      <div class="col-md-8">
                        <div class="container">
                          <div class="card card-custom-login p-4 contact-card-bg-img">
                            <h2 class="heading text-white">Get in touch</h2>
                            <form class="mt-5 pt-3 w-90">
                              <div class="form-group mb-2">
                                <label for="name">Name</label>
                                <input
                                  type="text"
                                  class="form-control"
                                  id="name"
                                  aria-describedby="emailHelp"
                                  placeholder=""
                                />
                              </div>
                              <div class="row mb-2">
                                <div class="col-md-6">
                                  <div class="form-group">
                                    <label for="email">Email ID</label>
                                    <input
                                      type="email"
                                      class="form-control"
                                      id="email"
                                      placeholder=""
                                    />
                                  </div>
                                </div>
                                <div class="col-md-6">
                                  <div class="form-group">
                                    <label for="mobile">Mobile</label>
                                    <input
                                      type="tel"
                                      class="form-control"
                                      id="mobile"
                                      placeholder=""
                                    />
                                  </div>
                                </div>
                              </div>
                              <div class="form group">
                                <label for="floatingTextarea">Message</label>
                                <textarea
                                  class="form-control"
                                  placeholder="Leave a comment here"
                                  id="floatingTextarea"
                                  rows="5"
                                ></textarea>
                              </div>

                              {/* <div class=" w-100 mt-3 d-flex gap-2 justify-content-between">
                              <div class="col-md-3 ">
                                <div class="form-group">
                                  <input
                                    type="text"
                                    disabled="disabled"
                                    class="form-control"
                                    id="email"
                                    placeholder=""
                                  />
                                </div>
                              </div>
                              <div class="col px-0">
                                <button
                                  className="btn btn-primary"
                                  type="submit"
                                >
                                  <i
                                    className="fa fa-refresh  "
                                    aria-hidden="true"
                                  ></i>
                                </button>
                              </div>
                              <div class="col-md-7">
                                <div class="form-group">
                                  <input
                                    type="text"
                                    class="form-control"
                                    id="text"
                                    placeholder=""
                                  />
                                </div>
                              </div>
                            </div> */}
                              <div class="mt-4 d-flex justify-content-end">
                                <button
                                  type="submit"
                                  class="btn btn-primary m-0"
                                >
                                  Submit
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>

                      <div class="col-md-4  ">
                        <div class="text-icon-container">
                          <div
                            class="text-icon"
                            style={{ alignItems: "flex-start" }}
                          >
                            <i
                              className="fa fa-map-marker"
                              aria-hidden="true"
                            ></i>
                            <span class="text-20">
                              DocMaster
                              <br />A 75 Sector 63 Noida - 201301
                              <br /> Uttar Pradesh, India
                            </span>
                          </div>

                          <div class="text-icon">
                            <i
                              className="fa fa-phone-square"
                              aria-hidden="true"
                            ></i>
                            <span class="text-20">+91 9289-44-0048</span>
                          </div>

                          <div class="text-icon">
                            <i
                              className="fa fa-envelope"
                              aria-hidden="true"
                            ></i>
                            <span class="text-20">info@DocMaster.in</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
              <div className="w-100">
                <footer class="row mx-auto w-100 text-center mobile-hide">
                  <div className="col-md-12 px-0  text-center">
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
                </footer>
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
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default Home;
