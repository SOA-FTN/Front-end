import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BachelorEncounter } from '../model/bachelor-encounters.model';
import { BachelorEncounterServiceService } from '../bachelor-encounter-service.service';
import { Router } from '@angular/router';
import { ToursBachelorServiceService } from '../../bachelor-tours/tours-bachelor-service.service';
import { BachelorUpdateTour } from '../../bachelor-tours/model/bachelor-tours';

@Component({
  selector: 'xp-update-encounter',
  templateUrl: './update-encounter.component.html',
  styleUrls: ['./update-encounter.component.css'],
})
export class UpdateEncounterComponent implements OnInit {
  encountersForm: FormGroup;
  selectedFile: File | null = null;
  isEditing: boolean = false;
  encounter: BachelorEncounter | undefined;
  selectedFilePreview: string | ArrayBuffer | null = null;
  tours: BachelorUpdateTour[] = [];

  constructor(
    private encountersService: BachelorEncounterServiceService,
    private router: Router,
    private tourService: ToursBachelorServiceService
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.encounter = navigation?.extras?.state?.['encounter'];
    this.encountersForm = new FormGroup({
      name: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      description: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      xp_points: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      status: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      type: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      latitude: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      longitude: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      image: new FormControl({ value: '', disabled: true }),
      tourName: new FormControl({ value: 0, disabled: true }, [
        Validators.required,
      ]),
      authorId: new FormControl(0, [Validators.required]),
    });
  }

  ngOnInit(): void {
    if (this.encounter) {
      this.tourService.getAuthorTours(this.encounter.AuthorId).subscribe({
        next: (tours: BachelorUpdateTour[]) => {
          this.tours = tours;

          // Pronađi odgovarajući naziv ture na osnovu TourId
          const selectedTour = this.tours.find(
            (tour) => tour.id === this.encounter?.TourId
          );
          const tourName = selectedTour ? selectedTour.name : '';

          if (this.encounter) {
            this.encountersForm.patchValue({
              name: this.encounter.Name,
              description: this.encounter.Description,
              xp_points: this.encounter.Xp_Points,
              status: this.encounter.Status,
              type: this.encounter.Type,
              latitude: this.encounter.Latitude,
              longitude: this.encounter.Longitude,
              image: this.encounter.Image,
              authorId: this.encounter.AuthorId,
              tourName: this.encounter.TourId, // Podesi TourId kao vrednost u formi
            });
          }
          console.log(this.tours);
        },
        error: (err: any) => {
          console.log(err);
        },
      });
    }
  }
  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedFilePreview = reader.result; // Update the preview with the selected image
        this.encountersForm.patchValue({ image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  }

  toggleEditMode() {
    this.isEditing = !this.isEditing;
    this.toggleFormFields(this.isEditing);
  }

  cancelEdit() {
    this.isEditing = false;
    this.toggleFormFields(false);
    if (this.encounter) {
      this.encountersForm.patchValue({
        name: this.encounter.Name,
        description: this.encounter.Description,
        xp_points: this.encounter.Xp_Points,
        status: this.encounter.Status,
        type: this.encounter.Type,
        latitude: this.encounter.Latitude,
        longitude: this.encounter.Longitude,
        image: this.encounter.Image,
      });
      this.selectedFilePreview = null;
    }
  }

  toggleFormFields(enable: boolean) {
    Object.keys(this.encountersForm.controls).forEach((key) => {
      if (enable) {
        this.encountersForm.controls[key].enable();
      } else {
        this.encountersForm.controls[key].disable();
      }
    });
  }

  onSubmit(): void {
    if (this.encountersForm.valid && this.encounter) {
      // Pronađi izabranu turu na osnovu TourId iz forme
      const selectedTour = this.tours.find(
        (tour) => tour.id === this.encountersForm.value.tourName
      );
      const tourName = selectedTour ? selectedTour.name : '';

      const updatedData: BachelorEncounter = {
        ...this.encounter,
        Name: this.encountersForm.value.name || '',
        Description: this.encountersForm.value.description || '',
        Xp_Points: this.encountersForm.value.xp_points || '',
        Status: this.encountersForm.value.status || '',
        Type: this.encountersForm.value.type || '',
        Latitude: this.encountersForm.value.latitude || '',
        Longitude: this.encountersForm.value.longitude || '',
        Image: this.encountersForm.value.image || this.encounter.Image,
        Should_be_approved: this.encounter.Should_be_approved,
        TourId: this.encountersForm.value.tourName || this.encounter.TourId, // Ažuriranje TourId
        TourName: tourName || this.encounter.TourName, // Ažuriranje TourName
      };

      this.encountersService
        .updateEncounter(updatedData, this.encounter.ID)
        .subscribe({
          next: () => {
            this.router.navigate(['/encounters-preview']);
          },
          error: (err: any) => {
            console.error('Error updating encounter:', err);
          },
        });
    }
  }
}
