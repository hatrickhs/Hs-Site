
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
  console.log(categoriesFromStore);
}, [categoriesFromStore]);

  useEffect(() => {

  const dealCategories = categoriesFromStore.filter(
    (item) => item.section?.trim() === "DEALS"
  );

  console.log("DEAL CATEGORIES =>", dealCategories);

  setCategories(dealCategories);

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

  useEffect(() => {
  console.log("ALL CATEGORIES =>", categoriesFromStore);

  console.log(
    "SECTION LIST =>",
    categoriesFromStore.map((c) => c.section)
  );

}, [categoriesFromStore]);


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
