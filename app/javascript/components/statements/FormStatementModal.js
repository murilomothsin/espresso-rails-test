import React, { useState }  from 'react';
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';

export default function FormStatementModal(props) {
  const [file, setFile] = useState(null)
  const [categoryId, setCategoryId] = useState(props.statement.category_id)

  const submit = () => {
    const formData = new FormData()
    formData.append('statement[category_id]', categoryId)
    if(file != null) {
      formData.append('statement[attachment]', file, file.name)
    }

    fetch(`/statements/${props.statement.id}`, {
      method: "PUT",
      body: formData
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
        <Typography data-testid="form-statement" id="modal-modal-title" variant="h6" component="h2">
          Editar Despesa
        </Typography>
        <Box>
          Faça o upload do comprovante da despesa (.jpeg, .png ou .pdf)
          <TextField
            type='file'
            sx={tfStyles}
            size="small"
            label="Arquivo"
            onChange={(event) => {
              setFile(event.target.files[0]);
            }}
          />
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Categoria</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={categoryId || ""}
              label="Categoria"
              onChange={(event) => {
                setCategoryId(event.target.value);
              }}
            >
              {props.categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button data-testid="submit" variant="contained" onClick={submit}>Cadastrar</Button>
        </Box>
      </Box>
    </Modal>
  );
}