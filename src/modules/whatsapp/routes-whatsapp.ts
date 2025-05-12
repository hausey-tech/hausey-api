import cors from 'cors';
import { Router } from 'express';
import { WhatsappController } from './whatsapp.controller';

// Configuração global para CORS, permitindo qualquer origem
const corsOptions = {
  origin: '*', // ou defina um domínio específico se necessário
  methods: 'GET,POST', // Permite apenas GET e POST (necessário para o Twilio)
};

export const whatsappRouter = Router();
const whatsappController = new WhatsappController();

whatsappRouter.post('/webhook', cors(corsOptions), (req, res) => {
  whatsappController.handleIncomingMessage(req, res);
});
