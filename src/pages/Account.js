import { useContext } from "react"
import { UserContext } from "../context/userContext"

export default function Account() {
    const { userInfo} = useContext(UserContext);

    return (
        <>
        <div class="mt-3 shadow p-3 rounded">
            <div class="p-2 pb-0">
                <h4>
                Account Details
                </h4>
            </div>
            <hr />
            <b>{userInfo.email}</b>
            <hr />

            </div>
        </>
    )
}