import { CompetitionApply } from './competitionApply.model';

export interface Competition {
  id?: number;
  tourId: number;
  startDate: Date;
  duration: number;
  status: Status;

  competitionApplies: CompetitionApply[];
}

export enum Status {
  Open = 'Open',

  Close = 'Close',
}
