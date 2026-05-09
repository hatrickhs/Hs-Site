import axios from "axios";

const api = "http://localhost:5000/products";

export const fetchProduct = async () => {
  try {
    const response = await axios.get(api);
    console.log("response", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};
