
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { HomeCategory } from '../../../State/types/HomeCategoryTypes';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

/* props type */
interface Props {
  data: HomeCategory[];
  onEdit: (category: HomeCategory) => void;
  onDelete: (id?: number) => void;
}

export default function HomeCategoryTable({
  data,
  onEdit,
  onDelete,
}: Props) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }}>
        <TableHead>
          <TableRow>
            <StyledTableCell>No</StyledTableCell>
            <StyledTableCell>Id</StyledTableCell>
            <StyledTableCell align="right">Image</StyledTableCell>
            <StyledTableCell align="right">Name</StyledTableCell>
            <StyledTableCell align="right">Category</StyledTableCell>
            <StyledTableCell align="right">Discount</StyledTableCell>
            <StyledTableCell align="right">Edit</StyledTableCell>
            <StyledTableCell align="right">Delete</StyledTableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map((category, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell>{index + 1}</StyledTableCell>
              <StyledTableCell>{category.id}</StyledTableCell>

              <StyledTableCell align="right">
                <img
                  src={category.image}
                  alt=""
                  className="w-20 rounded-md"
                />
              </StyledTableCell>

              <StyledTableCell align="right">
                {category.name}
              </StyledTableCell>

              <StyledTableCell align="right">
                {category.categoryId}
              </StyledTableCell>

              <StyledTableCell align="right">
                {category.discount ?? 0}%
              </StyledTableCell>

              {/*  Edit */}
              <StyledTableCell align="right">
                <Button onClick={() => onEdit(category)}>
                  <Edit />
                </Button>
              </StyledTableCell>

              {/*  Delete */}
              <StyledTableCell align="right">
                <Button
                  color="error"
                  onClick={() => onDelete(category.id)}
                >
                  <Delete />
                </Button>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}



