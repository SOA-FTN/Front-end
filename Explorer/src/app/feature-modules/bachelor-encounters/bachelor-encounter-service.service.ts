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

  createEncounter(encounter: BachelorEncounter): Observable<any> {
    console.log(encounter);
    return this.http.post<any>(
      'http://localhost:8000/api/encounter/createEncounter',
      encounter
    );
  }

  getEncounterById(id: string): Observable<BachelorEncounter> {
    return this.http.get<BachelorEncounter>(
      `http://localhost:8000/api/encounter/getById?ID=${id}`
    );
  }

  updateEncounter(
    encounter: BachelorEncounter,
    id: string
  ): Observable<BachelorEncounter> {
    const url = `http://localhost:8000/api/encounter/update?ID=${id}`;
    console.log('PUT Request URL:', url);
    console.log(encounter);
    return this.http.put<BachelorEncounter>(url, encounter);
  }

  deleteEncounter(id: string): Observable<BachelorEncounter> {
    return this.http.delete<BachelorEncounter>(
      `http://localhost:8000/api/encounter/deleteEncounter?ID=${id}`
    );
  }

  getEncounterByAuthorId(authorId: number): Observable<BachelorEncounter[]> {
    console.log(authorId);
    return this.http.get<BachelorEncounter[]>(
      `http://localhost:8000/api/encounter/getByAuthorId?ID=${authorId}`
    );
  }
}
