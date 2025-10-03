import { fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { BASE_URL, path } from "../../constants";
import { createApi } from "@reduxjs/toolkit/query/react";
import getTokenFromCookie from "../../utils/getTokenFromCookies";

const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
        const token = getTokenFromCookie() || localStorage.getItem("token");
        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions
) => {
    const result = await baseQuery(args, api, extraOptions);

    if (result.error && (result.error.status === 401 || result.error.status === 403)) {
        // aquí token inválido o expirado
        window.open(path.LOGIN, "_self"); // o usa react-router navigate
    }

    return result;
};

const apiSlice = createApi({
    reducerPath: "api",
    tagTypes: ["Patern", "User"],
    endpoints: () => ({}),
    baseQuery: baseQueryWithReauth,
});

export default apiSlice;
