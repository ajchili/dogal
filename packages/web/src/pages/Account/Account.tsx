import { getAuth } from "firebase/auth"

export const Account = (): JSX.Element => {
    const { currentUser } = getAuth();

    return <div>
        <h1>Welcome {currentUser?.phoneNumber}</h1>
    </div>
}