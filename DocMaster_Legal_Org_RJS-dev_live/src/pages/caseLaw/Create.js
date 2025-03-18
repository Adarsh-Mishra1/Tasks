import { useEffect, useState, useRef, Suspense, lazy } from "react";
import userStore from "../../zustand/userStore";

const Navbar = lazy(() => import("../../components/Navbar"));
const Sidebar = lazy(() => import("../../components/Sidebar"));
const Footer = lazy(() => import("../../components/Footer"));
const CreateCaseLaw = lazy(() => import("../../components/caseLaw/PutCaseLaw"));

const ClientCreate = () => {
  const userData = userStore((state) => state.user);
  // console.log("userData_", userData);

  useEffect(() => {
    if (
      userData != null &&
      userData != undefined &&
      userData.isLoggedIn != undefined &&
      userData.isLoggedIn
    ) {
    } else {
      window.location.href = "/";
    }
  }, []);

  
  const onCaseLawPutReturn = (returnVal) => {
    window.location.href="/caseLaws"
  };

  return (
    <Suspense fallback={<>Loading...</>}>
      <div className="main_container">
        <Sidebar />
        <Navbar />
        {/* <!-- page content --> */}
        <div className="right_col" role="main">
          <div className="page-title">
            <div className="title_left">
              <h3>Add Client</h3>
            </div>
          </div>

          <div className="clearfix"></div>

          <div className="row">
            <div className="col-md-12 col-sm-12  ">
              <div className="x_panel">
                <div className="x_content">
                  <CreateCaseLaw                   
                  caseLaw={undefined}
                  onReturn={onCaseLawPutReturn}
                  userData={userData}
                  />
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

export default ClientCreate;
