import { Box, Button, ButtonGroup, Modal, Skeleton, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { getEmpresaReturn } from "@/app/portal/empresas/types";
import { deleteEmpresa as deleteEmpresaApi } from "@/app/portal/empresas/actions";
import { UserContext } from "@/context/UserContext";

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


export default function DeleteEmpresaModal(props: {
    empresa: getEmpresaReturn,
    getEmpresas: () => void,
    close: () => void,
    cleanAdvises: () => void,
    setError: (sa: string) => void,
    setSuccess: (sa: string) => void,
}) {
    const [loading, setLoading] = useState(false)
    const {user} = useContext(UserContext)

    async function deleteEmpresa(){
        props.cleanAdvises()
        setLoading(true)
        const response = await deleteEmpresaApi({
            idEmpresa: props.empresa.idEmpresa,
            idUsuarioCadastro: user?.idUsuario || ""
        })
        if (response.Codigo === "OK") {
            props.getEmpresas()
            props.setSuccess("Empresa apagada com sucesso.")
        } else {
            props.setError("Falha ao apagar empresa.")
        }
        setLoading(false)
        props.getEmpresas()
        props.close()
    }

    return <Modal
        open={true}
        onClose={props.close}
        aria-labelledby="show-calc-modal-title"
        aria-describedby="show-calc-modal-description"
    >
        <Box sx={style}>
            {!loading ? <>
                <Typography id="show-calc-title" variant="h6" component="h2" mb={3}>
                    Deseja excluir a empresa {props.empresa.nomeEmpresa}? <small>(Esta operação não poderá ser desfeita.)</small>
                </Typography>
                <ButtonGroup
                    disableElevation
                    variant="contained"
                    aria-label="Disabled button group"
                >
                    <Button onClick={deleteEmpresa}>Sim, estou ciente e desejo excluir</Button>
                    <Button color="inherit" onClick={props.close}>Cancelar</Button>
                </ButtonGroup>
            </> : <Skeleton animation='wave' sx={{ height: "200px", width: "100%" }} />}
        </Box>
    </Modal>
}