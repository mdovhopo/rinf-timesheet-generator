import fs from 'fs';

function invalidConfig(missingField) {
  throw new Error(
    `Invalid config file. [${missingField}] is missing. Valid Example can be found at example.config.json`
  );
}

const configPath = 'config.json';

export function loadConfig() {
  if (!fs.existsSync(configPath)) {
    throw new Error(
      `Config file not found. Please create a config file at ${configPath}`
    );
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

  if (!config.fullName) {
    invalidConfig('fullName');
  }

  if (!config.contractId) {
    invalidConfig('contractId');
  }

  if (!config.projectName) {
    invalidConfig('projectName');
  }

  if (!config.firstTimesheetDate) {
    invalidConfig('firstTimesheetDate');
  }

  if (
    !config.tasks ||
    !Array.isArray(config.tasks) ||
    config.tasks.length < 7
  ) {
    console.warn('Tasks must be an array of at least 7 items');
    invalidConfig('tasks');
  }

  return config;
}
