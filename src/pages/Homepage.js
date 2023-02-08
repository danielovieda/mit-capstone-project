import { Formik, Form, Field } from "formik";
import { useContext } from "react";
import { UserContext } from "../context/userContext";
import { ACTION } from "../App";
import { SomeAlert } from "./Withdraw";
import { Link } from "react-router-dom";
import Logo from "../assets/logo.png";

export default function Homepage() {
  const { state, dispatch, login, error } = useContext(UserContext);

  return (
    <>
      <div className="card mb-3 w-100 mt-3 shadow" style={{ width: "18rem" }}>
        <div className="card-body">
          <h5 className="card-title mb-3">Welcome to Bank of Fake-Merica!</h5>
          <img src={Logo} alt="Bank of Fake-Merica" className="img-fluid" />
          <p className="card-text mt-3">
            The best banking experience you could possibly imagine. Why? Because
            you can generate money with the click of a button! If you already
            have an account, login below. Otherwise you can create your account
            at any time.
          </p>
          <hr />
          <p>Isn't coding fun?</p>
        </div>
      </div>

      <div className="card shadow mb-3 p-3">
        <h4>Account Login</h4>
        <div className="card-body">
          {state.invalidLogin > 0 && state.invalidLogin <= 3 && (
            <SomeAlert alertStyle="alert alert-danger">
              Your password was incorrect. You may try logging in{" "}
              {5 - state.invalidLogin} more times before any account information
              is deleted. For your safety.
              <small>You shouldn't be using your real password here!</small>
            </SomeAlert>
          )}
          {state.invalidLogin === 4 && (
            <SomeAlert alertStyle="alert alert-danger">
              <h3>
                This is your last login attempt before all account information
                is deleted.
              </h3>
            </SomeAlert>
          )}
          {state.accountDeleted && (
            <SomeAlert alertStyle="alert alert-danger">
              <h3>Your account has been deleted.</h3>
            </SomeAlert>
          )}
          {state.userNotFound && (
            <SomeAlert alertStyle="alert alert-info">
              Double-check your email or{" "}
              <Link to="/create-account">create a new account</Link>.
            </SomeAlert>
          )}
          <Formik
            initialValues={{
              email: state.email,
              password: "",
            }}
            validate={(values) => {
              const errors = {};
              if (!values.email) {
                errors.email = "You forgot your e-mail!";
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              ) {
                errors.email = "Invalid email address!";
              }
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {
                login(values)
                setSubmitting(false);
              }, 400);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              /* and other goodies */
            }) => (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Email address
                  </label>
                  <input
                    name="email"
                    type="email"
                    className="form-control"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="exampleInputPassword1"
                    name="password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                  />
                </div>
                {errors.email && touched.email && (
                  <div className="mb-3">
                    <div
                      className="alert alert-danger alert-dismissible fade show"
                      role="alert"
                    >
                      {errors.email}
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="alert"
                        aria-label="Close"
                      ></button>
                    </div>
                  </div>
                )}
                {error.type === 'login' ? <div className="mb-3">
                    <div
                      className="alert alert-danger alert-dismissible fade show"
                      role="alert"
                    >
                      {error.message}
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="alert"
                        aria-label="Close"
                      ></button>
                    </div>
                  </div> : null}
                <div className="mb-3">
                  <button type="submit" className="btn btn-primary">
                    Login
                  </button>
                </div>

                <div className="mb-3">
                  Don't have an account?{" "}
                  <Link to="/create-account">Create one!</Link>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}
