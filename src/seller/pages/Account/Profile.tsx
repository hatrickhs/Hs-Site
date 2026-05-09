
import React, { useEffect, useState } from "react";
import { api } from "../../../config/Api";

// Seller Profile type 
interface SellerProfileType {
  sellerName: string;
  email: string;
  mobile?: string;
  GSTIN?: string;
  pickupAddress?: {
    addressLine1?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  businessDetails?: {
    shopName?: string;
  };
  role?: string;
  isEmailVerified?: boolean;
  accountStatus?: string;
  createdAt?: string;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<SellerProfileType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get("/sellers/profile"); 
        setProfile(res.data);
        setLoading(false);
      } catch (err: any) {
        console.error("Profile fetch error:", err);
        setError(err.response?.data?.message || "Profile fetch failed");
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-500 text-lg font-medium">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-red-500 text-lg font-medium">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="flex justify-center py-10 px-5 lg:px-20">
      {profile ? (
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full lg:w-2/3">
          <h2 className="text-3xl font-bold text-gray-700 mb-6 border-b pb-2">
            Seller Profile
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="profile-field">
              <p className="text-gray-500 font-medium">Name</p>
              <p className="text-gray-800 font-semibold">{profile.sellerName}</p>
            </div>

            {/* Email */}
            <div className="profile-field">
              <p className="text-gray-500 font-medium">Email</p>
              <p className="text-gray-800 font-semibold">{profile.email}</p>
            </div>

            {/* Mobile */}
            {profile.mobile && (
              <div className="profile-field">
                <p className="text-gray-500 font-medium">Mobile</p>
                <p className="text-gray-800 font-semibold">{profile.mobile}</p>
              </div>
            )}

            {/* Shop Name */}
            {profile.businessDetails?.shopName && (
              <div className="profile-field">
                <p className="text-gray-500 font-medium">Shop Name</p>
                <p className="text-gray-800 font-semibold">{profile.businessDetails.shopName}</p>
              </div>
            )}

            {/* GSTIN */}
            {profile.GSTIN && (
              <div className="profile-field">
                <p className="text-gray-500 font-medium">GSTIN</p>
                <p className="text-gray-800 font-semibold">{profile.GSTIN}</p>
              </div>
            )}

            {/* Pickup Address */}
            {profile.pickupAddress && (
              <div className="profile-field col-span-1 md:col-span-2">
                <p className="text-gray-500 font-medium">Pickup Address</p>
                <p className="text-gray-800 font-semibold">
                  {[
                    profile.pickupAddress.addressLine1,
                    profile.pickupAddress.city,
                    profile.pickupAddress.state,
                    profile.pickupAddress.zip,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            )}

            {/* Role */}
            {profile.role && (
              <div className="profile-field">
                <p className="text-gray-500 font-medium">Role</p>
                <p className="text-gray-800 font-semibold">{profile.role}</p>
              </div>
            )}

            {/* Email Verified */}
            <div className="profile-field">
              <p className="text-gray-500 font-medium">Email Verified</p>
              <p className="text-gray-800 font-semibold">
                {profile.isEmailVerified ? "Yes" : "No"}
              </p>
            </div>

            {/* Account Status */}
            {profile.accountStatus && (
              <div className="profile-field">
                <p className="text-gray-500 font-medium">Account Status</p>
                <p className="text-gray-800 font-semibold">{profile.accountStatus}</p>
              </div>
            )}

            {/* Joined */}
            {profile.createdAt && (
              <div className="profile-field">
                <p className="text-gray-500 font-medium">Joined</p>
                <p className="text-gray-800 font-semibold">
                  {new Date(profile.createdAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">No profile data available.</p>
      )}
    </div>
  );
};

export default Profile;

