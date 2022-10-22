import { useContext } from "react";
import { UserContext } from "../context/userContext";
import { ACTION } from "../App";
import { useState } from "react";

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
      <h5>Make a Withdraw</h5>
      <div>
        {state.balance <= 0 && (
          <SomeAlert>
            You have insufficient funds. Please make a deposit before
            withdrawing.
          </SomeAlert>
        )}
      </div>
      <input type="text" onChange={(e) => updateAmount(e)}></input>
      <button
        type="button"
        disabled={state.balance <= 0}
        onClick={() => dispatch({ type: ACTION.WITHDRAW, payload: amount })}
      >
        Get My Money
      </button>
    </>
  );
}
