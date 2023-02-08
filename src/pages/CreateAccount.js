import { useContext, useState } from "react";
import { UserContext } from "../context/userContext";
import { Formik, Form, Field } from "formik";
import { SomeAlert } from "./Withdraw";
import * as Yup from "yup";
import Logo from "../assets/logo.png";
import { apiPostNoAuth } from "../utils/fetcher";

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
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const createAccount = async (values) => {
    setLoading(true);
    await apiPostNoAuth("/user/create", { ...values })
      .then((data) => {
        return data.json()
      }).then((data) => {
        setSuccess(true);
        setLoading(false);
      })
      .catch((e) => {
        console.log("err", e);
      });
  };

  const ThankYou = () => {
    return (
      <div className="card p-3 shadow mt-3">
        <h4 style={{ color: "green" }}>Thank you!</h4>
        <p>
          Thank you for creating an account with us. You may now login using your email and password.
        </p>
        <p>
          Once you are logged in, you can use the navigation at the top and immediately start
          giving us money, I mean... Depositing money...
        </p>
      </div>
    );
  };

  const CreatingAccount = () => {
    return (
      <div className="card p-3 shadow mt-3">
      <p>
        Creating your account... Please wait.
      </p>
    </div>
    )
  }

  return (
    <>
      {!success && !loading && (
        <div className="card shadow mt-3 p-3">
          <div className="card-body">
            <div>
              <img
                src={Logo}
                alt="Bank of Fake-Merica"
                className="img-fluid mb-3"
              />
            </div>
            <div>
              <h3>Create New Account</h3>
            </div>
            <Formik
              initialValues={{
                name: "",
                email: "",
                password: "",
              }}
              validationSchema={SignupSchema}
              onSubmit={(values, { setSubmitting }) => {
                setTimeout(() => {
                  createAccount(values);
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
                    <label htmlFor="name" className="form-label">
                      Name
                    </label>
                    <input
                      name="name"
                      type="text"
                      className="form-control"
                      id="name"
                      aria-describedby="Your Name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name}
                    />
                    <div id="name" className="form-text">
                      Who are you?
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email address
                    </label>
                    <input
                      name="email"
                      type="email"
                      className="form-control"
                      id="email"
                      aria-describedby="emailHelp"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                    />
                    <div id="emailHelp" className="form-text">
                      We'll never share your email with anyone else.
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
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
                      className="btn btn-primary"
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
                    </small>
                    <br />
                    <small style={{ color: "red" }}>
                      If you already have an account, please use the login page.
                    </small>
                  </div>
                </form>
              )}
            </Formik>
          </div>
        </div>
      )}
      {success && !loading && <ThankYou />}
      {loading ? <CreatingAccount /> : null}
    </>
  );
}
