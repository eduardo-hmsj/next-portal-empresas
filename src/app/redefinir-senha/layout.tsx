'use client'
import * as React from 'react';
import Layout from '@/components/Layout/layout';


export default function RootLayout(props: { children: React.ReactNode }) {
  return (<Layout topBar={false}>
    {props.children}
  </Layout>);
}
