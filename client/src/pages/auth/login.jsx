import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();

    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
        });
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-8 bg-white/90 rounded-2xl shadow-xl p-8 border border-blue-100 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-blue-900 drop-shadow animate-fade-in-down">
          Connexion à votre compte
        </h1>
        <p className="text-blue-700 text-base animate-fade-in-up">
          Pas encore de compte ?
          <Link
            className="font-semibold ml-2 text-blue-600 hover:underline"
            to="/auth/register"
          >
            Créer un compte
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={loginFormControls}
        buttonText={<span className="font-bold">Se connecter</span>}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        buttonClassName="bg-blue-600 hover:bg-blue-700 text-white font-bold"
      />
    </div>
  );
}

export default AuthLogin;
