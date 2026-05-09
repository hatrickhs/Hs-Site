
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../State/Store";
import { HomeCategory } from "../../../State/types/HomeCategoryTypes";
import HomeCategoryTable from "./HomeCategoryTable";
import EditCategoryModalApi from "./EditCategoryModalApi";
import { deleteHomeCategory } from "./HomeCategoryApi";
import { useFormik } from "formik";

const DealCategoryTable = () => {
 
  const navigate = useNavigate();
  const categoriesFromStore = useAppSelector(
    (state) => state.customer.categories
  );

  const [categories, setCategories] = useState<HomeCategory[]>([]);
  const [editCategory, setEditCategory] = useState<HomeCategory | null>(null);

  useEffect(() => {
    if (categoriesFromStore?.length) {
      const dealCategories = categoriesFromStore.filter(
        (item) => item.section === "DEALS"
      );
      setCategories(dealCategories);
    }
  }, [categoriesFromStore]);

  const handleEditCategory = (cat: HomeCategory) => setEditCategory(cat);

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
    </>
  );
};

export default DealCategoryTable;

// import React from 'react'
// import HomeCategoryTable from './HomeCategoryTable'
// import { initial, values } from 'lodash'
// import { discount } from '../../../data/Filter/discount'
// import { Category } from '@mui/icons-material'

// const DealCategoryTable = () => {
 

//   return (
//     <div>
//       <HomeCategoryTable/>
//     </div>
//   )
// }

// export default DealCategoryTable