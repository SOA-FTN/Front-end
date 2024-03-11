import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Tour } from '../tour-authoring/tour/model/tour.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/env/environment';
import { Competition } from './model/competition.model';
import { CompetitionApply } from './model/competitionApply.model';

@Injectable({
  providedIn: 'root',
})
export class CompetitionServiceService {
  constructor(private http: HttpClient) {}

  getTourByGuide(
    userId: number,
    page: number,
    pageSize: number
  ): Observable<PagedResults<Tour>> {
    return this.http.get<PagedResults<Tour>>(
      environment.apiHost +
        `administration/tour/${userId}?page=${page}&pageSize=${pageSize}`
    );
  }

  addCompetition(competition: Competition): Observable<Competition> {
    console.log(competition);
    return this.http.post<Competition>(
      environment.apiHost + 'competition',
      competition
    );
  }

  getAllCompetitionsByAuthorId(id: number): Observable<PagedResults<Competition>> {
    return this.http.get<PagedResults<Competition>>(
      environment.apiHost + 'competition/getAllCompetitionAuthorId/' + id
    );
  }

  getAll(): Observable<PagedResults<Competition>> {
    return this.http.get<PagedResults<Competition>>(
      environment.apiHost + 'competition/allCompetitions'
   );
  }

  getAppliesByComp(id: number): Observable<PagedResults<CompetitionApply>>{
    return this.http.get<PagedResults<CompetitionApply>>(environment.apiHost + 'competitionApply/getApplies/'+ id);
  }

  getWinnersByComp(id: number): Observable<PagedResults<CompetitionApply>>{
    return this.http.get<PagedResults<CompetitionApply>>(environment.apiHost + 'competitionApply/getWinner/'+ id);
  }

  updateApply(apply: CompetitionApply): Observable<CompetitionApply>{
    return this.http.put<CompetitionApply>(environment.apiHost + 'competitionApply/' + apply.id, apply)
  }

  addApply(apply: CompetitionApply):  Observable<CompetitionApply> {
    return this.http.post<CompetitionApply>(environment.apiHost + 'competitionApply', apply);
  }
}
