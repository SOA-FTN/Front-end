import { TourPoint } from "../../tour-authoring/model/tourPoints.model";
import { TourExecutionPosition } from "./TourExecutionPosition.model";

export interface TourExecution{
    id:number;
    userId: number;
    tourId:number;
    status: TourExecutionStatus;
    tourPoints: TourPoint[];
    position: TourExecutionPosition;
}

export enum TourExecutionStatus {
    InProgress = 'InProgress',
    Abandoned = 'Abandoned',
    Completed= 'Completed'
  }