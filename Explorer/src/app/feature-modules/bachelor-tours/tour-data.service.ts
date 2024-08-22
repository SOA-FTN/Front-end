import { Injectable } from '@angular/core';
import { BachelorTourCreation } from './model/bachelor-tours';

@Injectable({
  providedIn: 'root',
})
export class TourDataService {
  private tour: BachelorTourCreation | undefined;

  setTour(tour: BachelorTourCreation): void {
    this.tour = tour;
  }

  getTour(): BachelorTourCreation | undefined {
    return this.tour;
  }

  clearTour(): void {
    this.tour = undefined;
  }
}
