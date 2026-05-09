import React from 'react';
import { Dialog, DialogTitle, DialogActions, Button } from '@mui/material';

interface Props {
  open: boolean;
  onYes: () => void;
  onNo: () => void;
}

const InactivityModal = ({ open, onYes, onNo }: Props) => {
  return (
    <Dialog open={open}>
      <DialogTitle>Inactive!</DialogTitle>
      <div className="p-4">You have been inactive. Do you want to stay logged in?</div>
      <DialogActions>
        <Button onClick={onNo} color="error">No</Button>
        <Button onClick={onYes} color="primary">Yes</Button>
      </DialogActions>
    </Dialog>
  );
};

export default InactivityModal;
