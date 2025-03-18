import React, { Suspense, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const doc_master_leagal_in = () => {
  // Ref to access the video element
  //   const videoRef = useRef(null);

  // State to track whether the video is playing
  //   const [isPlaying, setIsPlaying] = useState(false);

  // Function to handle play/pause toggle
  //   const togglePlayPause = () => {
  //     if (videoRef.current) {
  //       if (isPlaying) {
  //         videoRef.current.pause();
  //       } else {
  //         videoRef.current.play();
  //       }
  //       setIsPlaying(!isPlaying);
  //     }
  //   };
  return (
    <Suspense fallback={<>Loading...</>}>
      <div
        className="main_container"
        tyle={{ height: "100vh", overflowY: "auto" }}
      >
        <div
          id="navbarNav"
          className=" "
          style={{ height: "100vh", overflowY: "auto" }}
        >
          <nav class="navbar navbar-expand-lg navbar-light bg-white">
            <div class="container-fluid">
              <a className="navbar-brand ms-auto" href="#">
                <img
                  src="images/logo/docmaster.png"
                  alt="Logo"
                  className="logo img-fluid"
                />
              </a>
              <button
                class="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span class="navbar-toggler-icon"></span>
              </button>
              <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      About Us
                    </a>
                  </li>
                  {/* <li className="nav-item">
                    <a className="nav-link" href="#">
                      Feedback
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      Pricing
                    </a>
                  </li> */}
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      Career
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      Contact Us
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      FAQ
                    </a>
                  </li>
                </ul>
                <ul class="mb-0 d-flex   list-unstyled gap-2 justify-center">
                  <li>
                    <button class="btn btn-white btn-sm m-0" type="submit">
                      Sign In
                    </button>
                  </li>
                  <li>
                    <button
                      class="btn bg-black btn-dark btn-sm m-0"
                      type="submit"
                    >
                      Sign Up Free
                    </button>
                  </li>
                  <li>
                    <button class="btn btn-white btn-sm m-0">
                      <img
                        className="img-fluid"
                        width={22}
                        src="images/user-circle.png"
                      />
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
          
          <section id="cards-section" className="my-5 px-5">
            <div className="container">
              <div className="row w-100">
                <div className="col-md-12 text-center mb-2">
                  <h1 className="text-black text-75 "><b>Document Creation Redefined</b></h1>
                  {/* <p className="text-black text-40 mb-5">Create all types of documents</p> */}
                </div>
                <div className="col-md-12 d-flex gap-2 px-5 w-100">
                  <div className="col-auto width-5 d-flex align-items-end">
                    <div className="align-base  align-text-bottom gap-2">
                      <a href="#" target="_blank">
                        <div className="mt-2 p-relative">
                          <p className="p-absolute text-white text-20 mb-0 for-day font-w-400">
                            For Day to<br></br>
                            Day Use{" "}
                          </p>{" "}
                          <img
                            className="img-fluid"
                            src="images/docM/1.png"
                          />{" "}
                        </div>
                      </a>
                      <a href="#" target="_blank">
                        <div className="mt-2 p-relative">
                          <p className="p-absolute text-white text-20 mb-0 propert font-w-400">
                            Property
                            <br />
                            Documents{" "}
                          </p>{" "}
                          <img className="img-fluid" src="images/docM/3.png" />
                        </div>
                      </a>
                    </div>
                  </div>
                  <div className="d-flex align-items-end col-auto width-5">
                    <div className="  align-text-bottom">
                      <a href="#" target="_blank">
                        <div className="d-flex align-text-bottom mt-2 p-relative">
                          <p className="p-absolute edu text-white text-20 font-w-400 top-25% left-15%">
                            Educational
                            <br />
                            Institutions{" "}
                          </p>
                          <img
                            className="img-fluid"
                            src="images/docM/2.png"
                          />{" "}
                        </div>
                      </a>
                      <a href="#" target="_blank">
                        <div className="d-flex align-text-bottom mt-2 p-relative">
                          <p className="p-absolute publi-c text-white text-20 font-w-400">
                            Public
                            <br />
                            Complaints
                          </p>
                          <img className="img-fluid" src="images/docM/4.png" />
                        </div>
                      </a>
                    </div>
                  </div>
                  <div className="d-flex align-items-end col-auto width-5">
                    <a href="#" target="_blank">
                      <div className="mt-2 p-relative">
                        <p className="p-absolute text-white text-20 mb-0 posh font-w-400">
                          PoSH <br /> Prevention of
                          <br />
                          Sexual <br />
                          Harassment
                          <br />
                        </p>
                        <img className="img-fluid" src="images/docM/5.png" />
                      </div>
                    </a>
                  </div>
                  <div className="d-flex align-items-end col-auto width-5">
                    <div className="  align-text-bottom">
                      <a href="#" target="_blank">
                        <div className="mt-2 p-relative">
                          <p className="p-absolute text-white text-20 mb-0 for-ca font-w-400">
                            For CA/CS{" "}
                          </p>
                          <img className="img-fluid" src="images/docM/6.png" />
                        </div>
                      </a>
                      <a href="#" target="_blank">
                        <div className="mt-2 p-relative">
                          <p className="p-absolute text-white text-20 mb-0 for-gov font-w-400">
                            For Govt. Offices
                          </p>
                          <img className="img-fluid" src="images/docM/7.png" />
                        </div>
                      </a>
                    </div>
                  </div>
                  <div className="d-flex align-items-end col-auto width-5">
                    <div className="  align-text-bottom">
                      <a href="#" target="_blank">
                        <div className="mt-2 p-relative">
                          <p className="p-absolute text-white text-20 mb-0 for-legal font-w-400">
                            Legal
                            <br />
                            Documents
                          </p>
                          <img className="img-fluid" src="images/docM/8.png" />
                        </div>
                      </a>
                      <a href="#" target="_blank">
                        <div className="mt-2 p-relative">
                          <p className="p-absolute text-white text-20 mb-0 for-hr-doc font-w-400">
                            HR Documents
                          </p>
                          <img className="img-fluid" src="images/docM/9.png" />
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            style={{ minHeight: "100vh" }}
            id="home  "
            className="about-us-section py-5 px-5"
          >
            <div className="container ps-3 ps-4 pt-4 pe-4 pb-4 pe-5">
              <div className="row d-flex justify-content-center py-5">
                <div className="col-md-6 align-content-center text-start mb-3" >
                  <h1 className="text-black text-50 uppercase">
                    <strong>HAVE YOU CHECKED  OUR LEGAL MODULE  YET?</strong>
                  </h1>
                </div>
                <div className="col-md-6 text-center">
                  <div className="video-sec">
                     <img src="images/docM/10.png" className="img-fluid"/>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                    <h2 className="text-40 text-black">We offer unique solutions for legal professionals where they can Create, Manage, Download case documents in a matter of a few minute</h2>
                </div>
              </div>
              <div className="row my-5">
                <div className="col-md-2 text-center"></div>
                    <div className="col-md-8 text-center">
                    <div className="video-sec py-5">
                        <iframe className="shadow-vd-bg"
                         
                        width="100%"
                        height="450"
                        src="https://www.youtube.com/embed/EngW7tLk6R8?si=yVyu_bZgLmf2gi9W&amp;controls=0"
                        title="YouTube video player"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerpolicy="strict-origin-when-cross-origin"
                        allowfullscreen
                        ></iframe>
                        </div>
                    </div>
                </div>
                <div className="row mb-5 mt-4">
                    <div className="col-md-12 text-center mt-5 "><button className="text-35 btn btn-lg btn-primary px-5 py-0">Free Trail</button></div>
                </div>
                
            </div>
          </section>
          {/* About Us section */}
          <section
            style={{ minHeight: "100vh" }}
            id="home  "
            className="about-us-section py-5 pt-5 pb-5 ps-5"
          >
            <div
              className="container ps-3 ps-4 pt-4 pe-4 pb-4 pe-5"
              style={{
                backgroundImage: "url(images/docM/hero-bg-right1.png)",
                backgroundPosition: "right bottom",
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
              }}
            >
              <div className="row d-flex justify-content-center px-4 py-5">
                <div
                  className="col-md-6 text-start mb-3"
                  style={{
                    backgroundImage: "url(images/docM/world_map-2.png)",
                    backgroundPosition: "left",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "contain",
                  }}
                >
                  <h1 className="text-black">
                    <strong>Welcome</strong>
                  </h1>
                  <h4 className="mb-4 text-black">
                    <b>to the world of A to Z Documents</b>
                  </h4>
                  <p className="text-black">
                    <i
                      class="fa fa-check-circle"
                      aria-hidden="true"
                      style={{ color: "blue" }}
                    ></i>
                    &nbsp;Request by Parent for Issuing Bonafide Certificate
                  </p>
                  <p className="text-black">
                    <i
                      class="fa fa-check-circle"
                      aria-hidden="true"
                      style={{ color: "blue" }}
                    ></i>
                    &nbsp;Request by Parent for Issuing Bonafide
                  </p>
                  <p className="text-black">
                    <i
                      class="fa fa-check-circle"
                      aria-hidden="true"
                      style={{ color: "blue" }}
                    ></i>
                    &nbsp;Request by Parent for Issuing Bonafide Certificate
                  </p>
                  <button className="btn btn-md btn-danger mt-3">
                    Create your document
                  </button>
                </div>
                <div className="col-md-6 text-center">
                  <div className="video-sec">
                    <iframe className="shadow-vd-bg"
                      width="100%"
                      height="315"
                      src="https://www.youtube.com/embed/EngW7tLk6R8?si=yVyu_bZgLmf2gi9W&amp;controls=0"
                      title="YouTube video player"
                      frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerpolicy="strict-origin-when-cross-origin"
                      allowfullscreen
                    ></iframe>
                    {/* <video
                            // ref={videoRef}
                            width="600"
                            src="https://www.youtube.com/watch?v=EngW7tLk6R8&t=5s" // Replace with your video URL
                        /> */}

                    {/* <button onClick={togglePlayPause}>
                            {isPlaying ? 'Pause' : 'Play'}
                        </button> */}
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* FAQ Section */}
          <section
            id="faq-section"
            className="faq-section faq-new-temp pb-5 px-5"
             
          >
            <div className="container">
              <div className="row w-100 mt-5 pt-5">
                  <div className="col-md-12 text-center pt-5 mb-4">
                      <h1 className="text-black text-75 ">Frequently Asked Questions</h1>
                      <p className="text-black text-40 ">A to Z Documents</p>
                  </div>
              </div>
               
              <div class="accordion accordion-flush px-5" id="accordionFlushExample">
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
                      <strong>Q. </strong> What kind of services DocMaster.in
                      offers?
                    </button>
                  </h2>
                  <div
                    id="flush-collapseOne"
                    class="accordion-collapse collapse"
                    aria-labelledby="flush-headingOne"
                    data-bs-parent="#accordionFlushExample"
                  >
                    <div class="accordion-body">
                      <strong>A.</strong> DocMaster supports its users to
                      generate a wide range of documents instantly. These may be
                      for day to day use or for business usages. These include-
                      Legal, Correspondence, Compliances, Administration, HR,
                      Sales & Marketing or for professionals. A user can create
                      any document with simple steps be it a letter, notice,
                      application, complaint, agreement or report.
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
                      <strong>Q. </strong>Does DocMaster offer Legal advice?
                    </button>
                  </h2>
                  <div
                    id="flush-collapseTwo"
                    class="accordion-collapse collapse"
                    aria-labelledby="flush-headingTwo"
                    data-bs-parent="#accordionFlushExample"
                  >
                    <div class="accordion-body">
                      <strong>A.</strong> All our documents are created through
                      expert professionals but DocMaster is not a law firm. It
                      does not offer any Legal advice, the all information or
                      documents offered on our website is general in nature.
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
                      <strong>Q. </strong>How can I request a document required,
                      if not found on DocMaster ?
                    </button>
                  </h2>
                  <div
                    id="flush-collapseThree"
                    class="accordion-collapse collapse"
                    aria-labelledby="flush-headingThree"
                    data-bs-parent="#accordionFlushExample"
                  >
                    <div class="accordion-body">
                      <strong>A.</strong> You can send a request through
                      https://DocMaster.in/requestform, also when you type a
                      document on search bar and if the document is not there it
                      will automaticaly ask that if you wish to request this
                      document, this redirect you to Request Document page. We
                      keep on adding documents of our own or on the basis of
                      user’s feedback at regular intervals
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <footer className="bg-footer  text-dark py-4" id="new-temp-footer">
            <div className="container-fluid">
              <div className="row px-5">
                <div className="col-md-6">
                  <p className="mb-0 text-start d-flex align-items-center">
                  The user can create any document available on DocMaster.in
                  </p>
                </div>
                <div className="col-md-6 text-center">
                  <p className="mb-0 text-center d-flex justify-content-between d-flex align-items-center">
                    <span className="mx-1">
                      <a
                        href="#"
                        className="text-dark"
                        target="_blank"
                      >
                        Terms & Conditions
                      </a>
                    </span>
                    
                    <span className="mx-1">
                      <a
                        href="#"
                        className="text-dark"
                        target="_blank"
                      >
                        Disclaimer
                      </a>
                    </span>
                    
                    <span className="mx-1">
                      <a
                        href="#"
                        className="text-dark"
                        target="_blank"
                      >
                        Cancellation Policy
                      </a>
                    </span> |&nbsp;<span><ul className="mb-0 list-unstyled d-flex justify-content-between gap-2">
                        <li className="f-social-links" style={{background: "#2f2f2f",color:" #fff"}}><i class="fa fa-phone   " aria-hidden="true"></i></li>
                        <li className="f-social-links"><i class="fa fa-facebook  rounded" aria-hidden="true"></i></li>
                        <li className="f-social-links"><i class="fa fa-linkedin  rounded" aria-hidden="true"></i></li>
                        <li className="f-social-links"><i class="fa fa-instagram " aria-hidden="true"></i></li>
                    </ul></span>
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </Suspense>
  );
};

export default doc_master_leagal_in;
