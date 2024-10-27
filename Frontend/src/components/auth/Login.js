import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import FormLayout from '../layout/FormLayout';
import Button from '../../common/Button';
import InputField from '../../common/InputField';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
// import Notification from '../../context/Notification';
import { FORM_CONSTANTS } from '../../constants/FormConstants';
import Checkbox from '../../common/Checkbox';
import '../../';

const LoginForm = () => {
  const [failedAttempts, setFailedAttempts] = useState(0);
  const maxAttempts = 3;
  const lockoutDuration = 30 * 60;
  const [isLocked, setIsLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(lockoutDuration);
  const [showNotification, setShowNotification] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); 

  const validationSchema = Yup.object().shape({
    admin_Email: Yup.string().email(FORM_CONSTANTS.INVALID_EMAIL).required(FORM_CONSTANTS.ENTER_EMAIL),
    password: Yup.string().required(FORM_CONSTANTS.ENTER_PASSWORD)
  });

  const formik = useFormik({
    initialValues: { admin_Email: '', password: '' },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      console.log('Submitting Form Values:', values);
      try {
        debugger
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/PMS/auth/tenants-login`, values);
        console.log('Login Successful:', response.data);
        // rememberMe function
        if (rememberMe) {
        }
        setLoggedIn(true);
        localStorage.setItem('token', response.data.token);
      } catch (error) {
        console.error('Login Failed:', error.response ? error.response.data : error);
        setErrors({ login_attempt: 'Login failed. Please check your credentials.' });
        setFailedAttempts(prevAttempts => prevAttempts + 1);

        if (failedAttempts + 1 >= maxAttempts) {
          toast.error('Your account is locked. Please contact support.');
          setIsLocked(true);
          setShowNotification(true);
        } else {
          toast.error(`Incorrect password. ${maxAttempts - failedAttempts - 1} attempts remaining.`);
        }
      }
      setSubmitting(false);
    }
  });

  useEffect(() => {
    console.log('Formik Errors:', formik.errors);
  }, [formik.errors]);

  const closeNotification = () => {
    setShowNotification(false);
  };

  if (loggedIn) {
    return <Navigate to="/blank-page" replace />;
  }

  return (
    <>

    
<section class="login_screen py-lg-0 py-md-4 py-4">
        <div class="container">
          <div class="form_card">
            <div class="row g-4">
              <div
                class="col-lg-6 col-md-12 col-sm-12 col-12 position-relative px-lg-5 px-md-4 px-4 d-flex align-items-center justify-content-center flex-column position-relative">
                <div class="logoadmin" data-aos="fade-right" data-aos-offset="0" data-aos-delay="0" data-aos-duration="1500">
                  <img src="images/logo.png" alt="Login Background" />
                </div>
                <div class="login_data px-lg-4">
                  <h2 data-aos="fade-right" data-aos-offset="0" data-aos-delay="0" data-aos-duration="1000">Welcome Back</h2>
                  <p class="m-0" data-aos="fade-right" data-aos-offset="0" data-aos-delay="0" data-aos-duration="1000">Lorem Ipsum is simply dummy text
                    of the
                    printing
                    and typesetting
                    industry. Lorem Ipsum has been the
                    industry's
                    standard dummy
                    text ever since</p>

                  <FormLayout>
                    <div class="form-floating mb-3">
                      {/* <input type="email" class="form-control"
                        id="floatingInput"
                        placeholder="test@gmail.com" /> */}
                      <InputField
                        type="text"
                        class="form-control"
                        name="admin_Email"
                        // placeholder="Email"
                        value={formik.values.admin_Email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.errors.admin_Email && formik.touched.admin_Email ? formik.errors.admin_Email : null}
                      />
                      <label for="floatingInput">Email
                        Address</label>
                    </div>
                    <div class="form-floating mb-4">
                      {/* <input type="password"
                        class="form-control"
                        id="floatingInput"
                        placeholder="***************" /> */}
                      <InputField
                        type="password"
                        name="password"
                        class="form-control"
                        // placeholder="Password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.errors.password && formik.touched.password ? formik.errors.password : null}
                      />
                      <label
                        for="floatingInput">Password</label>
                    </div>
                    <div
                      class="d-flex align-items-center justify-content-between forgot_pwd">
                      <div class="remember">
                        <div class="checkbox">
                          <Checkbox rememberMe={rememberMe} setRememberMe={setRememberMe} />
                          <label></label>
                        </div>
                        {/* Remember Me */}
                      </div>
                      <Link to="/forgot-password">Forgot Password</Link>
                    </div>
                    <div
                      class="button mt-4 pt-lg-1 d-flex align-items-center gap-4">
                      {/* <button
                        class="btn btn-primary">Login</button> */}
                      <Button
                        type="submit"
                        className="btn btn-primary"
                        disabled={formik.isSubmitting}
                      >
                        Login
                      </Button>
                      <span>Or</span>
                      <img src="images/login_with.png" alt="Login Background" />
                    </div>
                  </FormLayout>
                  <hr class="my-5" />
                  <div class="register text-center" data-aos="fade-right" data-aos-offset="0" data-aos-delay="0" data-aos-duration="1500">
                    <p class="m-0">Don't have an account yet?  <Link to="/register">Register</Link></p>
                  </div>
                </div>
              </div>
              <div
                class="col-lg-6 col-md-12 col-sm-12 col-12 ps-lg-0">
                <div class="login_bg" data-aos="fade-left" data-aos-offset="0" data-aos-delay="0" data-aos-duration="1500">
                  <img src="images/login_img.png" width="100%"
                    alt="Login Background" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LoginForm;