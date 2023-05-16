import { writeFileSafely } from './writeFileSafely';

export const writeBarrelFile = async (path: string, files: string[]) => {
  const content = files
    .map((file) => `export * from './${file.replace('.ts', '')}'`)
    .join('\n');
  await writeFileSafely(path, content);
};
