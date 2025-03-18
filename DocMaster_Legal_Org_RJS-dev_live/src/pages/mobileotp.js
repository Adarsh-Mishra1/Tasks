import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import axios from "axios";
import "../stylesheets/VerifyEmailotp.css";
import { WSverifyOTP, WsSendOTP } from "../configs/WebService";
import { apiKeyHeader } from "../configs/ApiKeys";

const Mobileotp = () => {
  const location = useLocation(); // Use the useLocation hook
  const [mobile, setMobile] = useState(location.state?.mobile || ""); // Initialize mobile from location.state
  const [otp, setOtp] = useState("");
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSendOTP = () => {
    if (!mobile) {
      setError("Mobile number is required.");
      return;
    }

    setLoader(true);
    const payload = {
      otpType: "mobile", // OTP type set to mobile
      otpSentTo: mobile,
    };

    axios
      .post(WsSendOTP, payload, {
        headers: apiKeyHeader(),
      })
      .then((response) => {
        console.log("OTP Sent Response:", response.data);
        alert("OTP has been sent to your mobile.");
        setLoader(false);
      })
      .catch((error) => {
        console.error("Error sending OTP:", error);
        setError("An error occurred while sending the OTP. Please try again.");
        setLoader(false);
      });
  };

  const handleOTPSubmit = () => {
    if (!otp) {
      setError("OTP is required.");
      return;
    }

    setLoader(true);
    const payload = {
      otpType: "mobile", // OTP type set to mobile
      otpText: otp,
      otpSentTo: mobile, // Use mobile from state
    };

    axios
      .post(WSverifyOTP, payload, {
        headers: apiKeyHeader(),
      })
      .then((response) => {
        const responseData = response.data;
        if (responseData.result_code === 1) {
          alert("Mobile verified successfully!");
          navigate("/login"); // Navigate to login on success
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

        {/* Input for mobile number */}
        <input
          type="text"
          className="otp-input"
          placeholder="Enter Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
        <button className="submit-btn" onClick={handleSendOTP}>
          Send OTP
        </button>

        <p>We have sent an OTP to your mobile: {mobile}</p>

        {/* Input for OTP */}
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
            onClick={() => handleSendOTP()}
            style={{ cursor: "pointer", color: "blue" }}
          >
            Resend OTP
          </span>
        </p>
      </div>
    </div>
  );
};

export default Mobileotp;
