import { useContext } from "react";
import { UserContext } from "../context/userContext";
import { Link } from "react-router-dom";
import { useState } from "react";
import { ACTION } from "../App";
import Logo from "../assets/logo.png"

export default function Account() {
  const { state, dispatch } = useContext(UserContext);
  const [ confirmDelete, setConfirmDelete ] = useState(false);

  const handleDelete = () => {
    dispatch({ type: ACTION.DELETE_ACCOUNT });
  };

  const confirmDeleteFn = () => {
    setConfirmDelete(!confirmDelete);
  };

  return (
    <>
      <div class="mt-3 shadow p-3 rounded">
        <div class="row p-2 pb-0">
            <div className="col-sm-2"><img src={Logo} width={50} height={50} alt="Logo" /></div>
            <div className="col-sm-10"><h4>Account Details</h4></div>
          
        </div>
        <hr />
        <div>Name: {state.name}</div>
        <div>Email: {state.email}</div>

        <hr />
        <div class="row mt-4">
          <div class="col-sm-6 text-center">
            <Link to="/deposit">
              <button className="btn btn-primary mb-3">Deposit Money</button>
            </Link>
          </div>
          <div class="col-sm-6 text-center">
            <Link to="/withdraw">
              <button className="mb-3 btn btn-primary">Get Money</button>
            </Link>
          </div>
        </div>

        <hr />
        <div className="row mt-5 m-3">
          <h5 style={{ color: "red" }}>Danger Zone</h5>
          <br />
          <button className="btn btn-danger mt-3" onClick={confirmDeleteFn}>
            Delete My Account
          </button>

          {confirmDelete && (
            <>
              <br />
              <br />
              <button className="btn btn-danger mt-3" onClick={handleDelete}>
                DELETE MY ACCOUNT FOREVER
              </button>
              <br />
                <small style={{ color: "red" }}>
                  This action cannot be undone. All remaining balance will be
                  kept by the bank (thanks).
                </small>
              
            </>
          )}
        </div>
      </div>
    </>
  );
}
