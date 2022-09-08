// function to get duration of eachtime when staff checkin and check out, detect the last worksession of a day, then calc the total worktiem of day,overtime,...
const getWorkSessionInfor = (workSessions, annualLeaveRegisters) => {
  // take workSession form arg then mapping to take out put
  const workInfors = workSessions.map((workSession, index) => {
    // set flags, if worksession is the lastsession of the day, these flage will change then let us detect overtime,work time of day
    let isLastWorkSessionOfDay = false;
    let totalTimeWorking = null;
    let overTime = null;

    // if the worksession that at the end of arrays(worksessions array), that absolutely the last worksession of some day
    if (index === workSessions.length - 1) {
      isLastWorkSessionOfDay = true;
    } else {
      if (
        // if worksestion that in the middile of array , that is the last worksession of day if this checkin day does not match check in day of next worksession
        workSession.checkIn.toDateString() !==
        workSessions[index + 1].checkIn.toDateString()
      ) {
        isLastWorkSessionOfDay = true;
      }
    }

    // if this worksession is the last worksession of day,take all worksession which has the same checkin day from total workSessions
    //
    if (isLastWorkSessionOfDay) {
      const workDurationOfThisDay = workSessions
        // for each last worksession we can get all work session of that day
        .filter((session) => {
          return (
            session.checkIn.toDateString() ===
            workSession.checkIn.toDateString()
          );
        })
        // mapping through returned array(return by filter method) get the duration of each workSession,then return an array of duration of each workSession
        .map((register) => {
          // if last worksession(that is the newest worksession, not have checkout yet), this will return NaN caused checkout is undefined
          return Number(
            ((register.checkOut - register.checkIn) / 3600000).toFixed(2)
          );
        });
      // using reduce method on workDurationOfThisDay array  to get total work time of the day
      totalTimeWorking = workDurationOfThisDay.reduce((prev, curr) => {
        return prev + curr;
      }, 0);
    }

    // get all annual Leave,which staff registed of this each,get the duration of each register, this will return array of duration
    const annualLeavesDuration = annualLeaveRegisters
      .filter((register) => {
        return (
          register.dayOff.toDateString() === workSession.checkIn.toDateString()
        );
      })
      .map((register) => {
        return Number(register.duration);
      });
    // set initial value for annual time, if there is no annual leave was registered, the annual Time of this day will be equal to 0
    let annualTimeOfDay = 0;

    // if the annual duration array not empty, let calc the total annual time of this day, because, some time people registing more than 1 annual leave
    if (annualLeavesDuration.length > 0) {
      annualTimeOfDay = annualLeavesDuration.reduce((prev, curr) => {
        return prev + curr;
      }, 0);
    }

    // some time , staff checkin but not check out yet, if not checkout ,set work duration of this worksession to null
    const workSessionDuration = workSession.checkOut
      ? Number(
          ((workSession.checkOut - workSession.checkIn) / 3600000).toFixed(2)
        )
      : null;

    // set flag
    let workTimeAndaAnnualLeave = null;
    // if totalworking is not null, means that just the last work session of the day will have the workTimeAndAnnualLeave value, otherwise, it's still null
    if (totalTimeWorking !== null) {
      workTimeAndaAnnualLeave = Number(
        (annualTimeOfDay + totalTimeWorking).toFixed(3)
      );
    }

    // calc the over time
    if (totalTimeWorking !== null && workTimeAndaAnnualLeave > 8) {
      overTime = Number((workTimeAndaAnnualLeave - 8).toFixed(3));
    }

    // return the mapped object that reflect to the worksessions
    return {
      date: workSession.checkIn.toLocaleDateString(),
      checkIn: workSession.checkIn.toLocaleTimeString(),
      checkOut: workSession.checkOut
        ? workSession.checkOut.toLocaleTimeString()
        : null,
      duration: workSessionDuration,
      registedAnnualTime: annualTimeOfDay,
      workTimeAndaAnnualLeave: workTimeAndaAnnualLeave,
      overTime: overTime,
      workPlace: workSession.workPos,
      workSessionId: workSession._id,
      workSession: workSession,
    };
  });
  // return workInfor
  return workInfors;
};

// logic to remove the doublicate value of array
function getUnique(array) {
  var uniqueArray = [];

  for (i = 0; i < array.length; i++) {
    if (uniqueArray.indexOf(array[i]) === -1) {
      uniqueArray.push(array[i]);
    }
  }
  return uniqueArray;
}

// logic to check day is today or not
const isToday = (date) => {
  const today = new Date();
  if (today.toDateString() === date.toDateString()) {
    return true;
  }
  return false;
};

// exports them out to import to other moudule
exports.isToday = isToday;
exports.getUnique = getUnique;
exports.getWorkSessionInfor = getWorkSessionInfor;
