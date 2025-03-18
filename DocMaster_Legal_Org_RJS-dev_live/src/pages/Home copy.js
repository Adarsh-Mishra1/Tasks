import React, { Suspense, lazy } from "react";

const Dashboard = lazy(() => import("../components/Dashboard"));
const Navbar = lazy(() => import("../components/Navbar"));
const Sidebar = lazy(() => import("../components/Sidebar"));
const Footer = lazy(() => import("../components/Footer"));

const Home = () => {
  return (
    <Suspense fallback={<>Loading...</>}>
      <div className="main_container">
        {/* <Sidebar /> */}
        {/* <!-- top navigation --> */}
        <Navbar />
        {/* <!-- /top navigation --> */}
        {/* <!-- page content --> */}
        <div
          className="right_col ps-3"
          role="main"
          //   style={{backgroundImage:"url(/images/leorghome1.jpg)",
          //   backgroundRepeat: "no-repeat, repeat",
          //   backgroundSize: "cover"
          // }}
        >
          {/* <Dashboard /> */}
          {/* <h1>Hello, User !</h1> */}
          {/* <h1 style={{ textAlign: "center",color:"#0f1d42" }}>Welcome to DocMaster Legal</h1> */}
          <div className="row">
            <div className="col-12" style={{ textAlign: "center" }}>
              {/* <img
                src="/images/legal_aid.jpg"
                alt="docmaster_legal_aid"
                style={{ width: "480px" }}
              /> */}
              <img
                src="/images/legalpromobck1.jpg"
                alt="docmaster_legal_aid"
                style={{ width: "100%" }}
              />
            </div>
          </div>
          {/* <div className="row">
            <div className="col-6">Number of Clients</div>
            <div className="col-6">Number of Cases</div>
          </div> */}
        </div>
        {/* <!-- /page content --> */}
        {/* <!-- footer content --> */}
        <Footer />
        {/* <!-- /footer content --> */}
      </div>
    </Suspense>
  );
};

export default Home;
