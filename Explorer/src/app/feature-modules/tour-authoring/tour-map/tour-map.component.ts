import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TourAuthoringService } from '../tour-authoring.service';

@Component({
  selector: 'xp-tour-map',
  templateUrl: './tour-map.component.html',
  styleUrls: ['./tour-map.component.css'],
})
export class TourMapComponent {
  constructor(
    private route: ActivatedRoute,
    private tourAuthoringService: TourAuthoringService,
    
  ) {}

  ngOnInit() {
    location.reload;
    this.route.paramMap.subscribe((params) => {
      const idTour = params.get('id');
      if (idTour) {
        console.log('Id ture:', idTour);
        this.tourAuthoringService.changeTourId(idTour);
      }
    });
  }
}
