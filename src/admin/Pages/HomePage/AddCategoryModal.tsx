
// // import React, { useState, useEffect } from "react";
// // import { HomeCategory } from "../../../State/types/HomeCategoryTypes";
// // import { createHomeCategory } from "./HomeCategoryApi";

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
// //   onClose: () => void;
// //   onSave: (data: HomeCategory) => void;
// // }

// // const AddCategoryModal = ({ onClose, onSave }: Props) => {
// //   const [formData, setFormData] = useState({
// //     mainCategory: "Men",
// //     levelTwoCategory: "",
// //     levelThreeCategory: "",
// //     image: "",
// //     categoryId: "",
// //     section: "GRID"
// //   });

// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState("");

// //   const [levelTwoOptions, setLevelTwoOptions] = useState<any[]>([]);
// //   const [levelThreeOptions, setLevelThreeOptions] = useState<any[]>([]);

// //   // Level 2 options update
// //   useEffect(() => {
// //     let options: any[] = [];
// //     switch (formData.mainCategory) {
// //       case "Men": options = menLevelTwo; break;
// //       case "Women": options = womenLevelTwo; break;
// //       case "Home & Furniture": options = furnitureLevelTwo; break;
// //       case "Electronics": options = electronicsLevelTwo; break;
// //       default: options = [];
// //     }
// //     setLevelTwoOptions(options);
// //     setFormData(prev => ({
// //       ...prev,
// //       levelTwoCategory: "",
// //       levelThreeCategory: "",
// //       categoryId: ""
// //     }));
// //     setLevelThreeOptions([]);
// //   }, [formData.mainCategory]);

// //   // Level 3 options update
// //   useEffect(() => {
// //     let options: any[] = [];
// //     if (formData.levelTwoCategory) {
// //       switch (formData.mainCategory) {
// //         case "Men": options = menLevelThree.filter(item => item.parentCategoryId === formData.levelTwoCategory); break;
// //         case "Women": options = womenLevelThree.filter(item => item.parentCategoryId === formData.levelTwoCategory); break;
// //         case "Home & Furniture": options = furnitureLevelThree.filter(item => item.parentCategoryId === formData.levelTwoCategory); break;
// //         case "Electronics": options = electronicsLevelThree.filter(item => item.parentCategoryId === formData.levelTwoCategory); break;
// //       }
// //     }
// //     setLevelThreeOptions(options);
// //     setFormData(prev => ({ ...prev, levelThreeCategory: "" }));
// //   }, [formData.levelTwoCategory, formData.mainCategory]);

// //   // Auto-update categoryId based on selected option
// //   useEffect(() => {
// //     if (formData.levelThreeCategory) {
// //       setFormData(prev => ({ ...prev, categoryId: formData.levelThreeCategory }));
// //     } else if (formData.levelTwoCategory) {
// //       setFormData(prev => ({ ...prev, categoryId: formData.levelTwoCategory }));
// //     }
// //   }, [formData.levelTwoCategory, formData.levelThreeCategory]);

// //   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
// //     const { name, value } = e.target;
// //     setFormData(prev => ({ ...prev, [name]: value }));
// //   };

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     if (!formData.image.trim()) { setError("Image URL required"); return; }
// //     if (!formData.categoryId.trim()) { setError("Category ID required"); return; }

// //     setLoading(true);
// //     setError("");

// //     try {
// //       const category: HomeCategory = {
// //         mainCategory: formData.mainCategory,
// //         levelTwoCategory: formData.levelTwoCategory,
// //         levelThreeCategory: formData.levelThreeCategory,
// //         image: formData.image.trim(),
// //         categoryId: formData.categoryId.trim(),
// //         section: formData.section,
// //         // dealCategories: [],
// //         shopByCategories: [],
// //         deal: [],
// //         electricCategories: [],
// //         grid: [],
// //         categoryName: "",
// //         discount: 0
// //       };

// //       const response = await createHomeCategory(category);
// //       const savedCategory: HomeCategory = { ...category, id: response.data.id };
// //       onSave(savedCategory);
// //       onClose();
// //     } catch (err: any) {
// //       console.error(err);
// //       let errorMsg = err.response?.data || err.message || "Failed to save category";
// //       setError(errorMsg);
// //       alert(`Save failed: ${errorMsg}\nCheck Spring Boot & MySQL connection.`);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
// //       <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
// //         <div className="p-6">
// //           <h2 className="text-2xl font-bold mb-2">Add New Category</h2>

// //           {error && (
// //             <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
// //               <p className="text-red-700">{error}</p>
// //             </div>
// //           )}

// //           <form onSubmit={handleSubmit} className="space-y-4">
// //             {/* Main Category */}
// //             <div>
// //               <label className="block text-sm font-medium mb-1">Main Category</label>
// //               <select
// //                 name="mainCategory"
// //                 value={formData.mainCategory}
// //                 onChange={handleChange}
// //                 className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
// //                 disabled={loading}
// //               >
// //                 <option value="Men">Men</option>
// //                 <option value="Women">Women</option>
// //                 <option value="Home & Furniture">Home & Furniture</option>
// //                 <option value="Electronics">Electronics</option>
// //               </select>
// //             </div>

// //             {/* Level 2 Category */}
// //             <div>
// //               <label className="block text-sm font-medium mb-1">Level 2 Category</label>
// //               <select
// //                 name="levelTwoCategory"
// //                 value={formData.levelTwoCategory}
// //                 onChange={handleChange}
// //                 className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
// //                 disabled={loading || !levelTwoOptions.length}
// //               >
// //                 <option value="">Select Level 2</option>
// //                 {levelTwoOptions.map(item => (
// //                   <option key={item.categoryId} value={item.categoryId}>
// //                     {item.name}
// //                   </option>
// //                 ))}
// //               </select>
// //             </div>

// //             {/* Level 3 Category */}
// //             {levelThreeOptions.length > 0 && (
// //               <div>
// //                 <label className="block text-sm font-medium mb-1">Level 3 Category</label>
// //                 <select
// //                   name="levelThreeCategory"
// //                   value={formData.levelThreeCategory}
// //                   onChange={handleChange}
// //                   className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
// //                   disabled={loading}
// //                 >
// //                   <option value="">Select Level 3</option>
// //                   {levelThreeOptions.map(item => (
// //                     <option key={item.categoryId} value={item.categoryId}>
// //                       {item.name}
// //                     </option>
// //                   ))}
// //                 </select>
// //               </div>
// //             )}

// //             {/* Image URL */}
// //             <div>
// //               <label className="block text-sm font-medium mb-1">Image URL *</label>
// //               <input
// //                 type="url"
// //                 name="image"
// //                 placeholder="https://example.com/image.jpg"
// //                 value={formData.image}
// //                 onChange={handleChange}
// //                 className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
// //                 required
// //                 disabled={loading}
// //               />
// //             </div>

// //             {/* Category ID */}
// //             <div>
// //               <label className="block text-sm font-medium mb-1">Category ID *</label>
// //               <input
// //                 name="categoryId"
// //                 placeholder="Category ID"
// //                 value={formData.categoryId}
// //                 className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-100"
// //                 readOnly
// //               />
// //             </div>

// //             {/* Section */}
// //             <div>
// //               <label className="block text-sm font-medium mb-1">Section</label>
// //               <select
// //                 name="section"
// //                 value={formData.section}
// //                 onChange={handleChange}
// //                 className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
// //                 disabled={loading}
// //               >
// //                 <option value="GRID">GRID</option>
// //                 <option value="DEALS">DEALS</option>
// //                 <option value="SHOP_BY_CATEGORIES">SHOP BY CATEGORIES</option>
// //                 <option value="ELECTRIC_CATEGORIES">ELECTRIC CATEGORIES</option>
// //               </select>
// //             </div>

// //             {/* Buttons */}
// //             <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
// //               <button
// //                 type="button"
// //                 onClick={onClose}
// //                 disabled={loading}
// //                 className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 type="submit"
// //                 disabled={loading}
// //                 className={`px-5 py-2.5 rounded-lg text-white font-medium ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
// //               >
// //                 {loading ? "Saving..." : "Save"}
// //               </button>
// //             </div>
// //           </form>

// //           <div className="mt-6 p-3 bg-blue-50 rounded-lg">
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default AddCategoryModal;


// import React, { useState, useEffect } from "react";
// import { HomeCategory } from "../../../State/types/HomeCategoryTypes";
// import { createHomeCategory } from "./HomeCategoryApi";

// // Level 2 datasets
// import { menLevelTwo } from "../../../data/category/LevelTwo/menLevelTwo";
// import { womenLevelTwo } from "../../../data/category/LevelTwo/womenLevelTwo";
// import { furnitureLevelTwo } from "../../../data/category/LevelTwo/furnitureLevelTwo";
// import { electronicsLevelTwo } from "../../../data/category/LevelTwo/electronicsLevelTwo";

// // Level 3 datasets
// import { menLevelThree } from "../../../data/category/LevelThree/menLevelThree";
// import { womenLevelThree } from "../../../data/category/LevelThree/womenLevelThree";
// import { furnitureLevelThree } from "../../../data/category/LevelThree/furnitureLevelThree";
// import { electronicsLevelThree } from "../../../data/category/LevelThree/electronicsLevelThree";

// interface Props {
//   onClose: () => void;
//   onSave: (data: HomeCategory) => void;
// }

// const AddCategoryModal = ({ onClose, onSave }: Props) => {
//   const [formData, setFormData] = useState({
//     mainCategory: "Men",
//     levelTwoCategory: "",
//     levelThreeCategory: "",
//     image: "",
//     categoryId: "",
//     section: "GRID",
//     name: "",
//     discount: 0,
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

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

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: name === "discount" ? Number(value) : value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!formData.image.trim()) { setError("Image URL required"); return; }
//     if (!formData.categoryId.trim()) { setError("Category ID required"); return; }
//     if (!formData.name.trim()) { setError("Category Name required"); return; }

//     setLoading(true);
//     setError("");

//     try {
//       const category: HomeCategory = {
//         mainCategory: formData.mainCategory,
//         levelTwoCategory: formData.levelTwoCategory,
//         levelThreeCategory: formData.levelThreeCategory,
//         image: formData.image.trim(),
//         categoryId: formData.categoryId.trim(),
//         section: formData.section,
//         deals: [],
//         shopByCategories: [],
//         electricCategories: [],
//         grid: [],
//         name: formData.name.trim(),
//         discount: formData.discount,
//       };

//       console.log("Saving payload:", category);

//       const response = await createHomeCategory(category);
//       const savedCategory: HomeCategory = { ...category, id: response.data.id };
//       onSave(savedCategory);
//       onClose();
//     } catch (err: any) {
//       console.error(err);
//       let errorMsg = err.response?.data || err.message || "Failed to save category";
//       setError(errorMsg);
//       alert(`Save failed: ${errorMsg}\nCheck Spring Boot & MySQL connection.`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl w-full max-w-md shadow-2xl max-h-[90vh] flex flex-col">
        
//         {/* Header */}
//         <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
//           <h2 className="text-2xl font-bold">Add New Category</h2>
//           <button onClick={onClose} className="text-gray-500 hover:text-gray-700">&times;</button>
//         </div>

//         {/* Scrollable Body */}
//         <div className="p-6 overflow-y-auto flex-1 space-y-4">
//           {error && <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700">{error}</div>}

//           <form onSubmit={handleSubmit} className="space-y-4">

//             {/* Category Name */}
//             <div>
//               <label className="block text-sm font-medium mb-1">Category Name *</label>
//               <input type="text" name="name" placeholder="Category Name" value={formData.name} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" required disabled={loading}/>
//             </div>

//             {/* Discount */}
//             <div>
//               <label className="block text-sm font-medium mb-1">Discount (%)</label>
//               <input type="number" name="discount" value={formData.discount} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" min={0} max={100} disabled={loading}/>
//             </div>

//             {/* Main Category */}
//             <div>
//               <label className="block text-sm font-medium mb-1">Main Category</label>
//               <select name="mainCategory" value={formData.mainCategory} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" disabled={loading}>
//                 <option value="Men">Men</option>
//                 <option value="Women">Women</option>
//                 <option value="Home & Furniture">Home & Furniture</option>
//                 <option value="Electronics">Electronics</option>
//               </select>
//             </div>

//             {/* Level 2 */}
//             <div>
//               <label className="block text-sm font-medium mb-1">Level 2 Category</label>
//               <select name="levelTwoCategory" value={formData.levelTwoCategory} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" disabled={loading || !levelTwoOptions.length}>
//                 <option value="">Select Level 2</option>
//                 {levelTwoOptions.map(item => <option key={item.categoryId} value={item.categoryId}>{item.name}</option>)}
//               </select>
//             </div>

//             {/* Level 3 */}
//             {levelThreeOptions.length > 0 && (
//               <div>
//                 <label className="block text-sm font-medium mb-1">Level 3 Category</label>
//                 <select name="levelThreeCategory" value={formData.levelThreeCategory} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" disabled={loading}>
//                   <option value="">Select Level 3</option>
//                   {levelThreeOptions.map(item => <option key={item.categoryId} value={item.categoryId}>{item.name}</option>)}
//                 </select>
//               </div>
//             )}

//             {/* Image URL */}
//             <div>
//               <label className="block text-sm font-medium mb-1">Image URL *</label>
//               <input type="url" name="image" placeholder="https://example.com/image.jpg" value={formData.image} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" required disabled={loading}/>
//             </div>

//             {/* Category ID */}
//             <div>
//               <label className="block text-sm font-medium mb-1">Category ID *</label>
//               <input name="categoryId" placeholder="Category ID" value={formData.categoryId} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-100" readOnly/>
//             </div>

//             {/* Section */}
//             <div>
//               <label className="block text-sm font-medium mb-1">Section</label>
//               <select name="section" value={formData.section} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" disabled={loading}>
//                 <option value="GRID">GRID</option>
//                 <option value="DEALS">DEALS</option>
//                 <option value="SHOP_BY_CATEGORIES">SHOP BY CATEGORIES</option>
//                 <option value="ELECTRIC_CATEGORIES">ELECTRIC CATEGORIES</option>
//               </select>
//             </div>

//             {/* Submit Buttons */}
//             <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
//               <button type="button" onClick={onClose} disabled={loading} className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
//               <button type="submit" disabled={loading} className={`px-5 py-2.5 rounded-lg text-white font-medium ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}>{loading ? "Saving..." : "Save"}</button>
//             </div>

//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddCategoryModal;


import React, { useState, useEffect } from "react";
import { HomeCategory } from "../../../State/types/HomeCategoryTypes";
import { createHomeCategory } from "./HomeCategoryApi";

// Level 2 datasets
import { menLevelTwo } from "../../../data/category/LevelTwo/menLevelTwo";
import { womenLevelTwo } from "../../../data/category/LevelTwo/womenLevelTwo";
import { furnitureLevelTwo } from "../../../data/category/LevelTwo/furnitureLevelTwo";
import { electronicsLevelTwo } from "../../../data/category/LevelTwo/electronicsLevelTwo";

// Level 3 datasets
import { menLevelThree } from "../../../data/category/LevelThree/menLevelThree";
import { womenLevelThree } from "../../../data/category/LevelThree/womenLevelThree";
import { furnitureLevelThree } from "../../../data/category/LevelThree/furnitureLevelThree";
import { electronicsLevelThree } from "../../../data/category/LevelThree/electronicsLevelThree";

import { XCircleIcon } from "@heroicons/react/24/solid";
import { uploadToCloudinary } from "../../../Util/uploadToCloudinary";


const AddCategoryPage = () => {
  const [formData, setFormData] = useState({
    mainCategory: "Men",
    levelTwoCategory: "",
    levelThreeCategory: "",
    image: "",
    imageFile: null as File | null,
    categoryId: "",
    section: "GRID",
    name: "",
    discount: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [levelTwoOptions, setLevelTwoOptions] = useState<any[]>([]);
  const [levelThreeOptions, setLevelThreeOptions] = useState<any[]>([]);

  // Level 2 options update
  useEffect(() => {
    let options: any[] = [];
    switch (formData.mainCategory) {
      case "Men": options = menLevelTwo; break;
      case "Women": options = womenLevelTwo; break;
      case "Home & Furniture": options = furnitureLevelTwo; break;
      case "Electronics": options = electronicsLevelTwo; break;
      default: options = [];
    }
    setLevelTwoOptions(options);
    setFormData(prev => ({
      ...prev,
      levelTwoCategory: "",
      levelThreeCategory: "",
      categoryId: "",
    }));
    setLevelThreeOptions([]);
  }, [formData.mainCategory]);

  // Level 3 options update
  useEffect(() => {
    let options: any[] = [];
    if (formData.levelTwoCategory) {
      switch (formData.mainCategory) {
        case "Men":
          options = menLevelThree.filter(item => item.parentCategoryId === formData.levelTwoCategory); break;
        case "Women":
          options = womenLevelThree.filter(item => item.parentCategoryId === formData.levelTwoCategory); break;
        case "Home & Furniture":
          options = furnitureLevelThree.filter(item => item.parentCategoryId === formData.levelTwoCategory); break;
        case "Electronics":
          options = electronicsLevelThree.filter(item => item.parentCategoryId === formData.levelTwoCategory); break;
      }
    }
    setLevelThreeOptions(options);
    setFormData(prev => ({ ...prev, levelThreeCategory: "" }));
  }, [formData.levelTwoCategory, formData.mainCategory]);

  // Auto-update categoryId
  useEffect(() => {
    if (formData.levelThreeCategory) {
      setFormData(prev => ({ ...prev, categoryId: formData.levelThreeCategory }));
    } else if (formData.levelTwoCategory) {
      setFormData(prev => ({ ...prev, categoryId: formData.levelTwoCategory }));
    }
  }, [formData.levelTwoCategory, formData.levelThreeCategory]);

  // Handle changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === "discount" ? Number(value) : value }));
  };

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      imageFile: file,
      image: file ? URL.createObjectURL(file) : "",
    }));
  };

  const removeImage = () => setFormData(prev => ({ ...prev, imageFile: null, image: "" }));

  // Submit handler
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!formData.name.trim()) { setError("Category Name required"); return; }
  //   if (!formData.categoryId.trim()) { setError("Category ID required"); return; }
  //   if (!formData.image && !formData.imageFile) { setError("Image required"); return; }

  //   setLoading(true);
  //   setError("");

  //   try {
  //     const category: HomeCategory = {
  //       mainCategory: formData.mainCategory,
  //       levelTwoCategory: formData.levelTwoCategory,
  //       levelThreeCategory: formData.levelThreeCategory,
  //       image: formData.image,
  //       categoryId: formData.categoryId,
  //       section: formData.section,
  //       deals: formData.section === "DEALS" ? [formData] : [],
  //       shopByCategories: formData.section === "SHOP_BY_CATEGORIES" ? [formData] : [],
  //       electricCategories: formData.section === "ELECTRIC_CATEGORIES" ? [formData] : [],
  //       grid: formData.section === "GRID" ? [formData] : [],
  //       name: formData.name,
  //       discount: formData.discount,
  //     };

  //     await createHomeCategory(category);
  //     alert("Category saved successfully!");

  //     setFormData({
  //       mainCategory: "Men",
  //       levelTwoCategory: "",
  //       levelThreeCategory: "",
  //       image: "",
  //       imageFile: null,
  //       categoryId: "",
  //       section: "GRID",
  //       name: "",
  //       discount: 0,
  //     });
  //   } catch (err: any) {
  //     console.error(err);
  //     setError(err.message || "Failed to save category");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.name.trim()) { setError("Category Name required"); return; }
  if (!formData.categoryId.trim()) { setError("Category ID required"); return; }
  if (!formData.imageFile) { setError("Image required"); return; }

  setLoading(true);
  setError("");

  try {
    // 🔥 1. Upload image to Cloudinary
    const imageUrl = await uploadToCloudinary(formData.imageFile);

    // 🔥 2. Prepare payload
    const category: HomeCategory = {
      mainCategory: formData.mainCategory,
      levelTwoCategory: formData.levelTwoCategory,
      levelThreeCategory: formData.levelThreeCategory,
      image: imageUrl, // ✅ CLOUDINARY URL
      categoryId: formData.categoryId,
      section: formData.section,
      name: formData.name,
      discount: formData.discount,
      shopByCategories: [],
      deals: [],
      electricCategories: [],
      grid: []
    };

    console.log("FINAL PAYLOAD 👉", category);

    // 🔥 3. Save to backend
    await createHomeCategory(category);

    alert("Category saved successfully!");

    // reset
    setFormData({
      mainCategory: "Men",
      levelTwoCategory: "",
      levelThreeCategory: "",
      image: "",
      imageFile: null,
      categoryId: "",
      section: "GRID",
      name: "",
      discount: 0,
    });

  } catch (err: any) {
    console.error(err);
    setError("Failed to save category");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-5xl flex overflow-hidden">

        {/* Left Form */}
        <form onSubmit={handleSubmit} className="flex-1 p-6 space-y-4 flex flex-col">
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700">{error}</div>}

          <label className="block text-sm font-medium">Category Name *</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2"/>

          <label className="block text-sm font-medium">Discount (%)</label>
          <input type="number" name="discount" value={formData.discount} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2"/>

          <label className="block text-sm font-medium">Main Category</label>
          <select name="mainCategory" value={formData.mainCategory} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2">
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Home & Furniture">Home & Furniture</option>
            <option value="Electronics">Electronics</option>
          </select>

          <label className="block text-sm font-medium">Level 2 Category</label>
          <select name="levelTwoCategory" value={formData.levelTwoCategory} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2">
            <option value="">Select Level 2</option>
            {levelTwoOptions.map(item => <option key={item.categoryId} value={item.categoryId}>{item.name}</option>)}
          </select>

          {levelThreeOptions.length > 0 && (
            <>
              <label className="block text-sm font-medium">Level 3 Category</label>
              <select name="levelThreeCategory" value={formData.levelThreeCategory} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2">
                <option value="">Select Level 3</option>
                {levelThreeOptions.map(item => <option key={item.categoryId} value={item.categoryId}>{item.name}</option>)}
              </select>
            </>
          )}

          <label className="block text-sm font-medium">Category ID *</label>
          <input name="categoryId" value={formData.categoryId} readOnly className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100"/>

          <label className="block text-sm font-medium">Section</label>
          <select name="section" value={formData.section} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2">
            <option value="GRID">GRID</option>
            <option value="DEALS">DEALS</option>
            <option value="SHOP_BY_CATEGORIES">SHOP BY CATEGORIES</option>
            <option value="ELECTRIC_CATEGORIES">ELECTRIC CATEGORIES</option>
          </select>

          <button type="submit" className="px-5 py-2.5 rounded-lg bg-green-600 text-white hover:bg-green-700">{loading ? "Saving..." : "Save Category"}</button>
        </form>

        {/* Right Image Upload */}
        <div className="w-96 p-6 flex flex-col items-center border-l border-gray-200">
          <div className="w-full h-64 border border-gray-300 rounded-lg flex items-center justify-center relative cursor-pointer">
            {formData.image ? (
              <>
                <img src={formData.image} alt="Preview" className="w-full h-full object-contain rounded-lg"/>
                <XCircleIcon className="w-6 h-6 text-red-500 absolute top-2 right-2 cursor-pointer" onClick={removeImage}/>
              </>
            ) : (
              <label className="text-gray-500 cursor-pointer">
                Click to select image
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden"/>
              </label>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryPage;
