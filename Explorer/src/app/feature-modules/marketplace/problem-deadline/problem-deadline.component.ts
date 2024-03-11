import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MarketplaceService } from '../marketplace.service';
import { Problem } from '../model/problem.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { ProblemMessage } from '../model/problem-message.model';

@Component({
  selector: 'xp-problem-deadline',
  templateUrl: './problem-deadline.component.html',
  styleUrls: ['./problem-deadline.component.css']
})
export class ProblemDeadlineComponent {
  constructor(private service: MarketplaceService) {}

  @Input() problem: Problem;
  @Output() problemUpdated = new EventEmitter<null>();

  selectedDate = new FormControl(new Date());
  showForm = false; 

  toggleForm(): void {
    this.showForm = !this.showForm;
    console.log(this.showForm)


    if (this.showForm) {
      this.selectedDate.setValue(new Date());
    }
  }

  addDeadline(): void {
    const selectedDateValue = this.selectedDate.value || new Date();

    this.problem.deadline = selectedDateValue;

    this.service.getMessagesByProblemId(this.problem.id || 0).subscribe({
      next: (messages: PagedResults<ProblemMessage>) => {
        this.problem.problemMessages = messages.results;

        this.service.addDeadline(this.problem).subscribe({
          next: (_) => {
            this.problemUpdated.emit();
            this.showForm = false;
          },
          error: (err) => {
            console.error("Error updating problem:", err);
          }
        });
      }
    })
  
    
  }
  
}

