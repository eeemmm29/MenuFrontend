import axios from "axios";

const fetchBackend = async (
  url: string,
  method: "get" | "post" | "put" | "delete",
  data?: any,
  token?: string,
  contentType: string = "application/json"
): Promise<any> => {
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!apiUrl) {
    throw new Error("Backend URL is not defined in the .env file");
  }

  try {
    const fullUrl = `${apiUrl}${url}`;
    const headers: HeadersInit = {
      "Content-Type": contentType,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

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
