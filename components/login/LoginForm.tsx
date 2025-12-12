// "use client";

// import { useState } from 'react';

// export default function LoginForm() {
//   const [phoneNumber, setPhoneNumber] = useState('');

//   const handleSubmit = () => {
//     console.log('Phone number:', phoneNumber);
//   };

//   return (
//     <main className="flex-1 flex flex-col  ">
//       <div className="flex bg-white justify-end  lg:bg-[#1642F0] lg:pt-16 items-center flex-col flex-1 lg:min-h-screen ">
//         <div className="flex bg-white rounded-3xl justify-center items-center pt-24 p-8 lg:p-16 lg:w-5/12">
//           <div className="flex flex-col w-full">
//             <div className="font-normal w-full">
//               <h1 className="text-gray-900 font-sans font-bold text-3xl text-center lg:text-5xl pb-5">
//                 Login or sign up
//               </h1>
              
//               <div className="mb-10 text-center">
//                 We&apos;ll text you to confirm your number. Standard message and data rates apply.
//                 <a 
//                   target="_blank" 
//                   rel="noopener noreferrer" 
//                   href="/privacy-policy"
//                 >
//                   <span className="font-bold hover:cursor-pointer underline text-blue-500">
//                     {' '}Privacy Policy.
//                   </span>
//                 </a>
//               </div>

//               <div className="input-container flex flex-col w-full items-start justify-start lg:px-6">
//                 <div className="capitalize text-gray-900 mb-2 tracking-wide w-full">
//                   Cell number
//                 </div>
                
//                 <div className="w-full">
//                   <div className="floating-input relative border-gray-400 focus-within:border-gray-900">
//                     <input
//                       type="text"
//                       placeholder=""
//                       name="phone_number"
//                       id="phone_number"
//                       value={phoneNumber}
//                       onChange={(e) => setPhoneNumber(e.target.value)}
//                       className="relative border rounded-md form-control block p-3 w-full text-sm appearance-none focus:outline-none bg-white focus-within:border-gray-400 border-gray-400"
//                     />
//                     <label htmlFor="phone_number" className="hidden"></label>
//                   </div>
//                 </div>
                
//                 <div className="font-normal text-gray-600 text-xs normal-case mt-2">
//                   SMS must be enabled
//                 </div>
//               </div>

//               <div className="flex flex-col mt-10 items-center justify-center lg:items-end lg:justify-end w-full lg:px-6">
//                 <div className="flex items-center justify-center w-full">
//                   <button
//                     onClick={handleSubmit}
//                     className="font-bold inline-flex text-center items-center text-md md:text-sm hover:cursor-pointer bg-blue-500 text-white text-sm capitalize rounded-full mt-3 justify-center w-full py-3 px-6 hover:bg-blue-600 transition-colors"
//                     type="button"
//                   >
//                     send code
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }


'use client';

import { ChevronRight, Eye } from 'lucide-react';
import { useState } from 'react';

// Mock function - replace with your actual implementation
const getAvailableCities = () => [
  { name: 'Lagos' },
  { name: 'Abuja' },
  { name: 'Port Harcourt' },
];

export default function CityList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const availableCities = getAvailableCities();
  const filteredAvailableCities = availableCities.filter((city) =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Login with your email
          </h1>
          <p className="text-gray-600">
            Don't have an Account?{' '}
            <a href="#" className="text-[#1642F0] font-semibold hover:underline">
              Create Account
            </a>
          </p>
        </div>

        <hr className="border-gray-200 mb-6" />

        {/* Email Input */}
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-700"
          />
        </div>

        {/* Password Input */}
        <div className="mb-4 relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-700"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between mb-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 border-2 rounded flex items-center justify-center mr-2 ${
                rememberMe
                  ? 'bg-[#1642F0] border-[#1642F0]'
                  : 'border-gray-300 bg-white'
              }`}
            >
              {rememberMe && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
              )}
            </div>
            <span className="text-gray-700">Remember me?</span>
          </label>

          <a href="#" className="text-gray-600 hover:text-gray-900">
            Forgot Password?
          </a>
        </div>

        {/* Login Button */}
        <button className="w-full bg-[#1642F0] hover:bg-[#103ff9] text-white font-semibold py-3 rounded-lg transition-colors">
          Login
        </button>
      </div>
    </div>
  );
}
