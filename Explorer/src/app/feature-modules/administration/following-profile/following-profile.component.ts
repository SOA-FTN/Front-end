import { Component, OnInit } from '@angular/core';
import { AdministrationService } from '../administration.service';
import { TokenStorage } from 'src/app/infrastructure/auth/jwt/token.service';

@Component({
  selector: 'xp-following-profile',
  templateUrl: './following-profile.component.html',
  styleUrls: ['./following-profile.component.css']
})
export class FollowingProfileComponent implements OnInit{
  
  isFollowing: boolean;
  username: string;
  

  constructor(private adminService: AdministrationService,
              private tokenStorage: TokenStorage,
  ){}

  ngOnInit(): void {
    const followerUsername = 'john_doe';
    const followedUsername = 'jane_smith';
    
    this.adminService.isFollowing(followerUsername, followedUsername)
      .subscribe(
        result => {
          this.isFollowing = result;
          console.log('Is following:', this.isFollowing); // Log the isFollowing result
        },
        error => console.error('There was an error!', error)
      );
  }
  
  
}
