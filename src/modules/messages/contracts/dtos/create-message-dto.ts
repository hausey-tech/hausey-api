export interface ICreateMessageDTO {
  type: string;
  to: string;
  image?: Express.Multer.File;
  title?: string;
  body?: string;
  startsAt?: string;
  expiresAt?: string;
}
