import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, Validators,AbstractControl } from '@angular/forms';
import { UserPosition } from '../model/userPosition.model';
import { AdministrationService } from '../administration.service';
import { MapService } from 'src/app/shared/map/map.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { TokenStorage } from 'src/app/infrastructure/auth/jwt/token.service';
import {GoogleAnalyticsService} from "../../../infrastructure/google-analytics/google-analytics.service";

@Component({
  selector: 'xp-user-position',
  templateUrl: './user-position.component.html',
  styleUrls: ['./user-position.component.css']
})
export class UserPositionComponent implements OnChanges {
  @Output() positionUpdated=new EventEmitter<null>();
  @Input() userPosition:UserPosition;
  @Input() shouldEdit: boolean = false;
  idPosition:number|undefined;
  userPositions: UserPosition;

  constructor(
    private service:AdministrationService,
    private mapService:MapService,
    private tokenStorage: TokenStorage,
    private googleAnalytics: GoogleAnalyticsService){}

  ngOnChanges(changes: SimpleChanges): void {
    this.userPositionForm.reset();
    if (this.shouldEdit) {

      const formValues = {

      latitude: this.userPosition.latitude,
      longitude: this.userPosition.longitude,
    };
      this.userPositionForm.patchValue(formValues);
    }
  }

  ngOnInit():void{
    this.googleAnalytics.sendPageView(window.location.pathname);

    this.checkUserPosition();
    this.service.getByUserId(this.tokenStorage.getUserId(), 0, 0).subscribe(
      (result) => {
        this.userPositions = result;
        console.log(this.userPositions.id);


        // Handle the result as needed
      },
      (error) => {
        console.error('Error fetching user positions:', error);
        // Handle the error as needed
      }
    );
    //this.checkUserPosition();
  }

  userPositionForm = new FormGroup({
    latitude: new FormControl(0, [Validators.required]),
    longitude: new FormControl(0, [Validators.required]),
  });

  addUserPosition(): void {

    const userPosition: UserPosition = {
      userId: this.tokenStorage.getUserId(),
      latitude: 0,
      longitude: 0,
    };

    this.mapService.coordinate$.subscribe((coordinates) => {
      userPosition.latitude = coordinates.lat;
      userPosition.longitude = coordinates.lng;
    });

    this.service.addUserPosition(userPosition).subscribe({
      next: () => {
        this.positionUpdated.emit();
      },
    });
  }

  checkUserPosition(): void {
    this.service.getByUserId(this.tokenStorage.getUserId(), 0, 0).subscribe(
      (result) => {
        this.shouldEdit = result != null;
        this.idPosition = result ? result.id : undefined; // Assign the result of the check
      },
      (error) => {
        console.error('Error fetching user positions:', error);
        // Handle the error as needed
      }
    );
  }
  updateUserPosition(): void {
    var id = 0;
    const userPosition: UserPosition = {
      userId: this.tokenStorage.getUserId(),
      latitude: 0.000000,
      longitude: 0.000000,
    };

    this.service.getByUserId(this.tokenStorage.getUserId(), 0, 0).subscribe(
      (result) => {
        this.idPosition = result ? result.id : undefined;
        // Handle the result as needed
      },
      (error) => {
        console.error('Error fetching user positions:', error);
        // Handle the error as needed
      }
    );
    userPosition.id=this.idPosition;
    this.mapService.coordinate$.subscribe((coordinates) => {
      userPosition.latitude = coordinates.lat;
      userPosition.longitude = coordinates.lng;
    });

    this.service.updateUserPosition(userPosition).subscribe({
      next: (_) => {
        this.positionUpdated.emit();
      },
    });
  }

}
