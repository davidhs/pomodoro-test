/**
 * 
 * @param {string} timestring 
 * 
 * @returns time object
 */
function parseTimeStringAsTimeObject(timestring) {
    
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
function getNormalizedTimeObject(timeObject) {

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
function getTimeFromTimeObject(timeObject) {
    return timeObject.seconds + timeObject.minutes * 60 + timeObject.hours * 60 * 60;
}

/**
 * 
 * @param {string} timeString 
 * 
 * @returns time {number}
 */
function getTimeFromTimeString(timeString) {
    return getTimeFromTimeObject(getNormalizedTimeObject(parseTimeStringAsTimeObject(timeString)));
}



/**
 * 
 * @param {*} time 
 */
function getFormattedTimeStringFromTime(time) {

    // in seconds
    let timeRemaining = time;
    
    const hours = Math.floor(timeRemaining / (60 * 60));

    timeRemaining = timeRemaining - (60 * 60) * hours;

    const minutes = Math.floor(timeRemaining / (60));

    timeRemaining = timeRemaining - (60) * minutes;

    const seconds = timeRemaining;

    let timeString = '';
    timeString = seconds + timeString;



    if (minutes > 0) {

        if (seconds < 10) {
            timeString = '0' + timeString;
        }

        timeString = minutes + ':' + timeString;

        if (hours > 0) {
            if (minutes < 10) {
                timeString = '0' + timeString;
                timeString = hours + ':' + timeString;
            }
        }
    } else if (hours > 0) {

        if (seconds < 10) {
            timeString = '0' + timeString;
        }

        timeString = hours + ':00:' + timeString;
    }



    return timeString;
}





const allowableTimerRegularExpression = /^\d+(:\d+(:\d+)?)?$/;

const allowableConstructionTimerRegularExpression = /^\d*:?\d*:?\d*$/;

const SYMBOL_PLAY = '►';
const SYMBOL_PAUSE = '▌▌';


class Timer {

    constructor(timeElement, buttonElement) {
        this.timeElement = timeElement;
        this.buttonElement = buttonElement;

        this.previousValueOfTime = timeElement.value;

        this.intervalID = null;

        this.playTimestamp = null;
        
        this.lastTimestamp = null;

        

        this.playing = false;
        this.time = null;


        this.timeElement.addEventListener('mousedown', () => {
            this.pause();
        });

        this.timeElement.addEventListener('input', (evt) => {
            // evt.preventDefault();
        
            const currentValue = evt.target.value.trim();

            if (currentValue === this.previousValueOfTime) {
                return;
            }

            // pause time
            this.pause();

            console.info('changing...');

            let allowChange = false;
        
            if (currentValue.match(allowableConstructionTimerRegularExpression) || currentValue.trim().length === 0) {
                allowChange = true;
            }
        
            // Check if we want to allow the change.
            if (!allowChange) {
                evt.target.value = this.previousValueOfTime;
            } else {
                evt.target.value = currentValue;
            }

            // Copy current value.
            this.previousValueOfTime = timerTime.value;
        });

        timerButton.addEventListener('mousedown', () => {
            console.info('click');
            this.toggle();
        });
    }

    tick() {
        if (this.playing) {
            

            const now = Date.now();
            // difference in seconds
            const dt = (now - this.lastTimestamp) / 1000;
            this.lastTimestamp = Date.now();

            this.time = Math.max(0, this.time - dt);

            this.timeElement.value = getFormattedTimeStringFromTime(Math.round(this.time));


            if (this.time <= 0) {
                this.done();
            }
        }
    }

    toggle() {
        if (this.playing) {
            // stop playing
            this.pause();
        } else {
            // start playing
            this.play();
        }
    }

    done() {
        console.info('done!');
        // add notification to macOS
        new window.Notification('Pomodoro', {
            body: 'Timer done!'
        });

        this.pause();
    }

    play() {
        
        if (!this.playing) {

            if (this.isTimeOK()) {
                console.info('start playing');


                this.time = getTimeFromTimeString(this.timeElement.value);

                if (this.time <= 0) {
                    return;
                }

                this.lastTimestamp = Date.now();



                this.timeElement.value = getFormattedTimeStringFromTime(Math.round(this.time));

                
                // start playing
                // start playing
                this.playing = true;
                this.buttonElement.value = SYMBOL_PAUSE;


                this.intervalID = window.setInterval(() => {
                    this.tick();
                }, 1000);
            } else {
                console.info('time is not OK');
            }
        } else {
            console.info('is already playing');
        }
    }

    pause() {
        console.info('stop playing');
        if (this.playing) {
            // stop playing
            this.playing = false;
            this.buttonElement.value = SYMBOL_PLAY;

            this.time = null;

            this.lastTimestamp = null;

            window.clearInterval(this.intervalID);
        }
    }

    isTimeOK() {
        const currentValue = this.timeElement.value.trim();

        console.info(currentValue);

        if (currentValue.match(allowableTimerRegularExpression)) {
            return true;
        } else {
            return false;
        }
    }
}


const timerTime = document.querySelector('.timer__time');
const timerButton = document.querySelector('.timer__button');

new Timer(timerTime, timerButton);

