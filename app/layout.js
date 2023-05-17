'use client';

import './globals.css';
import { Poppins } from 'next/font/google';
import { Providers } from './providers';
import { client } from './utils/graph';
import { ApolloProvider } from '@apollo/client';
import { Box } from '@chakra-ui/react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

const poppins = Poppins({ subsets: ['latin'], weight: '500' });

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={poppins.className}>
        <ApolloProvider client={client}>
          <Providers>
            <Box py='2rem' px={{ lg: '4rem', sm: '2rem' }}>
              <Header />
              {children}
            </Box>
            <Footer />
          </Providers>
        </ApolloProvider>
      </body>
    </html>
  );
}
