import express from 'express';
import fs from 'fs';
import { weeklyScheduler, dailyScheduler, specificScheduler, safeJsonParse } from '../helpers/ruleHelper';
import { getDate } from '../helpers/dayHelper';
import moment from 'moment';

const routes = express.Router();

routes.post('/', (req, res) => {
  const { interval, is_weekly, is_daily, week_days, day } = req.body;
  let rule = {};

  if (is_weekly && is_daily) {
    return res.status(400).send({ 'error': 'only one mode is allowed, choose is_daily or is_weekly!' });
  }

  if (is_weekly) {
    rule = weeklyScheduler(week_days, interval, res);
  }

  if (is_daily) {
    rule = dailyScheduler(interval, res);
  }

  if (!is_daily && !is_weekly) {
    rule = specificScheduler(day, interval, res);
  }

  writeRule(rule, res);
  return res.status(201).send({ 'resp': 'OK' });

});

routes.get('/delete', (req, res) => {
  const id = req.query.id;
  const rulesFile = fs.readFileSync('./rules.json');
  const rules = safeJsonParse(rulesFile);

  if (!(!!id)) {
    return res.status(400).send({ 'error': 'Id must be provided' });
  }

  const rulesBeforeSize = rules.length;

  rules.forEach((rule, index) => {
    if (rule.id === id) {
      rules.splice(index, 1);
    };
  });

  const rulesAfterSize = rules.length;

  if (rulesAfterSize === rulesBeforeSize) {
    return res.status(400).send({ 'error': 'Rule not found' });
  }

  saveRules(rules, res);
  return res.send({ 'resp': 'OK' });
});

routes.get('/', (req, res) => {
  const rulesFile = fs.readFileSync('./rules.json');
  const rules = safeJsonParse(rulesFile);

  res.send({ rules });
});

routes.get('/available', (req, res) => {
  const startDate = moment(req.query.sd);
  const endDate = moment(req.query.ed);

  if (!(!!startDate)) {
    return res.status(400).send({ 'error': 'query param sd must exist' });
  }

  if (!(!!endDate)) {
    return res.status(400).send({ 'error': 'query param sd must exist' });
  }

  const rulesFile = fs.readFileSync('./rules.json');
  const rules = safeJsonParse(rulesFile);

  const calendar = getDate(startDate, endDate, rules);


  return res.send(calendar);
});

function writeRule(rule, res) {
  const rulesFile = fs.readFileSync('./rules.json');
  const rules = safeJsonParse(rulesFile);
  rules.push(rule);
  fs.writeFile('./rules.json', JSON.stringify(rules, null, 2), (err) => {
    if (err) {
      return res.status(400).send({ 'error': 'Error while saving rule!' });
    }
  });
}

function saveRules(rules, res) {
  fs.writeFile('./rules.json', JSON.stringify(rules, null, 2), (err) => {
    if (err) {
      return res.status(400).send({ 'error': 'Error while saving rule!' });
    }
  });
}

export default routes;


