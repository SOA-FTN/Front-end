import { Component, OnInit } from '@angular/core';
import { TourPoint } from '../model/tourPoints.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-tour-points',
  templateUrl: './tour-points.component.html',
  styleUrls: ['./tour-points.component.css']
})
export class TourPointsComponent implements OnInit {

  tourPoint: TourPoint[] = [];
  selectedTourPoint: TourPoint;
  shouldEdit: boolean;
  shouldRenderTourPointForm: boolean = false;

  constructor(private service: TourAuthoringService) {}
  ngOnInit(): void {
    this.getTourPoint()
  }

  getTourPoint() : void {
    this.service.getTourPoint().subscribe({
      next: (result: PagedResults<TourPoint>) => {
        this.tourPoint= result.results;
      },
      error: (err: any) => {
        console.log(err)
      }
    })
  }

  onEditClicked(tourPoint: TourPoint): void {
    this.shouldEdit =true;
    this.shouldRenderTourPointForm = true;
    this.selectedTourPoint = tourPoint;
  }

  /*
  onAddClicked() : void {
    this.shouldRenderTourPointForm = true;
    this.shouldEdit =false;
  }*/

  deleteTourPoint(tourPoint: TourPoint) : void {
    this.service.deleteTourPoint(tourPoint).subscribe({
      next: (_) => {
        this.getTourPoint();
      } 
    })
  }
}
