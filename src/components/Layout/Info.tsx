import * as React from 'react';

import Typography from '@mui/material/Typography';
import { Accordion, AccordionDetails, AccordionSummary, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
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

export interface InfoProps {
  title: string,
  subtitle: string
}

export default function Info(props: InfoProps) {
  const { logout, empresa } = React.useContext(UserContext)
  const router = useRouter()
  const pathname = usePathname()

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
              {pathname === "/portal/dashboard" && "Dashboard"}
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
                  <ListItemButton selected={pathname === "/portal/dashboard"} onClick={() => router.push("/portal/dashboard")}>
                    <ListItemIcon>
                      <LeaderboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                  </ListItemButton>
                </ListItem>
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
            </List>
          </nav>
        </AccordionDetails>
      </Accordion>
      <Typography variant='h5' sx={{ mt: 3 }}>{props.title}</Typography>
      <Typography variant='body1' sx={{ mt: 2 }}>{props.subtitle}</Typography>
    </React.Fragment>
  );
}
