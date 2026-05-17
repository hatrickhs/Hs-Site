
import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../../State/Store";
import { HomeCategory } from "../../../State/types/HomeCategoryTypes";
import HomeCategoryTable from "./HomeCategoryTable";
import EditCategoryModalApi from "./EditCategoryModalApi";
import { deleteHomeCategory } from "./HomeCategoryApi";

const ShopByCategoryTable = () => {
  const categoriesFromStore = useAppSelector(
    (state) => state.customer.categories
  );

  const [categories, setCategories] = useState<HomeCategory[]>([]);
  const [editCategory, setEditCategory] = useState<HomeCategory | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Redux → Local (SHOP_BY_CATEGORIES only)
  useEffect(() => {
    if (categoriesFromStore?.length) {
      const shopByCategories = categoriesFromStore.filter(
        (item) => item.section === "SHOP_BY_CATEGORIES"
      );
      setCategories(shopByCategories);
    }
  }, [categoriesFromStore]);

  // Add
  const handleAddCategory = (newCat: HomeCategory) => {
    setCategories((prev) => [...prev, newCat]);
  };

  // Edit
  const handleEditCategory = (cat: HomeCategory) => {
    setEditCategory(cat);
  };

  // Delete
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

export default ShopByCategoryTable;
