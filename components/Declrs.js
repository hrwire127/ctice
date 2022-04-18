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
          {rows.map(row => (
            <TableRow key={row.id}>
              <TableCell>{rows[0].date}</TableCell>
              <TableCell>{rows[0].title}</TableCell>
              <TableCell>{rows[0].file}</TableCell>
              <TableCell>{rows[0].by}</TableCell>
              <TableCell align="right">{rows[0].views}</TableCell>
            </TableRow>
          ))}
        </TableBody>

      </Table>
      <Link color="primary" href="#" sx={{ mt: 3 }}>
        See more orders
      </Link>
    </React.Fragment>
  );
}