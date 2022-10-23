import { useContext, useEffect } from "react";
import { UserContext } from "../context/userContext";
import { Formik, Form, Field } from "formik";
import { ACTION } from "../App";
import { SomeAlert } from "./Withdraw";
import * as Yup from "yup";
import { Link } from "react-router-dom";

const PASS_REQ =
  "Your password must be: minimum eight characters, maximum sixteen characters, at least one letter, one number and one special character.";

const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Your name must be at least 3 characters long.")
    .max(30, "Your name is too long!")
    .required("Your name is required. What are you hiding?"),
  password: Yup.string()
    .min(8, PASS_REQ)
    .max(16, PASS_REQ)
    .matches(
      "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$",
      PASS_REQ
    )
    .required(PASS_REQ),
  email: Yup.string()
    .email("Please enter a valid e-mail.")
    .required("Your email is required."),
});

export default function CreateAccount() {
  const { state, dispatch } = useContext(UserContext);

  const ThankYou = () => {
    return (
      <div className="card p-3 shadow mt-3">
        <h4 style={{ color: "green" }}>Thank you!</h4>
        <p>
          Thank you for creating an account with us. You have been logged in
          automatically.
        </p>
        <p>
          Please use the navigation at the top, or you can immediately start
          giving us money, I mean... Deposit money by <Link to="/deposit">clicking here</Link>!
        </p>
      </div>
    );
  };

  return (
    <>
    {!state.token &&
      <div className="card shadow mt-3 p-3">
        <div className="card-body">
          <Formik
            initialValues={{
              name: "",
              email: "",
              password: "",
            }}
            validationSchema={SignupSchema}
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {
                dispatch({ type: ACTION.CREATE_ACCOUNT, payload: values });
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
                <div class="mb-3">
                  <label for="name" class="form-label">
                    Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    class="form-control"
                    id="name"
                    aria-describedby="Your Name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                  />
                  <div id="name" class="form-text">
                    Who are you?
                  </div>
                </div>
                <div class="mb-3">
                  <label for="email" class="form-label">
                    Email address
                  </label>
                  <input
                    name="email"
                    type="email"
                    class="form-control"
                    id="email"
                    aria-describedby="emailHelp"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                  />
                  <div id="emailHelp" class="form-text">
                    We'll never share your email with anyone else.
                  </div>
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    class="form-control"
                    id="password"
                    name="password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                  />
                </div>
                {errors.email && touched.email && (
                  <SomeAlert alertStyle="alert alert-danger">
                    {errors.email}
                  </SomeAlert>
                )}
                {errors.password && touched.password && (
                  <SomeAlert alertStyle="alert alert-danger">
                    {errors.password}
                  </SomeAlert>
                )}
                {errors.name && touched.name && (
                  <SomeAlert alertStyle="alert alert-danger">
                    {errors.name}
                  </SomeAlert>
                )}
                <div className="mb-3">
                  <button
                    type="submit"
                    class="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    Create Account
                  </button>
                </div>

                <div className="mt-5 mb-1">
                  <small>
                    Disclaimer: This is an MIT Project. Don't use a real
                    password of your own. No data, including passwords, are
                    encrypted for this demonstration.
                  </small><br />
                  <small style={{color: 'red'}}>If you already have an account, please use the login page.</small>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div> }
      {state.token && <ThankYou />}
    </>
  );
}
