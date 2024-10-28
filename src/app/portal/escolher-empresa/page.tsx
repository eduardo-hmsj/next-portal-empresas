'use client'
import { Box, FormControl, Grid2 as Grid, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import Logo from "@/img/logoheader.webp"
import Image from "next/image";
import { UserContext } from "@/context/UserContext";
import { useContext, useEffect, useState } from "react";
import { chooseEmpresa } from "./actions";
import { useRouter } from 'next/navigation';

export default function EscolheEmpresa() {
    const { user } = useContext(UserContext)
    const [empresa, setEmpresa] = useState("")
    const route = useRouter()

    useEffect(() => {
        if (empresa) {
            chooseEmpresa(empresa)
            route.push('/portal/calculadora')
        }
    }, [empresa, route])

    return (<Grid container sx={{ height: { xs: '100%', sm: '100dvh' }, display: "flex", flexDirection: "column", alignContent: "center", justifyContent: "center", textAlign: "center", p: 5, gap: 3 }}>
        <Box>
            <Image src={Logo} alt='Logo Grupo Santa Joana Negócios' />
        </Box>
        <Typography variant="h6">Bem vindo, {user?.nome}! Antes de começar, escolha uma empresa:</Typography>
        <FormControl sx={{ minWidth: 180 }}>
            <InputLabel id="demo-simple-select-label">Empresa</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Empresa"
                name="empresa"
                value={empresa}
                onChange={e => {
                    setEmpresa(e.target.value)
                }}
            >
                {user?.empresas.map((v, i) => <MenuItem key={i} value={v.idEmpresa}>{v.nomeEmpresa}</MenuItem>)}
            </Select>
        </FormControl>
    </Grid>)
}