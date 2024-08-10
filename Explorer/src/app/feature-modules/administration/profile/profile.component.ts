import { Component, OnInit } from '@angular/core';
import { Profile } from '../model/profile.model';
import { AdministrationService } from '../administration.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GoogleAnalyticsService } from '../../../infrastructure/google-analytics/google-analytics.service';
import { TouristXP } from '../model/tourist-xp.model';
import { TokenStorage } from 'src/app/infrastructure/auth/jwt/token.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'xp-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  userProfile: Profile = {} as Profile;
  user: User;
  username: string;
  isEditMode: boolean = false;
  shouldRenderNotifications: boolean = false;
  shouldRenderMessages: boolean = false;
  touristXP: TouristXP[] = [];
  allUsers: string[] = [];
  recommendedUsers: string[] = [];
  followedUsers: UserFollowerDto[] = [];
  isFollowingBool: boolean;

  constructor(
    private tokenStorage: TokenStorage,
    private service: AdministrationService,
    private auth: AuthService,
    private googleAnalytics: GoogleAnalyticsService
  ) {}

  ngOnInit(): void {
    this.googleAnalytics.sendPageView(window.location.pathname);
    this.loadProfileData();
    this.loadTouristXP();
    this.loadFollowedUsers();
    this.loadAllUsernames();
    this.getRecommendations(this.username);
  }

  loadProfileData() {
    this.auth.user$.subscribe((user) => {
      if (user.username) {
        this.user = user;
        this.username = user.username;
        console.log('username: ', user.username);
        this.service.getProfile(user.id).subscribe({
          next: (data: Profile) => {
            console.log(data);
            this.userProfile.id = data.id;
            this.userProfile.userId = data.userId;
            this.userProfile.email = data.email;
            this.userProfile.name = data.name;
            this.userProfile.surname = data.surname;
            this.userProfile.profileImage = data.profileImage;
            this.userProfile.bio = data.bio;
            this.userProfile.quote = data.quote;
            //this.userProfile.balance = data.balance;
            //alert(JSON.stringify(this.userProfile));
          },
          error: (err: any) => {
            console.log(err);
          },
        });
      }
    });
  }

  toggleEditMode() {
    if (this.isEditMode == false) {
      this.isEditMode = !this.isEditMode;
    } else {
      this.service
        .updateProfile(this.userProfile, this.userProfile.userId)
        .subscribe({
          next: (data: Profile) => {
            this.isEditMode = !this.isEditMode;
            this.loadProfileData();
          },
          error: (err: any) => {
            console.log(err);
          },
        });

      //alert(JSON.stringify(this.userProfile));
    }
  }

  loadTouristXP() {
    const userId = this.tokenStorage.getUserId();
    this.service.getTouristXPByID(userId).subscribe({
      next: (result: PagedResults<TouristXP>) => {
        this.touristXP = result.results;
      },
      error: () => {},
    });
  }

  onBellClicked(): void {
    this.shouldRenderMessages = false;
    this.shouldRenderNotifications = !this.shouldRenderNotifications;
  }

  onMessagesClicked(): void {
    this.shouldRenderNotifications = false;
    this.shouldRenderMessages = true;
  }

  loadUsersExcept() {
    this.service.getUsersExcept(this.username).subscribe(
      (users: string[]) => {
        this.allUsers = users;
        console.log('Users except', this.username, ':', this.allUsers);
      },
      (error) => {
        console.error('There was an error!', error);
      }
    );
  }

  loadFollowedUsers() {
    this.service.getFollowedUsers(this.username).subscribe(
      (users: UserFollowerDto[]) => {
        this.followedUsers = users;
        console.log(this.followedUsers[0]);
        console.log('Users except', this.username, ':', this.followedUsers);
      },
      (error) => {
        console.error('There was an error!', error);
      }
    );
  }

  loadAllUsernames() {
    this.service.getAllUsernames().subscribe(
      (users: string[]) => {
        this.allUsers = users;
        console.log(this.allUsers[0]);
        console.log('Users except', this.allUsers);
        this.deleteUsername();
      },
      (error) => {
        console.error('There was an error!', error);
      }
    );
  }

  usernameFollowStatusMap: Map<string, boolean> = new Map<string, boolean>();

  checkedUsernames: string[] = []; // Array to store usernames for which follow status has been checked

  follow(username: string) {
    this.callFollowPerson(username);
  }

  async callFollowPerson(username: string) {
    const relationship: FollowingRelationshipDto = {
      followerUsername: this.username,
      followedUsername: username,
    };

    try {
      const response = await this.service.followPerson(relationship);
      console.log('zapracivanje jebeno', response); // Log the response
      this.loadAllUsernames();
      this.loadFollowedUsers();
      this.getRecommendations(this.username);
    } catch (error) {
      console.error('Failed to follow person:', error);
    }
  }

  deleteUsername(): void {
    const index = this.allUsers.indexOf(this.username);
    if (index !== -1) {
      this.allUsers.splice(index, 1);
    }

    // Check if this.username is following each username in allUsers
    this.allUsers.forEach((username) => {
      this.service.isFollowing(this.username, username).subscribe(
        (isFollowing) => {
          console.log(
            `${this.username} is following ${username}:`,
            isFollowing
          );
          if (isFollowing) {
            // If this.username is following username, remove it from allUsers
            const idx = this.allUsers.indexOf(username);
            if (idx !== -1) {
              this.allUsers.splice(idx, 1);
            }
          }
        },
        (error) => {
          console.error(
            `Error checking if ${this.username} is following ${username}:`,
            error
          );
          // Optionally handle errors
        }
      );
    });
  }

  getRecommendations(username: string): void {
    this.service.getUsers(username).subscribe(
      (recommendations: string[]) => {
        this.recommendedUsers = recommendations;
        console.log('Recommendations:', recommendations);
        this.deleteMeFromList();

        // Handle the recommendations data as needed
      },
      (error: any) => {
        // Explicitly specify the type of 'error' parameter
        // Handle errors
      }
    );
  }

  deleteMeFromList(): void {
    const index = this.recommendedUsers.indexOf(this.username);
    if (index !== -1) {
      this.recommendedUsers.splice(index, 1);
    }
  }
}

export interface UserFollowerDto {
  username: string;
}

interface FollowingRelationshipDto {
  followerUsername: string;
  followedUsername: string;
}
