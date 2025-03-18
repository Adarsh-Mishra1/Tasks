import moment from "moment";

export const convertToEvents = (data, startOfWeek) => {
  const events = [];
  const startOfWeekMoment = moment(startOfWeek).startOf("isoWeek");

  data.forEach((item) => {
    const workingDays = JSON.parse(item.working_days);
    const beforeCourt = JSON.parse(item.before_court_timings);
    const afterCourt = JSON.parse(item.after_court_timings);
    const courtDetails = JSON.parse(item.court_timings);

    workingDays.forEach((day) => {
      const dayOffset = day - 1;
      const currentDate = moment(startOfWeekMoment).add(dayOffset, "days");

      if (beforeCourt.start && beforeCourt.end) {
        events.push({
          title: "Before Court Timings",
          start: moment(currentDate)
            .set({
              hour: beforeCourt.start.split(":")[0],
              minute: beforeCourt.start.split(":")[1],
            })
            .toDate(),
          end: moment(currentDate)
            .set({
              hour: beforeCourt.end.split(":")[0],
              minute: beforeCourt.end.split(":")[1],
            })
            .toDate(),
          color: "green",
          type: "before",
        });
      }

      if (courtDetails.isCourtSelected) {
        events.push({
          title: "Court Session",
          start: moment(currentDate)
            .set({
              hour: courtDetails.courtTimings.start.split(":")[0],
              minute: courtDetails.courtTimings.start.split(":")[1],
            })
            .toDate(),
          end: moment(currentDate)
            .set({
              hour: courtDetails.courtTimings.end.split(":")[0],
              minute: courtDetails.courtTimings.end.split(":")[1],
            })
            .toDate(),
          color: "green",
          type: "court",
        });

        events.push({
          title: "Break Time",
          start: moment(currentDate)
            .set({
              hour: courtDetails.breakTiming.start.split(":")[0],
              minute: courtDetails.breakTiming.start.split(":")[1],
            })
            .toDate(),
          end: moment(currentDate)
            .set({
              hour: courtDetails.breakTiming.end.split(":")[0],
              minute: courtDetails.breakTiming.end.split(":")[1],
            })
            .toDate(),
          color: "orange",
          type: "break",
        });
      }

      if (afterCourt.start && afterCourt.end) {
        events.push({
          title: "After Court",
          start: moment(currentDate)
            .set({
              hour: afterCourt.start.split(":")[0],
              minute: afterCourt.start.split(":")[1],
            })
            .toDate(),
          end: moment(currentDate)
            .set({
              hour: afterCourt.end.split(":")[0],
              minute: afterCourt.end.split(":")[1],
            })
            .toDate(),
          color: "green",
          type: "after",
        });
      }
    });
  });

  return events;
};

export const convertToEventsMonth = (data, currentMonth) => {
  const events = [];
  const startOfMonth = moment(currentMonth).startOf("month");
  // const endOfMonth = moment(currentMonth).endOf("month");
  const endOfMonth = moment(currentMonth).add(1, "month").endOf("month");

  let startOfWeek = moment(startOfMonth).startOf("isoWeek");

  while (startOfWeek.isBefore(endOfMonth)) {
    data.forEach((item) => {
      if (!item.working_days) return;

      const workingDays = JSON.parse(item.working_days) || [];
      const beforeCourt = item.before_court_timings
        ? JSON.parse(item.before_court_timings)
        : {};
      const afterCourt = item.after_court_timings
        ? JSON.parse(item.after_court_timings)
        : {};
      const courtDetails = item.court_timings
        ? JSON.parse(item.court_timings)
        : {};

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
            hour: timing.start.split(":")[0],
            minute: timing.start.split(":")[1],
          });
          let end = moment(currentDate).set({
            hour: timing.end.split(":")[0],
            minute: timing.end.split(":")[1],
          });

          while (start.isBefore(end)) {
            let nextSlot = moment(start).add(60, "minutes");
            if (type === "court") {
              events.push({
                title: title,
                start: start.toDate(),
                end: nextSlot.toDate(),
                color,
                type,
                mixedSlot,
                dropdownValues,
              });
            } else {
              events.push({
                title: title,
                start: start.toDate(),
                end: nextSlot.toDate(),
                color,
                type,
                dropdownValues,
              });
            }
            start = nextSlot;
          }
        };

        if (beforeCourt.start && beforeCourt.end) {
          const dropdownValues = {
            casepreparation: beforeCourt.casepreparation,
            meeting: beforeCourt.meeting,
          };
          addSegmentedEvents(
            "Before Court",
            beforeCourt,
            "green",
            "before",
            dropdownValues
          );
        }

        if (courtDetails.isCourtSelected) {
          const isSlotMixed =
            courtDetails.courtTimings.casePreparation ||
            courtDetails.courtTimings.meeting;
          const dropdownValues = {
            casepreparation: courtDetails.courtTimings.casePreparation,
            meeting: courtDetails.courtTimings.meeting,
          };
          addSegmentedEvents(
            "Court Session",
            courtDetails.courtTimings,
            "green",
            "court",
            dropdownValues,
            isSlotMixed
          );
          // addSegmentedEvents(
          //   "Break Time",
          //   courtDetails.breakTiming,
          //   "orange",
          //   "break"
          // );
          // commented break hours no need
          /*
          if (
            courtDetails.breakTiming?.start &&
            courtDetails.breakTiming?.end
          ) {
            events.push({
              title: "Break Time",
              start: moment(currentDate)
                .set({
                  hour: courtDetails.breakTiming.start.split(":")[0],
                  minute: courtDetails.breakTiming.start.split(":")[1],
                })
                .toDate(),
              end: moment(currentDate)
                .set({
                  hour: courtDetails.breakTiming.end.split(":")[0],
                  minute: courtDetails.breakTiming.end.split(":")[1],
                })
                .toDate(),
              color: "orange",
              type: "break",
            });
          } */
        }

        if (afterCourt.start && afterCourt.end) {
          const dropdownValues = {
            casepreparation: afterCourt.casepreparation,
            meeting: afterCourt.meeting,
          };
          addSegmentedEvents(
            "After Court",
            afterCourt,
            "green",
            "after",
            dropdownValues
          );
        }
      });
    });

    startOfWeek.add(1, "week");
  }

  return events;
};

// export const convertToEventsMonth = (data, currentMonth) => {
//   const events = [];
//   const startOfMonth = moment(currentMonth).startOf("month");
//   const endOfMonth = moment(currentMonth).endOf("month");

//   let startOfWeek = moment(startOfMonth).startOf("isoWeek");

//   while (startOfWeek.isBefore(endOfMonth)) {
//     data.forEach((item) => {
//       const workingDays = JSON.parse(item.working_days);
//       const beforeCourt = JSON.parse(item.before_court_timings);
//       const afterCourt = JSON.parse(item.after_court_timings);
//       const courtDetails = JSON.parse(item.court_timings);

//       workingDays.forEach((day) => {
//         const dayOffset = day - 1;
//         const currentDate = moment(startOfWeek).add(dayOffset, "days");

//         if (
//           currentDate.isBefore(startOfMonth) ||
//           currentDate.isAfter(endOfMonth)
//         ) {
//           return;
//         }

//         if (beforeCourt.start && beforeCourt.end) {
//           events.push({
//             title: "Before Court Timings",
//             start: moment(currentDate)
//               .set({
//                 hour: beforeCourt.start.split(":")[0],
//                 minute: beforeCourt.start.split(":")[1],
//               })
//               .toDate(),
//             end: moment(currentDate)
//               .set({
//                 hour: beforeCourt.end.split(":")[0],
//                 minute: beforeCourt.end.split(":")[1],
//               })
//               .toDate(),
//             color: "green",
//             type: "before",
//           });
//         }

//         if (courtDetails.isCourtSelected) {
//           events.push({
//             title: "Court Session",
//             start: moment(currentDate)
//               .set({
//                 hour: courtDetails.courtTimings.start.split(":")[0],
//                 minute: courtDetails.courtTimings.start.split(":")[1],
//               })
//               .toDate(),
//             end: moment(currentDate)
//               .set({
//                 hour: courtDetails.courtTimings.end.split(":")[0],
//                 minute: courtDetails.courtTimings.end.split(":")[1],
//               })
//               .toDate(),
//             color: "green",
//             type: "court",
//           });

//           events.push({
//             title: "Break Time",
//             start: moment(currentDate)
//               .set({
//                 hour: courtDetails.breakTiming.start.split(":")[0],
//                 minute: courtDetails.breakTiming.start.split(":")[1],
//               })
//               .toDate(),
//             end: moment(currentDate)
//               .set({
//                 hour: courtDetails.breakTiming.end.split(":")[0],
//                 minute: courtDetails.breakTiming.end.split(":")[1],
//               })
//               .toDate(),
//             color: "orange",
//             type: "break",
//           });
//         }

//         if (afterCourt.start && afterCourt.end) {
//           events.push({
//             title: "After Court",
//             start: moment(currentDate)
//               .set({
//                 hour: afterCourt.start.split(":")[0],
//                 minute: afterCourt.start.split(":")[1],
//               })
//               .toDate(),
//             end: moment(currentDate)
//               .set({
//                 hour: afterCourt.end.split(":")[0],
//                 minute: afterCourt.end.split(":")[1],
//               })
//               .toDate(),
//             color: "green",
//             type: "after",
//           });
//         }
//       });
//     });

//     startOfWeek.add(1, "week");
//   }

//   return events;
// };

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
        start: start,
        end: end,
        color: "blue",
        isScheduled: true,
        schduledEventType: each.event_type,
      };

      const existingIndex = updatedMasterOrgEvents.findIndex(
        (event) =>
          event.start.getTime() === start.getTime() &&
          event.end.getTime() === end.getTime()
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

// export const handleScheduledTasks = (data) => {
//   const newEvents = [];
//   data?.forEach((each) => {
//     try {
//       if (!each.event_slot || each.event_slot === "This slot is empty") return;
//       const parsedSlot = JSON.parse(each.event_slot);
//       if (!parsedSlot.start || !parsedSlot.end) return;
//       const start = new Date(`${each.event_date}T${parsedSlot.start}:00`);
//       const end = new Date(`${each.event_date}T${parsedSlot.end}:00`);

//       const newEvent = {
//         id: each.id,
//         title: each.desription || "No Title",
//         start: start,
//         end: end,
//         color: "blue",
//         type: each.event_type,
//       };

//       newEvents.push(newEvent);
//     } catch (error) {
//       console.error("Invalid event_slot:", each.event_slot, error);
//     }
//   });
//   return newEvents;
// };

export const findMinMaxTimings = (masterorg) => {
  const masterorgdata = masterorg.at(0);
  if (!masterorgdata) return;

  const timings = [];

  // Extract and parse all time values
  const beforeCourt = JSON.parse(masterorgdata.before_court_timings);
  const court = JSON.parse(masterorgdata.court_timings);
  const afterCourt = JSON.parse(masterorgdata.after_court_timings);

  timings.push(beforeCourt.start, beforeCourt.end);
  timings.push(court.courtTimings.start, court.courtTimings.end);
  if (court.breakTiming) {
    timings.push(court.breakTiming.start, court.breakTiming.end);
  }
  timings.push(afterCourt.start, afterCourt.end);

  // Convert to moment objects for comparison
  const momentTimings = timings.map((time) => moment(time, "HH:mm"));

  // Find min and max
  // const minTime = moment.min(momentTimings).format("HH:mm");
  // const maxTime = moment.max(momentTimings).format("HH:mm");

  const minTime = moment.min(momentTimings).format("hh:mm A");
  const maxTime = moment.max(momentTimings).format("hh:mm A");

  return { minTime, maxTime };
};
