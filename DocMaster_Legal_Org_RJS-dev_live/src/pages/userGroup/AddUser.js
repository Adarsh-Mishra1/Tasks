//AddUser.js: Add User To Group
import React, { Suspense, lazy } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = lazy(() => import("../../components/Navbar"));
const Sidebar = lazy(() => import("../../components/Sidebar"));
const Footer = lazy(() => import("../../components/Footer"));
const AddUser2Group = lazy(() => import("../../components/userGroup/AddUser2Group"));

const AddUser = () => {
  let location = useLocation();
  let navigate = useNavigate();
  let userGroup = location.state?.userGroup;

  const onAddUser2GroupReturn=(flag)=>{
    if(flag){
      navigate("/userGroupView", {
        state: {
          userGroup: userGroup,
        },
      });
    }
  }

  return (    
    <Suspense fallback={<>Loading...</>}>
      <div className="main_container">
        <Sidebar />
        <Navbar />

        {/* <!-- page content --> */}
        <div className="right_col" role="main">
          <div className="page-title">
            <div className="title_left">
              <h3>Add User to '{userGroup?.title}'</h3>
            </div>
          </div>

          <div className="clearfix"></div>

          <div className="row">
            <div className="col-md-12 col-sm-12  ">
              <div className="x_panel">
                <div className="x_title">
                  <h2>Start adding users to '{userGroup?.title}'</h2>
                  <div className="clearfix"></div>
                </div>
                <div className="x_content">
                  <AddUser2Group userGroup={userGroup} onReturn={onAddUser2GroupReturn}/>
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

export default AddUser;
