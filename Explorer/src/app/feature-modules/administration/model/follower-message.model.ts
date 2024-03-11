export interface FollowerMessage {
    id: number;
    userId: number;
    followerId: number;
    followerUsername: string;
    message: string;
    isRead: boolean;
}