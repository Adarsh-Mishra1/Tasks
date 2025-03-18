import PropTypes from "prop-types"; // Import PropTypes
import { useState, useEffect } from "react"; // Import useState
import { ContentDisplay } from "./View-more-content";
import Popup from "../pages/caseDiary/Popup";
import MainComponent from "./newFlow/mainComponent";

export default function Table({ response, fields }) {
  const [openPopup, isOpenPopup] = useState(false);
  const [selectdBill, setSelectedBill] = useState();
  const [lang, setLang] = useState("");
  const [updatedResponse, setUpdatedResponse] = useState(response);
  const [remainingKeys, setRemainingKeys] = useState([]);

  const [translatedHeading, setTranslatedHeading] = useState(
    fields.find((e) => e.field_id === 61)?.display_field_name
  );
  const heading = fields.find(
    (e) => e.field_name === "MF_case_name"
  )?.display_field_name;
  useEffect(() => {
    setUpdatedResponse(
      response.map((item) => ({
        ...item,
        "Case Name and Gist": (
          <div style={{ width: "100%" }}>
            <p>
              {" "}
              <strong style={{ marginLeft: "2%" }}>
                {item.MF_case_name || ""}
              </strong>{" "}
              <input
                style={{ marginLeft: "2%", marginTop: "1%" }}
                type="checkbox"
                title="Link this judgement with your related case"
                onClick={() => handleCheckboxClick(item)}
              />
            </p>
            {/* <br /> */}
            {item.Case_Gist && (
              <ContentDisplay
                textContent={
                  item.Case_Gist.slice(0, 19) === "**Final Decision:**"
                    ? item.Case_Gist.slice(17)
                    : item.Case_Gist
                }
              />
            )}
          </div>
        ),
      }))
    );
  }, [response]);

  useEffect(() => {
    if (updatedResponse.length > 0 && !lang) {
      setLang("hi"); // Set default language to Hindi if there's data
    }
  }, [updatedResponse]);
  useEffect(() => {
    if (fields.length > 0) {
      const totalKeys =
        updatedResponse.length > 0 ? Object.keys(updatedResponse[0]) : [];
      const mandatoryFields = ["filePath", "MF_case_name", "Case_Gist"];

      // Filter out mandatory fields
      let newRemainingKeys = totalKeys.filter(
        (key) => !mandatoryFields.includes(key)
      );
      newRemainingKeys.sort((a, b) => a.localeCompare(b));

      setRemainingKeys(newRemainingKeys);
    }
  }, [fields, updatedResponse]);

  const closePopup = () => {
    isOpenPopup(false);
  };

  // const totalKeys =
  //   updatedResponse.length > 0 ? Object.keys(updatedResponse[0]) : [];
  // const mandatoryFields = ["filePath", "MF_case_name", "Case_Gist"];
  // let remainingKeys = totalKeys.filter((key) => !mandatoryFields.includes(key));

  // remainingKeys.sort((a, b) => a.localeCompare(b));

  const remainingKey = fields.filter(
    (each) =>
      each.display_status_in_legal === 1 && each.auto_select_status === 1
  );
  const remainingKeys_2 = remainingKey.map((each) => each.field_name);

  const [selectedColumns, setSelectedColumns] = useState([
    "Case Name and Gist",
    ...remainingKeys_2,
  ]);
  useEffect(() => {
    if (lang) {
      googleTranslate(lang);
    } else {
      return;
    }
  }, [lang]);

  function displayFieldName(fieldName) {
    const field = fields.find((each) => each.field_name === fieldName);
    return field ? field.display_field_name : fieldName; // Default to fieldName if no match
  }

  const handleCheckboxChange = (key) => {
    // alert(key);
    if (key === "Final_Decision") {
      setLang("");
    }
    setSelectedColumns((prevSelectedColumns) => {
      if (prevSelectedColumns.includes(key)) {
        // If the key is already selected, deselect it
        return prevSelectedColumns.filter((column) => column !== key);
      } else if (prevSelectedColumns.length < 7) {
        // If less than 7 columns are selected, add the new column
        return [...prevSelectedColumns, key];
      } else {
        alert("You can select up to 7 additional columns only.");
        return prevSelectedColumns; // Don't change anything if the limit is reached
      }
    });
  };

  const handleCheckboxClick = (data) => {
    setSelectedBill(data);
    isOpenPopup(true);
  };

  function hasSpecialCharacters(str) {
    const regex = /[!@#$%^&*()_+=[\]{};':"\\|,.<>?/~`-]/;
    if (str) {
      if (regex.test(str)) {
        return (
          <span style={{ paddingTop: "0px" }}>
            <ContentDisplay textContent={str} />
          </span>
        );
      } else {
        return str;
      }
    } else {
      return "-";
    }
  }
  const final_decision_status = fields.find(
    (fld) => fld.field_id === 61
  )?.display_status_in_legal;

  const languageMap = {
    hi: "Hindi",
    bn: "Bengali",
    te: "Telugu",
    kn: "Kannada",
    mr: "Marathi",
    ta: "Tamil",
    ur: "Urdu",
    // gu: "Gujarati",
    // ml: "Malayalam",
    pa: "Punjabi",
  };

  const fetchTranslation = async (text, targetLang) => {
    try {
      const response = await fetch(
        "https://web1024.ipguide.net:4000/api/user/translate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, targetLang }),
        }
      );

      const data = await response.json();
      return data.translatedText;
    } catch (error) {
      console.error("Translation Error:", error);
      return text; // Fallback to original text in case of error
    }
  };

  const googleTranslate = async (value) => {
    if (!value) return; // Prevent API calls if no language is selected

    const translatedKey = `${
      languageMap[value] || ""
    } Translated Data of Final Decision`;

    try {
      // Translate Final_Decision field for each row
      const translatedData = await Promise.all(
        updatedResponse.map(async (item) => ({
          ...item,
          [translatedKey]: await fetchTranslation(item.Final_Decision, value),
        }))
      );

      setUpdatedResponse(translatedData);

      // Translate the heading separately
      setTranslatedHeading(await fetchTranslation(translatedHeading, value));
    } catch (error) {
      console.error("Translation process failed:", error);
    }
  };
  // useEffect(() => {
  //   if (response?.length > 0) {
  //     alert(response?.length);
  //   }
  // }, [response]);
  return (
    <div style={{ color: "black" }}>
      <div>
        {updatedResponse.length > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginLeft: "2%",
              marginTop: "0.5%",
              gap: "10px",
            }}
          >
            <p style={{ margin: 0 }}>
              <strong>Select fields to manage / change display</strong>
            </p>
            <div
              style={{
                display: "flex",
                gap: "10px",
              }}
            >
              {remainingKeys
                .filter(
                  (each) => !each.includes("Translated Data of Final Decision")
                ) // Exclude translation fields
                .map((each, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                    }}
                  >
                    <label style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="checkbox"
                        checked={selectedColumns.includes(each)}
                        disabled={each === "Case Name and Gist"}
                        onChange={() => handleCheckboxChange(each)}
                        style={{ marginRight: "8px" }}
                      />
                      {each === "Case Name and Gist"
                        ? heading
                        : displayFieldName(each)}
                    </label>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {updatedResponse.length > 0 &&
        final_decision_status === 1 &&
        remainingKeys_2.includes("Final_Decision") &&
        selectedColumns.includes("Final_Decision") && (
          <div
            style={{
              width: "50%",
              // float: "left",
              marginLeft: "70%",
              marginTop: "1%",
              // width: "40%",
              marginBottom: "2%",
              color: "black",
              // border: "1px solid black",
            }}
          >
            <label>Select Translation Language</label>
            <select
              className="form-select"
              style={{ width: "30%" }}
              value={lang}
              onChange={(e) => {
                setLang(e.target.value);
                googleTranslate(e.target.value);
              }}
            >
              <option value="">--Select--</option>
              <option value="hi">Hindi</option>
              <option value="bn">Bengali</option>
              <option value="te">Telugu</option>
              <option value="kn">Kannada</option>
              <option value="mr">Marathi</option>
              <option value="ta">Tamil</option>
              <option value="ur">Urdu</option>
              <option value="gu">Gujarati</option>
              <option value="ml">Malayalam</option>
              <option value="pa">Punjabi</option>
            </select>
          </div>
        )}

      {updatedResponse.length > 0 && (
        <table
          style={{
            border: "1px solid black",
            marginLeft: "2%",
            color: "black",
            width: "90%",
          }}
        >
          <thead>
            <tr style={{ border: "1px solid #73879c" }}>
              <th
                style={{
                  border: "1px solid #73879c",
                  width: "5%",
                  textAlign: "center",
                }}
              >
                S.No
              </th>
              {selectedColumns.map((column) => (
                <th
                  style={{
                    border: "1px solid #73879c",
                    // width: column !== "MF_bench_size" ? "30%" : "25%",
                    textAlign: "center",
                  }}
                  key={column}
                >
                  {column === "Case Name and Gist"
                    ? heading
                    : displayFieldName(column)}
                  {/* {displayFieldName(column)} */}
                </th>
              ))}

              {lang && (
                <th
                  style={{
                    border: "1px solid #73879c",
                    textAlign: "center",
                  }}
                >
                  {translatedHeading}
                  {/* {lang === "hi" && "Hindi "}
                  {lang === "te" && "Telugu "}
                  {lang === "ta" && "Tamil "}
                  {lang === "kn" && "Kannada "}
                  Translated Data of Final Decision */}
                </th>
              )}

              <th
                style={{
                  border: "1px solid #73879c",
                  textAlign: "center",
                }}
              >
                PDF
              </th>
              {/* <th
                style={{
                  border: "1px solid #73879c",
                  width: "10%",
                  textAlign: "center",
                }}
              >
                Link this judgement with your related case
              </th> */}
            </tr>
          </thead>
          <tbody>
            {updatedResponse.map((data, index) => (
              <tr style={{ border: "1px solid #73879c" }} key={index}>
                <td
                  style={{
                    border: "1px solid #73879c",
                    // verticalAlign: "top",
                    textAlign: "center",
                    // textAlign: "right",
                    // marginRight: "2%",
                  }}
                >
                  <span style={{ marginLeft: "10px" }}>{index + 1}</span>
                </td>
                {selectedColumns.map((column) => (
                  <td
                    style={{
                      border: "1px solid #73879c",
                      verticalAlign: "top",
                      paddingLeft: "10px",
                      width: column === "Final_Decision" && "25%",
                      // width:column=
                    }}
                    key={column}
                  >
                    <div style={{ paddingTop: "0px" }}>
                      {column !== "Case Name and Gist" &&
                        hasSpecialCharacters(data[column])}

                      {column === "Case Name and Gist" && data[column]}
                    </div>
                  </td>
                ))}

                {lang && (
                  <td
                    style={{
                      border: "1px solid #73879c",
                      paddingLeft: "9px",
                      verticalAlign: "top",
                      width: "25%",
                    }}
                  >
                    {lang &&
                      data[
                        `${
                          lang === "hi"
                            ? "Hindi"
                            : lang === "te"
                            ? "Telugu"
                            : lang === "ta"
                            ? "Tamil"
                            : lang === "kn"
                            ? "Kannada"
                            : lang === "bn"
                            ? "Bengali"
                            : lang === "mr"
                            ? "Marathi"
                            : lang === "ur"
                            ? "Urdu"
                            : lang === "pa"
                            ? "Punjabi"
                            : ""
                        } Translated Data of Final Decision`
                      ] && (
                        <ContentDisplay
                          textContent={
                            data[
                              `${
                                lang === "hi"
                                  ? "Hindi"
                                  : lang === "te"
                                  ? "Telugu"
                                  : lang === "ta"
                                  ? "Tamil"
                                  : lang === "kn"
                                  ? "Kannada"
                                  : lang === "bn"
                                  ? "Bengali"
                                  : lang === "mr"
                                  ? "Marathi"
                                  : lang === "ur"
                                  ? "Urdu"
                                  : lang === "pa"
                                  ? "Punjabi"
                                  : ""
                              } Translated Data of Final Decision`
                            ]
                          }
                        />
                      )}
                  </td>
                )}
                <td
                  style={{
                    border: "1px solid #73879c",
                    paddingLeft: "9px",
                    verticalAlign: "top",
                  }}
                >
                  {data.filePath ? (
                    <img
                      width="24"
                      style={{
                        cursor: "pointer",
                        marginRight: "2%",
                        marginTop: "20%",
                      }}
                      height="24"
                      src="https://img.icons8.com/color/48/pdf.png"
                      alt="pdf"
                      onClick={() => {
                        const url = "https://web1024.ipguide.net:4000/";
                        window.open(`${url}${data.filePath}`);
                      }}
                    />
                  ) : (
                    "-"
                  )}
                </td>
                {/* <td
                  style={{
                    textAlign: "center",
                    verticalAlign: "top",
                    paddingTop: "2%",
                  }}
                >
                  <input
                    type="checkbox"
                    onClick={() => handleCheckboxClick(data)}
                  />
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {openPopup && (
        <div>
          <div
            className="modal fade show"
            style={{
              display: "block",
            }}
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div
              className="modal-dialog modal-dialog-centered"
              style={{ maxWidth: "600px" }}
            >
              <div
                className="modal-content"
                style={{
                  maxHeight: "550px",
                  padding: "15px",
                  overflowY: "auto",
                }}
              >
                <div className="modal-header">
                  <h6 className="modal-title" id="exampleModalLabel">
                    Link With Client & Case
                  </h6>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closePopup}
                    aria-label="Close"
                  ></button>
                </div>
                <div
                  style={{
                    overflow: "auto",
                    marginLeft: "auto",
                    marginRight: "auto",
                    marginTop: "10px",
                    height: "100vh",
                  }}
                >
                  <h4>
                    <b>{selectdBill.MF_case_name}</b>
                  </h4>
                  <MainComponent
                    type="caseJudgements"
                    JudgementData={selectdBill}
                    closePopup={closePopup}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </div>
      )}
    </div>
  );
}

Table.propTypes = {
  response: PropTypes.array.isRequired,
  fields: PropTypes.any,
};
