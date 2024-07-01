/**
 *
 * @param {Date} initialDate
 * @param {Date} reportDate
 * @returns {Number} reportNo
 */

export function getReportNo(initialDate, reportDate) {
  let initMonth = initialDate.getMonth();
  let initYear = initialDate.getFullYear();
  let reportDateMonth = reportDate.getMonth();
  let reportDateYear = reportDate.getFullYear();

  const diffInMonths =
    (reportDateYear - initYear) * 12 + reportDateMonth - initMonth;

  return diffInMonths;
}
