export interface ICreateSlotDTO {
  professionalId: string;
  slots: {
    date: string;
    times: {
      startTime: string;
      endTime: string;
    }[];
  }[];
}
