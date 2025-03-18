import React, { useState, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import CardContents from "./cardcontent";
import { handleRaiseConcern } from "../OtherFunctions/OtherFunctions";
import userStore from "../zustand/userStore";
import Footer from "../components/Footer";
const judgmentcourtfee = () => {
  const { userData, setUser } = userStore((state) => ({
      userData: state.user,
      setUser: state.setUser,
    }));
  return (
    <>
      <Suspense fallback={<>Loading...</>}>
        <div className="main_container login">
          <Navbar />
          <Sidebar />

          <div
            className="right_col ps-3 pe-3 d-flex align-items-start justify-content-between flex-column"
            role="main"
            style={{ overflowY: "auto", overflowX: "hidden", marginRight: "0" }}
          >
            <div className="d-flex align-content-start w-100">
              <p>&nbsp;</p>
            </div>
            <div className=" d-flex align-content-center w-100">
              <div className="row   w-100">
                <div className="col-md-12 col-sm-12  ">
                  <div className="x_panel">
                    <div className="x_content">
                      <div className="row d-flex justify-content-center py-2">
                        <div className="col-md-6 card-cols col-lg-3 my-4 mobile-hide d-flex justify-content-center">
                          <div
                            className="card card-custom"
                            style={{ minHeight: "350px", maxWidth: "300px" }}
                          >
                            <a
                              // href="/judgmentcourtfees?1"
                              href="#"
                              className="card-link"
                            >
                              <div className="card-header-bg pt-4">
                                <div className="card-icon">
                                  <img
                                    src="images/icons/13.png"
                                    alt="Problem Info Icon"
                                  />
                                </div>
                                <h4 className="card-title text-white pt-2 text-center">
                                  Fees Calculator
                                </h4>
                              </div>
                              <div className="card-body mb-4">
                                <h4>
                                  {/* <CardContents cardId={17} /> */}
                                  Coming Soon
                                </h4>
                              </div>
                            </a>
                          </div>
                        </div>

                        <div className="col-md-6 card-cols col-lg-3 my-4 d-flex justify-content-center">
                          <div
                            className="card card-custom"
                            style={{ minHeight: "350px", maxWidth: "300px" }}
                          >
                            <a
                              href="judgmentcourtfees?2"
                              className="card-link"
                              rel="noreferrer"
                            >
                              <div className="card-header-bg pt-4">
                                <div className="card-icon">
                                  <img
                                    src="images/icons/14.png"
                                    alt="Research Icon"
                                  />
                                </div>
                                <h4 className="card-title text-white pt-2 text-center">
                                  Judgement Search
                                </h4>
                              </div>
                              <div className="card-body mb-4">
                                <h4>
                                  <CardContents cardId={18} />
                                </h4>
                              </div>
                            </a>
                          </div>
                        </div>

                        <div className="col-md-6 card-cols col-lg-3 my-4 d-flex justify-content-center">
                          <div
                            className="card card-custom"
                            style={{ minHeight: "350px", maxWidth: "300px" }}
                          >
                            {/* <a href="judgmentcourtfees?3" className="card-link"> */}
                            <a href="#" className="card-link" onClick={() => handleRaiseConcern(userData)}>
                              <div className="card-header-bg pt-4">
                                <div className="card-icon">
                                  <img
                                    src="images/icons/12.png"
                                    alt="Research Icon"
                                  />
                                </div>
                                <h4 className="card-title text-white pt-2 text-center">
                                  Raise Your Concern
                                </h4>
                              </div>
                              <div className="card-body mb-4">
                                <h4>
                                  {/* <CardContents cardId={19} /> */}
                                  Report your concerns and issues related to the functionality of the application for quick resolution. 
                                </h4>
                              </div>
                            </a>
                          </div>
                        </div>
                        <div className="col-md-6 card-cols col-lg-3 my-4 d-flex justify-content-center">
                          <div
                            className="card card-custom"
                            style={{ minHeight: "350px", maxWidth: "300px" }}
                          >
                            <a href="#" className="card-link">
                              <div className="card-header-bg pt-4">
                                <div className="card-icon">
                                  <img
                                    src="images/icons/11.png"
                                    alt="Research Icon"
                                  />
                                </div>
                                <h4 className="card-title text-white pt-2 text-center">
                                  Knowledge Bank
                                </h4>
                              </div>
                              <div className="card-body text-center mb-4" style={{minHeight:"70px"}}>
                                <h4 className="text-center">
                                  <CardContents cardId={20} />
                                </h4>
                              </div>
                            </a>
                          </div>
                        </div>
                        
                        <div className="col-md-6 card-cols col-lg-3 my-4 mx-auto mobile-show ">
                          <div className="d-flex justify-content-center">
                          <div
                            className="card card-custom"
                            style={{ minHeight: "350px", maxWidth: "300px" }}
                          >
                            <a
                              // href="/judgmentcourtfees?1"
                              href="#"
                              className="card-link"
                            >
                              <div className="card-header-bg pt-4">
                                <div className="card-icon">
                                  <img
                                    src="images/icons/13.png"
                                    alt="Problem Info Icon"
                                  />
                                </div>
                                <h4 className="card-title text-white pt-2 text-center">
                                  Fees Calculator
                                </h4>
                              </div>
                              <div className="card-body mb-4 text-center" style={{minHeight:"70px"}}>
                                <h4 className="text-center">
                                  {/* <CardContents cardId={17} /> */}
                                  Coming Soon
                                </h4>
                              </div>
                            </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex align-content-end w-100">
              <Footer />
            </div>
          </div>
        </div>
      </Suspense>
    </>
  );
};
export default judgmentcourtfee;
