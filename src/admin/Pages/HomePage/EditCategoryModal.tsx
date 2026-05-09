import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { HomeCategory } from '../../../State/types/HomeCategoryTypes';

interface Props {
  category: HomeCategory;
  onClose: () => void;
  onSave: (category: HomeCategory) => void;
}

const EditCategoryModal = ({ category, onClose, onSave }: Props) => {
  const [categoryId, setCategoryId] = useState(category.categoryId);
  const [image, setImage] = useState(category.image);

  const handleSave = () => {
    onSave({
      ...category,
      categoryId,
      image,
    });
  };

  return (
    <Dialog open onClose={onClose} fullWidth>
      <DialogTitle>Edit Category</DialogTitle>

      <DialogContent className="space-y-4">
        <TextField
          fullWidth
          label="Category Name"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        />

        <TextField
          fullWidth
          label="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />

        <img
          src={image}
          alt="preview"
          className="w-32 rounded mt-3"
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

export default EditCategoryModal;
