import * as React from 'react';
import Layout from '@/components/Layout/layout';
import type { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'Redefinir Senha - Portal Empresas - Grupo Santa Joana'
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (<Layout topBar={false}>
    <React.Suspense>
      {props.children}

    </React.Suspense>
  </Layout>);
}
