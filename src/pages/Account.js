import { useContext } from "react";
import { UserContext } from "../context/userContext";
import { Link } from "react-router-dom";

export default function Account() {
  const { state } = useContext(UserContext);

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
            <Link to="/deposit">
            <button className="btn btn-primary mb-3">Deposit Money</button></Link>
          </div>
          <div class="col-sm-6 text-center">
          <Link to="/withdraw">
            <button className="mb-3 btn btn-primary">Get Money</button></Link>
          </div>
        </div>
      </div>
    </>
  );
}
