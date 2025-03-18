//LogIn.js
import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { apiKeyHeader } from "../configs/ApiKeys";
import { WSLogIn } from "../configs/WebService";

import userStore from "../zustand/userStore";

const LogIn = () => {
  const { userData, setUser } = userStore((state) => ({
    userData: state.user,
    setUser: state.setUser,
  }));

  let navigate = useNavigate();
  const userNameRef = useRef();
  const userPasswordRef = useRef();
  const [errorMsg, setErrorMsg] = useState("");

  const submitLogInForm = (e) => {
    e.preventDefault();

    console.log("submitLogInForm_userName", userNameRef.current.value);
    console.log("submitLogInForm_userPassword", userPasswordRef.current.value);

    if (userPasswordRef.current.value.length < 5) {
      alert("Check Password!");
    } else {
      orgUserLoginProcess();
    }
  };

  useEffect(() => {
    document.title = "LogIn";
    if (Object.keys(userData).length == 0) {
      //console.log("Header","invalid User")
    } else {
      if (userData.isLoggedIn) {
        window.location.href = "/";
      }
    }
  }, []);

  function orgUserLoginProcess() {
    // console.log("Submitted")
    // console.log(guMobileNo)

    console.log("OrgUserLogIn_WS", WSLogIn);
    console.log(
      "OrgUserLogIn_Params",
      JSON.stringify({
        userid: userNameRef.current.value,
        password: userPasswordRef.current.value,
      }),
    );

    axios
      .post(
        WSLogIn,
        JSON.stringify({
          userid: userNameRef.current.value,
          password: userPasswordRef.current.value,
          orgTypeCode:"leorg"
        }),
        {
          headers: apiKeyHeader(),
        },
      )
      .then((response) => {
        const responseData = response.data;
        console.log("OrgUserLogIn_responseData", responseData);
        if (responseData.resultCode === 1) {
          const userData = responseData.resultMessage;
          userData.isLoggedIn = true;
          setUser(userData);
          goToUserPage();
        } else {
          alert(responseData.resultMessage);
          setErrorMsg(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("OrgUserLogIn_error", error);
        setErrorMsg("Error while processing");
      });
  }

  function goToUserPage() {
    navigate("/");
  }

  return (
    <div
      className="login"
      style={{ height: "100vh", position: "absolute", top: 0, width: "100%" }}
    >
      <div className="login_wrapper">
        <div className=" loginFormContainer ">
          <section className="login_content">
            <form onSubmit={submitLogInForm}>
              <h1>Login</h1>
              <div>
                <input
                  type="text"
                  className="form-control"
                  placeholder="(e.g. Registred Mobile No or UID)"
                  name="username"
                  id="username"
                  ref={userNameRef}
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  name="userPassword"
                  id="userPassword"
                  ref={userPasswordRef}
                  required
                />
              </div>
              <div>
                <button
                  type="Submit"
                  title="Log in"
                  className="btn btn-outline-primary submit"
                >
                  Log in
                </button>
                <a
                  className="reset_pass"
                  target="_blank"
                  href="https://docmaster.in/forgetpassword"
                >
                  Lost your password?
                </a>
              </div>

              <div className="clearfix"></div>

              <div className="separator">
                <div className="clearfix"></div>                
                <b><a href="/decTermCond">Disclaimer, Terms & Conditions</a></b>
                <br />
                <div>
                  <h1>DocMaster :: Organisation</h1>
                  <p>2023 All Rights Reserved. DocMaster</p>
                </div>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
