import React, { useEffect, Suspense, lazy } from "react";

const Navbar = lazy(() => import("../../components/Navbar"));
const Sidebar = lazy(() => import("../../components/Sidebar"));
const Footer = lazy(() => import("../../components/Footer"));

const Create = () => {
  return (
    <Suspense fallback={<>Loading...</>}>
      <div className="main_container">
        <Sidebar />
        <Navbar />

        {/* <!-- page content --> */}

        {/* {DevNote: Show Page Content Here} */}

        {/* <!-- /page content --> */}

        <Footer />
      </div>
    </Suspense>
  );
};

export default Create;
