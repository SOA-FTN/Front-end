import { Component, OnInit } from '@angular/core';
import { Problem } from '../model/problem.model';
import { MarketplaceService } from '../marketplace.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Time } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';
import { forkJoin } from 'rxjs';
import { Status, Tour } from '../../tour-authoring/tour/model/tour.model';
import { ProblemMessage } from '../model/problem-message.model';

interface ExtendedProblem extends Problem {
  isUnsolvedForMoreThan5Days?: boolean;
  deadlineMissed?: boolean;
}

@Component({
  selector: 'xp-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.css']
})
export class ProblemComponent implements OnInit {
  
  problem: ExtendedProblem[] = [];
  selectedProblem: Problem;
  user: User;
  shouldRenderForm: boolean = false;
  shouldRenderChat: boolean = false;
  anyMessages: boolean = false;
  showSolveProblemButton: boolean = true;
  isSolving: boolean = false;
  disabledRows: number[] = [];
  isTourist: boolean = false;
  isAdministartor: boolean = false;
  shouldRenderDeadline: boolean = false;
  newMessProbId: number = 0;
  

  constructor(private service: MarketplaceService, private authService: AuthService, private dialog: MatDialog, private authoringService: TourAuthoringService) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });

    this.getProblems();

    this.isThereNewMessages();
  } 

  getProblems() : void{
    if(this.user.role == 'author'){
      this.getGuideProblems();
    }
    else if(this.user.role == 'tourist'){
      this.isTourist = true;
      this.getTourstProblems();
    }
    else if(this.user.role == 'administrator'){
      this.isAdministartor = true;
      this.getUnsolvedProblems();
    }

  }

  getUnsolvedProblems(): void {
    this.shouldRenderForm = false;
    this.shouldRenderChat = false;
    this.shouldRenderDeadline = false;
    this.service.getUnsolvedProblems().subscribe({
      next: (result: PagedResults<Problem>) => {
        this.problem = result.results;
        this.calculateUnsolvedForMoreThan5Days();
        this.deadlineMissedUnsolved();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  deadlineMissedUnsolved(): void {
    const currentDate = new Date();
    this.problem.forEach((problem) => {
      if (!problem.isSolved) {
        const problemDeadline = this.getDateFromValue(problem.deadline);
  
        if (problemDeadline && this.isSameDate(currentDate, problemDeadline)) {
          problem.deadlineMissed = true;
        }
      }
    });
  }
  
  private isSameDate(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() >= date2.getFullYear() &&
      date1.getMonth() >= date2.getMonth() &&
      date1.getDate() >= date2.getDate()
    );
  }

  calculateUnsolvedForMoreThan5Days(): void {
    const currentDate = new Date();
    this.problem.forEach((problem) => {

    const problemTime = this.getDateFromValue(problem.time);
      
      if (problemTime) {
        const timeDifference = currentDate.getTime() - problemTime.getTime();
        const daysDifference = timeDifference / (1000 * 3600 * 24);
        problem.isUnsolvedForMoreThan5Days = !problem.isSolved && daysDifference > 5;
      }
    });
  }

  private getDateFromValue(value: Time | Date): Date | null {
    if (value instanceof Date) {
      return value;
    } else if (typeof value === 'string') {
      return new Date(value);
    }
    return null;
  }


  getTourstProblems(): void {
    this.shouldRenderForm = false;
    this.shouldRenderChat = false;
    this.shouldRenderDeadline = false;
    this.service.getTourstProblems(this.user.id).subscribe({
      next: (result: PagedResults<Problem>) => {
        this.problem = result.results;
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }

  isThereNewMessages() {
    this.service.isThereUnreadMessage(this.user.id || 0).subscribe(
      (idProblem: number) => {
        this.newMessProbId = idProblem;
      }
    )
  }

  getGuideProblems(): void {
    this.shouldRenderForm = false;
    this.shouldRenderChat = false;
    this.shouldRenderDeadline = false;
    this.service.getGuideProblems(this.user.id).subscribe({
      next: (result: PagedResults<Problem>) => {
        this.problem = result.results;
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }

  archiveTour(prob: Problem): void {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        message: 'Do you want to turn off tour that has this problem because the deadline is missed?',
      },
    });
  
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.authoringService.getTourByTourId(prob.idTour).subscribe({
          next: (tour: Tour) => {
            tour.status = Status.Archived;
            console.log(tour);
  
            this.authoringService.updateTour(tour).subscribe({
              next: (updateTourResult) => {
                console.log('Update Tour Result:', updateTourResult);
  
                this.service.deleteProblem(prob).subscribe({
                  next: (deleteProblemResult) => {
                    console.log('Delete Problem Result:', deleteProblemResult);
                    this.getUnsolvedProblems();
                  },
                  error: (deleteProblemError) => {
                    console.error('Error deleting problem:', deleteProblemError);
                  }
                });
              },
              error: (updateTourError) => {
                console.error('Error updating tour:', updateTourError);
              }
            });
          }
        });
      }
    });
  }
  


  deleteProblem(prob: Problem): void {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        message: 'Do you want to turn off this problem because the deadline is missed?',
      },
    });
  
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.service.deleteProblem(prob).subscribe({
          next: (_) => {
            this.getUnsolvedProblems();
          }
        });
      }
    });
  }
  

  onProblemReplay(prob : Problem): void {
    this.selectedProblem = prob;
    this.shouldRenderForm = true;
    this.shouldRenderChat = false;
  }

  onAllMesagges(prob: Problem): void{
    this.selectedProblem = prob;
    this.shouldRenderChat = true;
    this.shouldRenderForm = false;
  }

  addDeadline(prob: Problem): void{
    this.selectedProblem = prob;
    this.shouldRenderDeadline = true;
    this.shouldRenderChat = false;
    this.shouldRenderForm = false;
  }

  solveProblem(prob: Problem, index: number): void {

    if (this.isSolving) {
      return;
    }

    this.isSolving = true;
    this.selectedProblem = prob;
    this.shouldRenderChat = false;
    this.shouldRenderForm = false;
    this.selectedProblem.isSolved = true;
    this.showSolveProblemButton = false;
    this.disabledRows.push(index);
    
  
    this.service.updateProblemIsSolved(this.selectedProblem).subscribe(
      () => {
        console.log('Problem isSolved updated successfully.');
      },
      (error) => {
        console.error('Error updating problem isSolved:', error);
      },
      () => {
        this.isSolving = false;
      
        this.service.getMessagesByProblemId(this.selectedProblem.id || 0).subscribe({
          next: (result: PagedResults<ProblemMessage>) => {
            console.log("duzina result-a: ", result.totalCount);
            result.results.forEach(mess => {
              mess.isRead = true;
              this.service.readMessages(mess).subscribe();
          });
      }
    }) 
   });

  }
  
}

@Component({
  selector: 'app-confirmation-dialog',
  template: `
  <!-- Vaš dijalog -->
  <h2 mat-dialog-title class="custom-title">{{ data.title }}</h2>
  <div mat-dialog-content class="custom-content">{{ data.message }}</div>
  <div mat-dialog-actions class="custom-actions">
    <div class="button-container">
      <button mat-button class="custom-button" (click)="onConfirm()">Yes</button>
    </div>
    <div class="button-container">
      <button mat-button class="custom-button" (click)="onCancel()">No</button>
    </div>
  </div>

  
  `,
  styles: [`/* styles.css */

  /* Stilizacija dijaloga */
  .mat-dialog-container.custom-dialog {
    max-width: 500px; /* Postavite maksimalnu širinu dijaloga prema potrebi */
    background-color: #e0e0e0; /* Siva boja pozadine (primer) */
  }
  
  /* Stilizacija naslova dijaloga */
  .mat-dialog-title.custom-title {
    font-size: 24px; /* Povećajte veličinu fonta naslova prema potrebi */
    color: #333; /* Boja teksta naslova (primer) */
  }
  
  /* Stilizacija sadržaja dijaloga */
  .mat-dialog-content.custom-content {
    font-size: 18px; /* Povećajte veličinu fonta sadržaja prema potrebi */
    color: #333; /* Boja teksta sadržaja (primer) */
  }
  
  /* Stilizacija akcija dijaloga */
  .mat-dialog-actions.custom-actions {
    justify-content: flex-end; /* Pomeranje akcija na desnu stranu */
  }
  
  /* Stilizacija dugmadi dijaloga */
  button.mat-button.custom-button {
    margin-left: 8px; /* Dodajte razmak između dugmadi prema potrebi */
    background-color: #3498db; /* Plava boja dugmadi (primer) */
    color: #ffffff; /* Bela boja teksta dugmadi (primer) */
  }
  
  /* Hover efekat za dugmad dijaloga */
  button.mat-button.custom-button:hover {
    background-color: #2980b9; /* Tamnija plava boja (primer) prilikom hover-a */
  }

  /* Dodajte ove stilove u svoj CSS fajl */

/* Stilizacija kontejnera za dugmad */
.button-container {
  margin-top: 10px; /* Dodajte razmak između dugmadi */
}

  `]
})
export class ConfirmationDialog {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, message: string }
  ) { }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
