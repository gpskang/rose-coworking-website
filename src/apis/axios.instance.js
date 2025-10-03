import axios from "axios";
// import { getSession } from "next-auth/react";

const axiosInstance = axios.create({
  baseURL:'https://api.mystylist.in/',
});

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
axiosInstance.interceptors.request.use(
  async (config) => {
    if (typeof window !== "undefined") {
      const locale = document.cookie
        .split('; ')
        .find(row => row.startsWith('NEXT_LOCALE='))
        ?.split('=')[1] || 'en'; 
      // const session = await getSession();
      const token = null;
      // console.log("token", session);
      if (!token) {
        console.warn("Session is null");
      }
      if (config.headers) {
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        } 
        // Set the timezone header
        config.headers["Timezone"] = timeZone;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (typeof window !== "undefined") {
      // Handle 401 errors in the browser
      if (error.response && error.response.status === 401) {
        // localStorage.removeItem("yonderistToken");

        // // Redirect to the homepage on 401 Unauthorized
        // window.location.replace("/");
      }
    }

    return Promise.reject(error);
  }
);
export default axiosInstance;
