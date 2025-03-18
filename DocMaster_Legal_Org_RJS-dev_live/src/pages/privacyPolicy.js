import React, { Suspense, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const PrivacyPolicy = () => {
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
      {/* <div
        style={{
          width: "100%",
          margin: "auto",
          padding: "20px",
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          overflowY: "auto",
          maxHeight: "99vh",
          // marginInline: "50px",
          paddingInline: "350px",
        }}
      > */}
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
                    <b className="border-b">Our Commitment to your Privacy</b>
                  </h3>
                  <p className="text-16 text-black text-justify">
                    DocMaster is committed towards protecting its user privacy
                    and ensuring that every visit to its website remains
                    completely safe and secure. In line with our commitment to
                    transparency, this policy details what information is
                    collected or processed by us, this privacy policy remains
                    applicable to paid or free users.
                  </p>

                  <p className="text-16 text-black text-justify">
                    {" "}
                    <strong>Third Party - </strong>
                    Our website may contain links to third party websites. We
                    are not responsible for the privacy policy or the practices
                    of such third parties. This may include websites advertised
                    on our platform or any payment gateway service provider
                    portals. At all times, you are free to choose what
                    information you share or save with these third parties
                    without any notice to us. We may however, collect, store and
                    share aggregate and statistical data about user traffic,
                    analytics or trends etc. without any specific reference.
                  </p>

                  <p className="text-16 text-black text-justify">
                    {" "}
                    We may partner with third party advertising networks, like
                    well-known advertiser Google Adwords etc, to deal with our
                    publicising on different platforms. Our website and
                    advertising network may use cookies to gather non-personally
                    identifiable information about your activities on this and
                    other web destinations, to give you focused advertising
                    depending on your interests. If you wish to not have this
                    data utilised, you may quit by utilising the accompanying
                    connections, for example, Google's Opt-out etc. or by
                    setting your systems secure from such actions.
                  </p>

                  <p className="text-16 text-black text-justify">
                    {" "}
                    <strong>What Information We Collect - </strong>
                    We do not have a policy to collect users data for the
                    purpose of using it for any purpose other than serving our
                    users the desired services. Depending on the plans and usage
                    choices of our subscribers both free and paid, we offer
                    services where nothing is stored except in the enterprise or
                    higher versions where users opt or need to use edit and save
                    feature modules.
                  </p>

                  <p className="text-16 text-black text-justify">
                    {" "}
                    <strong>
                      Who we share your Personal Information with -{" "}
                    </strong>
                    We do not sell, exchange or lease your name, contact details
                    or any data to any other person. We may use some of the
                    information which is generally generic or public in nature
                    meant to generate statistical information or Artificial
                    Intelligence or to improve product’s experience, efficiency
                    and productivity of our users.
                  </p>
                  <p className="text-16 text-black text-justify">
                    Though the following paragraph stands null in normal
                    circumstances but being added for generally and for
                    exceptional circumstances, that DocMaster would not deliver
                    user’s data of any nature to a third party with only
                    exception, if it is legally necessary in line with the
                    reporting standards of the Country, by a Court order, on a
                    Court request, or Court summon. These are the information,
                    generally financials, about the number regarding enlisted
                    clients, number of interesting guests, and the pages most
                    often perused.
                  </p>

                  <p className="text-16 text-black text-justify">
                    {" "}
                    <strong>Servers - </strong>
                    DocMaster uses cloud services on third party servers. We are
                    committed to use the best of the methods to keep all the
                    data and servers safe, communicate in encrypted modes
                    always. Multi layer security systems are deployed.
                  </p>
                  <p className="text-16 text-black text-justify">
                    {" "}
                    <strong>
                      Document Preparation and Privacy of Information -{" "}
                    </strong>
                    The data you give when you prepare a document on our site is
                    held carefully classified or kept confidential. For your
                    assurance give a legitimate email address that won't block
                    email from DocMaster.
                  </p>
                </div>
              </div>
            </div>
          </section>
           
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

export default PrivacyPolicy;
