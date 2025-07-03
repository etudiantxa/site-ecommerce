import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();

  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  return (
    <SheetContent className="sm:max-w-md flex flex-col h-full">
      <SheetHeader>
        <SheetTitle className="text-2xl font-extrabold text-blue-700">
          🛒 Votre panier
        </SheetTitle>
      </SheetHeader>
      <div className="mt-8 space-y-4 flex-1 overflow-y-auto rounded-lg shadow-inner bg-blue-50/40 p-2">
        {cartItems && cartItems.length > 0 ? (
          cartItems.map((item) => (
            <UserCartItemsContent key={item.productId || item._id} cartItem={item} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-12 text-blue-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 17v-2a4 4 0 018 0v2M9 17H7a2 2 0 01-2-2v-5a2 2 0 012-2h10a2 2 0 012 2v5a2 2 0 01-2 2h-2M9 17v2a2 2 0 002 2h2a2 2 0 002-2v-2"
              />
            </svg>
            <span className="text-lg font-semibold">
              Votre panier est vide
            </span>
            <span className="text-sm text-gray-400 mt-1">
              Ajoutez des produits pour commencer vos achats !
            </span>
          </div>
        )}
      </div>
      <hr className="my-6 border-blue-100" />
      <div className="space-y-4">
        <div className="flex justify-between items-center text-lg font-bold">
          <span>Total</span>
          <span className="text-blue-700">
            ${totalCartAmount.toFixed(2)}
          </span>
        </div>
        <Button
          onClick={() => {
            navigate("/shop/checkout");
            setOpenCartSheet(false);
          }}
          className="w-full mt-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 text-lg shadow transition"
          size="lg"
          disabled={!cartItems || cartItems.length === 0}
        >
          Passer à la caisse
        </Button>
      </div>
    </SheetContent>
  );
}

export default UserCartWrapper;
