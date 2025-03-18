import { useState, useEffect } from "react";
import PropTypes from "prop-types";

function SampleHeading({ formdata }) {
  const [data, setData] = useState(formdata.body);

  // Update `data` when `formdata.body` changes
  useEffect(() => {
    setData(formdata.body);
  }, [formdata.body]);

  return (
    <div
      style={{
        marginLeft: "0px",
        color: "black",
        marginLeft: "2%",
        // color: "#73879c",
        width: "60%",
        fontSize: "14px",
      }}
    >
      Result for
      {data &&
        Object.entries(data).map(([key, value], index) => (
          <span key={index} style={{ marginLeft: "1%" }}>
            {value}
            {index < Object.entries(data).length - 1 && " > "}
          </span>
        ))}
    </div>
  );
}

SampleHeading.propTypes = {
  formdata: PropTypes.shape({
    body: PropTypes.object.isRequired, // Adjust type as needed
  }).isRequired,
};

export default SampleHeading;
