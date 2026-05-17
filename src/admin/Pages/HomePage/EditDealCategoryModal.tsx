
import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from '@mui/material';
import { HomeCategory } from '../../../State/types/HomeCategoryTypes';

//  Use HomeCategory directly, discount is handled separately if needed
type DealCategory = HomeCategory;

interface Props {
  category: DealCategory;
  onClose: () => void;
  onSave: (category: DealCategory) => void;
}

const EditDealCategoryModal: React.FC<Props> = ({ category, onClose, onSave }) => {
  const [image, setImage] = useState<string>(category.image || '');
  const [categoryId, setCategoryId] = useState<string>(category.categoryId.toString());
  const [discount, setDiscount] = useState<string>(
    category.discount !== undefined && category.discount !== null
      ? category.discount.toString()
      : ''
  );

  const handleSave = () => {
    const updatedCategory: DealCategory = {
      ...category,
      image,
      categoryId: categoryId,
      discount: discount === '' ? 0 : Number(discount)
    };
    onSave(updatedCategory);
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Deal Category</DialogTitle>

      <DialogContent className="space-y-4">
        <TextField
          fullWidth
          label="Category ID"
          type="number"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        />

        <TextField
          fullWidth
          label="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />

        <TextField
          fullWidth
          label="Discount"
          placeholder="ex: 40% OFF"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
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

export default EditDealCategoryModal;
