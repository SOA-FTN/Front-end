import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Club } from './model/club.model';
import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root'
})
export class ClubService {

  constructor(private http: HttpClient) { }

  getClubsByOwner(userId: number): Observable<PagedResults<Club>>{
    return this.http.get<PagedResults<Club>>(environment.apiHost + 'club/club/' + userId);
  }
  addClub(club: Club): Observable<Club>{
    return this.http.post<Club>(environment.apiHost + 'club/club', club);
  }
  updateClub(club: Club): Observable<Club> {
    return this.http.put<Club>(environment.apiHost + 'club/club/' + club.id, club)
  }
  deleteClub(club:Club): Observable<Club> {
    return this.http.delete<Club>(environment.apiHost + 'club/club/' + club.id)
  }
}
