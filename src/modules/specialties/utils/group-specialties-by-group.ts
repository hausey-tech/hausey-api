import { groupArrayByKey } from '../../../shared/utils/group-array-by-key';
import { Specialty } from '../entities/specialty';

interface GroupedSpecialty {
  [group: string]: Specialty[];
}

export interface FormattedSpecialty {
  group: string;
  specialties: Specialty[];
}

export const groupSpecialtiesByGroup = (specialties: Specialty[]) => {
  const groupedSpecialties: GroupedSpecialty = groupArrayByKey(
    specialties,
    'group',
  );

  const formattedSpecialties: FormattedSpecialty[] = Object.keys(
    groupedSpecialties,
  ).map(specialty => ({
    group: specialty,
    specialties: groupedSpecialties[specialty].sort((a, b) =>
      a.name.localeCompare(b.name),
    ),
  }));

  return formattedSpecialties;
};
