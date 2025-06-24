import { useState } from "react";
import CommonForm from "../common/form";
import { DialogContent, DialogTitle, DialogDescription, DialogHeader } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { useToast } from "../ui/use-toast";

const initialFormData = {
  status: "",
};

const getStatusBadgeStyle = (status) => {
  switch (status?.toLowerCase()) {
    case "confirmed":
    case "delivered":
      return "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100";
    case "rejected":
      return "bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100";
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100";
    case "inprocess":
    case "in process":
      return "bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100";
    case "inshipping":
    case "in shipping":
      return "bg-purple-100 text-purple-800 dark:bg-purple-700 dark:text-purple-100";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100";
  }
};

function AdminOrderDetailsView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleUpdateStatus(event) {
    event.preventDefault();
    const { status } = formData;
    if (!status) {
        toast({ title: "Veuillez sélectionner un statut.", variant: "destructive", duration: 3000 });
        return;
    }

    dispatch(
      updateOrderStatus({ id: orderDetails?._id, orderStatus: status })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        // dispatch(getAllOrdersForAdmin()); // Consider if this is immediately needed or can be deferred
        setFormData(initialFormData);
        toast({
          title: data?.payload?.message || "Statut de la commande mis à jour.",
          variant: "default",
          duration: 3000,
        });
      } else {
        toast({
            title: data?.payload?.message || "Erreur lors de la mise à jour.",
            variant: "destructive",
            duration: 3000,
        })
      }
    });
  }

  return (
    <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl p-0">
      <DialogHeader className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
        <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Commande #{orderDetails?._id}
        </DialogTitle>
        <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
          Passée le {new Date(orderDetails?.orderDate).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
        </DialogDescription>
      </DialogHeader>

      <div className="p-6 space-y-6">
        <section aria-labelledby="order-summary-heading">
          <h3 id="order-summary-heading" className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
            Résumé de la commande
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Montant Total :</p>
              <p className="font-semibold text-gray-700 dark:text-gray-200">${orderDetails?.totalAmount?.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Méthode de Paiement :</p>
              <p className="font-semibold text-gray-700 dark:text-gray-200">{orderDetails?.paymentMethod}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Statut Paiement :</p>
              <p className="font-semibold text-gray-700 dark:text-gray-200">{orderDetails?.paymentStatus}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-gray-500 dark:text-gray-400 mb-1">Statut Commande :</p>
              <Badge className={`py-1 px-2.5 text-xs font-medium rounded-md self-start ${getStatusBadgeStyle(orderDetails?.orderStatus)}`}>
                {orderDetails?.orderStatus}
              </Badge>
            </div>
          </div>
        </section>

        <Separator className="dark:bg-gray-700" />

        <section aria-labelledby="ordered-items-heading">
          <h3 id="ordered-items-heading" className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
            Articles commandés
          </h3>
          {orderDetails?.cartItems && orderDetails.cartItems.length > 0 ? (
            <ul className="space-y-3">
              {orderDetails.cartItems.map((item) => (
                <li key={item._id || item.productId} className="flex items-start justify-between bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg shadow-sm">
                  <div className="flex-grow pr-4">
                    <p className="font-semibold text-gray-800 dark:text-gray-100">{item.title}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">Quantité: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 whitespace-nowrap">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">Aucun article dans cette commande.</p>
          )}
        </section>

        <Separator className="dark:bg-gray-700" />

        <section aria-labelledby="shipping-info-heading">
          <h3 id="shipping-info-heading" className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
            Informations de livraison
          </h3>
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-sm space-y-1 shadow-sm">
            <p className="font-semibold text-gray-800 dark:text-gray-100">{orderDetails?.addressInfo?.name || user?.userName || 'N/A'}</p>
            <p className="text-gray-700 dark:text-gray-300">{orderDetails?.addressInfo?.address}</p>
            <p className="text-gray-700 dark:text-gray-300">
              {orderDetails?.addressInfo?.city}, {orderDetails?.addressInfo?.pincode}
            </p>
            <p className="text-gray-700 dark:text-gray-300">Tél : {orderDetails?.addressInfo?.phone}</p>
            {orderDetails?.addressInfo?.notes && (
              <p className="mt-2 text-xs italic text-gray-600 dark:text-gray-400">
                Notes : {orderDetails?.addressInfo?.notes}
              </p>
            )}
          </div>
        </section>

        <Separator className="dark:bg-gray-700" />

        <section aria-labelledby="update-status-heading">
          <h3 id="update-status-heading" className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
            Mettre à jour le statut
          </h3>
          <CommonForm
            formControls={[
              {
                label: "Nouveau statut de la commande",
                name: "status",
                componentType: "select",
                options: [
                  { id: "", label: "Sélectionner un statut..." },
                  { id: "pending", label: "En attente" },
                  { id: "confirmed", label: "Confirmée"},
                  { id: "inProcess", label: "En traitement" },
                  { id: "inShipping", label: "En expédition" },
                  { id: "delivered", label: "Livrée" },
                  { id: "rejected", label: "Rejetée" },
                ],
                placeholder: "Sélectionner un statut",
              },
            ]}
            formData={formData}
            setFormData={setFormData}
            buttonText={"Mettre à jour"}
            onSubmit={handleUpdateStatus}
            buttonClassName="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm"
            formClassName="space-y-4"
          />
        </section>
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;
