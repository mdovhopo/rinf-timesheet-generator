# A small tool to generate timesheet report.

## 1. Prep

1. clone repo
2. nvm use
3. npm ci
4. download the timesheet from Tempo as csv (lets assume we name it `july-report.csv` and place it in the root of the project). Note: report should be in csv format from tempo. For that you need to click ... on the top right corner of the report and select 'csv report data'
 
## 2. Generate report

```bash
./cli.mjs generate-from-tempo --tempo-file ./july-report.csv
```

This will produce a file and store it in the root of the project with the name as xlsx file.