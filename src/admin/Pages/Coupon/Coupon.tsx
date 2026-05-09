// import { Button, FormControl, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow } from '@mui/material'
// import { title } from 'process'
// import React, { useState } from 'react'
// import { styled } from '@mui/material/styles';
// import { Delete } from '@mui/icons-material';


// const accountStatu = [
//     { status: 'PENDING_VERIFICATION', title: 'Pending Verification', description: 'Awaiting approval' },
//     { status: 'ACTIVE', title: 'Active', description: 'Account is active and in good standing' },
//     { status: 'SUSPENDED', title: 'Suspended', description: 'Account is temporarily suspended' },
//     { status: 'DEACTIVATED', title: 'Deactivated', description: 'Account is deactivated' },
//     { status: 'BANNED', title: 'Banned', description: 'Account is permanently banned' },
//     { status: 'CLOSED', title: 'Closed', description: 'Account is permanently closed' },
// ];


// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//   [`&.${tableCellClasses.head}`]: {
//     backgroundColor: theme.palette.common.black,
//     color: theme.palette.common.white,
//   },
//   [`&.${tableCellClasses.body}`]: {
//     fontSize: 14,
//   },
// }));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   '&:nth-of-type(odd)': {
//     backgroundColor: theme.palette.action.hover,
//   },
//   // hide last border
//   '&:last-child td, &:last-child th': {
//     border: 0,
//   },
// }));

// function createData(
//   name: string,
//   calories: number,
//   fat: number,
//   carbs: number,
//   protein: number,
// ) {
//   return { name, calories, fat, carbs, protein };
// }

// const rows = [
//   createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
//   createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
//   createData('Eclair', 262, 16.0, 24, 6.0),
//   createData('Cupcake', 305, 3.7, 67, 4.3),
//   createData('Gingerbread', 356, 16.0, 49, 3.9),
// ];

// const Coupon = () => {
//     const [accountStatus, setAccountStatus] = useState("ACTIVE")

//     const handleChange = (event: any) => {
//         setAccountStatus(event.target.value)
//     }

//     return (
//         <>

//          <TableContainer component={Paper}>
//       <Table sx={{ minWidth: 700 }} aria-label="customized table">
//         <TableHead>
//           <TableRow>
//             <StyledTableCell>Coupon Code</StyledTableCell>
//             <StyledTableCell>Start Date</StyledTableCell>
//             <StyledTableCell>End Date</StyledTableCell>
//             <StyledTableCell align="right">Minimum Order Value</StyledTableCell>
//             <StyledTableCell align="right">Discount</StyledTableCell>
//              <StyledTableCell align="right">Delete</StyledTableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {rows.map((row) => (
//             <StyledTableRow key={row.name}>
//               <StyledTableCell component="th" scope="row">
//                 {row.name}
//               </StyledTableCell>
//               <StyledTableCell>{row.calories}</StyledTableCell>
//               <StyledTableCell align="right">{row.fat}</StyledTableCell>
//               <StyledTableCell align="right">{row.carbs}</StyledTableCell>
//               <StyledTableCell align="right">{row.protein}</StyledTableCell>
//               <StyledTableCell align="right"><Button><Delete/></Button></StyledTableCell>

//             </StyledTableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </TableContainer>
//         </>

//     )
// }

// export default Coupon



import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";

import { useAppDispatch, useAppSelector } from "../../../State/Store";
import { fetchCoupons, deleteCoupon } from "../../../State/admin/adminCouponSlice";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses?.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const CouponTable = () => {
  const dispatch = useAppDispatch();
  const { coupons, loading, error } = useAppSelector((state) => state.adminCoupon);
  const jwt = localStorage.getItem("jwt") || "";

  useEffect(() => {
    dispatch(fetchCoupons(jwt));
  }, [dispatch, jwt]);

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      dispatch(deleteCoupon({ id, jwt }));
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="coupons table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Coupon Code</StyledTableCell>
            <StyledTableCell>Start Date</StyledTableCell>
            <StyledTableCell>End Date</StyledTableCell>
            <StyledTableCell align="right">Minimum Order Value</StyledTableCell>
            <StyledTableCell align="right">Discount %</StyledTableCell>
            <StyledTableCell align="right">Delete</StyledTableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {error && <TableRow><TableCell colSpan={6}>{error}</TableCell></TableRow>}
          {coupons.map((coupon) => (
            <StyledTableRow key={coupon.id}>
              <TableCell>{coupon.code}</TableCell>
              <TableCell>{coupon.validityStartDate}</TableCell>
              <TableCell>{coupon.validityEndDate}</TableCell>

              <TableCell align="right">{coupon.minimumOrderValue}</TableCell>
              <TableCell align="right">{coupon.discountPercentage}</TableCell>
              <TableCell align="right">
                <Button onClick={() => handleDelete(coupon.id)} color="error" variant="outlined">
                  <Delete />
                </Button>
              </TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CouponTable;
