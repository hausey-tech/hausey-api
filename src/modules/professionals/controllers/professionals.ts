import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateUserAndProfessionalService } from '../services/create-professional';
import { FindProfessionalsService } from '../services/find-professionals';
import { UpdateProfessionalService } from '../services/update-professional';
import { DeleteProfessionalService } from '../services/delete-professional';
import { UpdateProfessionalPasswordService } from '../services/update-password';
import { VerifyTokenService } from '../services/verify-token-service';
import { ForgotPasswordService } from '../services/forgot-password-service';
import { ResetPasswordService } from '../services/reset-password-service';

export class ProfessionalsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const payload = request.query;

    const findProfessionalsService = container.resolve(
      FindProfessionalsService,
    );

    const professionals = await findProfessionalsService.execute(payload);

    return response.json(professionals);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const payload = request.body;

    const createUserAndProfessionalService = container.resolve(
      CreateUserAndProfessionalService,
    );

    const professional = await createUserAndProfessionalService.execute(
      payload,
    );

    return response.json(professional);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { professionalId } = request.params;
    const payload = request.body;

    const updateProfessionalService = container.resolve(
      UpdateProfessionalService,
    );

    const professional = await updateProfessionalService.execute(
      professionalId,
      payload,
    );

    return response.json(professional);
  }

  public async updatePassword(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const payload = request.body;

    const updateProfessionalPasswordService = container.resolve(
      UpdateProfessionalPasswordService,
    );

    const professional = await updateProfessionalPasswordService.execute(
      payload,
    );

    return response.json(professional);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { professionalId } = request.params;

    const deleteProfessionalService = container.resolve(
      DeleteProfessionalService,
    );

    const professional = await deleteProfessionalService.execute({
      id: professionalId,
    });

    return response.json(professional);
  }

  public async forgotPassword(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { email } = request.body;
    const forgotPasswordService = container.resolve(ForgotPasswordService);
    await forgotPasswordService.execute({ email });
    return response.json({
      message: 'O token de verificação foi enviado ao seu email!',
    });
  }

  public async verifyToken(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { email, token } = request.body;
    const verifyTokenService = container.resolve(VerifyTokenService);
    await verifyTokenService.execute({
      email,
      token,
    });
    return response.json({ message: 'Token válido!' });
  }

  public async resetPassword(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { email, token, password } = request.body;
    const verifyTokenService = container.resolve(VerifyTokenService);
    await verifyTokenService.execute({
      email,
      token,
    });
    const resetPasswordService = container.resolve(ResetPasswordService);
    await resetPasswordService.execute({
      email,
      password,
    });
    return response.json({ message: 'Senha redefinida com sucesso!' });
  }
}
