import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BachelorEncounterServiceService } from '../bachelor-encounter-service.service';
import { BachelorEncounter } from '../model/bachelor-encounters.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { ToursBachelorServiceService } from '../../bachelor-tours/tours-bachelor-service.service';
import { BachelorUpdateTour } from '../../bachelor-tours/model/bachelor-tours';

@Component({
  selector: 'xp-encounters-creation',
  templateUrl: './encounters-creation.component.html',
  styleUrls: ['./encounters-creation.component.css'],
})
export class EncountersCreationComponent implements OnInit {
  selectedFile: File | null = null;
  selectedFilePreview: string | ArrayBuffer | null = null;
  authorId: number | undefined;
  tours: BachelorUpdateTour[] = [];

  constructor(
    private encountersService: BachelorEncounterServiceService,
    private router: Router,
    private authService: AuthService,
    private toursService: ToursBachelorServiceService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.authorId = user.id;
        this.toursService.getAuthorTours(this.authorId).subscribe({
          next: (tours: BachelorUpdateTour[]) => {
            this.tours = tours;
            console.log(tours);
          },
          error: (err: any) => {
            console.log(err);
          },
        });
      }
    });
  }

  encountersForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    xp_points: new FormControl('', [Validators.required]),
    status: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
    latitude: new FormControl('', [Validators.required]),
    longitude: new FormControl('', [Validators.required]),
    image: new FormControl('', [Validators.required]),
    tourName: new FormControl(0, [Validators.required]),
  });

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    console.log('AAAA');
    const selectedTour = this.tours.find(
      (tour) => tour.id === this.encountersForm.value.tourName
    );
    const tourName = selectedTour ? selectedTour.name : '';
    const formData: BachelorEncounter = {
      ID: '',
      Name: this.encountersForm.value.name || '',
      Description: this.encountersForm.value.description || '',
      Xp_Points: this.encountersForm.value.xp_points || '',
      Status: this.encountersForm.value.status || '',
      Type: this.encountersForm.value.type || '',
      Image: this.encountersForm.get('image')?.value || '',
      Longitude: this.encountersForm.value.longitude || '',
      Latitude: this.encountersForm.value.latitude || '',
      Should_be_approved: true,
      AuthorId: this.authorId || 0,
      TourId: this.encountersForm.value.tourName || 0,
      TourName: tourName,
    };
    console.log(formData);
    if (this.encountersForm.valid) {
      this.encountersService.createEncounter(formData).subscribe({
        next: () => {
          this.router.navigate(['/encounters-preview']);
        },
      });
    }
  }
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // Ensure e.target?.result is properly typed
        if (e.target && typeof e.target.result === 'string') {
          this.selectedFilePreview = e.target.result;
          this.encountersForm.patchValue({ image: e.target.result });
        }
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
}
