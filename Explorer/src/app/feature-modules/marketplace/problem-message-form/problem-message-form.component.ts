import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MarketplaceService } from '../marketplace.service';
import { Problem } from '../model/problem.model';
import { ProblemMessage } from '../model/problem-message.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'xp-problem-message-form',
  templateUrl: './problem-message-form.component.html',
  styleUrls: ['./problem-message-form.component.css']
})
export class ProblemMessageFormComponent implements OnInit{
  
  constructor(private service: MarketplaceService, private authService: AuthService) { }
  
  @Input() problem: Problem;
  @Output() problemUpdated = new EventEmitter<null>();
  user: User;
  
  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
       this.user = user;
    });
  }

  problemMessageForm = new FormGroup({
      content: new FormControl('', [Validators.required])
    })

  addMessage(): void{
    const problem: ProblemMessage = {
      content: this.problemMessageForm.value.content || "",
      isRead: false,
      problemId: this.problem.id || 0,
      idSender: this.user.id || 0
    }

    this.service.addMessage(problem).subscribe({
      next: () => {
        this.problemUpdated.emit();
      },
    });
    
  }

}
