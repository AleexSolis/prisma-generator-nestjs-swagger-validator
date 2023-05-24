import { exec as execCb } from 'child_process';
import { promisify } from 'util';

const exec = promisify(execCb);

export async function checkConflicts(
  current: string,
  base: string,
  other: string,
): Promise<void> {
  try {
    const command = `git merge-file ${current} ${base} ${other}`;
    await exec(command, { shell: '/bin/bash' });
  } catch (error: any) {
    if (error.code === 1) {
      console.log('Merge conflict detected');
    } else {
      throw error;
    }
  }
}
