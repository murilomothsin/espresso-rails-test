import React, { useState, useEffect }  from 'react';
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField'

export default function FormUserModal(props) {
  const [name, setName] = useState(props.user.name)
  const [email, setEmail] = useState(props.user.email)

  useEffect(() => {
    setEmail(props.user.email);
    setName(props.user.name);
  }, [props.user]);

  const submit = () => {
    fetch(`/users/${props.user.id}`, {
      method: "PUT",
      headers: {
        "Accept": "application/json",
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: {
          name: name,
          email: email
        }
      })
    })
    .then(data => {
      props.handleClose()
    })
  }

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    borderRadius: "5px",
    boxShadow: 24,
    p: 4,
  };

  const tfStyles = {
    width: "100%",
    m: 1
  }

  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography data-testid="edit-user-modal" id="modal-modal-title" variant="h6" component="h2">
          Editar Funcionário
        </Typography>
        <Box>
          Informe os dados
          <TextField
            sx={tfStyles}
            size="small"
            label="Nome"
            value={name || ""}
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
          <TextField
            sx={tfStyles}
            size="small"
            label="E-mail"
            value={email || ""}
            onChange={(event) => {
              setEmail(event.target.value);
            }}/>
            <Button variant="contained" data-testid="submit" onClick={submit}>Cadastrar</Button>
        </Box>
      </Box>
    </Modal>
  );
}