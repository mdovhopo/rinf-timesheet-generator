import excel from 'exceljs';
import { getReportNo } from './get-report-no.mjs';
import path from 'path';

function formatDate(date) {
  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
}

function setHeaderInfo(worksheet, config, data) {
  const reportNo = getReportNo(
    new Date(config.firstTimesheetDate),
    data.dateRange.from
  );
  worksheet.getCell(
    'A2'
  ).value = `ACTIVITY REPORT NR. ${reportNo}  ISSUED ON THE BASIS OF CONTRACT ${config.contractId}`;
  worksheet.getCell('A4').value = `PERIOD: ${formatDate(
    data.dateRange.from
  )}-${formatDate(data.dateRange.to)}`;
  worksheet.getCell('A5').value = `CONTRACTOR: ${config.fullName}`;
  worksheet.getCell('A6').value = `PROJECT NAME: ${config.projectName}`;
}

function setBorder(cell, mode = 'all') {
  const border = { style: 'thin', color: { indexed: 8 } };

  cell.border =
    mode === 'all'
      ? { left: border, top: border, right: border, bottom: border }
      : { [mode]: border };
}

function setValue(cell, { value, border }) {
  cell.value = value;
  if (border) {
    setBorder(cell, border);
  }
}

function setTotals(worksheet, tempoReport) {
  const offsetFromTop = 9;

  setBorder(worksheet.getCell(`A${offsetFromTop - 1}`));
  setBorder(worksheet.getCell(`B${offsetFromTop - 1}`));

  const allTasks = Object.entries(tempoReport.totals.byTask);

  allTasks.forEach(([task, time], idx) => {
    const taskCell = worksheet.getCell(`A${idx + offsetFromTop}`);
    setValue(taskCell, { value: task, border: 'right' });

    const timeCell = worksheet.getCell(`B${idx + offsetFromTop}`);
    setValue(timeCell, { value: time, border: 'right' });
  });

  const totalCell = worksheet.getCell(`A${allTasks.length + offsetFromTop}`);
  setValue(totalCell, { value: 'Grand Total', border: 'all' });

  const totalValueCell = worksheet.getCell(
    `B${allTasks.length + offsetFromTop}`
  );
  setValue(totalValueCell, { value: tempoReport.totals.total, border: 'all' });
}

function setWorklogs(worksheet, tempoReport) {
  const firstIndex = 9;

  tempoReport.table.forEach(([entryNo, date, task, time], idx) => {
    const entryNoCell = worksheet.getCell(`A${idx + firstIndex}`);
    setValue(entryNoCell, { value: entryNo, border: 'right' });

    const dateCell = worksheet.getCell(`B${idx + firstIndex}`);
    setValue(dateCell, { value: date, border: 'right' });

    const taskCell = worksheet.getCell(`C${idx + firstIndex}`);
    setValue(taskCell, { value: task, border: 'right' });

    const timeCell = worksheet.getCell(`D${idx + firstIndex}`);
    setValue(timeCell, { value: time, border: 'right' });
  });

  const totalCell = worksheet.getCell(
    `A${tempoReport.table.length + firstIndex}`
  );
  setValue(totalCell, { value: 'TOTAL', border: 'all' });

  setBorder(worksheet.getCell(`B${tempoReport.table.length + firstIndex}`));
  setBorder(worksheet.getCell(`C${tempoReport.table.length + firstIndex}`));

  const totalValueCell = worksheet.getCell(
    `D${tempoReport.table.length + firstIndex}`
  );
  setValue(totalValueCell, { value: tempoReport.totals.total, border: 'all' });
}

export async function buildReportFromTemplate(report, config) {
  const workbook = new excel.Workbook();

  const base = path.dirname(new URL(import.meta.url).pathname);
  await workbook.xlsx.readFile(base + '/timesheet-template.xlsx');

  setHeaderInfo(workbook.worksheets[0], config, report);
  setHeaderInfo(workbook.worksheets[1], config, report);

  setTotals(workbook.worksheets[0], report);

  setWorklogs(workbook.worksheets[1], report);

  return workbook;
}
