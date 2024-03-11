export enum DifficultyLevel {
  EASY = 'Easy',
  MODERATE = 'Moderate',
  DIFFICULT = 'Difficult'
}

export interface Preferences {
  id?: number;
  userId: number;
  preferredDifficulty: DifficultyLevel;
  transportationPreferences: number[];
  interestTags: string[];
}
