import { useContext } from "react";
import { UserContext } from "../context/userContext";
import * as dayjs from "dayjs";

export const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function Transactions({ limit = 0 }) {
  const { state } = useContext(UserContext);

  var balance = 0;

  var start = 0;

  if (limit) start = state.transactions.length - limit;

  return (
    <div className="card mt-3 p-2 shadow">
      <div className="mb-3">
        <h3>{limit ? "Recent " : ""} Transactions</h3>
      </div>
      <table className="table mb-3">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Timestamp</th>
            <th scope="col">Type</th>
            <th scope="col">Amount</th>
            <th scope="col">Balance</th>
          </tr>
        </thead>
        <tbody>
          {state.transactions.map((item, index) => {
            if (index >= start)
              return (
                <tr>
                  <th scope="row">{index + 1}</th>
                  <td>{dayjs(item.id).format("MM/DD/YY hh:mma")}</td>
                  <td>{item.type}</td>
                  <td style={{ color: item.amount < 0 ? "red" : "green" }}>
                    {formatter.format(item.amount)}
                  </td>
                  <td>{formatter.format((balance = balance + item.amount))}</td>
                </tr>
              );
          })}
        </tbody>
      </table>
      <div className="text-end">
        <h4>
          <span class="badge bg-primary">
            Account Balance: {formatter.format(state.balance)}
          </span>
        </h4>
      </div>
    </div>
  );
}
