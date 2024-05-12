
// an array of routes that are accessible to the public.
// these routes do not require authenication
export const publicRoutes=[
    "/"
];

//an array of routes used for authentication 
//these routes will redirect logged in users to settings

export const authRoutes=[
    "/auth/login",
    "/auth/register",
    "/auth/error"
];

//The prefix for api authentication routes 
// Routes that start with this prefix are used for api authentication purposes

export const apiAuthPrefix= "/api/auth";


export const DEFAULT_LOGIN_REDIRECT="/settings";