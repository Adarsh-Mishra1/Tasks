import { useEffect, useState } from "react";

const bills = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  name: `Telephone Number ${i + 1}`,
  number: 9000000000 + i,
}));
// const bills = Array.from({ length: 25 }, (_, i) => ({
//   id: i + 1,
//   name: `${
//     (i + 1) % 2 === 0
//       ? `Telephone Number ${i + 1}`
//       : `Electricity Number ${i + 1}`
//   }`,
//   number: 9000000000 + i,
//   billtype: (i + 1) % 2 === 0 ? "Telephone Bill" : "Electricity Bill",
// }));

function AutoFill({
  // billType,
  type,
  typeSanction,
  handleAddAutoFillData,
  typeMultiple = 0,
  existingBill = null,
}) {
  const [selectedBill, setSelectedBill] = useState();
  const [selectedBills, setSelectedBills] = useState([]);

  // const filetredBills = bills.filter((each) => each.billtype === billType);

  useEffect(
    function () {
      if (existingBill && type === "Single") setSelectedBill(existingBill.id);
      if (existingBill && (type === "Multiple" || type === "sanction")) {
        const filetred = existingBill.slice(0, typeMultiple);
        setSelectedBills(filetred);
        // setSelectedBills(existingBill)
      }

      // if (existingBill && type === "Multiple") {
      //   existingBill.sort((a, b) => a.index - b.index);
      //   const filetred = existingBill.slice(0, typeMultiple);
      //   setSelectedBills(filetred);
      // }
    },
    [existingBill, type]
    // [existingBill, type, typeMultiple]
  );

  const handleRadioChange = (e) => {
    setSelectedBill(Number(e.target.value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (type === "Single") {
      const userSelectedBill = bills.find((each) => each.id === selectedBill);
      handleAddAutoFillData(type, userSelectedBill);
    }

    if ((type === "Multiple" || type === "sanction") && typeMultiple > 0) {
      handleAddAutoFillData(type, selectedBills);
    }
  };

  const handleCheckboxChange = (e) => {
    if (e.target.checked) {
      if (selectedBills.length < typeMultiple) {
        setSelectedBills((prev) => [
          ...prev,
          {
            index: prev.length + 1,
            value: Number(e.target.value),
            details: bills.find((each) => each.id === Number(e.target.value)),
          },
        ]);
      } else {
        alert("To add more bills, please increase the Number of Bills.");
      }
    } else {
      setSelectedBills((prev) =>
        prev
          .filter((each) => each.value !== Number(e.target.value))
          .map((item, newIndex) => ({ ...item, index: newIndex + 1 }))
      );
    }
  };

  return (
    <div style={{ overflow: "auto", maxHeight: "400px" }}>
      {type === "Single" && (
        <div>
          <div
            style={{
              textAlign: "center",
              padding: "20px",
              border: "1px solid #ccc",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              maxWidth: "400px",
              margin: "0 auto",
              backgroundColor: "#f9f9f9",
            }}
          >
            <h3 style={{ marginBottom: "20px", color: "#333" }}>
              Select Details
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "10px",
                marginBottom: "20px",
              }}
            >
              {bills.map((each) => (
                <label
                  key={each.number}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    name="user"
                    checked={selectedBill && Number(selectedBill) === each.id}
                    value={each.id}
                    onChange={handleRadioChange}
                  />
                  {each.name}
                </label>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              style={{
                position: "absolute",
                bottom: "10px",
                right: "10px",
                padding: "10px 20px",
                backgroundColor: "blue",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Submit
            </button>
          </div>
        </div>
      )}
      {(type === "Multiple" || type === "sanction") && (
        <div>
          <div
            style={{
              textAlign: "center",
              padding: "20px",
              border: "1px solid #ccc",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              maxWidth: "400px",
              margin: "0 auto",
              backgroundColor: "#f9f9f9",
            }}
          >
            <h3 style={{ marginBottom: "20px", color: "#333" }}>
              Select Details
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column", // Add column for vertical
                alignItems: "flex-start",
                gap: "10px",
                marginBottom: "20px",
              }}
            >
              {bills.map((each) => (
                <label
                  key={each.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    name="user"
                    value={each.id}
                    checked={selectedBills.some(
                      (bill) => bill.value === Number(each.id)
                    )}
                    onChange={handleCheckboxChange}
                  />
                  {each.name}
                </label>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              style={{
                position: "absolute",
                bottom: "10px",
                right: "10px",
                padding: "10px 20px",
                backgroundColor: "blue",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AutoFill;
