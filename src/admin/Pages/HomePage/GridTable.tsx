// // import React from 'react'
// // import HomeCategoryTable from './HomeCategoryTable'
// // import { useAppSelector } from '../../../State/Store';

// // const GridTable = () => {
// //     const customer=useAppSelector(state=>state.customer);
//   // console.log("Grid Data:", customer.homePageData?.grid);
//   // console.log("Full State:", customer.homePageData);


// //   return (
// //     <div>
// //       <HomeCategoryTable data={customer.homePageData?.grid || []}/>
// //     </div>
    
// //   )
// // }

// // export default GridTable


// //  import React, { useEffect, useState } from "react";
// // import HomeCategoryTable from "./HomeCategoryTable";
// // import { useAppSelector } from "../../../State/Store";
// // import { HomeCategory } from "../../../State/types/HomeCategoryTypes";
// // import EditCategoryModal from "../../Pages/HomePage/EditCategoryModal";
// // import AddCategoryModal from "./AddCategoryModal";

// // const GridTable = () => {
// //   const customer = useAppSelector((state) => state.customer);

// //   // 🔥 Local state for table
// //   const [categories, setCategories] = useState<HomeCategory[]>([]);
// //   const [editCategory, setEditCategory] = useState<HomeCategory | null>(null);
// //   const [addModalOpen, setAddModalOpen] = useState(false);

// //   // 🔄 Redux → Local state
// //   useEffect(() => {
// //     if (customer.homePageData?.grid) {
// //       setCategories(customer.homePageData.grid);
// //     }
// //   }, [customer.homePageData]);

// //   // ✏️ Edit button click
// //   const handleEditCategory = (category: HomeCategory) => {
// //     setEditCategory(category);
// //   };

// //   // 💾 Save edited data
// //   const handleSaveCategory = (updatedCategory: HomeCategory) => {
// //     setCategories((prev) =>
// //       prev.map((cat) =>
// //         cat.id === updatedCategory.id ? updatedCategory : cat
// //       )
// //     );
// //     setEditCategory(null); // close modal
// //   };

// //   // ➕ Add new category
// //   const handleAddCategory = (newCategory: HomeCategory) => {
// //     setCategories((prev) => [...prev, newCategory]);
// //     setAddModalOpen(false); // close modal
// //   };

// //   // 🗑 Delete category
// //   const handleDeleteCategory = (id?: number) => {
// //     setCategories((prev) => prev.filter((cat) => cat.id !== id));
// //   };

// //   return (
// //     <div>
// //       {/* ➕ Add Button */}
// //       <button
// //         className="bg-blue-600 text-white px-4 py-2 mb-4 rounded"
// //         onClick={() => setAddModalOpen(true)}
// //       >
// //         + Add Home Category
// //       </button>

// //       {/* 📊 Table */}
// //       <HomeCategoryTable
// //         data={categories}
// //         onEdit={handleEditCategory}
// //         onDelete={handleDeleteCategory}
// //       />

// //       {/* ✏️ Edit Modal */}
// //       {editCategory && (
// //         <EditCategoryModal
// //           category={editCategory}
// //           onClose={() => setEditCategory(null)}
// //           onSave={handleSaveCategory}
// //         />
// //       )}

// //       {/* ➕ Add Modal */}
// //       {addModalOpen && (
// //         <AddCategoryModal
// //           onClose={() => setAddModalOpen(false)}
// //           onSave={handleAddCategory}
// //         />
// //       )}
// //     </div>
// //   );
// // };

// // export default GridTable;


// import React, { useEffect, useState } from "react";
// import { useAppSelector } from "../../../State/Store";
// import { HomeCategory } from "../../../State/types/HomeCategoryTypes";
// import HomeCategoryTable from "./HomeCategoryTable";
// import AddCategoryModal from "./AddCategoryModal";
// import EditCategoryModalApi from "./EditCategoryModalApi";
// import { deleteHomeCategory } from "./HomeCategoryApi";

// const GridTable = () => {
//   const customer = useAppSelector((state) => state.customer);
//   const [categories, setCategories] = useState<HomeCategory[]>([]);
//   const [editCategory, setEditCategory] = useState<HomeCategory | null>(null);
//   const [addModalOpen, setAddModalOpen] = useState(false);

//   useEffect(() => {
//     if (customer.homePageData?.grid) setCategories(customer.homePageData.grid);
//   }, [customer.homePageData]);

//   const handleAddCategory = (newCat: HomeCategory) => {
//     setCategories((prev) => [...prev, newCat]);
//   };

//   const handleEditCategory = (cat: HomeCategory) => setEditCategory(cat);

//   const handleDeleteCategory = async (id?: number) => {
//     if (!id) return;
//     try {
//       await deleteHomeCategory(id);
//       setCategories((prev) => prev.filter((c) => c.id !== id));
//     } catch (err) {
//       console.error("Delete failed", err);
//       alert("Delete failed");
//     }
//   };

//   return (
//     <>
//       <button
//         className="bg-blue-600 text-white px-4 py-2 mb-4 rounded"
//         onClick={() => setAddModalOpen(true)}
//       >
//         + Add Home Category
//       </button>

//       <HomeCategoryTable
//         data={categories}
//         onEdit={handleEditCategory}
//         onDelete={handleDeleteCategory}
//       />

//       {editCategory && (
//         <EditCategoryModalApi
//           category={editCategory}
//           onSave={(updated) =>
//             setCategories((prev) =>
//               prev.map((c) => (c.id === updated.id ? updated : c))
//             )
//           }
//           onClose={() => setEditCategory(null)}
//         />
//       )}

//       {addModalOpen && (
//         <AddCategoryModal
//           onClose={() => setAddModalOpen(false)}
//           onSave={handleAddCategory}
//         />
//       )}
//     </>
//   );
// };

// export default GridTable;


import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../../State/Store";
import { HomeCategory } from "../../../State/types/HomeCategoryTypes";
import HomeCategoryTable from "./HomeCategoryTable";
// import AddCategoryModal from "./AddCategoryModal";
import EditCategoryModalApi from "./EditCategoryModalApi";
import { deleteHomeCategory } from "./HomeCategoryApi";

const GridTable = () => {
  const categoriesFromStore = useAppSelector(
    (state) => state.customer.categories
  );

  const [categories, setCategories] = useState<HomeCategory[]>([]);
  const [editCategory, setEditCategory] = useState<HomeCategory | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // 🔄 Redux → Local (GRID section only)
  useEffect(() => {
    if (categoriesFromStore?.length) {
      const gridCategories = categoriesFromStore.filter(
        (item) => item.section === "GRID"
      );
      setCategories(gridCategories);
    }
  }, [categoriesFromStore]);

  // ➕ Add
  const handleAddCategory = (newCat: HomeCategory) => {
    setCategories((prev) => [...prev, newCat]);
  };

  // ✏️ Edit
  const handleEditCategory = (cat: HomeCategory) => {
    setEditCategory(cat);
  };

  // 🗑 Delete
  const handleDeleteCategory = async (id?: number) => {
    if (!id) return;

    try {
      await deleteHomeCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Delete failed");
    }
  };

  return (
    <>
      {/* <button
        className="bg-blue-600 text-white px-4 py-2 mb-4 rounded"
        onClick={() => setAddModalOpen(true)}
      >
        + Add Home Category
      </button> */}

      <HomeCategoryTable
        data={categories}
        onEdit={handleEditCategory}
        onDelete={handleDeleteCategory}
      />

      {editCategory && (
        <EditCategoryModalApi
          category={editCategory}
          onSave={(updated) =>
            setCategories((prev) =>
              prev.map((c) => (c.id === updated.id ? updated : c))
            )
          }
          onClose={() => setEditCategory(null)}
        />
      )}

      {/* {addModalOpen && (
        <AddCategoryModal
          onClose={() => setAddModalOpen(false)}
          onSave={handleAddCategory}
        />
      )} */}
    </>
  );
};

export default GridTable;
