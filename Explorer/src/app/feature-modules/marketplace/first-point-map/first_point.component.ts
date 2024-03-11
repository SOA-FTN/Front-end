import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MarketplaceService } from '../marketplace.service';

@Component({
  selector: 'xp-tour-map',
  templateUrl: './first_point.component.html',
  styleUrls: ['./first_point.component.css'],
})
export class FirstPointMap {
  constructor(
    private route: ActivatedRoute,
    private marketPlaceService: MarketplaceService,
    
  ) {}



ngOnInit() {
    location.reload;
    this.route.paramMap.subscribe((params) => {
      const idTour = params.get('id');
      if (idTour) {
        console.log('Id ture:', idTour);
        this.marketPlaceService.changeTourId(idTour);
      }
    });
  }
}
