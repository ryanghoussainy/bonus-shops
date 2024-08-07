
/*
Formats a string from the form yyyy-mm-dd to a nicer format.
Example:
formatDate("2021-12-25") -> "25th December 2021"
*/
export function formatDate(dateStr: string) {
    // Get the day
    let day = dateStr.slice(8, 10);
    if (day[0] === "0") {
        day = day[1];
    }

    if (day[1] === "1") {
        day += "st";
    } else if (day[1] === "2") {
        day += "nd";
    } else if (day[1] === "3") {
        day += "rd";
    } else {
        day += "th";
    }

    // Get the month
    let month = dateStr.slice(5, 7);
    switch (month) {
        case "01":
            month = "January";
            break;
        case "02":
            month = "February";
            break;
        case "03":
            month = "March";
            break;
        case "04":
            month = "April";
            break;
        case "05":
            month = "May";
            break;
        case "06":
            month = "June";
            break;
        case "07":
            month = "July";
            break;
        case "08":
            month = "August";
            break;
        case "09":
            month = "September";
            break;
        case "10":
            month = "October";
            break;
        case "11":
            month = "November";
            break;
        case "12":
            month = "December";
            break;
    }

    // Get the year
    const year = dateStr.slice(0, 4);

    return `${day} ${month} ${year}`;
}

/*
Formats a string from the form hh:mm:ss+tt where t is the timezone to hh:mm.
Example:
formatTime("12:30:00+00") -> "12:30"
*/
export function formatTime(timeStr: string) {
    return timeStr.slice(0, 5);
}
