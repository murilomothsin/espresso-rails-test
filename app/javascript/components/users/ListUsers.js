import React, { useState }  from 'react';
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import FormUserModal from './FormUserModal'

export default function ListUsers(props) {
  const stringAvatar = (name) => {
    return {
      children: name.split(' ').reduce((accumulator, currentValue) => accumulator + currentValue[0], ""),
    };
  }
  const [users, setUsers] = useState(props.users);
  const [user, setUser] = useState({});
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setUser({})
    fetch("/users.json", { method: "GET" })
    .then(T => T.json())
    .then(data => {
      setUsers(data)
    })
  }

  const handleEditUser = (user) => {
    setUser(user)
    handleOpen()
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
        <Typography variant="h5" data-testid="header-users" noWrap component="div">
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
            <Button variant="outlined" data-testid="edit-user" onClick={() => handleEditUser(user)}>Editar</Button>
          </ListItem>
        ))}
      </List>

      <FormUserModal open={open} user={user} handleClose={handleClose} handleOpen={handleOpen} />
    </Box>
  );
}