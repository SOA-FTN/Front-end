import { Tour } from '../../tour-authoring/tour/model/tour.model';

export interface TourReview {
  id?: number;
  grade: number;
  comment: string;
  attendanceDate: Date;
  reviewDate: Date;
  images: string[];
  touristId: number;
  tourId: number;
}
