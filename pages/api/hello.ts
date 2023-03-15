// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import FirebaseAdmin from '@/models/firebase_admin';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // Firebase Firestore의 test collection에 접근
  FirebaseAdmin.getInstance().Firebase.collection('test');
  res.status(200).json({ name: 'John Doe' });
}
