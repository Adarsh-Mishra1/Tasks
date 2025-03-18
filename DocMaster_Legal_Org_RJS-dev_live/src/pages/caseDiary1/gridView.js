import AllFeatureDataTable from "../../GuiComponents/AllFeatureDataTable.table";
import moment from "moment";

function GridView({ events }) {
  // const tableData = events.map((each, index) => {
  //   each.sno = index + 1;
  //   each.nextdate = moment(each.nextdate).format("YYYY-MM-DD");
  //   each.date_time =
  //     each.date_time !== "" ? moment(each.date_time).format("YYYY-MM-DD") : "";
  //   return each;
  // });

  const tableData = events.map((each, index) => {
    each.sno = index + 1;

    each.nextdate = each.nextdate
        ? moment(each.nextdate, ["YYYY-MM-DD", "MM-DD-YYYY", "DD-MM-YYYY"]).isValid()
            ? moment(each.nextdate).format("DD-MM-YYYY")
            : "N/A"
        : "N/A";

    each.date_time = each.date_time
        ? moment(each.date_time, ["YYYY-MM-DD", "MM-DD-YYYY", "DD-MM-YYYY"]).isValid()
            ? moment(each.date_time).format("DD-MM-YYYY")
            : "N/A"
        : "N/A";
    return each;
});



  const tableColumns = [
    {
      Header: "S. No",
      accessor: "sno",
    },
    {
      Header: "Case",
      accessor: "case_title",
    },
    {
      Header: "Hearing Date",
      accessor: "date_time",
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
      accessor: "attendee",
    },
    {
      Header: "Next Date of Hearing",
      accessor: "nextdate",
    },
    {
      Header: "Purpose of next Hearing",
      accessor: "particulars",
    },
  ];

  return (
    <div
      style={{
        height: "500px",
        width: "100%",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <strong>Total Records: {events.length}</strong>
      <div className=" " id="printContent">
        <AllFeatureDataTable columns={tableColumns} data={tableData} />
      </div>
    </div>
  );
}

export default GridView;
