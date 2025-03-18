import { useEffect, useState } from "react";
import "../../stylesheets/SignUp.css";
import { apiKeyHeader } from "../../configs/ApiKeys";

const Stage1 = ({ formData, setFormData, handleSubmit, setIsOpen, agree }) => {
  const [states, setStates] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "firstName" ? { orgName: value } : {}),
    }));
  };

  const handleCheckboxClick = (event) => {
    event.preventDefault();
    setIsOpen(true);
  };

  useEffect(function () {
    async function getStates() {
      const res = await fetch(
        `https://web1024.ipguide.net:8443/organisation/getCountryStates/4/1`,
        {
          headers: apiKeyHeader(),
        }
      );

      const data = await res.json();
      if (data.resultCode === 1) {
        setStates(data.resultMessage);
      } else {
        alert("Error Feching States");
      }
    }
    getStates();
  }, []);

  const [isDisabled, setIsDisabled] = useState(true);

  const handleRadioChange = (event) => {
    setIsDisabled(!event.target.checked);
    if (!event.target.checked) {
      setFormData((prev) => ({ ...prev, orgName: formData.firstName }));
    }
  };

  return (
    <form
      className="signup-form bg-white py-0"
      onSubmit={(e) => {
        e.preventDefault();
        if (formData.password === formData.confirmPassword) {
          handleSubmit(formData);
        } else {
          alert("Please enter matching passwords");
        }
      }}
    >
      {/* <!-- First name --> */}
      <div className="d-flex justify-content-center align-content-center gap-3 mb-2">
        <div class="form-check form-check-inline">
          <input
            class="form-check-input"
            type="radio"
            name="gender"
            id="inlineRadio1"
            value="mr"
          />
          <label class="form-check-label" for="inlineRadio1">
            Mr.
          </label>
        </div>
        <div class="form-check form-check-inline">
          <input
            class="form-check-input"
            type="radio"
            name="gender"
            id="inlineRadio2"
            value="mrs"
          />
          <label class="form-check-label" for="inlineRadio2">
            Mrs.
          </label>
        </div>
        <div class="form-check form-check-inline">
          <input
            class="form-check-input"
            type="radio"
            name="gender"
            id="inlineRadio3"
            value="ms"
          />
          <label class="form-check-label" for="inlineRadio3">
            Ms.
          </label>
        </div>
      </div>
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
            placeholder="e.g. Ram Singh"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
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
          <div class="input-group mb-0 ">
            <input
              type="email"
              id="email"
              name="email"
              class="form-control form-control-lg h-15"
              placeholder="e.g. ramsingh@docmaster.in"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {/* <button class="btn btn-outline-success m-0  btn-sm" title="Verify Email" type="button" id="button-addon2" style={{padding:'3px 10px',borderRadius:'0 8px 8px 0'}}><i class="fa fa-check-circle-o" aria-hidden="true"></i></button> */}
          </div>
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
          <div class="input-group mb-0 ">
            <input
              type="tel"
              class="form-control form-control-lg h-15"
              placeholder="e.g. 9899011044"
              required
              pattern="[0-9]{10}"
              aria-describedby="button-addon2"
              title="Please enter a 10-digit phone number"
              id="phoneNo"
              name="phoneNo"
              value={formData.phoneNo}
              onChange={handleChange}
              maxLength={10}
            />
            {/* <input type="text" class="form-control" placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="button-addon2"> */}
            {/* <button class="btn btn-outline-success m-0  btn-sm" title="Verify Phone" type="button" id="button-addon2" style={{padding:'3px 10px',borderRadius:'0 8px 8px 0'}}><i class="fa fa-check-circle-o" aria-hidden="true"></i></button> */}
          </div>
        </div>
      </div>

      {/* <!-- Password --> */}
      <div class="form-group   align-items-center row px-0  mb-2">
        <div class="col-md-5">
          <label for="password">
            Password: <span style={{ color: "red" }}>*</span>
          </label>
        </div>
        <div class="col-md-7">
          <input
            type="password"
            id="password"
            name="password"
            class="form-control form-control-lg h-15"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* <!-- Confirm Password --> */}
      <div class="form-group   align-items-center row px-0  mb-2">
        <div class="col-md-5">
          <label for="password">
            Confirm Password:<span style={{ color: "red" }}>*</span>
          </label>
        </div>
        <div class="col-md-7">
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            class="form-control form-control-lg h-15"
            placeholder="Enter your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
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
          <div className="d-flex gap-2">
            <div class="form-check py-1 ms-1">
              <input
                class="form-check-input "
                style={{ width: "auto", padding: "5px" }}
                type="checkbox"
                value="yes"
                name="flexRadioDefault"
                onChange={handleRadioChange}
                id="newFirmName"
              />
              <label class="form-check-label mb-0" for="newFirmName">
                New
              </label>

              {/* <div class="form-check  ms-1">
          <input class="form-check-input " checked style={{width:"auto",padding:"7px"}} type="radio" value="no" name="flexRadioDefault" onChange={handleRadioChange} id="newFirmNameExisting"/>
          <label class="form-check-label mb-0" for="newFirmNameExisting">
            Full Name
          </label>
        </div> */}
            </div>
            <input
              style={{ minHeight: "30px", height: "30px" }}
              type="text"
              class="form-control form-control-lg"
              placeholder="e.g. Ram Singh and Co."
              id="orgName"
              name="orgName"
              value={formData.orgName}
              onChange={handleChange}
              disabled={isDisabled}
              required
            />
          </div>
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
            placeholder="e.g. Ram Singh, Noida"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* <!-- Legal Membership no --> */}
      <div class="form-group   align-items-center row px-0  mb-2">
        <div class="col-md-5">
          <label for="Legal Membership no">
            Bar Membership No: <span style={{ color: "red" }}>*</span>
          </label>
        </div>
        <div class="col-md-7">
          <input
            type="textarea"
            id="landmark"
            name="landmark"
            class="form-control form-control-lg h-15"
            placeholder="e.g. 9XXXXXXXXXX"
            value={formData.landmark}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      {/* Referralcode */}
      <div class="form-group  d-none align-items-center row px-0  mb-2 ">
        <div class="col-md-5">
          <label for="Legal Membership no">Referral Code:</label>
        </div>
        <div class="col-md-7">
          <input
            type="text"
            id="refcode"
            name="refcode"
            class="form-control form-control-lg h-15"
            placeholder=""
            onChange={handleChange}
            value={formData.refcode}
          />
        </div>
      </div>

      {/* <!-- Terms & Conditions --> */}
      {/* <div class="form-check mb-2 ps-3">
        
        <label class="form-check-label" for="termsConditions">
        <input
          class="form-check-input"
          type="checkbox"
          value=""
          id="termsConditions"

          required onClick={() => setIsOpen(true)}  
        />
          I agree to the &nbsp;
          <span >
            Terms & Conditions
          </span>
        </label>
      </div> */}

      <div className="form-check mb-2 ps-3">
        <input
          className="form-check-input"
          type="checkbox"
          id="termsConditions"
          checked={agree}
          onClick={handleCheckboxClick}
          required
        />
        <label className="form-check-label" htmlFor="termsConditions">
          I agree to the&nbsp;<b>Terms & Conditions</b>
        </label>
      </div>

      {/* <!-- Register Button --> */}
      <button type="submit" class="btn btn-primary  w-100 p-2">
        Register
      </button>

      {/* <!-- Already have an account? --> */}
      <div class="d-flex justify-content-center pt-2">
        <a href="/login" class="text-decoration-none" style={{ color: "#333" }}>
          Already have an account?{" "}
          <span style={{ color: "blue" }}>Sign In</span>
        </a>
      </div>
    </form>
  );
};

const RequiredField = () => {
  return <span style={{ color: "red" }}> *</span>;
};

export default Stage1;
