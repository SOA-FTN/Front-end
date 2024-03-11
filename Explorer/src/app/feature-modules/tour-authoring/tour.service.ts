import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tour } from './tour/model/tour.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root',
})
export class TourService {
  constructor(private http: HttpClient) {}

  getTourByGuide(
    userId: number,
    page: number,
    pageSize: number
  ): Observable<PagedResults<Tour>> {
    return this.http.get<PagedResults<Tour>>(
      environment.apiHost+ `administration/tour/${userId}?page=${page}&pageSize=${pageSize}`
    );
  }

  addTour(tour: Tour): Observable<Tour> {
    return this.http.post<Tour>(
      environment.apiHost + 'administration/tour',
      tour
    );
  }
}
