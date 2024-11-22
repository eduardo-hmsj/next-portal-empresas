"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Logo from "@/img/logo.png"

import { styled } from '@mui/material/styles';

import Image from 'next/image';
import Login from '../../app/(login)/actions';
import { useFormState } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@mui/material';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

export default function SignInCard() {
  const [loged, SignIn] = useFormState(Login, "")
  const [loading, setLoading] = React.useState(false)
  const route = useRouter()

  React.useEffect(() => {
    if (loged) {
      route.push('/portal/calculadora')
      setLoading(false)
    }
    if (loged === "false") setLoading(false)
  }, [loged, route])



  return (
    <Card variant="outlined">
      <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
        <Image src={Logo} alt='Logo Grupo Santa Joana Empresas' />
      </Box>
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
      >
        Redefinir Senha
      </Typography>
      {loading ? <>
        <Skeleton animation='wave' />
        <Skeleton animation='wave' />
        <Skeleton animation='wave' />
        <Skeleton animation='wave' />
        <Skeleton animation='wave' />
        <Skeleton animation='wave' />
      </>
        :
        <Box
          component="form"
          action={SignIn}
          onSubmit={() => setLoading(true)}
          noValidate
          sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
        >
          <FormControl>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <FormLabel htmlFor="senha">Nova Senha</FormLabel>
            </Box>
            <TextField
              name="senha"
              placeholder="••••••"
              type="password"
              id="senha"
              required
              fullWidth
              variant="outlined"
              color={'primary'}
            />
          </FormControl>
          <FormControl>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <FormLabel htmlFor="confsenha">Confirme sua Senha</FormLabel>
            </Box>
            <TextField
              name="confsenha"
              placeholder="••••••"
              type="password"
              id="confsenha"
              required
              fullWidth
              variant="outlined"
              color={'primary'}
            />
          </FormControl>
          <Button type="submit" fullWidth variant="contained">
            Entrar
          </Button>
        </Box>
      }
    </Card>
  );
}
