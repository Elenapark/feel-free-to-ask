import { Auth, getAuth } from 'firebase/auth';
import { getApps, initializeApp } from 'firebase/app';
import getConfig from 'next/config';

interface FirebaseClientConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
}

// node 환경과 달리 바로 .env에 접근할 수 없기에 next.config.js에서 정의한 config를 가져와서 적용
const { publicRuntimeConfig } = getConfig();

const firebaseClientConfig: FirebaseClientConfig = {
  apiKey: publicRuntimeConfig.apiKey,
  authDomain: publicRuntimeConfig.authDomain,
  projectId: publicRuntimeConfig.projectId,
};

// singletone class - 한번만 사용하면서, 전역에서 사용 가능한 instance를 만들기 위해
export default class FirebaseClient {
  private static instance: FirebaseClient;

  private auth: Auth;

  public constructor() {
    const apps = getApps();

    if (apps.length === 0) {
      // app이 한번도 initialized되지 않은 경우에 firebase init
      console.info('firebase client init start');
      initializeApp(firebaseClientConfig);
    }
    this.auth = getAuth();
  }

  public static getInstance(): FirebaseClient {
    if (
      FirebaseClient.instance === undefined ||
      FirebaseClient.instance === null
    ) {
      FirebaseClient.instance = new FirebaseClient();
    }
    return FirebaseClient.instance;
  }

  public get Auth(): Auth {
    return this.auth;
  }
}
