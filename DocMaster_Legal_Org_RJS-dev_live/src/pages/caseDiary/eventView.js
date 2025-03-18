import ClientCaseDiary from "../../components/clientCase/CaseDiary";

function EventView({ selectedEvent, onClose, handleApiCalls }) {
  const caseJSON = {
    id: selectedEvent.case_id,
    title: selectedEvent.case_title,
    isEditable: true,
    caseStatus: 1,
  };

  const handleClose = (e) => {
    e.preventDefault();

    onClose(null);
    handleApiCalls();
  };

  const handleCalenderApiCalls = () => {
    onClose(null);
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
          style={{ maxWidth: "1200px" }}
        >
          <div
            className="modal-content"
            style={{ maxHeight: "550px", overflowY: "auto" }}
          >
            <div className="modal-header">
              <h6 className="modal-title" id="exampleModalLabel">
                Case Diary for {selectedEvent.case_title}
              </h6>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
                aria-label="Close"
              ></button>
            </div>
            <div
              style={{
                overflow: "auto",
                maxWidth: "1100px",
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: "10px",
                height: "100vh",
              }}
            >
              <ClientCaseDiary
                clientCase={caseJSON}
                getNotes={false}
                fromCalender={true}
                handleCalenderApiCalls={handleCalenderApiCalls}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </div>
  );
}

export default EventView;
