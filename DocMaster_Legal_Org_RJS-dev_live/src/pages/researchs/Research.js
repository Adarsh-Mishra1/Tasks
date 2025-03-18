import { useEffect, useState, Suspense, lazy } from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";

import userStore from "../../zustand/userStore";
import { WsGetResearchSubjectsByUser } from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";

 
import MyResearchSubjects from "./MyResearchSubjects";
import ResearchsAssign2Me from "./ResearchsAssign2Me";

const Navbar = lazy(() => import("../../components/Navbar"));
const Sidebar = lazy(() => import("../../components/Sidebar"));
const Footer = lazy(() => import("../../components/Footer"));

const Research = () => {
  let navigate = useNavigate();
  const userData = userStore((state) => state.user);
  console.log("userData_", userData);
 
 
  return (
    <Suspense fallback={<>Loading...</>}>
      <div className="main_container">
        {/* <Sidebar /> */}
        {/* <Navbar /> */}

        {/* <!-- page content --> */}

        {/* {DevNote: Show Page Content Here} */}
        <div className="right_col" role="main">
          <ul class="nav nav-pills mb-3 right-col-tabs" id="pills-tab" role="tablist">
            <li class="nav-item " role="presentation">
              <button class="nav-link active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">My Research(s)</button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Assigned to Me</button>
            </li>
             
          </ul>
          <div class="tab-content" id="pills-tabContent">
            <div class="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
              <MyResearchSubjects />
            </div>
            <div class="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
              <ResearchsAssign2Me />
            </div>
          </div>
          <Footer />
        </div>
        {/* <!-- /page content --> */}

        
      </div>
    </Suspense>
  );
};

export default Research;
