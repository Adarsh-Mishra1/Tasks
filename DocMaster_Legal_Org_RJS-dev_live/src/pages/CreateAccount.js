import React from "react";

const SignUp = () => {
  return (
    <>
      <div
        className="login"
        style={{ height: "100vh", position: "absolute", top: 0, width: "100%" }}
      >
        <div className="login_wrapper">
          <div className=" loginFormContainer ">
            <section className="login_content">
              <form>
                <h1>Sign Up</h1>
                <div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Name"
                    name="name"
                    id="username"
                    //   ref={userNameRef}
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Mobile No"
                    name="mobile"
                    id="mobile"
                    //   ref={userNameRef}
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    name="email"
                    id="email"
                    //   ref={userNameRef}
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
                    //   ref={userPasswordRef}
                    required
                  />
                </div>
                <div>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Confirm Password"
                    name="userPassword"
                    id="userPassword"
                    //   ref={userPasswordRef}
                    required
                  />
                </div>
                <div>
                  <button
                    type="Submit"
                    title="Log in"
                    className="btn btn-outline-primary submit"
                  >
                    Sign Up
                  </button>
                  <a className="reset_pass" target="_blank" href="/login">
                    Already a user? Sign In
                  </a>
                </div>

                <div className="clearfix"></div>

                <div className="separator">
                  <div className="clearfix"></div>
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
    </>
  );
};

export default SignUp;
