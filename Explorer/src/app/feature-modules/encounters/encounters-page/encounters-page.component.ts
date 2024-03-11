import { Component, OnInit } from '@angular/core';
import { Encounter } from '../model/encounter.model';
import { EncountersService } from '../encounters.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { SocialEncounter } from '../model/social-encounter.model';
import { HiddenLocationEncounter } from '../model/hidden-location-encounter.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-encounters-page',
  templateUrl: './encounters-page.component.html',
  styleUrls: ['./encounters-page.component.css']
})
export class EncountersPageComponent implements OnInit {
  
  encounters: Encounter[] = [];
  selectedEncounter: Encounter;
  shouldEdit: boolean = false;
  shouldEditDraft: boolean = false;
  Social: boolean = false;
  Location: boolean = false;
  user: User | undefined;
  approved: boolean = false;

  constructor(private service: EncountersService, private authService: AuthService){ }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
    this.getEncounters(); 
  }

  getEncounters(): void{
    this.service.getEncounters().subscribe({
      next: (result: PagedResults<Encounter>) => {
        this.encounters = result.results;
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }

  onApproveClicked(encounter: Encounter): void{
    const updatedEncounter = {
      id: encounter.id,
      name: encounter.name,
      description: encounter.description,
      xpPoints: encounter.xpPoints,
      status: 'ACTIVE',
      type: encounter.type,
      latitude: encounter.latitude,
      longitude: encounter.longitude,
      shouldBeApproved: false
    }

    this.service.updateEncounter(updatedEncounter).subscribe({
      next: (_) => {
        this.getEncounters();
      }
    })
    this.approved = true;
  }

  onEditClicked(encounter: Encounter): void{
    console.log(encounter);
    this.selectedEncounter = encounter;
    this.Social = encounter.type === "SOCIAL";
    this.Location = encounter.type === "LOCATION";
    console.log(this.Location)
    console.log(this.Social);
    console.log("WOW");
    this.shouldEdit = true;
    this.shouldEditDraft = true;
    if(encounter.status != 'DRAFT'){
      this.shouldEditDraft = false;
    }
  }

  onDeleteClicked(encounter: Encounter): void{
    this.service.deleteEncounter(encounter).subscribe({
      next: (_) => {
        this.getEncounters();
      }
    });
  }

  onAddClicked(): void{
    this.shouldEdit = false;
    this.shouldEditDraft = false;
  }

  onArchiveClicked(encounter: Encounter): void{

    const updatedEncounter = {
      id: encounter.id,
      name: encounter.name,
      description: encounter.description,
      xpPoints: encounter.xpPoints,
      status: 'ARCHIVED',
      type: encounter.type,
      latitude: encounter.latitude,
      longitude: encounter.longitude,
      shouldBeApproved: encounter.shouldBeApproved
    }

    this.service.updateEncounter(updatedEncounter).subscribe({
      next: (_) => {
        this.getEncounters();
      }
    })
  }
}
