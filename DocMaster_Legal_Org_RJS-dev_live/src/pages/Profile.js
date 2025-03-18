import React, { Suspense, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { apiKeyHeader } from "../configs/ApiKeys";
import userStore from "../zustand/userStore";
const Profile = () => {
  const [imagePreview, setImagePreview] = useState("/images/advocate.png");
  const [responseData, setResponseData] = useState(null);
  const userData1 = userStore((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    bankholderName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    gstNo: "",
    pancard: "",
    address: "",
  });

  console.log("userData_", userData1);
  console.log(userData1.org.id);
  console.log(userData1.id);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const fetchData = async () => {
    try {
      const response = await axios.post(
        "https://web1024.ipguide.net:5000/profile",
        JSON.stringify({
          org_id: userData1.org.id,
          user_id: userData1.id,
        }),
        {
          headers: apiKeyHeader(),
        }
      );
      setResponseData(response.data.data);
      setFormData({
        bankholderName: response.data.data?.bankDetails?.BankHolderName || "",
        bankName: response.data.data?.bankDetails?.bankName || "",
        accountNumber: response.data.data?.bankDetails?.accountNumber || "",
        ifscCode: response.data.data?.bankDetails?.ifscCode || "",
        gstNo: response.data.data?.bankDetails?.GstNumber || "",
        pancard: response.data.data?.bankDetails?.PanNumber || "",
        address: response.data.data?.organization?.organizationAddress || "",
      });
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userData1]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestBody = {
      userId: userData1.id,
      orgId: userData1.org.id,
      bankholderName: formData.bankholderName,
      bankName: formData.bankName,
      accountNumber: formData.accountNumber,
      ifscCode: formData.ifscCode,
      gstNumber: formData.gstNo,
      panNumber: formData.pancard,
      address: formData.address,
    };

    try {
      const response = await axios.put(
        "https://web1024.ipguide.net:5000/update-bank-details",
        JSON.stringify(requestBody),
        {
          headers: apiKeyHeader(),
        }
      );
      console.log("Profile updated successfully:", response.data);
      fetchData();
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile.");
    }
  };

  const formattedDate = new Date(
    responseData?.organization?.organizationExpireOn
  ).toLocaleDateString("en-US");

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Suspense fallback={<>Loading...</>}>
      <div className="main_container login">
        <Navbar />
        <Sidebar />

        <div
          className="right_col ps-3 pt-4 pe-3 d-flex align-items-start justify-content-between flex-column"
          role="main"
          style={{ overflowY: "auto", overflowX: "hidden", marginRight: "0" }}
        >
          <div className="row h-100 mt-5 w-100">
            <div className="col-md-3 col-sm-12  ">
              <div className="avatar-upload mb-5">
                <div className="avatar-edit">
                  <input
                    type="file"
                    id="imageUpload"
                    accept=".png, .jpg, .jpeg"
                    onChange={handleImageChange}
                  />
                  <label htmlFor="imageUpload"></label>
                </div>
                <div className="avatar-preview">
                  <div
                    id="imagePreview"
                    style={{
                      backgroundImage: `url(${imagePreview})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  ></div>
                </div>
              </div>
              <div className="mb-3">
                <ul class="list-group ">
                  <li class="list-group-item d-flex bg-primary  justify-content-between">
                    <div class="ms-2 me-auto text-center">
                      <div class="fw-bold text-white text-center text-18">
                        Subscription Details
                      </div>
                    </div>
                    {/* <span class="badge bg-primary rounded-pill">14</span> */}
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-start">
                    <div class="ms-2 me-auto">
                      <div class="fw-bold">Subscription Type</div>
                    </div>
                    <span class="badge bg-primary rounded-pill">
                      {responseData?.userOrder?.subscriptionPlan
                        ? responseData.userOrder.subscriptionPlan
                        : ""}
                    </span>
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-start">
                    <div class="ms-2 me-auto">
                      <div class="fw-bold">Subscription Expires on</div>
                    </div>
                    <span class="badge bg-primary rounded-pill">
                      {formattedDate}
                    </span>
                  </li>
                  <li class="list-group-item d-flex p-0 justify-content-between align-items-start">
                    <a
                      className="btn btn-sm m-0 w-100 btn-primary bg-primary"
                      href="/Pricing"
                    >
                      Upgrade Now
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-6 col-sm-12  ">
              <div className="card p-3">
                <form className="signup-form bg-white" onSubmit={handleSubmit}>
                  {/* <!-- First name --> */}
                  <div class="form-group   align-items-center row px-0  mb-2">
                    <div class="col-md-5">
                      <label for="fullname">
                        Full Name: <span style={{ color: "red" }}>*</span>
                      </label>
                    </div>
                    <div class="col-md-7">
                      <input
                        type="text"
                        class="form-control form-control-lg h-15"
                        // placeholder="e.g. Ram Singh"
                        id="firstName"
                        name="firstName"
                        value={
                          responseData?.user?.userName
                            ? responseData.user.userName
                            : ""
                        }
                        disabled
                        required
                      />
                    </div>
                  </div>

                  {/* <!-- Email --> */}
                  <div class="form-group   align-items-center row px-0  mb-2">
                    <div class="col-md-5">
                      <label for="email">
                        Email ID: <span style={{ color: "red" }}>*</span>
                      </label>
                    </div>
                    <div class="col-md-7">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        class="form-control form-control-lg h-15"
                        // placeholder="e.g. ramsingh@docmaster.in"
                        value={
                          responseData?.user?.userEmail
                            ? responseData.user.userEmail
                            : ""
                        }
                        disabled
                        required
                      />
                    </div>
                  </div>

                  {/* <!-- mobile no --> */}
                  <div class="form-group   align-items-center row px-0  mb-2">
                    <div class="col-md-5">
                      <label for="phone">
                        Mobile no: <span style={{ color: "red" }}>*</span>
                      </label>
                    </div>
                    <div class="col-md-7">
                      <input
                        type="tel"
                        class="form-control form-control-lg h-15"
                        // placeholder="e.g. 9899011044"
                        value={
                          responseData?.user?.userMobileNo
                            ? responseData.user.userMobileNo
                            : ""
                        }
                        required
                        pattern="[0-9]{10}"
                        title="Please enter a 10-digit phone number"
                        id="phoneNo"
                        name="phoneNo"
                        maxLength={10}
                        disabled
                      />
                    </div>
                  </div>

                  {/* <!-- Organisation --> */}
                  <div class="form-group   align-items-center row px-0  mb-2">
                    <div class="col-md-5">
                      <label for="username">
                        Firm Name: <span style={{ color: "red" }}>*</span>
                      </label>
                    </div>
                    <div class="col-md-7">
                      <input
                        // type="password"
                        type="text"
                        id="password"
                        name="password"
                        class="form-control form-control-lg h-15"
                        // placeholder="Enter your password"
                        value={
                          responseData?.organization?.organizationName
                            ? responseData.organization.organizationName
                            : ""
                        }
                        disabled
                        required
                      />
                    </div>
                  </div>
                  {/* <!-- Address --> */}
                  <div class="form-group   align-items-center row px-0  mb-2">
                    <div class="col-md-5">
                      <label for="address">
                        Address: <span style={{ color: "red" }}>*</span>
                      </label>
                    </div>
                    <div class="col-md-7">
                      <input
                        style={{ minHeight: "30px", height: "30px" }}
                        class="form-control form-control-lg"
                        // placeholder="e.g. Ram Singh, Noida"
                        // value={
                        //   responseData?.organization?.organizationAddress
                        //     ? responseData.organization.organizationAddress
                        //     : ""
                        // }
                        value={formData.address}
                        onChange={handleInputChange}
                        id="address"
                        name="address"
                        required
                      />
                    </div>
                  </div>

                  {/* <!-- Legal Membership no --> */}
                  <div class="form-group   align-items-center row px-0  mb-2">
                    <div class="col-md-5">
                      <label for="Legal Membership no">
                        Bar Membership No:{" "}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                    </div>
                    <div class="col-md-7">
                      <input
                        type="textarea"
                        id="landmark"
                        name="landmark"
                        class="form-control form-control-lg h-15"
                        placeholder="e.g. 9XXXXXXXXXX"
                        disabled
                        required
                      />
                    </div>
                  </div>

                  {/* <!-- Register Button --> */}
                  <div className="devider">
                    <hr />
                  </div>
                  <p className="text-center">
                    <b>Bank Details</b>
                  </p>
                  <div class="form-group   align-items-center row px-0  mb-2">
                    <div class="col-md-5">
                      <label for="bankholderName">
                        Bank Holder's Name:
                        <span style={{ color: "red" }}>*</span>
                      </label>
                    </div>
                    <div class="col-md-7">
                      <input
                        type="text"
                        id="bankholderName"
                        name="bankholderName"
                        class="form-control form-control-lg h-15"
                        value={formData.bankholderName}
                        onChange={handleInputChange}
                        placeholder=""
                        required
                      />
                    </div>
                  </div>
                  <div class="form-group   align-items-center row px-0  mb-2">
                    <div class="col-md-5">
                      <label for="bankName">
                        Bank Name:
                        <span style={{ color: "red" }}>*</span>
                      </label>
                    </div>
                    <div class="col-md-7">
                      <input
                        type="text"
                        id="bankName"
                        name="bankName"
                        class="form-control form-control-lg h-15"
                        placeholder=""
                        value={formData.bankName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div class="form-group   align-items-center row px-0  mb-2">
                    <div class="col-md-5">
                      <label for="accountNuber">
                        Account Number:
                        <span style={{ color: "red" }}>*</span>
                      </label>
                    </div>
                    <div class="col-md-7">
                      <input
                        type="text"
                        id="accountNumber"
                        name="accountNumber"
                        class="form-control form-control-lg h-15"
                        value={formData.accountNumber}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div class="form-group   align-items-center row px-0  mb-2">
                    <div class="col-md-5">
                      <label for="ifscCode">
                        IFSC Code:
                        <span style={{ color: "red" }}>*</span>
                      </label>
                    </div>
                    <div class="col-md-7">
                      <input
                        type="text"
                        id="ifscCode"
                        name="ifscCode"
                        class="form-control form-control-lg h-15"
                        placeholder=""
                        value={formData.ifscCode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div class="form-group   align-items-center row px-0  mb-2">
                    <div class="col-md-5">
                      <label for="panNumber">PAN Card:</label>
                    </div>
                    <div class="col-md-7">
                      <input
                        type="text"
                        id="pancard"
                        name="pancard"
                        class="form-control form-control-lg h-15"
                        value={formData.pancard}
                        onChange={handleInputChange}
                        placeholder=""
                      />
                    </div>
                  </div>
                  <div class="form-group   align-items-center row px-0  mb-2">
                    <div class="col-md-5">
                      <label for="gstNumber">GST Number:</label>
                    </div>
                    <div class="col-md-7">
                      <input
                        type="text"
                        id="gstNo"
                        name="gstNo"
                        class="form-control form-control-lg h-15"
                        placeholder=""
                        value={formData.gstNo}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <hr />
                  <div className="d-flex justify-content-between">
                    <button
                      class="btn btn-sm m-0 btn-outline-secondary"
                      onClick={(e) => e.preventDefault()}
                    >
                      Change Password
                    </button>
                    <button type="submit" class="btn btn-sm m-0 btn-primary">
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="col-md-3 col-sm-12  "></div>
          </div>
        </div>
        <Footer />
      </div>
    </Suspense>
  );
};
export default Profile;
