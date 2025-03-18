import React, { Suspense } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import CardContents from "./cardcontent";
import Footer from "../components/Footer";
const clientcaseinfo = () => {
  return (
    <>
      <Suspense fallback={<>Loading...</>}>
        <div className="main_container login">
          <Navbar />
          <Sidebar />

          <div className="right_col ps-3 pe-3 d-flex align-items-start justify-content-between flex-column" role="main" style={{overflowY:'auto',overflowX:'hidden',marginRight:"0", height:"100vh"}}>
              {/* <div className="d-flex align-content-start w-100"><p>&nbsp;</p></div> */}
              <div className=" d-flex align-content-center w-100">
                <div className="row h-100 mt-3 w-100">
                  <div className="col-md-12 col-sm-12  ">
                    <div className="x_panel">
                      <div className="x_content">
                        <div className="row  py-4">
                          {/* Clients Management */}
                          <div className="col-md-6 card-col col-lg-3 my-4 d-flex justify-content-center">
                            <div className="card card-custom" style={{minHeight:"350px",maxWidth:"300px"}}>
                              <a
                                href="/clientcaseinformation?1"
                                className="card-link"
                              >
                                <div className="card-header-bg pt-4">
                                  <div className="card-icon">
                                    <img
                                      src="images/icons/14.png"
                                      alt="Research Icon"
                                    />
                                  </div>
                                  {/* <h1 className="card-header-title" style={{margin:"0 0 0 calc(18% - 15px)"}}>2</h1> */}
                                  <h4 className="card-title text-white pt-2 text-center">
                                    Client Management
                                  </h4>
                                </div>
                                <div className="card-body mb-4">
                                  <h4><CardContents cardId={6} /></h4>
                                </div>
                              </a>
                            </div>
                          </div>

                          {/* Case Management */}
                          <div className="col-md-6 card-col col-lg-3 my-4 d-flex justify-content-center">
                            <div className="card card-custom" style={{minHeight:"350px",maxWidth:"300px"}}>
                              <a
                                href="/clientcaseinformation?2"
                                className="card-link"
                              >
                                <div className="card-header-bg pt-4">
                                  <div className="card-icon">
                                    <img
                                      src="images/icons/15.png"
                                      alt="List of Events Icon"
                                    />
                                  </div>
                                  {/* <h1 className="card-header-title" style={{margin:"0 0 0 calc(18% - 15px)"}}>3</h1> */}
                                  <h4 className="card-title text-white pt-2 text-center">
                                    Case Management
                                  </h4>
                                </div>
                                <div className="card-body mb-4">
                                <h4><CardContents cardId={5} /></h4>
                                </div>
                              </a>
                            </div>
                          </div>

                          {/* Case Hearing Diary */}
                          <div className="col-md-6 card-col col-lg-3 my-4 d-flex justify-content-center">
                            <div className="card card-custom" style={{minHeight:"350px",maxWidth:"300px"}}>
                              <a
                                href="/clientcaseinformation?3"
                                className="card-link"
                              >
                                <div className="card-header-bg pt-4">
                                  <div className="card-icon">
                                    <img
                                      src="images/icons/13.png"
                                      alt="Problem Info Icon"
                                    />
                                  </div>
                                  {/* <h1 className="card-header-title" style={{margin:"0 0 0 calc(17% - 15px)"}}>1</h1> */}
                                  <h4 className="card-title text-white pt-2 text-center">
                                  Case Hearing Diary
                                  </h4>
                                </div>
                                <div className="card-body mb-4">
                                <h4><CardContents cardId={7} /></h4>
                                </div>
                              </a>
                            </div>
                          </div>

                          {/* Billing & Payments */}
                          <div className="col-md-6 card-col col-lg-3 my-4 d-flex justify-content-center">
                            <div className="card card-custom" style={{minHeight:"350px",maxWidth:"300px"}}>
                              <a
                                href="/clientcaseinformation?4"
                                className="card-link"
                              >
                                <div className="card-header-bg pt-4">
                                  <div className="card-icon">
                                    <img
                                      src="images/icons/16.png"
                                      alt="Drafting Icon"
                                    />
                                  </div>
                                  {/* <h1 className="card-header-title" style={{margin:"0 0 0 calc(19% - 15px)"}}>4</h1> */}
                                  <h4 className="card-title text-white pt-2 text-center">
                                    Billing & Payments
                                  </h4>
                                </div>
                                <div className="card-body mb-4">
                                <h4><CardContents cardId={8} /></h4>
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
              <div className="d-flex align-content-end w-100">
                <Footer />
              </div>
             
          </div>
        </div>
        
      </Suspense>
    </>
  );
};
export default clientcaseinfo;
