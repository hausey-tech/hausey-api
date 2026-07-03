import { Patient } from '../../entities/patient';
import { PatientDependent } from '../../../dependents/entities/patient-dependent';

export type AnnotatedPatient = Patient & {
  role: 'titular' | 'dependente' | 'individual';
  holder: { id: string; name: string } | null;
};

export function annotatePatientsWithFamilyRole(
  patients: Patient[],
  dependentRows: PatientDependent[],
): AnnotatedPatient[] {
  const holderByDependentPatientId = new Map<
    string,
    { id: string; name: string }
  >();

  dependentRows.forEach(row => {
    if (row.dependentPatientId && row.holder) {
      holderByDependentPatientId.set(row.dependentPatientId, {
        id: row.holder.id,
        name: row.holder.name,
      });
    }
  });

  return patients.map(patient => {
    const holder = holderByDependentPatientId.get(patient.id) ?? null;

    if (holder) {
      return {
        ...patient,
        role: 'dependente',
        holder,
      };
    }

    if (patient.plan?.type === 'family') {
      return {
        ...patient,
        role: 'titular',
        holder: null,
      };
    }

    return {
      ...patient,
      role: 'individual',
      holder: null,
    };
  });
}
