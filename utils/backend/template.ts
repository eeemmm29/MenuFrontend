import axios from "axios";

const fetchBackend = async (
  url: string,
  method: "get" | "post" | "put" | "delete",
  data?: any,
  allowUnAuth: boolean = false,
  contentType: string = "application/json"
): Promise<any> => {
  // Get CSRF token from cookie if it exists
  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
  };

  const csrfToken = getCookie("csrftoken");

  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!apiUrl) {
    throw new Error("Backend URL is not defined in the .env file");
  }

  try {
    const fullUrl = `${apiUrl}${url}`;
    const headers: Record<string, string> = {
      "X-CSRFToken": csrfToken || "",
      "Content-Type": contentType,
    };

    if (method === "get") {
      const response = await axios[method](fullUrl, { headers });
      return response.data;
    }
    if (method === "delete") {
      const response = await axios[method](fullUrl, { headers });
      return response.data;
    }

    const response = await axios[method](fullUrl, data, {
      headers,
      withCredentials: true, // Important for CSRF token handling
    });
    return response.data;
  } catch (error) {
    console.error("Error sending data:", error);
    throw error;
  }
};

export default fetchBackend;
