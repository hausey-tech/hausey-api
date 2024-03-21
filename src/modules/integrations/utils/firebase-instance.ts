import { type ServiceAccount } from 'firebase-admin';
import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { getMessaging } from 'firebase-admin/messaging';
import serviceAccount from '../config/firebase-config.json';

const bucketUrl = 'hauseyapp.appspot.com';

initializeApp({
  credential: cert(serviceAccount as ServiceAccount),
  storageBucket: bucketUrl,
});

export const firebaseBucketInstance = getStorage().bucket();
export const firebaseMessagingInstance = getMessaging();
