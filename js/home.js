/**
 * Created by The Almighty Steve on 2/21/2015.
 */

"use strict";

var timer;

window.addEventListener('load', function() {
    document.getElementById('inputDiv').style.display = 'block';
    document.getElementById('waitingDiv').style.display = 'none';

    var relativeStartButton = document.getElementById('relativeTimerStartButton');
    relativeStartButton.addEventListener('click', function() {
        startRelativeTimer();
        clearInputs();
    });

    var relativeInput = document.getElementById('inputVal');
    relativeInput.addEventListener('keypress', function(e) {
        var key = e.which || e.keyCode;
        if(key == 13) {
            startRelativeTimer();
            clearInputs();
        }
    });

    var exactStartButton = document.getElementById('exactTimerStartButton');
    exactStartButton.addEventListener('click', function() {
        startExactTimer();
        clearInputs();
    });

    var exactInput = document.getElementById('inputDateVal');
    exactInput.addEventListener('keypress', function(e) {
        var key = e.which || e.keyCode;
        if(key == 13) {
            startExactTimer();
            clearInputs();
        }
    });

    var resetButton = document.getElementById('resetButton');
    resetButton.addEventListener('click', function() {
        resetTimer();
    });
});

function clearInputs() {
    var relative = document.getElementById('inputVal');
    var exact = document.getElementById('inputDateVal');

    relative.value = "";
    exact.value = "";
}

function startRelativeTimer() {
    var minuteInput = parseFloat(document.getElementById('inputVal').value);

    if(minuteInput > 0 && minuteInput <= 1440)
    {
        var time = new Date();
        var seconds = minuteInput - Math.floor(minuteInput);

        time.setMinutes(time.getMinutes() + minuteInput);
        time.setSeconds(time.getSeconds() + seconds*60);

        if (!(isNaN(time.getTime()))) {
            displayTime(time);
        }
        else
            console.log("Error parsing input from relative.");
    }
    else
        console.log('Put a real number in, greater than 0 and less than 1440 (a day).');
}

function startExactTimer() {

    function parseTime(input) {
        // parse a time in hh:mm:ss format
        var parts = input.split(':');
        var now = new Date();
        now.setHours(parts[0]);
        if(parts[1])
            now.setMinutes(parts[1]);
        else
            now.setMinutes(0);
        if(parts[2])
            now.setSeconds(parts[2]);
        else
            now.setSeconds(0);
        // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
        //return new Date(parts[0], parts[1]-1, parts[2]); // Note: months are 0-based
        return now;
    }


    var timeInput = (document.getElementById('inputDateVal').value);
    var time = parseTime(timeInput);

    if (!(isNaN(time.getTime()))) {
        displayTime(time);
    }
    else
        console.log("Error parsing input for exact.");
}

function displayTime(dateTime) {
    document.getElementById('inputDiv').style.display = 'none';
    document.getElementById('waitingDiv').style.display = 'block';

    var timerSpan = document.getElementById('timerSpan');
    var messageSpan = document.getElementById('messageSpan');
    messageSpan.innerHTML = "";

    var now = new Date();

    var message = document.getElementById('alertMessage');
    if (message.value != "") {
        messageSpan.innerHTML = message.value;
    }

    var endTimeSpan = document.getElementById('endTimeSpan');
    endTimeSpan.innerHTML = "End time: ";
    endTimeSpan.innerHTML += (dateTime.getHours() > 12 ? dateTime.getHours() - 12 : dateTime.getHours()) + ":" + dateTime.getMinutes() + ":" + dateTime.getSeconds() + (dateTime.getHours() > 12 ? " PM" : " AM");

    timer = setInterval(function() {
        if (now < dateTime) {
            var difference = dateTime - now;
            difference = new Date(difference);
            var remainingTimeString = "";
            if (difference.getUTCHours() > 0) {
                remainingTimeString += difference.getUTCHours();
                remainingTimeString += " hours, ";
            }
            remainingTimeString += difference.getUTCMinutes();
            remainingTimeString += " minutes, ";
            remainingTimeString += difference.getUTCSeconds();
            remainingTimeString += " seconds";

            document.title = remainingTimeString;
            timerSpan.innerHTML = "Remaining time: " + remainingTimeString;
            now.setSeconds(now.getSeconds() + 1);
        }
        else {
            if (message.value != "") {
                playAudio('beepAudio');
                alert(message.value);
                stopAudio('beepAudio');
                message.value = "";
            }
            else {
                playAudio('beepAudio');
                alert("Timer's up!");
                stopAudio('beepAudio');
            }
            resetTimer()
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timer);
    document.title = "Timer!";
    document.getElementById('inputDiv').style.display = 'block';
    document.getElementById('waitingDiv').style.display = 'none';
}

function playAudio(id) {
    var sound = document.getElementById(id);
    sound.play();
}

function stopAudio(id) {
    var sound = document.getElementById(id);
    sound.pause();
    sound.currentTime = 0;
}