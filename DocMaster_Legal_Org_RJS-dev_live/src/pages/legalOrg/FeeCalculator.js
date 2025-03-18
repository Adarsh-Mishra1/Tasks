import { useEffect, Suspense, lazy } from "react";

const Navbar = lazy(() => import("../../components/Navbar"));
const Sidebar = lazy(() => import("../../components/Sidebar"));
const Footer = lazy(() => import("../../components/Footer"));

// const FeeCalculator = lazy(
//   () => import("../../components/legalOrg/FeeCalculator"),
// );
// const FeeCalculatorSub0 = lazy(() => import("./FeeCalculatorSub0"));

const FeeCalculatorSub0 = lazy(
  () => import("../../components/legalOrg/FeeCalculatorSub0"),
);
const LegalFeeCalculator = () => {
  return (
    <Suspense fallback={<>Loading...</>}>
      <div className="main_container">
        <Sidebar />
        <Navbar />

        {/* <!-- page content --> */}

        {/* {DevNote: Show Page Content Here} */}
        <div className="right_col" role="main">
          <div className="page-title">
            <div className="title_left">
              <h3>Fee Calculator</h3>
            </div>

            {/* <div className="title_right">
                <div className="col-md-5 col-sm-5   form-group pull-right top_search">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search for..."
                    />
                    <span className="input-group-btn">
                      <button className="btn btn-default" type="button">
                        Go!
                      </button>
                    </span>
                  </div>
                </div>
              </div> */}
          </div>

          <div className="clearfix"></div>

          <div className="row">
            <div className="col-md-12 col-sm-12  ">
              <div className="x_panel">
                <div className="x_title">
                  <h2>Select Calculation Type</h2>
                  <div className="clearfix"></div>
                </div>
                <div className="x_content">
                  {/* <FeeCalculator /> */}

                  <FeeCalculatorSub0 />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- /page content --> */}

        <Footer />
      </div>
    </Suspense>
  );
};

export default LegalFeeCalculator;
