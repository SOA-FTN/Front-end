import { Component } from '@angular/core';
import { Tour } from '../../tour-authoring/tour/model/tour.model';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';
import { TokenStorage } from 'src/app/infrastructure/auth/jwt/token.service';
import { Router } from '@angular/router';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-my-tours',
  templateUrl: './my-tours.component.html',
  styleUrls: ['./my-tours.component.css']
})
export class MyToursComponent {

  tours: Tour[] = [];
  selectedTour: Tour;
  page: number = 1;
  pageSize: number = 5;
  tourCounter: number;
  shouldAddPoint: boolean = false;

  shouldAddObject: boolean = false;


  constructor(
    private service: TourAuthoringService,
    private router: Router,
    private tokenStorage: TokenStorage,
  ) {}
  ngOnInit(): void {
    this.loadTours()
  }

  loadTours() {
    const userId = this.tokenStorage.getUserId();
    console.log('Id usera:' +userId)
    this.service.getTourByGuide(userId, this.page, this.pageSize).subscribe({
      next: (result: PagedResults<Tour>) => {
        this.tours = result.results.filter(tour=>tour.status !== 'Archived');
        console.log('Sadržaj result.results:', result.results);
      },
      error(err: any) {
        console.log(err);
      },
    });
  }

  
  startTour(tourId: number | undefined) : void{
    this.router.navigate(['purchasedTours/' + tourId]);
  }
  showTourDetails(tourId: number | undefined): void {
    this.router.navigate(['purchasedTours', tourId]);
  
  }
}
