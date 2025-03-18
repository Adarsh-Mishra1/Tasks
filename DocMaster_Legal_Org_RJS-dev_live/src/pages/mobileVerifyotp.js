import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import axios from "axios";
import "../stylesheets/VerifyEmailotp.css";
import { WSverifyOTP, WSresentOTP,WSsendOTP } from "../configs/WebService";
import { apiKeyHeader } from "../configs/ApiKeys";

const MobileVerifyotp = () => {
  const location = useLocation(); // Use the useLocation hook
  const mobile = location.state?.mobile || ""; // Get mobile number from state
  console.log("Mobile number received:", mobile);

  const [otp, setOtp] = useState("");
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleOTPSubmit = () => {
    setLoader(true);
    const payload = {
      otpType: "mobile", // Set OTP type to 'mobile'
      otpText: otp,
      otpSentTo: mobile // Send OTP to mobile
    };

    axios
      .post(WSverifyOTP, payload, {
        headers: apiKeyHeader(),
      })
      .then((response) => {
        const responseData = response.data;
        if (responseData.result_code === 1) {
          alert("Mobile verified successfully!");
          navigate("/login");
        } else {
          setError("Invalid OTP, please try again.");
        }
        setLoader(false);
      })
      .catch((error) => {
        console.error("Error verifying OTP:", error);
        setError("An error occurred during OTP verification. Please try again.");
        setLoader(false);
      });
  };

  const resendOtp = () => {
    setLoader(true);
    const payload = {
        otpType: "mobile", // Set OTP type to 'mobile'
      otpSentTo: mobile, // Resend OTP to mobile
    };

    axios
      .post(WSsendOTP, payload, {
        headers: apiKeyHeader(),
      })
      .then((response) => {
        console.log("OTP Resend Response:", response.data);
        alert("OTP has been resent to your mobile.");
        setLoader(false);
      })
      .catch((error) => {
        console.error("Error resending OTP:", error);
        alert("An error occurred while resending the OTP. Please try again.");
        setLoader(false);
      });
  };

  return (
    <div className="custom-bg">
      {loader && <div className="spinner"></div>}
      <div className="top_nav">
        <div>
          <a href="/" className="site_title">
            <img
              src="/images/docmaster.png"
              alt="..."
              style={{
                width: "170px",
                marginTop: "0px",
                marginBottom: "0px",
              }}
            />
          </a>
        </div>
      </div>

      <div className="otp-form-container">
        <h2>Mobile Verification</h2>
        <p>We have sent an OTP to your mobile: {mobile}</p>
        <input
          type="text"
          className="otp-input"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        {error && <p className="error-message">{error}</p>}

        <button className="submit-btn" onClick={handleOTPSubmit}>
          Verify OTP
        </button>
      </div>

      <div className="form-footer">
        <p>
          Didn't receive the OTP?{" "}
          <span
            className="resend-link"
            onClick={resendOtp} // Call the resend function
            style={{ cursor: "pointer", color: "blue" }}
          >
            Resend OTP
          </span>
        </p>
      </div>
    </div>
  );
};

export default MobileVerifyotp;
