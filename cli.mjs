#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { generateReport } from './src/generate-report.mjs';

yargs(hideBin(process.argv))
  .command(
    'generate-from-tempo',
    'Generate report from tempo timesheet',
    (arg) => {
      console.log();
      return generateReport({
        tempoFile: arg.argv.tempoFile,
        bonusHours: arg.argv.bonusHours,
      });
    }
  )
  .option('tempo-file', {
    type: 'string',
    description: 'Location of the tempo timesheet file',
    required: true,
  })
  .option('bonus-hours', {
    type: 'number',
    description:
      'Bonus hours to add to the total. Bonus hours will be added to a random date in the timesheet, but no more then 24 hours per day in total',
    default: 0,
  })
  .demandCommand(1)
  .parse();
