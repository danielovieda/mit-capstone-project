import { useContext } from "react";
import { UserContext } from "../context/userContext";
import { ACTION } from "../App";
import { useState } from "react";
import { formatter } from "./Transactions";
import { SomeAlert } from "./Withdraw";
import Snackbar from "@mui/material/Snackbar";

export default function Deposit() {
  const { state, dispatch } = useContext(UserContext);
  const [amount, setAmount] = useState(null);
  const [notification, setNotification] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateAmount = (e) => {
    e.preventDefault();
    setAmount(Math.abs(parseFloat(e.target.value)));
  };

  const handleDeposit = () => {
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
    setLoading(true);
    setTimeout(() => {
      dispatch({ type: ACTION.DEPOSIT, payload: amount });
    }, 800);
    setAmount("");
    setTimeout(() => {
      setNotification("Your deposit has been made!");
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
        <h5>Make a Deposit</h5>
        {amount > ACTION.DAILY_LIMIT && (
          <SomeAlert alertStyle="alert alert-info">
            Your single deposit limit is {formatter.format(ACTION.DAILY_LIMIT)}.
            You may not exceed this amount in a single deposit.
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
          max={ACTION.DAILY_LIMIT}
          onChange={(e) => updateAmount(e)}
          value={amount}
        ></input>
        <button
          className="btn btn-primary"
          type="button"
          disabled={amount > ACTION.DAILY_LIMIT || loading || !amount}
          onClick={handleDeposit}
        >
          {!loading ? "Make Deposit" : "Sending funds..."}
        </button>
      </div>
    </>
  );
}
