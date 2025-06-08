import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../Context/UserContext';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const navigate = useNavigate();
  const { setUserToken } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('البريد غير صالح')
      .required('البريد الإلكتروني مطلوب'),
    password: Yup.string()
      .min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل')
      .required('كلمة المرور مطلوبة'),
  });

  const handleSubmit = async (values, { resetForm, setErrors }) => {
    setError('');
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/auth/signin`,
        {
          email: values.email,
          password: values.password
        }
      );

      if (response.data?.status === 'success' && response.data.token) {
        resetForm();
        const token = `Bearer ${response.data.token}`;
        setUserToken(token);
        navigate('/');
      } else {
        setError('البريد الإلكتروني أو كلمة المرور غير صالحة');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.response?.data) {
        if (error.response.data.errors) {
          // Handle validation errors
          const apiErrors = error.response.data.errors;
          const formErrors = {};
          if (apiErrors.email) formErrors.email = apiErrors.email;
          if (apiErrors.password) formErrors.password = apiErrors.password;
          setErrors(formErrors);
        } else if (error.response.data.message) {
          // Handle API error message
          setError(error.response.data.message);
        } else {
          setError('حدث خطأ غير متوقع');
        }
      } else {
        setError('تعذر الاتصال بالخادم. يرجى المحاولة مرة أخرى لاحقاً');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h2 className="mb-4 text-center">تسجيل الدخول</h2>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">البريد الإلكتروني</label>
              <Field
                type="email"
                name="email"
                className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`}
                autoComplete="email"
                id="email"
                placeholder="أدخل بريدك الإلكتروني"
              />
              <ErrorMessage name="email" component="div" className="invalid-feedback" />
            </div>

            <div className="mb-3 position-relative">
              <label htmlFor="password" className="form-label">كلمة المرور</label>
              <Field
                type={showPassword ? 'text' : 'password'}
                name="password"
                className={`form-control ${errors.password && touched.password ? 'is-invalid' : ''}`}
                autoComplete="current-password"
                placeholder="أدخل كلمة المرور"
                id="password"
              />
              <button
                type="button"
                className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-muted"
                onClick={() => setShowPassword(!showPassword)}
                style={{ zIndex: 10, textDecoration: 'none' }}
                aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
              <ErrorMessage name="password" component="div" className="invalid-feedback" />
            </div>

            <div className="mb-3 form-check">
              <Field 
                type="checkbox" 
                id="rememberMe" 
                name="rememberMe" 
                className="form-check-input"
              />
              <label className="form-check-label" htmlFor="rememberMe">
                تذكرني
              </label>
            </div>

            <div className="d-grid gap-2">
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    جاري تسجيل الدخول...
                  </>
                ) : 'تسجيل الدخول'}
              </button>
            </div>

            <div className="mt-3 text-center">
              <p className="mb-1">
                <Link to="/forgot-password" className="text-primary">
                  نسيت كلمة المرور؟
                </Link>
              </p>
              <p className="mb-0">
                ليس لديك حساب؟{' '}
                <Link to="/register" className="text-primary fw-bold">
                  إنشاء حساب جديد
                </Link>
              </p>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
