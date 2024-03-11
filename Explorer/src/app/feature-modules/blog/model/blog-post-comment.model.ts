export interface BlogPostComment {
    blogId: number,
    userId: number,
    username: string | null,
    text: string,
    creationTime: Date, 
    lastUpdatedTime: Date
}