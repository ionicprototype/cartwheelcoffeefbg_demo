// INIT
// @DESC INITIALIZES CURRENT MONTH/YEAR FOR UPCOMING EVENTS
let currentTime = new Date();
let eventMonth = currentTime.toLocaleString('en-us', { month: 'long' });
let eventYear = currentTime.getFullYear();
const exportArray = [];
document.querySelector('.selectedMonth').textContent = eventMonth;
document.querySelector('.selectedYear').textContent = eventYear;
// GC API
// @DESC INITIALIZES/CALLS GOOGLE CALENDAR API
gapi.load('client', start);
//--------------------------------------------------------
// JQUERY CLICK EVENTS
// @DESC BOOTSTRAP: ALLOWS POPOVERS
$(function () {
    $('[data-toggle="popover"]').popover()
});
// @DESC BOOTSTRAP: UPDATES FILE NAME IN POST IMAGE MODULE 
$('input[type="file"]').change(function(e){
    let fileName = e.target.files[0].name;
    $('.custom-file-label').html(fileName);
});
// @DESC CHANGE MONTH IN UPCOMING EVENTS DROP-DOWN MENU
$('.dropdown-menu').on('click', 'a', function () {
    $(".selectedMonth").text($(this).text());
    $(".selectedMonth").val($(this).text());
    updateEvents(checkYear(0),  checkMonth()); 
});
// @DESC INCREMENT YEAR IN UPCOMING EVENTS
$('.increaseYear').on('click', () => {
    updateEvents(checkYear(1),  checkMonth());   
});
// @DESC DECREMENT YEAR IN UPCOMING EVENTS
$('.decreaseYear').on('click', () => {
    updateEvents(checkYear(-1),  checkMonth()); 
});
//--------------------------------------------------------
// @FUNCTION YEAR CHANGE
// @DESC INCREMENTS/UPDATES YEAR TO USER SELECTED VALUE
function checkYear(yearIncrement) {
    let yearChange = Number(document.querySelector('.selectedYear').textContent) + yearIncrement; //adjusts year
    document.querySelector('.selectedYear').textContent = yearChange;
    return yearChange;
};
// @FUNCTION MONTH 
// @DESC RETURNS SELECTED MONTH TO JQUERY MONTH/YEAR CLICK LISTENERS
function checkMonth() {
    let monthChange = document.querySelector('.selectedMonth').textContent;
    return monthChange;
};
// @FUNCTION GOOGLE CALENDAR API CALL
// @DESC CALLS GC-API TO PULL UPCOMING EVENTS AND STORES TO ARRAY FOR USE IN UPDATING UPCOMING EVENTS CONTAINER
function start() {
    gapi.client.init({
      // LOGIN INFO FOR GOOGLE CALENDAR API
      'apiKey': 'AIzaSyAuyJmzkVKVrUfGzwy03c0sxdvS7NSqyUY'
    }).then( function () {
      //EVENTS TO RECEIVE FROM API
      gapi.client.load("calendar", "v3", function () {
            let timeMaxDay = new Date();
            let timeMaxMonth = (timeMaxDay.getMonth() +1);
            let timeMaxYear = timeMaxDay.getFullYear();
            let request = gapi.client.calendar.events.list({
                //HIDE userEmail
                "calendarId" : '1lccb191g5jf9058ljrcvljlr4@group.calendar.google.com',
                "timeZone" : "America/Chicago", 
                "singleEvents": true, 
                "timeMin": (new Date()).toISOString(),
                "timeMax": new Date(timeMaxYear + 1, timeMaxMonth, timeMaxDay.getDay()).toISOString(),
                "maxResults": 365, 
                "orderBy": "startTime"
            });
            request.execute(function (resp) {
                let events = resp.items;
                for (i = 0; i < events.length; i++) {
                    let item = events[i];
                    let allDay = (events[i].start.dateTime) ? false : true;
                    let eventStart = allDay ? new Date(events[i].start.date) : new Date(events[i].start.dateTime);
                    let eventEnd = allDay ? new Date(events[i].end.date) : new Date(events[i].end.dateTime);
                    let eventSummary = events[i].summary;
                    exportArray.push({allDay: allDay, eventStart: eventStart, eventEnd: eventEnd, eventSummary: eventSummary });
                }
                // POPULATES UPCOMING EVENTS ELEMENTS BASED ON SELECTED MONTH/YEAR
                updateEvents(eventYear, eventMonth);
            });
        });
    });
};
//--------------------------------------------------------
// @FUNCTION UPDATE UPCOMING EVENTS
// @DESC DETERMINES EVENTS FROM GOOGLE CALENDAR API TO DISPLAY TO USER BASED ON SELECTED MONTH/YEAR
function updateEvents(newYear, newMonth) {
    const exportSummary = exportArray;
    const newMonthNumber = Number((new Date(Date.parse(newMonth +" 1," + newYear)).getMonth())+1);
    newYear = Number(newYear);
    // CHECK EACH ITEM IN EXPORT SUMMARY FOR MONTH/YEAR VALUES THAT CORRESPOND WITH CURRENT MONTH/YEAR
    // STORE VALUES IN ARRAY TO REFERENCE FOR DIV CREATION IN UPCOMING EVENTS
    let eventsArray = []; let tempMonthStart; let tempYearStart; let tempMonthEnd;
    for(let i = 0; i < exportSummary.length; i++) {
        tempMonthStart = Number((exportSummary[i].eventStart.getMonth() + 1));
        tempMonthEnd = Number((exportSummary[i].eventEnd.getMonth() + 1));
        tempYearStart = Number((exportSummary[i].eventStart.getFullYear()));
        tempYearEnd = Number((exportSummary[i].eventEnd.getFullYear()));
        // EVENT CRITERIA: EVENT HAS SAME MONTH/YEAR
        let conditionOne = ((tempMonthStart === newMonthNumber) && (newYear === tempYearStart));
        // EVENT CRITERIA: EVENT STARTS IN PREVIOUS MONTH BUT ENDS IN CURRENT MONTH
        let conditionTwo = ((((tempMonthStart === newMonthNumber) && (tempYearStart === newYear))) || (((tempMonthEnd === newMonthNumber) && (tempYearEnd === newYear))));
        console.log(`${exportSummary[i].eventSummary} ${conditionOne}/${conditionTwo}`)
        if(conditionOne || conditionTwo) {
            eventsArray.push(i);
        }
    }
    $("#eventsList > div").remove();
    if(eventsArray.length !== 0) {
        // Adds events with matching Month/Year as <div> to Upcoming Events
        let dateStringOne; let dateStringTwo; let stringDetails; let eventString;
        for(let j = 0; j < eventsArray.length; j++) {
            let exportItem = exportSummary[eventsArray[j]];
            // @DESC IF EVENTS ARE ALLDAY
            if(!exportItem.allDay) {
                //IF EVENTS START/END SAME DAY, WILL APPEAR AS M/D TIME-TIME: EVENT
                if(exportItem.eventStart.getDate() === exportItem.eventEnd.getDate()) {
                    dateStringOne = `${exportItem.eventStart.getMonth()+1}/${exportItem.eventStart.getDate()}`; 
                    dateStringTwo = ` ${exportItem.eventStart.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})} - ${exportItem.eventEnd.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})}`;
                    stringDetails = ` ${exportItem.eventSummary}`;
                    eventString = `${dateStringOne} ${dateStringTwo}: ${stringDetails}`;
                    $("#eventsList").append(`<div class='singleEvent'>${eventString}</div>`);
                //IF EVENTS START/END DIFFERENT DAYS, WILL APPEAR AS M/D TIME- M/D TIME: EVENT
                } else {
                    dateStringOne = `${exportItem.eventStart.getMonth()+1}/${exportItem.eventStart.getDate()} ${exportItem.eventStart.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})}`; 
                    dateStringTwo = `${exportItem.eventEnd.getMonth()+1}/${exportItem.eventEnd.getDate()} ${exportItem.eventEnd.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})}`;
                    stringDetails = `${exportItem.eventSummary}`;
                    eventString = `${dateStringOne} - ${dateStringTwo}: ${stringDetails}`;
                    $("#eventsList").append(`<div class='singleEvent'>${eventString}</div>`);
                }
            // @DESC IF EVENTS ARE NOT ALLDAY
            } else if(exportItem.allDay) {
                //IF EVENTS START/END SAME DAY, WILL APPEAR AS M/D: EVENT
                if(exportItem.eventStart.getDate()+1 === exportItem.eventEnd.getDate()) {
                    dateStringOne = `${exportItem.eventStart.getMonth()+1}/${exportItem.eventStart.getDate()+1}`;
                    stringDetails = `${exportItem.eventSummary}`;
                    eventString = `${dateStringOne}: ${stringDetails}`;
                    $("#eventsList").append(`<div class='singleEvent'>${eventString}</div>`);                
                //IF EVENTS START/END DIFFERENT DAYS, WILL APPEAR AS M/D-M/D: EVENT
                } else {
                    dateStringOne = `${exportItem.eventStart.getMonth()+1}/${exportItem.eventStart.getDate()+1}`; 
                    dateStringTwo = `${exportItem.eventEnd.getMonth()+1}/${exportItem.eventEnd.getDate()}`;
                    stringDetails = `${exportItem.eventSummary}`;
                    eventString = `${dateStringOne} - ${dateStringTwo}: ${stringDetails}`;
                    $("#eventsList").append(`<div class='singleEvent'>${eventString}</div>`);
                }
            }
        }
    // IF NO EVENTS ARE FOUND, CREATE BLANK DIV
    } else {
        $("#eventsList").append('<div class="singleEvent">We\'re brewing up more events! Check again later!</div>');
    }
};