"use client";

import { useState } from 'react';

export default function LoginForm() {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = () => {
    console.log('Phone number:', phoneNumber);
  };

  return (
    <main className="flex-1 flex flex-col">
      <div className="flex bg-white lg:bg-blue-500 lg:pt-16 items-center flex-col flex-1">
        <div className="flex bg-white rounded-3xl justify-center items-center p-8 lg:p-16 lg:w-5/12">
          <div className="flex flex-col w-full">
            <div className="font-serif font-normal w-full">
              <h1 className="text-gray-900 font-sans font-bold text-3xl text-center lg:text-5xl pb-5">
                Login or sign up
              </h1>
              
              <div className="mb-10 text-center">
                We&apos;ll text you to confirm your number. Standard message and data rates apply.
                <a 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  href="/privacy-policy"
                >
                  <span className="font-bold hover:cursor-pointer underline text-blue-500">
                    {' '}Privacy Policy.
                  </span>
                </a>
              </div>

              <div className="input-container flex flex-col w-full items-start justify-start lg:px-6">
                <div className="capitalize text-gray-900 mb-2 tracking-wide w-full">
                  Cell number
                </div>
                
                <div className="w-full">
                  <div className="floating-input relative border-gray-400 focus-within:border-gray-900">
                    <input
                      type="text"
                      placeholder=""
                      name="phone_number"
                      id="phone_number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="relative border rounded-md form-control block p-3 w-full text-sm appearance-none focus:outline-none bg-white focus-within:border-gray-400 border-gray-400"
                    />
                    <label htmlFor="phone_number" className="hidden"></label>
                  </div>
                </div>
                
                <div className="font-normal text-gray-600 text-xs normal-case mt-2">
                  SMS must be enabled
                </div>
              </div>

              <div className="flex flex-col mt-10 items-center justify-center lg:items-end lg:justify-end w-full lg:px-6">
                <div className="flex items-center justify-center w-full">
                  <button
                    onClick={handleSubmit}
                    className="font-bold inline-flex text-center items-center text-md md:text-sm hover:cursor-pointer bg-blue-500 text-white text-sm capitalize rounded-full mt-3 justify-center w-full py-3 px-6 hover:bg-blue-600 transition-colors"
                    type="button"
                  >
                    send code
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}