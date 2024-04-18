import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Encounter } from '../model/encounter.model';
import { EncountersService } from '../encounters.service';
import { Router } from '@angular/router';
import { MapService } from 'src/app/shared/map/map.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { ShortSocialEncounter } from '../model/short-social-encounter.model';
import { ShortHiddenLocationEncounter } from '../model/short-hidden-location-encounter.model';
import { SocialEncounter } from '../model/social-encounter.model';
import { HiddenLocationEncounter } from '../model/hidden-location-encounter.model';
import { take } from 'rxjs/operators';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-encounters-form',
  templateUrl: './encounters-form.component.html',
  styleUrls: ['./encounters-form.component.css']
})
export class EncountersFormComponent implements OnChanges {

  @Output() encountersUpdated = new EventEmitter<null>();
  @Input() encounter: Encounter;
  @Input() shouldEdit: boolean = false;
  @Input() shouldEditDraft: boolean = false;
  @Input() isSocial : boolean;
  @Input() isLocation: boolean;
  temporaryLatitude: number = 0;
  temporaryLongitude: number = 0;
  shouldBeApproved: boolean = false;
  status: string = 'ACTIVE';
  inputSocialEncounter: SocialEncounter = {
    encounterId: 0,
    name: '',
    description: '',
    xpPoints: 0,
    status: this.status,
    type: 'SOCIAL',
    latitude: 0,
    longitude: 0,
    id: 0,
    touristsRequiredForCompletion: 1,
    distanceTreshold: 200,
    touristIDs:  [],
    shouldBeApproved: this.shouldBeApproved
  };
  inputHiddenLocationEncounter: HiddenLocationEncounter = {
    id: 0,
    name: '',
    description: '',
    xpPoints: 0,
    status: this.status,
    type: 'LOCATION',
    latitude: 0,
    longitude: 0,
    encounterId: 0,
    imageURL: '',
    imageLatitude: 0,
    imageLongitude: 0,
    distanceTreshold: 200,
    shouldBeApproved: this.shouldBeApproved
  }

  user: User | undefined;
  constructor(private service: EncountersService, private router: Router, private mapService:MapService, private authService: AuthService){}
  
  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    }); 
    if(this.user && this.user.role=='tourist'){
      this.shouldBeApproved = true;
      this.status = 'DRAFT';
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.isSocial){
      this.service.getSocialEncounters().subscribe({
        next: (result: PagedResults<ShortSocialEncounter>) => {
          var socialEncounters = result.results;
          const shortSocialEncounter = socialEncounters.find(
            (social) => social.encounterId === this.encounter.id
          );
          if(shortSocialEncounter){
            this.inputSocialEncounter.name = this.encounter.name;
            this.inputSocialEncounter.description = this.encounter.description;
            this.inputSocialEncounter.xpPoints = this.encounter.xpPoints;
            this.inputSocialEncounter.type = this.encounter.type;
            this.inputSocialEncounter.distanceTreshold = shortSocialEncounter.distanceTreshold;
            this.inputSocialEncounter.touristsRequiredForCompletion = shortSocialEncounter.touristsRequiredForCompletion;
          }else{
            console.log('Cant find social encounter');
          }
          this.encounterForm.reset();
          if(this.shouldEdit){
            this.encounterForm.patchValue(this.inputSocialEncounter);
          }
        },
      })
    }
    else if(this.isLocation){
      this.service.getHiddenLocationEncounters().subscribe({
        next: (result: PagedResults<ShortHiddenLocationEncounter>) => {
          var hiddenLocationEncounters = result.results;
          const shortHiddenLocationEncounter = hiddenLocationEncounters.find(
            (hidden) => hidden.encounterId === this.encounter.id
          );
          if(shortHiddenLocationEncounter){
            this.inputHiddenLocationEncounter.name = this.encounter.name;
            this.inputHiddenLocationEncounter.description = this.encounter.description;
            this.inputHiddenLocationEncounter.xpPoints = this.encounter.xpPoints;
            this.inputHiddenLocationEncounter.type = this.encounter.type;
            this.inputHiddenLocationEncounter.distanceTreshold = shortHiddenLocationEncounter.distanceTreshold;
            this.inputHiddenLocationEncounter.imageURL = shortHiddenLocationEncounter.imageURL;
          }else{
            console.log('Cant find social encounter');
          }
          this.encounterForm.reset();
          if(this.shouldEdit){
            this.encounterForm.patchValue(this.inputHiddenLocationEncounter);
          }
        },
      })
    }
    else{
      this.encounterForm.reset();
      if(this.shouldEdit){
        this.encounterForm.patchValue(this.encounter);
      }
    }
  }

  encounterForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    xpPoints: new FormControl(0, [Validators.required]),
    type: new FormControl('MISC', [Validators.required]),   // Dropdown for EncounterType
    distanceTreshold: new FormControl(200, []),
    touristsRequiredForCompletion: new FormControl(1, []),
    imageURL: new FormControl('', []),
  })

  addEncounter(): void{
    console.log(this.encounterForm.value)
    
    if(this.isSocial){
      const socialEncounter = {
        encounterId: 0,
        name: this.encounterForm.value.name || '',
        description: this.encounterForm.value.description || '',
        xpPoints: this.encounterForm.value.xpPoints || 0,
        status: this.status,
        type: this.encounterForm.value.type || 'MISC',
        latitude: 0,
        longitude:  0,
        id: 0,
        touristsRequiredForCompletion: this.encounterForm.value.touristsRequiredForCompletion || 1,
        distanceTreshold: this.encounterForm.value.distanceTreshold || 200,
        touristIDs: [],
        shouldBeApproved: this.shouldBeApproved
      }
      this.mapService.coordinate$.subscribe((coordinates) => {
        socialEncounter.latitude = coordinates.lat;
        socialEncounter.longitude = coordinates.lng;
      });
      this.service.addSocialEncounter(socialEncounter).subscribe({
        next: (_) => {
          this.encountersUpdated.emit();
          this.encounterForm.reset();
        }
      });

    }else if(this.isLocation){
      const hiddenLocationEncounter = {
        id: 0,
        name: this.encounterForm.value.name || '',
        description: this.encounterForm.value.description || '',
        xpPoints: this.encounterForm.value.xpPoints || 0,
        status: this.status,
        type: this.encounterForm.value.type || 'MISC',
        latitude: 0,
        longitude:  0,
        encounterId: 0,
        imageURL: this.encounterForm.value.imageURL || '',
        imageLatitude: 0,
        imageLongitude:  0,
        distanceTreshold: this.encounterForm.value.distanceTreshold || 200,
        shouldBeApproved: this.shouldBeApproved
      }
      this.mapService.coordinate$.subscribe((coordinates) => {
        hiddenLocationEncounter.latitude = this.temporaryLatitude;
        hiddenLocationEncounter.longitude = this.temporaryLongitude;
        hiddenLocationEncounter.imageLatitude = coordinates.lat;
        hiddenLocationEncounter.imageLongitude = coordinates.lng;
      });
      this.service.addHiddenLocationEncounter(hiddenLocationEncounter).subscribe({
        next: (_) => {
          this.encountersUpdated.emit();
          this.encounterForm.reset();
        }
      });
    }else{
      const encounter = {
        id: 0,
        name: this.encounterForm.value.name || '',
        description: this.encounterForm.value.description || '',
        xpPoints: this.encounterForm.value.xpPoints || 0,
        status: this.status,
        type: this.encounterForm.value.type || 'MISC',
        latitude: 0,
        longitude:  0,
        shouldBeApproved: this.shouldBeApproved
      }
      this.mapService.coordinate$.subscribe((coordinates) => {
        encounter.latitude = coordinates.lat;
        encounter.longitude = coordinates.lng;
      });
      this.service.addEncounter(encounter).subscribe({
        next: (_) => {
          this.encountersUpdated.emit();
          this.encounterForm.reset();
        }
      });
      
    }

  }

  addEncounterDraft(): void{
    console.log(this.encounterForm.value)

    if(this.isSocial){
      const socialEncounter = {
        encounterId: 0,
        name: this.encounterForm.value.name || '',
        description: this.encounterForm.value.description || '',
        xpPoints: this.encounterForm.value.xpPoints || 0,
        status: 'DRAFT',
        type: this.encounterForm.value.type || 'MISC',
        latitude: 0,
        longitude:  0,
        id: 0,
        touristsRequiredForCompletion: this.encounterForm.value.touristsRequiredForCompletion || 1,
        distanceTreshold: this.encounterForm.value.distanceTreshold || 200,
        touristIDs: [],
        shouldBeApproved: this.shouldBeApproved
      }
      this.mapService.coordinate$.subscribe((coordinates) => {
        socialEncounter.latitude = coordinates.lat;
        socialEncounter.longitude = coordinates.lng;
      });
      this.service.addSocialEncounter(socialEncounter).subscribe({
        next: (_) => {
          this.encountersUpdated.emit();
          this.encounterForm.reset();
        }
      });

    }else if(this.isLocation){
      const hiddenLocationEncounter = {
        id: 0,
        name: this.encounterForm.value.name || '',
        description: this.encounterForm.value.description || '',
        xpPoints: this.encounterForm.value.xpPoints || 0,
        status: 'DRAFT',
        type: this.encounterForm.value.type || 'MISC',
        latitude: 0,
        longitude:  0,
        encounterId: 0,
        imageURL: this.encounterForm.value.imageURL || '',
        imageLatitude: 0,
        imageLongitude:  0,
        distanceTreshold: this.encounterForm.value.distanceTreshold || 200,
        shouldBeApproved: this.shouldBeApproved
      }
      this.mapService.coordinate$.subscribe((coordinates) => {
        hiddenLocationEncounter.latitude = this.temporaryLatitude;
        hiddenLocationEncounter.longitude = this.temporaryLongitude;
        hiddenLocationEncounter.imageLatitude = coordinates.lat;
        hiddenLocationEncounter.imageLongitude = coordinates.lng;
      });
      this.service.addHiddenLocationEncounter(hiddenLocationEncounter).subscribe({
        next: (_) => {
          this.encountersUpdated.emit();
          this.encounterForm.reset();
        }
      });
    }else{
      const encounter = {
        id: 0,
        name: this.encounterForm.value.name || '',
        description: this.encounterForm.value.description || '',
        xpPoints: this.encounterForm.value.xpPoints || 0,
        status: 'DRAFT',
        type: this.encounterForm.value.type || 'MISC',
        latitude: 0,
        longitude:  0,
        shouldBeApproved: this.shouldBeApproved
      }
      this.mapService.coordinate$.subscribe((coordinates) => {
        encounter.latitude = coordinates.lat;
        encounter.longitude = coordinates.lng;
      });
      this.service.addEncounter(encounter).subscribe({
        next: (_) => {
          this.encountersUpdated.emit();
          this.encounterForm.reset();
        }
      }); 
    }
  }

  postEncounterDraft(): void{
    console.log(this.encounterForm.value)
    
    if(this.isSocial){
      const socialEncounter = {
        encounterId: this.encounter.id,
        name: this.encounterForm.value.name || '',
        description: this.encounterForm.value.description || '',
        xpPoints: this.encounterForm.value.xpPoints || 0,
        status: 'ACTIVE',
        type: this.encounterForm.value.type || 'MISC',
        latitude: 0,
        longitude:  0,
        id: 0,
        touristsRequiredForCompletion: this.encounterForm.value.touristsRequiredForCompletion || 1,
        distanceTreshold: this.encounterForm.value.distanceTreshold || 200,
        touristIDs: [] as number[],
        shouldBeApproved: this.shouldBeApproved
      }
      this.mapService.coordinate$.subscribe((coordinates) => {
        socialEncounter.latitude = coordinates.lat;
        socialEncounter.longitude = coordinates.lng;
      });
      this.service.getSocialEncounters().subscribe({
        next: (result: PagedResults<ShortSocialEncounter>) => {
          var socialEncounters = result.results;
          const shortSocialEncounter = socialEncounters.find(
            (social) => social.encounterId === this.encounter.id
          );
          if(shortSocialEncounter){
            socialEncounter.id = shortSocialEncounter!.id;
            socialEncounter.touristIDs = shortSocialEncounter!.touristIDs as number[];
          }else{
            console.log('Cant find social encounter');
          }
          this.service.updateSocialEncounter(socialEncounter).subscribe({
            next: (_) => {
              this.encountersUpdated.emit();
              this.encounterForm.reset();
            }
          });
        },
      })
    }else if(this.isLocation){
      const hiddenLocationEncounter = {
        id: 0,
        name: this.encounterForm.value.name || '',
        description: this.encounterForm.value.description || '',
        xpPoints: this.encounterForm.value.xpPoints || 0,
        status: 'ACTIVE',
        type: this.encounterForm.value.type || 'MISC',
        latitude: 0,
        longitude:  0,
        encounterId: this.encounter.id,
        imageURL: this.encounterForm.value.imageURL || '',
        imageLatitude: 0,
        imageLongitude:  0,
        distanceTreshold: this.encounterForm.value.distanceTreshold || 200,
        shouldBeApproved: this.shouldBeApproved
      }
      this.mapService.coordinate$.subscribe((coordinates) => {
        hiddenLocationEncounter.latitude = this.temporaryLatitude;
        hiddenLocationEncounter.longitude = this.temporaryLongitude;
        hiddenLocationEncounter.imageLatitude = coordinates.lat;
        hiddenLocationEncounter.imageLongitude = coordinates.lng;
      });
      this.service.getHiddenLocationEncounters().subscribe({
        next: (result: PagedResults<ShortHiddenLocationEncounter>) => {
          var hiddenLocationEncounters = result.results;
          const shortHiddenLocationEncounter = hiddenLocationEncounters.find(
            (hidden) => hidden.encounterId === this.encounter.id
          );
          if(shortHiddenLocationEncounter){
            hiddenLocationEncounter.id = shortHiddenLocationEncounter!.id;
          }else{
            console.log('Cant find hidden location encounter');
          }
          this.service.updateHiddenLocationEncounter(hiddenLocationEncounter).subscribe({
            next: (_) => {
              this.encountersUpdated.emit();
              this.encounterForm.reset();
            }
          });
        },
      })
    }else{
      const encounter = {
        id: this.encounter.id,
        name: this.encounterForm.value.name || '',
        description: this.encounterForm.value.description || '',
        xpPoints: this.encounterForm.value.xpPoints || 0,
        status: 'ACTIVE',
        type: this.encounterForm.value.type || 'MISC',
        latitude: 0,
        longitude:  0,
        shouldBeApproved: this.shouldBeApproved
      }
      this.mapService.coordinate$.subscribe((coordinates) => {
        encounter.latitude = coordinates.lat;
        encounter.longitude = coordinates.lng;
      });
      this.service.updateEncounter(encounter).subscribe({
        next: (_) => {
          this.encountersUpdated.emit();
          this.encounterForm.reset();
        }
      });
    }
  }

  updateEncounter(): void{
    if(this.isSocial){
      const socialEncounter = {
        encounterId: this.encounter.id,
        name: this.encounterForm.value.name || '',
        description: this.encounterForm.value.description || '',
        xpPoints: this.encounterForm.value.xpPoints || 0,
        status: this.encounter.status,
        type: this.encounterForm.value.type || 'MISC',
        latitude: 0,
        longitude:  0,
        id: 0,
        touristsRequiredForCompletion: this.encounterForm.value.touristsRequiredForCompletion || 1,
        distanceTreshold: this.encounterForm.value.distanceTreshold || 200,
        touristIDs: [] as number[],
        shouldBeApproved: this.shouldBeApproved
      }
      this.mapService.coordinate$.subscribe((coordinates) => {
        socialEncounter.latitude = coordinates.lat;
        socialEncounter.longitude = coordinates.lng;
      });
      this.service.getSocialEncounters().subscribe({
        next: (result: PagedResults<ShortSocialEncounter>) => {
          var socialEncounters = result.results;
          const shortSocialEncounter = socialEncounters.find(
            (social) => social.encounterId === this.encounter.id
          );
          if(shortSocialEncounter){
            socialEncounter.id = shortSocialEncounter!.id;
            socialEncounter.touristIDs = shortSocialEncounter!.touristIDs as number[];
          }else{
            console.log('Cant find social encounter');
          }
          this.service.updateSocialEncounter(socialEncounter).subscribe({
            next: (_) => {
              this.encountersUpdated.emit();
            }
          });
            
        },
      })
    }else if(this.isLocation){
      const hiddenLocationEncounter = {
        id: 0,
        name: this.encounterForm.value.name || '',
        description: this.encounterForm.value.description || '',
        xpPoints: this.encounterForm.value.xpPoints || 0,
        status: this.encounter.status,
        type: this.encounterForm.value.type || 'MISC',
        latitude: 0,
        longitude:  0,
        encounterId: this.encounter.id,
        imageURL: this.encounterForm.value.imageURL || '',
        imageLatitude: 0,
        imageLongitude:  0,
        distanceTreshold: this.encounterForm.value.distanceTreshold || 200,
        shouldBeApproved: this.shouldBeApproved
      }
      this.mapService.coordinate$.subscribe((coordinates) => {
        hiddenLocationEncounter.latitude = this.temporaryLatitude;
        hiddenLocationEncounter.longitude = this.temporaryLongitude;
        hiddenLocationEncounter.imageLatitude = coordinates.lat;
        hiddenLocationEncounter.imageLongitude = coordinates.lng;
      });
      this.service.getHiddenLocationEncounters().subscribe({
        next: (result: PagedResults<ShortHiddenLocationEncounter>) => {
          var hiddenLocationEncounters = result.results;
          const shortHiddenLocationEncounter = hiddenLocationEncounters.find(
            (hidden) => hidden.encounterId === this.encounter.id
          );
          if(shortHiddenLocationEncounter){
            hiddenLocationEncounter.id = shortHiddenLocationEncounter!.id;
          }else{
            console.log('Cant find hidden location encounter');
          }
          this.service.updateHiddenLocationEncounter(hiddenLocationEncounter).subscribe({
            next: (_) => {
              this.encountersUpdated.emit();
            }
          });
        },
      })
    }else{
      const encounter = {
        id: this.encounter.id,
        name: this.encounterForm.value.name || '',
        description: this.encounterForm.value.description || '',
        xpPoints: this.encounterForm.value.xpPoints || 0,
        status: this.encounter.status,
        type: this.encounterForm.value.type || 'MISC',
        latitude: 0,
        longitude:  0,
        shouldBeApproved: this.shouldBeApproved
        }
      this.mapService.coordinate$.subscribe((coordinates) => {
        encounter.latitude = coordinates.lat;
        encounter.longitude = coordinates.lng;
      });
      this.service.updateEncounter(encounter).subscribe({
        next: (_) => {
          this.encountersUpdated.emit();
        }
      });
   }
  }

  onTypeClick(selectedType: string): void {
    console.log('onTypeClick called with:', selectedType);
    this.isSocial = selectedType === 'SOCIAL';
    this.isLocation = selectedType === 'LOCATION';

    this.encounterForm.get('distanceTreshold')!.reset();
    this.encounterForm.get('touristsRequiredForCompletion')!.reset();
    this.encounterForm.get('imageURL')!.reset();
    this.encounterForm.get('distanceTreshold')!.clearValidators();
    this.encounterForm.get('touristsRequiredForCompletion')!.clearValidators();
    this.encounterForm.get('imageURL')!.clearValidators();

    if (this.isSocial) {
      // Add required validators for SOCIAL
      this.encounterForm.get('distanceTreshold')!.setValidators([Validators.required]);
      this.encounterForm.get('touristsRequiredForCompletion')!.setValidators([Validators.required]);
    } else if (this.isLocation) {
      // Add required validators for LOCATION if needed
      this.encounterForm.get('distanceTreshold')!.setValidators([Validators.required]);
      this.encounterForm.get('imageURL')!.setValidators([Validators.required]);
    }

    // Update validators and trigger validation
    this.encounterForm.get('distanceTreshold')!.updateValueAndValidity();
    this.encounterForm.get('touristsRequiredForCompletion')!.updateValueAndValidity();
    this.encounterForm.get('imageURL')!.updateValueAndValidity();

    console.log('isLocation:', this.isLocation);
    console.log('isSocial:', this.isSocial);
  }

  selectLocation(): void{
    this.mapService.coordinate$.pipe(take(1)).subscribe((coordinates) => {
      this.temporaryLatitude = coordinates.lat;
      this.temporaryLongitude = coordinates.lng;
      
      console.log('PRIVREMENO');
      console.log(this.temporaryLatitude);
      console.log(this.temporaryLongitude);
    });
  }

}
