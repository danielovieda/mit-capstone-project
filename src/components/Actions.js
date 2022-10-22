import Deposit from "../pages/Deposit";
import Withdrawal from "../pages/Withdraw";
import { TransactionContext } from "../context/transactionContext";

export default function Actions(props) {
    const {action} = props;

    return (
        <>
        {action === 'deposit' &&
        <Deposit />}
        {action === 'withdraw' &&
        <Withdrawal />}
        </>
    )
}