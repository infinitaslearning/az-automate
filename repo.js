const csv = require('fast-csv');
const util = require('util');
const spawn = require('await-spawn');
const fs = require('fs');
const { stat, mkdir } = require('fs/promises');

const reposCsv = fs.createWriteStream('repos.csv');
const csvStream = csv.format({ headers: true });
csvStream.pipe(reposCsv).on('end', () => { process.exit() });

function format_time(s) {
  const dtFormat = new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium'
  });
  return dtFormat.format(new Date(s * 1e3));
}

async function shallowClone(sshUrl, project) {
  if (!sshUrl) return '';
  try {
    await spawn('git', ['clone','--depth=1',`${sshUrl}`], { cwd: './data' });
  } catch(e) {
    // Check if the error is it already exists
    const gitError = e.stderr.toString().replace(/[\r\n]+/gm,'');
    const alreadyExists = gitError.includes('already exists');
    if (!alreadyExists) {
      console.log('error', sshUrl, gitError)
      process.exit();
    }
  }

  try {
    const stdout = await spawn('git',['log', '-1', '--format=%at'], { cwd: `./data/${project}` });
    const lastCommit = stdout.toString().replace(/[\r\n]+/gm,'');
    return format_time(lastCommit);
  } catch (e) {
    // An error here is likely that there are no commits
    return 'NO COMMITS';
  }
}

async function projectRepo(project) {
  const stdout = await spawn('az', ['repos','list',`--project=${project.id}`]);
  const repos = JSON.parse(stdout);
  async function getLastCommit(item) {
    let lastCommit = '';
    lastCommit = await shallowClone(item.sshUrl, item.name)
    csvStream.write({ project: project.name, repo: item.webUrl, size: item.size, lastCommit });
  }
  console.log(`Checking out ${repos.length} repositories for ${project.name}`)
  for (const repo of repos) {
    await getLastCommit(repo);
  }
}

async function start() {

  // Make sure the data directory exists
  // Not sure if this will work on windows
  const dataDir = await stat('./data');
  if (!dataDir.isDirectory()) {
    await mkdir('./data');
  }

  // Go for it
  try {
    const stdout = await spawn('az', ['devops','project','list']);
    const projectList = JSON.parse(stdout);
    let projects = projectList.value.map((item) => {
      return { id: item.id, name: item.name }
    });
    // projects = [ projects[0] ]; // useful to test
    console.log(`Retrieving data for ${projects.length} projects ...`);
    for (const project of projects) {
      await projectRepo(project);
    }
    csvStream.end();
  } catch(e) {
    console.log(e.stderr.toString());
    process.exit();
  }
}

start();