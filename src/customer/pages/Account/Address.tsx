
import React, { useEffect, useState } from "react";
import axios from "axios";
import AddressCard from "../../pages/CheckOut/AddressCard";

interface AddressType {
  id: number;
  name: string;
  address: string;
  locality?: string;
  city: string;
  state?: string;
  pinCode: string;
  mobile: string;
}

interface AddressProps {
  onSelect?: (addr: AddressType) => void;
}

const Address = (props: AddressProps) => {
  const [addresses, setAddresses] = useState<AddressType[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<AddressType | null>(null);

  // GET ADDRESSES
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const token = localStorage.getItem("jwt"); // ✅ FIXED

        if (!token) {
          console.error("No JWT token found! Please login first.");
          return;
        }

        const res = await axios.get("http://localhost:5000/api/addresses/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAddresses(res.data);
      } catch (err: any) {
        console.error("Error fetching addresses:", err.response?.data || err.message);
      }
    };

    fetchAddresses();
  }, []);

  // SELECT ADDRESS
  const handleSelect = (addr: AddressType) => {
    setSelectedAddress(addr);
    props.onSelect?.(addr);
  };

  // DELETE ADDRESS
  const handleRemove = async (id: number) => {
    try {
      const token = localStorage.getItem("jwt");

      if (!token) {
        console.warn("Token missing");
        return;
      }

      await axios.delete(`http://localhost:5000/api/addresses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAddresses((prev) => prev.filter((a) => a.id !== id));

      if (selectedAddress?.id === id) {
        setSelectedAddress(null);
      }
    } catch (err: any) {
      console.error("Error deleting address:", err.response?.data || err.message);
    }
  };

  return (
    <div className="space-y-3">
      {addresses.length === 0 && <p>No addresses found</p>}

      {addresses.map((addr) => (
        <AddressCard
          key={addr.id}
          address={addr}
          selected={selectedAddress?.id === addr.id}
          onSelect={handleSelect}
          onRemove={handleRemove}
          showDelete={true}
        />
      ))}
    </div>
  );
};

export default Address;
