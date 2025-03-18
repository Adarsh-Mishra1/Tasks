//Create.js
import { useEffect, useState, useRef, Suspense, lazy } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, FormGroup, Label, Input, Col } from "reactstrap";
import axios from "axios";

import userStore from "../../zustand/userStore";
import {
  WsAddClient,
  WsAddClientNew,
  WSsentOTPClient,
  WSverifyOTPClient,
} from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";
import Popup from "../../pages/caseDiary/Popup";
import { toast } from "react-toastify";
const CreateClient = (props) => {
  let navigate = useNavigate();
  const userData = userStore((state) => state.user);
  console.log("userData_", userData);
  const [mobile, setMobile] = useState("");
  const [gender, setGender] = useState(""); // Store selected gender
  const nameRef = useRef();
  const genderRef = useRef();
  const addressRef = useRef();
  const mobileNoRef = useRef();
  const eMailRef = useRef();
  const [errorMsg, setErrorMsg] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [otp, setOtp] = useState("");
  const [toContinue1, setTocontinue1] = useState(false);
  const [client, setClient] = useState(null);

  // function onSubmitHandler(e) {
  //   if (e != null) {
  //     e.preventDefault();
  //   }

  //   if (nameRef.current.value.length < 3) {
  //     alert("Check Name!");
  //   } else if (mobileNoRef.current.value.length < 10) {
  //     alert("Check Mobile No!");
  //   } else {
  //     processAddClient(e != null ? true : false);
  //   }
  // }

  function onSubmitHandler(e) {
    e.preventDefault();
    const activeButton = document.activeElement;
    setTocontinue1(activeButton.value === "save_and_continue" ? true : false);
    processAddClient(activeButton.value === "save_and_continue" ? true : false);
  }

  function processAddClient(toContinue) {
    /*
     * Long orgId;
     * String name;
     * String mobileNo;
     * String emailId;
     * Long userId;
     */
    // WsAddClientNew
    // const gender = genderRef.current?.value || "";
    // const name = nameRef.current?.value || "";
    axios
      .post(
        // WsAddClient,
        WsAddClientNew,
        // "http://localhost:8081/dm_leorg_new/addClientNew",
        JSON.stringify({
          orgId: userData.org.id,
          userId: userData.id,
          name: gender + nameRef.current?.value || "",
          mobileNo: mobileNoRef.current.value,
          address: addressRef.current.value || "",
          emailId:
            eMailRef.current?.value?.length > 5 ? eMailRef.current.value : null,
        }),
        {
          headers: apiKeyHeader(),
        }
      )
      .then((response) => {
        const responseData = response.data;
        console.log("OrgUserLogIn_responseData", responseData);
        // if (responseData.resultCode === 2) {
        //   sendOtp(responseData.client.mobileNo);
        //   setIsPopupVisible(true);
        // }

        if (responseData.resultCode >= 1) {
          if (responseData.resultMessage.includes("exists")) {
            return alert("Client Already exists");
          }
          if (!responseData.resultMessage.includes("Added")) {
            alert(
              `Client Mapped to ORG Client Name: ${responseData.client.name} Client Email: ${responseData.client.email}`
            );
          }
          // if (props.onReturn != null || props.onReturn != undefined) {
          //   props.onReturn(responseData.client);
          // }
          if (props.onReturn != null || props.onReturn != undefined) {
            props.onReturn(responseData.client);
            // setClient(responseData.client);
            // sendOtp(responseData.client.mobileNo);
            // setMobile(responseData.client.mobileNo);
          } else {
            if (toContinue) {
              goToAddCaseForClient(responseData.client);
            } else {
              goToClientCases(responseData.client);
            }
            // setClient(responseData.client);
            // sendOtp(responseData.client.mobileNo);
            // setMobile(responseData.client.mobileNo);

            // setIsPopupVisible(true);
          }
        } else {
          alert(responseData.resultMessage);
          setErrorMsg(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("error", error);
        setErrorMsg("Error while processing");
      });
  }

  // const sendOtp = (mobileNo) => {
  //   const loader = toast.success("Loading...", { autoClose: false });

  //   axios
  //     .post(WSsentOTPClient, JSON.stringify({ mobileNoOrEmail: mobileNo }), {
  //       headers: apiKeyHeader(),
  //     })
  //     .then((otpResponse) => {
  //       console.log("OTP sent:", otpResponse.data);
  //       setIsPopupVisible(true);
  //     })
  //     .catch((error) => {
  //       console.error("Error sending OTP:", error);
  //     });
  //   toast.dismiss(loader);
  // };

  // const verifyOTP = () => {
  //   const loader = toast.success("Loading...", { autoClose: false });

  //   axios
  //     .post(
  //       WSverifyOTPClient,
  //       JSON.stringify({
  //         otpType: "mobile_fg",
  //         otpText: otp,
  //         lorgnewClientId: client.id,
  //       }),
  //       { headers: apiKeyHeader() }
  //     )
  //     .then((verifyResponse) => {
  //       console.log("OTP verified:", verifyResponse.data);
  //       if (verifyResponse.data.result_code === 1) {
  //         alert("OTP verified successfully!");
  //         setIsPopupVisible(false);
  //         if (props.onReturn && typeof props.onReturn === "function") {
  //           props.onReturn(client);
  //         } else {
  //           if (toContinue1) {
  //             goToAddCaseForClient(client);
  //           } else {
  //             goToClientCases(client);
  //           }
  //         }
  //       } else {
  //         alert("Failed to verify OTP.");
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error verifying OTP:", error);
  //     });
  //   toast.dismiss(loader);
  // };

  const goToClientCases = (client) => {
    window.location.reload();
    // navigate("/clientCaseShowAllByClient", {
    //   state: {
    //     client: client,
    //   },
    // });
  };

  const goToAddCaseForClient = (client) => {
    navigate("/clientCaseCreate", {
      state: {
        client: client,
      },
    });
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
    console.log(e.target.value);
  };
  return (
    <>
      <Form onSubmit={onSubmitHandler}>
        
        <div className="form-box px-lg-2 px-2">
        <FormGroup className="mb-3" row>
          <Label for="inlineRadio1" sm={2}>
            Title *
          </Label>

          <Col sm={10}>
            <div className="d-flex justify-content-start align-content-center gap-3 mb-2">
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  type="radio"
                  innerRef={genderRef}
                  name="gender"
                  id="inlineRadio1"
                  value="Mr."
                  onChange={handleGenderChange}
                />
                <label class="form-check-label" for="inlineRadio1">
                  Mr.
                </label>
              </div>
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  type="radio"
                  innerRef={genderRef}
                  name="gender"
                  id="inlineRadio2"
                  value="Mrs."
                  onChange={handleGenderChange}
                />
                <label class="form-check-label" for="inlineRadio2">
                  Mrs.
                </label>
              </div>
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  type="radio"
                  innerRef={genderRef}
                  name="gender"
                  id="inlineRadio3"
                  value="Ms."
                  onChange={handleGenderChange}
                />
                <label class="form-check-label" for="inlineRadio3">
                  Ms.
                </label>
              </div>
            </div>
          </Col>
        </FormGroup>
          <FormGroup className="mb-3" row>
            <Label for="inputname" sm={2}>
              Name *
            </Label>

            <Col sm={10}>
              <Input
                type="text"
                className="form-control "
                id="inputname"
                aria-describedby="nameHelp"
                innerRef={nameRef}
                minLength={3}
                maxLength={64}
                required
              />
            </Col>
          </FormGroup>

          <FormGroup className="mb-3" row>
            <Label for="inputmobileno" sm={2}>
              Mobile No *
            </Label>

            <Col sm={10}>
              <Input
                type="tel"
                className="form-control "
                id="inputmobileno"
                aria-describedby="mobileNoHelp"
                innerRef={mobileNoRef}
                minLength={10}
                maxLength={10}
                pattern="[0-9]*"
                onKeyPress={(e) => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                required
              />
            </Col>
          </FormGroup>

          <FormGroup className="mb-3" row>
            <Label for="inputemailid" sm={2}>
              Email Id *
            </Label>

            <Col sm={10}>
              <Input
                type="email"
                className="form-control "
                id="inputemailid"
                aria-describedby="eMailIdHelp"
                innerRef={eMailRef}
                minLength={7}
                maxLength={120}
                required
              />
            </Col>
          </FormGroup>
          <FormGroup className="mb-3" row>
            <Label for="inputname" sm={2}>
              Address
            </Label>

            <Col sm={10}>
              <Input
                type="text"
                className="form-control "
                id="inputname"
                aria-describedby="nameHelp"
                innerRef={addressRef}
                minLength={3}
                maxLength={64}
                // required
              />
            </Col>
          </FormGroup>

          <div className="text-end">
            <button
              className="btn btn-primary btn-sm my-1 me-0"
              style={{
                fontSize: "14px",

                cursor: "pointer",
                textDecoration: "none",
              }}
              onMouseEnter={(e) =>
                (e.target.style.textDecoration = "underline")
              }
              onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
              // onClick={onSubmitHandler}
              type="submit"
              name="action"
              value="save_and_continue"
            >
              Save & Continue (To fill case details)
            </button>
            {props?.onReturn == undefined || props?.onReturn == null ? (
              <>
                 
                <button
                  className="btn btn-sm btn-primary ms-2 my-1 me-0"
                  style={{
                    fontSize: "14px",

                    cursor: "pointer",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.textDecoration = "underline")
                  }
                  onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
                  // onClick={() => onSubmitHandler(null)}
                  type="submit"
                  name="action"
                  value="submit_and_exit"
                >
                  Submit & Exit (Without filling case details)
                </button>
              </>
            ) : null}
          </div>
        </div>
      </Form>
      {/* {isPopupVisible && (
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
              <h4 className="text-center">Enter the OTP</h4>
              <p>An OTP has been sent to your mobile number: {mobile}</p>
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
              <div className="d-flex justify-content-center gap-3">
              
              <button
                className="btn btn-primary m-0 "
                style={{ marginRight: "10px" }}
                onClick={verifyOTP}
              >
                Submit
              </button>
              <button
                onClick={() => setIsPopupVisible(false)}
                className="btn btn-secondary m-0 w-50"
              >
                Cancel
              </button>
              </div>
            </div>
          }
        />
      )} */}
    </>
  );
};

export default CreateClient;
