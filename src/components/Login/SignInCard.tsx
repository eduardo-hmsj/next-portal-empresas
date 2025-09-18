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
import { useRouter } from 'next/navigation';
import { Alert, Link, Skeleton } from '@mui/material';
import { CPFMask } from '@/utils/functions';
import { LoginInitial } from '@/app/(login)/types';
import { Login, RedefinirSenha } from '@/app/(login)/actions';

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
  const [mode, setMode] = React.useState("login")
  const [loading, setLoading] = React.useState(false)
  const [warnings, setWarnings] = React.useState<string[]>([])
  const [error, setError] = React.useState("")
  const [success, setSuccess] = React.useState("")
  const route = useRouter()

  function cleanAdvises() {
    setWarnings([])
    setError("")
    setSuccess("")
  }


  function LoginForm() {
    const [form, setForm] = React.useState(LoginInitial)

    async function validateForm(evt: React.FormEvent<HTMLFormElement>) {
      evt.preventDefault()
      cleanAdvises()
      setLoading(true)
      const e: string[] = []

      if (form.cpf === LoginInitial.cpf) e.push('CPF necessita estar preenchido!')
      if (form.senha === LoginInitial.senha) e.push('Senha necessita estar preenchido!')

      if (e.length > 0) {
        setWarnings(e)
      } else {
        const response = await Login(form)
        if (!!response && response.Codigo === "OK") {

          route.push('/portal/dashboard/meus-resultados')
          setSuccess(response.Mensagem)
        } else {
          setError(response.Mensagem || "Houve um erro ao realizar seu login. Em instantes, tente novamente.")
        }
      }
      setLoading(false)
    }

    return <Box
      component="form"
      onSubmit={validateForm}
      noValidate
      sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
    >
      <FormControl>
        <FormLabel htmlFor="cpf">CPF</FormLabel>
        <TextField
          id="cpf"
          type="text"
          name="cpf"
          placeholder="xxx.xxx.xxx-xx"
          fullWidth
          variant="outlined"
          color="primary"
          InputProps={{
            inputComponent: CPFMask,
          }}
          value={form.cpf}
          onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
        />
      </FormControl>
      <FormControl>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <FormLabel htmlFor="senha">Senha</FormLabel>
          <Link
            component="button"
            type="button"
            onClick={e => {
              e.preventDefault()
              setMode("signUp")
            }}
            variant="body2"
            sx={{ alignSelf: 'baseline' }}
          >
            Esqueci minha senha
          </Link>
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
          value={form.senha}
          onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
        />
      </FormControl>
      <Button type="submit" fullWidth variant="contained">
        Entrar
      </Button>
    </Box>
  }

  function SignUp() {
    const [form, setForm] = React.useState({cpf: ""})
    async function validateForm(evt: React.FormEvent<HTMLFormElement>) {
      evt.preventDefault()
      cleanAdvises()
      setLoading(true)
      const e: string[] = []

      if (form.cpf === LoginInitial.cpf) e.push('CPF necessita estar preenchido!')

      if (e.length > 0) {
        setWarnings(e)
      } else {
        const response = await RedefinirSenha(form)
        
        if (response.Codigo === "OK") {

          route.push('/portal/dashboard/meus-resultados')
          setSuccess(response.Mensagem)
        } else {
          setError(response.Mensagem || "Houve um erro ao realizar seu login. Em instantes, tente novamente.")
        }
      }
      setLoading(false)
    }
    return <Box
      component="form"
      onSubmit={validateForm}
      noValidate
      sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
    >
      <FormControl>
        <FormLabel htmlFor="cpf">CPF</FormLabel>
        <TextField
          id="cpf"
          type="text"
          name="cpf"
          placeholder="xxx.xxx.xxx-xx"
          fullWidth
          variant="outlined"
          color="primary"
          value={form.cpf}
          onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
          InputProps={{
            inputComponent: CPFMask,
          }}
        />
      </FormControl>
      <Button type="submit" fullWidth variant="contained">
        Recuperar Senha
      </Button>
      <Link
        component="button"
        type="button"
        onClick={e => {
          e.preventDefault()
          setMode("login")
        }}
        variant="body2"
        sx={{ alignSelf: 'baseline' }}
      >
        Voltar para Login
      </Link>
    </Box>
  }

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
        Acesse a Calculadora
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
        <>
          {mode === "login" && <LoginForm />}
          {mode === "signUp" && <SignUp />}
          {warnings.map((v, i) => <Alert key={i} severity="warning" sx={{ width: "100%", mt: 1 }}>{v}</Alert>)}
          {!!error && <Alert severity="error" sx={{ width: "100%", mt: 1 }}>{error}</Alert>}
          {!!success && <Alert severity="success" sx={{ width: "100%", mt: 1 }}>{success}</Alert>}
        </>
      }
    </Card>
  );
}
