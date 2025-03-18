import { useEffect, Suspense, lazy, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  WsGetOrgClientCasesNew1,
  WsGetOrgClients,
  WsGetOrgClientsNew,
  WSsentOTPClient,
  WSverifyOTPClient,
} from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";
import userStore from "../../zustand/userStore";
import Popup from "../caseDiary/Popup";
import { toast } from "react-toastify";

const AllFeatureDataTable = lazy(() =>
  import("../../GuiComponents/AllFeatureDataTable.table")
);

const ClientShowAll = ({ handleCreateNewCase, noOfCasesMain }) => {
  let navigate = useNavigate();
  const userData = userStore((state) => state.user);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setotpSent] = useState(false);
  const [client, setClient] = useState(null);

  const tableColumns = [
    {
      Header: "S. No",
      accessor: "sno",
    },
    {
      Header: "Name of Client",
      accessor: "name",
    },
    {
      Header: "Email",
      accessor: "clientEmail",
    },
    {
      Header: "Mobile No",
      accessor: "mobileNo",
    },
    // {
    //   Header: "No of Cases",
    //   accessor: "noOfCases",
    // },
    {
      Header: "Action(s)",
      accessor: "actiontd",
    },
  ];

  const [tableData, setTableData] = useState();

  useEffect(() => {
    if (
      userData != null &&
      userData != undefined &&
      userData.isLoggedIn != undefined &&
      userData.isLoggedIn
    ) {
      getOrgClients();
    } else {
      window.location.href = "/";
    }
  }, []);

  const go2ViewUser = (user) => {
    delete user["actiontd"]; //DevNote:Needed
    navigate("/userView", {
      state: {
        user2view: user,
      },
    });
  };

  const getOrgClients = () => {
    axios
      .get(
        // WsGetOrgClients
        WsGetOrgClientsNew + "/" + userData.org.id + "/" + userData.id,
        {
          headers: apiKeyHeader(),
        }
      )
      .then((response) => {
        const responseData = response.data;
        console.log("_responseData", responseData);
        if (responseData.resultCode === 1) {
          responseData.resultMessage.map((each) => {
            each.user.id = each.id;
            return each;
          });
          setTableData(processOrgClientsMappedData(responseData.resultMessage));
        } else {
          if (!responseData.resultMessage === "No data found") {
            alert(" Clients: " + responseData.resultMessage);
          }
          // setErrorMsg(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("error", error);
        // setErrorMsg("Error while processing");
      });
  };

  const handleVerifyOtp = (simpleData) => {
    setClient(simpleData);
    setIsPopupVisible(true);
  };

  const sendOtp = () => {
    const loader = toast.success("Loading...", { autoClose: false });
    axios
      .post(
        WSsentOTPClient,
        JSON.stringify({ mobileNoOrEmail: client.mobileNo }),
        { headers: apiKeyHeader() }
      )
      .then((otpResponse) => {
        console.log("OTP sent:", otpResponse.data);
        setotpSent(true);
        // setIsPopupVisible(true);
      })
      .catch((error) => {
        console.error("Error sending OTP:", error);
      });
    // toast.dismiss(loader);
    if (toast.isActive(loader)) toast.dismiss(loader);
  };

  const processOrgClientsMappedData = (simpleDataArray) => {
    let tempArrayVar = [];
    simpleDataArray.map((simpleData, index) => {
      const isMobileVerify = simpleData.isMobileVerify;
      simpleData = simpleData.user;
      simpleData["sno"] = index + 1;
      // simpleData['name'] = (
      //   <>{ (<a href="#"><u>{simpleData.name}</u></a>)}</>
      // );

      simpleData["actiontd"] =
        isMobileVerify === 0 ? (
          <button onClick={() => handleVerifyOtp(simpleData)}>
            Verify otp
          </button>
        ) : (
          <>
            {userData.crudAccess?.clientCase?.c == 1 ? (
              <i
                className="fa fa-plus mx-2"
                title="Add Case"
                style={{ color: "blue", cursor: "pointer" }}
                aria-hidden="true"
                onClick={() => goToAddCaseForClient(simpleData)}
              />
            ) : null}

            {userData.crudAccess?.clientCase?.r == 1 ? (
              <i
                className="fa fa-briefcase mx-2"
                title="Cases"
                style={{ color: "blue", cursor: "pointer" }}
                aria-hidden="true"
                onClick={() => goToClientCases(simpleData)}
              />
            ) : null}
          </>
        );

      tempArrayVar.push(simpleData);
    });
    //console.log("_simpleDataArray", simpleDataArray);
    //console.log("_simpleDataArray_tempArrayVar", tempArrayVar);
    // return simpleDataArray;
    return tempArrayVar;
  };

  const goToClientCases = (client) => {
    delete client["actiontd"]; //Bug(If Not Using): Point To Be Notted
    navigate("/clientCaseShowAllByClient", {
      state: {
        client: client,
      },
    });
  };

  const goToAddCaseForClient = (client) => {
    delete client["actiontd"]; //Bug(If Not Using): Point To Be Notted
    navigate("/clientCaseCreate", {
      state: {
        client: client,
      },
    });
    
  };

  const verifyOTP = () => {
    const loader = toast.success("Loading...", { autoClose: false });

    axios
      .post(
        WSverifyOTPClient,
        JSON.stringify({
          otpType: "mobile_fg",
          otpText: otp,
          lorgnewClientId: client.id,
        }),
        { headers: apiKeyHeader() }
      )
      .then((verifyResponse) => {
        console.log("OTP verified:", verifyResponse.data);
        if (verifyResponse.data.result_code === 1) {
          alert("OTP verified successfully!");
          setIsPopupVisible(false);
          setotpSent(false);
          getOrgClients();
        } else {
          alert("Failed to verify OTP.");
        }
      })
      .catch((error) => {
        console.error("Error verifying OTP:", error);
      });
    if (toast.isActive(loader)) toast.dismiss(loader);
  };

  return (
    <Suspense fallback={<>Loading...</>}>
      <div>
        <div className="page-title " style={{ paddingLeft: "17px" }}>
          {/* //mb-5 */}
          {isPopupVisible && (
            <Popup
              title="OTP Verification"
              onClose={setIsPopupVisible}
              height="350px"
              // maxWidth="500px"
              children={
                <div className="p-3"
                  style={{
                    textAlign: "center",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {!otpSent && (
                    <div>
                      <h4>Send OTP</h4>
                      <input
                        type="text"
                        value={client.mobileNo}
                        style={{
                          width: "100%",
                          padding: "10px",
                          marginBottom: "20px",
                          borderRadius: "5px",
                          border: "1px solid #ccc",
                        }}
                        disabled
                      />
                      <br />
                      <button
                        className="btn btn-primary m-0"
                        style={{ marginRight: "10px" }}
                        onClick={sendOtp}
                      >
                        Send OTP
                      </button>
                    </div>
                  )}
                  {otpSent && (
                    <div>
                      <h4 className="text-center">Enter the OTP</h4>
                      <p>An OTP has been sent to your mobile number:</p>
                      <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          marginBottom: "20px",
                          borderRadius: "5px",
                          border: "1px solid #ccc",
                        }}
                      />
                      <br />
                      <div className="d-flex justify-content-center gap-3">
                      <button
                        className="btn btn-primary m-0  "
                        style={{ marginRight: "10px" }}
                        onClick={verifyOTP}
                      >
                        Submit
                      </button>
                      {/* <button
                        onClick={() => setIsPopupVisible(false)}
                        className="btn btn-secondary m-0 w-50"
                      >
                        Cancel
                      </button> */}
                      </div>
                    </div>
                  )}
                </div>
              }
            />
          )}
          <div className="title_left  ">
            <h6 className="mt-0">
              Clients{" "}
              <span
                style={{ fontSize: "17px" }}
                onClick={() => handleCreateNewCase("create")}
              >
                (
                <span style={{ color: "blue", cursor: "pointer" }}>
                  Create New Client +
                </span>
                )
              </span>
              &nbsp;|&nbsp;
              <span>No. of Cases: {noOfCasesMain.totalNoOfCases}</span>
              &nbsp;|&nbsp;
              <span>Active Cases: {noOfCasesMain.activeCases}</span>
              &nbsp;|&nbsp;
              <span>Closed Cases: {noOfCasesMain.closedCases}</span>
            </h6>
          </div>
        </div>

        {/* <div className="clearfix"></div> */}

        <div className="row">
          <div className="col-md-12 col-sm-12  ">
            <div className="x_panel">
              <div className="x_content">
                {tableData && tableData.length > 0 ? (
                  <div className=" ">
                    <AllFeatureDataTable
                      columns={tableColumns}
                      data={tableData}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- /page content --> */}

      {/* <Footer />
      </div> */}
    </Suspense>
  );
};

export default ClientShowAll;
