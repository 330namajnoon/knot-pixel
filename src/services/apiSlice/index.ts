import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { BASE_URL } from "../../constants";
import { createApi } from "@reduxjs/toolkit/query/react";
import getTokenFromCookie from "../../utils/getTokenFromCookies";

const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
        const token = getTokenFromCookie() || localStorage.getItem("token");
        console.log("Token from cookie:", token);
        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

const apiSlice = createApi({
    reducerPath: "api",
    tagTypes: ["Patern", "User"],
    endpoints: () => ({}),
    baseQuery,
});

export default apiSlice;
