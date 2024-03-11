export interface ShortSocialEncounter {
    id: number,
    encounterId: number,
    touristsRequiredForCompletion: number,
    distanceTreshold: number,
    touristIDs:  number[] | null,
}