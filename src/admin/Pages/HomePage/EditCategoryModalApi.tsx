
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      
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

