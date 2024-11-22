import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Logo from "@/img/logo.png"

import BusinessIcon from '@mui/icons-material/Business';
import SearchIcon from '@mui/icons-material/Search';
import Image from 'next/image';

const items = [
  {
    icon: <BusinessIcon sx={{ color: 'text.secondary' }} />,
    title: 'Calculadora de Risco Gestacional do Grupo Santa Joana',
    description:
      'Por meio de análise precisa de dados clínicos e histórico da gestante, a calculadora identifica os riscos associados à gestação, permitindo intervenções mais assertivas e personalizadas.',
  },
  {
    icon: <SearchIcon sx={{ color: 'text.secondary' }} />,
    title: '',
    description:
      'Caso necessário, o profissional médico poderá solicitar uma interconsulta com nossos especialistas e juntos construir metas terapêuticas para a gestante ou até mesmo encaminhar a paciente para nossos especialistas em alto risco gestacional.',
  }
];

export default function Content() {
  return (
    <Stack
      sx={{ flexDirection: 'column', alignSelf: 'center', gap: 4, maxWidth: 450 }}
    >
      <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
        <Image src={Logo} alt='Logo Grupo Santa Joana Negócios' priority/>
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
