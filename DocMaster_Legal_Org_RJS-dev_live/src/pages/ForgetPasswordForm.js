import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { apiKeyHeader } from "../configs/ApiKeys";
import {
  WSUserForgotPassword,
  WSUserPasswordReset,
} from "../configs/WebService";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ForgetPasswordForm = () => {
  let navigate = useNavigate();
  const [sendValue, setSendValue] = useState("Send OTP");
  const [otpSent, setotpSent] = useState(false);
  const [counter, setCounter] = useState(null);

  const mobileRef = useRef(null);
  const OtpRef = useRef(null);
  const Passwordref = useRef(null);
  const ConfirmPasswordRef = useRef(null);

  useEffect(
    function () {
      if (counter > 0) {
        const timer = setInterval(() => {
          setCounter((prevCounter) => prevCounter - 1);
        }, 1000);

        return () => clearInterval(timer);
      }

      if (counter === 0) {
        setSendValue("Resend OTP");
        resetForm();
      }
    },
    [counter]
  );

  const handleSendotp = async (e) => {
    e.preventDefault();

    if (!mobileRef.current.value) {
      return alert("Please enter mobile number");
    }

    const body = {
      mobileNoOrEmail: mobileRef.current.value,
    };

    try {
      const otpLoader = toast.success("Sending OTP...", { autoClose: false });

      const response = await fetch(WSUserForgotPassword, {
        method: "POST",
        headers: apiKeyHeader(),
        body: JSON.stringify(body),
      });
      const data = await response.json();

      if (response.status === 200 && data.result_code === 1) {
        await toast.dismiss(otpLoader);
        toast.success(data.result_message, { autoClose: 3000 });
        setSendValue("Send OTP");
        setCounter(60);
        setotpSent(true);
      } else {
        await toast.dismiss(otpLoader);
        toast.error(data.result_message, { autoClose: 3000 });
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong, please try again later.", {
        autoClose: 3000,
      });
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!OtpRef.current.value) {
      return alert("Please enter OTP.");
    }
    if (!Passwordref.current.value) {
      return alert("Please enter Password.");
    }
    if (!ConfirmPasswordRef.current.value) {
      return alert("Please enter Confirm Password.");
    }

    try {
      const ResetLoader = toast.success("Loading...", { autoClose: false });
      const body = {
        mobileNoOrEmail: mobileRef.current.value,
        otp: OtpRef.current.value,
        newPassword1: Passwordref.current.value,
        newPassword2: ConfirmPasswordRef.current.value,
      };

      const response = await fetch(WSUserPasswordReset, {
        method: "POST",
        headers: apiKeyHeader(),
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.status === 200 && data.result_code === 1) {
        await toast.dismiss(ResetLoader);
        toast.success(data.result_message, { autoClose: 3000 });
        navigate("/");
      } else {
        await toast.dismiss(ResetLoader);
        console.log("data: ", data);
        toast.error(data.result_message, { autoClose: 3000 });
        resetForm();
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong, please try again later.", {
        autoClose: 3000,
      });
    }
  };

  const resetForm = () => {
    Passwordref.current.value = "";
    ConfirmPasswordRef.current.value = "";
    OtpRef.current.value = "";
  };

  return (
    <div className="text-center  ">
      <Navbar />
      <div className="tab-content" style={{ minHeight: "84vh" }}>
        <div>
          <h2>Forgot Password</h2>
        </div>
        <form>
          <div className="form-box px-3">
            <div className="row pt-5">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div class="input-group mb-3">
                  <input
                    type="text"
                    class="form-control px-2"
                    placeholder="Enter Mobile No"
                    aria-label="Enter Mobile No"
                    aria-describedby="button-addon2"
                    ref={mobileRef}
                  />
                  <div class="input-group-append">
                    <button
                      class="btn btn-outline-primary m-0"
                      type="button"
                      id="button-addon2"
                      onClick={handleSendotp}
                      disabled={counter > 0}
                    >
                      <i class="fa fa-check-circle" aria-hidden="true"></i>{" "}
                      {sendValue}
                    </button>
                  </div>
                </div>
                <div className="otp-section">
                  <div class="input-group mb-3">
                    <input
                      type="text"
                      class="form-control px-2"
                      placeholder="Enter OTP"
                      aria-label="Enter OTP"
                      aria-describedby="button-addon2"
                      disabled={!otpSent}
                      ref={OtpRef}
                    />
                  </div>
                </div>
                {otpSent && (
                  <div className="reset-psw-section text-left">
                    <h2>Reset Password</h2>
                    <div class=" mb-3">
                      <input
                        type="text"
                        class="form-control px-2 py-2"
                        placeholder="Enter New Password"
                        aria-label="Enter OTP"
                        aria-describedby="button-addon2"
                        ref={Passwordref}
                      />
                    </div>
                    <div class=" mb-3">
                      <input
                        type="text"
                        class="form-control px-2 py-2"
                        placeholder="Confirm Password"
                        aria-label="Enter OTP"
                        aria-describedby="button-addon2"
                        ref={ConfirmPasswordRef}
                      />
                    </div>
                    <div class="input-group-append">
                      <button
                        class="btn btn-outline-primary m-0"
                        type="button"
                        id="button-addon2"
                        onClick={handleResetPassword}
                      >
                        <i class="fa fa-check-circle" aria-hidden="true"></i>{" "}
                        Submit
                      </button>
                    </div>

                    {counter > 0 && (
                      <div className="pt-3 text-primary">
                        Resend OTP in {counter} seconds
                      </div>
                    )}
                  </div>
                )}
              </div>
               
            </div>
          </div>
        </form>
        <div className="loginFooter"></div>
      </div>
      <Footer />
    </div>
  );
};
export default ForgetPasswordForm;
