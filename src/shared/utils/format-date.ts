/*
  Recebe uma data no formato yyyy-MM-dd
  e retorna no formateo dd/MM/yyyy
*/

export const formatDate = (date: string): string => {
  const splittedDate = date.split('-');

  const day = splittedDate[2];
  const month = splittedDate[1];
  const year = splittedDate[0];

  return `${day}/${month}/${year}`;
};
