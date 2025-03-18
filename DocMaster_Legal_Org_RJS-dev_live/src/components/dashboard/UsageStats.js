//UsageStats.js
import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
// import {CategoryScale} from 'chart.js';

import userStore from "../../zustand/userStore";
import { apiKeyHeader } from "../../configs/ApiKeys";
import { WsGetOrgDocFormUsageStats } from "../../configs/WebService";

const UsageStats = () => {
  const userData = userStore((state) => state.user);
  let navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");

  const [labels0, setLabels0] = useState([]);
  const [data0, setData0] = useState([]);

  const [labels1, setLabels1] = useState([]);
  const [data1, setData1] = useState([]);

  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    getStatData();
  }, []);

  function getStatData() {
    const requestStatsByDocForm = axios.get(
      WsGetOrgDocFormUsageStats + "/" + userData.org.id + "/0",
      {
        headers: apiKeyHeader(),
      },
    );

    const requestStatsByUser = axios.get(
      WsGetOrgDocFormUsageStats + "/" + userData.org.id + "/1",
      {
        headers: apiKeyHeader(),
      },
    );

    axios
      .all([requestStatsByDocForm, requestStatsByUser])
      .then(
        axios.spread((...responses) => {
          const responseData0 = responses[0].data;
          console.log("getStatData_responseData0", responseData0);
          if (responseData0.resultCode === 1) {
            processStateJson2StatArray0(responseData0.resultMessage);
          } else {
            setErrorMsg(responseData0.resultMessage);
          }

          const responseData1 = responses[1].data;
          console.log("getStatData_responseData1", responseData1);
          if (responseData1.resultCode === 1) {
            processStateJson2StatArray1(responseData1.resultMessage);
          } else {
            setErrorMsg(responseData1.resultMessage);
          }

          setShowChart(true);
        }),
      )
      .catch((errors) => {
        // react on errors.
        console.error("errors", errors);
      });

    // axios
    //   .get(WsGetOrgDocFormUsageStats + "/" + userData.org.id + "/1", {
    //     headers: apiKeyHeader(),
    //   })
    //   .then((response) => {

    //   })
    //   .catch((error) => {
    //     console.log("getStatData_error", error);
    //     setErrorMsg("Error while processing");
    //   });
  }

  const processStateJson2StatArray0 = (jsonArray) => {
    let labelTemp = [];
    let barDataTemp = [];
    jsonArray.forEach((jsonObjct) => {
      labelTemp.push(jsonObjct.nameTitle);
      barDataTemp.push(jsonObjct.useCount);
    });

    if (barDataTemp.length > 0) {
      setLabels0(labelTemp);
      setData0(barDataTemp);
    }
  };
  const processStateJson2StatArray1 = (jsonArray) => {
    let labelTemp = [];
    let barDataTemp = [];
    jsonArray.forEach((jsonObjct) => {
      labelTemp.push(jsonObjct.name);
      barDataTemp.push(jsonObjct.useCount);
    });

    if (barDataTemp.length > 0) {
      setLabels1(labelTemp);
      setData1(barDataTemp);
    }
  };

  // const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  // const data =;

  return (
    <div className="row statBox">
      <div className="col-md-12">
        <i
          data-tip="View"
          title="View"
          key={`UsageStatsByOrg_i`}
          className="fa fa-eye mx-2"
          style={{ color: "blue", cursor: "pointer" }}
          aria-hidden="true"
          onClick={() => navigate("/docFormUsageStats?type=3")}
        />
        <i
          data-tip="Reload"
          title="Reload"
          key={`UsageStatsByOrgRld_i`}
          className="fa fa-refresh mx-2"
          style={{ color: "blue", cursor: "pointer" }}
          aria-hidden="true"
          onClick={() => getStatData()}
        />
      </div>
      <div className="col-md-12">
        {showChart ? (
          <Line
            data={{
              labels: labels1,
              // labels;[],
              datasets: [
                {
                  label: "DocForms Usage by DocForms",
                  data: data0,
                  // backgroundColor: "rgba(255, 0, 0, 0.3)",
                  // borderColor: "red",
                  // borderWidth: 2,
                  borderColor: "rgb(255, 99, 132)",
                  backgroundColor: "rgba(255, 99, 132, 0.5)",
                },
                {
                  label: "DocForms Usage by User",
                  data: data1,
                  // backgroundColor: "rgba(255, 0, 0, 0.3)",
                  // borderColor: "red",
                  // borderWidth: 2,
                  borderColor: "rgb(53, 162, 235)",
                  backgroundColor: "rgba(53, 162, 235, 0.5)",
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

export default UsageStats;
