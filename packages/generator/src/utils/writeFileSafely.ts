import fs from 'fs';
import path from 'path';
import { formatFile } from './formatFile';
import * as diff3 from 'node-diff3';

export const writeFileSafely = async (writeLocation: string, content: any) => {
  let contentToWrite: string;

  // Check if file exists
  // const fileExists = fs.existsSync(writeLocation);

  // if (fileExists) {
  //   const existingFile = fs.readFileSync(writeLocation, 'utf-8');
  //   const diff = diff3.merge(content, existingFile, existingFile);
  //   // console.dir(diff, { depth: null });
  //   contentToWrite = await formatFile(diff.result.join('\n'));
  // } else {
  contentToWrite = await formatFile(content);
  // }

  fs.mkdirSync(path.dirname(writeLocation), {
    recursive: true,
  });

  fs.writeFileSync(writeLocation, contentToWrite);
};
