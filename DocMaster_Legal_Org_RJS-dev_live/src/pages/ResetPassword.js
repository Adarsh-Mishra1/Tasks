import React, { Suspense, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  WSGeneralUserResendOTP,
  WsSendOTP,
  WSUserPasswordReset,
} from "../configs/WebService";
import { apiKeyHeader } from "../configs/ApiKeys";

const ResetPassword = () => {
  let navigate = useNavigate();
  const location = useLocation();
  var mobileNoOrEmail = "";
  let disableMobileInput = false;
  let otpCounterStart = 0;

  if (location.state !== undefined) {
    if (location.state.mobileNoOrEmail !== undefined) {
      mobileNoOrEmail = location.state.mobileNoOrEmail;
      otpCounterStart = 60;
    }
  }

  if (mobileNoOrEmail.length > 5) {
    disableMobileInput = true;
  }

  const [otp, setOtp] = useState("");
  const [guUserPassword1, setGuUserPassword1] = useState("");
  const [guUserPassword2, setGuUserPassword2] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [otpCounter, setOtpCounter] = useState(otpCounterStart);

  useEffect(() => {
    const timer =
      otpCounter > 0 && setInterval(() => setOtpCounter(otpCounter - 1), 1000);
    return () => clearInterval(timer);
  }, [otpCounter]);

  function onOtpTextChangeHandler(e) {
    setOtp(e.target.value);
  }

  function onGuUserPassword1ChangeHandler(e) {
    setGuUserPassword1(e.target.value);
    if (e.target.value.length < 6) {
      setErrorMsg("Enter proper Password");
    } else {
      setErrorMsg("");
    }
  }

  function onGuUserPassword2ChangeHandler(e) {
    setGuUserPassword2(e.target.value);
    if (e.target.value.length < 6) {
      setErrorMsg("Enter proper Password");
    } else {
      setErrorMsg("");
    }
  }

  function processResendMobileOTP() {
    if (mobileNoOrEmail.length >= 10) {
      processReSendUserVerificationOTP("mobile_fg", mobileNoOrEmail);
      let otpButton = document.getElementById("resendOtpButton");
      otpButton.disabled = true;
      setTimeout(() => {
        otpButton.disabled = false;
      }, 60000);
    } else {
      setErrorMsg("Invalid Mobile");
    }
  }

  function processReSendUserVerificationOTP(otpType, otpSentTo) {
    setOtpCounter(60);
    toast.success("Sending ...", { autoClose: 1000 });

    let formJsonParams = JSON.stringify({
      otpType: otpType,
      otpSentTo: otpSentTo,
    });

    axios
      .post(
        otpType == "email" || otpType == "email_fg"
          ? WSGeneralUserResendOTP
          : WsSendOTP,
        formJsonParams,
        { headers: apiKeyHeader() }
      )
      .then((response) => {
        const responseData = response.data;

        if (otpType == "email" || otpType == "email_fg") {
          if (responseData.result_code == 1) {
            toast.success(responseData.result_message, {
              position: "top-center",
            });
            setErrorMsg("");
            setErrorMsg(responseData.result_message);
          } else {
            toast.warn(responseData.result_message, {
              position: "top-center",
            });
            setErrorMsg(responseData.result_message);
          }
        } else {
          if (responseData.resultCode == 1) {
            toast.success(responseData.resultMessage, {
              position: "top-center",
            });
            setErrorMsg("");
            setErrorMsg(responseData.resultMessage);
          } else {
            toast.warn(responseData.resultMessage, {
              position: "top-center",
            });
            setErrorMsg(responseData.resultMessage);
          }
        }
      })
      .catch((error) => {
        console.error("processReSendUserVerificationOTP_error", error);
        setErrorMsg("Error while processing");
      });
  }

  function onSubmitHandler(e) {
    e.preventDefault();
    if (guUserPassword1 != guUserPassword2) {
      setErrorMsg("Passwords do not match");
    } else {
      setErrorMsg("");
      processVerifyUser(mobileNoOrEmail, otp, guUserPassword1, guUserPassword2);
    }
  }

  function processVerifyUser(
    mobileNoOrEmail,
    otpText,
    newPassword1,
    newPassword2
  ) {
    toast.success("Submitting ...", { autoClose: 1200 });

    let formJsonParams = JSON.stringify({
      mobileNoOrEmail: mobileNoOrEmail,
      otp: otpText,
      newPassword1: newPassword1,
      newPassword2: newPassword2,
    });

    axios
      .post(WSUserPasswordReset, formJsonParams, { headers: apiKeyHeader() })
      .then((response) => {
        const responseData = response.data;
        if (responseData.result_code == 1) {
          toast.success(responseData.result_message, {
            position: "top-center",
          });
          setErrorMsg("");
          setErrorMsg(responseData.result_message);
          goToLogInPage();
        } else {
          toast.warn(responseData.result_message, {
            position: "top-center",
          });
          setErrorMsg(responseData.result_message);
        }
      })
      .catch((error) => {
        console.log("processVerifyUser_error", error);
        setErrorMsg("Error while processing");
      });
  }

  function goToLogInPage() {
    navigate("/login", { state: { mobileNoOrEmail: mobileNoOrEmail } });
  }

  return (
    <Suspense fallback={<>Loading...</>}>
      <div className="text-center pt-5">
        <div>
          <div className="loginFormHeading">
            <h1 className="signIn active">
              <Link to="/customerlogin">Sign In</Link>
            </h1>
            <h1 className="sihnUp ">Sign Up</h1>
          </div>
          <form onSubmit={onSubmitHandler} method="POST">
            <div className="formGroup">
              <label>Mobile No</label>

              {disableMobileInput ? (
                <div className="inputValue mb-2">{mobileNoOrEmail}</div>
              ) : (
                <input
                  className="inputValue"
                  type="tel"
                  pattern="[0-9]{10}"
                  name="mobileNoOrEmail"
                  id="mobileNoOrEmail"
                  placeholder="Enter Mobile No."
                  defaultValue={mobileNoOrEmail}
                  readOnly={disableMobileInput}
                  required
                />
              )}
            </div>

            <div>
              <label>Enter OTP</label>
              <input
                className="inputValue"
                type="text"
                name="otp"
                id="otp"
                placeholder={"Enter OTP Received in '" + mobileNoOrEmail + "'"}
                value={otp}
                minLength="5"
                maxLength="8"
                onChange={onOtpTextChangeHandler}
                required
              />
            </div>
            <div>
              <div>
                <label for="UserPassword1">New Password</label>
                <input
                  className="inputValue"
                  type="password"
                  name="guUserPassword1"
                  id="guUserPassword1"
                  placeholder="Password"
                  value={guUserPassword1}
                  onChange={onGuUserPassword1ChangeHandler}
                  minLength="6"
                  required
                />
              </div>
              <div>
                <label for="UserPassword2">Re-Enter Password</label>
                <input
                  className="inputValue"
                  type="password"
                  name="guUserPassword2"
                  id="guUserPassword2"
                  placeholder="Re-Type Password"
                  value={guUserPassword2}
                  onChange={onGuUserPassword2ChangeHandler}
                  minLength="6"
                  required
                />
              </div>
            </div>

            <div className="row" style={{ display: "flex" }}>
              <div>
                {otpCounter === 0 ? (
                  <button
                    id="resendOtpButton"
                    type="button"
                    className="resendOTPButtom"
                    onClick={processResendMobileOTP}
                  >
                    <i class="fa fa-repeat" aria-hidden="true"></i> Resend OTP
                  </button>
                ) : (
                  <>
                    Resend OTP in <strong>{otpCounter}</strong> seconds
                  </>
                )}
              </div>
              <div>
                <button className="loginSubmitButtom" type="Submit">
                  <i class="fa fa-repeat" aria-hidden="true"></i> Reset Password
                </button>
              </div>
            </div>
          </form>
          {errorMsg ? <div>{errorMsg}</div> : null}
        </div>
        <div className="loginFooter">
          <p>
            Don't have an account?{" "}
            <Link to="/signup">
              <span>Sign Up Now</span>
            </Link>
          </p>
        </div>
      </div>
    </Suspense>
  );
};
export default ResetPassword;
