export interface ICreateSlotDTO {
  professionalId: string;
  professionalType: string;
  slots: {
    date: string;
    times: {
      startTime: string;
      endTime: string;
    }[];
  }[];
}
