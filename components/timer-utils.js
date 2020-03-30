
const DEBUG = false;

/**
 * 
 * @param {string} timestring 
 * 
 * @returns time object
 */
export function parseTimeStringAsTimeObject(timestring) {

  const parts = timestring.split(':').map((part) => parseInt(part.trim(), 10));

  if (parts.length > 3) {
    throw Error('this should not happen');
  }

  // seconds, minutes, hours
  const timeList = [0, 0, 0];

  const n = parts.length;
  for (let i = n - 1, j = 0; i >= 0; i -= 1, j += 1) {
    timeList[j] = parts[i];
  }


  const timeObject = {
    seconds: timeList[0],
    minutes: timeList[1],
    hours: timeList[2]
  };

  return timeObject;
}

/**
 * 
 * if there are 70 minutes in the minute section, it will be
 * changed to 10 minutes, and 1 hour added
 * 
 * @param {time object} timeObject 
 * 
 * @returns normalized time object
 */
export function getNormalizedTimeObject(timeObject) {

  // in seconds
  let timeRemaining = getTimeFromTimeObject(timeObject);

  const hours = Math.floor(timeRemaining / (60 * 60));

  timeRemaining = timeRemaining - (60 * 60) * hours;

  const minutes = Math.floor(timeRemaining / (60));

  timeRemaining = timeRemaining - (60) * minutes;

  const seconds = timeRemaining;

  const normalizedTimeObject = { seconds, minutes, hours };

  return normalizedTimeObject;
}


/**
 * 
 * @param {time object} timeObject 
 * @returns returns time in seconds
 */
export function getTimeFromTimeObject(timeObject) {
  return timeObject.seconds + timeObject.minutes * 60 + timeObject.hours * 60 * 60;
}

/**
 * 
 * @param {string} timeString 
 * 
 * @returns time {number}
 */
export function getTimeFromTimeString(timeString) {
  return getTimeFromTimeObject(getNormalizedTimeObject(parseTimeStringAsTimeObject(timeString)));
}



/**
 * 
 * @param {*} time Time in seconds
 */
export function getFormattedTimeStringFromTime(time) {


  if (DEBUG) {
    console.info(`getFormattedTimeStringFromTime(): time: ${time}`);
  }

  // in seconds
  let timeRemaining = time;

  const hours = Math.floor(timeRemaining / (60 * 60));

  timeRemaining = timeRemaining - (60 * 60) * hours;

  const minutes = Math.floor(timeRemaining / (60));

  timeRemaining = timeRemaining - (60) * minutes;

  const seconds = timeRemaining;

  let timeString = '';

  if (hours > 0) {

    timeString = hours;
    if (minutes > 0) {
      if (minutes < 10) {
        timeString = timeString + ':0' + minutes;
      } else {
        timeString = timeString + ':' + minutes;
      }
      if (seconds > 0) {
        if (seconds < 10) {
          timeString = timeString + ':0' + seconds;
        } else {
          timeString = timeString + ':' + seconds;
        }
      } else {
        timeString = timeString + ':00';
      }
    } else {
      timeString = timeString + ':00';
      if (seconds > 0) {
        if (seconds < 10) {
          timeString = timeString + ':0' + seconds;
        } else {
          timeString = timeString + ':' + seconds;
        }
      } else {
        timeString = timeString + ':00';
      }
    }
  } else {
    if (minutes > 0) {
      timeString = minutes;
      if (seconds > 0) {
        if (seconds < 10) {
          timeString = timeString + ':0' + seconds;
        } else {
          timeString = timeString + ':' + seconds;
        }
      } else {
        timeString = timeString + ':00';
      }
    } else {
      timeString = seconds;
    }
  }

  if (DEBUG) {
    console.info(`getFormattedTimeStringFromTime(): timestring: ${timeString}`);
  }

  return timeString;
}