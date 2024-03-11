export interface TourCharacteristic {
  distance: number;
  duration: number;
  transportType: TransportType;
}

export enum TransportType {
  Walking = 'Walking',
  Driving = 'Driving',
  Cycling = 'Cycling',
}
