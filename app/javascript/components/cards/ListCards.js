import React, { useState }  from 'react';
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import FormCardModal from './FormCardModal'

export default function ListCards(props) {
  const [cards, setCards] = useState(props.cards);
  const [users, setUsers] = useState(props.users);
  const [card, setCard] = useState({});
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    fetch("/cards.json", { method: "GET" })
    .then(T => T.json())
    .then(data => {
      console.log(data)
      setCards(data.cards)
      setUsers(data.users)
    })
  }

  const handlecardUser = (card) => {
    setCard(card)
    handleOpen()
  }

  const listCards = () => {
    if(cards.length == 0) {
      return (
        <React.Fragment>
          <ListItem>
            <ListItemText primary={"Até o momento, não há cartões cadastrados."} />
            <Divider component="div" role="presentation" />
          </ListItem>
          <Divider component="li" style={{width:'100%'}} />
        </React.Fragment>
      )
    }
    return (
      cards.map((card) => (
        <React.Fragment key={card.id}>
          <ListItem >
            <ListItemAvatar>
              <Avatar>
                <CreditCardIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={users.find((user) => user.id === card.user_id).name} secondary={`**** **** **** ${card.last4}`} />
            <Button variant="outlined" onClick={() => handlecardUser(card)}>Editar</Button>
          </ListItem>
          <Divider component="li" style={{width:'100%'}} />
        </React.Fragment>
      ))
    )
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
          Cartões
        </Typography>
        <Button variant="contained" onClick={handleOpen}>Cadastrar Cartão</Button>
      </Box>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {listCards()}
      </List>

      <FormCardModal card={card} users={users} open={open} handleClose={handleClose} handleOpen={handleOpen} />
    </Box>
  );
}