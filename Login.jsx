import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
  return (
<motion.div
      initial={{ opacity: 0, y: 30 }}      // on mount
      animate={{ opacity: 1, y: 0 }}       // animate to
      exit={{ opacity: 0, y: -30 }}        // on unmount
      transition={{ duration: 0.5 }}
>
    <div className="w-full min-h-screen flex justify-center items-center bg-gray-50 flex-col">
        <h1 className='text-4xl mb-5 font-bold'>Hospital Management <span className='text-[#FF445A]'>System</span> </h1>
      <div className="w-full max-w-4xl flex flex-col md:flex-row shadow-2xl rounded-2xl overflow-hidden bg-white">

        {/* doctor */}
        <div className="w-full md:w-1/2 bg-[#912D29] text-white flex flex-col justify-center items-center p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-center">Hello, Doctor!</h1>
          <p className="text-center text-sm md:text-base mt-2">
            Enter your personal details and <br /> start your journey with us
          </p>
          <Link
            to="/doctor"
            className="mt-6 px-6 py-2 border border-white rounded-full hover:bg-white hover:text-[#FF445A] transition"
          >
            Register
          </Link>
        </div>

        {/* Admin*/}
        <div className="w-full md:w-1/2 bg-[#DC8279] text-white flex flex-col justify-center items-center p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-center">Hello, Admin!</h1>
          <p className="text-center text-sm md:text-base mt-2">
            Enter your personal details and <br /> start your journey with us
          </p>
          <Link
            to="/admin"
            className="mt-6 px-6 py-2 border border-white rounded-full hover:bg-white hover:text-[#FF445A] transition"
          >
            Register
          </Link>
        </div>

        {/* user */}
        <div className="w-full md:w-1/2 bg-[#B2D0C6] text-gray-700 flex flex-col justify-center items-center p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-center">Hello, User!</h1>
          <p className="text-center text-sm md:text-base mt-2">
            Enter your personal details and <br /> start your journey with us
          </p>
          <Link
            to="/user"
            className="mt-6 px-6 py-2 border border-white rounded-full hover:bg-white hover:text-[#82c2ad] transition"
          >
            Register
          </Link>
        </div>

      </div>
    </div>
</motion.div>
  );
};

export default Login;
