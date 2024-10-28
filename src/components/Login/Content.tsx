import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Logo from "@/img/logoheader.webp"

import BusinessIcon from '@mui/icons-material/Business';
import SearchIcon from '@mui/icons-material/Search';
import Image from 'next/image';

const items = [
  {
    icon: <BusinessIcon sx={{ color: 'text.secondary' }} />,
    title: 'Grupo Santa Joana para Empresas',
    description:
      '“Conte com as soluções de quem mais entende da saúde da mulher e gestante, para sua empresa.”',
  },
  {
    icon: <SearchIcon sx={{ color: 'text.secondary' }} />,
    title: 'Identifique fatores de risco na gestação das suas colaboradoras',
    description:
      'A Calculadora de Saúde Gestacional do Grupo Santa Joana permite que gestores e médicos identifiquem fatores de risco durante a gestação das colaboradoras, facilitando a tomada de decisões preventivas. Utilizando indicadores personalizados como histórico médico, IMC e condições pré-existentes, o sistema oferece uma análise detalhada do risco gestacional (baixo, médio ou alto), permitindo acompanhamento contínuo e seguro.',
  }
];

export default function Content() {
  return (
    <Stack
      sx={{ flexDirection: 'column', alignSelf: 'center', gap: 4, maxWidth: 450 }}
    >
      <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
        <Image src={Logo} alt='Logo Grupo Santa Joana Negócios' />
      </Box>
      {items.map((item, index) => (
        <Stack key={index} direction="row" sx={{ gap: 2 }}>
          {item.icon}
          <div>
            <Typography gutterBottom sx={{ fontWeight: 'medium' }}>
              {item.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {item.description}
            </Typography>
          </div>
        </Stack>
      ))}
    </Stack>
  );
}
