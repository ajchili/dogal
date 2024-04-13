import { getAuth } from "firebase/auth";
import { createBrowserRouter, redirect, RouterProvider } from "react-router-dom";
import { Signin } from "../../pages/Signin/Signin.js";
import { Account } from "../../pages/Account/Account.js";

const authValidatorLoader = async (): Promise<Response | null> => {
    await getAuth().authStateReady();
    const { currentUser } = getAuth();
    if (!currentUser) {
        return redirect("/signin");
    }
    return null;
}

const router = createBrowserRouter([
    {
        path: "/signin",
        element: <Signin />
    },
    {
        path: "/account",
        element: <Account />,
        loader: authValidatorLoader
    }
]);

export const Router = (): JSX.Element => <RouterProvider router={router} />;