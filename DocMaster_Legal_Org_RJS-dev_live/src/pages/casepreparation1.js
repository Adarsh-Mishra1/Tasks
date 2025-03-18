import React, { useState, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import CardContents from "./cardcontent";
import Footer from "../components/Footer";
const casepreparation1 = () => {
  return (
    <>
      <Suspense fallback={<>Loading...</>}>
        <div className="main_container login">
          <Navbar />
          <Sidebar />

          <div className="right_col ps-3 pe-3 d-flex align-items-start justify-content-between flex-column" role="main" style={{overflowY:'auto',overflowX:'hidden',marginRight:"0"}}>
            <div className="d-flex align-content-start w-100"><p>&nbsp;</p></div>
            <div className=" d-flex align-content-center w-100">
              <div className="row h-100   w-100">
                <div className="col-md-12 col-sm-12  ">
                  <div className="x_panel">
                    <div className="x_content">
                      <div className="row  py-2">
                        <div className="col-md-6 card-col col-lg-3 my-4 d-flex justify-content-center">
                          <div className="card card-custom" style={{minHeight:"300px",maxWidth:"300px"}}>
                            <a href="Casepreparations?1" className="card-link">
                              <div className="card-header-bg pt-4">
                                <div className="card-icon">
                                  <img
                                    src="images/icons/13.png"
                                    alt="Problem Info Icon"
                                  />
                                </div>
                                {/* <h1 className="card-header-title" style={{margin:"0 0 0 calc(17% - 15px)"}}>1</h1> */}
                                <h4 className="card-title text-white pt-2 text-center">
                                  Problem Info
                                </h4>
                              </div>
                              <div className="card-body mb-4">
                                <h4><CardContents cardId={9} /></h4>
                              </div>
                            </a>
                          </div>
                        </div>

                        <div className="col-md-6  card-col col-lg-3 my-4 d-flex justify-content-center">
                          <div className="card card-custom" style={{minHeight:"300px",maxWidth:"300px"}}>
                            <a href="Casepreparations?2" className="card-link">
                              <div className="card-header-bg pt-4">
                                <div className="card-icon">
                                  <img
                                    src="images/icons/14.png"
                                    alt="Research Icon"
                                  />
                                </div>
                                {/* <h1 className="card-header-title" style={{margin:"0 0 0 calc(18% - 15px)"}}>2</h1> */}
                                <h4 className="card-title text-white pt-2 text-center">
                                  Research
                                </h4>
                              </div>
                              <div className="card-body mb-4">
                              <h4><CardContents cardId={10} /></h4>
                              </div>
                            </a>
                          </div>
                        </div>

                        <div className="col-md-6 card-col col-lg-3 my-4 d-flex justify-content-center">
                          <div className="card card-custom" style={{minHeight:"300px",maxWidth:"300px"}}>
                            <a href="Casepreparations?3" className="card-link">
                              <div className="card-header-bg pt-4">
                                <div className="card-icon">
                                  <img
                                    src="images/icons/15.png"
                                    alt="List of Events Icon"
                                  />
                                </div>
                                {/* <h1 className="card-header-title" style={{margin:"0 0 0 calc(18% - 15px)"}}>3</h1> */}
                                <h4 className="card-title text-white pt-2 text-center">
                                  List of Events
                                </h4>
                              </div>
                              <div className="card-body mb-4">
                              <h4><CardContents cardId={11} /></h4>
                              </div>
                            </a>
                          </div>
                        </div>

                        <div className="col-md-6 card-col col-lg-3 my-4 d-flex justify-content-center">
                          <div className="card card-custom" style={{minHeight:"300px",maxWidth:"300px"}}>
                            <a href="Casepreparations?4" className="card-link">
                              <div className="card-header-bg pt-4">
                                <div className="card-icon">
                                  <img
                                    src="images/icons/16.png"
                                    alt="Drafting Icon"
                                  />
                                </div>
                                {/* <h1 className="card-header-title" style={{margin:"0 0 0 calc(19% - 15px)"}}>4</h1> */}
                                <h4 className="card-title text-white pt-2 text-center">
                                  Drafting
                                </h4>
                              </div>
                              <div className="card-body mb-4">
                              <h4><CardContents cardId={12} /></h4>
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
            <div className="d-flex align-content-end w-100"><Footer /></div>
          </div>
        </div>
        
      </Suspense>
    </>
  );
};
export default casepreparation1;
