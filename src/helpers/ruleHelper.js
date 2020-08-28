import moment from 'moment';
import CryptoJS from 'crypto-js';
const DATE_FORMAT = "YYYY-MM-DD";

function generateId(){
  var salt = CryptoJS.lib.WordArray.random(128/8);
  return CryptoJS.PBKDF2("senha", salt, { keySize: 512/32, iterations: 10 }).toString();     
}

module.exports = {
  weeklyScheduler : (days, interval, res) => {
    const rule = {};
    if (!Array.isArray(interval)) {
      return res.status(400).send({ 'error': 'Error, interval must be an array' });
    }
  
    if (!Array.isArray(days)) {
      return res.status(400).send({ 'error': 'Error, days must be an array' });
    }
  
    rule.id = generateId();
    rule.type = "weekly",
    rule.days = days;
    rule.interval = interval;
  
    return rule;
  },

  dailyScheduler: (interval, res) => {
    const rule = {};
  
    if (!Array.isArray(interval)) {
      return res.status(400).send({ 'error': 'Error, interval must be an array' });
    }
    
    rule.id = generateId();
    rule.type = "daily",
    rule.interval = interval;
  
    return rule;
  },
  
  specificScheduler: (day, interval, res) => {
    const rule = {};
  
    if (!Array.isArray(interval)) {
      return res.status(400).send({ 'error': 'Error, interval must be an array' });
    }
  
    const intervalParsed = moment(day, DATE_FORMAT);
  
    if (!(!!intervalParsed.isValid())) {
      return res.status(400).send({ 'error': 'Error, day must be valid date' });
    }
    
    rule.id = generateId();
    rule.type = "specific";
    rule.day = intervalParsed.format(DATE_FORMAT);
    rule.interval = interval;
  
    return rule;
  },
  
  safeJsonParse: (str) => {
    try {
        return JSON.parse(str);
    } catch (err) {
        return [];
    }
  }
}