export async function saveTimesheet(workbook, config, tempoReport) {
  const monthName = tempoReport.dateRange.from.toLocaleString('default', {
    month: 'long',
  });
  const year = tempoReport.dateRange.from.getFullYear();
  const fileName = `Timesheet ${year} ${monthName} ${config.fullName}.xlsx`;
  await workbook.xlsx.writeFile(fileName);

  console.log(`Timesheet saved to ${fileName}`);
}
