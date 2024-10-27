import React from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik'; 
import * as Yup from 'yup';
import FormLayout from '../layout/FormLayout';
import Button from '../../common/Button';
import InputField from '../../common/InputField';
import { FORM_CONSTANTS } from '../../constants/FormConstants';

const ForgotPassword = () => {
  const validationSchema = Yup.object().shape({
    admin_Email: Yup.string().email(FORM_CONSTANTS.INVALID_EMAIL).required(FORM_CONSTANTS.ENTER_EMAIL),
  });

  const formik = useFormik({ 
    initialValues: { admin_Email: '' },
    validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      const token = localStorage.getItem('token');
      console.log('Token:', token);
    // API request token
      console.log('Form values:', values);
      setSubmitting(false);
    }
  });

  return (
    <FormLayout>
      <div className="col-lg-6 col-md-12 col-sm-12 col-12 position-relative px-lg-5 px-md-4 px-4 d-flex align-items-center justify-content-center flex-column position-relative">
        <div className="login_data px-lg-4">
          <h2 data-aos="fade-right" data-aos-offset="0" data-aos-delay="0" data-aos-duration="1000">Forgot Password?</h2>
          <p className="m-0" data-aos="fade-right" data-aos-offset="0" data-aos-delay="0" data-aos-duration="1000">Enter your email to get a password reset link</p>
          <form onSubmit={formik.handleSubmit} className="mt-lg-4 pt-lg-2 mt-md-4">
            <InputField
              type="text"
              name="admin_Email"
              placeholder="Email "
              value={formik.values.admin_Email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.admin_Email && formik.touched.admin_Email ? formik.errors.admin_Email : null}
            />
            <div className="button mt-4 pt-lg-1 d-flex align-items-center gap-4">
              <Button 
          type= "submit" className="btn btn-primary" disabled={formik.isSubmitting}>Reset Password</Button>
            </div>
          </form>
          <hr className="my-5" />
          <div className="register text-center" data-aos="fade-right" data-aos-offset="0" data-aos-delay="0" data-aos-duration="1500">
            <p className="m-0">Remember your password? <Link to="/login">Log In</Link></p>
          </div>
        </div>
      </div>
      <div className="col-lg-6 col-md-12 col-sm-12 col-12 ps-lg-0">
        <div className="login_bg" data-aos="fade-left" data-aos-offset="0" data-aos-delay="0" data-aos-duration="1500">
          <img src="images/forgot-pwd.png" width="100%" alt="Forgot Password Background" />
        </div>
      </div>
    </FormLayout>
  );
};

export default ForgotPassword;
