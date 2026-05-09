// // import React from 'react'
// // import HomeCategoryTable from './HomeCategoryTable'
// // import { useAppSelector } from '../../../State/Store';

// // const ElectronicTable = () => {
// //   const customer=useAppSelector(state=> state.customer );

  

// //   return (
// //     <div>
// //       <HomeCategoryTable data={customer.homePageData?.electricCategories || []} />
      
// //     </div>
// //   )
// // }

// // export default ElectronicTable


// import React, { useEffect, useState } from "react";
// import { useAppSelector } from "../../../State/Store";
// import { HomeCategory } from "../../../State/types/HomeCategoryTypes";
// import HomeCategoryTable from "./HomeCategoryTable";
// import AddCategoryModal from "./AddCategoryModal";
// import EditCategoryModalApi from "./EditCategoryModalApi";
// import { deleteHomeCategory } from "./HomeCategoryApi";


// const ElectronicTable = () => {
//   const customer = useAppSelector((state) => state.customer);
//   const [categories, setCategories] = useState<HomeCategory[]>([]);
//   const [editCategory, setEditCategory] = useState<HomeCategory | null>(null);
//   const [addModalOpen, setAddModalOpen] = useState(false);

//   useEffect(() => {
//     if (customer.homePageData?.electricCategories) setCategories(customer.homePageData.electricCategories);
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

// export default ElectronicTable;


import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../../State/Store";
import { HomeCategory } from "../../../State/types/HomeCategoryTypes";
import HomeCategoryTable from "./HomeCategoryTable";
// import AddCategoryModal from "./AddCategoryModal";
import EditCategoryModalApi from "./EditCategoryModalApi";
import { deleteHomeCategory } from "./HomeCategoryApi";

const ElectronicTable = () => {
  const categoriesFromStore = useAppSelector(
    (state) => state.customer.categories
  );

  const [categories, setCategories] = useState<HomeCategory[]>([]);
  const [editCategory, setEditCategory] = useState<HomeCategory | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // 🔄 Redux → Local (ELECTRIC_CATEGORIES only)
  useEffect(() => {
    if (categoriesFromStore?.length) {
      const electricCategories = categoriesFromStore.filter(
        (item) => item.section === "ELECTRIC_CATEGORIES"
      );
      setCategories(electricCategories);
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
        /> */}
      {/* )} */}
    </>
  );
};

export default ElectronicTable;
