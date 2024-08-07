export function getWeekdays(daysString: string): string {
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    // If only consecutive numbers are selected, return a range: "Monday to Friday"
    const days = daysString.split('').map((day) => parseInt(day));
    const length = days.length;
    if (length > 1) {
        const sorted = days.sort((a, b) => a - b);
        if (sorted[length - 1] - sorted[0] === length - 1) {
            return `${weekdays[0]} to ${weekdays[length - 1]}`;
        }
    }
    // If non-consecutive numbers are selected, return a list: "Monday, Wednesday, and Friday"
    const selectedDays = daysString.split('').map((day) => weekdays[parseInt(day) - 1]);
    const selectedDaysLength = selectedDays.length;
    switch (selectedDaysLength) {
        case 2:
            return selectedDays.join(" and ");
        case 1:
            return selectedDays[0];
        default:
            return selectedDays.slice(0, selectedDaysLength - 1).join(", ") + ", and " + selectedDays[selectedDaysLength - 1];
    }
}
