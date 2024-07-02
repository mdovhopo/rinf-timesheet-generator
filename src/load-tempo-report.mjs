import fs from 'fs';

/**
 * @typedef {import('./types').GenerateReportOptions} GenerateReportOptions
 */

function tempoCsvReportToArray(text) {
  const lines = text.split('\n');
  const headers = lines[0].split(',');

  // parse csv
  const data = lines.slice(1).map((line) => {
    const values = line.split(',');

    return headers.reduce((acc, header, idx) => {
      acc[header] = values[idx];
      return acc;
    }, {});
  });

  // remove total entry
  return data.slice(0, -1);
}

function reportToTable(report, replacementTasks) {
  const dates = Object.keys(report[0]).slice(4);

  // convert to table
  const worklogs = dates
    .flatMap((date) =>
      report
        .filter((r) => r[date].length)
        .map((r) => [date, `[${r.Key}] ${r.Issue}`, r[date]])
    )
    .map(([date, , time], idx) => [
      idx + 1,
      date,
      getRandomItem(replacementTasks),
      time,
    ]);

  const total = worklogs.reduce((acc, [, , , time]) => acc + +time, 0);

  return {
    header: ['No.', 'Date', 'Services rendered', 'Number'],
    table: worklogs,
    totals: {
      total,
      byTask: worklogs.reduce((acc, [, , task, time]) => {
        acc[task] = (acc[task] || 0) + +time;
        return acc;
      }, {}),
    },
    dateRange: {
      from: new Date(worklogs[0][1] + ' 12:00:00'),
      to: new Date(worklogs.at(-1)[1] + ' 12:00:00'),
    },
    footer: ['TOTAL', '', '', total],
  };
}

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function addBonusTimeToReport(report, bonusHours) {
  const maxHoursPerDay = 20;

  const hoursToAdd = Array.from(
    { length: Math.floor(bonusHours / maxHoursPerDay) },
    () => maxHoursPerDay
  );

  const leftoverHours = bonusHours % maxHoursPerDay;
  if (leftoverHours > 0) {
    hoursToAdd.push(leftoverHours);
  }

  const tasks = hoursToAdd.map((hours, idx) => ({
    task: `Bonus ${idx + 1}`,
    hours,
  }));

  const dates = Object.keys(report[0]).slice(4);

  const bonusWorklogs = [];

  // add bonus tasks to empty days but no more then {maxHoursPerDay} hours per day
  for (const date of dates) {
    if (tasks.length === 0) {
      break;
    }

    const totalForDate = report.reduce((acc, r) => {
      if (r.Issue === '') {
        return acc;
      }

      const log = r[date] === ' ' ? 0 : +r[date];
      return acc + log;
    }, 0);

    if (totalForDate > 0) {
      continue;
    }

    const { task, hours } = tasks.shift();

    bonusWorklogs.push({
      '': '',
      Issue: task,
      Key: 'Bonus',
      Logged: hours.toString(),
      ...dates.reduce((acc, d) => {
        acc[d] = d === date ? hours.toString() : '';
        return acc;
      }, {}),
    });
  }

  // add bonus to the start of the report to not messup the total
  report.unshift(...bonusWorklogs);
}

function printReportSummary(table) {
  console.log('--------- Report Summary ---------');
  console.log(
    `Report from ${table.dateRange.from
      .toISOString()
      .slice(0, 10)} to ${table.dateRange.to.toISOString().slice(0, 10)}`
  );
  console.log(`Total hours: ${table.totals.total}`);
  console.log('----------------------------------');
}

/**
 *
 * @param {GenerateReportOptions} options
 * @param {*} config
 * @returns
 */

export function loadTempoReport(options, config) {
  if (!fs.existsSync(options.tempoFile)) {
    throw new Error(`File does not exist: ${options.tempoFile}`);
  }

  const csv = fs.readFileSync(options.tempoFile, 'utf8');
  const report = tempoCsvReportToArray(csv, config.tasks);
  if (options.bonusHours > 0) {
    addBonusTimeToReport(report, options.bonusHours);
  }

  const table = reportToTable(report, config.tasks);

  printReportSummary(table);

  return table;
}
