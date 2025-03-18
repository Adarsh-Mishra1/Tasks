import { Suspense, useEffect, useState } from "react";

import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import CalendarView from "./calendarView";
import {
  MasterOrg,
  GetOrgCaseDiary,
  GetOrgCases,
  SchedulerTask,
  scheduleReport,
  WsGetOrgClients,
  WsGetOrgClientsNew,
  WSGetOrgUsers,
} from "../../configs/WebService";
import userStore from "../../zustand/userStore";
import { toast } from "react-toastify";
import { apiKeyHeader } from "../../configs/ApiKeys";
import FilterComponent from "./filterComponent";
import Footer from "../../components/Footer";
import SchedulePopup from "./schedulePopup";

import GridView from "./gridView";
import Popup from "./Popup";
import ScheduleAlert from "./scheduleAlert";
import moment from "moment";
import MasterScheduler from "./taskOrganiser/masterScheduler";
import ScheduleTask from "./taskOrganiser/scheduleTask";
import { convertToEventsMonth, handleScheduledTasks } from "./utils";
import { Views } from "react-big-calendar";
import { useLocation, useNavigate } from "react-router-dom";
import DocumentSelector from "./documentSelector";
import EditScheduleTask from "./editSchduleTask";

function CaseDiaryCalendar() {
  const userData = userStore((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  const [initialEvents, setInitialsEvents] = useState([]);
  const [view, setView] = useState("calendar");
  const [viewC, setViewC] = useState(Views.DAY);
  const [events, setEvents] = useState([]);
  const [orgCases, setOrgCases] = useState([]);
  const [orgClients, setOrgClients] = useState([]);
  const [orgAdvocates, setOrgAdvocates] = useState([]);
  const [masterOrg, setMasterOrg] = useState([]);
  const [scheduledTasks, setScheduledTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showMasterOrg, setShowMasterOrg] = useState(false);
  const [showScheduleTask, setShowScheduleTask] = useState(false);
  const [scheduleTaskData, setScheduleTaskData] = useState({});
  const [schedules, setSchedules] = useState([]);
  const [orgDiary, setOrgDiary] = useState([]);
  const [documentsData, setDocumentsData] = useState(null);
  const [slotData, setSlotData] = useState(null);

  useEffect(() => {
    handleApiCalls();
  }, []);

  useEffect(
    function () {
      if (!showScheduleTask) setScheduleTaskData(null);
    },
    [showScheduleTask]
  );

  async function handleApiCalls() {
    const loader = toast.success("Loading...", { autoClose: false });

    try {
      const [
        caseDiary,
        orgCases,
        orgClients,
        orgAdvocates,
        userSchedules,
        masterOrg,
        scheduledTasks,
      ] = await Promise.all([
        getOrgCaseDiary(),
        getOrgCases(),
        getOrgClients(),
        getOrgAdvocates(),
        getSchedules(),
        getMasterOrg(),
        getScheduleTasks(),
      ]);

      processCaseDiary(
        caseDiary,
        masterOrg,
        scheduledTasks,
        moment().format("YYYY-MM")
      );
      setOrgDiary(caseDiary);
      setOrgCases(orgCases);
      setOrgClients(orgClients);
      setOrgAdvocates(orgAdvocates);
      setSchedules(userSchedules);
      setMasterOrg(masterOrg);
      setScheduledTasks(scheduledTasks);

      await toast.dismiss(loader);
    } catch (err) {
      console.error("Error: ", err.message || err);
      await toast.dismiss(loader);
      toast.error(`Error fetching data: ${err.message || "Unknown error"}`, {
        autoClose: 3000,
      });
    }
  }

  async function getSchedules() {
    try {
      const response = await fetch(`${scheduleReport}?userId=${userData.id}`);
      if (!response.ok)
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      return await response.json();
    } catch (err) {
      throw new Error(`Failed to fetch Org Case Diary: ${err.message}`);
    }
  }

  async function getOrgCaseDiary() {
    try {
      const response = await fetch(
        `${GetOrgCaseDiary}?orgId=${userData.org.id}`
      );
      if (!response.ok)
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      return await response.json();
    } catch (err) {
      throw new Error(`Failed to fetch Org Case Diary: ${err.message}`);
    }
  }

  async function getOrgCases() {
    try {
      const response = await fetch(`${GetOrgCases}?orgId=${userData.org.id}`);
      if (!response.ok)
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      return await response.json();
    } catch (err) {
      throw new Error(`Failed to fetch Org Cases: ${err.message}`);
    }
  }

  async function getMasterOrg() {
    try {
      const response = await fetch(`${MasterOrg}/${userData.id}`, {
        method: "GET",
        headers: apiKeyHeader(),
      });
      if (!response.ok)
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      const data = await response.json();
      return await data;
    } catch (err) {
      throw new Error(`Failed to fetch Org Cases: ${err.message}`);
    }
  }

  async function getScheduleTasks() {
    try {
      const response = await fetch(`${SchedulerTask}/${userData.id}`, {
        method: "GET",
        headers: apiKeyHeader(),
      });
      if (!response.ok)
        throw new Error(`Error: ${response.status} ${response.statusText}`);

      const data = await response.json();
      return await data;
    } catch (err) {
      throw new Error(`Failed to fetch Org Cases: ${err.message}`);
    }
  }

  async function getOrgClients() {
    try {
      const response = await fetch(
        `${WsGetOrgClientsNew}/${userData.org.id}/${userData.id}`,
        // `${WsGetOrgClients}/${userData.org.id}/${userData.id}`,
        {
          headers: apiKeyHeader(),
        }
      );
      if (!response.ok)
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      const data = await response.json();
      if (data.resultCode == 1) {
        data.resultMessage?.map((each) => (each.user.id = each.id));
      } else {
        alert(`Clients: ${data.resultMessage}`);
      }
      return data.resultMessage;
    } catch (err) {
      throw new Error(`Failed to fetch Org Clients: ${err.message}`);
    }
  }

  async function getOrgAdvocates() {
    try {
      const response = await fetch(
        `${WSGetOrgUsers}/${userData.id}/${userData.org.id}`,
        {
          headers: apiKeyHeader(),
        }
      );
      if (!response.ok)
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      const data = await response.json();
      return data.resultMessage;
    } catch (err) {
      throw new Error(`Failed to fetch Org Advocates: ${err.message}`);
    }
  }

  function processCaseDiary(data, masterOrg, scheduledTasks, month) {
    const updatedEvents = data?.map((each) => {
      const nextDateStr = each.nextdate;
      const startDate = moment(nextDateStr).startOf("day").toDate();
      const endDate = moment(nextDateStr).startOf("day").toDate();
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      return {
        id: each.id,
        heading: each.heading,
        start: startDate,
        end: endDate,
        case_id: each.case_id,
        client_id: each.client_id,
        created_by: each.created_by,
        case_title: each.case_title,
        particulars: each.particulars,
        date_time: each.date_time,
        interim_order: each.interim_order,
        attendee: each.Attendee,
        nextdate: each.nextdate,
        legalDeadlineDate: each.legal_deadline_date,
        remarks: each.remarks,
        type: "caseDiary",
      };
    });
    const legalDeadLineEvents = data
      .map((each) => {
        if (!each.legal_deadline_date) return null;

        const legalDeadlineStr = moment(
          each.legal_deadline_date,
          "DD-MM-YYYY",
          true
        );

        if (!legalDeadlineStr.isValid()) {
          console.error("Invalid date format:", each.legal_deadline_date);
          return null;
        }

        const formattedDate = legalDeadlineStr.startOf("day").toDate();
        formattedDate.setHours(0, 0, 0, 0);

        return {
          id: `${each.id}-deadline`,
          start: formattedDate,
          end: formattedDate,
          case_id: each.case_id,
          case_title: each.case_title,
          legalDeadlineDate: each.legal_deadline_date,
          remarks: each.remarks,
          type: "legalDeadLine",
        };
      })
      .filter(Boolean);

    // const masterOrgEvents = convertToEvents(masterOrg.data, moment());
    const {
      newEvents: scheduledTasksEvents,
      updatedMasterOrgEvents: masterOrgEvents,
    } = handleScheduledTasks(
      scheduledTasks,
      convertToEventsMonth(masterOrg.data, month)
    );
    // const masterOrgEvents = convertToEventsMonth(masterOrg.data, month);
    // const scheduledTasksEvents = handleScheduledTasks(scheduledTasks, masterOrgEvents);

    const allEvents = [
      ...updatedEvents,
      ...legalDeadLineEvents,
      ...masterOrgEvents,
      ...scheduledTasksEvents,
    ];

    setInitialsEvents(allEvents);
    setEvents(allEvents);
  }

  function handleChildFiltering({ id, type }) {
    if (type === "client") {
      const filteredEvents = initialEvents.filter(
        (each) => each.client_id === id
      );
      setEvents(filteredEvents);
    }
    if (type === "case") {
      const filteredEvents = initialEvents.filter(
        (each) => each.case_id === id
      );
      setEvents(filteredEvents);
    }
    if (type === "advocate") {
      const filteredEvents = initialEvents.filter(
        (each) => each.created_by === id
      );
      setEvents(filteredEvents);
    }
  }

  function handleFiltering() {
    setEvents(initialEvents);
  }

  async function resetSchedules() {
    const loader = toast.success("Loading...", { autoClose: false });
    const userSchedules = await getSchedules();
    setSchedules(userSchedules);
    await toast.dismiss(loader);
  }

  function handlePrint() {
    const printContent = document.getElementById("printContent").innerHTML;
    const printWindow = window.open("");
    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Print</title>
        </head>
        <body onload="window.print()">
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
  }

  const handleScheduleEventClick = (event) => {
    const eventDate = moment(event.start).format("YYYY-MM-DD");
    const startTime = moment(event.start).format("HH:mm");
    const endTime = moment(event.end).format("HH:mm");
    const dropdownValues = event.dropdownValues;
    const isScheduled = event.isScheduled || false;
    const description = event.isScheduled ? event.title : null;
    const schduledEventType = event.isScheduled
      ? event.schduledEventType
      : null;

    const data = {
      id: event.id,
      eventDate,
      startTime,
      endTime,
      dropdownValues,
      type: event.type,
      isScheduled,
      description,
      schduledEventType,
    };
    setScheduleTaskData(data);
    setShowScheduleTask(true);
  };

  const handleSubmitScheduleEvent = () => {
    setShowScheduleTask(false);
    setViewC(Views.WEEK);
    handleApiCalls();
  };

  const handleSubmitCaseDiaryDocEvent = () => {
    setDocumentsData(null);
    navigate(location.pathname, { replace: true, state: null });
    handleApiCalls();
  };

  const GetDocumentsData = (data) => {
    setDocumentsData(data);
  };

  const GetSlotdata = (data) => {
    setSlotData(data);
  };

  return (
    <Suspense fallback={<>Loading...</>}>
      <div className="main_container">
        <Sidebar />
        <Navbar />

        <div className="right_col " role="main" style={{ overflow: "auto" }}>
          {/* <div className="page-title">
            <div className="title_left">
              <div className="content-align-start">Organization Case Diary</div>
            </div>
          </div> */}
          <div className="col-md-12 pt-5 col-sm-12  col-12">
            <div
              className="  rounded  "
              style={{ minHeight: "750px", overflow: "auto" }}
            >
              {/* <div className="mb-2 d-flex gap-2">
                <button
                  type="button"
                  class="btn btn-primary"
                  style={{ height: "28px", fontSize: "12px" }}
                  onClick={() => setShowModal(true)}
                >
                  Schedule Report
                </button>
              </div> */}
              <div className="d-flex gap-2 mb-2 calendar-btns">
                <button
                  type="button"
                  class="btn btn-primary"
                  style={{ height: "28px", fontSize: "12px" }}
                  onClick={() => setView("calendar")}
                >
                  Calendar view
                </button>
                <button
                  type="button"
                  class="btn btn-primary"
                  style={{ height: "28px", fontSize: "12px" }}
                  onClick={() => setView("grid")}
                >
                  Grid view
                </button>
                <button
                  type="button"
                  class="btn btn-primary"
                  style={{ height: "28px", fontSize: "12px" }}
                  onClick={() => setShowModal(true)}
                >
                  Schedule Report
                </button>
                <button
                  type="button"
                  class="btn btn-primary"
                  style={{ height: "28px", fontSize: "12px" }}
                  onClick={() => setShowAlertModal(true)}
                >
                  Schedule Alert
                </button>
                <button
                  type="button"
                  class="btn btn-primary"
                  style={{ height: "28px", fontSize: "12px" }}
                  onClick={() => setShowMasterOrg(true)}
                >
                  Master Organiser
                </button>
                <button
                  type="button"
                  class="btn btn-primary"
                  style={{ height: "28px", fontSize: "12px" }}
                  onClick={(e) => {
                    e.preventDefault();
                    setViewC(Views.WEEK);
                  }}
                  // onClick={() => setShowScheduleTask(true)}
                >
                  Schedule Task
                </button>
                {/* {view === "grid" && (
                  <button
                    type="button"
                    class="btn btn-primary"
                    style={{ height: "28px", fontSize: "12px" }}
                    onClick={handlePrint}
                  >
                    Print
                  </button>
                )} */}
              </div>

              <FilterComponent
                orgName={userData.org.name}
                orgCases={orgCases}
                orgClients={orgClients}
                orgAdvocates={orgAdvocates}
                handleChildFiltering={handleChildFiltering}
                handleFiltering={handleFiltering}
              />
              {/* <CalendarView events={eventsData} /> */}
              {/* <CalendarView events={events} orgDiary={orgDiary} /> */}
              {view === "calendar" && (
                <CalendarView
                  events={events}
                  orgDiary={orgDiary}
                  handleApiCalls={handleApiCalls}
                  processCaseDiary={processCaseDiary}
                  initialEvents={initialEvents}
                  masterOrg={masterOrg}
                  scheduledTasks={scheduledTasks}
                  handleScheduleEventClick={handleScheduleEventClick}
                  view={viewC}
                  setView={setViewC}
                  location={location}
                  GetDocumentsData={GetDocumentsData}
                  GetSlotdata={GetSlotdata}
                />
              )}
              {view === "grid" && <GridView events={events} />}
              {/* {view === "masterOrg" && <MasterScheduler />} */}
              {/* {view === "scheduleTask" && <ScheduleTask />} */}

              {showModal && (
                <SchedulePopup
                  onClose={setShowModal}
                  schedules={schedules}
                  resetSchedules={resetSchedules}
                />
              )}
              {showAlertModal && (
                <Popup
                  title={"Schedule Alert"}
                  height="740px"
                  maxWidth="800px"
                  onClose={setShowAlertModal}
                >
                  <ScheduleAlert
                    onClose={setShowAlertModal}
                    schedules={schedules}
                    resetSchedules={resetSchedules}
                  />
                </Popup>
              )}
              {showMasterOrg && (
                <Popup
                  title={"Master Orgnization"}
                  height="740px"
                  maxWidth="800px"
                  onClose={setShowMasterOrg}
                >
                  <MasterScheduler
                    setShowMasterOrg={setShowMasterOrg}
                    handleApiCalls={handleApiCalls}
                  />
                </Popup>
              )}
              {showScheduleTask && (
                <Popup
                  title={"Schedule Task"}
                  minHeight="400px"
                  maxWidth="800px"
                  onClose={setShowScheduleTask}
                >
                  {/* <ScheduleTask
                    scheduleTaskData={scheduleTaskData}
                    handleSubmitScheduleEvent={handleSubmitScheduleEvent}
                    masterOrg={masterOrg}
                  /> */}

                  {scheduleTaskData.isScheduled ? (
                    <EditScheduleTask
                      scheduleTaskData={scheduleTaskData}
                      handleSubmitScheduleEvent={handleSubmitScheduleEvent}
                      masterOrg={masterOrg}
                      OrganiserData={slotData.OrganiserData}
                      colors={slotData.colors}
                    />
                  ) : (
                    <ScheduleTask
                      scheduleTaskData={scheduleTaskData}
                      handleSubmitScheduleEvent={handleSubmitScheduleEvent}
                      masterOrg={masterOrg}
                    />
                  )}
                </Popup>
              )}
              {documentsData && documentsData !== null && (
                <Popup
                  title="Available Slots"
                  height="200px"
                  maxWidth="850px"
                  displayClose={false}
                >
                  <DocumentSelector
                    OrganiserData={documentsData.OrganiserData}
                    colors={documentsData.colors}
                    caseDiaryId={location.state.caseDiaryId}
                    nextHearingDate={location.state.nextHearingDate}
                    handleSubmitCaseDiaryDocEvent={
                      handleSubmitCaseDiaryDocEvent
                    }
                  />
                </Popup>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
      {/* </div> */}
    </Suspense>
  );
}

export default CaseDiaryCalendar;
