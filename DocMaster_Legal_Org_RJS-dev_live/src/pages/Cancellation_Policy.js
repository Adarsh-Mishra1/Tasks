import React, { Suspense, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const Cancellation_Policy = () => {
  const location = useLocation();
  const aboutUsRef = useRef(null);
  const pricingRef = useRef(null);
  const careerRef = useRef(null);
  const faqRef = useRef(null);
  const feedbackRef = useRef(null);
  const contactUsRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
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

  return (
    <Suspense fallback={<>Loading...</>}>
      <div className="main_container">
        <div className="mt-" style={{ height: "100%", overflowY: "auto" }}>
          <nav
            className="navbar navbar-expand-lg navbar-light bg-white px-4 py-0"
            style={{
              position: " ",
              width: "100%",
              top: "0",
              background: "#FFF",
              zIndex: "9",
            }}
          >
            <div className="container-fluid">
               
              <a className="navbar-brand w-100 home-nav-sec ms-auto" href="/">
                <img
                  src="images/logo/docmaster.png"
                  alt="Logo"
                  className="logo img-fluid"
                />
              </a>
            </div>
          </nav>

          {/* About Us section */}
          <section
            id="about-us-section"
            className="about-us-section py-4  px-5"
          >
            <div className="container" style={{ width: "90%" }}>
              <div className="row">
                <div className="col-md-12 text-center">
                  <img
                    src="./images/shopping-list.png"
                    style={{ width: "80px" }}
                    alt=""
                  />
                </div>
                {/* <div className="col-md-1"></div> */}
                <div className="col-md-12">
                  <h3 className="text-center text-blue">
                    <b className="border-b">Cancellation Policy</b>
                  </h3>
                  <p className="text-16 text-justify text-black">
                    At DocMaster we aim to extend the best of the services to meet your professional requirements. We do not have any refund policy except as with only a few of the exceptions. One of them is technical. If you experience ongoing technical issues that prevent you from accessing the services and our support team is unable to resolve the problem within a reasonable time frame . The other is service disruption where a significant, extended disruption of services by DocMaster and you are unable to access your account for a prolonged period.
                  </p>

                  {/* <p className="text-16 text-justify text-black">
                    <strong>1. Subscription Cancellation</strong> You may cancel
                    your subscription to DocMaster at any time by logging
                    into your account and navigating to the subscription
                    settings. Upon cancellation, the following terms apply:
                  </p> */}
                  <p className="text-16 text-justify text-black">
                    <strong>No Refund for Unused Services - </strong> If you choose to cancel your subscription or downgrade your plan, no refunds or credits will be given for any unused portion of the subscription. You will have access to the services until the end of the billing period you paid for.
                  </p>

                  <p className="text-16 text-justify text-black">
                    All refund requests are subject to review and approval by
                    our team. If approved, the refund will be issued to the
                    original payment method used.
                  </p>

                  <p className="text-16 text-justify text-black">
                    <strong>Termination by DocMaster - </strong> DocMaster reserves the right to suspend or terminate any account at any time if we suspect misuse of any nature including illegitimate or violations of our Terms and Conditions. In such cases, no refunds will be eligible for the remaining subscription period.
                  </p>
                   

                   
                </div>
              </div>
            </div>
          </section><br></br><br></br><br></br><br></br><br></br>

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
    </Suspense>
  );
};

export default Cancellation_Policy;
