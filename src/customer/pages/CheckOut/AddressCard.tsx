
import { Radio, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";

interface AddressCardProps {
  address: any;
  selected: boolean;
  onSelect: (addr: any) => void;
  onRemove?: (id: number) => void; // 👈 optional
  showDelete?: boolean;             // 👈 NEW
}

const AddressCard: React.FC<AddressCardProps> = ({
  address,
  selected,
  onSelect,
  onRemove,
  showDelete = true, 
}) => {
  return (
    <div className="p-5 border rounded-md flex justify-between items-start">
      <div className="flex gap-3">
        <Radio
          checked={selected}
          onChange={() => onSelect(address)}
        />

        <div className="space-y-2 pt-1">
          <h1 className="font-semibold">{address.name}</h1>

          <p className="w-[320px] text-sm">
            {address.address}
            {address.locality && `, ${address.locality}`}
            , {address.city}
            {address.state && `, ${address.state}`} - {address.pinCode}
          </p>

          <p className="text-sm">
            <strong>Mobile:</strong> {address.mobile}
          </p>
        </div>
      </div>

      {/* Delete icon – conditionally render */}
      {showDelete && onRemove && (
        <IconButton onClick={() => onRemove(address.id)}>
          <CloseIcon />
        </IconButton>
      )}
    </div>
  );
};

export default AddressCard;
