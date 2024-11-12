import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Box, InputLabel, PaletteMode, styled, Typography } from '@mui/material';
import ToggleColorMode from '@/theme/ToggleColorMode';
import PersonIcon from '@mui/icons-material/Person';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '@/context/UserContext';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    position: 'fixed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
    borderBottom: '1px solid',
    borderColor: theme.palette.divider,
    backgroundColor: theme.palette.background.paper,
    boxShadow: 'none',
    backgroundImage: 'none',
    zIndex: theme.zIndex.drawer + 1,
    flex: '0 0 auto',
  }));

  
export default function TopBar(props: {mode: PaletteMode, toggleColorMode: () => void}) {
    const {empresa, user, chooseEmpresa} = useContext(UserContext)
    const [select, setSelect] = useState("")

    useEffect(() => {
        if(empresa) setSelect(empresa.idEmpresa)
    },[empresa])

    return <StyledAppBar>
    <Toolbar
      variant="dense"
      disableGutters
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        p: '8px 12px',
      }}
    >
      <Box sx={{ display: 'flex', gap: 1, width: "100%", alignItems: 'center' }}>
        <Typography variant='h5' sx={{ display: 'flex', flex: 1, alignItems: 'center' }} color='textDisabled'>
          <PersonIcon sx={{ mr: 2 }} />
          {user?.nome}<strong style={{fontSize: "12px", marginLeft: "10px"}}> {empresa?.tpUsuario && `(${empresa.tpUsuario})`}</strong>
        </Typography>
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel id="demo-simple-select-label">Empresa</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Empresa"
            value={select}
            onChange={e => chooseEmpresa(e.target.value)}
          >
            {user?.empresas.map((v, i) => <MenuItem key={i} value={v.idEmpresa}>{v.nomeEmpresa}</MenuItem>)}
          </Select>
        </FormControl>
        <ToggleColorMode
          data-screenshot="toggle-mode"
          mode={props.mode}
          toggleColorMode={props.toggleColorMode}
        />
      </Box>
    </Toolbar>
  </StyledAppBar>
}