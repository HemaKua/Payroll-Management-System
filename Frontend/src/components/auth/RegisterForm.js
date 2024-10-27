import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import FormLayout from '../layout/FormLayout';
import InputField from '../../common/InputField';
import Button from '../../common/Button';
import { FORM_CONSTANTS } from '../../constants/FormConstants';

const RegisterForm = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init();
  }, []);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(FORM_CONSTANTS.ENTER_NAME),
  admin_Email: Yup.string().email(FORM_CONSTANTS.INVALID_EMAIL).required(FORM_CONSTANTS.ENTER_EMAIL),
    password: Yup.string().min(6, FORM_CONSTANTS.PASSWORD_MIN_LENGTH).required(FORM_CONSTANTS.ENTER_PASSWORD),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], FORM_CONSTANTS.CONFIRM_PASSWORD)
      .required('Confirm the password'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      admin_Email: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/PMS/auth/tenants-signup`, values);
        console.log('Registration response:', response.data);
        setSubmitting(false);
        navigate('/confirmation'); 
      } catch (error) {
        console.error('Error submitting form:', error.message);
        setSubmitting(false);
      }
    },
  });

  return (
    <FormLayout>
      <div className="col-lg-6 col-md-12 col-sm-12 col-12 position-relative px-lg-5 px-md-4 px-4 d-flex align-items-center justify-content-center flex-column position-relative">
        <div className="logoadmin" data-aos="fade-right" data-aos-offset="0" data-aos-delay="0" data-aos-duration="1500">
          <img src="images/logo.png" alt="Logo" />
        </div>
        <div className="login_data px-lg-4">
          <h2 data-aos="fade-right" data-aos-offset="0" data-aos-delay="0" data-aos-duration="1000">Register</h2>
          <p className="m-0" data-aos="fade-right" data-aos-offset="0" data-aos-delay="0" data-aos-duration="1000">Access to our dashboard</p>
          <form onSubmit={formik.handleSubmit} className="mt-lg-4 pt-lg-2 mt-md-4">
            <InputField
              type="text"
              name="name"
              placeholder="Name"
              autocomplete="off"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.name && formik.touched.name ? formik.errors.name : null}
            />
            <InputField
              type="text"
              name="admin_Email"
              placeholder="Email"
              value={formik.values.admin_Email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.admin_Email && formik.touched.admin_Email ? formik.errors.admin_Email : null}
            />
            <InputField
              type="password"
              name="password"
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.password && formik.touched.password ? formik.errors.password : null}
            />
            <InputField
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.confirmPassword && formik.touched.confirmPassword ? formik.errors.confirmPassword : null}
            />
            <div className="button mt-4 pt-lg-1 d-flex align-items-center gap-4">
              <Button 
              type="submit" className="btn btn-primary" disabled={formik.isSubmitting}>Register</Button>
            </div>
          </form>
          <hr className="my-5" />
          <div className="register text-center" data-aos="fade-right" data-aos-offset="0" data-aos-delay="0" data-aos-duration="1500">
            <p className="m-0">Already Registered? <Link to="/login">Log In</Link></p>
          </div>
        </div>
      </div>
      <div className="col-lg-6 col-md-12 col-sm-12 col-12 ps-lg-0">
        <div className="login_bg" data-aos="fade-left" data-aos-offset="0" data-aos-delay="0" data-aos-duration="1500">
          <img src="images/register.png" width="100%" alt="Register Background" />
        </div>
      </div>
    </FormLayout>
  );
};

export default RegisterForm;
