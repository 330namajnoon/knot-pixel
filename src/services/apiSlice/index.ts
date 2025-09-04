
import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { BASE_URL } from "../../constants";
import { createApi } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
	baseUrl: BASE_URL,
	prepareHeaders: (headers) => {
        headers.set("Content-Type", "application/json");
        return headers;
    },
});

const apiSlice = createApi({
    reducerPath: "api",
    tagTypes: ["Patern"],
    endpoints: () => ({}),
    baseQuery,
});

export default apiSlice;
