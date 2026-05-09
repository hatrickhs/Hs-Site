
import React, { useEffect, useState } from "react";
import FilterSection from "./FilterSection";
import ProductCard from "./ProductCard";
import {
  Box,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { FilterAlt } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import { fetchProductsByCategory } from "../../../State/customer/ProductSlice";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { fetchDealsByCategory } from "../../../State/admin/DealSlice";
import DealTimer from "../../../admin/Pages/HomePage/DealTimer";

const Product = () => {
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up("lg"));
  const dispatch = useAppDispatch();

  const { category } = useParams();
  const [searchParams] = useSearchParams();

  const productState = useAppSelector((state) => state.product);
  const dealState = useAppSelector((state) => state.deal);

  const navigate = useNavigate();

  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const [openFilter, setOpenFilter] = useState(false);

  const section = searchParams.get("section");
  const loading = productState.loading || dealState.loading;

  // fetch data
  useEffect(() => {
    if (!category) return;

    const [minPrice, maxPrice] =
      searchParams.get("price")?.split("-") || [];

    const mindiscount = searchParams.get("mindiscount")
      ? Number(searchParams.get("mindiscount"))
      : undefined;

    if (section?.trim().toUpperCase() === "DEALS") {
      dispatch(
        fetchDealsByCategory({
          categoryId: Number(category),
          section: "DEALS",
          color: searchParams.get("color") || undefined,
          minPrice: minPrice ? Number(minPrice) : undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
          mindiscount,
          page: page - 1,
          sort,
        })
      );
    } else {
      dispatch(
        fetchProductsByCategory({
          category,
          section: "PRODUCT",
          color: searchParams.get("color") || undefined,
          minPrice: minPrice ? Number(minPrice) : undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
          mindiscount,
          page: page - 1,
          sort,
        })
      );
    }
  }, [category, searchParams, page, sort, section, dispatch]);

  const handleSortChange = (event: any) => {
    setSort(event.target.value);
  };

  const handlePageChange = (value: number) => {
    setPage(value);
  };

  // ACTIVE DEALS (expiry filter)
  const activeDeals = (dealState.filteredDeals || []).filter((deal: any) => {
    if (!deal.expiryTime) return true;
    return new Date(deal.expiryTime).getTime() > Date.now();
  });

  return (
    <div className="-z-10 mt-10">

      {/* TITLE */}
      <h1 className="text-3xl text-center font-bold text-gray-700 pb-5 px-9 uppercase">
        {section === "DEALS" ? "Deals" : category || "All Products"}
      </h1>

      <div className="lg:flex">

        {/* FILTER */}
        <section className="hidden lg:block w-[20%]">
          <FilterSection />
        </section>

        {/* MAIN */}
        <div className="w-full lg:w-[80%] space-y-5">

          {/* TOP BAR */}
          <div className="flex justify-between items-center px-9 h-[40px]">

            <div>
              {!isLarge && (
                <>
                  <IconButton onClick={() => setOpenFilter(!openFilter)}>
                    <FilterAlt />
                  </IconButton>

                  {openFilter && (
                    <Box>
                      <FilterSection />
                    </Box>
                  )}
                </>
              )}
            </div>

            {/* SORT */}
            <FormControl size="small" sx={{ width: "200px" }}>
              <InputLabel>Sort</InputLabel>
              <Select value={sort} onChange={handleSortChange}>
                <MenuItem value={"price_low"}>Price: Low - High</MenuItem>
                <MenuItem value={"price_high"}>Price: High - Low</MenuItem>
              </Select>
            </FormControl>

          </div>

          <Divider />

          {/* GRID */}
          <section className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 px-5">

            {loading ? (
              <p className="col-span-full text-center text-gray-500">
                Loading...
              </p>

            ) : section === "DEALS" ? (

              activeDeals.length === 0 ? (
                <p className="col-span-full text-center text-red-500 text-xl">
                  No Deals Found
                </p>
              ) : (

                activeDeals.map((deal: any) => {

                  //convert deal → product format
                  const dealItem = {
                    ...deal,
                    images: deal.images?.length
                      ? deal.images
                      : deal.image
                      ? [deal.image]
                      : [],
                  };

                  return (
                    <div
                      key={deal.id}
                      onClick={() =>
                        navigate(
                          `/Deal-details/${deal.category.categoryId}/${deal.name}/${deal.id}`
                        )
                      }
                    >
                      {/* REUSE PRODUCT CARD */}
                      <ProductCard item={dealItem} />
                    </div>
                  );
                })
              )

            ) : productState.products.length === 0 ? (
              <p className="col-span-full text-center text-red-500 text-2xl font-bold">
                No Products Found
              </p>

            ) : (
              productState.products.map((item: any) => (
                <ProductCard key={item.id} item={item} />
              ))
            )}

          </section>

          {/* PAGINATION */}
          {section !== "DEALS" && productState.products.length > 0 && (
            <div className="flex justify-center py-10">
              <Pagination
                count={productState.totalPages || 1}
                onChange={(e, value) => handlePageChange(value)}
                color="primary"
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Product;