#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { generateReport } from './src/generate-report.mjs';

yargs(hideBin(process.argv))
  .command(
    'generate-from-tempo',
    'Generate report from tempo timesheet',
    (arg) => generateReport(arg.argv.tempoFile)
  )
  .option('tempo-file', {
    type: 'string',
    description: 'Location of the tempo timesheet file',
    required: true,
  })

  .demandCommand(1)
  .parse();
