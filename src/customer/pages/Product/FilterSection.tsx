
import React, { useState } from 'react';
import {
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { teal } from '@mui/material/colors';
import { useSearchParams } from 'react-router-dom';
import { color } from '../../../data/Filter/color';
import { price } from '../../../data/Filter/price';
import { discount } from '../../../data/Filter/discount';

const FilterSection = () => {
  const [expendColor, setExpendColor] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // Toggle show more/less for colors
  const handleColorToggle = () => {
    setExpendColor(!expendColor);
  };

const updateFilterParams = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { value, name } = e.target;

  const newParams = new URLSearchParams(searchParams.toString()); // ✅ clone
  if (value) {
    newParams.set(name, value);
  } else {
    newParams.delete(name);
  }

  setSearchParams(newParams); //  use new object
};


  // Clear all filters
  const clearAllFilters = () => {
    searchParams.forEach((_, key) => {
      searchParams.delete(key);
    });
    setSearchParams(searchParams);
  };

  return (
    <div className="-z-50 space-y-5 bg-white">

      {/* Header */}
      <div className="flex items-center justify-between h-[40px] px-9 lg:border-r">
        <p className="text-lg font-semibold">Filters</p>
        <Button
          onClick={clearAllFilters}
          size="small"
          className="text-teal-600 cursor-pointer font-semibold"
        >
          Clear All
        </Button>
      </div>

      <Divider />

      {/* Filters */}
      <div className="px-9 space-y-6">
        
        {/* Color Filter */}
        <section>
          <FormControl>
            <FormLabel
              id="color"
              sx={{ fontSize: '16px', fontWeight: 'bold', color: teal[500], pb: '14px' }}
            >
              Color
            </FormLabel>
            <RadioGroup
              aria-labelledby="color"
              defaultValue=""
              name="color"
              onChange={updateFilterParams}
            >
              {color.slice(0, expendColor ? color.length : 5).map((item, index) => (
                <FormControlLabel
                  key={index}
                  value={item.name}
                  control={<Radio />}
                  label={
                    <div className="flex items-center gap-3">
                      <p>{item.name}</p>
                      <div
                        style={{ backgroundColor: item.hex }}
                        className={`h-5 w-5 rounded-full ${item.name === 'White' ? 'border' : ''}`}
                      ></div>
                    </div>
                  }
                />
              ))}
            </RadioGroup>
          </FormControl>
          {color.length > 5 && (
            <button
              onClick={handleColorToggle}
              className="text-primary-color cursor-pointer hover:text-teal-900 flex items-center"
            >
              {expendColor ? 'Hide' : `+${color.length - 5} more`}
            </button>
          )}
        </section>

        {/* Price Filter */}
        <section>
          <FormControl>
            <FormLabel
              id="price"
              sx={{ fontSize: '16px', fontWeight: 'bold', color: teal[600], pb: '14px' }}
            >
              Price
            </FormLabel>
            <RadioGroup
              aria-labelledby="price"
              defaultValue=""
              name="price"
              onChange={updateFilterParams}
            >
              {price.map((item) => (
                <FormControlLabel
                  key={item.name}
                  value={item.value}
                  control={<Radio size="small" />}
                  label={item.name}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </section>

        <Divider />

        {/* Discount Filter */}
        <section>
          <FormControl>
            <FormLabel
              id="mindiscount"
              sx={{ fontSize: '16px', fontWeight: 'bold', color: teal[600], pb: '14px' }}
            >
              Discount
            </FormLabel>
            <RadioGroup
              aria-labelledby="mindiscount"
              defaultValue=""
              name="mindiscount"
              onChange={updateFilterParams}
            >
              {discount.map((item) => (
                <FormControlLabel
                  key={item.name}
                  value={item.value}
                  control={<Radio size="small" />}
                  label={item.name}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </section>
      </div>
    </div>
  );
};

export default FilterSection;
