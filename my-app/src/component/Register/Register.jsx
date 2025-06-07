import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom'; 
import './Register.css'; 
import { useUser } from '../Context/UserContext';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
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
    try {
      console.log("Password:", values.password);
      console.log("Confirm Password:", values.confirmPassword);
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

      if (response.data && response.data.status === 'success' && response.data.data && response.data.data.token) {
        const token = response.data.data.token;
        localStorage.setItem('userToken', token);
        setUser(response.data.data.user);
        resetForm();
        navigate('/login', { state: { registered: true } });
      } else if (response.data && response.data.error) {
        setErrors({ general: response.data.error || 'حدث خطأ أثناء التسجيل. حاول مرة أخرى.' });
      } else {
        setErrors({ general: 'حدث خطأ أثناء التسجيل. حاول مرة أخرى.' });
      }
    } catch (error) {
      console.log(error.response.data);

      if (error.response) {
        const errorMsg = error.response.data.errors;
        if (errorMsg) {
          setErrors({
            email: errorMsg.email,
            phone: errorMsg.phone,
            name: errorMsg.name,
            password: errorMsg.password,
          });
        } else {
          setErrors({ general: error.response.data.message || 'خطأ غير معروف' });
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
            {errors.general && (
              <div className="alert alert-danger">{errors.general}</div>
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
            <Link to="/login" className="btn btn-outline-secondary w-20 text-center">
              هل لديك حساب بالفعل؟
            </Link> 
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Register;
