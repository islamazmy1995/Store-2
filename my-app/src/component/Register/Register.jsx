import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import { useUser } from '../Context/UserContext';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const { setUserToken, loadUserCart } = useUser();
  const [successMessage, setSuccessMessage] = useState('');
  const [generalError, setGeneralError] = useState('');

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل')
      .required('الاسم مطلوب'),
    phone: Yup.string()
      .matches(/^01[0-9]{9}$/, 'رقم الهاتف غير صالح، يجب أن يكون 11 رقم ويبدأ بـ 01')
      .required('رقم الهاتف مطلوب'),
    email: Yup.string() 
      .email('البريد غير صالح')
      .required('البريد الإلكتروني مطلوب'),
    password: Yup.string()
      .min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل')
      .required('كلمة المرور مطلوبة'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'كلمة المرور غير متطابقة')
      .required('تأكيد كلمة المرور مطلوب'),
  });

  const handleSubmit = async (values, { resetForm, setSubmitting, setErrors }) => {
    setGeneralError('');
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/auth/signup`,
        {
          name: values.name,
          email: values.email,
          password: values.password,
          phone: values.phone,
          rePassword: values.confirmPassword
        }
      );

      if (response.data?.status === 'success' && response.data.data?.token) {
        const token = response.data.data.token;
        localStorage.setItem('userToken', `Bearer ${token}`);
        setUserToken(token);
        loadUserCart(token);
        resetForm();
        setSuccessMessage('تم التسجيل بنجاح! سيتم توجيهك إلى صفحة تسجيل الدخول.');
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 1500);
      
      } else if (response.data?.error || response.data?.message === 'error') {
        setErrors({ general: response.data.error });
      } else if (response.data?.message) {
        setErrors({ general: response.data.message });
      } else {
        setErrors({ general: 'حدث خطأ أثناء التسجيل. حاول مرة أخرى.' });
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          setGeneralError('البريد الإلكتروني مسجل مسبقاً. هل تريد ');
        } else if (error.response.data?.errors) {
          const errorMsg = error.response.data.errors;
          setErrors({ 
            email: errorMsg.email || '',
            phone: errorMsg.phone || '',
            name: errorMsg.name || '',
            password: errorMsg.password || '',
            confirmPassword: errorMsg.confirmPassword || ''
          });
        } else if (error.response.data?.message) {
          setErrors({ general: error.response.data.message });
        } else {
          setErrors({ general: 'خطأ غير معروف' });
        }
      } else {
        setErrors({ general: 'فشل الاتصال بالخادم. حاول لاحقًا.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">تسجيل حساب جديد</h2>
      <Formik
        initialValues={{
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          phone: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors }) => (
          <Form>
            {successMessage && (
              <div className="alert alert-success">{successMessage}</div>
            )}
            {(errors.general || generalError) && (
              <div className="alert alert-danger">
                {generalError ? (
                  <>
                    {generalError}
                    <button
                      type="button"
                      className="btn btn-link p-0"
                      onClick={() => navigate('/login')}
                    >
                      تسجيل الدخول
                    </button>
                    {'؟'}
                  </>
                ) : (
                  errors.general
                )}
              </div>
            )}

            <div className="mb-3">
              <label htmlFor="name" className="form-label">الاسم</label>
              <Field type="text" name="name" className="form-control" />
              <ErrorMessage name="name" component="div" className="text-danger" />
            </div>

            <div className="mb-3">
              <label htmlFor="phone" className="form-label">رقم الهاتف</label>
              <Field type="text" name="phone" className="form-control" />
              <ErrorMessage name="phone" component="div" className="text-danger" />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">البريد الإلكتروني</label>
              <Field type="email" name="email" className="form-control" />
              <ErrorMessage name="email" component="div" className="text-danger" />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">كلمة المرور</label>
              <Field type="password" name="password" className="form-control" />
              <ErrorMessage name="password" component="div" className="text-danger" />
            </div>

            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">تأكيد كلمة المرور</label>
              <Field type="password" name="confirmPassword" className="form-control" />
              <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'جاري التسجيل...' : 'تسجيل'}
            </button>

            <button
              type="button"
              className="btn btn-outline-secondary ms-3"
              onClick={() => navigate('/login')}
            >
              هل لديك حساب بالفعل؟
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Register;
