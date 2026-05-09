
import React, { useState, useEffect } from "react";
import { HomeCategory } from "../../../State/types/HomeCategoryTypes";
import { updateHomeCategory } from "./HomeCategoryApi";

// Level 2 datasets
import { menLevelTwo } from '../../../data/category/LevelTwo/menLevelTwo';
import { womenLevelTwo } from '../../../data/category/LevelTwo/womenLevelTwo';
import { furnitureLevelTwo } from '../../../data/category/LevelTwo/furnitureLevelTwo';
import { electronicsLevelTwo } from '../../../data/category/LevelTwo/electronicsLevelTwo';

// Level 3 datasets
import { menLevelThree } from '../../../data/category/LevelThree/menLevelThree';
import { womenLevelThree } from '../../../data/category/LevelThree/womenLevelThree';
import { furnitureLevelThree } from '../../../data/category/LevelThree/furnitureLevelThree';
import { electronicsLevelThree } from '../../../data/category/LevelThree/electronicsLevelThree';

interface Props {
  category?: HomeCategory;
  onSave: (data: HomeCategory) => void;
  onClose: () => void;
}

const EditCategoryModalApi = ({ category, onSave, onClose }: Props) => {
  const [mainCategory, setMainCategory] = useState(category?.mainCategory || "Men");
  const [levelTwoCategory, setLevelTwoCategory] = useState(category?.levelTwoCategory || "");
  const [levelThreeCategory, setLevelThreeCategory] = useState(category?.levelThreeCategory || "");
  const [categoryId, setCategoryId] = useState(category?.categoryId || "");
  const [image, setImage] = useState(category?.image || "");
  const [name, setName] = useState(category?.name || "");
  const [discount, setDiscount] = useState(category?.discount || 0);


  const [levelTwoOptions, setLevelTwoOptions] = useState<any[]>([]);
  const [levelThreeOptions, setLevelThreeOptions] = useState<any[]>([]);

  // Level 2 options update
  useEffect(() => {
    let options: any[] = [];
    switch (mainCategory) {
      case "Men": options = menLevelTwo; break;
      case "Women": options = womenLevelTwo; break;
      case "Home & Furniture": options = furnitureLevelTwo; break;
      case "Electronics": options = electronicsLevelTwo; break;
      default: options = [];
    }
    setLevelTwoOptions(options);
    setLevelTwoCategory("");
    setLevelThreeCategory("");
    setLevelThreeOptions([]);
    setCategoryId(""); // reset categoryId
  }, [mainCategory]);

  // Level 3 options update
  useEffect(() => {
    let options: any[] = [];
    if (levelTwoCategory) {
      switch (mainCategory) {
        case "Men": options = menLevelThree.filter(item => item.parentCategoryId === levelTwoCategory); break;
        case "Women": options = womenLevelThree.filter(item => item.parentCategoryId === levelTwoCategory); break;
        case "Home & Furniture": options = furnitureLevelThree.filter(item => item.parentCategoryId === levelTwoCategory); break;
        case "Electronics": options = electronicsLevelThree.filter(item => item.parentCategoryId === levelTwoCategory); break;
      }
    }
    setLevelThreeOptions(options);
    setLevelThreeCategory("");
    setCategoryId(""); // reset categoryId
  }, [levelTwoCategory, mainCategory]);

  // Update categoryId when level 2 or level 3 changes
  useEffect(() => {
    if (levelThreeCategory) {
      setCategoryId(levelThreeCategory); // level 3 selected
    } else if (levelTwoCategory) {
      setCategoryId(levelTwoCategory); // only level 2 selected
    }
  }, [levelTwoCategory, levelThreeCategory]);

  const handleSave = async () => {
    if (!category?.id) return alert("Category ID missing");

    try {
      const formData: HomeCategory = {
        ...category,
        name,
        discount,
        mainCategory,
        levelTwoCategory,
        levelThreeCategory,
        categoryId, // automatically set
        image,
      };
      const res = await updateHomeCategory(category.id, formData);

      onSave(res.data);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  return (
    // <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      {/* <div className="bg-white p-5 rounded w-[400px]"> */}
      <div className="bg-white rounded w-[400px] max-h-[90vh] flex flex-col">
        <h2 className="text-lg font-bold mb-3">Edit Category</h2>

        {/* Header */}
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold">Edit Category</h2>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="p-4 overflow-y-auto flex-1">

          {/* Discount */}
        <input
          type="number"
          className="border w-full mb-2 p-2"
          placeholder="Discount (%)"
          value={discount}
          onChange={(e) => setDiscount(Number(e.target.value))}
          min={0}
          max={100}
        />

        {/* Image */}
        <input
          className="border w-full mb-2 p-2"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        
        {/* Main Category */}
        <select
          className="border w-full mb-2 p-2"
          value={mainCategory}
          onChange={(e) => setMainCategory(e.target.value)}
        >
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Home & Furniture">Home & Furniture</option>
          <option value="Electronics">Electronics</option>
        </select>

        {/* Level 2 */}
        <select
          className="border w-full mb-2 p-2"
          value={levelTwoCategory}
          onChange={(e) => setLevelTwoCategory(e.target.value)}
        >
          <option value="">Select Level 2</option>
          {levelTwoOptions.map(item => (
            <option key={item.categoryId} value={item.categoryId}>
              {item.categoryId}
            </option>
          ))}
        </select>

        {/* Level 3 */}
        {levelThreeOptions.length > 0 && (
          <select
            className="border w-full mb-2 p-2"
            value={levelThreeCategory}
            onChange={(e) => setLevelThreeCategory(e.target.value)}
          >
            <option value="">Select Level 3</option>
            {levelThreeOptions.map(item => (
              <option key={item.categoryId} value={item.categoryId}>
                {item.categoryId}
              </option>
            ))}
          </select>
        )}

        {/* Category ID */}
        <input
          className="border w-full mb-2 p-2 bg-gray-100"
          placeholder="Category ID"
          value={categoryId}
          readOnly
        />

        {/* Category Name */}
        <input
          className="border w-full mb-2 p-2"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Preview */}
        {image && (
          <img
            src={image}
            alt="preview"
            className="w-32 rounded mt-2 mb-2"
          />
        )}

       <div className="p-4 border-t flex justify-end gap-2">
        <div className="flex justify-end gap-2">
          <button className="bg-gray-300 px-3 py-1" onClick={onClose}>
            Cancel
          </button>
          <button className="bg-blue-600 text-white px-3 py-1" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
};

export default EditCategoryModalApi;


// import React, { useState, useEffect } from "react";
// import { HomeCategory } from "../../../State/types/HomeCategoryTypes";
// import { updateHomeCategory } from "./HomeCategoryApi";

// // Level 2 datasets
// import { menLevelTwo } from '../../../data/category/LevelTwo/menLevelTwo';
// import { womenLevelTwo } from '../../../data/category/LevelTwo/womenLevelTwo';
// import { furnitureLevelTwo } from '../../../data/category/LevelTwo/furnitureLevelTwo';
// import { electronicsLevelTwo } from '../../../data/category/LevelTwo/electronicsLevelTwo';

// // Level 3 datasets
// import { menLevelThree } from '../../../data/category/LevelThree/menLevelThree';
// import { womenLevelThree } from '../../../data/category/LevelThree/womenLevelThree';
// import { furnitureLevelThree } from '../../../data/category/LevelThree/furnitureLevelThree';
// import { electronicsLevelThree } from '../../../data/category/LevelThree/electronicsLevelThree';

// interface Props {
//   category?: HomeCategory;
//   onSave: (data: HomeCategory) => void;
//   onClose: () => void;
// }

// const EditCategoryModal = ({ category, onSave, onClose }: Props) => {
//   // 🔹 Full form state
//   const [formData, setFormData] = useState({
//     mainCategory: category?.mainCategory || "Men",
//     levelTwoCategory: category?.levelTwoCategory || "",
//     levelThreeCategory: category?.levelThreeCategory || "",
//     categoryId: category?.categoryId || "",
//     image: category?.image || "",
//     categoryName: category?.name || "",
//     discount: category?.discount || 0
//   });

//   const [levelTwoOptions, setLevelTwoOptions] = useState<any[]>([]);
//   const [levelThreeOptions, setLevelThreeOptions] = useState<any[]>([]);

//   // Level 2 options
//   useEffect(() => {
//     let options: any[] = [];
//     switch (formData.mainCategory) {
//       case "Men": options = menLevelTwo; break;
//       case "Women": options = womenLevelTwo; break;
//       case "Home & Furniture": options = furnitureLevelTwo; break;
//       case "Electronics": options = electronicsLevelTwo; break;
//       default: options = [];
//     }
//     setLevelTwoOptions(options);
//     setFormData(prev => ({
//       ...prev,
//       levelTwoCategory: "",
//       levelThreeCategory: "",
//       categoryId: ""
//     }));
//     setLevelThreeOptions([]);
//   }, [formData.mainCategory]);

//   // Level 3 options
//   useEffect(() => {
//     let options: any[] = [];
//     if (formData.levelTwoCategory) {
//       switch (formData.mainCategory) {
//         case "Men": options = menLevelThree.filter(item => item.parentCategoryId === formData.levelTwoCategory); break;
//         case "Women": options = womenLevelThree.filter(item => item.parentCategoryId === formData.levelTwoCategory); break;
//         case "Home & Furniture": options = furnitureLevelThree.filter(item => item.parentCategoryId === formData.levelTwoCategory); break;
//         case "Electronics": options = electronicsLevelThree.filter(item => item.parentCategoryId === formData.levelTwoCategory); break;
//       }
//     }
//     setLevelThreeOptions(options);
//     setFormData(prev => ({ ...prev, levelThreeCategory: "" }));
//   }, [formData.levelTwoCategory, formData.mainCategory]);

//   // Auto-update categoryId
//   useEffect(() => {
//     if (formData.levelThreeCategory) {
//       setFormData(prev => ({ ...prev, categoryId: formData.levelThreeCategory }));
//     } else if (formData.levelTwoCategory) {
//       setFormData(prev => ({ ...prev, categoryId: formData.levelTwoCategory }));
//     }
//   }, [formData.levelTwoCategory, formData.levelThreeCategory]);

//   // Handle all input changes
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: name === "discount" ? Number(value) : value
//     }));
//   };

//   const handleSave = async () => {
//     if (!category?.id) return alert("Category ID missing");
//     try {
//       const updatedCategory: HomeCategory = {
//         ...category,
//         ...formData
//       };
//       const res = await updateHomeCategory(category.id, updatedCategory);
//       onSave(res.data);
//       onClose();
//     } catch (err) {
//       console.error(err);
//       alert("Update failed");
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] flex flex-col">

//         {/* Header */}
//         <div className="p-5 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
//           <h2 className="text-lg font-bold">Edit Category</h2>
//           <button onClick={onClose} className="text-gray-500 hover:text-gray-700">&times;</button>
//         </div>

//         {/* Scrollable body */}
//         <div className="p-5 overflow-y-auto flex-1 space-y-4">

//           {/* Category Name */}
//           <input
//             className="border w-full p-2"
//             placeholder="Category Name"
//             name="categoryName"
//             value={formData.categoryName}
//             onChange={handleChange}
//           />

//           {/* Discount */}
//           <input
//             type="number"
//             className="border w-full p-2"
//             placeholder="Discount (%)"
//             name="discount"
//             value={formData.discount}
//             onChange={handleChange}
//             min={0}
//             max={100}
//           />

//           {/* Main Category */}
//           <select name="mainCategory" className="border w-full p-2" value={formData.mainCategory} onChange={handleChange}>
//             <option value="Men">Men</option>
//             <option value="Women">Women</option>
//             <option value="Home & Furniture">Home & Furniture</option>
//             <option value="Electronics">Electronics</option>
//           </select>

//           {/* Level 2 */}
//           <select name="levelTwoCategory" className="border w-full p-2" value={formData.levelTwoCategory} onChange={handleChange}>
//             <option value="">Select Level 2</option>
//             {levelTwoOptions.map(item => (
//               <option key={item.categoryId} value={item.categoryId}>{item.name}</option>
//             ))}
//           </select>

//           {/* Level 3 */}
//           {levelThreeOptions.length > 0 && (
//             <select name="levelThreeCategory" className="border w-full p-2" value={formData.levelThreeCategory} onChange={handleChange}>
//               <option value="">Select Level 3</option>
//               {levelThreeOptions.map(item => (
//                 <option key={item.categoryId} value={item.categoryId}>{item.name}</option>
//               ))}
//             </select>
//           )}

//           {/* Category ID */}
//           <input className="border w-full p-2 bg-gray-100" placeholder="Category ID" value={formData.categoryId} readOnly />

//           {/* Image */}
//           <input className="border w-full p-2" placeholder="Image URL" name="image" value={formData.image} onChange={handleChange} />
//           {formData.image && <img src={formData.image} alt="preview" className="w-32 rounded mt-2 mb-2" />}

//         </div>

//         {/* Footer Buttons */}
//         <div className="p-5 border-t flex justify-end gap-2 sticky bottom-0 bg-white z-10">
//           <button className="bg-gray-300 px-3 py-1 rounded" onClick={onClose}>Cancel</button>
//           <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={handleSave}>Save</button>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default EditCategoryModal;
