
import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import _ from "lodash";

interface Product {
  id: string | number;
  title?: string;
  categoryId?: string;
  slug?: string;
}

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [notFound, setNotFound] = useState(false);
  const navigate = useNavigate();

  // 🔹 Debounced search
  const handleSearchDebounced = _.debounce(async (q: string) => {
    const keyword = q.trim();
    if (!keyword) {
      setResults([]);
      setNotFound(false);
      return;
    }

    try {
      const res = await axios.get<Product[]>("http://localhost:5000/products/search", {
        params: { keyword },
      });

      if (res.data && res.data.length > 0) {
        setResults(res.data);
        setNotFound(false);
      } else {
        setResults([]);
        setNotFound(true);
      }
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
      setNotFound(true);
    }
  }, 300);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    handleSearchDebounced(e.target.value);
  };

  // 🔹 Safe highlight function
  const highlightMatch = (text: string | undefined, q: string) => {
    if (!text) return "";
    if (!q) return text;
    const regex = new RegExp(`(${q})`, "gi");
    return <span dangerouslySetInnerHTML={{ __html: text.replace(regex, "<b>$1</b>") }} />;
  };

  // 🔹 Generate slug or use categoryId
  const getSlug = (product: Product) => {
    if (product.categoryId) return product.categoryId;
    return product.slug || (product.title || "product").toLowerCase().replace(/\s+/g, "_");
  };

  return (
    <Box className="p-8 flex justify-center">
      <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 600 }}>
        <Typography variant="h6" align="center">
          Search Products
        </Typography>

        <TextField
          label="Search products"
          value={query}
          onChange={handleChange}
          fullWidth
          sx={{ mt: 2, mb: 2 }}
        />

        {notFound && (
          <Typography color="error" align="center" sx={{ mt: 2 }}>
            No products found
          </Typography>
        )}

        <List>
          {results.map((product) => (
            <ListItem key={product.id} disablePadding>
              <ListItemButton onClick={() => navigate(`/products/${getSlug(product)}`)}>
                {highlightMatch(product.title, query)}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default SearchPage;




