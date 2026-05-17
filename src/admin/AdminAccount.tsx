
import React from "react";
import { useSelector } from "react-redux";
import { AccountCircle, Email, Phone, Home, CheckCircle } from "@mui/icons-material";
import { RootState } from "../State/Store";

const AdminAccount = () => {
  const admin = useSelector((state: RootState) => state.auth.user);

  if (!admin) return <div className="p-6">Admin not found, please login</div>;

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-5 flex items-center gap-2">
        <AccountCircle /> Admin Account
      </h2>

      {/* Name */}
      <div className="flex items-center gap-3 mb-4">
        <AccountCircle className="text-primary-color" />
        <div>
          <p className="text-sm text-gray-500">Name</p>
          <p className="font-semibold">{admin.fullName || "N/A"}</p>
        </div>
      </div>

      {/* Email */}
      <div className="flex items-center gap-3 mb-4">
        <Email className="text-primary-color" />
        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-semibold">{admin.email}</p>
        </div>
      </div>

      {/* Phone */}
      <div className="flex items-center gap-3 mb-4">
        <Phone className="text-primary-color" />
        <div>
          <p className="text-sm text-gray-500">Phone</p>
          <p className="font-semibold">{admin.mobile || "N/A"}</p>
        </div>
      </div>

      {/* Role */}
      <div className="flex items-center gap-3 mb-4">
        <Home className="text-primary-color" />
        <div>
          <p className="text-sm text-gray-500">Role</p>
          <p className="font-semibold">{admin.role}</p>
        </div>
      </div>

      {/* Login Status */}
      <div className="flex items-center gap-3 mt-6 p-3 bg-green-50 rounded">
        <CheckCircle className="text-green-600" />
        <p className="font-semibold text-green-700">Logged In</p>
      </div>
    </div>
  );
};

export default AdminAccount;
