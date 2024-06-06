// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { getNewToken } from "@/app/utils/auth/token";

// const useHandleTokenRefresh = () => {
//   const [retryToggle, setRetryToggle] = useState(false);
//   const router = useRouter();

//   const handleTokenRefresh = async () => {
//     try {
//       const refreshToken = localStorage.getItem("refreshToken");
//       await getNewToken(refreshToken);
//       setRetryToggle((prev) => !prev);
//       return true;
//     } catch (tokenError) {
//       router.push("/login");
//       return false;
//     }
//   };
//   return { retryToggle, handleTokenRefresh };
// };

// export default useHandleTokenRefresh;
