import { injectable } from 'tsyringe';
import { firebaseBucketInstance } from '../utils/firebase-instance';

interface IProps {
  prefix?: string;
}

@injectable()
export class ListFilesFromFirebaseService {
  public async execute({ prefix }: IProps): Promise<string[]> {
    const bucket = await firebaseBucketInstance.getFiles({ prefix });
    const files = bucket[0]?.map(file => file.publicUrl());
    return files;
  }
}
