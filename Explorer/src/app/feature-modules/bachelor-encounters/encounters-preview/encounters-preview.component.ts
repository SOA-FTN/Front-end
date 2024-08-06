import { Component, OnInit } from '@angular/core';
import { BachelorEncounter } from '../model/bachelor-encounters.model';
import { BachelorEncounterServiceService } from '../bachelor-encounter-service.service';

@Component({
  selector: 'xp-encounters-preview',
  templateUrl: './encounters-preview.component.html',
  styleUrls: ['./encounters-preview.component.css'],
})
export class EncountersPreviewComponent implements OnInit {
  allEncounters: BachelorEncounter[] = [];

  constructor(private encountersService: BachelorEncounterServiceService) {}

  ngOnInit(): void {
    this.encountersService.getAllEncounters().subscribe({
      next: (data: BachelorEncounter[]) => {
        this.allEncounters = data;
        console.log(this.allEncounters);
      },
    });
  }
}
