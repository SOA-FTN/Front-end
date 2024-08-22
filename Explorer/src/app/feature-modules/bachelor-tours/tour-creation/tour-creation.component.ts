import { Component } from '@angular/core';
import { TokenStorage } from 'src/app/infrastructure/auth/jwt/token.service';
import { ToursBachelorServiceService } from '../tours-bachelor-service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  BachelorTourCreation,
  DifficultyLevel,
  Status,
  BachelorKeyPoint,
  TourPointType,
} from '../model/bachelor-tours';
import { MapService } from 'src/app/shared/map/map.service';
import * as L from 'leaflet';

@Component({
  selector: 'xp-tour-creation',
  templateUrl: './tour-creation.component.html',
  styleUrls: ['./tour-creation.component.css'],
})
export class TourCreationComponent {
  difficultyLevels = Object.values(DifficultyLevel);
  keyPoints: BachelorKeyPoint[] = [];
  marker: L.Marker | null = null; // Plavi marker
  redMarkers: L.Marker[] = [];
  imagePreview: string | null = null;
  locked: boolean = false;
  constructor(
    private service: ToursBachelorServiceService,
    private tokenStorage: TokenStorage,
    private mapService: MapService
  ) {}

  tourForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    status: new FormControl('', [Validators.required]),
    difficultyLevel: new FormControl('', [Validators.required]),
    price: new FormControl(0, [Validators.required]),
  });

  keyPointForm = new FormGroup({
    keyPointName: new FormControl('', [Validators.required]),
    keyPointDescription: new FormControl('', [Validators.required]),
    latitude: new FormControl<number | null>(null, [Validators.required]),
    longitude: new FormControl<number | null>(null, [Validators.required]),
    image: new FormControl('', [Validators.required]), // Dodato polje za sliku
  });

  ngOnInit(): void {
    this.mapService.coordinate$.subscribe((coords) => {
      if (this.marker) {
        this.mapService.removeMarker(this.marker); // Uklanja postojeći plavi marker
      }

      this.marker = this.mapService.addMarker(coords.lat, coords.lng, 'blue'); // Dodaje novi plavi marker
      this.keyPointForm.patchValue({
        latitude: coords.lat,
        longitude: coords.lng,
      });
    });
  }

  addTour(): void {
    if (this.keyPoints.length > 0) {
      // Postavi poslednji keyPoint u listi na 'End'
      this.keyPoints[this.keyPoints.length - 1].type = TourPointType.End;
    }
    const tour: BachelorTourCreation = {
      id: 0,
      name: this.tourForm.value.name || '',
      description: this.tourForm.value.description || '',
      status: Status.Published,
      difficultyLevel: this.tourForm.value.difficultyLevel as DifficultyLevel,
      userId: this.tokenStorage.getUserId(),
      price: this.tourForm.value.price || 0,
      tourPoints: this.keyPoints, // Dodajemo key pointove
    };

    this.service.addBachelorTour(tour).subscribe({
      next: () => {
        console.log(tour);
        // Možete dodati logiku za resetovanje forme ili prikazivanje poruke
      },
    });
  }

  removeKeyPoint(index: number): void {
    if (this.redMarkers[index]) {
      this.mapService.removeMarker(this.redMarkers[index]); // Ukloni marker sa mape
      this.redMarkers.splice(index, 1); // Ukloni marker iz liste
      this.keyPoints.splice(index, 1); // Ukloni keypoint iz liste
    }
  }

  onMapClick(event: any): void {
    const lat = event.latlng.lat;
    const lng = event.latlng.lng;
    console.log(event);
    /*
    if (this.marker) {
      this.mapService.removeMarker(this.marker); // Uklanja postojeći plavi marker
    }
      */
    console.log('Kliknuo sam mapu');
    //this.marker = this.mapService.addMarker(lat, lng, 'blue'); // Dodaje novi plavi marker
    this.keyPointForm.patchValue({
      latitude: lat,
      longitude: lng,
    });
  }

  addKeyPoint(): void {
    if (!this.marker || this.keyPointForm.invalid) return;

    const keyPointType: TourPointType =
      this.keyPoints.length === 0
        ? TourPointType.Start
        : TourPointType.InBetween;

    const keyPoint: BachelorKeyPoint = {
      name: this.keyPointForm.get('keyPointName')?.value || '',
      description: this.keyPointForm.get('keyPointDescription')?.value || '',
      latitude: this.keyPointForm.get('latitude')?.value || 0,
      longitude: this.keyPointForm.get('longitude')?.value || 0,
      imageUrl: this.keyPointForm.get('image')?.value || '',
      type: keyPointType,
    };

    this.keyPoints.push(keyPoint);

    // Promeni boju markera u crvenu i dodaj ga u redMarkers listu
    if (this.marker) {
      this.mapService.changeMarkerColor(this.marker, 'red');
      this.redMarkers.push(this.marker); // Dodaj crveni marker u listu
      this.marker = null; // Resetujemo plavi marker
    }

    this.keyPointForm.reset();
    this.imagePreview = null;
  }

  getMarkerLat(): number | null {
    return this.marker ? this.marker.getLatLng().lat : null;
  }

  getMarkerLng(): number | null {
    return this.marker ? this.marker.getLatLng().lng : null;
  }

  chooseImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === 'string') {
          this.imagePreview = e.target.result;
          this.keyPointForm.patchValue({ image: e.target.result }); // Sačuvaj Base64 string
        }
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
}
