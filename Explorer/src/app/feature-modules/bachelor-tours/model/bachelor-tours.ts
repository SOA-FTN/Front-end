export enum Status {
  Draft = 'Draft',
  Archived = 'Archived',
  Published = 'Published',
}

export enum DifficultyLevel {
  Easy = 'Easy',
  Medium = 'Moderate',
  Hard = 'Difficult',
}
export enum TourPointType {
  Start = 'Start',
  End = 'End',
  InBetween = 'InBetween',
}

export interface BachelorTourCreation {
  id: 0;
  name: string;
  description: string;
  price: number;
  status: Status;
  difficultyLevel: DifficultyLevel;
  userId: number;
  tourPoints: BachelorKeyPoint[];
}

export interface BachelorKeyPoint {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
  type: TourPointType;
}

export interface BachelorTour {
  id: number;
  description: string;
  price: number;
  status: Status;
  difficultyLevel: DifficultyLevel;
}

export interface CartItem {
  tour_id: number;
  tour_name: string;
  tour_price: number;
  add_or_remove: boolean;
}

export interface BachelorShoppingCart {
  id: number;
  user_id: number;
  cart_items: CartItem[];
  total_price: number;
}

export interface BachelorUpdateTourPoint {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
  type: TourPointType;
}

export interface BachelorUpdateTour {
  id: number;
  name: string;
  description: string;
  price: number;
  status: Status;
  difficultyLevel: DifficultyLevel;
  userId: number;
  tourPoints: BachelorUpdateTourPoint[];
}
