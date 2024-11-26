import { getCalculosPaciente } from "@/app/portal/pacientes/actions";
import { getCalculosReturn, getPacienteReturn } from "@/app/portal/pacientes/types";
import { UserContext } from "@/context/UserContext";
import { Box, Button, Modal, Skeleton, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { useCallback, useContext, useEffect, useState } from "react";
import RefreshIcon from '@mui/icons-material/Refresh';
import moment from "moment";
import Link from "next/link";
import { removeCpfMask } from "@/utils/functions";

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


export default function ShowCalcModal(props: { user: getPacienteReturn, close: () => void }) {
    const [loading, setLoading] = useState(false)
    const { empresa } = useContext(UserContext)
    const [calculos, setCalculos] = useState<getCalculosReturn[]>([])

    const getCalculos = useCallback(async () => {
        setLoading(true);
        const u = await getCalculosPaciente({ idEmpresa: empresa?.idEmpresa || "", idPaciente: props.user.idPaciente });
        setCalculos(u);
        setLoading(false);
    }, [empresa?.idEmpresa, props]);

    const columns: GridColDef<(getCalculosReturn[])[number]>[] = [
        { field: 'idCalculo', headerName: 'ID', width: 70, sortComparator: (v1, v2) => Number(v1) - Number(v2) },
        {
            field: 'dtCalculo',
            headerName: 'Data do Cálculo',
            width: 150,
            renderCell: params => moment(params.row.dtCalculo).format("DD/MM/YYYY")
        },
        {
            field: 'pontos',
            headerName: 'Pontos',
            width: 70,
        },
        {
            field: 'risco',
            headerName: 'Risco',
            width: 200,
        },
        {
            field: 'actions',
            type: 'actions',
            width: 100,
            getActions: params => [
                <Link href={`/portal/calculadora?idCalculo=${params.row.idCalculo}`} key={"redo"}>
                    <GridActionsCellItem
                        color="warning"
                        icon={<RefreshIcon />}
                        label="Redo"
                    />
                </Link>
            ],
        },
    ];

    useEffect(() => {
        getCalculos()
    }, [getCalculos])

    return <Modal
        open={true}
        onClose={props.close}
        aria-labelledby="show-calc-modal-title"
        aria-describedby="show-calc-modal-description"
    >
        <Box sx={style}>
            {!loading ? <>
                <Typography id="show-calc-title" variant="h6" component="h2" mb={3}>
                    Cálculos de {props.user.nomeCompleto}
                </Typography>
                <DataGrid
                    rows={calculos}
                    columns={columns}
                    getRowId={(row) => row.idCalculo}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 10,
                            },
                        },
                    }}
                    pageSizeOptions={[5, 10, 25]}
                    slots={{ toolbar: GridToolbar }}
                />
                <Link href={`/portal/calculadora?cpf=${removeCpfMask(props.user.cpf)}`}>
                    <Button variant="contained" fullWidth sx={{ mt: 3 }}>Realizar Novo Cáculo</Button>
                </Link>
            </> : <Skeleton animation='wave' sx={{ height: "500px", width: "100%" }} />}
        </Box>
    </Modal>
}