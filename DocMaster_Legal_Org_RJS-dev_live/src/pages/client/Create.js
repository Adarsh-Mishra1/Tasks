import { useEffect, Suspense, lazy } from "react";
import userStore from "../../zustand/userStore";

const CreateClient = lazy(() => import("../../components/client/Create"));

const ClientCreate = ({ handleCreateNewCase }) => {
  const userData = userStore((state) => state.user);

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

  return (
    <Suspense fallback={<>Loading...</>}>
      <div className="main_container">
        <div className="page-title mb-2">
          <div className="title_left">
            <h6 className="mt-0">Add New Client{" "}
            <span
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => handleCreateNewCase("all")}
            >
              Go Back ⬅️
            </span></h6>
          </div>
        </div>

        <div className="clearfix"></div>

        <div className="row">
          <div className="col-md-12 col-sm-12  ">
            <div className="x_panel">
              <div className="x_content">
                <CreateClient />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default ClientCreate;
