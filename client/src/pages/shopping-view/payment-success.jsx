import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react"; // Assuming lucide-react is available

function PaymentSuccessPage() {
  const navigate = useNavigate();
  // const orderId = "12345ABC"; // Placeholder for order ID - replace with actual data if available

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md shadow-xl rounded-xl">
        <CardHeader className="items-center text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-t-xl">
          <div className="p-3 rounded-full bg-green-600 text-white w-16 h-16 flex items-center justify-center mb-4">
            <CheckCircle size={40} strokeWidth={2} />
          </div>
          <CardTitle className="text-3xl font-bold text-green-700 dark:text-green-400">
            Paiement Réussi !
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 dark:text-gray-400 mt-2">
            Votre commande a été traitée avec succès.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 space-y-4 text-center">
          <p className="text-md text-gray-700 dark:text-gray-300">
            Merci pour votre achat. Un e-mail de confirmation avec les détails
            de votre commande vous a été envoyé.
          </p>
          {/*
          {orderId && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Numéro de commande :</p>
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{orderId}</p>
            </div>
          )}
          */}
        </CardContent>

        <CardFooter className="flex flex-col items-center p-6 border-t border-gray-200 dark:border-gray-700 rounded-b-xl">
          <Button
            className="w-full max-w-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition duration-150 ease-in-out"
            onClick={() => navigate("/shop/account")}
          >
            Voir Mes Commandes
          </Button>
          <Button
            variant="link"
            className="mt-4 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500 font-medium"
            onClick={() => navigate("/shop/home")} // Or your shop homepage
          >
            Continuer mes achats
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default PaymentSuccessPage;
