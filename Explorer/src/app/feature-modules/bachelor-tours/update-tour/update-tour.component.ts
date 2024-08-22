import { Component, OnInit } from '@angular/core';
import {
  BachelorKeyPoint,
  BachelorTourCreation,
  BachelorUpdateTour,
  BachelorUpdateTourPoint,
  DifficultyLevel,
  Status,
  TourPointType,
} from '../model/bachelor-tours';
import { ToursBachelorServiceService } from '../tours-bachelor-service.service';
import { TokenStorage } from 'src/app/infrastructure/auth/jwt/token.service';
import { MapService } from 'src/app/shared/map/map.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'xp-update-tour',
  templateUrl: './update-tour.component.html',
  styleUrls: ['./update-tour.component.css'],
})
export class UpdateTourComponent implements OnInit {
  difficultyLevels = Object.values(DifficultyLevel);
  keyPoints: BachelorUpdateTourPoint[] = [];
  marker: L.Marker | null = null; //Plavi Marker
  redMarkers: L.Marker[] = [];
  imagePreview: string | null = null;
  locked: boolean = false;
  tour: BachelorUpdateTour | undefined;

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
    this.tour = history.state.tour;
    console.log(this.tour);

    // Postavljanje vrednosti forme na osnovu tura objekta
    if (this.tour) {
      this.tourForm.patchValue({
        name: this.tour.name,
        description: this.tour.description,
        difficultyLevel: this.tour.difficultyLevel,
        price: this.tour.price,
        status: this.tour.status,
      });
      this.keyPoints = this.tour.tourPoints || [];
      console.log(this.keyPoints);
      this.keyPoints.forEach((point) => {
        this.mapService.setCoordinates({
          lat: point.latitude,
          lng: point.longitude,
        });
        this.mapService.setCoordinates({
          lat: 57.74,
          lng: 55.45,
        });
        // const color =
        //   point.type === TourPointType.Start || point.type === TourPointType.End
        //     ? 'blue'
        //     : 'blue';
        // const marker = this.mapService.addMarker(
        //   point.latitude,
        //   point.longitude,
        //   color
        // );
        // this.redMarkers.push(marker);
      });
    }

    this.mapService.coordinate$.subscribe((coords) => {
      /*
      if (this.marker) {
        this.mapService.removeMarker(this.marker); // Uklanja postojeći plavi marker
      }
      */
      this.marker = this.mapService.addMarker(coords.lat, coords.lng, 'blue'); // Dodaje novi plavi marker
      this.keyPointForm.patchValue({
        latitude: coords.lat,
        longitude: coords.lng,
      });
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

    if (this.marker) {
      this.mapService.removeMarker(this.marker); // Uklanja postojeći plavi marker
    }
    console.log('Kliknuo sam mapu');
    this.marker = this.mapService.addMarker(lat, lng, 'blue'); // Dodaje novi plavi marker
    this.keyPointForm.patchValue({
      latitude: lat,
      longitude: lng,
    });
  }

  addKeyPoint(): void {
    if (!this.marker || this.keyPointForm.invalid) return;

    // Ako već postoji tačka sa tipom 'End', promeni je u 'InBetween'
    const existingEndPointIndex = this.keyPoints.findIndex(
      (kp) => kp.type === TourPointType.End
    );

    if (existingEndPointIndex !== -1) {
      this.keyPoints[existingEndPointIndex].type = TourPointType.InBetween;
    }

    // Dodaj novu tačku kao 'End'
    const keyPoint: BachelorUpdateTourPoint = {
      id: 0,
      name: this.keyPointForm.get('keyPointName')?.value || '',
      description: this.keyPointForm.get('keyPointDescription')?.value || '',
      latitude: this.keyPointForm.get('latitude')?.value || 0,
      longitude: this.keyPointForm.get('longitude')?.value || 0,
      imageUrl: this.keyPointForm.get('image')?.value || '',
      type: TourPointType.InBetween,
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

  updateTour(): void {
    if (this.keyPoints.length > 0) {
      // Postavi poslednji keyPoint u listi na 'End'
      this.keyPoints[this.keyPoints.length - 1].type = TourPointType.End;
    }
    const tour: BachelorUpdateTour = {
      id: this.tour?.id || 0,
      name: this.tourForm.value.name || '',
      description: this.tourForm.value.description || '',
      status: Status.Published,
      difficultyLevel: this.tourForm.value.difficultyLevel as DifficultyLevel,
      userId: this.tokenStorage.getUserId(),
      price: this.tourForm.value.price || 0,
      tourPoints: this.keyPoints, // Dodajemo key pointove
    };
    this.service.updateBachelorTour(tour).subscribe({
      next: () => {
        console.log(tour);
      },
    });
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
