import React, { useState, useEffect }  from 'react';
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';

export default function FormCardModal(props) {
  const [last4, setLast4] = useState(props.card.last4)
  const [userId, setUserId] = useState(props.card.user_id)

  useEffect(() => {
    setLast4(props.card.last4);
    setUserId(props.card.user_id);
  }, [props.card]);

  const submit = () => {
    let url = "/cards"
    let method = "POST"
    if (props.card.id != null) {
      url = `/cards/${props.card.id}`
      method = "PUT"

    }
    fetch(url, {
      method: method,
      headers: {
        "Accept": "application/json",
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        card: {
          last4: last4,
          user_id: userId
        }
      })
    })
    .then(T => T.json())
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
        <Typography data-testid="form-card-edit" id="modal-modal-title" variant="h6" component="h2">
          Cadastrar Cartão
        </Typography>
        <Box>
          Informe os dados
          <TextField
            sx={tfStyles}
            size="small"
            label="Número"
            value={last4 || ""}
            onChange={(event) => {
              setLast4(event.target.value);
            }}
          />
          <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Funcionário</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={userId || ""}
              label="Funcionário"
              onChange={(event) => {
                setUserId(event.target.value);
              }}
            >
              {props.users.map((user) => (
                <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
            <Button variant="contained" data-testid="submit" onClick={submit}>Cadastrar</Button>
        </Box>
      </Box>
    </Modal>
  );
}