import { Component, OnInit } from '@angular/core';
import { RequestResponseNotification } from '../model/request-response-notification.model';
import { AdministrationService } from '../administration.service';
import { TokenStorage } from 'src/app/infrastructure/auth/jwt/token.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import {GoogleAnalyticsService} from "../../../infrastructure/google-analytics/google-analytics.service";

@Component({
  selector: 'xp-request-response-notification',
  templateUrl: './request-response-notification.component.html',
  styleUrls: ['./request-response-notification.component.css']
})
export class RequestResponseNotificationComponent implements OnInit{

  requestResponseNotification: RequestResponseNotification[] = [];

  constructor(private tokenStorage: TokenStorage,
              private service: AdministrationService,
              private googleAnalytics: GoogleAnalyticsService) {}

  ngOnInit(): void {
    this.googleAnalytics.sendPageView(window.location.pathname);

    this.getNotifications();
  }
  getNotifications(): void {
    const authorId = this.tokenStorage.getUserId();
    this.service.getNotificationsByAuthorId(authorId).subscribe({
      next: (result: PagedResults<RequestResponseNotification>) => {
        this.requestResponseNotification = result.results;
        console.log('Notifications:', this.requestResponseNotification);
      },
      error: (error) => {
        console.error('Error fetching notifications:', error);
      },
    });
  }
  deleteNotification(notification: RequestResponseNotification): void{
    console.log("Doslo je do ovde");
    this.service.deleteNotification(notification).subscribe({
      next: (_) => {
        this.getNotifications();
      }
    })
  }

}
