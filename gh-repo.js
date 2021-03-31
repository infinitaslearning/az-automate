const csv = require('fast-csv');
const util = require('util');
const spawn = require('await-spawn');
const fs = require('fs');
const { stat, mkdir } = require('fs/promises');

const reposCsv = fs.createWriteStream('gh-repos.csv');
const csvStream = csv.format({ headers: true });
csvStream.pipe(reposCsv).on('end', () => { process.exit() });

function format_time(dt) {
  const dtFormat = new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium'
  });
  return dtFormat.format(dt);
}

async function start() {

  // Make sure the data directory exists
  // Not sure if this will work on windows
  const dataDir = await stat('./data');
  if (!dataDir.isDirectory()) {
    await mkdir('./data');
  }


  // gh repo list infinitaslearning -L 300
  // Go for it
  try {
    const stdout = await spawn('gh', ['repo','list','infinitaslearning','-L','300']);
    const projectList = stdout.toString().split('\n');

    projectList.forEach((item) => {
      const fields = item.split('\t');
      const repo =  { repo: fields[0], description: fields[1], visibility: fields[2], lastCommit: fields[3] };
      csvStream.write(repo);
    });

    csvStream.end();
  } catch(e) {
    console.log(e.stderr.toString());
    process.exit();
  }
}

start();