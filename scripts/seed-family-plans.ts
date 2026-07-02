import 'reflect-metadata';

import { PostgresDataSource } from '../src/shared/typeorm';
import { Plan } from '../src/modules/plans/entities/plan';
import { PlanRegion } from '../src/modules/plans/entities/plan-region';

const REGIONS = ['br', 'pt'];

interface SeedPlan {
  name: string;
  description: string;
  price: number;
  maxDependents: number;
}

const familyPlans: SeedPlan[] = [
  {
    name: 'Plano Familiar 1',
    description: 'Plano familiar para até 3 dependentes.',
    price: 9900,
    maxDependents: 3,
  },
  {
    name: 'Plano Familiar 2',
    description: 'Plano familiar para até 5 dependentes.',
    price: 14900,
    maxDependents: 5,
  },
];

async function seedOne(seedPlan: SeedPlan): Promise<void> {
  const planRepository = PostgresDataSource.getRepository(Plan);
  const planRegionRepository = PostgresDataSource.getRepository(PlanRegion);

  const existingPlan = await planRepository.findOne({
    where: { name: seedPlan.name },
  });

  if (existingPlan) {
    console.log(
      `[skip] Plan "${seedPlan.name}" already exists (id: ${existingPlan.id}).`,
    );
    return;
  }

  const plan = planRepository.create({
    name: seedPlan.name,
    description: seedPlan.description,
    price: seedPlan.price,
    stripePriceId: null,
    sellerPart: null,
    type: 'family',
    maxDependents: seedPlan.maxDependents,
    isPro: true,
  });

  const savedPlan = await planRepository.save(plan);

  await planRegionRepository.save(
    REGIONS.map(region =>
      planRegionRepository.create({
        planId: savedPlan.id,
        region,
      }),
    ),
  );

  console.log(
    `[created] Plan "${savedPlan.name}" (id: ${
      savedPlan.id
    }) with regions: ${REGIONS.join(', ')}.`,
  );
}

async function seedFamilyPlans(): Promise<void> {
  await PostgresDataSource.initialize();

  // Sequential to keep log output ordered and avoid connection-pool contention.
  await familyPlans.reduce(
    (previous, seedPlan) => previous.then(() => seedOne(seedPlan)),
    Promise.resolve(),
  );
}

seedFamilyPlans()
  .then(async () => {
    console.log('Seed finished successfully.');
    await PostgresDataSource.destroy();
    process.exit(0);
  })
  .catch(async error => {
    console.error('Seed failed:', error);
    if (PostgresDataSource.isInitialized) {
      await PostgresDataSource.destroy();
    }
    process.exit(1);
  });
