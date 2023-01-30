export interface ICreateSlotDTO {
  professionalId: string;
  days: {
    weekDay: number;
    times: {
      startTime: string;
      endTime: string;
    }[];
  }[];
}
