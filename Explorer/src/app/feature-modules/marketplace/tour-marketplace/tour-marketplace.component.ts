import { Component, OnInit } from '@angular/core';
import { MarketplaceService } from '../marketplace.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Tour } from '../../tour-authoring/tour/model/tour.model';
import { NavigationExtras, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import {
  BachelorTour,
  BachelorTourCreation,
} from '../../bachelor-tours/model/bachelor-tours';
import { TourDataService } from '../../bachelor-tours/tour-data.service';

@Component({
  selector: 'xp-tour-marketplace',
  templateUrl: './tour-marketplace.component.html',
  styleUrls: ['./tour-marketplace.component.css'],
})
export class TourMarketplaceComponent implements OnInit {
  tours: BachelorTourCreation[] = [];
  toursDiscMap = new Map<number, number>();

  constructor(
    private service: MarketplaceService,
    private router: Router,
    private tourDataService: TourDataService
  ) {}

  ngOnInit(): void {
    this.service.getPublishedGRPCTours().subscribe({
      next: (tours: BachelorTourCreation[]) => {
        this.tours = tours;
        console.log(tours);
        //this.getDiscounts();
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  showTourDetails(tour: BachelorTourCreation): void {
    this.tourDataService.clearTour();
    this.tourDataService.setTour(tour);
    this.router.navigate(['single-tour-overview']);
  }

  viewMap(idTour: number | undefined): void {
    if (idTour !== undefined) {
      this.service.viewForTourist.emit();
      this.router.navigate([`/tourMapFirstPoint/${idTour}`]);
    } else {
      console.error('ID nije definisan.');
    }
  }
  /*
  getDiscounts(): void {
    const observables = this.tours.map((tour) =>
      this.service.getTourDiscount(tour.id || -1)
    );

    forkJoin(observables).subscribe({
      next: (results: number[]) => {
        results.forEach((result, index) => {
          const tour = this.tours[index];

          this.toursDiscMap.set(tour.id || -1, result);
        });
      },
      error: (err) => {
        console.error('Error: ', err);
      },
    });
  }

  getDisc(id: any, price: any): number {
    const disc = this.toursDiscMap.get(id);
    if (disc !== undefined) {
      return Math.floor(((100 - disc) * price) / 100);
    } else {
      return price;
    }
  }
    */
}
