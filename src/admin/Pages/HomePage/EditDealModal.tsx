// import React, { useState } from 'react';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
// } from '@mui/material';

// const EditDealModal = ({ deal, onClose, onSave }: any) => {
//   const [category, setCategory] = useState(deal.category.categoryId);
//   const [image, setImage] = useState(deal.category.image);
//   const [discount, setDiscount] = useState(deal.discount);

//   const handleSave = () => {
//     onSave({
//       ...deal,
//       discount,
//       category: {
//         ...deal.category,
//         categoryId: category,
//         image,
//       },
//     });
//   };

//   return (
//     <Dialog open onClose={onClose} fullWidth maxWidth="sm">
//       <DialogTitle>Edit Deal</DialogTitle>

//       <DialogContent className="space-y-4">
//         <TextField
//           fullWidth
//           label="Category Name"
//           value={category}
//           onChange={e => setCategory(e.target.value)}
//         />

//         <TextField
//           fullWidth
//           label="Image URL"
//           value={image}
//           onChange={e => setImage(e.target.value)}
//         />

//         <TextField
//           fullWidth
//           label="Discount (%)"
//           type="number"
//           value={discount}
//           onChange={e => setDiscount(e.target.value)}
//         />
//       </DialogContent>

//       <DialogActions>
//         <Button onClick={onClose}>Cancel</Button>
//         <Button variant="contained" onClick={handleSave}>
//           Save
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default EditDealModal;

// // // import React, { useState } from "react";
// // // import {
// // //   Dialog,
// // //   DialogTitle,
// // //   DialogContent,
// // //   DialogActions,
// // //   Button,
// // //   TextField,
// // // } from "@mui/material";
// // // import { Deal } from "../../../State/types/DealTypes";

// // // interface Props {
// // //   deal: Deal;
// // //   onClose: () => void;
// // //   onSave: (deal: Deal) => void;
// // // }

// // // const EditDealModal: React.FC<Props> = ({ deal, onClose, onSave }) => {
// // //   const [discount, setDiscount] = useState<number>(deal.discount || 0);
// // //   const [image, setImage] = useState<string>(deal.image || "");
// // //   const [categoryId, setCategoryId] = useState<number>(deal.categoryId || 0);

// // //   const handleSave = () => {
// // //     onSave({
// // //       ...deal,
// // //       discount,
// // //       image,
// // //       categoryId,
// // //     });
// // //   };

// // //   return (
// // //     <Dialog open onClose={onClose} fullWidth maxWidth="sm">
// // //       <DialogTitle>Edit Deal</DialogTitle>

// // //       <DialogContent>
// // //         <TextField
// // //           fullWidth
// // //           label="Discount (%)"
// // //           type="number"
// // //           value={discount}
// // //           onChange={(e) => setDiscount(Number(e.target.value))}
// // //           margin="normal"
// // //         />

// // //         <TextField
// // //           fullWidth
// // //           label="Image URL"
// // //           value={image}
// // //           onChange={(e) => setImage(e.target.value)}
// // //           margin="normal"
// // //         />

// // //         <TextField
// // //           fullWidth
// // //           label="Category ID"
// // //           type="number"
// // //           value={categoryId}
// // //           onChange={(e) => setCategoryId(Number(e.target.value))}
// // //           margin="normal"
// // //         />
// // //       </DialogContent>

// // //       <DialogActions>
// // //         <Button onClick={onClose}>Cancel</Button>
// // //         <Button variant="contained" onClick={handleSave}>
// // //           Save
// // //         </Button>
// // //       </DialogActions>
// // //     </Dialog>
// // //   );
// // // };

// // // export default EditDealModal;


// // import React, { useState, useEffect } from "react";
// // import {
// //   Dialog,
// //   DialogTitle,
// //   DialogContent,
// //   DialogActions,
// //   Button,
// //   TextField,
// // } from "@mui/material";
// // import { Deal } from "../../../State/types/DealTypes";

// // // Level 2 datasets
// // import { menLevelTwo } from "../../../data/category/LevelTwo/menLevelTwo";
// // import { womenLevelTwo } from "../../../data/category/LevelTwo/womenLevelTwo";
// // import { furnitureLevelTwo } from "../../../data/category/LevelTwo/furnitureLevelTwo";
// // import { electronicsLevelTwo } from "../../../data/category/LevelTwo/electronicsLevelTwo";

// // // Level 3 datasets
// // import { menLevelThree } from "../../../data/category/LevelThree/menLevelThree";
// // import { womenLevelThree } from "../../../data/category/LevelThree/womenLevelThree";
// // import { furnitureLevelThree } from "../../../data/category/LevelThree/furnitureLevelThree";
// // import { electronicsLevelThree } from "../../../data/category/LevelThree/electronicsLevelThree";

// // interface Props {
// //   deal: Deal;
// //   onClose: () => void;
// //   onSave: (deal: Deal) => void;
// // }

// // const EditDealModal: React.FC<Props> = ({ deal, onClose, onSave }) => {
// //   // Categories
// //   const [mainCategory, setMainCategory] = useState<string>(deal.mainCategory || "Men");
// //   const [levelTwoCategory, setLevelTwoCategory] = useState<string>(deal.levelTwoCategory || "");
// //   const [levelThreeCategory, setLevelThreeCategory] = useState<string>(deal.levelThreeCategory || "");
// //   const [categoryId, setCategoryId] = useState<string>(deal.categoryId?.toString() || "");

// //   const [image, setImage] = useState<string>(deal.image || "");
// //   const [discount, setDiscount] = useState<number>(deal.discount || 0);

// //   const [levelTwoOptions, setLevelTwoOptions] = useState<any[]>([]);
// //   const [levelThreeOptions, setLevelThreeOptions] = useState<any[]>([]);

// //   // Update Level 2 options when Main category changes
// //   useEffect(() => {
// //     let options: any[] = [];
// //     switch (mainCategory) {
// //       case "Men": options = menLevelTwo; break;
// //       case "Women": options = womenLevelTwo; break;
// //       case "Home & Furniture": options = furnitureLevelTwo; break;
// //       case "Electronics": options = electronicsLevelTwo; break;
// //     }
// //     setLevelTwoOptions(options);
// //     setLevelTwoCategory("");
// //     setLevelThreeCategory("");
// //     setCategoryId("");
// //     setLevelThreeOptions([]);
// //   }, [mainCategory]);

// //   // Update Level 3 options when Level 2 changes
// //   useEffect(() => {
// //     let options: any[] = [];
// //     if (levelTwoCategory) {
// //       switch (mainCategory) {
// //         case "Men": options = menLevelThree.filter(i => i.parentCategoryId === levelTwoCategory); break;
// //         case "Women": options = womenLevelThree.filter(i => i.parentCategoryId === levelTwoCategory); break;
// //         case "Home & Furniture": options = furnitureLevelThree.filter(i => i.parentCategoryId === levelTwoCategory); break;
// //         case "Electronics": options = electronicsLevelThree.filter(i => i.parentCategoryId === levelTwoCategory); break;
// //       }
// //     }
// //     setLevelThreeOptions(options);
// //     setLevelThreeCategory("");
// //   }, [levelTwoCategory, mainCategory]);

// //   // Auto-update categoryId
// //   useEffect(() => {
// //     if (levelThreeCategory) {
// //       setCategoryId(levelThreeCategory);
// //     } else if (levelTwoCategory) {
// //       setCategoryId(levelTwoCategory);
// //     }
// //   }, [levelTwoCategory, levelThreeCategory]);

// //   const handleSave = () => {
// //     onSave({
// //       ...deal,
// //       mainCategory,
// //       levelTwoCategory,
// //       levelThreeCategory,
// //       categoryId: Number(categoryId),
// //       image,
// //       discount,
// //     });
// //   };

// //   return (
// //     <Dialog open onClose={onClose} fullWidth maxWidth="sm">
// //       <DialogTitle>Edit Deal</DialogTitle>

// //       <DialogContent className="space-y-4">
// //         {/* Main Category */}
// //         <div>
// //           <label>Main Category</label>
// //           <select
// //             value={mainCategory}
// //             onChange={(e) => setMainCategory(e.target.value)}
// //             className="w-full border px-2 py-1 rounded"
// //           >
// //             <option value="Men">Men</option>
// //             <option value="Women">Women</option>
// //             <option value="Home & Furniture">Home & Furniture</option>
// //             <option value="Electronics">Electronics</option>
// //           </select>
// //         </div>

// //         {/* Level 2 */}
// //         <div>
// //           <label>Level 2 Category</label>
// //           <select
// //             value={levelTwoCategory}
// //             onChange={(e) => setLevelTwoCategory(e.target.value)}
// //             className="w-full border px-2 py-1 rounded"
// //             disabled={!levelTwoOptions.length}
// //           >
// //             <option value="">Select Level 2</option>
// //             {levelTwoOptions.map(item => (
// //               <option key={item.categoryId} value={item.categoryId}>{item.name}</option>
// //             ))}
// //           </select>
// //         </div>

// //         {/* Level 3 */}
// //         {levelThreeOptions.length > 0 && (
// //           <div>
// //             <label>Level 3 Category</label>
// //             <select
// //               value={levelThreeCategory}
// //               onChange={(e) => setLevelThreeCategory(e.target.value)}
// //               className="w-full border px-2 py-1 rounded"
// //             >
// //               <option value="">Select Level 3</option>
// //               {levelThreeOptions.map(item => (
// //                 <option key={item.categoryId} value={item.categoryId}>{item.name}</option>
// //               ))}
// //             </select>
// //           </div>
// //         )}

// //         {/* Category ID (readonly) */}
// //         <TextField
// //           fullWidth
// //           label="Category ID"
// //           value={categoryId}
// //           InputProps={{ readOnly: true }}
// //           margin="normal"
// //         />

// //         {/* Image */}
// //         <TextField
// //           fullWidth
// //           label="Image URL"
// //           value={image}
// //           onChange={(e) => setImage(e.target.value)}
// //           margin="normal"
// //         />

// //         {/* Discount */}
// //         <TextField
// //           fullWidth
// //           label="Discount (%)"
// //           type="number"
// //           value={discount}
// //           onChange={(e) => setDiscount(Number(e.target.value))}
// //           margin="normal"
// //         />
// //       </DialogContent>

// //       <DialogActions>
// //         <Button onClick={onClose}>Cancel</Button>
// //         <Button variant="contained" onClick={handleSave}>Save</Button>
// //       </DialogActions>
// //     </Dialog>
// //   );
// // };

// // export default EditDealModal;

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