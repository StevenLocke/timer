/**
 * Created by The Almighty Steve on 2/21/2015.
 */

"use strict";

window.addEventListener('load', function() {
    document.getElementById('inputDiv').style.display = 'block';
    document.getElementById('waitingDiv').style.display = 'none';

    var relativeStartButton = document.getElementById('relativeTimerStartButton');
    relativeStartButton.addEventListener('click', function() {
        startRelativeTimer();
        clearInputs();
    });

    var exactStartButton = document.getElementById('exactTimerStartButton');
    exactStartButton.addEventListener('click', function() {
        startExactTimer();
        clearInputs();
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

    if(minuteInput > 0 && minuteInput <= 100)
    {
        var time = new Date();
        time.setMinutes(time.getMinutes() + minuteInput);

        if (!(isNaN(time.getTime()))) {
            displayTime(time);
        }
        else
            console.log("Error parsing input from relative.");
    }
    else
        console.log('Put a real number in, between 0 and 100');
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

    var now = new Date();

    var timer = setInterval(function() {
        if (now < dateTime) {
            var difference = dateTime - now;
            difference = new Date(difference);
            var myString = "";
            if (difference.getUTCHours() > 0) {
                myString += difference.getUTCHours();
                myString += " hours, ";
            }
            myString += difference.getUTCMinutes();
            myString += " minutes, ";
            myString += difference.getUTCSeconds();
            myString += " seconds";

            document.title = myString;
            timerSpan.innerHTML = "Remaining time: " + myString;
            now.setSeconds(now.getSeconds() + 1);
        }
        else {
            var message = document.getElementById('alertMessage');
            if (message.value != "") {
                alert(message.value);
                message.value = "";
            }
            else
                alert("Timer's up!");
            clearInterval(timer);
            document.title = "Timer!";
            document.getElementById('inputDiv').style.display = 'block';
            document.getElementById('waitingDiv').style.display = 'none';
        }
    }, 1000);
}