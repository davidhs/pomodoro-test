const Timer = require('./components/Timer');

const timerTime = document.querySelector('.timer__time');
const timerButton = document.querySelector('.timer__button');

new Timer(timerTime, timerButton);

