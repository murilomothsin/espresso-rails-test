import React, { useState }  from 'react';
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import NewUserModal from './NewUserModal'
import EditUserModal from './EditUserModal'

export default function ListUsers(props) {
  const stringAvatar = (name) => {
    return {
      children: name.split(' ').reduce((accumulator, currentValue) => accumulator + currentValue[0], ""),
    };
  }
  const [users, setUsers] = useState(props.users);
  const [user, setUser] = useState({});
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const handleOpenEdit = () => setOpenEdit(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setOpenEdit(false)
    setUser({})
    fetch("/users.json", { method: "GET" })
    .then(T => T.json())
    .then(data => {
      setUsers(data)
    })
  }

  const handleEditUser = (user) => {
    setUser(user)
    handleOpenEdit()
  }

  const ContainerBoxStyles = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    p: 4
  }
  return (
    <Box sx={ContainerBoxStyles}>
      <Box sx={{display: "flex", width: "inherit", justifyContent: "space-between"}}>
        <Typography variant="h5" noWrap component="div">
          Funcionários
        </Typography>
        <Button variant="contained" onClick={handleOpen}>Cadastrar Funcionário</Button>
      </Box>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {users.map((user) => (
          <ListItem key={user.id}>
            <ListItemAvatar>
              <Avatar {...stringAvatar(user.name)} />
            </ListItemAvatar>
            <ListItemText primary={user.name} secondary={user.email} />
            <Button variant="outlined" onClick={() => handleEditUser(user)}>Editar</Button>
          </ListItem>
        ))}
      </List>

      <NewUserModal open={open} handleClose={handleClose} handleOpen={handleOpen} />
      <EditUserModal open={openEdit} user={user} handleClose={handleClose} handleOpen={handleOpenEdit} />
    </Box>
  );
}