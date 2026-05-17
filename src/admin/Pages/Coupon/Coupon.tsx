
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
