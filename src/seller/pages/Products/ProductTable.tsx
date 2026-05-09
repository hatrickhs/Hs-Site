
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

import { useAppDispatch, useAppSelector } from "../../../State/Store";
import {
  fetchSellerProducts,
  updateSellerProduct,
  updateProductStock,
  deleteSellerProduct,
} from "../../../State/seller/sellerProductSlice";
import { Product } from "../../../State/types/ProductType";

import { electronicsLevelTwo } from "../../../data/category/LevelTwo/electronicsLevelTwo";
import { menLevelTwo } from "../../../data/category/LevelTwo/menLevelTwo";
import { womenLevelTwo } from "../../../data/category/LevelTwo/womenLevelTwo";
import { furnitureLevelTwo } from "../../../data/category/LevelTwo/furnitureLevelTwo";
import { electronicsLevelThree } from "../../../data/category/LevelThree/electronicsLevelThree";
import { furnitureLevelThree } from "../../../data/category/LevelThree/furnitureLevelThree";
import { womenLevelThree } from "../../../data/category/LevelThree/womenLevelThree";
import { menLevelThree } from "../../../data/category/LevelThree/menLevelThree";

/* Table Cell style */
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.common.black,
  color: theme.palette.common.white,
}));

/* Main Component */
export default function ProductTable() {
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((state) => state.sellerProduct);

  // Dialog state
  const [open, setOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);

  // Product fields
  const [title, setTitle] = React.useState("");
  const [images, setImages] = React.useState("");
  const [mrpPrice, setMrpPrice] = React.useState(0);
  const [sellingPrice, setSellingPrice] = React.useState(0);
  const [color, setColor] = React.useState("");

  // Category state 
  const [mainCategory, setMainCategory] = React.useState("Men");
  const [levelTwoCategory, setLevelTwoCategory] = React.useState("");
  const [levelThreeCategory, setLevelThreeCategory] = React.useState("");
  const [levelTwoOptions, setLevelTwoOptions] = React.useState<any[]>([]);
  const [levelThreeOptions, setLevelThreeOptions] = React.useState<any[]>([]);

  // Fetch products 
  React.useEffect(() => {
    dispatch(fetchSellerProducts(localStorage.getItem("jwt")));
  }, [dispatch]);

  // Main category change → update level2 
  React.useEffect(() => {
    let options: any[] = [];
    switch (mainCategory) {
      case "Men":
        options = menLevelTwo;
        break;
      case "Women":
        options = womenLevelTwo;
        break;
      case "Home & Furniture":
        options = furnitureLevelTwo;
        break;
      case "Electronics":
        options = electronicsLevelTwo;
        break;
    }
    setLevelTwoOptions(options);
    setLevelTwoCategory("");
    setLevelThreeCategory("");
    setLevelThreeOptions([]);
  }, [mainCategory]);

  // Level 2 change → update level3 
  React.useEffect(() => {
    if (!levelTwoCategory) {
      setLevelThreeOptions([]);
      setLevelThreeCategory("");
      return;
    }

    let options: any[] = [];
    switch (mainCategory) {
      case "Men":
        options = menLevelThree.filter((item) => item.parentCategoryId === levelTwoCategory);
        break;
      case "Women":
        options = womenLevelThree.filter((item) => item.parentCategoryId === levelTwoCategory);
        break;
      case "Home & Furniture":
        options = furnitureLevelThree.filter((item) => item.parentCategoryId === levelTwoCategory);
        break;
      case "Electronics":
        options = electronicsLevelThree.filter((item) => item.parentCategoryId === levelTwoCategory);
        break;
    }

    setLevelThreeOptions(options);
    setLevelThreeCategory("");
  }, [levelTwoCategory, mainCategory]);

  // Open edit dialog 
  const openEditDialog = (product: Product) => {
    setSelectedProduct(product);

    // Category pre-fill
    setMainCategory(product.category?.parentCategory?.name || "Men");
    setLevelTwoCategory(product.category?.parentCategory?.name || "");
    setLevelThreeCategory(product.category?.name || "");

    setTitle(product.title);
    setImages(product.images.join(","));
    setMrpPrice(product.mrpPrice);
    setSellingPrice(product.sellingPrice);
    setColor(product.color);

    setOpen(true);
  };

  // Update product
  const handleUpdate = () => {
    if (!selectedProduct?.id) return;

    dispatch(
      updateSellerProduct({
        productId: selectedProduct.id,
        jwt: localStorage.getItem("jwt"),
        request: {
          title,
          images: images.split(",").map((i) => i.trim()),
          mrpPrice,
          sellingPrice,
          color,
          quantity: selectedProduct.quantity,
          mainCategory,
          levelTwoCategory,
          levelThreeCategory,
        },
      })
    );

    setOpen(false);
  };

  // Toggle stock 
  const toggleStock = (product: Product) => {
    dispatch(
      updateProductStock({
        productId: product.id!,
        inStock: !product.inStock,
        jwt: localStorage.getItem("jwt"),
      })
    );
  };

  // Delete product
  const handleDelete = (productId: number) => {
    const ok = window.confirm("Are you sure you want to delete this product?");
    if (!ok) return;

    dispatch(
      deleteSellerProduct({
        productId,
        jwt: localStorage.getItem("jwt"),
      })
    );
  };

  //  UI 
  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Images</StyledTableCell>
              <StyledTableCell>Title</StyledTableCell>
              <StyledTableCell>MRP</StyledTableCell>
              <StyledTableCell>Selling Price</StyledTableCell>
              <StyledTableCell>Color</StyledTableCell>
              <StyledTableCell>Stock</StyledTableCell>
              <StyledTableCell>Edit</StyledTableCell>
              <StyledTableCell>Delete</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {products.map((item) => (
              <TableRow key={item.id}>
                {/* Images */}
                <TableCell>
                  <div style={{ display: "flex", gap: 8 }}>
                    {item.images.map((img, i) => (
                      <img key={i} src={img} width={60} style={{ borderRadius: 6 }} />
                    ))}
                  </div>
                </TableCell>

                <TableCell>{item.title}</TableCell>
                <TableCell>₹{item.mrpPrice}</TableCell>
                <TableCell>₹{item.sellingPrice}</TableCell>
                <TableCell>{item.color}</TableCell>

                {/* Stock */}
                <TableCell>
                  <Chip
                    label={item.inStock ? "IN STOCK" : "OUT OF STOCK"}
                    color={item.inStock ? "success" : "error"}
                    clickable
                    onClick={() => toggleStock(item)}
                  />
                </TableCell>

                {/* Edit */}
                <TableCell>
                  <IconButton onClick={() => openEditDialog(item)}>
                    <Edit />
                  </IconButton>
                </TableCell>

                {/* Delete */}
                <TableCell>
                  <IconButton color="error" onClick={() => handleDelete(item.id!)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Update Product</DialogTitle>
        <DialogContent>
          {/* Title */}
          <TextField
            fullWidth
            margin="dense"
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Images */}
          <TextField
            fullWidth
            margin="dense"
            label="Images (comma separated)"
            value={images}
            onChange={(e) => setImages(e.target.value)}
          />

          {/* MRP & Selling Price */}
          <TextField
            fullWidth
            margin="dense"
            type="number"
            label="MRP Price"
            value={mrpPrice}
            onChange={(e) => setMrpPrice(+e.target.value)}
          />
          <TextField
            fullWidth
            margin="dense"
            type="number"
            label="Selling Price"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(+e.target.value)}
          />

          {/* Color */}
          <TextField
            fullWidth
            margin="dense"
            label="Color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />

          {/* Category dropdowns */}
          <TextField
            select
            fullWidth
            margin="dense"
            label="Main Category"
            value={mainCategory}
            onChange={(e) => setMainCategory(e.target.value)}
            SelectProps={{ native: true }}
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Home & Furniture">Home & Furniture</option>
            <option value="Electronics">Electronics</option>
          </TextField>

          <TextField
            select
            fullWidth
            margin="dense"
            value={levelTwoCategory}
            onChange={(e) => setLevelTwoCategory(e.target.value)}
            SelectProps={{ native: true }}
          >
            <option value="">Select Level 2</option>
            {levelTwoOptions.map((opt) => (
              <option key={opt.categoryId} value={opt.categoryId}>
                {opt.name}
              </option>
            ))}
          </TextField>

          {levelThreeOptions.length > 0 && (
            <TextField
              select
              fullWidth
              margin="dense"
              value={levelThreeCategory}
              onChange={(e) => setLevelThreeCategory(e.target.value)}
              SelectProps={{ native: true }}
            >
              <option value="">Select Level 3</option>
              {levelThreeOptions.map((opt) => (
                <option key={opt.categoryId} value={opt.categoryId}>
                  {opt.name}
                </option>
              ))}
            </TextField>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdate}>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
