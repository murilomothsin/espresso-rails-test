import React, { useState }  from 'react';
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField'

export default function NewCategoryModal(props) {
  const [name, setName] = useState("")

  const submit = () => {
    console.log(name)

    fetch("/categories", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        category: {
          name: name
        }
      })
    })
    .then(T => T.json())
    .then(data => {
      console.log(data)
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
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Cadastrar Categoria
        </Typography>
        <Box>
          Informe o nome da categoria
          <TextField
            sx={tfStyles}
            size="small"
            label="Nome"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
            <Button variant="contained" onClick={submit}>Cadastrar</Button>
        </Box>
      </Box>
    </Modal>
  );
}