"use client";
import { Button } from "@/components/ui/button"; // Adjust the import according to your UI library
import { useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";
import { logoutUser } from "@/services/service";

const LogoutButton = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogout = async () => {
    setLoading(true);
    setErrorMessage(""); // Clear previous errors

    const { success, error } = await logoutUser(); // Call the separate function for logout logic

    if (success) {
      router.push("/login"); // Redirect to login page after successful logout
    } else {
      setErrorMessage(error); // Set the error message if logout fails
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center">
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <Button
        onClick={handleLogout}
        className={`max-w-[25%] ${
          loading ? "bg-gray-400" : "bg-red-500"
        } text-white py-2 rounded-md hover:bg-red-600 transition duration-200`}
        disabled={loading}
      >
        {loading ? "Logging out..." : "Logout"}
      </Button>
    </div>
  );
};

export default LogoutButton;
