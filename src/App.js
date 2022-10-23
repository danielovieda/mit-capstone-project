import "./App.css";
import Navigation from "./components/Navigation";
import { useEffect, useReducer, useState } from "react";
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
import Snackbar from "@mui/material/Snackbar";
import CreateAccount from "./pages/CreateAccount";

export const ACTION = {
  DEPOSIT: "deposit",
  WITHDRAW: "withdraw",
  USER: "user",
  LOGOUT: "logout",
  LOGIN: "login",
  FEE: "0.15",
  DAILY_LIMIT: 10000,
  CREATE_ACCOUNT: "create_account",
  DELETE_ACCOUNT: "delete_account"
};

const initialState = {
  name: null,
  email: null,
  password: "",
  transactions: [
    {
      id: Date.now(),
      type: "New Account",
      amount: 0,
    },
  ],
  balance: 0,
  token: null,
  invalidLogin: 0,
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
          newTransaction("Online Deposit", action.payload),
        ],
        balance: calculateBalance([
          ...state.transactions,
          newTransaction("Balance", action.payload),
        ]),
      };
    case ACTION.WITHDRAW:
      if (Math.abs(parseFloat(action.payload)) > parseFloat(state.balance)) {
        let transactionsWithFees = [];
        let transactionItems = [
          newTransaction(
            "Overdraft Fee",
            parseFloat(action.payload * ACTION.FEE)
          ),
          newTransaction("Online Withdrawal", action.payload),
        ];
        return {
          ...state,
          transactions: transactionsWithFees.concat(
            ...state.transactions,
            transactionItems
          ),
          balance: calculateBalance(
            transactionsWithFees.concat(...state.transactions, transactionItems)
          ),
        };
      } else {
        return {
          ...state,
          transactions: [
            ...state.transactions,
            newTransaction("Online Withdrawal", action.payload),
          ],
          balance: calculateBalance([
            ...state.transactions,
            newTransaction("Online Withdrawal", action.payload),
          ]),
        };
      }
    case ACTION.LOGOUT:
      return { ...state, token: false };
    case ACTION.LOGIN:
      let savedState = JSON.parse(localStorage.getItem(action.payload.email));
      if (savedState) {
        if (state.invalidLogin > 4) {
          localStorage.removeItem(action.payload.email);
          return { ...state, accountDeleted: true, userNotFound: false};
        }
        if (savedState.password === action.payload.password) {
          
          return {
            ...savedState,
            token: Date.now(),
            invalidLogin: 0,
            accountDeleted: false,
            userNotFound: false
          };
        } else {
          console.log(state)
          return { ...state, invalidLogin: state.invalidLogin + 1, userNotFound: false };
        }
      }
        else {
          return {...state, userNotFound: true}
        }
    case ACTION.CREATE_ACCOUNT:
      return {
        ...initialState,
        name: action.payload.name,
        email: action.payload.email,
        password: action.payload.password,
        token: Date.now(),
      };
    case ACTION.DELETE_ACCOUNT:
      localStorage.removeItem(state.email);
      return {...initialState}
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
      total = total + parseFloat(item.amount);
    }
  });

  return total;
}

const Page404 = () => {
  return (
    <div
      class="card text-white bg-danger mb-3 mx-auto mt-5 shadow-lg"
      style={{ maxWidth: "25rem" }}
    >
      <div class="card-body">
        <h5 class="card-title">Unauthorized</h5>
        <p class="card-text">
          You are attempting to access a page that required you to be logged in.
          Please login then try again.
        </p>
      </div>
    </div>
  );
};

function App() {
  const [state, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    if (state.accountToDelete) localStorage.removeItem(state.accountToDelete);
    if (state.email && state.token) localStorage.setItem(`${state.email}`, JSON.stringify(state));
  }, [state]);

  const logout = () => {
    dispatch({ type: ACTION.LOGOUT });
  };

  const YourHomepage = () => {
    return (
      <>
        {!state.token && <Homepage />}
        {state.token && <Account />}
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
                  {state.token && (
                    <>
                      <Route path="/account" element={<Account />} />
                      <Route path="/deposit" element={<Deposit />} />
                      <Route path="/withdraw" element={<Withdraw />} />
                      <Route path="/transactions" element={<Transactions />} />
                    </>
                  )}
                  <Route path="/create-account" element={<CreateAccount />} />
                  <Route exact path="/" element={<YourHomepage />} />
                  <Route path="*" element={<Page404 />} />
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
