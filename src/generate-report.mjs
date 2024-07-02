import { loadConfig } from './load-config.mjs';
import { loadTempoReport } from './load-tempo-report.mjs';
import { buildReportFromTemplate } from './build-report-from-template.mjs';
import { saveTimesheet } from './save-timesheet.mjs';

/**
 * @typedef {import('./types').GenerateReportOptions} GenerateReportOptions
 */

/**
 *
 * @param {GenerateReportOptions} options
 */

export async function generateReport(options) {
  const config = loadConfig();
  const tempoReport = loadTempoReport(options, config);

  const workbook = await buildReportFromTemplate(tempoReport, config);

  await saveTimesheet(workbook, config, tempoReport);
}
