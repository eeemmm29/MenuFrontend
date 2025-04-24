import axios, { AxiosRequestConfig } from "axios";

// Helper function to get a cookie by name
function getCookie(name: string): string | null {
  if (typeof document === "undefined") {
    // Avoid errors during server-side rendering
    return null;
  }
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
}

const fetchBackend = async (
  url: string,
  method: "get" | "post" | "put" | "delete" | "patch", // Add patch
  data?: any,
  token?: string,
  contentType?: string // Make contentType optional
): Promise<any> => {
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!apiUrl) {
    throw new Error("Backend URL is not defined in the .env file");
  }

  try {
    const fullUrl = `${apiUrl}${url}`;
    // Determine Content-Type based on data type
    let finalContentType = contentType;
    if (data instanceof FormData) {
      // Let axios set the Content-Type for FormData
      finalContentType = undefined;
    } else if (!contentType) {
      // Default to application/json if not FormData and not specified
      finalContentType = "application/json";
    }

    const headers: Record<string, string> = {};
    if (finalContentType) {
      headers["Content-Type"] = finalContentType;
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Add CSRF token header for relevant methods
    if (method !== "get") {
      const csrfToken = getCookie("csrftoken");
      if (csrfToken) {
        headers["X-CSRFToken"] = csrfToken;
      } else {
        // Log a warning if the token is missing for protected methods
        console.warn(
          `CSRF token cookie 'csrftoken' not found for ${method.toUpperCase()} request to ${url}. Request might fail.`
        );
      }
    }

    const config: AxiosRequestConfig = {
      headers,
      withCredentials: true, // Important for CSRF token handling
    };

    // This handles other methods using fall-through logic in the switch statement:
    // GET requests (case "get":) fall through to the case "delete": block.
    // They are executed as await axios.get(fullUrl, config);.
    // POST (case "post":) and PUT (case "put":) requests fall through to the case "patch": block.
    // They are executed as await axios.post(fullUrl, data, config); and await axios.put(fullUrl, data, config); respectively.
    let response;
    switch (method) {
      case "get":
      case "delete":
        response = await axios[method](fullUrl, config);
        break;
      case "post":
      case "put":
      case "patch":
        response = await axios[method](fullUrl, data, config);
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }

    return response.data;
  } catch (error) {
    console.error(`Error during ${method} request to ${url}:`, error);
    // Improve error handling to provide more context
    if (axios.isAxiosError(error) && error.response) {
      console.error("Backend Error Response:", error.response.data);
      // Check specifically for CSRF errors from Django
      if (
        error.response.status === 403 &&
        error.response.data?.detail?.includes("CSRF")
      ) {
        throw new Error(
          `CSRF Verification Failed: ${error.response.data.detail}. Ensure 'csrftoken' cookie is being sent correctly by the backend and read by the frontend.`
        );
      }
      // Re-throw a more specific error or the backend error message
      throw new Error(
        error.response.data?.detail ||
          `Backend request failed with status ${error.response.status}`
      );
    }
    throw error; // Re-throw original error if not an Axios error with response
  }
};

export default fetchBackend;
