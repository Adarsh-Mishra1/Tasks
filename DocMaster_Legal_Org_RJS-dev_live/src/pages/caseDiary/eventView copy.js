import { useCallback, useEffect, useState } from "react";
import { useAlertMessages } from "../../customHooks/caseDiaryHook";
import AllFeatureDataTable from "../../GuiComponents/AllFeatureDataTable.table";
import {
  addDaysToDate,
  changeDateFormat,
} from "../../OtherFunctions/OtherFunctions";
import { toast } from "react-toastify";

function EventView({ selectedEvent, onClose, orgDiary }) {
  const { isLoading, alertMessages, error } = useAlertMessages();
  const [caseDiary, setCaseDiary] = useState([]);

  if (error) toast.error("Error getting alert Messages", { autoClose: 3000 });

  const processCaseDiary = useCallback(
    function (simpleDataArray) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const sortedArray = simpleDataArray.sort(
        (a, b) => new Date(b.date_time) - new Date(a.date_time)
      );

      return simpleDataArray.map((simpleData, index) => {
        const nextDate = new Date(simpleData.nextdate);
        const isPastDate = nextDate < today;
        const alertMessage = alertMessages?.find(
          (each) => each.alert_field_value === simpleData.particulars
        );
        const isValidDateTime = (dateTime) => {
          return (
            dateTime &&
            dateTime !== "0000-00-00 00:00:00" &&
            !isNaN(new Date(dateTime).getTime())
          );
        };
        const legalDate = isValidDateTime(simpleData.date_time)
          ? alertMessage?.days
            ? addDaysToDate(
                formatToInputDate(simpleData.date_time),
                alertMessage.days
              )
            : null
          : null;

        return {
          ...simpleData,
          sno: sortedArray.length - index,
          nextdate: changeDateFormat(nextDate),
          dateTimeTxt: simpleData?.date_time
            ? changeHDateFormat(simpleData.date_time)
            : "N/A",
          isPastDate: isPastDate,
          alertMessage: alertMessage
            ? `${legalDate} - ${alertMessage.alert_message}`
            : "N/A",
        };
      });
    },
    [alertMessages]
  );

  useEffect(
    function () {
      const caseDiary = orgDiary.filter(
        (each) => each.case_id === selectedEvent.case_id
      );
      setCaseDiary(processCaseDiary(caseDiary));
    },
    [orgDiary, selectedEvent, processCaseDiary]
  );

  const tableColumns = [
    {
      Header: "S. No",
      accessor: "sno",
    },
    {
      Header: "Hearing Date",
      accessor: "dateTimeTxt",
    },
    {
      Header: "Purpose of Current Hearing",
      accessor: "interim_order",
    },
    {
      Header: "Outcome",
      accessor: "heading",
    },
    {
      Header: "Attendee",
      accessor: "Attendee",
    },
    {
      Header: "Next Date of Hearing",
      accessor: "nextdate",
    },
    {
      Header: "Purpose of next Hearing",
      accessor: "particulars",
    },
    {
      Header: "Remarks",
      accessor: "alertMessage",
    },
  ];

  const formatToInputDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const changeHDateFormat = (dateTime) => {
    const date = new Date(dateTime);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  if (isLoading) return <div>isLoading..</div>;

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
                onClick={() => onClose(null)}
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
               
                <AllFeatureDataTable columns={tableColumns} data={caseDiary} />
               
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </div>
  );
}

export default EventView;
