import React, { Suspense, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const ipr_copyright_page = () => {
  return (
    <Suspense fallback={<>Loading...</>}>
      <div className="main_container">
        <div className="mt-4" style={{ height: "100%", overflowY: "auto" }}>
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
                    <b className="border-b">
                      Intellectual Property Rights (IPR) and Copyright Policy
                    </b>
                  </h3>
                  <p className="text-16 text-black text-justify">
                    This Intellectual Property Rights (IPR) and Copyright Policy
                    outlines how intellectual property, including copyrights,
                    trademarks, and other proprietary rights are managed on
                    DocMaster ("The Website"). By using “The Website”, you
                    acknowledge and agree to the terms outlined below.
                  </p>

                  <p className="text-16 text-black text-justify">
                    <strong>Ownership of Intellectual Property - </strong>{" "}
                    All content and materials available on DocMaster including
                    but not limited to text, designs, graphics, logos, icons,
                    software, documents, templates, and other resources
                    (collectively, "Content"), are the exclusive property of
                    DocMaster, its associates or its licensors unless otherwise
                    expressly defined. The Contents of all types are protected
                    by copyright, trademark, and other intellectual property
                    laws.
                  </p>
                  <p className="text-16 text-black text-justify">
                    Except for the purpose and mutual terms for the use of “The
                    Website” subscribed, no one can reproduce, distribute,
                    modify, display, perform, or transmit any content without
                    the prior written permission of DocMaster or the respective
                    intellectual property holders.
                  </p>

                  <p className="text-16 text-black text-justify">
                    <strong>Copyright Infringement and DMCA Policy - </strong>
                    DocMaster respects the intellectual property rights of
                    others and expects our users to do the same. If you believe
                    that any content on “The Website” infringes any one’s
                    copyright or intellectual property rights, you may submit a
                    notification under the Digital Millennium Copyright Act
                    (DMCA) or equivalent legislation. The team DocMaster will
                    ensure to check the information and to take necessary
                    corrective measures wherever required.
                  </p>
                  <p className="text-16 text-black text-justify">
                    The notification such made to be sent to <a href="info@docmaster.in" target="_blank"> <u>info@docmaster.in </u></a>{" "}
                    and must be in detail including Identification of the
                    material that is claimed to be infringing or the subject of
                    infringing activity and that is to be removed or access to
                    which is to be disabled, and information reasonably
                    sufficient to permit us to locate the material. Sender’s
                    contact information, including your name, address,
                  </p>

                  <p className="text-16 text-black text-justify">
                    Upon receipt of notification, DocMaster will take
                    appropriate steps within a period of 60 days.
                  </p>
                  <p className="text-16 text-black text-justify">
                    <strong>Prohibitions to use Content - </strong> Using any of
                    the Content from DocMaster for commercial purposes, Creating
                    derivative works from the Content. Distributing, reselling,
                    or sublicensing the Content in any manner inconsistent with
                    these Terms or applicable law without prior written consent
                    are strictly prohibited.{" "}
                  </p>

                  <p className="text-16 text-black text-justify">
                    <strong>Third-Party Intellectual Property - </strong>{" "}
                    DocMaster respects the intellectual property rights of all.
                    The content available on the Website, if sourced from
                    third-party creators or services, all efforts are made to
                    attribute the content to its rightful owner and abide by the
                    licensing terms. If you notice that any third-party
                    intellectual property has been used without proper
                    attribution or permission, please notify us immediately to
                    help rectify the mistake.
                  </p>

                  <p className="text-16 text-black text-justify">
                    <strong>Modifications to the Policy - </strong> DocMaster
                    reserves the right to modify this IPR and Copyright Policy
                    at any time. Any changes will be effective immediately upon
                    posting to “The Website”. It is your responsibility to
                    review this policy periodically to remain informed about
                    updates.
                  </p>
                  <p className="text-16 text-black text-justify">
                    If you have any questions or concerns regarding this IPR and
                    Copyright Policy, Please contact{" "}
                    <a href="support@docmaster.in" target="_blank">
                      <u> info@docmaster.in</u>
                    </a>
                  </p>
                  {/* <p className="text-16 text-black">Address:[Your Company Address]</p> */}
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

export default ipr_copyright_page;
