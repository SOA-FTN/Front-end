import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Club } from '../model/club.model';
import { ClubService } from '../club.service';
import { TokenStorage } from 'src/app/infrastructure/auth/jwt/token.service';

@Component({
  selector: 'xp-club-form',
  templateUrl: './club-form.component.html',
  styleUrls: ['./club-form.component.css']
})
export class ClubFormComponent implements OnChanges{

  @Output() clubUpdated = new EventEmitter<null>();
  @Input() club: Club;
  @Input() shouldEdit: boolean = false;
  constructor(private tokenStorage: TokenStorage, private service: ClubService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.clubForm.reset();
    if(this.shouldEdit){
      this.clubForm.patchValue(this.club)
    }
    this.clubForm.patchValue(this.club)
  }

  clubForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    image: new FormControl('', [Validators.required])
  })

  addClub(): void {
    const club: Partial<Club> = {
      name: this.clubForm.value.name || "",
      description: this.clubForm.value.description || "",
      image: this.clubForm.value.image || "", 
      ownerId: this.tokenStorage.getUserId()
    }
    this.service.addClub(club as Club).subscribe({
      next: () => {
        this.clubUpdated.emit()
      }
    });
  }

  updateClub(): void {
    const club: Club = {
      name: this.clubForm.value.name || "",
      description: this.clubForm.value.description || "",
      image: this.clubForm.value.image || "",
      ownerId: this.tokenStorage.getUserId()
    }
    club.id = this.club.id;
    this.service.updateClub(club).subscribe({
      next: (_) => {
        this.clubUpdated.emit()
      }
    })
  }
}
