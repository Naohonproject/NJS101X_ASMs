// function to get duration of eachtime when staff checkin and check out, detect the last worksesstion of a day, then calc the total worktiem of day,overtime,...
const getWorkSessionInfor = (workSesstions, annualLeaveRegisters) => {
  // take workSesstion form arg then mapping to take out put
  const workInfors = workSesstions.map((workSesstion, index) => {
    // set flags, if worksesstion is the lastsesstion of the day, these flage will change then let us detect overtime,wor time of day
    let isLastWorkSesstionOfDay = false;
    let totalTimeWorking = null;
    let overTime = null;

    // if the worksesstion that at the end of arrays(worksesstions array), that absolutely the last worksesstion of some day
    if (index === workSesstions.length - 1) {
      isLastWorkSesstionOfDay = true;
    } else {
      if (
        // if worksestion that in the middile of array , that is the last worksesstion of day if this checkin day does not match check in day of next worksesstion
        workSesstion.checkIn.toDateString() !==
        workSesstions[index + 1].checkIn.toDateString()
      ) {
        isLastWorkSesstionOfDay = true;
      }
    }

    // if this worksesstion is the last worksesstion of day,take all worksesstion which has the same checkin day from total workSesstions
    if (isLastWorkSesstionOfDay) {
      const workDurationOfThisDay = workSesstions
        .filter((sesstion) => {
          return (
            sesstion.checkIn.toDateString() ===
            workSesstion.checkIn.toDateString()
          );
        })
        // mapping through returned array(return by filter method) get the duration of each workSession,then return an array of durration of each workSesstion
        .map((register) => {
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
          register.dayOff.toDateString() === workSesstion.checkIn.toDateString()
        );
      })
      .map((register) => {
        return Number(register.duration);
      });
    // set initial value for annual time, if there is no annual leave was registed, the annual Time of this day will be equal to 0
    let annualTimeOfDay = 0;

    // if the annual duration array not empty, let calc the total annual time of this day, because, some time people registing more than 1 annual leave
    if (annualLeavesDuration.length > 0) {
      annualTimeOfDay = annualLeavesDuration.reduce((prev, curr) => {
        return prev + curr;
      }, 0);
    }

    // some time , staff checkin but not check out yet, if not checkout ,set it to null
    const workSesstionDuration = workSesstion.checkOut
      ? Number(
          ((workSesstion.checkOut - workSesstion.checkIn) / 3600000).toFixed(2)
        )
      : null;

    // set flag
    let workTimeAndaAnnualLeave = null;
    // if totalworking is not null, means that just the last work sesstion of the day will have the workTimeAndAnnualLeave value, otherwise, it's still null
    if (totalTimeWorking !== null) {
      workTimeAndaAnnualLeave = Number(
        (annualTimeOfDay + totalTimeWorking).toFixed(3)
      );
    }

    // calc the over time
    if (totalTimeWorking !== null && workTimeAndaAnnualLeave > 8) {
      overTime = Number((workTimeAndaAnnualLeave - 8).toFixed(3));
    }

    // return the mapped object that reflect to the worksesstions
    return {
      date: workSesstion.checkIn.toLocaleDateString(),
      checkIn: workSesstion.checkIn.toLocaleTimeString(),
      checkOut: workSesstion.checkOut
        ? workSesstion.checkOut.toLocaleTimeString()
        : null,
      duration: workSesstionDuration,
      registedAnnualTime: annualTimeOfDay,
      workTimeAndaAnnualLeave: workTimeAndaAnnualLeave,
      overTime: overTime,
      workPlace: workSesstion.workPos,
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

// togic to check day is today or not
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
