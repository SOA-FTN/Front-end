import { Component, OnInit } from '@angular/core';
import {
  BachelorTourCreation,
  BachelorUpdateTour,
} from '../model/bachelor-tours';
import { ToursBachelorServiceService } from '../tours-bachelor-service.service';
import { Router } from '@angular/router';
import { TourDataService } from '../tour-data.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-tours-author',
  templateUrl: './tours-author.component.html',
  styleUrls: ['./tours-author.component.css'],
})
export class ToursAuthorComponent implements OnInit {
  tours: BachelorUpdateTour[] = [];
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
        this.service.getAuthorTours(this.userId).subscribe({
          next: (tours: BachelorUpdateTour[]) => {
            this.tours = tours;
            console.log(tours);
            //this.getDiscounts();
          },
          error: (err: any) => {
            console.log(err);
          },
        });
      }
    });
  }

  viewTour(tour: BachelorUpdateTour): void {
    this.router.navigate(['/single-purchased-tour'], {
      state: { tour }, // Prosleđivanje objekta
    });
  }
}
