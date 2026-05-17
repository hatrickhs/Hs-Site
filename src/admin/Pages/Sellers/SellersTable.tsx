
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

const accountStatusOptions = [
  { status: "PENDING_VERIFICATION", title: "Pending Verification" },
  { status: "ACTIVE", title: "Active" },
  { status: "SUSPENDED", title: "Suspended" },
  { status: "DEACTIVATED", title: "Deactivated" },
  { status: "BANNED", title: "Banned" },
  { status: "CLOSED", title: "Closed" },
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": { backgroundColor: theme.palette.action.hover },
}));

const SellersTable = () => {
  const dispatch = useDispatch<any>();
  const sellers = useSelector((state: any) => state.seller.sellers);
  console.log(sellers)

  const jwt = localStorage.getItem("jwt") || "";

  //  TOP DROPDOWN STATUS
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
  useEffect(() => {
  dispatch(fetchAllSellers({ status: "ALL", jwt }));
}, [dispatch, jwt]);

useEffect(() => {
  console.log("SELLERS UPDATED:", sellers);
}, [sellers]);

  return (
    <>
      {/*  TOP DROPDOWN */}
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

