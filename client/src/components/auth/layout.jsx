import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Left side (illustration + welcome) */}
      <div className="hidden lg:flex items-center justify-center w-1/2 px-12 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
        <div className="max-w-md space-y-6 text-center animate-fade-in-down">
          <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-lg animate-fade-in">
            Bienvenue sur{" "}
            <span className="text-blue-300">ECommerce Shopping</span>
          </h1>
          <p className="text-blue-100 text-lg animate-fade-in-up">
            Découvrez les meilleurs produits et profitez d'une expérience d'achat
            fluide et agréable.
          </p>
        </div>
      </div>
      {/* Right side (form) */}
      <div className="flex flex-1 items-center justify-center bg-white/80 px-4 py-12 sm:px-6 lg:px-8 shadow-2xl rounded-l-3xl animate-fade-in">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
      {/* Animations CSS */}
      <style>
        {`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px);}
            to { opacity: 1; transform: translateY(0);}
          }
          @keyframes fade-in-down {
            from { opacity: 0; transform: translateY(-40px);}
            to { opacity: 1; transform: translateY(0);}
          }
          @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(40px);}
            to { opacity: 1; transform: translateY(0);}
          }
          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0);}
            50% { transform: translateY(-12px);}
          }
          .animate-fade-in { animation: fade-in 0.8s both; }
          .animate-fade-in-down { animation: fade-in-down 1s both; }
          .animate-fade-in-up { animation: fade-in-up 1.2s both; }
          .animate-bounce-slow { animation: bounce-slow 2.5s infinite; }
        `}
      </style>
    </div>
  );
}

export default AuthLayout;