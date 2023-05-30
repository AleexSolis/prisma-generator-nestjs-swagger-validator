import { Field } from 'src/types';

export const formatDate = (fild: Field) => {
  const normalizeDate =
      fild.documentation
        ?.replace(/[()-]/g, '')
        .split(/(\d+)/)
        .filter((seg: string) => seg !== '') || '',
    date =
      (normalizeDate[1].length === 8 &&
        !isNaN(+normalizeDate[1]) &&
        normalizeDate[1]) ||
      '';

  return new Date(
    +date.slice(0, 4),
    +date.slice(4, 6) - 1,
    +date.slice(6, 8),
  ).toISOString();
};
