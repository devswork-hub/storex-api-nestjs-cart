import { Logger } from '@firebase/logger';
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as firestore from 'firebase-admin/firestore';
import * as path from 'path';

@Injectable()
export class FirebaseService {
  private readonly logger = new Logger(FirebaseService.name);

  constructor() {
    const serviceAccountPath = path.resolve(
      __dirname,
      '../../service-account-key.json',
    );
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountPath),
      databaseURL: 'https://<YOUR_PROJECT_ID>.firebaseio.com',
    });
  }

  async createRecord(collection: any, data: any) {
    const docRef = admin.firestore().collection(collection).doc();
    await docRef.set(data);
    const output = { id: docRef.id, ...data };
    this.logger.debug(output);
    return output;
  }

  async readRecord(collection: string, id: string) {
    const doc = await this.getSingledoc(collection, id).get();
    if (!doc.exists) throw new Error('No document found');
    return { id: doc.id, ...doc.data() };
  }

  async updateRecord(collection: string, id: string, data: any) {
    await this.getSingledoc(collection, id).update(data);
    return { message: 'Record update successfully' };
  }

  async deleteRecord(collection: string, id: string) {
    await this.getSingledoc(collection, id).delete();
    return { message: 'Record delete successfully' };
  }

  private getSingledoc(collection: string, id: string) {
    return admin.firestore().collection(collection).doc(id);
  }
}
