import { DogProfile, DogProfileActivityLevel } from "../dogs/profile";

// AADF uses a 1-10 range where anything <4 or >=7 requires vet intervention.
// not sure what we should do.
enum ConditionRating {
  OVERWEIGHT = 7,
  CHUNKY = 6,
  IDEAL = 5,
  UNDERWEIGHT = 4,
}

export type CalorieCalculatorInput = Pick<
  DogProfile,
  "activityLevel" | "ageMonths" | "neutered" | "condition" | "weightLb"
>;

const LB_TO_KG = 0.45359237;

const calorieCalculator = ({
  activityLevel,
  ageMonths,
  condition,
  neutered,
  weightLb,
}: CalorieCalculatorInput) => {
  const weightKg = weightLb * LB_TO_KG;

  // Ideal weight
  const weightIdeal =
    (weightKg / 100) * (100 - (ConditionRating[condition] - 5) * 10);
  const rerIdeal = 70 * Math.pow(weightIdeal, 0.75);

  // Activity
  let eFactor = 1;
  if (activityLevel === DogProfileActivityLevel.LOW) {
    eFactor = 0.875;
  } else if (activityLevel === DogProfileActivityLevel.HIGH) {
    eFactor = 1.25;
  } else if (activityLevel === DogProfileActivityLevel.WORKING) {
    eFactor = 1.875;
  }

  let aFactor = 0;
  // Age and neutered
  if (ageMonths < 4) {
    eFactor = (eFactor + 2) / 3;
    aFactor = 3;
  } else if (ageMonths < 12) {
    eFactor = (eFactor + 1) / 2;
    aFactor = 2;
  } else {
    if (!neutered) {
      aFactor = 1.8;
    } else {
      aFactor = 1.6;
    }
  }

  return rerIdeal * eFactor * aFactor;
};

export default calorieCalculator;
