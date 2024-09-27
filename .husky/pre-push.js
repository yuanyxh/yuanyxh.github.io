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

    if (branch === 'origin/master') {
      childProcess.execSync('pnpm run clean');

      const result = childProcess.execSync('pnpm run build');
      console.log(result.toString());

      childProcess.execSync('pnpm run clean');
    }

  } catch(err) {
    console.log(err);

    process.exit(-1)
  }
}

prePush()
