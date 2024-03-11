import { Component, OnInit } from '@angular/core';
import { AdministrationService } from '../administration.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { Status, TourPointRequest } from '../model/tourpoint-request.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { PublicTourPoint } from '../../tour-authoring/model/publicTourPoint.model';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';
import { TourPoint } from '../../tour-authoring/model/tourPoints.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { forkJoin } from 'rxjs';
import { RequestResponseNotificationComponent } from '../request-response-notification/request-response-notification.component';
import { RequestResponseNotification } from '../model/request-response-notification.model';
import {GoogleAnalyticsService} from "../../../infrastructure/google-analytics/google-analytics.service";

@Component({
  selector: 'xp-public-tour-point-request',
  templateUrl: './public-tour-point-request.component.html',
  styleUrls: ['./public-tour-point-request.component.css']
})
export class PublicTourPointRequestComponent implements OnInit {

  user:number
  requests : TourPointRequest[] =[]
  publicTourPoint: PublicTourPoint
  tourPointsInRequests: TourPoint[] = []
  authors: User[] = []
  bindingList: { request: TourPointRequest,name: string, description:string, username:string,comment:string}[] = []

  constructor( private adminService: AdministrationService,
               private authService: AuthService,
               private service:TourAuthoringService,
               private googleAnalytics: GoogleAnalyticsService){}

  ngOnInit(): void {
    this.googleAnalytics.sendPageView(window.location.pathname);

    this.authService.user$.subscribe(user => {
      this.user = user.id;
      this.getAllRequests();
    });
  }

  getAllRequests():void{
    this.adminService.getAllTourPointRequests().subscribe({
      next:(result:PagedResults<TourPointRequest>)=>{
        this.requests = result.results.filter(req => req.status === Status.Onhold);
        console.log("Zahtjevi: "+ this.requests);
        this.getAllTourPoints();
      }
    })


  }

  AcceptRequest(request:TourPointRequest,comment:string):void{
    this.service.AcceptRequest(request.id,request.tourPointId,comment).subscribe({
      next:(result:PublicTourPoint)=>{
        this.publicTourPoint = result;
        
        this.bindingList.length = 0; //ovo dodajte i u reject request
        this.getAllRequests();       // i ovo
        const notification: RequestResponseNotification = {
          authorId: request.authorId,
          comment: comment || "Zahtev za kreiranje javne tacke je prihvacen",
          creation: new Date 
        }
        this.adminService.addNotification(notification).subscribe({
          next:() => {}})
      }
    })
   
  }

  RejectRequest(request:TourPointRequest,comment:string):void{
    this.service.RejectRequest(request.id,comment).subscribe({
      next:(result:PublicTourPoint)=>{
        this.publicTourPoint = result;
        this.bindingList.length = 0; //ovo dodajte i u reject request
        this.getAllRequests();       // i ovo
        const notification: RequestResponseNotification = {
          authorId: request.authorId,
          comment: comment || "Zahtev za kreiranje javne tacke je odbijen",
          creation: new Date 
        }
        this.adminService.addNotification(notification).subscribe({
          next:() => {}
        })
      }
    })
    
  }

  getAllTourPoints(): void {
    const observables = this.requests.map(request => this.adminService.getTourPointById(request.tourPointId));

    forkJoin(observables).subscribe((results: TourPoint[]) => {
      this.tourPointsInRequests = results;
      this.getRequestsAuthors();
    });
  }

  getRequestsAuthors(): void {
    const observables = this.requests.map(request => this.adminService.getAuthorById(request.authorId));

    forkJoin(observables).subscribe((results: User[]) => {
      this.authors = results;

      this.fillBindingList();
    });
  }

  fillBindingList(): void {
    console.log("Usao");
    this.requests.forEach(request => {
      const tp = this.tourPointsInRequests.find(tp => tp.id === request.tourPointId);
      const author = this.authors.find(author => author.id === request.authorId);

      if (tp && author) {
        console.log("Pronađeni su odgovarajući podaci za zahtjev", request.id);
        this.bindingList.push({
          request: request,
          name: tp.name,
          description: tp.description,
          username: author.username,
          comment: ''
        });
      } else {
        console.log("Nisu pronađeni odgovarajući podaci za zahtjev", request.id);
      }
    });
  }

}
