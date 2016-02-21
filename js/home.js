/**
 * Created by Steven on 2/21/2015.
 */

"use strict";

var gTimer;
var gCurrentAlarmTime;

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

    var stopButton = document.getElementById('stopButton');
    stopButton.addEventListener('click', function() {
        resetTimer();
    });

    var snoozeButton = document.getElementById('snoozeButton');
    snoozeButton.addEventListener('click', function() {
        snoozeTimer();
    });
});

function clearInputs() {
    var relative = document.getElementById('inputVal');
    var exact = document.getElementById('inputDateVal');

    relative.value = "";
    exact.value = "";
}

function startRelativeTimer() {
    var input = document.getElementById('inputVal').value;

    //Match any number of digits, followed by either one or zero (a literal . or : followed by any number of digits)
    var regEx = /^(\d*)(?:([\.:])(\d*))?$/;

    var minutes = 0;
    var seconds = 0;

    if (regEx.test(input))
    {
        var parsedInput = regEx.exec(input);

        switch (parsedInput[2])
        {
            case ":":
                seconds = parseInt(parsedInput[3]);
                break;
            case ".":
                var temp = "0.";
                temp += parsedInput[3];
                console.log(temp);
                seconds = parseFloat(temp) * 60;
                break;
            default:
                break;
        }

        minutes = parseInt(parsedInput[1]);

        var time = new Date();

        time.setMinutes(time.getMinutes() + minutes);
        time.setSeconds(time.getSeconds() + seconds);

        if (!(isNaN(time.getTime()))) {
            displayTime(time);
        }
        else
            console.log("Error parsing input from relative.");
    }
    else
        console.log('Put a real number in! Accepts x.y as x minutes and 0.y * 60 seconds, ' +
            'and x:y as x minutes and y seconds.');
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

    gCurrentAlarmTime = dateTime;

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

    gTimer = setInterval(function() {
        if (now < dateTime) {
            var difference = dateTime - now;
            difference = new Date(difference);
            var remainingTimeString = "";
            var titleSting = "";
            if (difference.getUTCHours() > 0) {
                remainingTimeString += difference.getUTCHours();
                remainingTimeString += " hours, ";
                titleSting += difference.getUTCHours();
                titleSting += "h ";
            }
            remainingTimeString += difference.getUTCMinutes();
            remainingTimeString += " minutes, ";
            titleSting += difference.getUTCMinutes();
            titleSting += "m ";

            remainingTimeString += difference.getUTCSeconds();
            remainingTimeString += " seconds";
            titleSting += difference.getUTCSeconds();
            titleSting += "s";

            document.title = titleSting;
            timerSpan.innerHTML = "Remaining time: " + remainingTimeString;
            now.setSeconds(now.getSeconds() + 1);
        }
        else {
            if (message.value != "")
            {
                document.title = message.value;
            }
            else
            {
                document.title = "Time!";
            }

            playAudio('beepAudio');
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(gTimer);
    stopAudio('beepAudio');

    var message = document.getElementById('alertMessage');
    message.value = "";

    document.title = "Timer!";
    document.getElementById('inputDiv').style.display = 'block';
    document.getElementById('waitingDiv').style.display = 'none';
}

function snoozeTimer(minutes=5) {
    clearInterval(gTimer);
    stopAudio('beepAudio');

    var newAlarm = new Date();
    if (newAlarm < gCurrentAlarmTime)
    {
        newAlarm = gCurrentAlarmTime;
    }
    newAlarm.setMinutes(newAlarm.getMinutes() + minutes);
    displayTime(newAlarm);
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