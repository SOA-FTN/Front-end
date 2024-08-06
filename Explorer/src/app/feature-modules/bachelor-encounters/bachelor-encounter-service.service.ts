import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BachelorEncounter } from './model/bachelor-encounters.model';

@Injectable({
  providedIn: 'root',
})
export class BachelorEncounterServiceService {
  constructor(private http: HttpClient) {}

  getAllEncounters(): Observable<BachelorEncounter[]> {
    return this.http.get<BachelorEncounter[]>(
      'http://localhost:8000/api/encounter/getAll'
    );
  }
}
