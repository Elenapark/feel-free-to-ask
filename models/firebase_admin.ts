import * as admin from 'firebase-admin';

interface Config {
  credential: {
    privateKey: string;
    clientEmail: string;
    projectId: string;
  };
}

// singletone class

export default class FirebaseAdmin {
  public static instance: FirebaseAdmin;
  private constructor() {}

  private init = false; // 초기화 여부

  public static getInstance(): FirebaseAdmin {
    if (
      FirebaseAdmin.instance === undefined ||
      FirebaseAdmin.instance === null
    ) {
      // 초기화 진행
      FirebaseAdmin.instance = new FirebaseAdmin();

      // 환경 초기화
      FirebaseAdmin.instance.bootstrap();
    }
    return FirebaseAdmin.instance;
  }

  public bootstrap(): void {
    // app이 등록되어있는지 체크
    const isRegisteredApp = admin.apps.length !== 0;
    if (isRegisteredApp) {
      this.init = true;
      return;
    }

    const config: Config = {
      credential: {
        projectId: process.env.projectId || '',
        clientEmail: process.env.clientEmail || '',
        privateKey: (process.env.privateKey || '').replace(/\\n/g, '\n'),
      },
    };

    admin.initializeApp({
      credential: admin.credential.cert(config.credential),
    });
    console.info('bootstrap firebase admin');
  }

  /** Firestore를 반환 */
  public get Firestore(): FirebaseFirestore.Firestore {
    if (this.init === false) {
      this.bootstrap();
    }
    return admin.firestore();
  }

  /** Firebase Auth를 반환 */
  public get Auth(): admin.auth.Auth {
    if (this.init === false) {
      this.bootstrap();
    }
    return admin.auth();
  }
}
