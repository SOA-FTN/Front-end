import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, Validators,AbstractControl } from '@angular/forms';
import { TourExecutionPosition } from '../model/tourExecutionPosition.model';
import { TourExecutionService } from '../tour-execution.service';
import { MapService } from 'src/app/shared/map/map.service';

function isValidDate(control: AbstractControl): { [key: string]: boolean } | null {
  const value = control.value;
  if (!value) {
    return null; // Allow empty values
  }

  const isValid = !isNaN(Date.parse(value));
  return isValid ? null : { 'invalidDate': true };
}

@Component({
  selector: 'xp-tour-execution-position',
  templateUrl: './tour-execution-position.component.html',
  styleUrls: ['./tour-execution-position.component.css']
})
export class TourExecutionPositionComponent implements OnChanges {
  @Output() positionUpdated=new EventEmitter<null>();
  @Input() tourExecutionPosition:TourExecutionPosition;
  //@Input() tourExecution: TourExecution;
  @Input() shouldEdit: boolean = false;
  idPosition:number;

  constructor(
    private service:TourExecutionService,
    private mapService:MapService){}

  ngOnChanges(changes: SimpleChanges): void {
    this.tourExecutionPositionForm.reset();
    if (this.shouldEdit) {
      const formattedDate = this.tourExecutionPosition.lastActivity.toISOString(); // or .toUTCString()
      const formValues = {
      lastActivity: formattedDate,
      latitude: this.tourExecutionPosition.latitude,
      longitude: this.tourExecutionPosition.longitude,
    };
      this.tourExecutionPositionForm.patchValue(formValues);
    }
  }

  tourExecutionPositionForm = new FormGroup({
    lastActivity: new FormControl('', [Validators.required, isValidDate]),
    latitude: new FormControl(0, [Validators.required]),
    longitude: new FormControl(0, [Validators.required]),
  });

  addTourExecutionPosition(): void {
    const now = new Date()
    const tourExecutionPosition: TourExecutionPosition = {
      //tourExecutionId: this.tourExecution.id || 0,

      lastActivity:now,
      latitude: 0,
      longitude: 0,
    };

    this.mapService.coordinate$.subscribe((coordinates) => {
      tourExecutionPosition.latitude = coordinates.lat;
      tourExecutionPosition.longitude = coordinates.lng;
    });

    this.service.addTourExecutionPosition(tourExecutionPosition).subscribe({
      next: () => {
        this.positionUpdated.emit();
      },
    });
  }

  updateTourExecutionPosition(): void {
    const now = new Date();
    const tourExecutionPosition: TourExecutionPosition = {
      tourExecutionId: this.tourExecutionPosition.tourExecutionId || 0,

      lastActivity:now,
      latitude: 0,
      longitude: 0,
    };

    tourExecutionPosition.id = this.tourExecutionPosition.id;

    this.mapService.coordinate$.subscribe((coordinates) => {
      tourExecutionPosition.latitude = coordinates.lat;
      tourExecutionPosition.longitude = coordinates.lng;
    });

    this.service.updateTourExecutionPosition(tourExecutionPosition).subscribe({
      next: (_) => {
        this.positionUpdated.emit();
      },
    });
  }

}
