import "../App.css";
import PropTypes from "prop-types";
import { useState } from "react";
export default function ModalSuccess({
  title,
  message,
  show,
  goTo,
  email,
  password,
}) {
  ModalSuccess.propTypes = {
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    show: PropTypes.func.isRequired,
    goTo: PropTypes.string,
    email: PropTypes.string,
    password: PropTypes.string,
  };

  const [modifyPreferences, setModifyPreferences] = useState(false);

  const SignUpgoTo = () => {
    const data = {
      email: email,
      contrasena: password,
    };

    fetch("http://localhost:3001/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          alert(res.error);
        } else {
          console.log(res.token);
          localStorage.setItem("token", res.token);
          if (modifyPreferences) {
            window.location.href = "/first-time-setting-preferences";
          } else {
            window.location.href = "/dashboard";
          }
        }
      });
  };

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900"
                  id="modal-title"
                >
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{message}</p>
                  {goTo === "preferences" && (
                    <p className="text-sm text-gray-500">
                      ¿Deseas configurar tus preferencias?
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {goTo === "preferences" && (
              <div>
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#de5466] text-base font-medium text-white hover:bg-[#e02841] focus:outline-none focus:ring-2 focus:ring-offset-2  sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setModifyPreferences(false);
                    SignUpgoTo();
                  }}
                >
                  No
                </button>
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setModifyPreferences(true);
                    SignUpgoTo();
                  }}
                >
                  Si
                </button>
              </div>
            )}
            {goTo === null && (
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => {
                  show(false);
                }}
              >
                Aceptar
              </button>
            )}
            {goTo === "dashboard" && (
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={goToDashboard}
              >
                Aceptar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
