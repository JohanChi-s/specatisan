import React from "react";

const AuthErrorPage = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Authentication Error
        </h1>
        <p className="text-gray-700 mb-4">
          There was an error during Google authentication. Please try again.
        </p>
        <button
          onClick={() => (window.location.href = "/")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default AuthErrorPage;
