import { useContext } from "react";
import { UserContext } from "../context/userContext";
import { ACTION } from "../App";
import { useState } from "react";
import { formatter } from "./Transactions";

export default function Withdraw() {
  const { state, dispatch } = useContext(UserContext);
  const [amount, setAmount] = useState(0);

  const updateAmount = (e) => {
    e.preventDefault();
    setAmount(-parseInt(e.target.value, 10));
  };

  const SomeAlert = ({ children }) => {
    return (
      <div
        className="alert alert-danger d-flex align-items-center"
        role="alert"
      >
        <div>{children}</div>
      </div>
    );
  };

  return (
    <>
      <div className="card mt-3 shadow p-2">
        <h5>Make a Withdraw</h5>
        <div>
          {state.balance <= 0 && (
            <SomeAlert>
              You have insufficient funds. Please make a deposit before
              withdrawing.
            </SomeAlert>
          )}
        </div>
        <div className="mb-3">
          Your current balance is: <b>{formatter.format(state.balance)}</b>
        </div>
        <input
          className="form-control mb-3"
          type="text"
          onChange={(e) => updateAmount(e)}
        ></input>
        <button
          className="btn btn-primary"
          type="button"
          disabled={state.balance <= 0}
          onClick={() => dispatch({ type: ACTION.WITHDRAW, payload: amount })}
        >
          Get My Money
        </button>
      </div>
    </>
  );
}
