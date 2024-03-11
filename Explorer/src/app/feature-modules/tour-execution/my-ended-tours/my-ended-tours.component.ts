import { Component, OnInit } from '@angular/core';
import { Tour } from '../../tour-authoring/tour/model/tour.model';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';
import { Router } from '@angular/router';
import { TokenStorage } from 'src/app/infrastructure/auth/jwt/token.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-my-ended-tours',
  templateUrl: './my-ended-tours.component.html',
  styleUrls: ['./my-ended-tours.component.css']
})
export class MyEndedToursComponent implements OnInit{


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
        this.tours = result.results;
        console.log('Sadržaj result.results:', result.results);
      },
      error(err: any) {
        console.log(err);
      },
    });
  }

  createBlog(tourId: number | undefined): void {
    this.router.navigate(['blog-form/'+ tourId]);
  }

}
