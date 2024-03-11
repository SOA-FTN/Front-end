import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ACCESS_TOKEN } from '../../../shared/constants';
import {GoogleAnalyticsService} from "../../google-analytics/google-analytics.service";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private googleAnalyticsService: GoogleAnalyticsService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const accessTokenRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ` + localStorage.getItem(ACCESS_TOKEN),
      },
    });
    this.googleAnalyticsService.sendEvent('authorization', 'event_category', 'event_action', 'event_label', 1);
    return next.handle(accessTokenRequest);
  }
}
