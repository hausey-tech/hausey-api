import { groupArrayByKey } from '../../../shared/utils/group-array-by-key';
import { ProfessionalSpecialty } from '../entities/professional-specialty';

interface GroupedSpecialty {
  [group: string]: ProfessionalSpecialty[];
}

export interface FormattedSpecialty {
  group: string;
  specialties: ProfessionalSpecialty[];
}

export const groupSpecialtiesByGroup = (
  specialties: ProfessionalSpecialty[],
) => {
  const groupedSpecialties: GroupedSpecialty[] = groupArrayByKey(
    specialties,
    'group',
  );

  const formattedSpecialties: FormattedSpecialty[] = Object.keys(
    groupedSpecialties,
  ).map(specialty => ({
    group: specialty,
    specialties: groupedSpecialties[specialty],
  }));

  return formattedSpecialties;
};
