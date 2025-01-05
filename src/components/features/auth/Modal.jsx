import React from "react";

const Modal = ({ title, children, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 " style={{zIndex:1600}}>
      <div className="bg-white z-50 px-16 py-16 rounded-lg shadow-lg w-[90%] max-w-6xl relative max-h-[95vh] overflow-y-auto">
        {/* Modal close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black text-lg hover:text-gray-700 focus:outline-none"
        >
          ✖
        </button>

        {/* Modal title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-center">{title}</h2>
        </div>

        {/* Modal content */}
        <div className="space-y-8">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
