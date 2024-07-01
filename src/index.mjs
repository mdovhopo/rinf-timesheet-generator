import { readLinesFromStdIn } from './utils.mjs';
import fs from 'fs';

export async function readCsv() {
  const lines = await readLinesFromStdIn();

  return parseTempoReport(lines.join('\n'));
}

export function parseTempoReport(text) {
  const lines = text.split('\n');
  const headers = lines[0].split(',');
  const data = lines.slice(1).map((line, idx) => {
    const values = line.split(',');

    return headers.reduce((acc, header, idx) => {
      acc[header] = values[idx];
      return acc;
    }, {});
  });

  return data;
}

export function reportToTable(report) {
  const dates = Object.keys(report[0]).slice(4);

  const worklogs = dates
    .flatMap((date) =>
      report
        .filter((r) => r[date].length)
        .slice(0, -1)
        .map((r) => [date, `[${r.Key}] ${r.Issue}`, r[date]])
    )
    .map(([date, , time], idx) => [idx + 1, date, getRandomTask(), time]);

  const total = +report.at(-1).Logged;

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

function getRandomTask() {
  const tasks = fs.readFileSync('tasks.txt', 'utf8').split('\n');

  return tasks[Math.floor(Math.random() * tasks.length)];
}

// console.log(reportToTable(await readCsv()));
