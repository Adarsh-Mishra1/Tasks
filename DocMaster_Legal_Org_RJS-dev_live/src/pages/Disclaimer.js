import React, { Suspense, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const Disclaimer = () => {
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
        <div className=" " style={{ height: "100%", overflowY: "auto" }}>
          <nav
            className="navbar navbar-expand-lg navbar-light bg-white px-4 py-0"
            style={{
               
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
                    <b className="border-b">Disclaimer</b>
                  </h3>
                  <p className="text-16 text-black text-justify">
                  The content available on DocMaster ("The Website") is for general informational purposes only. While the team DocMaster keeps on working to ensure that the content remains accurate and up-to-date to the best of their knowledge.
                  </p>
                  <p className="text-16 text-black text-justify">
                  The use of “The Website” is at User’s own risk in totality, as neither the DocMaster nor its associates makes any representations or warranties express or implied as it an expert's advice or view related ti content published here. The user should use every information after verifying from their own sources or from legal experts.
                  </p>

                  <p className="text-16 text-black text-justify">
                    <strong>No Legal Advice / No Legal Expert - </strong> 
                    All the features & services available at DocMaster like Quick Questionnaires with instant results, Documents, Templates, and various other resources are not intended to constitute advice or output from legal experts. DocMaster is not a law firm and does not offer legal representation. Any legal documents or information available on “The Website” are intended for general guidance only and should not be used as a substitute for professional legal counsel.
                  </p>
                   

                  <p className="text-16 text-black text-justify">
                    <strong>No Attorney-Client Relationship - </strong> 
                    Your use of DocMaster, including the completion of any process or templates, does not establish any nature of attorney-client relationship between you and DocMaster, its associates or its affiliates. Any use or communications made through “The Website” or its services do not create such a relationship.
                  </p>

                  <p className="text-16 text-black text-justify">
                    <strong>Content or Document Accuracy - </strong> 
                    While we endeavor to make available to our users, accurate and useful legal information, templates and resources, we cannot guarantee that the documents or information on “The Website” will meet your specific needs or comply with the laws applicable to your jurisdiction. You are advised to cross check the outcomes as you are solely responsible for ensuring the documents and legal information available are appropriate for your situation and meet legal requirements.
                  </p>
                  <p className="text-16 text-black text-justify">
                    <strong>Limitation of Liability - </strong>
                    To the fullest extent permitted by law, DocMaster, its officers, employees, associates and affiliates disclaim all liability for any loss or damage arising to any user from the use of “The Website”, its services, or reliance on any information or documents available therein. This includes, but is not limited to, direct, indirect, incidental, punitive, or consequential damages.
                  </p>
                  <p className="text-16 text-black text-justify">
                    <strong>Third-Party Links - </strong> 
                    DocMaster may contain links to third-party websites or services that are not under its control. “The Website” does not endorse or assume any responsibility for the content, privacy policies, or practices of these third-party sites. Accessing third-party websites linked to DocMaster shall be at your own risks.
                  </p>
                   
                  <p className="text-16 text-black text-justify">
                    <strong>Changes to the Disclaimer - </strong> 
                    DocMaster reserves the right to modify or update this Disclaimer Policy at any time without prior notice. Any changes will be effective immediately upon posting. It is your responsibility to review this Disclaimer periodically for any updates.
                  </p>
                  <p className="text-16 text-black text-justify">
                  By continuing to use DocMaster, you acknowledge and agree to this Disclaimer Policy.
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

export default Disclaimer;
