import React from "react";

const DefaultProfileImg = ({ size }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="fill-current text-white h-full "
      enableBackground="new 0 0 512 512"
      version="1.1"
      viewBox="0 0 512 512"
      xmlSpace="preserve"
    >
      <path d="M256 31C131.7 31 31 131.7 31 256s100.7 225 225 225 225-100.7 225-225S380.3 31 256 31zm0 87.1c44.1 0 79.8 35.7 79.8 79.8s-35.7 79.8-79.8 79.8-79.8-35.7-79.8-79.8 35.7-79.8 79.8-79.8zm0 312.1c-53.3 0-101-24.1-132.9-61.9 17.1-32.1 50.4-54.3 89.4-54.3 2.2 0 4.4.4 6.4 1 11.8 3.8 24.1 6.3 37.1 6.3s25.4-2.4 37.1-6.3c2.1-.6 4.3-1 6.4-1 38.9 0 72.3 22.1 89.4 54.3-31.9 37.8-79.6 61.9-132.9 61.9z"></path>
    </svg>
  );
};

export default DefaultProfileImg;
