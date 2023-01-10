interface Props {
  date: string;
  format: 'yyyy-MM-dd to dd/MM/yyyy' | 'dd/MM/yyyy to yyyy-MM-dd';
}

export const formatDate = ({ date, format }: Props): string => {
  let splittedDate: string[];
  let day: string;
  let month: string;
  let year: string;
  switch (format) {
    case 'yyyy-MM-dd to dd/MM/yyyy':
      splittedDate = date.split('-');

      [year, month, day] = splittedDate;

      return `${day}/${month}/${year}`;

    case 'dd/MM/yyyy to yyyy-MM-dd':
      splittedDate = date.split('/');

      [day, month, year] = splittedDate;

      return `${year}-${month}-${day}`;

    default:
      return '';
  }
};
