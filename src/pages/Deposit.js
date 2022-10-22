import { useContext } from "react"
import { UserContext } from "../context/userContext"
import { ACTION } from '../App';
import { useState } from "react";
import { formatter } from "./Transactions";

export default function Deposit() {
    const { state, dispatch } = useContext(UserContext);
    const [amount, setAmount] = useState(0);

    const updateAmount = (e) => {
        //e.preventDefault();
        setAmount(parseInt(e.target.value, 10));
    }

    return (
        <>
        <div className="card mt-3 shadow p-2">
        <h5>Make a Deposit</h5>
        <div className="mb-3">Your current balance is: <b>{formatter.format(state.balance)}</b></div>
        <input className="form-control mb-3" type="text" onChange={(e) => updateAmount(e)}></input>
        <button className="btn btn-primary" type="button"
        onClick={() => dispatch({type: ACTION.DEPOSIT, payload: amount})}
        >Make Deposit</button>
        </div>
        
        </>
    )
}