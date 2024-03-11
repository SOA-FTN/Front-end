import { Component, OnChanges,
  SimpleChanges,Output,EventEmitter } from '@angular/core';
import { TokenStorage } from 'src/app/infrastructure/auth/jwt/token.service';
import { Router } from '@angular/router';
import { MapService } from 'src/app/shared/map/map.service';
import { UserPosition } from '../../administration/model/userPosition.model';
import { EncounterExecution } from '../model/encounter-execution.model';
import { EncountersService } from '../encounters.service';
import { AdministrationService } from '../../administration/administration.service';
import { FormControl, FormGroup, Validators,AbstractControl } from '@angular/forms';
import { Encounter } from '../model/encounter.model';
import { HiddenLocationEncounter } from '../model/hidden-location-encounter.model';
import { ShortHiddenLocationEncounter } from '../model/short-hidden-location-encounter.model';
@Component({
  selector: 'xp-activated-execution',
  templateUrl: './activated-execution.component.html',
  styleUrls: ['./activated-execution.component.css']
})
export class ActivatedExecutionComponent implements OnChanges {
  activeEncounter:EncounterExecution;
  encounter: Encounter;
  userId: number = this.tokenStorage.getUserId();
  shouldEdit:boolean
  idPosition:number|undefined
  userPosition:UserPosition;
  executions: EncounterExecution[] = [];
  private pollingInterval: any;
  @Output() positionUpdated=new EventEmitter<null>();
  isSocial:boolean=false;
  isLocation:boolean=false;
  isMisc:boolean=false;
  isHiddenInRange: boolean;
  hiddenCount: number = 0;
  hiddenLocationEncounter:ShortHiddenLocationEncounter;
  showPicture: boolean = false;


  constructor(private service:EncountersService,
    private tokenStorage: TokenStorage,
    private router:Router,
    private mapService:MapService,
    private administrationService:AdministrationService
   
){
}

  userPositionForm = new FormGroup({
    latitude: new FormControl(0, [Validators.required]),
    longitude: new FormControl(0, [Validators.required]),
  });

  ngOnChanges(changes: SimpleChanges): void {
    
  }

  

  ngOnInit(): void {
    this.checkUserPosition();
    this.getEncounterExecutionByUser(this.userId);
    
    this.startPolling();
  }

  ngAfterInit(): void{
    this.getEncounterById(this.activeEncounter.id);
    this.checkEncounterType();
    
  }

  private startPolling(): void {
    this.pollingInterval = setInterval(() => {
    this.getEncounterById(this.activeEncounter.encounterId);
    if(this.encounter.type === "SOCIAL"){
      
      this.checkSocialEncounter(this.activeEncounter.encounterId);
      if(this.activeEncounter.isCompleted){
        alert('You completed this challenge ! ');
        this.router.navigate(['/encounterMap']);
      }
    }
    if(this.encounter.type === "LOCATION"){
      
      this.checkHiddenEncounter();
      console.log(this.hiddenLocationEncounter.imageURL)
    }
    
      
    }, 5000);
  }

  checkUserPosition(): void {
    this.administrationService.getByUserId(this.tokenStorage.getUserId(), 0, 0).subscribe(
      (result) => {
        this.shouldEdit = result != null; 
        this.idPosition = result ? result.id : undefined; 
      },
      (error) => {
        console.error('Error fetching user positions:', error);
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
  
    this.administrationService.getByUserId(this.tokenStorage.getUserId(), 0, 0).subscribe(
      (result) => {
        this.idPosition = result ? result.id : undefined;
      },
      (error) => {
        console.error('Error fetching user positions:', error);
      }
    );

    userPosition.id=this.idPosition;

    this.mapService.coordinate$.subscribe((coordinates) => {
      userPosition.latitude = coordinates.lat;
      userPosition.longitude = coordinates.lng;
    });
    this.administrationService.updateUserPosition(userPosition).subscribe({
      next: (_) => {
        this.positionUpdated.emit();
      },
    });
  }

  
  updatePositions(event:MouseEvent):void{
    this.updateUserPosition();
  }

  getEncounterExecutionByUser(userId: number) : void{
    this.service.getByUser(8);
    this.service.getByUser(userId).subscribe(
      (result) => {
        this.activeEncounter = result;
        console.log("Active encounter: ",this.activeEncounter); 
      },
      (error) => {
        console.error('Error fetching TourExecution', error);
      }
    );
  }

  getEncounterById(encounterId: number) : void{
    this.service.getEncounterById(encounterId).subscribe(
      (result) => {
        this.encounter = result;
        console.log("Encounter: ",this.encounter); 
      },
      (error) => {
        console.error('Error fetching TourExecution', error);
      }
    );
    this.checkEncounterType();
    this.fetchHiddenLocation(this.encounter.id);
  }

  checkSocialEncounter(encounterId: number) : void{
    this.service.checkSocialEncounter(encounterId).subscribe(
      (result) => {
        this.executions = result.results;
        console.log("Executionss: ",this.executions); 
        this.updateSocialExecution();
      },
      (error) => {
        console.error('Error fetching TourExecution', error);
      }
    );
  }

  checkHiddenEncounter(){
    this.service.checkHiddenEncounter(this.activeEncounter.id, this.encounter.id).subscribe(
      (result: boolean) => {
        this.isHiddenInRange = result;
        console.log("Is Hidden: ", this.isHiddenInRange);
        if(this.isHiddenInRange){
          this.hiddenCount += 1;
          console.log("Hidden count:", this.hiddenCount)
          if(this.hiddenCount == 2){
            this.completeExecution();
          }
        }else{
          this.hiddenCount = 0;
          console.log("Hidden count:", this.hiddenCount)
        }
      },
      (error: any) => {
        console.error('Error checking boolean value', error);
      }
    );
  }

  completeExecution():void{
    this.service.completeExecution(this.userId).subscribe(
      (result) => {
        console.log("Executionss: ",this.executions); 
      },
      (error) => {
        console.error('Error', error);
      }
    );
    alert('You completed this challenge ! ');
    this.router.navigate(['/encounterMap']);
  }

  updateSocialExecution() : void{
    this.executions.forEach(ex => {
      if (ex.id === this.activeEncounter.id) {
        this.activeEncounter = ex;
        console.log("Nadjen: ", ex);
      }
    });
  }

   checkEncounterType():void{
    if(this.encounter.type=="SOCIAL"){
        this.isSocial=true;
        this.isLocation=false;
        this.isMisc=false;
    }
    else if(this.encounter.type=="LOCATION"){
        this.isLocation=true;
        this.isSocial=false;
        this.isMisc=false;
    }
    else{
      this.isMisc=true;
      this.isSocial=false;
      this.isLocation=false;
    }
   }


  ngOnDestroy(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  }

  fetchHiddenLocation(encounterId: number): void {
    if(this.encounter.type=="LOCATION"){
    this.service.getHiddenLocationEncounterByEncounterId(encounterId)
      .subscribe(
        (result) => {
          this.hiddenLocationEncounter=result;
          console.log(this.hiddenLocationEncounter);
        },
        (error) => {
          // Handle errors if any
          console.error('Error fetching hidden location encounter:', error);
        }
      );
      }
    }


    togglePicture() {
      this.showPicture = !this.showPicture;
    }
}
