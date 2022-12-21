import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '../utils/api'

// Define a service using a base URL and expected endpoints
export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: `${BASE_URL}/api/` }),
    tagTypes: ['User',
        'ExecutiveSummary',
        'ProppertyDescription',
        'LocationOverview',
        'FinancialSummary',
        'ExitScenarios'],
    endpoints: (builder) => ({
        signUpUser: builder.mutation({
            query: (userData) =>
                ({ url: `user/signup`, method: 'POST', body: userData }),
            // Pick out data and prevent nested properties in a hook or selector
            transformResponse: (response) => response.data,
            // `result` is the server response
            invalidatesTags: (result, error, id) =>
                [{ type: 'User', id: result.data._id }],
            // trigger side effects or optimistic updates
            onQueryStarted(id, { dispatch, getState, extra, requestId, queryFulfilled, getCacheEntry }) { },
            // handle subscriptions etc
            onCacheEntryAdded(id, { dispatch, getState, extra, requestId, cacheEntryRemoved, cacheDataLoaded, getCacheEntry }) { },
        }),
        loginUser: builder.mutation({
            query: (userData) =>
                ({ url: `user/login?role=user`, method: 'POST', body: userData }),
            transformResponse: (response) => response.data,
            // `result` is the server response
            invalidatesTags: (result, error, id) =>
                [{ type: 'User', id: result.data.user._id }],
        }),
        addLocation: builder.mutation({
            query: ({ coords, token }) =>
            ({
                url: `user/addLocation`, method: 'POST',
                body: coords, headers: { 'authorization': token }
            }),
            transformResponse: (response) => response.data,
            // `result` is the server response
            invalidatesTags: (result, error, id) =>
                [{ type: 'User', id: result.userId }]
        }),
        getUser: builder.query({
            query: (token) =>
            ({
                url: `user/getUser`, method: 'GET',
                headers: { 'authorization': token }
            }),
            transformResponse: (response) => response.data,
            // `result` is the server response
            providesTags: (result, error) =>
                result
                    ? // successful query
                    [
                        { type: 'User', id: result._id },
                        { type: 'User', id: 'LIST' },
                    ]
                    : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
                    [{ type: 'User', id: 'LIST' }],
        }),
        getInvestmentSummary: builder.query({
            // note: an optional `queryFn` may be used in place of `query`
            query: (token) =>
            ({
                url: `executiveSummary/investment?type=summary`,
                method: 'GET', headers: { 'authorization': token }
            }),
            // Pick out data and prevent nested properties in a hook or selector
            transformResponse: (response, meta, arg) => response.data,
            providesTags: (result, error) =>
                result
                    ? // successful query
                    [
                        { type: 'ExecutiveSummary', id: result._id },
                        { type: 'ExecutiveSummary', id: 'LIST' },
                    ]
                    : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
                    [{ type: 'ExecutiveSummary', id: 'LIST' }],
            // The 2nd parameter is the destructured `QueryLifecycleApi`
            async onQueryStarted(
                arg,
                {
                    dispatch,
                    getState,
                    extra,
                    requestId,
                    queryFulfilled,
                    getCacheEntry,
                    updateCachedData,
                }
            ) {
                // const globalState = getState()
                // console.log('queryStart', getCacheEntry());
                try {
                    console.log('fetching data');
                    const { data } = await queryFulfilled
                    // `onSuccess` side-effect
                    // dispatch(messageCreated('Posts received!'))
                    console.log('success data');
                } catch (err) {
                    // `onError` side-effect
                    console.log('error data');
                    // dispatch(messageCreated('Error fetching posts!'))
                }
            },
            // The 2nd parameter is the destructured `QueryCacheLifecycleApi`
            async onCacheEntryAdded(
                arg,
                {
                    dispatch,
                    getState,
                    extra,
                    requestId,
                    cacheEntryRemoved,
                    cacheDataLoaded,
                    getCacheEntry,
                    updateCachedData,
                }
            ) { },
        }),
        getInvestmentOpportunity: builder.query({
            // note: an optional `queryFn` may be used in place of `query`
            query: (token) =>
            ({
                url: `executiveSummary/investment?type=opportunity`,
                method: 'GET', headers: { 'authorization': token }
            }),
            // Pick out data and prevent nested properties in a hook or selector
            transformResponse: (response, meta, arg) => response.data,
            providesTags: (result, error) =>
                result
                    ? // successful query
                    [
                        { type: 'ExecutiveSummary', id: result._id },
                        { type: 'ExecutiveSummary', id: 'LIST' },
                    ]
                    : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
                    [{ type: 'ExecutiveSummary', id: 'LIST' }],
        }),
        getDemographicSummary: builder.query({
            // note: an optional `queryFn` may be used in place of `query`
            query: (token) =>
            ({
                url: `executiveSummary/demographic`,
                method: 'GET', headers: { 'authorization': token }
            }),
            // Pick out data and prevent nested properties in a hook or selector
            transformResponse: (response, meta, arg) => response.data,
            providesTags: (result, error) =>
                result
                    ? // successful query
                    [
                        { type: 'ExecutiveSummary', id: result._id },
                        { type: 'ExecutiveSummary', id: 'LIST' },
                    ]
                    : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
                    [{ type: 'ExecutiveSummary', id: 'LIST' }],
        }),
        updateInvestmentSummary: builder.mutation({
            query: ({ formData, token }) =>
            ({
                url: `executiveSummary/investment?type=summary`,
                method: 'PUT', body: formData,
                headers: { 'authorization': token }
            }),
            transformResponse: (response) => response.data,
            // `result` is the server response
            invalidatesTags: (result, error) =>
                [{ type: 'ExecutiveSummary', id: result._id }],
        }),
        updateInvestmentOpportunity: builder.mutation({
            query: ({ formData, token }) =>
            ({
                url: `executiveSummary/investment?type=opportunity`,
                method: 'PUT', body: formData,
                headers: { 'authorization': token }
            }),
            transformResponse: (response) => response.data,
            // `result` is the server response
            invalidatesTags: (result, error) =>
                [{ type: 'ExecutiveSummary', id: result._id }],
        }),
        updateDemographicSummary: builder.mutation({
            query: ({ formData, token }) =>
            ({
                url: `executiveSummary/demographic`,
                method: 'PUT', body: formData,
                headers: { 'authorization': token }
            }),
            transformResponse: (response) => response.data,
            // `result` is the server response
            invalidatesTags: (result, error) =>
                [{ type: 'ExecutiveSummary', id: result._id }],
        }),
        addInvestmentSummary: builder.mutation({
            query: ({ formData, token }) =>
            ({
                url: `executiveSummary/investment?type=summary`,
                method: 'POST', body: formData,
                headers: { 'authorization': token }
            }),
            transformResponse: (response) => response.data,
            // `result` is the server response
            // invalidatesTags: (result, error) =>
            //     [{ type: 'ExecutiveSummary', id: result._id }],
        }),
        addInvestmentOpportunity: builder.mutation({
            query: ({ formData, token }) =>
            ({
                url: `executiveSummary/investment?type=opportunity`,
                method: 'POST', body: formData,
                headers: { 'authorization': token }
            }),
            transformResponse: (response) => response.data,
            // `result` is the server response
            // invalidatesTags: (result, error) =>
            //     [{ type: 'ExecutiveSummary', id: result.data._id }],
        }),
        addDemographicSummary: builder.mutation({
            query: ({ formData, token }) =>
            ({
                url: `executiveSummary/demographic`,
                method: 'POST', body: formData,
                headers: { 'authorization': token }
            }),
            transformResponse: (response) => response.data,
            // `result` is the server response
            // invalidatesTags: (result, error) =>
            //     [{ type: 'ExecutiveSummary', id: result._id }],
        }),
        getPropertySummary: builder.query({
            query: (token) =>
            ({
                url: `propertyDescription/summary`,
                method: 'GET', headers: { 'authorization': token }
            }),
            // Pick out data and prevent nested properties in a hook or selector
            transformResponse: (response, meta, arg) => response.data,
            providesTags: (result, error) =>
                result
                    ? // successful query
                    [
                        { type: 'ProppertyDescription', id: result._id },
                        { type: 'ProppertyDescription', id: 'LIST' },
                    ]
                    : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
                    [{ type: 'ProppertyDescription', id: 'LIST' }],
        }),
        addPropertySummary: builder.mutation({
            query: ({ propertyData, token }) =>
            ({
                url: `propertyDescription/summary`,
                method: 'POST', body: propertyData,
                headers: { 'authorization': token }
            }),
            transformResponse: (response) => response.data,
            // `result` is the server response
            invalidatesTags: (result, error) =>
                [{ type: 'ProppertyDescription', id: result._id }],
        }),
        updatePropertySummary: builder.mutation({
            query: ({ propertyData, token }) =>
            ({
                url: `propertyDescription/summary`,
                method: 'PUT', body: propertyData,
                headers: { 'authorization': token }
            }),
            transformResponse: (response) => response.data,
            // `result` is the server response
            invalidatesTags: (result, error) =>
                [{ type: 'ProppertyDescription', id: result._id }],
        }),
        getCommunityFeature: builder.query({
            // note: an optional `queryFn` may be used in place of `query`
            query: (token) =>
            ({
                url: `propertyDescription/community`,
                method: 'GET', headers: { 'authorization': token }
            }),
            // Pick out data and prevent nested properties in a hook or selector
            transformResponse: (response, meta, arg) => response.data,
            providesTags: (result, error) =>
                result
                    ? // successful query
                    [
                        { type: 'ProppertyDescription', id: result._id },
                        { type: 'ProppertyDescription', id: 'LIST' },
                    ]
                    : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
                    [{ type: 'ProppertyDescription', id: 'LIST' }],
        }),
        addCommunityFeature: builder.mutation({
            query: ({ communityData, token }) =>
            ({
                url: `propertyDescription/community`,
                method: 'POST', body: communityData,
                headers: { 'authorization': token }
            }),
            transformResponse: (response) => response.data,
            // `result` is the server response
            invalidatesTags: (result, error) =>
                [{ type: 'ProppertyDescription', id: result._id }],
        }),
        updateCommunityFeature: builder.mutation({
            query: ({ communityData, token }) =>
            ({
                url: `propertyDescription/community`,
                method: 'PUT', body: communityData,
                headers: { 'authorization': token }
            }),
            transformResponse: (response) => response.data,
            // `result` is the server response
            invalidatesTags: (result, error) =>
                [{ type: 'ProppertyDescription', id: result._id }],
        }),
        addunitFeatures: builder.mutation({
            query: ({ formData, token }) =>
            ({
                url: `propertyDescription/unitfeature`,
                method: 'POST', body: formData,
                headers: { 'authorization': token }
            }),
            transformResponse: (response) => response.data,
            // `result` is the server response
            // invalidatesTags: (result, error) =>
            //     [{ type: 'ProppertyDescription', id: result._id }],
        }),
        getUnitFeature: builder.query({
            query: (token) =>
            ({
                url: `propertyDescription/unitfeature`,
                method: 'GET', headers: { 'authorization': token }
            }),
            // Pick out data and prevent nested properties in a hook or selector
            transformResponse: (response, meta, arg) => response.data,
            providesTags: (result, error) =>
                result
                    ? // successful query
                    [
                        { type: 'ProppertyDescription', id: result._id },
                        { type: 'ProppertyDescription', id: 'LIST' },
                    ]
                    : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
                    [{ type: 'ProppertyDescription', id: 'LIST' }],
        }),
        updateUnitFeature: builder.mutation({
            query: ({ formData, token }) =>
            ({
                url: `propertyDescription/unitfeature`,
                method: 'PUT', body: formData,
                headers: { 'authorization': token }
            }),
            transformResponse: (response) => response.data,
            // `result` is the server response
            invalidatesTags: (result, error) =>
                [{ type: 'ProppertyDescription', id: result._id }],
        }),
        getFloorPlans: builder.query({
            query: (token) =>
            ({
                url: `propertyDescription/floorPlan`,
                method: 'GET', headers: { 'authorization': token }
            }),
            // Pick out data and prevent nested properties in a hook or selector
            transformResponse: (response, meta, arg) => response.data,
            providesTags: (result, error) =>
                result
                    ? // successful query
                    [
                        { type: 'ProppertyDescription', id: result._id },
                        { type: 'ProppertyDescription', id: 'LIST' },
                    ]
                    : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
                    [{ type: 'ProppertyDescription', id: 'LIST' }],
        }),
        addFloorPlans: builder.mutation({
            query: ({ formData, token }) =>
            ({
                url: `propertyDescription/floorPlan`,
                method: 'POST', body: formData,
                headers: { 'authorization': token }
            }),
            transformResponse: (response) => response.data,
            // `result` is the server response
            invalidatesTags: (result, error) =>
                [{ type: 'ProppertyDescription', id: result._id }],
        }),
        getComps: builder.query({
            query: (token) =>
            ({
                url: `propertyDescription/comps`,
                method: 'GET', headers: { 'authorization': token }
            }),
            // Pick out data and prevent nested properties in a hook or selector
            transformResponse: (response, meta, arg) => response.data,
            providesTags: (result, error) =>
                result
                    ? // successful query
                    [
                        { type: 'ProppertyDescription', id: result._id },
                        { type: 'ProppertyDescription', id: 'LIST' },
                    ]
                    : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
                    [{ type: 'ProppertyDescription', id: 'LIST' }],
        }),
        addComps: builder.mutation({
            query: ({ formData, token }) =>
            ({
                url: `propertyDescription/comps`,
                method: 'POST', body: formData,
                headers: { 'authorization': token }
            }),
            transformResponse: (response) => response.data,
            // `result` is the server response
            invalidatesTags: (result, error) =>
                [{ type: 'ProppertyDescription', id: result._id }],
        }),
        addLocationSummary: builder.mutation({
            query: ({ formData, token }) =>
            ({
                url: `locationOverview/locationSummary`,
                method: 'POST', body: formData,
                headers: { 'authorization': token }
            }),
            transformResponse: (response) => response.data,
            // `result` is the server response
            invalidatesTags: (result, error) =>
                [{ type: 'LocationOverview', id: result._id }],
        }),
        getLocationSummary: builder.query({
            query: (token) =>
            ({
                url: `locationOverview/locationSummary`,
                method: 'GET', headers: { 'authorization': token }
            }),
            // Pick out data and prevent nested properties in a hook or selector
            transformResponse: (response, meta, arg) => response.data,
            providesTags: (result, error) =>
                result
                    ? // successful query
                    [
                        { type: 'LocationOverview', id: result._id },
                        { type: 'LocationOverview', id: 'LIST' },
                    ]
                    : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
                    [{ type: 'LocationOverview', id: 'LIST' }],
        }),
        addEmployers: builder.mutation({
            query: ({ formData, token }) =>
            ({
                url: `locationOverview/employers`,
                method: 'POST', body: formData,
                headers: { 'authorization': token }
            }),
            transformResponse: (response) => response.data,
            // `result` is the server response
            invalidatesTags: (result, error) =>
                [{ type: 'LocationOverview', id: result._id }],
        }),
        getEmployers: builder.query({
            query: (token) =>
            ({
                url: `locationOverview/employers`,
                method: 'GET', headers: { 'authorization': token }
            }),
            // Pick out data and prevent nested properties in a hook or selector
            transformResponse: (response, meta, arg) => response.data,
            providesTags: (result, error) =>
                result
                    ? // successful query
                    [
                        { type: 'LocationOverview', id: result._id },
                        { type: 'LocationOverview', id: 'LIST' },
                    ]
                    : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
                    [{ type: 'LocationOverview', id: 'LIST' }],
        }),
        addSourceFund: builder.mutation({
            query: ({ sourceFundFormData, token }) =>
            ({
                url: `financialSummary/sourceFund`,
                method: 'POST', body: sourceFundFormData,
                headers: { 'authorization': token }
            }),
            transformResponse: (response) => response.data,
            // `result` is the server response
            invalidatesTags: (result, error) =>
                [{ type: 'FinancialSummary', id: result._id }],
        }),
        getSourceFund: builder.query({
            query: (token) =>
            ({
                url: `financialSummary/sourceFund`,
                method: 'GET', headers: { 'authorization': token }
            }),
            // Pick out data and prevent nested properties in a hook or selector
            transformResponse: (response, meta, arg) => response.data,
            providesTags: (result, error) =>
                result
                    ? // successful query
                    [
                        { type: 'FinancialSummary', id: result._id },
                        { type: 'FinancialSummary', id: 'LIST' },
                    ]
                    : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
                    [{ type: 'FinancialSummary', id: 'LIST' }],
        }),
        addClosingCapital: builder.mutation({
            query: ({ closingCapitalFormData, token }) =>
            ({
                url: `financialSummary/closingCapital`,
                method: 'POST', body: closingCapitalFormData,
                headers: { 'authorization': token }
            }),
            transformResponse: (response) => response.data,
            // `result` is the server response
            invalidatesTags: (result, error) =>
                [{ type: 'FinancialSummary', id: result._id }],
        }),
        getClosingCapital: builder.query({
            query: (token) =>
            ({
                url: `financialSummary/closingCapital`,
                method: 'GET', headers: { 'authorization': token }
            }),
            // Pick out data and prevent nested properties in a hook or selector
            transformResponse: (response, meta, arg) => response.data,
            providesTags: (result, error) =>
                result
                    ? // successful query
                    [
                        { type: 'FinancialSummary', id: result._id },
                        { type: 'FinancialSummary', id: 'LIST' },
                    ]
                    : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
                    [{ type: 'FinancialSummary', id: 'LIST' }],
        }),
        addDebtAssumptions: builder.mutation({
            query: ({ debtAssumptionFormData, token }) =>
            ({
                url: `financialSummary/debtAssumptions`,
                method: 'POST', body: debtAssumptionFormData,
                headers: { 'authorization': token }
            }),
            transformResponse: (response) => response.data,
            // `result` is the server response
            invalidatesTags: (result, error) =>
                [{ type: 'FinancialSummary', id: result._id }],
        }),
        getDebtAssumptions: builder.query({
            query: (token) =>
            ({
                url: `financialSummary/debtAssumptions`,
                method: 'GET', headers: { 'authorization': token }
            }),
            // Pick out data and prevent nested properties in a hook or selector
            transformResponse: (response, meta, arg) => response.data,
            providesTags: (result, error) =>
                result
                    ? // successful query
                    [
                        { type: 'FinancialSummary', id: result._id },
                        { type: 'FinancialSummary', id: 'LIST' },
                    ]
                    : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
                    [{ type: 'FinancialSummary', id: 'LIST' }],
        }),
        addProjectedIncome: builder.mutation({
            query: ({ formData, token }) =>
            ({
                url: `financialSummary/summary/annualRent`,
                method: 'POST', body: formData,
                headers: { 'authorization': token }
            }),
            transformResponse: (response) => response.data,
            // `result` is the server response
            invalidatesTags: (result, error) =>
                [{ type: 'FinancialSummary', id: result._id }],
        }),
        getProjectedIncome: builder.query({
            query: (token) =>
            ({
                url: `financialSummary/summary/annualRent`,
                method: 'GET', headers: { 'authorization': token }
            }),
            // Pick out data and prevent nested properties in a hook or selector
            transformResponse: (response, meta, arg) => response.data,
            providesTags: (result, error) =>
                result
                    ? // successful query
                    [
                        { type: 'FinancialSummary', id: result._id },
                        { type: 'FinancialSummary', id: 'LIST' },
                    ]
                    : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
                    [{ type: 'FinancialSummary', id: 'LIST' }],
        }),
        addPerforma: builder.mutation({
            query: ({ formData, token }) =>
            ({
                url: `financialSummary/performa`,
                method: 'POST', body: formData,
                headers: { 'authorization': token }
            }),
            transformResponse: (response) => response.data,
            // `result` is the server response
            invalidatesTags: (result, error) =>
                [{ type: 'FinancialSummary', id: result._id }],
        }),
        getPerforma: builder.query({
            query: (token) =>
            ({
                url: `financialSummary/performa`,
                method: 'GET', headers: { 'authorization': token }
            }),
            // Pick out data and prevent nested properties in a hook or selector
            transformResponse: (response, meta, arg) => response.data,
            providesTags: (result, error) =>
                result
                    ? // successful query
                    [
                        { type: 'FinancialSummary', id: result._id },
                        { type: 'FinancialSummary', id: 'LIST' },
                    ]
                    : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
                    [{ type: 'FinancialSummary', id: 'LIST' }],
        }),
        getRefinanceScenario: builder.query({
            query: (token) =>
            ({
                url: `exitScenario/refinance`,
                method: 'GET', headers: { 'authorization': token }
            }),
            // Pick out data and prevent nested properties in a hook or selector
            transformResponse: (response, meta, arg) => response.data,
            providesTags: (result, error) =>
                result
                    ? // successful query
                    [
                        { type: 'ExitScenarios', id: result._id },
                        { type: 'ExitScenarios', id: 'LIST' },
                    ]
                    : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
                    [{ type: 'ExitScenarios', id: 'LIST' }],
        }),
        addRefinanceScenario: builder.mutation({
            query: ({ refinanceData, token }) =>
            ({
                url: `exitScenario/refinance`,
                method: 'POST', body: refinanceData,
                headers: { 'authorization': token }
            }),
            transformResponse: (response) => response.data,
            // `result` is the server response
            invalidatesTags: (result, error) =>
                [{ type: 'ExitScenarios', id: result._id }],
        }),
        getSaleScenario: builder.query({
            query: (token) =>
            ({
                url: `exitScenario/saleScenario`,
                method: 'GET', headers: { 'authorization': token }
            }),
            // Pick out data and prevent nested properties in a hook or selector
            transformResponse: (response, meta, arg) => response.data,
            providesTags: (result, error) =>
                result
                    ? // successful query
                    [
                        { type: 'ExitScenarios', id: result._id },
                        { type: 'ExitScenarios', id: 'LIST' },
                    ]
                    : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
                    [{ type: 'ExitScenarios', id: 'LIST' }],
        }),
        addSaleScenario: builder.mutation({
            query: ({ saleScenarioData, token }) =>
            ({
                url: `exitScenario/saleScenario`,
                method: 'POST', body: saleScenarioData,
                headers: { 'authorization': token }
            }),
            transformResponse: (response) => response.data,
            // `result` is the server response
            invalidatesTags: (result, error) =>
                [{ type: 'ExitScenarios', id: result._id }],
        }),
        addAbout: builder.mutation({
            query: ({ formData, token }) =>
            ({
                url: `user/about`,
                method: 'POST', body: formData,
                headers: { 'authorization': token }
            }),
            transformResponse: (response) => response.data,
            // `result` is the server response
            invalidatesTags: (result, error) =>
                [{ type: 'User', id: result._id }],
        }),
        getAbout: builder.query({
            query: (token) =>
            ({
                url: `user/about`,
                method: 'GET', headers: { 'authorization': token }
            }),
            // Pick out data and prevent nested properties in a hook or selector
            transformResponse: (response, meta, arg) => response.data,
            providesTags: (result, error) =>
                result
                    ? // successful query
                    [
                        { type: 'User', id: result._id },
                        { type: 'User', id: 'LIST' },
                    ]
                    : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
                    [{ type: 'User', id: 'LIST' }],
        })
    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useSignUpUserMutation,
    useLoginUserMutation,
    useAddLocationMutation,

    useGetInvestmentSummaryQuery,
    useAddInvestmentSummaryMutation,
    useUpdateInvestmentSummaryMutation,

    useGetInvestmentOpportunityQuery,
    useAddInvestmentOpportunityMutation,
    useUpdateInvestmentOpportunityMutation,

    useGetDemographicSummaryQuery,
    useAddDemographicSummaryMutation,
    useUpdateDemographicSummaryMutation,

    useGetPropertySummaryQuery,
    useAddPropertySummaryMutation,
    useUpdatePropertySummaryMutation,

    useGetCommunityFeatureQuery,
    useAddCommunityFeatureMutation,
    useUpdateCommunityFeatureMutation,

    useAddunitFeaturesMutation,
    useGetUnitFeatureQuery,
    useUpdateUnitFeatureMutation,

    useAddFloorPlansMutation,
    useGetFloorPlansQuery,

    useAddCompsMutation,
    useGetCompsQuery,

    useAddLocationSummaryMutation,
    useGetLocationSummaryQuery,

    useAddEmployersMutation,
    useGetEmployersQuery,

    useAddSourceFundMutation,
    useGetSourceFundQuery,

    useAddClosingCapitalMutation,
    useGetClosingCapitalQuery,

    useAddDebtAssumptionsMutation,
    useGetDebtAssumptionsQuery,

    useAddProjectedIncomeMutation,
    useGetProjectedIncomeQuery,

    useAddPerformaMutation,
    useGetPerformaQuery,

    useGetRefinanceScenarioQuery,
    useAddRefinanceScenarioMutation,

    useGetSaleScenarioQuery,
    useAddSaleScenarioMutation,

    useAddAboutMutation,
    useGetAboutQuery,

    useGetUserQuery

} = api