import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Encounter } from './model/encounter.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';
import { SocialEncounter } from './model/social-encounter.model';
import { EncounterExecution } from './model/encounter-execution.model';
import { HiddenLocationEncounter } from './model/hidden-location-encounter.model';
import { ShortHiddenLocationEncounter } from './model/short-hidden-location-encounter.model';

@Injectable({
  providedIn: 'root'
})
export class EncountersService {

  constructor(private http: HttpClient) { }

  getEncounters(): Observable<PagedResults<Encounter>> {
    return this.http.get<PagedResults<Encounter>>(environment.apiHost + 'encounters');
  }

  getSocialEncounters(): Observable<PagedResults<SocialEncounter>> {
    return this.http.get<PagedResults<SocialEncounter>>(environment.apiHost + 'encounters/social');
  }

  getHiddenLocationEncounters(): Observable<PagedResults<HiddenLocationEncounter>> {
    return this.http.get<PagedResults<HiddenLocationEncounter>>(environment.apiHost + 'encounters/hiddenLocation');
  }

  addEncounter(encounter: Encounter): Observable<Encounter>{
    return this.http.post<Encounter>(environment.apiHost + 'encounters', encounter);
  }

  addSocialEncounter(encounter: SocialEncounter): Observable<SocialEncounter>{
    return this.http.post<SocialEncounter>(environment.apiHost + 'encounters/social', encounter);
  }

  addHiddenLocationEncounter(encounter: HiddenLocationEncounter): Observable<HiddenLocationEncounter>{
    return this.http.post<HiddenLocationEncounter>(environment.apiHost + 'encounters/hiddenLocation', encounter);
  }

  updateEncounter(encounter: Encounter): Observable<Encounter>{
    return this.http.put<Encounter>(environment.apiHost + 'encounters', encounter);
  }

  updateSocialEncounter(encounter: SocialEncounter): Observable<SocialEncounter>{
    return this.http.put<SocialEncounter>(environment.apiHost + 'encounters/social', encounter);
  }

  updateHiddenLocationEncounter(encounter: HiddenLocationEncounter): Observable<HiddenLocationEncounter>{
    return this.http.put<HiddenLocationEncounter>(environment.apiHost + 'encounters/hiddenLocation', encounter);
  }

  deleteEncounter(encounter: Encounter): Observable<Encounter>{
    return this.http.delete<Encounter>(environment.apiHost + 'encounters/' + encounter.id);
  }

  getByUser(userId: number): Observable<EncounterExecution>{
    const url = `${environment.apiHost+ 'encounterExecution/getActive'}/${userId}`;
    
    return this.http.get<EncounterExecution>(url);
  }
  
  getEncounterById(encounterId: number): Observable<Encounter>{
    const url = `${environment.apiHost+ 'encounters/getEncounter'}/${encounterId}`;
    return this.http.get<Encounter>(url);
  }

  checkSocialEncounter(encounterId: number): Observable<PagedResults<EncounterExecution>>{
    const url = `${environment.apiHost+ 'encounterExecution/checkSocialEncounter'}/${encounterId}`;
    return this.http.get<PagedResults<EncounterExecution>>(url);
  }

  checkHiddenEncounter(executionId: number, encounterId: number): Observable<boolean> {
    const url = `${environment.apiHost+ 'encounterExecution/checkHidden'}/${executionId}/${encounterId}`;
    console.log(url);
    return this.http.get<boolean>(url);
  }

  completeExecution(userId: number): Observable<EncounterExecution> {
    console.log("usao u servis")
    const url = `${environment.apiHost}encounterExecution/completeExecution/${userId}`;
    console.log(url);
    return this.http.get<EncounterExecution>(url);
  }

  getHiddenLocationEncounterByEncounterId(encounterId: number): Observable<ShortHiddenLocationEncounter> {
    const url = `${environment.apiHost}encounters/hiddenLocation/${encounterId}`;
    return this.http.get<ShortHiddenLocationEncounter>(url);
  }
  
}
