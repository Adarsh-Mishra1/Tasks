import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import userStore from "../zustand/userStore";
//import CardContents from "./cardcontent";
import Footer from "../components/Footer";
import { handleRaiseConcern } from "../OtherFunctions/OtherFunctions";
const Casepreparation = () => {
  const { userData, setUser } = userStore((state) => ({
    userData: state.user,
    setUser: state.setUser,
  }));

  const navigate = useNavigate();

  useEffect(function () {
    if (Object.keys(userData).length === 0) {
      navigate("/login");
    }
  }, []);

  return (
    <>
      <div
        className="d-flex align-items-start justify-content-between flex-column home-page-layout w-100"
        style={{ height: "100vh", overflowY: "auto" }}
      >
        <div className="d-flex align-content-start w-100">
          <Navbar className="w-100" />
        </div>
        <div className="d-flex align-content-center w-100">
          <div className="w-100">
            <div className="container-fluid w-100  padding-x-5 login  ">
              <div className="row">
                <div className="col-md-12">
                  <h3
                    class="text-center  text-blue fw-bold w-100 page-tit"
                    style={{
                      // position: "absolute",
                      left: "0",
                      right: "0",
                      margin: "auto",
                      top: "40px",
                      width: "fit-content",
                    }}
                  >
                    {/* All in One Case Management Software For Lawyers */}
                    All in One Solution for Advocates
                  </h3>
                </div>
              </div>
              <div className="mobile-hide">
              <div className="row home-cards mx-auto px-0 pt-3 pb-3 w-100" >
                <div className="col-md-6 col-lg-3 mt-4 mb-3 d-flex justify-content-center">
                  <div
                    className="card card-custom mb-2"
                    style={{ minHeight: "350px", maxWidth: "300px" }}
                  >
                    <div className="card-header-bg pt-1 px-0">
                      <div className="card-icon">
                        <img
                          src="images/icons/15.png"
                          alt="List of Events Icon"
                        />
                      </div>
                      <h1
                        className="card-header-title"
                        style={{ margin: "0 0 0 calc(17% )" }}
                      >
                        <a href="/clientCaseInfo" className="card-link">
                          1
                        </a>
                      </h1>
                      <h4 className="card-title text-white text-center">
                        <a
                          href="/clientCaseInfo"
                          className="card-link"
                          // className="card-link mobile-hide"
                        >
                          Client & Case Information
                        </a>
                        {/* <span className="mobile-show">
                          Client & Case Information
                        </span> */}
                      </h4>
                    </div>
                    <div className="card-body mt-0">
                      <ul>
                        <li>
                          {/* <li className="mobile-hide"> */}
                          <a href="/clientcaseinformation?1">
                            <div class="card mb-0">
                              <div class="px-2 pt-0 pb-0 card-text">
                                <strong style={{ fontSize: "19px" }}>
                                  Client Management
                                </strong>
                              </div>
                              <div class="card-body pt-0 mt-0 p-2 text-left">
                                {/* <CardContents cardId={7} /> */}
                              </div>
                            </div>
                          </a>
                        </li>
                        <li>
                          {/* <li className="mobile-hide"> */}
                          <a href="/clientcaseinformation?2">
                            <div class="card mb-0">
                              <div class="px-2 pt-0 pb-0 card-text">
                                <strong style={{ fontSize: "19px" }}>
                                  Case Management
                                </strong>
                              </div>
                              <div class="card-body pt-0 mt-0 p-2 text-left">
                                {/* <CardContents cardId={5} /> */}
                              </div>
                            </div>
                          </a>
                        </li>
                        <li className="">
                          <a href="/clientcaseinformation?3">
                            <div class="card mb-0">
                              <div class="px-2 pt-0 pb-0 card-text">
                                <strong style={{ fontSize: "19px" }}>
                                  Case Hearing Diary
                                </strong>
                              </div>
                              <div class="card-body pt-0 mt-0 p-2 text-left">
                                {/* <CardContents cardId={6} /> */}
                              </div>
                            </div>
                          </a>
                        </li>

                        <li>
                          <a href="/clientcaseinformation?4">
                            <div class="card mb-0">
                              <div class="px-2 pt-0 pb-0 card-text">
                                <strong style={{ fontSize: "19px" }}>
                                  Billing & Payments
                                </strong>
                              </div>
                              <div class="card-body pt-0 mt-0 p-2 text-left">
                                {/* <CardContents cardId={8} /> */}
                              </div>
                            </div>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3 mt-4 mb-3 d-flex justify-content-center">
                  <div
                    className="card card-custom mb-2"
                    style={{ minHeight: "350px", maxWidth: "300px" }}
                  >
                    <div className="card-header-bg pt-1 px-0">
                      <div className="card-icon">
                        <img
                          src="images/icons/13.png"
                          alt="Problem Info Icon"
                        />
                      </div>
                      <h1
                        className="card-header-title"
                        style={{ margin: "0 0 0 calc(18%)" }}
                      >
                        <a href="/casepreparation1" className="card-link">
                          2
                        </a>
                      </h1>

                      <h4 className="card-title text-white text-center">
                        <a
                          href="/casepreparation1"
                          className="card-link"
                          // className="card-link mobile-hide"
                        >
                          Case Preparation
                        </a>
                        {/* <span className="mobile-show">Case Preparation</span> */}
                      </h4>
                    </div>
                    <div className="card-body mt-0 ">
                      <ul>
                        <li>
                          <a href="/Casepreparations?1">
                            <div class="card mb-0">
                              <div class="px-2 pt-0 pb-0 card-text">
                                <strong style={{ fontSize: "19px" }}>
                                  Problem Info
                                </strong>
                              </div>
                              <div class="card-body pt-0 mt-0 p-2 text-left">
                                {/* <CardContents cardId={9} /> */}
                              </div>
                            </div>
                          </a>
                        </li>

                        <li>
                          {/* <li className="mobile-hide"> */}
                          <a href="/Casepreparations?2">
                            <div class="card mb-0">
                              <div class="px-2 pt-0 pb-0 card-text">
                                <strong style={{ fontSize: "19px" }}>
                                  Research
                                </strong>
                              </div>
                              <div class="card-body pt-0 mt-0 p-2 text-left">
                                {/* <CardContents cardId={10} /> */}
                              </div>
                            </div>
                          </a>
                        </li>

                        <li>
                          {/* <li className="mobile-hide"> */}
                          <a href="/Casepreparations?3">
                            <div class="card mb-0">
                              <div class="px-2 pt-0 pb-0 card-text">
                                <strong style={{ fontSize: "19px" }}>
                                  List of Events
                                </strong>
                              </div>
                              <div class="card-body pt-0 mt-0 p-2 text-left">
                                {/* <CardContents cardId={11} /> */}
                              </div>
                            </div>
                          </a>
                        </li>

                        <li>
                          {/* <li className="mobile-hide"> */}
                          <a href="/Casepreparations?4">
                            <div class="card mb-0">
                              <div class="px-2 pt-0 pb-0 card-text">
                                <strong style={{ fontSize: "19px" }}>
                                  Drafting
                                </strong>
                              </div>
                              <div class="card-body pt-0 mt-0 p-2 text-left">
                                {/* <CardContents cardId={12} /> */}
                              </div>
                            </div>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 col-lg-3 mt-4 mb-3 d-flex justify-content-center">
                  <div
                    className="card card-custom mb-2"
                    style={{ minHeight: "350px", maxWidth: "300px" }}
                  >
                    <div className="card-header-bg pt-1 px-0">
                      <div className="card-icon">
                        <img src="images/icons/14.png" alt="Research Icon" />
                      </div>
                      <h1
                        className="card-header-title"
                        style={{ margin: "0 0 0 calc(19%)" }}
                      >
                        <a href="/documentmanagment" className="card-link">
                          3
                        </a>
                      </h1>
                      <h4 className="card-title text-white text-center">
                        <a
                          href="/documentmanagment"
                          className="card-link"
                          // className="card-link mobile-hide"
                        >
                          Document Management
                        </a>
                        {/* <span className="mobile-show">Document Management</span> */}
                      </h4>
                    </div>
                    <div className="card-body mt-0">
                      <ul>
                        <li>
                          {/* <li className="mobile-hide"> */}
                          <a href="/documentmanagments?1">
                            <div class="card mb-0">
                              <div class="px-2 pt-0 pb-0 card-text">
                                <strong style={{ fontSize: "19px" }}>
                                  Filled Documents
                                </strong>
                              </div>
                              <div class="card-body pt-0 mt-0 p-2 text-left">
                                {/* <CardContents cardId={13} /> */}
                              </div>
                            </div>
                          </a>
                        </li>
                        <li>
                          {/* <li className="mobile-hide"> */}
                          <a href="/documentmanagments?2">
                            <div class="card mb-0">
                              <div class="px-2 pt-0 pb-0 card-text">
                                <strong style={{ fontSize: "19px" }}>
                                  External Records
                                </strong>
                              </div>
                              <div class="card-body pt-0 mt-0 p-2 text-left">
                                {/* <CardContents cardId={13} /> */}
                              </div>
                            </div>
                          </a>
                        </li>
                        <li>
                          {/* <li className="mobile-hide"> */}
                          <a href="/documentmanagments?3">
                            <div class="card mb-0">
                              <div class="px-2 pt-0 pb-0 card-text">
                                <strong style={{ fontSize: "19px" }}>
                                  All Records
                                </strong>
                              </div>
                              <div class="card-body pt-0 mt-0 p-2 text-left">
                                {/* <CardContents cardId={13} /> */}
                              </div>
                            </div>
                          </a>
                        </li>

                        <li>
                          <a href="/documentmanagments?4">
                            <div class="card mb-0">
                              <div class="px-2 pt-0 pb-0 card-text">
                                <strong style={{ fontSize: "19px" }}>
                                  Online Filing
                                </strong>
                              </div>
                              <div class="card-body pt-0 mt-0 p-2 text-left">
                                {/* <CardContents cardId={16} /> */}
                              </div>
                            </div>
                          </a>
                        </li>
                      </ul>
                      {/* <a href="/documentmanagments?2">
                      <div class="card mb-0">
                        <div class="px-2 pt-0 pb-0 card-text">
                          <strong style={{fontSize:"21px"}}>External Records</strong>
                        </div>
                        <div class="card-body pt-0 mt-0 p-2 text-left">
                          <CardContents cardId={14} />
                        </div>
                      </div>
                    </a>
                    <a href="/documentmanagments?3">
                      <div class="card mb-0">
                        <div class="px-2 pt-0 pb-0 card-text">
                          <strong style={{fontSize:"21px"}}>All Records</strong>
                        </div>
                        <div class="card-body pt-0 mt-0 p-2 text-left">
                          <CardContents cardId={15} />
                        </div>
                      </div>
                    </a> */}
                    </div>
                  </div>
                </div>

                <div className="col-md-6 col-lg-3 mt-4 mb-3 d-flex justify-content-center">
                  <div
                    className="card card-custom mb-2"
                    style={{ minHeight: "350px", maxWidth: "300px" }}
                  >
                    <div className="card-header-bg pt-1 px-0">
                      <div className="card-icon">
                        <img src="images/icons/16.png" alt="Drafting Icon" />
                      </div>
                      <h1
                        className="card-header-title"
                        style={{ margin: "0 0 0 calc(19%)" }}
                      >
                        <a href="/judgementCourtFee" className="card-link">
                          4
                        </a>
                      </h1>
                      <h4 className="card-title text-white text-center">
                        <a
                          href="/judgementCourtFee?1"
                          className="card-link"
                          // className="card-link mobile-hide"
                        >
                          Others
                        </a>
                        {/* <span className="mobile-show">Others</span> */}
                      </h4>
                    </div>
                    <div className="card-body mt-0">
                      <ul>
                        

                        <li>
                          <a
                            href="/judgmentcourtfees?2"
                            // target="_blank"
                            rel="noopener noreferrer"
                          >
                            <div class="card mb-0">
                              <div class="px-2 pt-0 pb-0 card-text">
                                <strong style={{ fontSize: "19px" }}>
                                  Judgement Search
                                </strong>
                              </div>
                              <div class="card-body pt-0 mt-0 p-2 text-left">
                                {/* <CardContents cardId={18} /> */}
                              </div>
                            </div>
                          </a>
                        </li>

                        {/* <li className="mobile-hide">
                          <a
                            // href="/judgmentcourtfees?3"
                            target="#"
                            // target="_blank"
                            rel="noopener noreferrer"
                          >
                            <div class="card mb-0">
                              <div class="px-2 pt-0 pb-0 card-text">
                                <strong
                                  style={{
                                    fontSize: "19px",
                                    display: "block",
                                  }}
                                >
                                  My Judgements
                                </strong>
                                <strong
                                  style={{
                                    fontSize: "14px",
                                    display: "block",
                                  }}
                                >
                                  (Coming Soon)
                                </strong>
                              </div>
                              <div class="card-body pt-0 mt-0 p-2 text-left">
                                <CardContents cardId={18} />
                              </div>
                            </div>
                          </a>
                        </li> */}
                        <li>
                          {/* <li className="mobile-hide"> */}
                          <a
                            href="#"
                            // href="/judgmentcourtfees?3"
                            // target="_blank"
                            // rel="noopener noreferrer"
                          >
                            <div class="card mb-0">
                              <div class="px-2 pt-0 pb-0 card-text">
                                <strong
                                  style={{ fontSize: "19px" }}
                                  onClick={() => handleRaiseConcern(userData)}
                                >
                                  {/* Knowledge Bank */}
                                  Raise Your Concern
                                </strong>
                              </div>
                              <div class="card-body pt-0 mt-0 p-2 text-left">
                                {/* <CardContents cardId={18} /> */}
                              </div>
                            </div>
                          </a>
                        </li>
                        <li>
                          <a
                          // href="/judgmentcourtfees"
                          >
                            {/* <a href="#"> */}
                            <div class="card mb-0">
                              <div class="px-2 pt-0 pb-0 card-text">
                                <strong
                                  style={{ fontSize: "19px", display: "block" }}
                                >
                                  Fee Calculator
                                  <span
                                    style={{
                                      fontSize: "14px",
                                      display: "block",
                                    }}
                                  >
                                    (Coming Soon)
                                  </span>
                                </strong>
                              </div>
                              <div class="card-body pt-0 mt-0 p-2 text-left">
                                {/* <CardContents cardId={17} /> */}
                              </div>
                            </div>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              </div>
              <div className="mobile-show">
              <div className="row  mx-auto px-0    w-100" >
                <div className="col-6 col-md-6 col-lg-3 mt-4 mb-2 d-flex justify-content-center">
                  <div
                    className="card card-custom mb-2"
                    style={{ minHeight: "350px", maxWidth: "300px" }}
                  >
                    <div className="card-header-bg pt-1 px-0" style={{minHeight:'112px'}}>
                      <div className="card-icon">
                        <img
                          src="images/icons/15.png"
                          alt="List of Events Icon"
                        />
                      </div>
                      
                      <h4 className="card-title text-white text-center">
                        <a 
                          href="/clientCaseInfo"
                          className="card-link text-15"
                          // className="card-link mobile-hide"
                        >
                          <span  className="card-header-title text-15"
                        // style={{ margin: "0 0 0 calc(17% )" }}
                      >
                         
                          1.
                         
                      </span> Client & Case Information
                        </a>
                        {/* <span className="mobile-show">
                          Client & Case Information
                        </span> */}
                      </h4>
                    </div>
                    <div className="card-body mt-0 px-1">
                      <ul className="list-unstyled mb-3 text-center">
                        <li>
                          {/* <li className="mobile-hide"> */}
                          <a href="/clientcaseinformation?1">
                            <div class="card mb-0">
                              <div class="px-2 pt-0 pb-0 card-text">
                                <strong style={{ fontSize: "13px" }}>
                                  Client Management
                                </strong>
                              </div>
                            </div>
                          </a>
                        </li>
                        <li>
                          {/* <li className="mobile-hide"> */}
                          <a href="/clientcaseinformation?2">
                            <div class="card mb-0">
                              <div class="px-2 pt-0 pb-0 card-text">
                                <strong style={{ fontSize: "13px" }}>
                                  Case Management
                                </strong>
                              </div>
                              
                            </div>
                          </a>
                        </li>
                        <li className="">
                          <a href="/clientcaseinformation?3">
                            <div class="card mb-0">
                              <div class="px-2 pt-0 pb-0 card-text">
                                <strong style={{ fontSize: "13px" }}>
                                  Case Hearing Diary
                                </strong>
                              </div>
                            </div>
                          </a>
                        </li>

                        <li>
                          <a href="/clientcaseinformation?4">
                            <div class="card mb-0">
                              <div class="px-2 pt-0 pb-0 card-text">
                                <strong style={{ fontSize: "13px" }}>
                                  Billing & Payments
                                </strong>
                              </div>
                            </div>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-6 col-md-6 col-lg-3 mt-4 mb-2 d-flex justify-content-center">
                  <div
                    className="card card-custom mb-2"
                    style={{ minHeight: "350px", maxWidth: "300px" }}
                  >
                    <div className="card-header-bg pt-1 px-0" style={{minHeight:'112px'}}>
                      <div className="card-icon">
                        <img
                          src="images/icons/13.png"
                          alt="Problem Info Icon"
                        />
                      </div>
                      

                      <h4 className="card-title text-white text-center">
                        <a
                          href="/casepreparation1"
                          className="card-link text-16"
                          // className="card-link mobile-hide"
                        >
                          <span
                        className="card-header-title ltr-space"
                      >
                          2. 
                      </span>{" "}
                          Case<br></br>Preparation
                        </a>
                        {/* <span className="mobile-show">Case Preparation</span> */}
                      </h4>
                    </div>
                    <div className="card-body mt-0 px-1">
                      <ul className="list-unstyled mb-3 text-center">
                        <li>
                          <a href="/Casepreparations?1">
                            <div class="card mb-0">
                              <div class="px-2 pt-0 pb-0 card-text">
                                <strong style={{ fontSize: "13px" }}>
                                  Problem Info
                                </strong>
                              </div>
                              
                            </div>
                          </a>
                        </li>

                        <li>
                          {/* <li className="mobile-hide"> */}
                          <a href="/Casepreparations?2">
                            <div class="card mb-0">
                              <div class="px-2 pt-0 pb-0 card-text">
                                <strong style={{ fontSize: "13px" }}>
                                  Research
                                </strong>
                              </div>
                            </div>
                          </a>
                        </li>

                        <li>
                          {/* <li className="mobile-hide"> */}
                          <a href="/Casepreparations?3">
                            <div class="card mb-0">
                              <div class="px-2 pt-0 pb-0 card-text">
                                <strong style={{ fontSize: "13px" }}>
                                  List of Events
                                </strong>
                              </div>
                              
                            </div>
                          </a>
                        </li>

                        <li>
                          {/* <li className="mobile-hide"> */}
                          <a href="/Casepreparations?4">
                            <div class="card mb-0">
                              <div class="px-2 pt-0 pb-0 card-text">
                                <strong style={{ fontSize: "13px" }}>
                                  Drafting
                                </strong>
                              </div>
                              
                            </div>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="col-6 col-md-6 col-lg-3 mt-4 mb-2 d-flex justify-content-center">
                  <div
                    className="card card-custom mb-2"
                    style={{ minHeight: "350px", maxWidth: "300px" }}
                  >
                    <div className="card-header-bg pt-1 px-0" style={{minHeight:'112px'}}>
                      <div className="card-icon">
                        <img src="images/icons/14.png" alt="Research Icon" />
                      </div>
                      
                      <h4 className="card-title text-white text-center">
                        <a
                          href="/documentmanagment"
                          className="card-link text-16"
                          // className="card-link mobile-hide"
                        >
                          <span
                        className="card-header-title ltr-space"
                      >
                          3. 
                      </span>{" "}
                          Document<br></br>Management
                        </a>
                        {/* <span className="mobile-show">Document Management</span> */}
                      </h4>
                    </div>
                    <div className="card-body px-1 mt-0">
                      <ul className="list-unstyled mb-3 text-center">
                        <li>
                          {/* <li className="mobile-hide"> */}
                          <a href="/documentmanagments?1">
                            <div class="card mb-0">
                              <div class="px-2 pt-0 pb-0 card-text">
                                <strong style={{ fontSize: "13px" }}>
                                  Filled Documents
                                </strong>
                              </div>
                               
                            </div>
                          </a>
                        </li>
                        <li>
                          {/* <li className="mobile-hide"> */}
                          <a href="/documentmanagments?2">
                            <div class="card mb-0">
                              <div class="px-2 pt-0 pb-0 card-text">
                                <strong style={{ fontSize: "13px" }}>
                                  External Records
                                </strong>
                              </div>
                               
                            </div>
                          </a>
                        </li>
                        <li>
                          {/* <li className="mobile-hide"> */}
                          <a href="/documentmanagments?3">
                            <div class="card mb-0">
                              <div class="px-2 pt-0 pb-0 card-text">
                                <strong style={{ fontSize: "13px" }}>
                                  All Records
                                </strong>
                              </div>
                               
                            </div>
                          </a>
                        </li>

                        <li>
                          <a href="/documentmanagments?4">
                            <div class="card mb-0">
                              <div class="px-2 pt-0 pb-0 card-text">
                                <strong style={{ fontSize: "13px" }}>
                                  Online Filing
                                </strong>
                              </div>
                               
                            </div>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="col-6 col-md-6 col-lg-3 mt-4 mb-2 d-flex justify-content-center">
                  <div
                    className="card card-custom mb-2"
                    style={{ minHeight: "350px", maxWidth: "300px" }}
                  >
                    <div className="card-header-bg pt-1 px-0" style={{minHeight:'112px'}}>
                      <div className="card-icon">
                        <img src="images/icons/16.png" alt="Drafting Icon" width={'50px'} />
                      </div>
                      
                      <h4 className="card-title text-white text-center">
                        <a
                          href="/judgementCourtFee?1"
                          className="card-link text-16"
                          // className="card-link mobile-hide"
                        >
                          <span
                        className="card-header-title ltr-space"
                      >
                          4.
                      </span>{" "}
                          Others
                        </a>
                        {/* <span className="mobile-show">Others</span> */}
                      </h4>
                    </div>
                    <div className="card-body px-1 mt-0">
                      <ul className="list-unstyled mb-3 text-center"> 
                        

                        <li>
                          <a
                            href="/judgmentcourtfees?2"
                            // target="_blank"
                            rel="noopener noreferrer"
                          >
                            <div class="card mb-0">
                              <div class="px-2 pt-0 pb-0 card-text">
                                <strong style={{ fontSize: "13px" }}>
                                  Judgement Search
                                </strong>
                              </div>
                               
                            </div>
                          </a>
                        </li>

                        
                        <li>
                          {/* <li className="mobile-hide"> */}
                          <a
                            href="#"
                            // href="/judgmentcourtfees?3"
                            // target="_blank"
                            // rel="noopener noreferrer"
                          >
                            <div class="card mb-0">
                              <div class="px-2 pt-0 pb-0 card-text">
                                <strong
                                  style={{ fontSize: "13px" }}
                                  onClick={() => handleRaiseConcern(userData)}
                                >
                                  {/* Knowledge Bank */}
                                  Raise Your Concern
                                </strong>
                              </div>
                               
                            </div>
                          </a>
                        </li>
                        <li>
                          <a
                          // href="/judgmentcourtfees"
                          >
                            {/* <a href="#"> */}
                            <div class="card mb-0">
                              <div class="px-2 pt-0 pb-0 card-text">
                                <strong
                                  style={{ fontSize: "13px", display: "block" }}
                                >
                                  Fee Calculator
                                  <span 
                                    style={{
                                      fontSize: "12px",
                                      display: "block",
                                    }}
                                  >
                                    (Coming Soon)
                                  </span>
                                </strong>
                              </div>
                               
                            </div>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
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
export default Casepreparation;
