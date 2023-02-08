import { useContext } from "react";
import { UserContext } from "../context/userContext";
import { ACTION } from "../App";
import { useState } from "react";
import { formatter } from "./Transactions";
import Snackbar from "@mui/material/Snackbar";

export const SomeAlert = ({ children, alertStyle }) => {
  return (
    <div className={`${alertStyle} d-flex align-items-center`} role="alert">
      <div>{children}</div>
    </div>
  );
};

export default function Withdraw() {
  const { state, makeWithdrawal } = useContext(UserContext);
  const [amount, setAmount] = useState("");
  const [notification, setNotification] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateAmount = (e) => {
    e.preventDefault();
    setAmount(parseFloat(e.target.value));
  };

  const handleWithdraw = () => {
    if (
      amount === "" ||
      amount === null ||
      amount === undefined ||
      amount <= 0 ||
      isNaN(amount) === true
    ) {
      setNotification("Your input is invalid. Please try again.");
      setAmount("");
      return;
    }
    let total;
    if (Math.abs(amount) > state.balance && state.balance > 0) {
      total = (Math.abs(amount) * ACTION.FEE) + amount;
    } else {
      total = amount;
    }
    setLoading(true);
    setTimeout(() => {
      makeWithdrawal(-total)
    }, 800);
    setAmount("");
    setTimeout(() => {
      setNotification("You have successfully made a withdrawal! Cha-Ching!");
      setLoading(false);
    }, 1200);
  };

  const closeSnackbar = () => {
    setNotification(false);
  };

  return (
    <>
      <Snackbar
        open={notification}
        autoHideDuration={6000}
        message={notification}
        onClose={closeSnackbar}
      />
      <div className="card mt-3 shadow p-2">
        <h5 className="mt-2">Make a Withdrawal</h5>

        {state.balance <= 0 && (
          <SomeAlert alertStyle="alert alert-danger">
            You have insufficient funds. Please make a deposit before
            withdrawing.
          </SomeAlert>
        )}

        {Math.abs(amount) > state.balance && state.balance > 0 && (
          <SomeAlert alertStyle="alert alert-warning">
            You are allowed to make one withdrawal over your balance but{" "}
            <b>
              you will be charged a {ACTION.FEE * 100}% fee of the total
              withdrawal amount.
            </b>{" "}
            Your calculated fee is:{" "}
            {formatter.format(Math.abs(amount) * ACTION.FEE)}
          </SomeAlert>
        )}

        <div className="mb-3">
          Your current balance is: <b>{formatter.format(state.balance)}</b>
        </div>
        <input
          className="form-control mb-3"
          type="number"
          step={0.1}
          min={0}
          onChange={(e) => updateAmount(e)}
          value={amount}
        ></input>
        <button
          className="btn btn-primary"
          type="button"
          disabled={state.balance <= 0 || loading || !amount}
          onClick={handleWithdraw}
        >
          {!loading ? "Get My Money" : "Taking out money..."}
        </button>
      </div>
    </>
  );
}
