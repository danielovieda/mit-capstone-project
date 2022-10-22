import { useContext } from "react";
import { UserContext } from "../context/userContext";
import * as dayjs from 'dayjs'

export default function Transactions() {
    const { state } = useContext(UserContext);

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      
      });

    var balance = 0;

    return (
       <table className="table">
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
            { state.transactions.map((item, index) => {
                return (
                    <tr>
                        <th scope="row">{index}</th>
                        <td>{dayjs(item.id).format("MM/DD/YY hh:mma")}</td>
                        <td>{item.type}</td>
                        <td style={{color: item.amount < 0 ? 'red' : 'green'}}>{formatter.format(item.amount)}</td>
                        <td>{formatter.format(balance = balance + item.amount)}</td>
                    </tr>
                )
            })}
        </tbody>
       </table>
    )
}