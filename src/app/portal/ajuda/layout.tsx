import * as React from 'react';
import Layout from '@/components/Layout/layout';
import type { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'Ajuda - Portal Empresas - Grupo Santa Joana'
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (<Layout topBar={true}>
    {props.children}
  </Layout>);
}
