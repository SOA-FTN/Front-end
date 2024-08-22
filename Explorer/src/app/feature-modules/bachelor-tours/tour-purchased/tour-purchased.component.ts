import { Component, OnInit } from '@angular/core';
import { BachelorTourCreation } from '../model/bachelor-tours';
import { MarketplaceService } from '../../marketplace/marketplace.service';
import { Router } from '@angular/router';
import { TourDataService } from '../tour-data.service';
import { ToursBachelorServiceService } from '../tours-bachelor-service.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-tour-purchased',
  templateUrl: './tour-purchased.component.html',
  styleUrls: ['./tour-purchased.component.css'],
})
export class TourPurchasedComponent implements OnInit {
  tours: BachelorTourCreation[] = [];
  userId: number;

  constructor(
    private service: ToursBachelorServiceService,
    private router: Router,
    private tourDataService: TourDataService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.auth.user$.subscribe((user) => {
      if (user) {
        this.userId = user.id;
        this.service.getPurchasedTours(this.userId).subscribe({
          next: (tours: BachelorTourCreation[]) => {
            this.tours = tours;
            console.log(tours);
          },
          error: (err: any) => {
            console.log(err);
          },
        });
      }
    });
  }

  viewTour(tour: BachelorTourCreation): void {
    this.router.navigate(['/single-purchased-tour'], {
      state: { tour }, // Prosleđivanje objekta
    });
  }
}
