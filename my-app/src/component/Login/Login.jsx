import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../Context/UserContext';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const { setUserToken } = useUser();
  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('البريد غير صالح')
      .required('البريد الإلكتروني مطلوب'),
    password: Yup.string()
      .min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل')
      .required('كلمة المرور مطلوبة'),
  });

  const handleSubmit = async (values, { resetForm, setSubmitting, setErrors }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/auth/signin`,
        {
          email: values.email,
          password: values.password,
        }
      );
  
      if (response.data && response.data.message === 'success' && response.data.token) {
        resetForm();
        localStorage.setItem('userToken', response.data.token);
        setUserToken(response.data.token);
        const token = `Bearer ${response.data.token}`;
        localStorage.setItem('userToken', token); 
        setUserToken(token);
        navigate('/');
      } else if (response.data && response.data.error) {
        setErrors({ email: response.data.error || 'البريد الإلكتروني أو كلمة المرور غير صالحة' });
      } else {
        setErrors({ email: 'البريد الإلكتروني أو كلمة المرور غير صالحة' });
        console.error('Invalid login response:', response.data);
      }
      
  
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.data.errors) {
          const apiErrors = error.response.data.errors;
          setErrors({
            email: apiErrors.email || '',
            password: apiErrors.password || '',
          });
        } else {
          setErrors({ email: error.response.data.message || 'خطأ في البريد أو كلمة المرور' });
        }
      } else {
        setErrors({ email: 'حدث خطأ، حاول مرة أخرى' });
      }
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h2 className="mb-4 text-center">تسجيل الدخول</h2>
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">البريد الإلكتروني</label>
              <Field
                type="email"
                name="email"
                className="form-control"
                autoComplete="email"
                id="email"
              />
              <ErrorMessage name="email" component="div" className="text-danger" />
            </div>

            <div className="mb-3 position-relative">
              <label htmlFor="password" className="form-label">كلمة المرور</label>
              <Field
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="form-control"
                autoComplete="current-password"
                id="password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  top: '38px',
                  right: '10px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: '0.9rem',
                  color: '#007bff'
                }}
                tabIndex={-1}
              >
                {showPassword ? 'إخفاء' : 'عرض'}
              </button>
              <ErrorMessage name="password" component="div" className="text-danger mt-1" />
            </div>

            <div className="d-flex justify-content-between gap-2 mt-3">
              <button
                type="submit"
                className="btn btn-primary w-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'جاري الدخول...' : 'دخول'}
              </button>

              <Link to="/register" className="btn btn-outline-secondary w-50 text-center">
                ليس لديك حساب؟
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
