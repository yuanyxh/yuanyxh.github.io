import simpleGit from 'simple-git';
import childProcess from 'node:child_process';

const getBranch = async () => {
  const git = simpleGit();
  const status = await git.status();
  return status.tracking;
}

const prePush = async () => {
  try {
    const branch = await getBranch();

    console.log(branch);

    if (branch === 'master') {
      let result =  childProcess.execSync('pnpm run clean');
      result = childProcess.execSync('pnpm run build');
      result = childProcess.execSync('pnpm run clean');
    }

  } catch(err) {
    console.log(err);

    process.exit(-1)
  }
}

prePush()
