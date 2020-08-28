import moment from 'moment';
const DATE_FORMAT = "DD-MM-YYYY";

module.exports = {
  getDate: (startDate, endDate, rules = []) => {
    const diff = endDate.diff(startDate, 'days');
    const calendar = [];

    for (let i = 0; i <= diff; i++) {
      const day = {};

      day.day = i !== 0 ? startDate.add('days', 1).format(DATE_FORMAT) : startDate.add('days', 0).format(DATE_FORMAT);

      const weekDay = moment(startDate).format('ddd');
      rules.map((rule) => {
        if (rule.type === 'daily') {
          day.intervals = rule.interval;
        }

        if (rule.type === 'weekly') {
          if (rule.days.includes(weekDay)) {
            day.intervals = rule.interval;
          }
        }

        if (rule.type === 'specific') {
          if (moment(rule.day).format(DATE_FORMAT) === day.day) {
            day.intervals = rule.interval;
          }
        }

      });
      calendar.push(day);
    }
    return calendar;
  }
}