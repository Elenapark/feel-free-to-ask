export interface MessageListProps {
  id: string;
  createdAt: string;
  message: string;
  reply?: string;
  repliedAt?: string | undefined;
  author?: {
    displayName: string | null;
    photoURL?: string | null;
  };
}
