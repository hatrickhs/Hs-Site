
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';

const EditDealModal = ({ deal, onClose, onSave }: any) => {

  const [categoryId, setCategoryId] = useState(deal.categoryId || 0);

  const [image, setImage] = useState(deal.image || "");

  const [name, setName] = useState(deal.name || "");

  const [discount, setDiscount] = useState(deal.discount || 0);

  const handleSave = () => {
    onSave({
      ...deal,
      categoryId,
      name,
      image,
      discount,
    });
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">

      <DialogTitle>Edit Deal</DialogTitle>

      <DialogContent className="space-y-4">

        <TextField
          fullWidth
          label="Category ID"
          value={categoryId}
          onChange={(e) => setCategoryId(Number(e.target.value))}
          margin="normal"
        />

          <TextField
          fullWidth
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Discount (%)"
          type="number"
          value={discount}
          onChange={(e) => setDiscount(Number(e.target.value))}
          margin="normal"
        />

      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>

        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>

    </Dialog>
  );
};

export default EditDealModal;