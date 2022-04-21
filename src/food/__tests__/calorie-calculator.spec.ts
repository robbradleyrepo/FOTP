import {
  DogProfileActivityLevel,
  DogProfileCondition,
} from "../../dogs/profile";
import calorieCalculator from "../calorie-calculator";

describe("calorieCalculator should match the AADF implementation output", () => {
  it("intact", () => {
    const result = calorieCalculator({
      activityLevel: DogProfileActivityLevel.NORMAL,
      ageMonths: 12,
      condition: DogProfileCondition.IDEAL,
      neutered: false,
      weightLb: 15,
    });

    expect(Math.round(result)).toBe(531);
  });

  it("neutered/spayed", () => {
    const result = calorieCalculator({
      activityLevel: DogProfileActivityLevel.NORMAL,
      ageMonths: 12,
      condition: DogProfileCondition.IDEAL,
      neutered: true,
      weightLb: 15,
    });

    expect(Math.round(result)).toBe(472);
  });

  it("new pup", () => {
    const result = calorieCalculator({
      activityLevel: DogProfileActivityLevel.NORMAL,
      ageMonths: 3,
      condition: DogProfileCondition.IDEAL,
      neutered: false,
      weightLb: 15,
    });

    expect(Math.round(result)).toBe(885);
  });

  it("older pup", () => {
    const result = calorieCalculator({
      activityLevel: DogProfileActivityLevel.NORMAL,
      ageMonths: 6,
      condition: DogProfileCondition.IDEAL,
      neutered: true,
      weightLb: 15,
    });

    expect(Math.round(result)).toBe(590);
  });

  it("adult", () => {
    const result = calorieCalculator({
      activityLevel: DogProfileActivityLevel.NORMAL,
      ageMonths: 24,
      condition: DogProfileCondition.IDEAL,
      neutered: false,
      weightLb: 15,
    });

    expect(Math.round(result)).toBe(531);
  });

  it("underweight", () => {
    const result = calorieCalculator({
      activityLevel: DogProfileActivityLevel.NORMAL,
      ageMonths: 12,
      condition: DogProfileCondition.UNDERWEIGHT,
      neutered: true,
      weightLb: 15,
    });

    expect(Math.round(result)).toBe(507);
  });

  it("overweight", () => {
    const result = calorieCalculator({
      activityLevel: DogProfileActivityLevel.NORMAL,
      ageMonths: 12,
      condition: DogProfileCondition.OVERWEIGHT,
      neutered: true,
      weightLb: 15,
    });

    expect(Math.round(result)).toBe(399);
  });

  it("low activity", () => {
    const result = calorieCalculator({
      activityLevel: DogProfileActivityLevel.LOW,
      ageMonths: 12,
      condition: DogProfileCondition.IDEAL,
      neutered: true,
      weightLb: 15,
    });

    expect(Math.round(result)).toBe(413);
  });

  it("high activity", () => {
    const result = calorieCalculator({
      activityLevel: DogProfileActivityLevel.HIGH,
      ageMonths: 12,
      condition: DogProfileCondition.IDEAL,
      neutered: true,
      weightLb: 15,
    });

    expect(Math.round(result)).toBe(590);
  });

  it("working", () => {
    const result = calorieCalculator({
      activityLevel: DogProfileActivityLevel.WORKING,
      ageMonths: 12,
      condition: DogProfileCondition.IDEAL,
      neutered: true,
      weightLb: 15,
    });

    expect(Math.round(result)).toBe(885);
  });
});
