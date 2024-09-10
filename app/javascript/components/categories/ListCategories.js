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
import CategoryIcon from '@mui/icons-material/Category';
import NewCategoryModal from './NewCategoryModal'

export default function ListCategories(props) {
  const [categories, setCategories] = useState(props.categories);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    fetch("/categories.json", { method: "GET" })
    .then(T => T.json())
    .then(data => {
      setCategories(data)
    })
  }

  const listCategories = () => {
    if(categories.length == 0) {
      return (
        <React.Fragment>
          <ListItem>
            <ListItemText primary={"Até o momento, não há categorias cadastradas."} />
            <Divider component="div" role="presentation" />
          </ListItem>
          <Divider component="li" style={{width:'100%'}} />
        </React.Fragment>
      )
    }
    return (
      categories.map((category) => (
        <React.Fragment key={category.id}>
          <ListItem >
            <ListItemAvatar>
              <Avatar>
                <CategoryIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={category.name} />
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
        <Typography data-testid="header-categories" variant="h5" noWrap component="div">
          Categorias
        </Typography>
        <Button variant="contained" data-testid="new-category" onClick={handleOpen}>Cadastrar Categoria</Button>
      </Box>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {listCategories()}
      </List>

      <NewCategoryModal open={open} handleClose={handleClose} handleOpen={handleOpen} />
    </Box>
  );
}