import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ClubService } from '../club.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { TokenStorage } from 'src/app/infrastructure/auth/jwt/token.service';
import { Club } from '../model/club.model';

@Component({
  selector: 'xp-club-card',
  templateUrl: './club-card.component.html',
  styleUrls: ['./club-card.component.css']
})
export class ClubCardComponent implements OnInit {
  @Output() editClicked: EventEmitter<Club> = new EventEmitter<Club>();
  @Output() deleteClicked: EventEmitter<Club> = new EventEmitter<Club>();
  constructor(
              private tokenStorage: TokenStorage,
              private service: ClubService) {}

  @Input() club: Club;
  ngOnInit(): void {

  }
  onEditClicked(club: Club): void{
    this.editClicked.emit(club);
  }
  onDeleteClicked(club: Club): void{
    this.deleteClicked.emit(club);
  }
}
