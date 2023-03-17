import React, { ReactNode } from 'react';
import Head from 'next/head';
import GlobalNavBar from '../components/GlobalNavBar';
import { Box, BoxProps } from '@chakra-ui/react';

interface LayoutProps {
  title?: string;
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps & BoxProps> = ({
  title = 'Send message to strangers',
  children,
  ...boxProps
}) => {
  return (
    <Box {...boxProps}>
      <Head>
        <title>{title}</title>
      </Head>
      <GlobalNavBar />
      {children}
    </Box>
  );
};
