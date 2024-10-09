"use client";
import LogoutButton from "@/components/LogoutButton";
import { fetchUser } from "@/services/service";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await fetchUser(); // Use the service function
      if (error) {
        setErrorMessage(error);
        return;
      }
      setUsername(data.username);
      setUserId(data.id);
    };

    getUser();
  }, []);

  return (
    <div>
      {errorMessage ? (
        <p style={{ color: "red" }}>{errorMessage}</p>
      ) : (
        <h1>
          Welcome, {username} (User ID: {userId})
          <p className="max-w-[50%] ">
            <LogoutButton />
          </p>
        </h1>
      )}
    </div>
  );
}
