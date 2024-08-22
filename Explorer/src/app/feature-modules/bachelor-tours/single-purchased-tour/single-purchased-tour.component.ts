import { Component, OnInit } from '@angular/core';
import {
  BachelorKeyPoint,
  BachelorTour,
  BachelorTourCreation,
  TourPointType,
} from '../model/bachelor-tours';
import { ActivatedRoute, Router } from '@angular/router';
import { MapService } from 'src/app/shared/map/map.service';
import { TourDataService } from '../tour-data.service';
import { ToursBachelorServiceService } from '../tours-bachelor-service.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { use } from 'marked';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import * as L from 'leaflet';

@Component({
  selector: 'xp-single-purchased-tour',
  templateUrl: './single-purchased-tour.component.html',
  styleUrls: ['./single-purchased-tour.component.css'],
})
export class SinglePurchasedTourComponent implements OnInit {
  tour: BachelorTourCreation | undefined;
  tourPoints: BachelorKeyPoint[] = [];
  map: L.Map | undefined;
  userId: number | undefined;
  userRole: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mapService: MapService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.tour = history.state.tour;
    console.log(this.tour);
    this.tourPoints = this.tour?.tourPoints || [];
    if (!this.tour) {
      console.log('wtf :(');
    }
    this.initializeMap();
    this.authService.user$.subscribe((user) => {
      if (user.username) {
        this.userRole = user?.role;
      }
    });
  }

  initializeMap(): void {
    this.map = this.mapService.initMap();

    if (this.map) {
      // Filtriraj tačke po tipu
      const startPoint = this.tourPoints.find(
        (kp) => kp.type === TourPointType.Start
      );
      const endPoint = this.tourPoints.find(
        (kp) => kp.type === TourPointType.End
      );
      const inBetweenPoints = this.tourPoints.filter(
        (kp) => kp.type === TourPointType.InBetween
      );

      // Iscrtavanje markera za sve tačke
      this.tourPoints.forEach((kp) => {
        const color =
          kp.type === TourPointType.Start || kp.type === TourPointType.End
            ? 'red'
            : 'blue';
        this.mapService.addMarker(kp.latitude, kp.longitude, color);
      });

      // Iscrtavanje putanje
      if (startPoint && endPoint) {
        const pathPoints: L.LatLng[] = [
          L.latLng(startPoint.latitude, startPoint.longitude),
          ...inBetweenPoints.map((kp) => L.latLng(kp.latitude, kp.longitude)),
          L.latLng(endPoint.latitude, endPoint.longitude),
        ];

        // Dodaj liniju koja povezuje sve tačke
        this.mapService.drawPath(pathPoints);
      }
    }
  }

  navigateToUpdateTour(): void {
    this.router.navigate(['/update-tour'], { state: { tour: this.tour } });
  }
}
