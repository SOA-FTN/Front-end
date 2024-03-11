import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { Equipment } from './tour/model/equipment.model';

@Injectable({
  providedIn: 'root'
})
export class TourEquipmentService {

  constructor(private http: HttpClient) { }

  addEquipment(tourId: number, equipmentId: number): Observable<any> {
    const requestBody = {
      tourId: tourId,
      equipmentId: equipmentId
    };

    return this.http.post<any>(environment.apiHost + 'administration/tourequipment', requestBody);
  }
  getEquipmentForTour(tourId: number): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(environment.apiHost + `administration/tourequipment/${tourId}`);
  }
  deleteEquipment(tourId: number, equipmentId: number): Observable<any> {
    return this.http.delete<Equipment[]>(environment.apiHost + `administration/tourequipment/${tourId}/${equipmentId}`);
  }
}
