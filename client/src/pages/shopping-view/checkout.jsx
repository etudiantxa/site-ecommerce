import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { Navigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymemntStart] = useState(false);
  const [isPayTechPaymentProcessing, setIsPayTechPaymentProcessing] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();

  console.log(currentSelectedAddress, "cartItems");

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  function handleInitiatePaypalPayment() {
    if (cartItems.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive",
      });

      return;
    }
    if (currentSelectedAddress === null) {
      toast({
        title: "Please select one address to proceed.",
        variant: "destructive",
      });

      return;
    }

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    dispatch(createNewOrder(orderData)).then((data) => {
      console.log(data, "sangam");
      if (data?.payload?.success) {
        setIsPaymemntStart(true);
      } else {
        setIsPaymemntStart(false);
      }
    });
  }

  async function handlePayTechPayment(paymentMethod) {
    if (!cartItems || cartItems.items.length === 0) {
      toast({
        title: "Votre panier est vide.",
        description: "Veuillez ajouter des articles pour continuer.",
        variant: "destructive",
      });
      return;
    }
    if (currentSelectedAddress === null) {
      toast({
        title: "Aucune adresse sélectionnée.",
        description: "Veuillez sélectionner une adresse de livraison.",
        variant: "destructive",
      });
      return;
    }

    // Ensure user data is available, especially phone, first name, and last name
    // For first_name and last_name, we might need to split user.name or use address details if available
    // For phone_number, prioritize address phone, then user phone
    const phoneNumber = currentSelectedAddress?.phone || user?.phone;
    if (!phoneNumber) {
        toast({
            title: "Numéro de téléphone manquant.",
            description: "Veuillez fournir un numéro de téléphone dans votre profil ou adresse de livraison.",
            variant: "destructive",
        });
        return;
    }

    // Attempt to get first and last names. This is a common simplification.
    // You might have more specific fields like user.firstName, user.lastName
    const nameParts = user?.name?.split(" ") || [];
    const firstName = user?.firstName || nameParts[0] || currentSelectedAddress?.name?.split(" ")[0] || "Client";
    const lastName = user?.lastName || nameParts.slice(1).join(" ") || currentSelectedAddress?.name?.split(" ").slice(1).join(" ") || "PayTech";


    const userPayload = {
      id: user?.id,
      email: user?.email,
      phone_number: phoneNumber,
      first_name: firstName,
      last_name: lastName,
    };

    const productPayload = {
      name: `Commande ${cartItems?._id || "N/A"}`,
      price: totalCartAmount,
      description: `Achat de ${cartItems.items.length} article(s) sur E-commerce`,
      payment_method: paymentMethod, // "Orange Money" or "Wave"
      internalRef: cartItems?._id || `TEMP_REF_${Date.now()}`,
    };

    setIsPayTechPaymentProcessing(true);

    try {
      const response = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: userPayload, product: productPayload }),
      });

      const data = await response.json();

      if (response.ok && data.success && data.paymentUrl) {
        // Potentially create order in your DB here if needed before redirect,
        // or handle it via IPN after PayTech confirmation.
        // For now, directly redirecting as per PayTech flow.
        window.location.href = data.paymentUrl;
      } else {
        toast({
          title: "Échec de l'initiation du paiement",
          description: data.message || data.error || "Une erreur est survenue.",
          variant: "destructive",
        });
        setIsPayTechPaymentProcessing(false);
      }
    } catch (error) {
      console.error("PayTech payment initiation error:", error);
      toast({
        title: "Erreur de communication",
        description: "Impossible de contacter le service de paiement. Veuillez réessayer.",
        variant: "destructive",
      });
      setIsPayTechPaymentProcessing(false);
    }
  }

  if (approvalURL) {
    window.location.href = approvalURL;
  }

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.map((item) => (
                <UserCartItemsContent cartItem={item} />
              ))
            : null}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">${totalCartAmount}</span>
            </div>
          </div>
          <div className="mt-4 w-full">
            <Button onClick={handleInitiatePaypalPayment} className="w-full">
              {isPaymentStart
                ? "Processing Paypal Payment..."
                : "Checkout with Paypal"}
            </Button>
          </div>
          {/* New Orange Money Button */}
          <div className="mt-4 w-full">
            <Button
              className="w-full bg-[#FF7F00] hover:bg-[#FF7F00]/90 text-white"
              onClick={() => handlePayTechPayment("Orange Money")}
              disabled={isPayTechPaymentProcessing || isPaymentStart}
            >
              {/* Placeholder for Orange Money Logo */}
              {isPayTechPaymentProcessing ? "Traitement..." : "Pay with Orange Money"}
            </Button>
          </div>

          {/* New Wave Button */}
          <div className="mt-4 w-full">
            <Button
              className="w-full bg-[#00A8E1] hover:bg-[#00A8E1]/90 text-white"
              onClick={() => handlePayTechPayment("Wave")}
              disabled={isPayTechPaymentProcessing || isPaymentStart}
            >
              {/* Placeholder for Wave Logo */}
              {isPayTechPaymentProcessing ? "Traitement..." : "Pay with Wave"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
