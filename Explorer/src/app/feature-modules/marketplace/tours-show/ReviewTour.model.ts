import { TourPoint } from "../../tour-authoring/model/tourPoints.model";
import { TourCharacteristic } from "../../tour-authoring/tour/model/tourCharacteristic.model";
import { TourReview } from "../model/tourReview.model";


export interface ReviewTour {
  id?: number;

  name: string;
  description: string;
  price: number;
  status: Status;
  difficultyLevel: DifficultyLevel;
  guideId: number;
  tags: string[];
  tourPoints: TourPoint[];
  tourCharacteristics: TourCharacteristic[];
  tourReviews: TourReview[];
}

export enum Status {
  Draft = 'Draft',
  InProgress = 'InProgress',
}

export enum DifficultyLevel {
  Easy = 'Easy',
  Medium = 'Moderate',
  Hard = 'Difficult',
}
