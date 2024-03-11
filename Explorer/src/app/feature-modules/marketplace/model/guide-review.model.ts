export interface GuideReview {
    id?: number,
    userId: number,
    guideId: number,
    rating: number,
    comment?: string,
    submissionDate: Date
}