import * as React from 'react';
import Layout from '@/components/Layout/layout';
import type { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'Escolher Empresas - Portal Empresas - Grupo Santa Joana'
}


export default function RootLayout(props: { children: React.ReactNode }) {
  return (<Layout topBar={false}>
    {props.children}
  </Layout>);
}
