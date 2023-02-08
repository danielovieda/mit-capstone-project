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
} from "react-router-dom";
import Transactions from "./pages/Transactions";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";
import CreateAccount from "./pages/CreateAccount";
import {apiPost, apiDelete, apiPostNoAuth} from './utils/fetcher';

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
  _id: null,
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


async function newTransaction (type, amount, email) {
  let transactions;
  if (type === 'withdrawal') {
    await apiPost('/withdrawal', {email, amount}).then((data) => {
      return data.json();
    }).then((data) => {
      transactions = data;
    }).catch((e) => {
      alert(`Withdrawal error: ${e}`)
    })
  } else if (type === 'deposit') {
    await apiPost('/deposit', {email, amount}).then((data) => {
      return data.json();
    }).then((data) => {
      transactions = data;
    }).catch((e) => {
      alert(`Deposit error: ${e}`)
    })
  } else {
    alert(`Error creating a new transaction.`)
  }

  return transactions;
  //return { id: Date.now(), type: type, amount: amount };
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
  const [state, setState] = useState(initialState);
  const [error, setError] = useState({type: '', message: ''});

  // useEffect(() => {
  //   if (state.accountToDelete) localStorage.removeItem(state.accountToDelete);
  //   if (state.email && state.token) localStorage.setItem(`${state.email}`, JSON.stringify(state));
  // }, [state]);

  const logout = () => {
    setState({...state, token: false})
  };

  const login = async (values) => {
    await apiPostNoAuth('/login', {...values}).then((data) => {
      return data.json();
    }).then((data) => {
      if (data.message === 'Wrong password.') {
        setError({type: 'login', message: 'The email or password you entered is incorrect.'})
      } else if (data.message === 'User does not exist.') {
        setError({type: 'login', message: 'The email or password you entered is incorrect.'})
      } else {
        localStorage.setItem('auth', data.token);
        setState({...data})
      }
    }).catch((e) => {
      alert(e)
    })
  }

  const YourHomepage = () => {
    return (
      <>
        {!state.token && <Homepage />}
        {state.token && <Account />}
      </>
    );
  };

  const makeDeposit = async (amount) => {
    const transactions = await newTransaction('deposit', amount, state.email);
    setState({...state, ...transactions})
  }

  const makeWithdrawal = async (amount) => {
    const transactions = await newTransaction('withdrawal', amount, state.email);
    setState({...state, ...transactions})
  }

  const handleDelete = async () => {
    await apiDelete('/user/delete', {email: state.email}).then((data) => {
      return data.json();
    }).then((data) => {
      if (data) logout();
    }).catch((e) => {
      alert('error during delete', e)
    })
  }

  return (
    <>
      <Router>
        <UserContext.Provider value={{ state, logout, login, error, makeDeposit, makeWithdrawal, handleDelete }}>
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
