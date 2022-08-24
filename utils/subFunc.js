const getWorkSessionInfor = (workSesstions, annualLeaveRegisters) => {
  const workInfors = workSesstions.map((workSesstion, index) => {
    let isLastWorkSesstionOfDay = false;
    let totalTimeWorking = null;
    let overTime = null;

    if (index === workSesstions.length - 1) {
      isLastWorkSesstionOfDay = true;
    } else {
      if (
        workSesstion.checkIn.toDateString() !==
        workSesstions[index + 1].checkIn.toDateString()
      ) {
        isLastWorkSesstionOfDay = true;
      }
    }

    if (isLastWorkSesstionOfDay) {
      const workDurationOfThisDay = workSesstions
        .filter((sesstion) => {
          return (
            sesstion.checkIn.toDateString() ===
            workSesstion.checkIn.toDateString()
          );
        })
        .map((register) => {
          return Number(
            ((register.checkOut - register.checkIn) / 3600000).toFixed(2)
          );
        });
      totalTimeWorking = workDurationOfThisDay.reduce((prev, curr) => {
        return prev + curr;
      }, 0);
    }

    const annualLeavesDuration = annualLeaveRegisters
      .filter((register) => {
        return (
          register.dayOff.toDateString() === workSesstion.checkIn.toDateString()
        );
      })
      .map((register) => {
        return Number(register.duration);
      });

    let annualTimeOfDay = 0;

    if (annualLeavesDuration.length > 0) {
      annualTimeOfDay = annualLeavesDuration.reduce((prev, curr) => {
        return prev + curr;
      }, 0);
    }

    const workSesstionDuration = workSesstion.checkOut
      ? Number(
          ((workSesstion.checkOut - workSesstion.checkIn) / 3600000).toFixed(2)
        )
      : null;

    let workTimeAndaAnnualLeave = null;

    if (totalTimeWorking !== null) {
      workTimeAndaAnnualLeave = Number(
        (annualTimeOfDay + totalTimeWorking).toFixed(3)
      );
    }

    if (totalTimeWorking !== null && workTimeAndaAnnualLeave > 8) {
      overTime = Number((workTimeAndaAnnualLeave - 8).toFixed(3));
    }

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

  return workInfors;
};

function getUnique(array) {
  var uniqueArray = [];

  for (i = 0; i < array.length; i++) {
    if (uniqueArray.indexOf(array[i]) === -1) {
      uniqueArray.push(array[i]);
    }
  }
  return uniqueArray;
}

const isToday = (date) => {
  const today = new Date();
  if (today.toDateString() === date.toDateString()) {
    return true;
  }
  return false;
};

exports.isToday = isToday;
exports.getUnique = getUnique;
exports.getWorkSessionInfor = getWorkSessionInfor;
