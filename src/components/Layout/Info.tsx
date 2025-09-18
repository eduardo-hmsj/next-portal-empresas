import * as React from 'react';

import Typography from '@mui/material/Typography';
import { Accordion, AccordionDetails, AccordionSummary, Collapse, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CalculateIcon from '@mui/icons-material/Calculate';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { UserContext } from '@/context/UserContext';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import { usePathname, useRouter } from 'next/navigation';
import HelpIcon from '@mui/icons-material/Help';
import PersonIcon from '@mui/icons-material/Person';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import { getRelatorio } from '@/app/portal/dashboard/meus-resultados/actions';
import { exportToCsv } from '@/utils/functions';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Person2Icon from '@mui/icons-material/Person2';
import GroupIcon from '@mui/icons-material/Group';


export interface InfoProps {
  title: string,
  subtitle: string
}

export default function Info(props: InfoProps) {
  const { logout, empresa } = React.useContext(UserContext)
  const [loading, setLoading] = React.useState(false)
  const [openDashboard, setOpenDashboard] = React.useState(false);
  const router = useRouter()
  const pathname = usePathname()

  const handleExport = async () => {
    setLoading(true)
    const nomeRelatorio = `Relatorio_Geral_Calculadora_De_Risco_Gestacional`
    const response = await getRelatorio({
      nomeRelatorio: "",
      dataFimCalculo: "",
      dataInicioCalculo: "",
      idEmpresa: "",
      tipoRelatorio: ""
    })
    exportToCsv({ data: response, fileName: nomeRelatorio });
    setLoading(false)
  };

  return (
    <React.Fragment>
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography display={'flex'} alignItems={'center'}><MenuIcon sx={{ mr: 2 }} />
            <span>
              <small><strong>Menu</strong></small><br />
              {pathname.includes("/portal/dashboard") && "Dashboard"}
              {pathname === "/portal/calculadora" && "Calculadora"}
              {pathname === "/portal/pacientes" && "Pacientes"}
              {pathname === "/portal/empresas" && "Empresas"}
              {pathname === "/portal/usuarios" && "Usuários"}
              {pathname === "/portal/ajuda" && "Ajuda"}
            </span>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <nav aria-label="main mailbox folders">
            <List>
              {(empresa?.tpUsuario === "MASTER") && <ListItem disablePadding>
                <ListItemButton selected={pathname === "/portal/empresas"} onClick={() => router.push("/portal/empresas")}>
                  <ListItemIcon>
                    <AddBusinessIcon />
                  </ListItemIcon>
                  <ListItemText primary="Empresas" />
                </ListItemButton>
              </ListItem>}
              {(empresa?.tpUsuario === "MASTER" || empresa?.tpUsuario === "ADMINISTRATIVO") && <ListItem disablePadding>
                <ListItemButton selected={pathname === "/portal/usuarios"} onClick={() => router.push("/portal/usuarios")}>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary="Usuários" />
                </ListItemButton>
              </ListItem>}
              <ListItem disablePadding>
                <ListItemButton selected={pathname === "/portal/pacientes"} onClick={() => router.push("/portal/pacientes")}>
                  <ListItemIcon>
                    <AccessibilityIcon />
                  </ListItemIcon>
                  <ListItemText primary="Pacientes" />
                </ListItemButton>
              </ListItem>
              {empresa?.tpUsuario !== "ADMINISTRATIVO" && <>
                <ListItem disablePadding>
                  <ListItemButton selected={pathname === "/portal/calculadora"} onClick={() => router.push("/portal/calculadora")}>
                    <ListItemIcon>
                      <CalculateIcon />
                    </ListItemIcon>
                    <ListItemText primary="Calculadora" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => setOpenDashboard(!openDashboard)} selected={!openDashboard && pathname.includes("/portal/dashboard")}>
                    <ListItemIcon>
                      <LeaderboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                    {openDashboard ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </ListItem>

                <Collapse in={openDashboard} timeout="auto" unmountOnExit>
                  <List sx={{px:2}}>
                    <ListItem disablePadding>
                      <ListItemButton selected={pathname === "/portal/dashboard/meus-resultados"} onClick={() => router.push("/portal/dashboard/meus-resultados")}>
                        <ListItemIcon>
                          <Person2Icon />
                        </ListItemIcon>
                        <ListItemText primary="Meus Resultados" />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton selected={pathname === "/portal/dashboard/resultados-gerais"} onClick={() => router.push("/portal/dashboard/resultados-gerais")}>
                        <ListItemIcon>
                          <GroupIcon />
                        </ListItemIcon>
                        <ListItemText primary="Resultados gerais" />
                      </ListItemButton>
                    </ListItem>
                  </List>
                </Collapse>
              </>}
              <ListItem disablePadding>
                <ListItemButton selected={pathname === "/portal/ajuda"} onClick={() => router.push("/portal/ajuda")}>
                  <ListItemIcon>
                    <HelpIcon />
                  </ListItemIcon>
                  <ListItemText primary="Ajuda" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={logout}>
                  <ListItemIcon>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Sair" />
                </ListItemButton>
              </ListItem>
              {(empresa?.tpUsuario === "MASTER") && <ListItem disablePadding>
                <ListItemButton onClick={handleExport} disabled={loading}>
                  <ListItemIcon>
                    <DownloadForOfflineIcon />
                  </ListItemIcon>
                  <ListItemText primary={loading ? "Exportando Dados" : "Exportar Relatório Geral"} />
                </ListItemButton>
              </ListItem>}
            </List>
          </nav>
        </AccordionDetails>
      </Accordion>
      <Typography variant='h5' sx={{ mt: 3 }}>{props.title}</Typography>
      <Typography variant='body1' sx={{ mt: 2 }}>{props.subtitle}</Typography>
    </React.Fragment>
  );
}
