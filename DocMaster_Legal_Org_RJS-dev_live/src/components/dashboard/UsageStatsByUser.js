//UsageStatsByUser.js
import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import Chart from "chart.js/auto";
import { Bar } from "react-chartjs-2";
// import {CategoryScale} from 'chart.js';

import userStore from "../../zustand/userStore";
import { apiKeyHeader } from "../../configs/ApiKeys";
import { WsGetOrgDocFormUsageStats } from "../../configs/WebService";

const UsageStatsByUser = () => {
  const userData = userStore((state) => state.user);
  let navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");

  const [labels, setLabels] = useState([]);
  const [data, setData] = useState([]);

  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    getStatData();
  }, []);

  function getStatData() {
    axios
      .get(WsGetOrgDocFormUsageStats + "/" + userData.org.id + "/1", {
        headers: apiKeyHeader(),
      })
      .then((response) => {
        const responseData = response.data;
        console.log("getStatData_responseData", responseData);
        if (responseData.resultCode === 1) {
          processStateJson2StatArray(responseData.resultMessage);
        } else {
          setErrorMsg(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.log("getStatData_error", error);
        setErrorMsg("Error while processing");
      });
  }

  const processStateJson2StatArray = (jsonArray) => {
    let labelTemp = [];
    let barDataTemp = [];
    jsonArray.forEach((jsonObjct) => {
      labelTemp.push(jsonObjct.name);
      barDataTemp.push(jsonObjct.useCount);
    });

    if (barDataTemp.length > 0) {
      setLabels(labelTemp);
      setData(barDataTemp);
      setShowChart(true);
    }
  };

  return (
    <div className="row statBox">
      <div className="col-md-12">
        <i
          data-tip="View"
          title="View"
          key={`UsageStatsByUserView_i`}
          className="fa fa-eye mx-2"
          style={{ color: "blue", cursor: "pointer" }}
          aria-hidden="true"
          onClick={() => navigate("/docFormUsageStats?type=1")}
        />
        <i
          data-tip="Reload"
          title="Reload"
          key={`UsageStatsByUserRld_i`}
          className="fa fa-refresh mx-2"
          style={{ color: "blue", cursor: "pointer" }}
          aria-hidden="true"
          onClick={() => getStatData()}
        />
      </div>
      <div className="col-md-12">
        {showChart ? (
          <Bar
            data={{
              labels: labels,
              datasets: [
                {
                  label: "DocForms Usage by User",
                  data: data,
                  // backgroundColor: "rgba(255, 0, 0, 0.3)",
                  // borderColor: "red",
                  borderWidth: 2,
                },
              ],
            }}
            height={250}
            options={{
              maintainAspectRatio: false,
              // scales: {
              //   yAxes: [
              //     {
              //       ticks: {
              //         beginAtZero: true,
              //         max: 200,
              //       },
              //     },
              //   ],
              // },
            }}
          />
        ) : (
          errorMsg
        )}
      </div>
    </div>
  );
};

export default UsageStatsByUser;
