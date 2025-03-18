const Footer = () => {
  return (
    // <footer>
    //   <div className="pull-right">
    //     {/* DocMaster:: Legal Organisation - by{" "} */}
    //     <a href="https://docmaster.in">
    //       <img
    //         src="/images/docmaster.png"
    //         alt="..."
    //         style={{ width: "180px", marginTop: "0px", marginBottom: "0px" }}
    //       />
    //     </a>
    //   </div>
    //   <div className="clearfix"></div>
    // </footer>

    <footer className="bg-footer text-dark pt-1 hide-mobile">
      <div className="container-fluid">
        <div className="row  ">
          <div className="col-12">
            <p className="mb-1 text-center">
              DocMaster, A 75 Sector 63, Noida - 201301, Uttar Pradesh, India,
              +91 9289-44-0048, info@docmaster.in <span class="separator mx-1 my-0 p-0">|</span>
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
            </p>
          </div>
          <div className="col-12">
            <p className="mb-1 text-center">
              <nav class="footer-nav text-center justify-content-center">
                <a href="/Disclaimer" target="_blank" class="text-dark mx-2">
                  Disclaimer
                </a>
                |
                <a
                  href="/Terms_and_Conditions"
                  target="_blank"
                  class="text-dark mx-2"
                >
                  Terms & Conditions
                </a>
                |
                <a
                  href="/Privacy_Policy"
                  class="text-dark mx-2"
                  target="_blank"
                >
                  Privacy Policy
                </a>
                |
                <a
                  href="/ipr_copyrights"
                  class="text-dark mx-2"
                  target="_blank"
                >
                  IPR &amp; Copyright
                </a>
                |
                <a href="/Pricing" class="text-dark mx-2" target="_blank">
                  Pricing Plan
                </a>
                |
                <a
                  class="text-dark mx-2"
                  target="_blank"
                  href="/Cancellation_Policy"
                >
                  Cancellation & Refund Policy
                </a>
                |
                <a href="home#aboutus" class="text-dark mx-2" target="_blank">
                  About Us
                </a>
                |
                <a href="home#faq" class="text-dark mx-2" target="_blank">
                  FAQs
                </a>
                |
                <a href="home#contactus" class="text-dark mx-2" target="_blank">
                  Write to Us
                </a>
                
              </nav>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
