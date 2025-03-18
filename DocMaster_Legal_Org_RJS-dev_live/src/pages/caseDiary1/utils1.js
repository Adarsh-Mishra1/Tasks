import moment from "moment";

const daysNumbers = [0, 1, 2, 3, 4, 5, 6];

export async function CreateCalenderEvents(
  caseDiary,
  masterOrg,
  schduledTasks
) {
  const processedCaseDiary = await CreateCaseDiaryCalenderEvents(caseDiary);
  const processedMasterOrg = convertToEventsMonth(
    masterOrg,
    moment().format("YYYY-MM")
  );
  const filterdTasks = schduledTasks.filter(
    (e) => JSON.parse(e.event_slot).courtDetails === null
  );
  const {
    newEvents: scheduledTasksEvents,
    updatedMasterOrgEvents: masterOrgEvents,
  } = handleScheduledTasks(filterdTasks, processedMasterOrg);

  return [...processedCaseDiary, ...masterOrgEvents, ...scheduledTasksEvents];
}

async function CreateCaseDiaryCalenderEvents(caseDiary) {
  const caseHearings = caseDiary?.map((each) => {
    const nextDateStr = each.nextdate;
    const startDate = moment(nextDateStr).startOf("day").toDate();
    const endDate = moment(nextDateStr).startOf("day").toDate();
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    return {
      id: each.id,
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      case_id: each.case_id,
      client_id: each.client_id,
      nextdate: each.nextdate,
      title: each.particulars,
      type: "caseDiary",
    };
  });

  await Promise.all(caseHearings);

  const groupedEvents = caseHearings.reduce((acc, event) => {
    if (!acc[event.case_id]) {
      acc[event.case_id] = [];
    }
    acc[event.case_id].push(event);
    return acc;
  }, {});
  Object.keys(groupedEvents).forEach((caseId) => {
    groupedEvents[caseId]
      .sort((a, b) => a.id - b.id)
      .forEach((event) => {
        if (event.nextdate) {
          const nextDate = moment(event.nextdate);
          const today = moment();

          if (nextDate.isBefore(today, "day")) {
            if (event.id < groupedEvents[caseId]?.at(-1).id) {
              event.bgColor = "#28a745"; // hearing completed // green
            } else {
              event.bgColor = "#ff4d4d"; // hearing missed // red
            }
          } else {
            event.bgColor = "#9999ff"; // upcoming hearing // blue
          }
        }
      });
  });

  const legalDeadlines = caseDiary
    .map((each) => {
      if (!each.legal_deadline_date) return null;

      const legalDeadlineStr = moment(
        each.legal_deadline_date,
        "DD-MM-YYYY",
        true
      );

      if (!legalDeadlineStr.isValid()) {
        return null;
      }

      const formattedDate = legalDeadlineStr.startOf("day").toDate();
      formattedDate.setHours(0, 0, 0, 0);

      return {
        id: `${each.id}-deadline`,
        start: formattedDate.toISOString(),
        end: formattedDate.toISOString(),
        case_id: each.case_id,
        case_title: each.case_title,
        legalDeadlineDate: each.legal_deadline_date,
        title: each.remarks,
        type: "legalDeadLine",
        bgColor: "orange",
      };
    })
    .filter(Boolean);

  Promise.all(legalDeadlines);

  return [...Object.values(groupedEvents).flat(), ...legalDeadlines];
}

export const handleScheduledTasks = (data, masterOrgEvents) => {
  const newEvents = [];
  const updatedMasterOrgEvents = [...masterOrgEvents];

  data?.forEach((each) => {
    try {
      if (!each.event_slot || each.event_slot === "This slot is empty") return;
      const parsedSlot = JSON.parse(each.event_slot);
      if (!parsedSlot.start || !parsedSlot.end) return;

      const start = new Date(`${each.event_date}T${parsedSlot.start}:00`);
      const end = new Date(`${each.event_date}T${parsedSlot.end}:00`);

      const newEvent = {
        id: each.id,
        title: each.desription || "No Title",
        start: start.toISOString(),
        end: end.toISOString(),
        bgColor: "#90ee90b5",
        // bgColor: "#bfbfbf",
        isScheduled: true,
        schduledEventType: each.event_type,
      };

      const existingIndex = updatedMasterOrgEvents.findIndex(
        (event) =>
          new Date(event.start).getTime() === start.getTime() &&
          new Date(event.end).getTime() === end.getTime() &&
          event.type !== "court"
      );

      if (existingIndex !== -1) {
        updatedMasterOrgEvents[existingIndex] = {
          ...newEvent,
          type: updatedMasterOrgEvents[existingIndex].type,
        };
      } else {
        newEvents.push(newEvent);
      }
    } catch (error) {
      console.error("Invalid event_slot:", each.event_slot, error);
    }
  });

  return { newEvents, updatedMasterOrgEvents };
};

export const convertToEventsMonth = (data, currentMonth) => {
  const events = [];

  const startOfMonth = moment(currentMonth, "YYYY-MM").startOf("month");
  const endOfMonth = moment(currentMonth, "YYYY-MM")
    .add(1, "month")
    .endOf("month");
  let startOfWeek = moment(startOfMonth).startOf("isoWeek");

  const workingDays = JSON.parse(data.workingDays);

  const otherThanWorkingDays = daysNumbers.filter(
    (e) => !workingDays.includes(e)
  );

  const beforeCourt = data.before;
  const afterCourt = data.after;
  const courtDetails = data.court;

  while (startOfWeek.isBefore(endOfMonth)) {
    workingDays.forEach((day) => {
      const dayOffset = day - 1;
      const currentDate = moment(startOfWeek).add(dayOffset, "days");

      if (
        currentDate.isBefore(startOfMonth) ||
        currentDate.isAfter(endOfMonth)
      ) {
        return;
      }

      const addSegmentedEvents = (
        title,
        timing,
        color,
        type,
        dropdownValues,
        mixedSlot
      ) => {
        if (!timing.start || !timing.end) return;

        let start = moment(currentDate).set({
          hour: parseInt(timing.start.split(":")[0]),
          minute: parseInt(timing.start.split(":")[1]),
        });
        let end = moment(currentDate).set({
          hour: parseInt(timing.end.split(":")[0]),
          minute: parseInt(timing.end.split(":")[1]),
        });

        while (start.isBefore(end)) {
          let nextSlot = moment(start).add(30, "minutes");

          events.push({
            title: title,
            start: start.toDate().toISOString(),
            end: nextSlot.toDate().toISOString(),
            bgColor: color,
            type,
            mixedSlot,
            dropdownValues,
          });

          start = nextSlot;
        }
      };

      if (beforeCourt.start && beforeCourt.end) {
        addSegmentedEvents("Before Court", beforeCourt, "#90ee90b5", "before", {
          casepreparation: beforeCourt.casepreparation,
          meeting: beforeCourt.meeting,
        });
      }
      if (afterCourt.start && afterCourt.end) {
        addSegmentedEvents("After Court", afterCourt, "#90ee90b5", "after", {
          casepreparation: afterCourt.casepreparation,
          meeting: afterCourt.meeting,
        });
      }
      if (courtDetails.courtTimings) {
        const isSlotMixed =
          courtDetails.courtTimings.casePreparation ||
          courtDetails.courtTimings.meeting;
        const dropdownValues = {
          casepreparation: courtDetails.courtTimings.casePreparation,
          meeting: courtDetails.courtTimings.meeting,
        };
        let start = moment(currentDate)
          .set({
            hour: courtDetails.courtTimings.start.split(":")[0],
            minute: courtDetails.courtTimings.start.split(":")[1],
          })
          .toISOString();
        let end = moment(currentDate)
          .set({
            hour: courtDetails.courtTimings.end.split(":")[0],
            minute: courtDetails.courtTimings.end.split(":")[1],
          })
          .toISOString();
        events.push({
          title: "Court Session",
          start,
          end,
          bgColor: "#ffb3ff96",
          //   bgColor: "magenta",
          type: "court",
          mixedSlot: isSlotMixed,
          dropdownValues,
        });
      }
    });

    startOfWeek.add(1, "week");
  }

  let currentDay = moment(startOfMonth);
  while (currentDay.isBefore(endOfMonth)) {
    const dayNumber = currentDay.day();

    if (otherThanWorkingDays.includes(dayNumber)) {
      const startTime = moment(currentDay).set({
        hour: beforeCourt.start.split(":")[0],
        minute: beforeCourt.start.split(":")[1],
      });

      const endTime = moment(currentDay).set({
        hour: afterCourt.end.split(":")[0],
        minute: afterCourt.end.split(":")[1],
      });

      const slotDuration = 30;

      while (startTime.isBefore(endTime)) {
        const nextSlot = moment(startTime).add(slotDuration, "minutes");

        if (nextSlot.isAfter(endTime)) break;

        events.push({
          title: "Outside of working Hours",
          start: startTime.toISOString(),
          end: nextSlot.toISOString(),
          bgColor: "lightgray",
          type: "outside",
        });

        startTime.add(slotDuration, "minutes");
      }
    }

    currentDay.add(1, "day");
  }

  return events;
};

// export const convertToEventsMonth = (data, currentMonth) => {
//   const events = [];

//   const startOfMonth = moment(currentMonth, "YYYY-MM").startOf("month");
//   const endOfMonth = moment(currentMonth, "YYYY-MM")
//     .add(1, "month")
//     .endOf("month");
//   let startOfWeek = moment(startOfMonth).startOf("isoWeek");

//   const workingDays = JSON.parse(data.workingDays);
//   const beforeCourt = data.before;
//   const afterCourt = data.after;
//   const courtDetails = data.court;

//   while (startOfWeek.isBefore(endOfMonth)) {
//     workingDays.forEach((day) => {
//       const dayOffset = day - 1;
//       const currentDate = moment(startOfWeek).add(dayOffset, "days");

//       if (
//         currentDate.isBefore(startOfMonth) ||
//         currentDate.isAfter(endOfMonth)
//       ) {
//         return;
//       }

//       const addSegmentedEvents = (
//         title,
//         timing,
//         color,
//         type,
//         dropdownValues,
//         mixedSlot
//       ) => {
//         if (!timing.start || !timing.end) return;

//         let start = moment(currentDate).set({
//           hour: parseInt(timing.start.split(":")[0]),
//           minute: parseInt(timing.start.split(":")[1]),
//         });
//         let end = moment(currentDate).set({
//           hour: parseInt(timing.end.split(":")[0]),
//           minute: parseInt(timing.end.split(":")[1]),
//         });

//         while (start.isBefore(end)) {
//           let nextSlot = moment(start).add(30, "minutes");

//           events.push({
//             title: title,
//             start: start.toDate().toISOString(),
//             end: nextSlot.toDate().toISOString(),
//             bgColor: color,
//             type,
//             mixedSlot,
//             dropdownValues,
//           });

//           start = nextSlot;
//         }
//       };

//       if (beforeCourt.start && beforeCourt.end) {
//         addSegmentedEvents("Before Court", beforeCourt, "#90ee90b5", "before", {
//           casepreparation: beforeCourt.casepreparation,
//           meeting: beforeCourt.meeting,
//         });
//       }
//       if (afterCourt.start && afterCourt.end) {
//         addSegmentedEvents("After Court", afterCourt, "#90ee90b5", "after", {
//           casepreparation: afterCourt.casepreparation,
//           meeting: afterCourt.meeting,
//         });
//       }
//       if (courtDetails.courtTimings) {
//         const isSlotMixed =
//           courtDetails.courtTimings.casePreparation ||
//           courtDetails.courtTimings.meeting;
//         const dropdownValues = {
//           casepreparation: courtDetails.courtTimings.casePreparation,
//           meeting: courtDetails.courtTimings.meeting,
//         };
//         let start = moment(currentDate)
//           .set({
//             hour: courtDetails.courtTimings.start.split(":")[0],
//             minute: courtDetails.courtTimings.start.split(":")[1],
//           })
//           .toISOString();
//         let end = moment(currentDate)
//           .set({
//             hour: courtDetails.courtTimings.end.split(":")[0],
//             minute: courtDetails.courtTimings.end.split(":")[1],
//           })
//           .toISOString();
//         events.push({
//           title: "Court Session",
//           start,
//           end,
//           bgColor: "#ffb3ff96",
//           //   bgColor: "magenta",
//           type: "court",
//           mixedSlot: isSlotMixed,
//           dropdownValues,
//         });
//       }
//     });

//     startOfWeek.add(1, "week");
//   }

//   return events;
// };
