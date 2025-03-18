import React, { Suspense, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const Terms_and_Conditions = ({
  navBar = true,
  isOpen,
  agree,
  onAgreeChange,
}) => {
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

  const handleCheckboxChange = (event) => {
    onAgreeChange(event.target.checked);
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
          {navBar && (
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
          )}

          {/* About Us section */}
          <section id="about-us-section" className="about-us-section py-4 px-5">
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
                    <b className="border-b">Terms and Conditions</b>
                  </h3>

                  <p className="text-16 text-black text-justify">
                    <strong>License and Access - </strong>
                    DocMaster grants you a limited license to access and use
                    website subject to the Terms, as applicable from time to
                    time. The website and any portion thereof should not be
                    reproduced, duplicated, copied, downloaded, sold, resold,
                    visited, or otherwise exploited for any commercial purpose
                    without the express written consent of DocMaster. Any
                    unauthorized use terminates the license granted by
                    DocMaster.
                  </p>
                  <p className="text-16 text-black text-justify">
                    <strong>Limitation of Liability - </strong>
                    The website is for use of "As is" and "As available" basis.
                    DocMaster makes no representations or warranties of any
                    kind, express or implied otherwise stated, as to the
                    operation of this site, or the information, content or
                    materials included on this site. You expressly agree that
                    your use of this site is at your sole choice.
                  </p>
                  <p className="text-16 text-black text-justify">
                    <strong>Acceptable use - </strong>
                    You agree to use the services of DocMaster for lawful,
                    personal or professional use of yourself or particular
                    client (as the case may be) only and not for any prohibited
                    purpose. Prohibited purpose includes but shall not be
                    limited to harass abuse or threaten any other persons,
                    Violate any person’s legal rights, Violate any Intellectual
                    Property Rights of DocMaster or any third party, Publish or
                    distribute any obscene or defamatory matter on the website,
                    Perpetrate any fraud and any other act prohibited by the
                    law.
                  </p>

                  <p className="text-16 text-black text-justify">
                    <strong> Binding Effect - </strong>
                    This Agreement shall be binding upon and shall ensure to the
                    benefit of each Party and to its respective successors or
                    permitted assigns.
                  </p>
                  <p className="text-16 text-black text-justify">
                    <strong> Severability - </strong>
                    The invalidity or unenforceability of any provision of this
                    Agreement shall not affect the validity or enforceability of
                    any other provision.
                  </p>
                  <p className="text-16 text-black text-justify">
                    <strong> Voluntary Execution of Agreement - </strong>
                    The user acknowledges that they have read this terms and
                    documents and voluntarily in agreement without duress and
                    full knowledge of their legal significance and understands
                    the consequences of further changes with its software
                    releases at later stages and fully aware of the legal and
                    binding effect of this agreement.
                  </p>

                  <p className="text-16 text-black text-justify">
                    <strong> Governing Language - </strong>
                    This Agreement has been executed in the English language,
                    which shall be the official language for the construction
                    and interpretation of this Agreement and all notices,
                    agreements, documents, and instruments contemplated
                    hereunder, and the medium of communication thereunder. This
                    Agreement may be translated into any language other than
                    English provided, however, that the English version shall
                    always prevail.
                  </p>
                  <p className="text-16 text-black text-justify">
                    {" "}
                    <strong> Governing Law and Dispute Settlement - </strong>
                    This Agreement shall be governed by and construed in
                    accordance with the laws of the India. Any dispute arising
                    out of or in connection with this Agreement shall be finally
                    settled by the competent courts of New Delhi, India.
                  </p>
                  <p className="text-16 text-black text-justify">
                    <strong>No Legal Relationship - </strong> Nothing in this
                    Agreement shall be construed to create an employer-
                    employee, lawyer-client or any such relationship between
                    user of the Website and DocMaster.
                  </p>
                </div>
              </div>
            </div>
            {isOpen && (
              <div className="d-flex justify-content-center">
                <div className="form-check mb-2 ps-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="termsConditions"
                    checked={agree}
                    onChange={handleCheckboxChange}
                    required
                  />
                  <label className="form-check-label" htmlFor="termsConditions">
                    <b>I agree to the&nbsp;Terms & Conditions</b>
                  </label>
                </div>
              </div>
            )}
          </section>

          {navBar && (
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
          )}
        </div>
      </div>
    </Suspense>
  );
};

export default Terms_and_Conditions;
