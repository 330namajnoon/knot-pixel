import apiSlice from ".";

export const paternApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getPaterns: builder.query<string[], void>({
			query: () =>  ({
				url: `/paterns`,
				method: "GET",
			}),
			providesTags: ["Patern"],
		}),
		getPatern: builder.query<Blob, { imageName: string }>({
			query: ({ imageName }) =>  `/patern/${imageName}`,
			providesTags: ["Patern"],
		}),
		setPatern: builder.mutation<{error: string | undefined, success: boolean}, {paternId: string, imageData: FormData }>({
			query: ({paternId, imageData }) => ({
				url: `/patern/${paternId}`,
				method: "PATCH",
				body: imageData,
			}),
			invalidatesTags: ["Patern"],
		}),
		// no recibe ningun parametro
		setCreatePatern: builder.mutation<{error: string | undefined, success: boolean, insertId: number}, void>({
			query: () => ({
				url: `/paterns`,
				method: "POST",
			}),
			invalidatesTags: ["Patern"],
		}),
	}),
	overrideExisting: false,
});

export const { useGetPaternQuery, useSetPaternMutation, useGetPaternsQuery, useSetCreatePaternMutation } = paternApiSlice;