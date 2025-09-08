import apiSlice from ".";

const userApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		setLogin: builder.mutation<{error: string | undefined, token: string}, { userName: string; password: string }>({
			query: ({ userName, password }) => ({
				url: `/login?userName=${userName}&password=${password}`,
				method: "POST",
			}),
			invalidatesTags: ["User"],
		})
	}),
})

export const { useSetLoginMutation } = userApiSlice;