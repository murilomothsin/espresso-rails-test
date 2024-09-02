import React, { useState } from "react"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import logo from "./logo.svg"


const NewUser = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [cnpj, setCnpj] = useState("")
  const submit = () => {
    fetch("/users", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: {
          name: name,
          email: email,
          password: password
        },
        company: {
          name: companyName,
          cnpj: cnpj
        }
      })
    })
    .then(T => T.json())
    .then(data => {
    })
  }

  const ContainerStyles = {
    bgcolor: "#2196F3",
    width: "100vw",
    height: "100vh",
    padding: "0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }

  const BoxStyles = {
    p: 2,
    bgcolor: "#FFFFFF",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: "600px"
  }

  const tfStyles = {
    width: "100%",
    m: 1
  }

  const divContainerStyles = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }

  const logoStyles = {
    marginBottom: "30px"
  }
  return (
    <React.Fragment>
      <Container maxWidth={false} sx={ ContainerStyles }>
        <div style={divContainerStyles}>
          <img src={logo} style={logoStyles} alt="Expresso logo" />
          <Box component="section" sx={BoxStyles}>
            <Typography variant="h4" component="h1" align="center">
              Criar conta
            </Typography>
            <TextField
              sx={tfStyles}
              size="small"
              label="Nome"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
              }}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
            <TextField
              sx={tfStyles}
              size="small"
              label="E-mail"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
              }}/>
            <TextField
              sx={tfStyles}
              size="small"
              label="Senha"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
              }}/>
            <TextField
              sx={tfStyles}
              size="small"
              label="Nome da empresa"
              value={companyName}
              onChange={(event) => {
                setCompanyName(event.target.value);
              }}/>
            <TextField
              sx={tfStyles}
              size="small"
              label="CNPJ"
              value={cnpj}
              onChange={(event) => {
                setCnpj(event.target.value);
              }}/>
            <Button variant="contained" onClick={submit}>Criar conta</Button>
          </Box>
        </div>
      </Container>
    </React.Fragment>
  )
}


export default NewUser
