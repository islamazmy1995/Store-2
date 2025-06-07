import React from 'react'

const Logo = () => {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ cursor: 'pointer' }}
    >
      <circle cx="32" cy="32" r="30" stroke="#0d6efd" strokeWidth="4" />
      <path
        d="M20 32 L28 44 L44 20"
        stroke="#0d6efd"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default Logo