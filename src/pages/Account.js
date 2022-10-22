import { useContext } from "react";
import { UserContext } from "../context/userContext";
import { useState } from "react";
import Deposit from "./Deposit";
import Withdrawal from "./Withdraw";

export default function Account() {
  const { state, dispatch } = useContext(UserContext);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  return (
    <>
      <div class="mt-3 shadow p-3 rounded">
        <div class="p-2 pb-0">
          <h4>Account Details</h4>
        </div>
        <hr />
        <b>{state.email}</b>
        <hr />
        <div class="row ">
          <div class="col-sm-6 text-center">
            <button
              className="btn btn-primary"
              onClick={() => {
                setShowDeposit(!showDeposit);
                setShowWithdraw(false);
              }}
            >
              Deposit
            </button>
          </div>
          <div class="col-sm-6 text-center">
            <button
              className="btn btn-primary"
              onClick={() => {
                setShowWithdraw(!showWithdraw);
                setShowDeposit(false);
              }}
            >
              Withdrawal
            </button>
          </div>
        </div>
      </div>
      {showDeposit && <Deposit />}

      {showWithdraw && <Withdrawal />}
    </>
  );
}
