import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BachelorTour,
  BachelorKeyPoint,
  TourPointType,
  BachelorTourCreation,
  CartItem,
} from '../model/bachelor-tours';
import { MapService } from 'src/app/shared/map/map.service';
import * as L from 'leaflet';
import { TourDataService } from '../tour-data.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { ToursBachelorServiceService } from '../tours-bachelor-service.service';

@Component({
  selector: 'xp-single-tour-view',
  templateUrl: './single-tour-view.component.html',
  styleUrls: ['./single-tour-view.component.css'],
})
export class SingleTourViewComponent implements OnInit {
  tour: BachelorTourCreation | undefined;
  startEndKeyPoints: BachelorKeyPoint[] = [];
  map: L.Map | undefined;
  userId: number | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mapService: MapService,
    private tourDataService: TourDataService,
    private tourService: ToursBachelorServiceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.tour = this.tourDataService.getTour();
    console.log(this.tour);
    if (this.tour && this.tour.tourPoints) {
      this.startEndKeyPoints = this.tour.tourPoints.filter((kp) => {
        console.log('Tour Point Type:', kp.type);
        console.log('Comparison with Start:', kp.type === TourPointType.Start);
        console.log('Comparison with End:', kp.type === TourPointType.End);
        return kp.type === TourPointType.Start || kp.type === TourPointType.End;
      });
      this.initializeMap();
    } else {
      console.error('No tour data found.');
    }
  }

  initializeMap(): void {
    this.map = this.mapService.initMap();

    if (this.map) {
      this.startEndKeyPoints.forEach((kp) => {
        const color =
          kp.type === TourPointType.Start || kp.type === TourPointType.End
            ? 'red'
            : 'blue';
        this.mapService.addMarker(kp.latitude, kp.longitude, color);
      });
    }
  }

  addToCart(): void {
    this.authService.user$.subscribe((user) => {
      if (user.username) {
        this.userId = user.id;
      }
    });
    if (this.userId && this.tour) {
      const cartItem: CartItem = {
        tour_id: this.tour.id,
        tour_name: this.tour.name,
        add_or_remove: true,
        tour_price: this.tour.price,
      };

      this.tourService
        .addOrRemoveTourFromCart(this.userId, cartItem)
        .subscribe({
          next: (response) => {
            console.log('Tour added to cart:', response);
          },
          error: (err) => {
            console.error('Error adding tour to cart:', err);
          },
        });
    } else {
      console.error('User ID or tour is missing.');
    }
  }
}
