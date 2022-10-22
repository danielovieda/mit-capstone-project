import { useContext } from "react";
import { UserContext } from "../context/userContext";
import { Link } from "react-router-dom";

export default function Navigation() {
  const { state, dispatch, logout } = useContext(UserContext);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <div className="navbar-brand" href="#">
            Bank of Fake-Merica
          </div>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link to="/" style={{ textDecoration: "none" }}>
                  <div className="nav-link active" aria-current="page">
                    Home
                  </div>
                </Link>
              </li>
              {state.email && (
                <li className="nav-item dropdown">
                  <div
                    className="nav-link dropdown-toggle"
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Manage Your Money
                  </div>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdown"
                  >
                    <li>
                      <Link to="/deposit" style={{ textDecoration: "none" }}>
                        <div className="dropdown-item">Make a Deposit</div>
                      </Link>
                    </li>
                    <li>
                      <Link to="/withdraw" style={{ textDecoration: "none" }}>
                        <div className="dropdown-item" href="#">
                          Make a Withdrawal
                        </div>
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <Link
                        to="/transactions"
                        style={{ textDecoration: "none" }}
                      >
                        <div className="dropdown-item" href="#">
                          Transactions
                        </div>
                      </Link>
                    </li>
                  </ul>
                </li>
              )}
              {state.email && (
                <li className="nav-item">
                    <Link
                        to="/"
                        style={{ textDecoration: "none" }}
                      >
                  <div
                    className="nav-link"
                    tabindex="-1"
                    aria-disabled="true"
                    onClick={logout}
                  >
                    Logout
                  </div></Link>
                </li>
              )}
              {state.email && <li className="nav-item">
              <span class="badge bg-primary">Balance: ${state.balance}</span>
              </li> }
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
