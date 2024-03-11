import { Injectable } from '@angular/core';

import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { environment } from 'src/env/environment';
import { Bundle } from './bundle.model';
import { Observable } from 'rxjs';
import { GuideReview } from '../marketplace/model/guide-review.model';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class PaymentRecordService {

  constructor(private http:HttpClient) {
   
  }

   
  getPublishedBundles(): Observable<PagedResults<Bundle>> {
    return this.http.get<PagedResults<Bundle>>(
      environment.apiHost + 'author/tourBundle/publishedTourBundles'
    );
  }
   
  tourBundlePurchase(tourBundleId: number, touristId: number): Observable<Bundle>{
    console.log('nestooo')
    return this.http.post<Bundle>(
      environment.apiHost + 'bundlepayrecord/'+ tourBundleId + '/'+touristId ,
      null
    );
  } 
}
