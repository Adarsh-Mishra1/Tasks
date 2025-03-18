import MainComponent from "../../components/newFlow/mainComponent";

function SlotView({ slot, setSelectedSlot, handleApiCalls }) {
  const handleCloseModal = (e) => {
    e.preventDefault();
    setSelectedSlot(null);
    handleApiCalls();
  };

  return (
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
          style={{ maxWidth: "1300px" }}
        >
          <div
            className="modal-content"
            style={{ maxHeight: "650px", padding: "15px", overflowY: "auto" }}
          >
            <div className="modal-header">
              <h6 className="modal-title" id="exampleModalLabel">
                Create Case Diary
              </h6>
              <button
                type="button"
                className="btn-close"
                onClick={handleCloseModal}
                aria-label="Close"
              ></button>
            </div>
            <div
              style={{
                overflow: "auto",
                // maxWidth: "900px",
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: "10px",
                height: "100vh",
              }}
            >
              {/* {slot} */}
              <MainComponent type="caseHearing" nextHearing={slot} />
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </div>
  );
}

export default SlotView;
