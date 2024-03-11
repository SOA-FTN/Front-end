import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root'
})
export class VisualGalleryService {

  private unsplashApiUrl = 'https://localhost:44333/api/unisplash'; // Update with your backend URL


  constructor(private http: HttpClient) { }

  searchImages(query: string): Observable<any> {
    console.log('Usao u service');
    const apiUrl = `${this.unsplashApiUrl}/search?query=${query}`;
    console.log(apiUrl);
    return this.http.get(apiUrl);
  }

}
