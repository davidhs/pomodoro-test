const { 
    getFormattedTimeStringFromTime,
    getTimeFromTimeString
} = require('./timer-utils');


const allowableTimerRegularExpression = /^\d+(:\d+(:\d+)?)?$/;
const allowableConstructionTimerRegularExpression = /^\d*:?\d*:?\d*$/;

const SYMBOL_PLAY = '►';
const SYMBOL_PAUSE = '&nbsp;&nbsp;&nbsp;&nbsp;&#9616;&#9616;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';

const VERBOSE = false;


class Timer {

    constructor(timeElement, buttonElement) {
        
        // DOM elements
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

            if (VERBOSE) {
                console.info('time string changing');
            }

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
            this.previousValueOfTime = timeElement.value;
        });

        buttonElement.addEventListener('mousedown', () => {
            if (VERBOSE) {
                console.info('button click');
            }
            this.toggle();
        });
    }

    tick() {
        if (this.playing) {
            
            const now = Date.now();
            // difference in seconds
            const dt = (now - this.lastTimestamp) / 1000;
            this.lastTimestamp = Date.now();


            const oldTime = this.time;
            const newTime = Math.max(0, this.time - dt);

            this.time = newTime;

            const formattedTimeString = getFormattedTimeStringFromTime(Math.round(this.time));

            if (VERBOSE) {
                console.info(`tick(): ${formattedTimeString} (${oldTime} -> ${newTime})`);
            }

            this.timeElement.value = formattedTimeString;


            if (this.time <= 0) {
                this.done();
            }
        }
    }

    toggle() {
        if (this.playing) {
            // stop playing
            if (VERBOSE) {
                console.info('toggle(): stop playing');
            }
            this.pause();
        } else {
            // start playing
            if (VERBOSE) {
                console.info('toggle(): start playing');
            }
            this.play();
        }
    }

    done() {
        if (VERBOSE) {
            console.info('done(): timer done!');
        }

        if (VERBOSE) {
            console.info('done(): creating a notification');
        }
        
        // add notification to macOS
        new window.Notification('Pomodoro', {
            body: 'Timer done!'
        });

        if (VERBOSE) {
            console.info('done(): pausing...');
        }
        this.pause();
    }

    play() {
        if (!this.playing) {
            if (this.isTimeOK()) {


                if (VERBOSE) {
                    console.info(`play(): raw value: ${this.timeElement.value}`);
                }

                this.time = getTimeFromTimeString(this.timeElement.value);

                if (VERBOSE) {
                    console.info(`play(): time: ${this.time}`);
                }

                if (this.time <= 0) {
                    if (VERBOSE) {
                        console.info('play(): No time remaining, not playing.');
                    }
                    return;
                } else {
                    if (VERBOSE) {
                        console.info('play(): Start playing.');
                    }
                }
                // start playing
                this.lastTimestamp = Date.now();

                const formattedTimeString = getFormattedTimeStringFromTime(Math.round(this.time));

                if (VERBOSE) {
                    console.info(`Starting at: ${formattedTimeString}`);
                }

                this.timeElement.value = formattedTimeString;
                this.playing = true;
                this.buttonElement.innerHTML = SYMBOL_PAUSE;

                this.intervalID = window.setInterval(() => {
                    this.tick();
                }, 1000);
            } else {
                if (VERBOSE) {
                    console.info('play(): time string is not OK');
                }
            }
        } else {
            if (VERBOSE) {
                console.info('play(): is already playing');
            }
        }
    }

    pause() {
        if (this.playing) {
            // stop playing
            if (VERBOSE) {
                console.info('pause(): stop playing');
            }
            this.playing = false;
            this.buttonElement.innerText = SYMBOL_PLAY;
            this.time = null;
            this.lastTimestamp = null;
            window.clearInterval(this.intervalID);
        }
    }

    isTimeOK() {
        const currentValue = this.timeElement.value.trim();

        const status = !!currentValue.match(allowableTimerRegularExpression);

        if (VERBOSE) {
            console.info(`isTimeOK(): current value: ${currentValue}, ok? ${status}`);
        }

        if (status) {
            return true;
        } else {
            return false;
        }
    }
}

module.exports = Timer;

