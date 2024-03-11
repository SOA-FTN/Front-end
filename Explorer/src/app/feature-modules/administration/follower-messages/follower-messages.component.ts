import { Component, OnInit } from '@angular/core';
import { FollowerMessage } from '../model/follower-message.model';
import { imageOverlay } from 'leaflet';
import { AdministrationService } from '../administration.service';
import { TokenStorage } from 'src/app/infrastructure/auth/jwt/token.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-follower-messages',
  templateUrl: './follower-messages.component.html',
  styleUrls: ['./follower-messages.component.css']
})
export class FollowerMessagesComponent implements OnInit{

  messages: FollowerMessage[] = [];

  constructor(private tokenStorage: TokenStorage,
              private service: AdministrationService) {}

  ngOnInit(): void {
    this.getMessages();
  }

  getMessages(): void {
    const authorId = this.tokenStorage.getUserId();
    this.service.getMessagesByFollowerId(authorId).subscribe({
      next: (result: FollowerMessage[]) => {
        this.messages = result;
        //console.log('Messages:', this.messages);
      },
      error: (error) => {
        console.error('Error fetching messages:', error);
      },
    });
  }
  

  markAsRead(message: FollowerMessage){
    this.service.markAsRead(message).subscribe({
      next: (_) => {
        this.getMessages();
      }
    })
  }

  deleteMessage(messageId: number){
    this.service.deleteFollowerMessage(messageId).subscribe({
      next: () => {
        this.getMessages();
      }
    })
  }
}
