
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import { getAllDeals, updateDeal, deleteDeal } from "../../../State/admin/DealSlice";
import { Deal } from "../../../State/types/DealTypes";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  styled,
  tableCellClasses,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import EditDealModal from "./EditDealModal";

// Styled Table Cells 
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontWeight: "bold",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
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

const DealTable = () => {
  const dispatch = useAppDispatch();
  const { deals, loading } = useAppSelector((state) => state.deal);

  const [dealList, setDealList] = useState<Deal[]>([]);
  console.log("DEAL LIST:", dealList);
  const [editDeal, setEditDeal] = useState<Deal | null>(null);

  // Fetch deals
  useEffect(() => {
    dispatch(getAllDeals());
  }, [dispatch]);

  // Set deals safely
  useEffect(() => {
    if (deals?.length) {
      const fixed = deals.map((d: any) => ({
        ...d,
        images: Array.isArray(d.images)
          ? d.images
          : d.images
            ? [d.images]
            : [],
      }));

      setDealList(fixed);
    }
  }, [deals]);

  const handleEdit = (deal: Deal) => setEditDeal(deal);

  const handleDelete = (id?: number) => {
    if (!id) return;
    dispatch(deleteDeal(id));
  };

  const handleSave = (updated: Deal) => {
    dispatch(updateDeal(updated));
    setEditDeal(null);
  };

  if (loading) return <p>Loading deals...</p>;
  if (!dealList.length) return <p>No deals available</p>;

  return (
    <>
      <h2 className="text-xl font-bold mb-4">Today's Deals</h2>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>No</StyledTableCell>
              <StyledTableCell>Image</StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Discount</StyledTableCell>
              <StyledTableCell>Category Id</StyledTableCell>
              <StyledTableCell>Edit</StyledTableCell>
              <StyledTableCell>Delete</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {dealList.map((deal, index) => {
              const imageSrc =
                deal.images && deal.images.length > 0
                  ? deal.images[0]
                  : "/default-deal.png";

              return (
                <StyledTableRow key={deal.id}>
                  <StyledTableCell>{index + 1}</StyledTableCell>

                  <StyledTableCell>
                    <div style={{ display: "flex", gap: 5 }}>
                      {deal.images?.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt={deal.name}
                          style={{
                            width: 45,
                            height: 45,
                            objectFit: "cover",
                            borderRadius: 5,
                            border: "1px solid #ddd",
                          }}
                        />
                      ))}
                    </div>
                  </StyledTableCell>

                  <StyledTableCell>{deal.name}</StyledTableCell>
                  <StyledTableCell>{deal.discount}%</StyledTableCell>

                  <StyledTableCell>
                    {deal.categoryId ?? "N/A"}
                  </StyledTableCell>

                  <StyledTableCell>
                    <IconButton onClick={() => handleEdit(deal)}>
                      <Edit sx={{ color: "#1976d2" }} />
                    </IconButton>
                  </StyledTableCell>

                  <StyledTableCell>
                    <IconButton onClick={() => handleDelete(deal.id)}>
                      <Delete sx={{ color: "red" }} />
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Modal */}
      {editDeal && (
        <EditDealModal
          deal={editDeal}
          onClose={() => setEditDeal(null)}
          onSave={handleSave}
        />
      )}
    </>
  );
};

export default DealTable;