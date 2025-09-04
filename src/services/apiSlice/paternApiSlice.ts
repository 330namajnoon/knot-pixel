import apiSlice from ".";

export const paternApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getPatern: builder.query<Blob, { imageName: string }>({
			query: ({ imageName }) =>  `/patern/${imageName}`,
			providesTags: ["Patern"],
		}),
		setPatern: builder.mutation<{error: string | undefined, success: boolean}, { imageName: string; imageData: FormData }>({
			query: ({ imageName, imageData }) => ({
				url: `/patern/${imageName}`,
				method: "POST",
				body: imageData,
			}),
			invalidatesTags: ["Patern"],
		})
	}),
	overrideExisting: false,
});

export const { useGetPaternQuery, useSetPaternMutation } = paternApiSlice;