import { DMMF } from '@prisma/generator-helper';

export const isAnnotatedWith = (
  instance: DMMF.Field | DMMF.Model,
  annotation: RegExp,
): boolean => {
  const { documentation = '' } = instance;
  return annotation.test(documentation);
};
