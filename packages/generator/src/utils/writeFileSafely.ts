import fs from 'fs';
import path from 'path';
import { formatFile } from './formatFile';
import { checkConflicts } from './checkConflicts';
import { WriteFileSafelyProps } from 'src/types';
// import * as diff3 from 'node-diff3'; TODO uninstall

export const writeFileSafely = async ({
  writeLocation,
  content,
  preventOverWrite = false,
  baseOutput = '',
}: WriteFileSafelyProps) => {
  let contentToWrite: string = await formatFile(content);

  fs.mkdirSync(path.dirname(writeLocation), {
    recursive: true,
  });

  const currentExists = fs.existsSync(writeLocation);
  if (!currentExists) {
    fs.writeFileSync(writeLocation, contentToWrite);
  }

  if (preventOverWrite) {
    const tempLocation = path.join(
      baseOutput,
      'temp',
      writeLocation.split('/').at(-1) || '',
    );
    const baseLocation = path.join(
      baseOutput,
      'base',
      writeLocation.split('/').at(-1) || '',
    );

    fs.mkdirSync(path.dirname(tempLocation), {
      recursive: true,
    });
    fs.mkdirSync(path.dirname(baseLocation), {
      recursive: true,
    });

    if (!fs.existsSync(baseLocation)) {
      fs.writeFileSync(baseLocation, contentToWrite);
      return;
    }

    fs.writeFileSync(tempLocation, contentToWrite);

    await checkConflicts(writeLocation, baseLocation, tempLocation);

    fs.writeFileSync(baseLocation, contentToWrite);
    // delete temp file
    fs.unlinkSync(tempLocation);
  }
};
