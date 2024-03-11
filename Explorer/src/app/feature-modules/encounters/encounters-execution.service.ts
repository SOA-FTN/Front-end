import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EncounterExecution } from './model/encounter-execution.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root'
})
export class EncountersExecutionService {

  constructor(private http: HttpClient) { }

  addEncounterExecution(execution: EncounterExecution): Observable<EncounterExecution>{
    return this.http.post<EncounterExecution>(environment.apiHost + 'encounterExecution', execution);
  }
  getExecutions(): Observable<PagedResults<EncounterExecution>> {
    return this.http.get<PagedResults<EncounterExecution>>(environment.apiHost + 'encounterExecution');
  }
}