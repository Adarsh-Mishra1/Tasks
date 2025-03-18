import React, { useEffect, useState } from "react";
import userStore from "../zustand/userStore";
import { QRCodeCanvas } from "qrcode.react";
import Popup from "./caseDiary/Popup";
import { toast } from "react-toastify";

const GetSubscriptionPlans =
  "https://web1024.ipguide.net:5000/payment/get-subscription-plans";
const InitialTranscation =
  "https://web1024.ipguide.net:5000/payment/intialtransaction";

function Paymntethod({ navBar = true }) {
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [isQrVisible, setIsQrVisible] = useState(false);
  const [isQrVisibles, setIsQrVisibles] = useState(false);
  const [isCardVisibles, setIsCardVisibles] = useState(false);
  const [isupiVisibles, setIsupiVisibles] = useState(false);
  const [timer, setTimer] = useState(300);
  const [transactionId, setTransactionId] = useState(null);
  const [payload, setPayload] = useState(null);
  const [plans, setPlan] = useState([]);
  const userData = userStore((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(GetSubscriptionPlans);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("New Payload", data);
        setPlan(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

//   useEffect(() => {
//     let interval;
//     if (isQrVisible && timer > 0) {
//       interval = setInterval(() => {
//         setTimer((prevTime) => prevTime - 1);
//       }, 1000);
//     } else if (timer === 0) {
//     //   setIsQrVisible(false);
//     }

//     return () => clearInterval(interval);
//   }, [isQrVisible, timer]);

  const handlePaySelection = async () => {
    setIsQrVisibles(true);
  };
  const handlePayCardSelection = async () => {
    setIsCardVisibles(true);
  }
  const handlePayUpiSelection = async () => {
    setIsupiVisibles(true);
  }

  

  const transactionStatus = async (transactionId, thirdPayload) => {
    try {
      const toastLoader = toast.success("Loading....", { autoClose: false });
      const response = await fetch(
        "https://web1024.ipguide.net:5000/payment/transaction-status",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ transaction_id: transactionId }),
        }
      );
      toast.dismiss(toastLoader);
      if (response.ok) {
        const data = await response.json();
        console.log("Transaction Status:", data);
        const outerData = JSON.parse(data.data);
        console.log("Outer Data", outerData);
 
        if (outerData.status === "PENDING" || outerData.status === "SUCCESS") {
          const toastLoader =
            outerData.status === "SUCCESS"
              ? toast.success("Loading....", { autoClose: false })
              : null;
          const orderStatus = outerData.status === "PENDING" ? 3 : 2;
          const payload = {
            ...thirdPayload,
            order_status: orderStatus,
          };

          const thirdResponse = await fetch(
            "https://web1024.ipguide.net:5000/payment/updateRefId",
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            }
          );

          const thirdResult = await thirdResponse.json();
          console.log("Third API response:", thirdResult);
          if (outerData.status === "PENDING") {
            toast.error("Payment is pending", { autoClose: 3000 });
          } else if (outerData.status === "SUCCESS") {
            toast.dismiss(toastLoader);
            toast.success("Payment is SUCCESS");
            // setIsQrVisible(false);
          }
        }
      } else {
        console.error("API call failed:", response.status);
        toast.error("Failed to fetch transaction status", { autoClose: 3000 });
      }
    } catch (error) {
      console.error("Error occurred while calling the API:", error);
      toast.error("Error occurred while calling the API", { autoClose: 3000 });
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };
  return (
    <div className="" style={{ height: "100vh", overflowY: "auto" }}>
      {navBar && (
        <nav
          className="navbar navbar-expand-lg navbar-light bg-white px-4 py-0"
          style={{
            position: "fixed",
            width: "100%",
            top: "0",
            background: "#FFF",
            zIndex: "9",
          }}
        >
          <div className="container-fluid">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse justify-content-start text-center"
              id="navbarNav"
            >
              <ul className="navbar-nav ps-0">
                <li className="nav-item">
                  <a className="nav-link" href="/">
                    Home
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/home#aboutus">
                    About Us
                  </a>
                </li>
                {/* <li className="nav-item">
                  <a className="nav-link" href="/home#feedback">
                    Feedback
                  </a>
                </li> */}
                {/* <li className="nav-item">
                  <a className="nav-link" href="/home#pricing">
                    Pricing
                  </a>
                </li> */}
                <li className="nav-item">
                  <a className="nav-link" href="/home#">
                    Career
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/home#contactus">
                    Contact Us
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/home#faq">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <a className="navbar-brand ms-auto" href="/">
              <img
                src="images/logo/docmaster.png"
                alt="Logo"
                className="logo img-fluid"
              />
            </a>
          </div>
        </nav>
      )}
      <div class="container-fluid payment  " style={{marginTop: "5rem"}}>
        <div class="box-1 bg-light user w-70 pt-4 m-auto" style={{ boxShadow:'0 8px 16px rgba(0, 0, 0, 0.2)', borderRadius:'10px' }}>
             
            <div class="box-inner-1 pb-3 mb-3 " >
                 
                <div class="radiobtn">
                    <input type="radio" name="box" id="one"/>
                    <input type="radio" name="box" id="four"/>
                    <input type="radio" name="box" id="two"/>
                    <input type="radio" name="box" id="three"/>
                    {/* <input type="radio" name="box" id="five"/> */}
                    <input type="radio" name="box" id="six"/>

                    <label for="one" class="box py-2 first" onClick={() => handlePaySelection()}>
                        <div class="d-flex align-items-start">
                            <span class="circle"></span>
                            <div class="course">
                                <div class="d-flex align-items-center justify-content-between mb-2">
                                    <span class="fw-bold">
                                        QR Code
                                    </span>
                                    <span class="fas fa-dollar-sign">₹ 5000.00</span>
                                </div>
                                <div className="d-flex my-2 w-100 justify-content-between">
                                    <div className="d-flex w-100 justify-content-between">
                                        <div className="w-75" style={{filter:'blur(1px)'}}><span><img src="images/qr.png" width={60} /></span></div>  
                                        <div className="w-25 d-flex align-items-end">
                                            <div className="w-100 align-items-end">
                                                 
                                                <div class="d-flex w-100 my-2 align-items-end justify-content-between">
                                                    <span>Charges</span>
                                                    <span>00.00</span>
                                                </div>
                                                 
                                                <div class="d-flex w-100 my-2 align-items-end justify-content-between">
                                                    <span><b>Total:</b></span>
                                                    <span><b>₹ 5000.00</b></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <p className="mb-0"><i>Charges are applicable</i></p>
                            </div>
                        </div>
                    </label>
                    <label for="four" class="box py-2 four" onClick={() => handlePayUpiSelection()}>
                        <div class="d-flex">
                            <span class="circle"></span>
                             
                            <div class="course">
                                <div class="d-flex align-items-center justify-content-between mb-2">
                                    <span class="fw-bold">
                                      UPI Payment
                                    </span>
                                    <span class="fas fa-dollar-sign">₹ 5000.00</span>
                                </div>
                                <div className="d-flex my-2 w-100 justify-content-between">
                                    <div className="d-flex w-100 justify-content-between">
                                        <div className="w-75"><span><img src="images/upi-icon.png" width={60} /></span></div>  
                                        <div className="w-25 d-flex align-items-end">
                                            <div className="w-100 align-items-end">
                                                 
                                                <div class="d-flex w-100 my-2 align-items-end justify-content-between">
                                                    <span>Charges</span>
                                                    <span>00.00</span>
                                                </div>
                                                 
                                                <div class="d-flex w-100 my-2 align-items-end justify-content-between">
                                                    <span><b>Total:</b></span>
                                                    <span><b>₹ 5000.00</b></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <p className="mb-0"><i>Charges are applicable</i></p>
                            </div>
                        </div>
                    </label>
                    <label for="two" class="box py-2 second" onClick={() => handlePayCardSelection()}>
                        <div class="d-flex">
                            <span class="circle"></span>
                            <div class="course">
                                <div class="d-flex align-items-center justify-content-between mb-2">
                                    <span class="fw-bold">
                                        Credit Card
                                    </span>
                                    <span class="fas fa-dollar-sign">₹ 5000.00</span>
                                </div>
                                <div className="d-flex w-100 justify-content-between">
                                    <div><span><img src="images/card.png" width={60} /></span></div>  
                                    <div className="w-25 d-flex align-items-end">
                                        <div className="w-100 align-items-end">
                                            <div class="d-flex w-100 my-2 align-items-end justify-content-between">
                                                <span>Charges</span>
                                                <span>100.00</span>
                                            </div>
                                            <div class="d-flex w-100 my-2 align-items-end justify-content-between">
                                                <span><b>Total:</b></span>
                                                <span><b>₹ 5100.00</b></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <p className="mb-0"><i>Charges are applicable</i></p>
                            </div>
                        </div>
                    </label>
                    <label for="three" class="box py-2 third">
                        <div class="d-flex">
                            <span class="circle"></span>
                            <div class="course">
                                <div class="d-flex align-items-center justify-content-between mb-2">
                                    <span class="fw-bold">
                                        Debit Card
                                    </span>
                                    <span class="fas fa-dollar-sign">₹ 5000.00</span>
                                </div>
                                <div className="d-flex w-100 justify-content-between">
                                    <div><span><img src="images/card.png" width={60} /></span></div>  
                                    <div className="w-25 d-flex align-items-end">
                                        <div className="w-100 align-items-end">
                                            <div class="d-flex w-100 my-2 align-items-end justify-content-between">
                                                <span>Charges</span>
                                                <span>₹ 50.00</span>
                                            </div>
                                            <div class="d-flex w-100 my-2 align-items-end justify-content-between">
                                                <span><b>Total:</b></span>
                                                <span><b>₹ 5050.00</b></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <p className="mb-0"><i>Charges are applicable</i></p>
                            </div>
                        </div>
                    </label>
                    {/* 
                    <label for="five" class="box py-2 five">
                        <div class="d-flex">
                            <span class="circle"></span>
                            <div class="course">
                                <div class="d-flex align-items-center justify-content-between mb-2">
                                    <span class="fw-bold">
                                        Paypal
                                    </span>
                                    <span class="fas fa-dollar-sign">₹ 5050.00</span>
                                </div>
                                <span>Charges: ₹ 50.00</span>
                            </div>
                        </div>
                    </label> */}
                    <label for="six" class="box py-2 six">
                        <div class="d-flex">
                            <span class="circle"></span>
                            <div class="course">
                                <div class="d-flex align-items-center justify-content-between mb-2">
                                    <span class="fw-bold">
                                        Net Banking
                                    </span>
                                    <span class="fas fa-dollar-sign">₹ 5000.00</span>
                                </div>
                                <div className="d-flex w-100 justify-content-between">
                                    <div><span><img src="images/netbanking.png" width={60} /></span></div>  
                                    <div className="w-25 d-flex align-items-end">
                                        <div className="w-100 align-items-end">
                                            <div class="d-flex w-100 my-2 align-items-end justify-content-between">
                                                <span>Charges</span>
                                                <span>₹ 50.00</span>
                                            </div>
                                            <div class="d-flex w-100 my-2 align-items-end justify-content-between">
                                                <span><b>Total:</b></span>
                                                <span><b>₹ 5050.00</b></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <p className="mb-0"><i>Charges are applicable</i></p>
                            </div>
                        </div>
                    </label>
                </div>
                <div>
                    <p className="mb-0 mt-3 text-danger"><b>Notes</b></p>
                    <ul>
                        <li>Transaction will be added and borne by the customers </li>
                        <li>You cannot change the subscription plan from Upper level to lower level.</li>
                        <li>Any support required or complain should be emailed to <a href="support@docmaster.legal" target="_blank"><u>support@docmaster.legal</u></a></li>
                    </ul>
                </div>
            </div>
        </div>
        {/* <div class="box-2">
            <div class="box-inner-2">
                <div>
                    <p class="fw-bold">Payment Details</p>
                    <p class="dis mb-3">Complete your purchase by providing your payment details</p>
                </div>
                <form action="">
                    <div class="mb-3">
                        <p class="dis fw-bold mb-2">Email address</p>
                        <input class="form-control" type="email" value="luke@skywalker.com"/>
                    </div>
                    <div>
                        <p class="dis fw-bold mb-2">Card details</p>
                        <div class="d-flex align-items-center justify-content-between card-atm border rounded">
                            <div class="fab fa-cc-visa ps-3"></div>
                            <input type="text" class="form-control" placeholder="Card Details"/>
                            <div class="d-flex w-50">
                                <input type="text" class="form-control px-0" placeholder="MM/YY"/>
                                <input type="password" maxlength='3' class="form-control px-0" placeholder="CVV"/>
                            </div>
                        </div>
                        <div class="my-3 cardname">
                            <p class="dis fw-bold mb-2">Cardholder name</p>
                            <input class="form-control" type="text"/>
                        </div>
                        <div class="address">
                            <p class="dis fw-bold mb-3">Billing address</p>
                            <select class="form-select" aria-label="Default select example">
                                <option selected hidden>United States</option>
                                <option value="1">India</option>
                                <option value="2">Australia</option>
                                <option value="3">Canada</option>
                            </select>
                            <div class="d-flex">
                                <input class="form-control zip" type="text" placeholder="ZIP"/>
                                <input class="form-control state" type="text" placeholder="State"/>
                            </div>
                            <div class=" my-3">
                                <p class="dis fw-bold mb-2">VAT Number</p>
                                <div class="inputWithcheck">
                                    <input class="form-control" type="text" value="GB012345B9"/>
                                    <span class="fas fa-check"></span>

                                </div>
                            </div>
                            <div class="d-flex flex-column dis">
                                <div class="d-flex align-items-center justify-content-between mb-2">
                                    <p>Subtotal</p>
                                    <p><span class="fas fa-dollar-sign"></span>33.00</p>
                                </div>
                                <div class="d-flex align-items-center justify-content-between mb-2">
                                    <p>VAT<span>(20%)</span></p>
                                    <p><span class="fas fa-dollar-sign"></span>2.80</p>
                                </div>
                                <div class="d-flex align-items-center justify-content-between mb-2">
                                    <p class="fw-bold">Total</p>
                                    <p class="fw-bold"><span class="fas fa-dollar-sign"></span>35.80</p>
                                </div>
                                <div class="btn btn-primary mt-2">Pay<span class="fas fa-dollar-sign px-1"></span>35.80
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div> */}
    </div>
    {isQrVisibles && (
        <Popup
        title="QR Payment"
        onClose={() => setIsQrVisibles(false)}
        height="350px"
        maxWidth="400px"
        children={
            <div
            style={{
                textAlign: "center",
                justifyContent: "center",
                alignItems: "center",
            }}
            >
            <div className="pb-5">
                <div style={{  padding: "10px" }}>
                <QRCodeCanvas
                    value={qrCodeUrl}
                    size={150}
                    style={{
                    border: "2px solid blue",
                    padding: "10px",
                    borderRadius: "10px",
                    marginBottom: "40px",
                    marginTop: "20px",
                    }}
                />
                <p>
                    QR Code will disappear in {formatTime(timer)}
                </p>
                <p>Transaction ID: {transactionId}</p>
                 
                </div>
            </div>

            </div>  
            
        }
        />
    )}

    {isCardVisibles && (
        <Popup
        title="Card Payment"
        onClose={() => setIsCardVisibles(false)}
        height="350px"
        maxWidth="650px"
        children={
            <div
            style={{
                textAlign: "center",
                justifyContent: "center",
                alignItems: "center",
            }}
            >
            <div className="pb-5">
                <div className="px-5 mx-4" style={{  padding: "10px" }}>
                    <form action="">
                        <div class="mb-3 text-start">
                            <p class="dis fw-bold mb-2">Email address</p>
                            <input class="form-control" type="email" value="luke@skywalker.com"/>
                        </div>
                        <div className="text-start">
                            <p class="dis fw-bold mb-2">Card details</p>
                            <div class="d-flex align-items-center justify-content-between card-atm border rounded">
                                <i class="px-3" aria-hidden="true"><i class="fa fa-credit-card" aria-hidden="true"></i></i>
                                <input type="text" class="form-control" placeholder="Card Number"/>
                                <div class="d-flex w-50">
                                    <input type="text" class="form-control px-2" placeholder="MM/YY"/>
                                    <input type="password" maxlength='3' class="form-control px-2" placeholder="CVV"/>
                                </div>
                            </div>
                            <div class="my-3 cardname">
                                <p class="dis fw-bold mb-2">Cardholder name</p>
                                <input class="form-control" type="text"/>
                            </div>
                            <div class="address">
                                <p class="dis fw-bold mb-3">Billing address</p>
                                <select class="form-select" aria-label="Default select example">
                                    <option selected hidden>United States</option>
                                    <option value="1">India</option>
                                    <option value="2">Australia</option>
                                    <option value="3">Canada</option>
                                </select>
                                <div class="d-flex">
                                    <input class="form-control zip" type="text" placeholder="ZIP"/>
                                    <input class="form-control state" type="text" placeholder="State"/>
                                </div>
                                <div class=" my-3">
                                    <p class="dis fw-bold mb-2">VAT Number</p>
                                    <div class="inputWithcheck">
                                        <input class="form-control" type="text" value="GB012345B9"/>
                                        <span class="fas fa-check"></span>

                                    </div>
                                </div>
                                <div class="d-flex flex-column dis">
                                    <div class="d-flex align-items-center justify-content-between mb-2">
                                        <p>Subtotal</p>
                                        <p><span class="fas fa-dollar-sign"></span>₹ 5000.00</p>
                                    </div>
                                    {/* <div class="d-flex align-items-center justify-content-between mb-2">
                                        <p>VAT<span>(20%)</span></p>
                                        <p><span class="fas fa-dollar-sign"></span>2.80</p>
                                    </div> */}
                                    <div class="d-flex align-items-center justify-content-between mb-2">
                                        <p class="fw-bold">Total</p>
                                        <p class="fw-bold"><span class="fas fa-dollar-sign"></span>₹ 5000.00</p>
                                    </div>
                                    <div class="btn btn-primary mt-2">Pay<span class="fas fa-dollar-sign px-1"></span>5000.00
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

        </div>  
            
        }
        />
    )}

    {isupiVisibles && (
        <Popup
        title="UPI Payment"
        onClose={() => setIsupiVisibles(false)}
        minHeight="250px"
        maxWidth="650px"
        children={
            <div
            style={{
                textAlign: "center",
                justifyContent: "center",
                alignItems: "center",
            }}
            >
            <div className="pb-5">
                <div className="px-5 mx-4" style={{  padding: "10px" }}>
                    <form action="">
                        <div class="mb-3 text-start">
                            <p class="dis fw-bold mb-2">Upi ID</p>
                            <input class="form-control" type="text" value="upiid@ybl"/>
                            <button class="w-100 btn btn-primary mt-2">Pay<span class="fas fa-dollar-sign px-1"></span>5000.00</button>
                        </div>
                      </form>
                </div>
              </div>
            </div>
          }
        />
    )};
       
      {navBar && (
        <footer className="bg-footer text-dark pt-3">
          <div className="container-fluid">
            <div className="row px-5">
              <div className="col-12">
                <p className="mb-1 text-center">
                  Docmaster, A 75 Sector 63, Noida - 201301,
                  Uttar Pradesh, India, +91 9289-44-0048, info@docmaster.in
                </p>
              </div>
              <div className="col-12">
                <p className="mb-1 text-center">
                  <span className="mx-1">
                    <a
                      href="/Terms_and_Conditions"
                      className="text-dark"
                      target="_blank"
                    >
                      Terms & Conditions
                    </a>
                  </span>
                  |
                  <span className="mx-1">
                    <a href="/Disclaimer" className="text-dark" target="_blank">
                      Disclaimer
                    </a>
                  </span>
                  |
                  <span className="mx-1">
                    <a
                      href="/Cancellation_Policy"
                      className="text-dark"
                      target="_blank"
                    >
                      Cancellation Policy
                    </a>
                  </span>
                  |
                  <span className="mx-1">
                    <a
                      href="/ipr_copyrights"
                      className="text-dark"
                      target="_blank"
                    >
                      IPR & Copyright
                    </a>
                  </span>
                  |<span> All rights reserved © Docmaster </span>|
                  <a
                    href="https://wa.me/9289440046"
                    target="_blank"
                    class="footer-link mx-1"
                  >
                    <img src="images/WApp_icon.png" width={18} />
                  </a>
                  <a
                    href="https://www.facebook.com/docmasterin/"
                    target="_blank"
                    class="footer-link mx-1"
                  >
                    <img src="images/fb.png" width={16} />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/the-docmaster/?originalSubdomain=in"
                    target="_blank"
                    class="footer-link mx-1"
                  >
                    <img src="images/li.png" width={16} />
                  </a>
                  <a
                    href="https://www.instagram.com/docmaster_in/"
                    target="_blank"
                    class="footer-link mx-1"
                  >
                    <img src="images/Instagram.png" width={16} />
                  </a>
                  <a href="#" target="_blank" class="footer-link mx-1">
                    <img src="images/twitter.png" width={16} />
                  </a>
                </p>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default Paymntethod;
