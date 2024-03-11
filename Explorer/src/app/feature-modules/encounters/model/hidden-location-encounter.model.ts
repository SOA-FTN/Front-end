export interface HiddenLocationEncounter {
    id: number,
    name: string,
    description: string,
    xpPoints: number,
    status: string,
    type: string,
    latitude: number,
    longitude: number,
    encounterId: number,
    imageURL: string,
    imageLatitude: number,
    imageLongitude: number,
    distanceTreshold: number,
    shouldBeApproved: boolean
}