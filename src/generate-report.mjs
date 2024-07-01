import { loadConfig } from './load-config.mjs';
import { loadTempoReport } from './load-tempo-report.mjs';
import { buildReportFromTemplate } from './build-report-from-template.mjs';
import { saveTimesheet } from './save-timesheet.mjs';

export async function generateReport(tempoReportPath) {
  const config = loadConfig();
  const tempoReport = loadTempoReport(tempoReportPath, config);

  const workbook = await buildReportFromTemplate(tempoReport, config);

  await saveTimesheet(workbook, config, tempoReport);
}
