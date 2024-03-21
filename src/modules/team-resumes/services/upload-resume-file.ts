import { injectable, inject, container } from 'tsyringe';
import { AppError } from '../../../shared/errors/app-error';
import { DeleteFileFromFirebaseService } from '../../integrations/services/delete-file-from-firebase';
import { UploadFilesToFirebaseService } from '../../integrations/services/upload-files-to-firebase';
import { type ITeamResumesRepository } from '../contracts/repositories/team-resumes';

interface IProps {
  teamId: string;
  file: Express.Multer.File;
}

@injectable()
export class UploadTeamResumeFileService {
  constructor(
    @inject('TeamResumeRepository')
    private readonly teamResumesRepository: ITeamResumesRepository,
  ) {}

  public async execute({ teamId, file }: IProps): Promise<void> {
    const teamResume = await this.teamResumesRepository.findById(teamId);

    if (teamResume === null) {
      throw new AppError('Id não encontrado, verifique e tente novamente!');
    }

    if (teamResume.fileUrl !== null) {
      const splittedUrl = teamResume.fileUrl.split('/');
      const name = splittedUrl[splittedUrl.length - 1].replaceAll('%2F', '/');
      const deleteFileService = container.resolve(
        DeleteFileFromFirebaseService,
      );
      try {
        await deleteFileService.execute({ name });
      } catch (error) {
        console.error('Não foi possível deletar a atual imagem da loja');
      }
    }
    const uploadFilesService = container.resolve(UploadFilesToFirebaseService);
    const [fileUrl] = await uploadFilesService.execute({
      files: [file],
      prefix: `teams/${teamResume.patientId}/${teamResume.roleId}`,
    });
    teamResume.fileUrl = fileUrl;
    await this.teamResumesRepository.save(teamResume);
  }
}
