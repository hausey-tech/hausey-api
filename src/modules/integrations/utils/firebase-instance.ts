import { type ServiceAccount } from 'firebase-admin';
import { initializeApp, cert } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import serviceAccount from '../config/firebase-config.json';

initializeApp({
  credential: cert(serviceAccount as ServiceAccount),
});

export const firebaseMessagingInstance = getMessaging();
