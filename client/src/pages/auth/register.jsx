import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { registerFormControls } from "@/config";
import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const initialState = {
  userName: "",
  email: "",
  password: "",
};

function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();
    dispatch(registerUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
        });
        navigate("/auth/login");
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
          Créer un nouveau compte
        </h1>
        <p className="text-blue-700 text-base animate-fade-in-up">
          Vous avez déjà un compte ?
          <Link
            className="font-semibold ml-2 text-blue-600 hover:underline"
            to="/auth/login"
          >
            Se connecter
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={registerFormControls}
        buttonText={<span className="font-bold">S'inscrire</span>}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        buttonClassName="bg-blue-600 hover:bg-blue-700 text-white font-bold"
      />
    </div>
  );
}

export default AuthRegister;
