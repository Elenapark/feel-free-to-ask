import { firestore } from 'firebase-admin';
export interface MessageListProps {
  id: string;
  message: string;
  reply?: string;
  author?: {
    displayName: string | null;
    photoURL?: string | null;
  };
  isDenied?: boolean;
}

export interface Message extends MessageListProps {
  createdAt: string;
  repliedAt?: string;
}

export interface MessageFromServer extends MessageListProps {
  createdAt: firestore.Timestamp;
  repliedAt?: firestore.Timestamp;
}
