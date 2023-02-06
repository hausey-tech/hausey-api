export interface ICreateSlotDTO {
  professionalId: string;
  slots: {
    weekDay: number;
    times: {
      startTime: string;
      endTime: string;
    }[];
  }[];
}
