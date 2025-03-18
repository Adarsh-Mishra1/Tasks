import { useDispatch, useSelector } from "react-redux";
import ClientCaseDiary from "../../components/clientCase/CaseDiary";
import { handleCaseDiaryModal } from "../../components/redux/caseDiaryOrg/CaseDiaryOrgSlice";
import { GetUpdateCaseDiaryEventsThunk } from "../../components/redux/caseDiaryOrg/CaseDiaryOrgThunks";
import userStore from "../../zustand/userStore";

function EventView() {
  const { selectedCaseDiary: selectedEvent } = useSelector(
    (state) => state.caseDiaryOrg
  );
  const userData = userStore((state) => state.user);
  const dispatch = useDispatch();
  const caseJSON = {
    id: selectedEvent.case_id,
    title: selectedEvent.case_title,
    isEditable: true,
    caseStatus: 1,
  };

  const handleClose = (e) => {
    e.preventDefault();

    handleCalenderApiCalls();
  };

  const handleCalenderApiCalls = () => {
    dispatch(handleCaseDiaryModal(false));
    dispatch(GetUpdateCaseDiaryEventsThunk(userData.org.id));
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
