import { Formik, Form, Field } from "formik";
import { useContext } from "react";
import { UserContext } from "../context/userContext";

export default function Homepage() {
    const { userInfo, setUserInfo } = useContext(UserContext);

  return (
    <>
      <div class="card mb-3 w-100 mt-3 shadow" style={{ width: "18rem" }}>
        <div class="card-body">
          <h5 class="card-title">Welcome to Bank of Fake-Merica!</h5>
          <p class="card-text">
            The best banking experience you could possibly imagine. Why? Because
            you can generate money with the click of a button! Simply login to
            your account below. Don't worry, you can create one if you don't
            have an account. Or just type in any email and password and maybe
            you'll have an account!
            <hr />
            Isn't coding fun?
          </p>
        </div>
      </div>
      <Formik
        initialValues={{ email: "", password: "" }}
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
            setUserInfo(values);
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
              <label for="exampleInputEmail1" class="form-label">
                Email address
              </label>
              <input
                name="email"
                type="email"
                class="form-control"
                id="exampleInputEmail1"
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
              <label for="exampleInputPassword1" class="form-label">
                Password
              </label>
              <input
                type="password"
                class="form-control"
                id="exampleInputPassword1"
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
              />
            </div>
            {errors.email && touched.email && (
              <div class="mb-3">
                <div
                  class="alert alert-danger alert-dismissible fade show"
                  role="alert"
                >
                  {errors.email}
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                  ></button>
                </div>
              </div>
            )}
            <div className="mb-3">
              <button type="submit" class="btn btn-primary">
                Login
              </button>
            </div>

            <div className="mb-3">Don't have an account? Create one!</div>
          </form>
        )}
      </Formik>
    </>
  );
}
