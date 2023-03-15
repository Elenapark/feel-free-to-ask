import React, { ReactNode } from 'react';
import Head from 'next/head';

interface LayoutProps {
  title?: string;
  children: ReactNode;
}

export default function Layout({
  title = 'Send message to strangers',
  children,
}: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      {children}
    </>
  );
}
