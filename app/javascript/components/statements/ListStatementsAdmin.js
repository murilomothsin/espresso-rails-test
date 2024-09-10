import React, { useState, useEffect }  from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ArchiveIcon from '@mui/icons-material/Archive';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import IconButton from '@mui/material/IconButton';
import { DataGrid } from '@mui/x-data-grid';
import Chip from '@mui/material/Chip';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}


export default function ListStatementsAdmin(props) {
  const [statements, setStatements] = useState(props.statements)
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const ContainerBoxStyles = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    p: 4
  }

  const columns = [
    {
      field: 'merchant',
      headerName: 'Estabelecimento',
      width: 230,
      display: 'flex',
      renderCell: (params) => (
        <React.Fragment>
          <Avatar data-testid={params.row.id}>
            <ReceiptIcon />
          </Avatar>
          {params.value}
        </React.Fragment>
      ),
    },
    { field: 'cost', headerName: 'Valor', width: 70 },
    { field: 'performed_at', headerName: 'Data da criação', width: 160 },
    {
      field: 'last4',
      headerName: 'Cartão',
      sortable: false,
      width: 70,
      valueGetter: (value, row) => row.card.last4,
    },
    {
      field: 'attachment',
      headerName: 'Comprovação',
      width: 150,
      renderCell: (params) => (
        params.row.has_attachment ?
        (<Chip label="Comprovada" color="success" />) :
        (<Chip label="Não comprovada" />)
      ),
    },
    {
      field: 'user',
      headerName: 'Funcionário',
      sortable: false,
      width: 130,
      valueGetter: (value, row) => row.user.name,
    },
    {
      field: 'category',
      headerName: 'Categoria',
      sortable: false,
      width: 130,
      valueGetter: (value, row) => row.category?.name || "-",
    },
    {
      field: 'actions',
      headerName: '',
      width: 100,
      display: 'flex',
      renderCell: (params) => (
        <React.Fragment>
          <IconButton data-testid="archive" onClick={() => archive(params.row)}>
            <ArchiveIcon />
          </IconButton>
        </React.Fragment>
      ),
    },
  ];

  const archive = (statement) => {
    fetch(`/statements/${statement.id}/archive`, {
      method: 'PUT',
    })
    .then(data => {
      loadStatements()
    })
  }

  const loadStatements = () => {
    fetch(`/statements.json`)
    .then(T => T.json())
    .then(data => {
      setStatements(data)
    })
  }

  const paginationModel = { page: 0, pageSize: 5 };

  return (
    <Box sx={ContainerBoxStyles}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs data-testid="header-statements" value={value} onChange={handleChange}>
          <Tab label="Lista" />
          <Tab label="Arquivadas" data-testid="archived-tab" />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <DataGrid
          data-testid="full-grid"
          rows={statements.filter((statement) => !statement.archived)}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          rowSelection={false}
          disableColumnSorting
          sx={{ border: 0 }}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <DataGrid
          data-testid="archived-grid"
          rows={statements.filter((statement) => statement.archived)}
          columns={columns.slice(0, -1)}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          rowSelection={false}
          disableColumnSorting
          sx={{ border: 0 }}
        />
      </CustomTabPanel>
    </Box>
  );
}