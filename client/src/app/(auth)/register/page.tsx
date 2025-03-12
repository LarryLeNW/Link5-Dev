'use client'

import RegisterForm from '@/app/(auth)/register/register-form'

const RegisterPage = () => {
  return (
    <div
      className="relative h-screen flex justify-center items-center bg-cover bg-center"
      style={{ backgroundImage: 'url("/images/bg-auth.jpg")' }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md"></div>
      <div className="relative z-10 bg-white/60 backdrop-blur-lg p-8 rounded-2xl shadow-lg w-1/2 mx-auto flex flex-col items-center justify-center">
        <h1 className=" font-semibold text-center mb-4 text-yellow-900 text-3xl">Đăng ký</h1>
        <RegisterForm />
      </div>
    </div>
  )
}

export default RegisterPage
