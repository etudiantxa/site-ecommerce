import { useState } from "react";
import CommonForm from "../common/form";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { useToast } from "../ui/use-toast";
import {
  FaBoxOpen,
  FaCalendarAlt,
  FaMoneyBill,
  FaUser,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaStickyNote,
} from "react-icons/fa";

const initialFormData = {
  status: "",
};

function AdminOrderDetailsView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleUpdateStatus(event) {
    event.preventDefault();
    const { status } = formData;

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
    <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-auto bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-2xl shadow-2xl p-8 border-0">
      <div className="grid gap-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-2">
          <div className="bg-blue-100 rounded-full p-4 flex items-center justify-center shadow">
            <FaBoxOpen className="text-blue-500 text-3xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-blue-700">
              Détails de la commande
            </h2>
            <span className="text-sm text-gray-500">
              ID: {orderDetails?._id}
            </span>
          </div>
        </div>
        <Separator />

        {/* Order Info */}
        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-blue-400" />
            <span className="font-medium">Date :</span>
            <span>{orderDetails?.orderDate.split("T")[0]}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaMoneyBill className="text-green-500" />
            <span className="font-medium">Total :</span>
            <span className="text-lg font-semibold text-green-700">
              ${orderDetails?.totalAmount}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FaMoneyBill className="text-purple-500" />
            <span className="font-medium">Paiement :</span>
            <span>{orderDetails?.paymentMethod}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaMoneyBill className="text-yellow-500" />
            <span className="font-medium">Statut :</span>
            <Badge
              className={`rounded-full px-4 py-1 text-white ${
                orderDetails?.paymentStatus === "Paid"
                  ? "bg-green-500"
                  : "bg-gray-400"
              }`}
            >
              {orderDetails?.paymentStatus}
            </Badge>
          </div>
          <div className="flex items-center gap-2 col-span-2">
            <span className="font-medium">Statut de la commande :</span>
            <Badge
              className={`rounded-full px-4 py-1 text-white ${
                orderDetails?.orderStatus === "confirmed"
                  ? "bg-green-500"
                  : orderDetails?.orderStatus === "rejected"
                  ? "bg-red-600"
                  : "bg-blue-500"
              }`}
            >
              {orderDetails?.orderStatus}
            </Badge>
          </div>
        </div>
        <Separator />

        {/* Cart Items */}
        <div>
          <div className="text-lg font-semibold mb-2 text-blue-700">
            Articles commandés
          </div>
          <ul className="grid gap-3">
            {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
              ? orderDetails?.cartItems.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between bg-white rounded-lg shadow px-4 py-2 border border-blue-100"
                  >
                    <span className="font-medium text-blue-900 flex items-center gap-1">
                      🛒 {item.title}
                    </span>
                    <span className="text-gray-600">Qté: {item.quantity}</span>
                    <span className="text-green-700 font-semibold">
                      ${item.price}
                    </span>
                  </li>
                ))
              : <span className="text-gray-400">Aucun article</span>}
          </ul>
        </div>
        <Separator />

        {/* Shipping Info */}
        <div className="bg-gradient-to-r from-blue-50 via-white to-blue-100 rounded-2xl shadow-lg flex flex-col gap-3 p-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <FaMapMarkerAlt className="text-blue-600 text-2xl" />
            <span className="font-bold text-blue-800 text-lg">
              Infos de livraison
            </span>
          </div>
          <div className="grid gap-2 text-gray-700 text-base pl-2">
            <div className="flex items-center gap-2">
              <FaUser className="text-blue-400" />
              <span className="font-semibold">Nom :</span>
              <span>{orderDetails?.user?.userName}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-green-500" />
              <span className="font-semibold">Adresse :</span>
              <span>{orderDetails?.addressInfo?.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-purple-500" />
              <span className="font-semibold">Ville :</span>
              <span>{orderDetails?.addressInfo?.city}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaStickyNote className="text-yellow-500" />
              <span className="font-semibold">Code postal :</span>
              <span>{orderDetails?.addressInfo?.pincode}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaPhoneAlt className="text-pink-500" />
              <span className="font-semibold">Téléphone :</span>
              <span>{orderDetails?.addressInfo?.phone}</span>
            </div>
            {orderDetails?.addressInfo?.notes && (
              <div className="flex items-center gap-2">
                <FaStickyNote className="text-orange-400" />
                <span className="font-semibold">Notes :</span>
                <span>{orderDetails?.addressInfo?.notes}</span>
              </div>
            )}
          </div>
        </div>
        <Separator />

        {/* Update Status Form */}
        <div className="mt-4">
          <CommonForm
            formControls={[
              {
                label: "Statut de la commande",
                name: "status",
                componentType: "select",
                options: [
                  { id: "pending", label: "En attente" },
                  { id: "inProcess", label: "En cours" },
                  { id: "inShipping", label: "En livraison" },
                  { id: "delivered", label: "Livrée" },
                  { id: "rejected", label: "Rejetée" },
                ],
              },
            ]}
            formData={formData}
            setFormData={setFormData}
            buttonClassName="bg-blue-600 hover:bg-blue-700 text-white font-bold"
            buttonText={
              <span className="flex items-center gap-2">
                <FaBoxOpen /> Mettre à jour le statut
              </span>
            }
            onSubmit={handleUpdateStatus}
          />
        </div>
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;
