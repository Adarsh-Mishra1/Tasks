// import { useState } from "react";
// import PropTypes from "prop-types";

// export const ContentDisplay = ({ textContent }) => {
//   const initialWordCount = 10;
//   function formatAiResponse(response) {
//     return response
//       .replace(/\*\*(.*?)\*\*:/g, "**$1:**") // Bold headings without extra stars
//       .replace(/\*\*\s/g, " ") // Add newlines before sections
//       .replace(/\*\s/g, "\n* ") // Add newlines for list items
//       .replace(/\*\*/g, "") // Remove remaining stars
//       .trim();
//   }
//   console.log("formatted textContent ", formatAiResponse(textContent));

//   // const str='''
//   const safeTextContent =
//     typeof textContent === "string" ? formatAiResponse(textContent) : "";
//   const words = safeTextContent.split(/\s+/).filter((word) => word.length > 0);
//   const [isExpanded, setIsExpanded] = useState(false);

//   const handleViewMore = () => {
//     setIsExpanded(true);
//   };

//   const handleViewLess = () => {
//     setIsExpanded(false);
//   };

//   const displayedWords = isExpanded ? words : words.slice(0, initialWordCount);
//   const buttonText = isExpanded ? "View Less" : "View More ";

//   return (
//     <div style={{ fontSize: "14px" }}>
//       {words.length === 0 ? (
//         <p></p>
//       ) : (
//         <p>
//           <span>{displayedWords.join(" ")}</span>
//           <button
//             className="view-btn"
//             style={{
//               marginLeft: "2%",
//               backgroundColor: "white",
//               border: "none",
//             }}
//             onClick={isExpanded ? handleViewLess : handleViewMore}
//           >
//             <strong>{buttonText}</strong>
//           </button>
//         </p>
//       )}
//     </div>
//   );
// };

// ContentDisplay.defaultProps = {
//   textContent: "",
// };

// ContentDisplay.propTypes = {
//   textContent: PropTypes.string,
// };

import { useState } from "react";
import PropTypes from "prop-types";
import { formatAiResponse2 } from "../OtherFunctions/OtherFunctions";

export const ContentDisplay = ({ textContent }) => {
  const initialWordCount = 10;

  // Function to format AI response
  // function formatAiResponse(response) {
  //   return (
  //     response
  //       .replace(/\*\*(.*?)\*\*:/g, "<strong>$1: </strong>") // Bold headings
  //       .replace(/\*\*\s/g, " ") // Remove extra stars
  //       // .replace(/\*\s/g, "<br />&nbsp• ") // Add line breaks for list items
  //       .replace(/\*\s/g, "&nbsp• ") // Add line breaks for list items
  //       .replace(/\*\*/g, "") // Remove remaining stars
  //       .replace(/\n/g, "<br />") // Convert newlines to <br>
  //       .trim()
  //   );
  // }
  function formatResponse(response) {
    return (
      response
        .replace(/\*\*(.*?)\*\*:/g, "<strong>$1: </strong>") // Bold headings
        .replace(/\*\*\s/g, " ") // Remove extra stars
        .replace(/\*\s/g, "&nbsp• ") // Add bullet points
        .replace(/\*\*/g, "") // Remove remaining stars
        .replace(/\n/g, '<span style="display: block; margin-bottom: 1px;"></span>') // Replace newlines with block spans
        .trim()
    );
  }
  

  // Safely format the textContent
  const safeTextContent =
    typeof textContent === "string" ? formatResponse(textContent) : "";
  const words = safeTextContent.split(/\s+/).filter((word) => word.length > 0);

  const [isExpanded, setIsExpanded] = useState(false);

  const handleViewMore = () => {
    setIsExpanded(true);
  };

  const handleViewLess = () => {
    setIsExpanded(false);
  };

  const displayedWords = isExpanded ? words : words.slice(0, initialWordCount);
  const buttonText = isExpanded ? "View Less" : "View More";

  return (
    <div style={{ fontSize: "14px", marginLeft: "2%" }}>
      {words.length === 0 ? (
        <p>-</p>
      ) : (
        <div>
          <span
            dangerouslySetInnerHTML={{
              __html: displayedWords.join(" "),
            }}
          />
          {words.length > initialWordCount && (
            <button
              className="view-btn"
              style={{
                marginLeft: "2%",
                backgroundColor: "white",
                border: "none",

                color: "#73879c",
              }}
              onClick={isExpanded ? handleViewLess : handleViewMore}
            >
              <strong>{buttonText}</strong>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

ContentDisplay.defaultProps = {
  textContent: "",
};

ContentDisplay.propTypes = {
  textContent: PropTypes.string,
};
