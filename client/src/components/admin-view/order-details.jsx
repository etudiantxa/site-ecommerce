import { useState } from "react";
import CommonForm from "../common/form";
import { DialogContent, DialogTitle, DialogDescription, DialogHeader } from "../ui/dialog"; // Added DialogHeader, DialogTitle, DialogDescription
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { useToast } from "../ui/use-toast";
// import { Package, DollarSign, CalendarDays, CreditCard, CheckCircle, XCircle, Truck, UserCircle, Edit3 } from "lucide-react"; // Optional icons

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
    case "inprocess": // Assuming "inProcess" might be stored without space
    case "in process":
      return "bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100";
    case "inshipping": // Assuming "inShipping" might be stored without space
    case "in shipping":
      return "bg-purple-100 text-purple-800 dark:bg-purple-700 dark:text-purple-100";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100";
  }
};


function AdminOrderDetailsView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const { user } = useSelector((state) => state.auth); // Assuming user from auth has userName
  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleUpdateStatus(event) {
    event.preventDefault();
    const { status } = formData;
    if (!status) {
        toast({ title: "Veuillez sélectionner un statut.", variant: "destructive" });
        return;
    }

    dispatch(
      updateOrderStatus({ id: orderDetails?._id, orderStatus: status })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        setFormData(initialFormData);
        toast({
          title: data?.payload?.message,
        });
      }
    });
  }

  return (
    <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-lg shadow-xl p-0">
      <DialogHeader className="px-6 py-4 border-b dark:border-gray-700">
        <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Commande #{orderDetails?._id}
        </DialogTitle>
        <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
          Passée le {new Date(orderDetails?.orderDate).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
        </DialogDescription>
      </DialogHeader>

      <div className="p-6 space-y-6">
        {/* Section Résumé de la Commande */}
        <section>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Résumé de la commande</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div>
              <span className="font-medium text-gray-500 dark:text-gray-400">Montant Total : </span>
              <span className="text-gray-800 dark:text-gray-200 font-semibold">${orderDetails?.totalAmount?.toFixed(2)}</span>
            </div>
            <div>
              <span className="font-medium text-gray-500 dark:text-gray-400">Méthode de Paiement : </span>
              <span className="text-gray-800 dark:text-gray-200">{orderDetails?.paymentMethod}</span>
            </div>
            <div>
              <span className="font-medium text-gray-500 dark:text-gray-400">Statut Paiement : </span>
              <span className="text-gray-800 dark:text-gray-200">{orderDetails?.paymentStatus}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-gray-500 dark:text-gray-400 mr-2">Statut Commande : </span>
              <Badge className={`py-1 px-3 text-xs font-medium rounded-full ${getStatusBadgeStyle(orderDetails?.orderStatus)}`}>
                {orderDetails?.orderStatus}
              </Badge>
            </div>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Order Details</div>
            <ul className="grid gap-3">
              {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
                ? orderDetails?.cartItems.map((item) => (
                    <li className="flex items-center justify-between">
                      <span>Title: {item.title}</span>
                      <span>Quantity: {item.quantity}</span>
                      <span>Price: ${item.price}</span>
                    </li>
                  ))
                : null}
            </ul>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Shipping Info</div>
            <div className="grid gap-0.5 text-muted-foreground">
              <span>{user.userName}</span>
              <span>{orderDetails?.addressInfo?.address}</span>
              <span>{orderDetails?.addressInfo?.city}</span>
              <span>{orderDetails?.addressInfo?.pincode}</span>
              <span>{orderDetails?.addressInfo?.phone}</span>
              <span>{orderDetails?.addressInfo?.notes}</span>
            </div>
          </div>
        </div>

        <div>
          <CommonForm
            formControls={[
              {
                label: "Order Status",
                name: "status",
                componentType: "select",
                options: [
                  { id: "pending", label: "Pending" },
                  { id: "inProcess", label: "In Process" },
                  { id: "inShipping", label: "In Shipping" },
                  { id: "delivered", label: "Delivered" },
                  { id: "rejected", label: "Rejected" },
                ],
              },
            ]}
            formData={formData}
            setFormData={setFormData}
            buttonText={"Update Order Status"}
            onSubmit={handleUpdateStatus}
          />
        </div>
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;
