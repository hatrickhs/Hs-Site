// import { Button, FormControl, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow } from '@mui/material'
// import { title } from 'process'
// import React, { useState } from 'react'
// import { styled } from '@mui/material/styles';


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

// const SellersTable = () => {
//     const [accountStatus, setAccountStatus] = useState("ACTIVE")

//     const handleChange = (event: any) => {
//         setAccountStatus(event.target.value)
//     }

//     return (
//         <>
//         <div className=' pb-5 w-60'>

//             <FormControl fullWidth>
//                 <InputLabel id="demo-simple-select-label">Account Status</InputLabel>
//                 <Select
//                     labelId="demo-simple-select-label"
//                     id="demo-simple-select"
//                     value={accountStatus}
//                     label="Account Status"
//                     onChange={handleChange}
//                 >
//                     {accountStatu.map((item) => <MenuItem value={item.status}>{item.title}</MenuItem>)}

//                 </Select>
//             </FormControl>



//         </div>
//          <TableContainer component={Paper}>
//       <Table sx={{ minWidth: 700 }} aria-label="customized table">
//         <TableHead>
//           <TableRow>
//             <StyledTableCell>Seller Name</StyledTableCell>
//             <StyledTableCell>Email</StyledTableCell>
//             <StyledTableCell align="right">Mobile</StyledTableCell>
//             <StyledTableCell align="right">GSTIN</StyledTableCell>
//             <StyledTableCell align="right">Bussiness Name</StyledTableCell>
//              <StyledTableCell align="right">account Status</StyledTableCell>
//             <StyledTableCell align="right">Change Status</StyledTableCell>
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
//                <StyledTableCell align="right">{row.carbs}</StyledTableCell>
//               <StyledTableCell align="right"><Button>Change</Button></StyledTableCell>
            
//             </StyledTableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </TableContainer>
//         </>
        
//     )
// }

// export default SellersTable


import React, { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllSellers,
  updateSellerStatus,
} from "../../../State/seller/sellerSlice";

// ------------------------------
// Status options
// ------------------------------
const accountStatusOptions = [
  { status: "PENDING_VERIFICATION", title: "Pending Verification" },
  { status: "ACTIVE", title: "Active" },
  { status: "SUSPENDED", title: "Suspended" },
  { status: "DEACTIVATED", title: "Deactivated" },
  { status: "BANNED", title: "Banned" },
  { status: "CLOSED", title: "Closed" },
];

// ------------------------------
// Styles
// ------------------------------
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": { backgroundColor: theme.palette.action.hover },
}));

// ------------------------------
// Component
// ------------------------------
const SellersTable = () => {
  const dispatch = useDispatch<any>();
  const sellers = useSelector((state: any) => state.seller.sellers);

  const jwt = localStorage.getItem("jwt") || "";

  // 🔽 TOP DROPDOWN STATUS
  const [selectedStatus, setSelectedStatus] = useState("");

  // Fetch sellers
  useEffect(() => {
    dispatch(fetchAllSellers({ status: "ALL", jwt }));
  }, [dispatch, jwt]);

  // Dropdown change
  const handleStatusSelect = (event: any) => {
    setSelectedStatus(event.target.value);
  };

  // Change button click
  const handleChangeClick = (sellerId: number) => {
    if (!selectedStatus) {
      alert("Please select a status first.");
      return;
    }

    dispatch(
      updateSellerStatus({
        id: sellerId,
        status: selectedStatus,
        jwt,
      })
    );
  };

  return (
    <>
      {/* 🔽 TOP DROPDOWN */}
      <FormControl sx={{ mb: 3, width: 250 }}>
        <InputLabel>Select Status</InputLabel>
        <Select value={selectedStatus} onChange={handleStatusSelect}>
          {accountStatusOptions.map((opt) => (
            <MenuItem key={opt.status} value={opt.status}>
              {opt.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* TABLE */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Seller Name</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Mobile</StyledTableCell>
              <StyledTableCell>Business</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Action</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sellers.map((row: any) => (
              <StyledTableRow key={row.id}>
                <TableCell>{row.sellerName}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.mobile}</TableCell>
                <TableCell>
                  {row.businessDetails?.businessName || "-"}
                </TableCell>
                <TableCell>{row.accountStatus}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() => handleChangeClick(row.id)}
                  >
                    Change
                  </Button>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default SellersTable;

