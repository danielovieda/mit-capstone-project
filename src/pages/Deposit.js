import { useContext } from "react"
import { UserContext } from "../context/userContext"
import { ACTION } from '../App';
import { useState } from "react";

export default function Deposit() {
    const { state, dispatch } = useContext(UserContext);
    const [amount, setAmount] = useState(0);

    const updateAmount = (e) => {
        e.preventDefault();
        setAmount(parseInt(e.target.value, 10));
    }

    return (
        <>
        <h5>Make a Deposit</h5>
        <input type="text" onChange={(e) => updateAmount(e)}></input>
        <button type="button"
        onClick={() => dispatch({type: ACTION.DEPOSIT, payload: amount})}
        >Make Deposit</button>
        </>
    )
}