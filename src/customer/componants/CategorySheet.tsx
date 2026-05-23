import React from 'react'
import { menLevelTwo } from '../../data/category/LevelTwo/menLevelTwo'
import { womenLevelTwo } from '../../data/category/LevelTwo/womenLevelTwo'
import { electronicsLevelTwo } from '../../data/category/LevelTwo/electronicsLevelTwo'
import { furnitureLevelTwo } from '../../data/category/LevelTwo/furnitureLevelTwo'
import { menLevelThree } from '../../data/category/LevelThree/menLevelThree'
import { womenLevelThree } from '../../data/category/LevelThree/womenLevelThree'
import { electronicsLevelThree } from '../../data/category/LevelThree/electronicsLevelThree'
import { furnitureLevelThree } from '../../data/category/LevelThree/furnitureLevelThree'
import { Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const CategoryTwo:{[key:string]:any[]}={
  men:menLevelTwo,
  women:womenLevelTwo,
  electronics:electronicsLevelTwo,
  home_furniture:furnitureLevelTwo,
}

const CategoryThree:{[key:string]:any[]}={
  men:menLevelThree,
  women:womenLevelThree,
  electronics:electronicsLevelThree,
  home_furniture:furnitureLevelThree,
}

const CategorySheet = ({selectedCategory,setShowSheet}:any) => {
  const navigate=useNavigate();

  const childCategory=(Category:any,parentCategoryId:any)=>{
    return Category.filter((child:any)=>child.parentCategoryId==parentCategoryId)
  }

  return (
    <Box sx={{zIndex: 2}} className="bg-white shadow-lg lg:h-[500px] overflow-y-auto">
      <div className='flex text-sm flex-wrap'>
        {
          CategoryTwo[selectedCategory]?.map((item:any,index:number) => (
            <div
              key={item.categoryId}
              className={`p-8 lg:w-[20%] ${index%2===0? "bg-slate-50":"bg-white"}`}
            >
              <p className='text-primary-color mb-5 font-semibold'>{item.name}</p>

              <ul className='space-y-3'>
                {childCategory(CategoryThree[selectedCategory], item.categoryId).map((child:any)=>(
                  <li 
                    key={child.categoryId}
                    onClick={() => navigate("/products/" + child.categoryId)}
                    className='hover:text-primary-color cursor-pointer'
                  >
                    {child.name}
                  </li>
                ))}
              </ul>
            </div>
          ))
        }
      </div>
    </Box>
  )
}

export default CategorySheet
