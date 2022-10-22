import "./App.css";
import Navigation from "./components/Navigation";
import { useReducer, useState } from "react";
import Homepage from "./pages/Homepage";
import { UserContext } from "./context/userContext";
import Account from "./pages/Account";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Transactions from "./pages/Transactions";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";

export const ACTION = {
  DEPOSIT: "deposit",
  WITHDRAW: "withdraw",
  TRANSACTIONS: "transactions",
  USER: "user",
  LOGOUT: "logout",
};

const initialState = {
  email: null,
  password: "",
  transactions: [
    {
      id: Date.now(),
      type: "New Account Created",
      amount: 0,
    },
  ],
  balance: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case ACTION.USER:
      return {
        ...state,
        email: action.payload.email,
        password: action.payload.password,
      };
    case ACTION.DEPOSIT:
      return {
        ...state,
        transactions: [
          ...state.transactions,
          newTransaction("deposit", action.payload),
        ],
        balance: calculateBalance([...state.transactions, newTransaction("deposit", action.payload)]),
      };
    case ACTION.WITHDRAW:
      console.log({ state });
      return {
        ...state,
        transactions: [
          ...state.transactions,
          newTransaction("withdraw", action.payload),
        ],
        balance: calculateBalance([...state.transactions, newTransaction("deposit", action.payload)]),
      };
    case ACTION.TRANSACTIONS:
      return state.transactions;
    case ACTION.LOGOUT:
      return initialState;
    default:
      throw new Error();
  }
}

function newTransaction(type, amount) {
  return { id: Date.now(), type: type, amount: amount };
}

function calculateBalance(transactions) {
  let total = 0;
  transactions.map((item) => {
    if (
      item.amount === null ||
      item.amount === undefined ||
      item.amount === ""
    ) {
    } else {
      total = total + parseInt(item.amount, 10);
    }
  });

  return total;
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const logout = () => {
    dispatch({ type: ACTION.LOGOUT });
  };

  const YourHomepage = () => {
    return (
      <>
        {!state.email && <Homepage />}
        {state.email && <Account />}
      </>
    );
  };

  return (
    <>
      <Router>
        <UserContext.Provider value={{ state, dispatch, logout }}>
          <Navigation />
          <div class="container-lg">
            <div class="row">
              <div class="col-md-6 offset-md-3">
                <Routes>
                  <Route path="/account" element={<Account />} />
                  <Route path="/deposit" element={<Deposit />} />
                  <Route path="/withdraw" element={<Withdraw />} />
                  <Route path="/transactions" element={<Transactions />} />
                  <Route exact path="/" element={<YourHomepage />} />
                  <Route path="*" element={<p>This page doesn't exist.</p>} />
                </Routes>
              </div>
            </div>
          </div>
        </UserContext.Provider>
      </Router>
    </>
  );
}

export default App;
