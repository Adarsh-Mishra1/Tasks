import React, { Suspense, lazy } from "react";
import { Link, useNavigate } from "react-router-dom";
const UsageStatsByDocForm = lazy(
  () => import("./dashboard/UsageStatsByDocForm"),
);
const UsageStatsByUser = lazy(() => import("./dashboard/UsageStatsByUser"));
// const UsageStats = lazy(() =>
//   import("./dashboard/UsageStats")
// );
const Dashboard = () => {
  let navigate = useNavigate();
  return (
    <Suspense fallback={<>Loading...</>}>
      {/* <h1>Dashboard</h1> */}
      <div className="row">
        <h4>
          Usage Stats
          <i
            data-tip="All View"
            title="All View"
            key={`UsageStats_i`}
            className="fa fa-eye mx-2"
            style={{ color: "blue", cursor: "pointer" }}
            aria-hidden="true"
            onClick={() => navigate("/docFormUsageStats?type=3")}
          />
        </h4>
        <div className="col-md-6">
          <UsageStatsByDocForm />
        </div>
        <div className="col-md-6">
          <UsageStatsByUser />
        </div>
        {/* <div className="col-md-6">
          <UsageStats />
        </div> */}
      </div>
    </Suspense>
  );
};

export default Dashboard;
