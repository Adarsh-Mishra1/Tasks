import React from "react";
import MenuIcon from "@mui/icons-material/Menu";

const InputFieldToggle = () => {
  const ToggleInputField = () => {
    // console.log("abcd");
    // document.querySelector("#docFormPreview").classList.add("hideDocFormPreview");
    document
      .getElementById("docFormPreview")
      .classList.toggle("hideDocFormPreview");
    document
      .getElementById("docFormInputFields")
      .classList.toggle("expandFormField");
  };

  return (
    <>
      <div
        id="TemplateToggle"
        className="Templatetoggler"
        style={{ textAlign: "right" }}
      >
        {/* <i id="InputFieldCollapse" className="fa fa-arrow-left" aria-hidden="true" onClick={ToggleInputField}></i> */}
        <MenuIcon
          style={{
            color: "#0065ff",
            //   border: "1px solid #0065ff",
            //   borderRadius: "7px",
            cursor: "pointer",
            height: "25px",
            width: "25px",

            //   position:"absolute",
            //   right:"0px",
            //   top:"-40px",

            //   position:"absolute",
            //   left:"100vw"
          }}
          id="InputFieldCollapse"
          onClick={ToggleInputField}
        />
        {/* <p>Expand</p> */}
      </div>
    </>
  );
};

export default InputFieldToggle;
