import { getEmpresas as getEmpresasApi } from "@/app/portal/empresas/actions";
import { activateUsuario, deleteEmpresasUsuario, getEmpresasUsuario as getEmpresasUsuarioApi, postEmpresasUsuario } from "@/app/portal/usuarios/actions";
import { getEmpresaReturn } from "@/app/portal/empresas/types";
import { ativarUsuarioEmpresaInitial, getUsuarioReturn } from "@/app/portal/usuarios/types";
import { UserContext } from "@/context/UserContext";
import { Alert, Box, Button, FormControl, Grid2 as Grid, InputLabel, MenuItem, Modal, Select, Skeleton, Typography } from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import CloseIcon from '@mui/icons-material/Close';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "60%",
    bgcolor: 'background.paper',
    border: '1px solid #c3c3c3',
    boxShadow: 24,
    p: 4,
};


export default function ChangeCompanyModal(props: { user: getUsuarioReturn, close: () => void }) {
    const [loading, setLoading] = useState(false)
    const [empresasFilter, setEmpresasFilter] = useState<getEmpresaReturn[]>([])
    const [form, setForm] = useState(ativarUsuarioEmpresaInitial)
    const { empresa, user } = useContext(UserContext)
    const [empresas, setEmpresas] = useState<getEmpresaReturn[]>([])
    const [warnings, setWarnings] = useState<string[]>([])
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    function cleanAdvises() {
        setWarnings([])
        setError("")
        setSuccess("")
    }

    const getEmpresas = useCallback(async () => {
        setLoading(true);
        const u = await getEmpresasApi({ idEmpresa: empresa?.idEmpresa });
        setEmpresasFilter(u);
        setLoading(false);
    }, [empresa?.idEmpresa]);

    const getEmpresasUsuario = useCallback(async () => {
        setLoading(true);
        const u = await getEmpresasUsuarioApi({ idUsuario: props.user.idUsuario });
        setEmpresas(u);
        setLoading(false);
    }, [props.user.idUsuario]);

    async function validateForm(evt: React.FormEvent<HTMLFormElement>) {
        setLoading(true)
        evt.preventDefault()
        cleanAdvises()
        const e: string[] = []
        if (form.idEmpresa === ativarUsuarioEmpresaInitial.idEmpresa) e.push('Nova Empresa necessita estar preenchida!')
        if (form.tpUsuario === ativarUsuarioEmpresaInitial.tpUsuario) e.push('Tipo de Usuário necessita estar preenchido!')


        if (e.length > 0) {
            setWarnings(e)
        }
        else {
            const response = await postEmpresasUsuario(form)
            if (response.Codigo === "OK") {
                getEmpresasUsuario()
                setForm({
                    ...ativarUsuarioEmpresaInitial,
                    idUsuarioCadastro: user?.idUsuario || "",
                    idUsuario: props.user.idUsuario,
                })
                setSuccess(response.Mensagem)
            } else {
                setError(response.Mensagem)
            }
        }

        setLoading(false)
    }

    async function inative(id: string) {
        cleanAdvises()
        setLoading(true)
        const response = await deleteEmpresasUsuario({
            idEmpresa: id,
            idUsuario: props.user.idUsuario,
            idUsuarioCadastro: user?.idUsuario || ""
        })
        if (response.Codigo === "OK") {
            getEmpresasUsuario()
            setSuccess(response.Mensagem)
        }else{
            setError(response.Mensagem)
        }
        setLoading(false)
    }


    useEffect(() => {
        cleanAdvises()
        if (!!empresa?.idEmpresa) {
            getEmpresas()
            getEmpresasUsuario()
        }

        setForm((prevForm) => ({
            ...prevForm,
            idUsuarioCadastro: user?.idUsuario || "",
            idUsuario: props.user.idUsuario,
        }))
    }, [empresa, getEmpresas, getEmpresasUsuario])

    const columns: GridColDef<(getEmpresaReturn[])[number]>[] = [
        { field: 'idEmpresa', headerName: 'ID', width: 50, sortComparator: (v1, v2) => Number(v1) - Number(v2) },
        {
            field: 'nomeEmpresa',
            headerName: 'Nome da Empresa',
            width: 250,
        },
        {
            field: 'tpUsuario',
            headerName: 'Tipo de Usuário',
            width: 200,
        },
        {
            field: 'actions',
            type: 'actions',
            width: 100,
            getActions: params => [
                <GridActionsCellItem
                    key={"delete"}
                    color="error"
                    icon={<CloseIcon />}
                    label="Delete"
                    onClick={() => inative(params.row.idEmpresa)}
                />,
            ],
        },
    ];

    return <Modal
        open={true}
        onClose={props.close}
        aria-labelledby="change-company-modal-title"
        aria-describedby="change-company-modal-description"
    >
        <Box sx={style}>
            {!loading ? <>
                <Typography id="change-company-title" variant="h6" component="h2" mb={3}>
                    Empresas de {props.user.nomeCompleto}
                </Typography>
                <Grid container spacing={2} size={12} mb={5} component={"form"} onSubmit={validateForm}>
                    <FormControl sx={{ flex: 1 }}>
                        <InputLabel id="demo-simple-select-label">Nova Empresa</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Nova Empresa"
                            value={form.idEmpresa}
                            name="idEmpresa"
                            onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
                        >
                            <MenuItem value={""}></MenuItem>
                            {empresasFilter.map((v, i) => <MenuItem value={v.idEmpresa} key={i}>{v.nomeEmpresa}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <FormControl sx={{ flex: 1 }}>
                        <InputLabel id="demo-simple-select-label">Tipo de Usuário</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Tipo de Usuário"
                            value={form.tpUsuario}
                            name="tpUsuario"
                            onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
                        >
                            <MenuItem value={""}></MenuItem>
                            <MenuItem value={"MEDICO"}>Médico</MenuItem>
                            <MenuItem value={"ADMINISTRATIVO"}>Administrativo</MenuItem>
                            <MenuItem value={"ENFERMEIRO"}>Enfermeiro</MenuItem>
                            {empresa?.tpUsuario === "MASTER" && <MenuItem value={"MASTER"}>Master</MenuItem>}
                        </Select>
                    </FormControl>
                    <Button variant="contained" size="large" type="submit">Adicionar</Button>
                </Grid>
                <DataGrid
                    rows={empresas}
                    columns={columns}
                    getRowId={(row) => row.idEmpresa}
                    initialState={{
                        sorting: {
                            sortModel: [{ field: 'nomeEmpresa', sort: 'asc' }]
                        },
                        pagination: {
                            paginationModel: {
                                pageSize: 10,
                            },
                        },
                    }}
                    pageSizeOptions={[5, 10, 25]}
                />
                {warnings.map((v, i) => <Alert key={i} severity="warning" sx={{ width: "100%", mt: 1 }}>{v}</Alert>)}
                {!!error && <Alert severity="error" sx={{ width: "100%", mt: 1 }}>{error}</Alert>}
                {!!success && <Alert severity="success" sx={{ width: "100%", mt: 1 }}>{success}</Alert>}
            </>
                : <Skeleton animation='wave' sx={{ height: "500px", width: "100%" }} />}
        </Box>
    </Modal>
}