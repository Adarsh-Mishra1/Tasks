import React, { Suspense } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import CardContents from "./cardcontent";
import Footer from "../components/Footer";
const documentmanagmenet = () => {
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
            {/* <div className="d-flex align-content-start w-100">
              <p>&nbsp;</p>
            </div> */}
            <div className=" d-flex align-content-center w-100">
              <div className="row  mt-3 w-100">
                <div className="col-md-12 col-sm-12  ">
                  <div className="x_panel">
                    <div className="x_content">
                      <div className="row  pt-4">
                        <div className="col-md-6 card-col col-sm-6 col-xs-12 my-4 col-lg-3 text-center align-content-center justify-content-center d-flex">
                          <div
                            className="card card-custom"
                            style={{ minHeight: "350px", maxWidth: "300px" }}
                          >
                            <a
                              href="/documentmanagments?1"
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
                                  Filled Documents
                                </h4>
                              </div>
                              <div className="card-body mb-4">
                                <h4>
                                  {" "}
                                  <CardContents cardId={13} />
                                </h4>
                              </div>
                            </a>
                          </div>
                        </div>

                        <div className="col-md-6 card-col col-sm-6 col-xs-12 my-4 col-lg-3 text-center align-content-center justify-content-center d-flex">
                          <div
                            className="card card-custom"
                            style={{ minHeight: "350px", maxWidth: "300px" }}
                          >
                            <a
                              href="/documentmanagments?2"
                              className="card-link"
                            >
                              <div className="card-header-bg pt-4">
                                <div className="card-icon">
                                  <img
                                    src="images/icons/14.png"
                                    alt="Research Icon"
                                  />
                                </div>
                                <h4 className="card-title text-white pt-2 text-center">
                                  External Records
                                </h4>
                              </div>
                              <div className="card-body mb-4">
                                <h4>
                                  <CardContents cardId={14} />
                                </h4>
                              </div>
                            </a>
                          </div>
                        </div>

                        <div className="col-md-6 card-col col-sm-6 col-xs-12 my-4 col-lg-3 text-center align-content-center justify-content-center d-flex">
                          <div
                            className="card card-custom"
                            style={{ minHeight: "350px", maxWidth: "300px" }}
                          >
                            <a
                              href="/documentmanagments?3"
                              className="card-link"
                            >
                              <div className="card-header-bg pt-4">
                                <div className="card-icon">
                                  <img
                                    src="images/icons/15.png"
                                    alt="List of Events Icon"
                                  />
                                </div>
                                <h4 className="card-title text-white pt-2 text-center">
                                  All Records
                                </h4>
                              </div>
                              <div className="card-body mb-4">
                                <h4>
                                  <CardContents cardId={15} />
                                </h4>
                              </div>
                            </a>
                          </div>
                        </div>

                        <div className="col-md-6 card-col col-sm-6 col-xs-12 my-4 col-lg-3 text-center align-content-center justify-content-center d-flex">
                          <div
                            className="card card-custom"
                            style={{ minHeight: "350px", maxWidth: "300px" }}
                          >
                            <a
                              href="/documentmanagments?4"
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
                                  Online Filing
                                </h4>
                              </div>
                              <div className="card-body mb-4">
                                <h4>
                                  {" "}
                                  <CardContents cardId={16} />
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
            <div className="d-flex align-content-end w-100">
              <Footer />
            </div>
          </div>
        </div>
      </Suspense>
    </>
  );
};
export default documentmanagmenet;
