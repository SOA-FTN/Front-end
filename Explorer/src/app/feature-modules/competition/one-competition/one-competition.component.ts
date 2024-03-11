import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompetitionServiceService } from '../competition-service.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { CompetitionApply } from '../model/competitionApply.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { AdministrationService } from '../../administration/administration.service';
import { Profile } from '../../administration/model/profile.model';
import {User} from "../../../infrastructure/auth/model/user.model";

interface ExtendedCompetitionApply extends CompetitionApply {
  userName?: string;
  userLastName?: string;
  selected?: boolean;
  notHis?: boolean;
}

@Component({
  selector: 'xp-one-competition',
  templateUrl: './one-competition.component.html',
  styleUrls: ['./one-competition.component.css']
})
export class OneCompetitionComponent implements OnInit {

  competitionId: number | 0;
  competitionApplies: ExtendedCompetitionApply[] = [];
  isClicked: boolean = false;
  //apply: CompetitionApply;
  shouldRenderForm: boolean = false;
  isTourist: boolean = false;
  user: User | undefined;
  userId: number | 0;

  constructor(private route: ActivatedRoute, private competitionService: CompetitionServiceService, private userService: AdministrationService, private router: Router, private authService: AuthService){}

  ngOnInit(): void {
    this.competitionId = +this.route.snapshot.paramMap.get('id')!;
    this.authService.user$.subscribe((user) => {
      this.user = user;
      this.userId = user.id;
    });
    if(this.user?.role == "tourist"){
      this.isTourist = true;
    }
    this.getApplies();
  }

  getApplies() : void {
    this.competitionService.getAppliesByComp(this.competitionId).subscribe({
      next: (applies: PagedResults<ExtendedCompetitionApply>) => {
        this.competitionApplies = applies.results;
        this.competitionApplies.forEach(apply => {
            this.userService.getProfile(apply.userId).subscribe({
              next: (data: Profile) => {
                apply.userName = data.name;
                apply.userLastName = data.surname;
                apply.selected = false;
                if(apply.userId == this.userId){
                  apply.notHis = false;
                }
                else{
                  apply.notHis = true;
                }
              }
            })
        });
      }
    })
  }

  selectApply(apply: ExtendedCompetitionApply) : void {
    if(apply.selected == true){
      apply.selected = false;
      console.log(apply.numLikes);
      apply.numLikes -= 1;
      this.competitionService.updateApply(apply).subscribe({
        next: (apply : CompetitionApply) => {
          console.log(apply.numLikes);
        }
      })
    }
    else if(apply.selected == false){
      apply.selected = true;
      console.log(apply.numLikes);
      apply.numLikes += 1;
      this.competitionService.updateApply(apply).subscribe({
        next: (apply : CompetitionApply) => {
          console.log(apply.numLikes);
        }
      })
      //this.selectedTours.push(tour);
    }
  }


  closeForm(): void{
    this.shouldRenderForm = false;
  }

  apply(): void {
    //this.router.navigate(['/apply/', this.competitionId]);
    this.shouldRenderForm = true;
  }
}
