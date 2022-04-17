import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';

// Generate Order Data
function createData(id, date, title, file, by, views)
{
  return { id, date, title, file, by, views };
}


function preventDefault(event)
{
  event.preventDefault();
}

export default function Declrs(props)
{
  const { declarations } = props
  const rows = declarations.map(el =>
  {
    return createData(
      el._id,
      el.date[0],
      el.title,
      el.file ? el.file.name : "nothing",
      "User",
      2,
    )
  })
  console.log(rows)

  return (
    <React.Fragment>
      <Title>Recent Declarations</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>File</TableCell>
            <TableCell>By</TableCell>
            <TableCell align="right">Views</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.title}</TableCell>
              <TableCell>{row.file}</TableCell>
              <TableCell>{row.by}</TableCell>
              <TableCell align="right">{row.views}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
        See more orders
      </Link>
    </React.Fragment>
  );
}