export interface SocialEncounter {
    encounterId: number,
    name: string,
    description: string,
    xpPoints: number,
    status: string,
    type: string,
    latitude: number,
    longitude: number,
    id: number,
    touristsRequiredForCompletion: number,
    distanceTreshold: number,
    touristIDs:  number[] | null,
    shouldBeApproved: boolean
}