import apiSlice from ".";

export interface Patern {
	id: number;
	path: string;
	name: string;
}

export interface Work {
	id: number;
	paternId: string;
	paternName: string;
	paternPath: string;
	timeSpent: number;
	title: string;
}

export const paternApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getPaterns: builder.query<Patern[], void>({
			query: () =>  ({
				url: `/paterns`,
				method: "GET",
			}),
			transformResponse: (response: { data: Patern[] }) => response.data,
			providesTags: ["Patern"],
		}),
		getPaternWorks: builder.query<Work[], { paternId: string }>({
			query: ({ paternId }) =>  ({
				url: `/works/${paternId}`,
				method: "GET",
			}),
			transformResponse: (response: { data: Work[] }) => response.data,
			providesTags: ["Patern"],
		}),
		getPatern: builder.query<Patern, { paternId: string }>({
			query: ({ paternId }) =>  `/patern/${paternId}`,
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

export const { useGetPaternQuery, useSetPaternMutation, useGetPaternsQuery, useSetCreatePaternMutation, useGetPaternWorksQuery } = paternApiSlice;