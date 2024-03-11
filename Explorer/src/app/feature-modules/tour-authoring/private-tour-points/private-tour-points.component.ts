import { Component, OnInit } from '@angular/core';
import { TourPoint } from '../model/tourPoints.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { HttpClient } from '@angular/common/http';
import { Tour } from '../tour/model/tour.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { AdministrationService } from '../../administration/administration.service';
import { TourPointRequest } from '../../administration/model/tourpoint-request.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'xp-private-tour-points',
  templateUrl: './private-tour-points.component.html',
  styleUrls: ['./private-tour-points.component.css']
})
export class PrivateTourPointsComponent implements OnInit{

  filteredPrivateTourPoints : TourPoint[] = []
  allTourPoints : TourPoint[] = []
  userTours : Tour[] = []
  tourPointRequests : TourPointRequest[] = []
  user:number
  sentRequest:TourPointRequest
  

  constructor(private service: TourAuthoringService, private adminService: AdministrationService,private authService: AuthService){}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user.id;
      this.getUserTours();
    });
  }

  getUserTours(): void {
    this.service.getTourByGuide(this.user,0,0).subscribe({
      next:(result:PagedResults<Tour>)=>{
        this.userTours = result.results;
        this.getAllExistingRequests();
      }
     })
  }

  getAllTourPoints(): void {
    this.service.getTourPoint().subscribe({
      next:(tourPoints: PagedResults<TourPoint>)=>{
        this.allTourPoints = tourPoints.results;
        this.findAllPrivateTourPoints();
      }
    })
  }

  findAllPrivateTourPoints() : void {
   this.userTours.forEach(tour => {
    this.allTourPoints.forEach(tp => {
      if(tp.tourId === tour.id) {
        this.filteredPrivateTourPoints.push(tp);
      }
    })
   })
   this.filterPrivateTourPoints();
  }

  getAllExistingRequests() : void {
    this.adminService.getAllTourPointRequests().subscribe({
      next:(requests: PagedResults<TourPointRequest>)=>{
        this.tourPointRequests = requests.results;
        this.getAllTourPoints();
      }
    })
  }

  filterPrivateTourPoints(): void {
    this.tourPointRequests.forEach(req => {
      this.filteredPrivateTourPoints = this.filteredPrivateTourPoints.filter(tp => req.tourPointId !== tp.id);
    });
  }
  

  sendRequest(tP:TourPoint):void{
    if(tP.id !== undefined){
      this.adminService.sendPublicTourPointrequest(tP.id,this.user).subscribe({
        next:(result:TourPointRequest)=>{
          this.sentRequest = result;
          this.filteredPrivateTourPoints = this.filteredPrivateTourPoints.filter(tp => tP.id !== tp.id);
        }
      })
    }
    
  }
}
