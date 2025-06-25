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
    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-auto bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-2xl shadow-2xl p-8 border-0">
      <div className="grid gap-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-2">
          <FaBoxOpen className="text-blue-500 text-3xl" />
          <div>
            <h2 className="text-2xl font-bold text-blue-700">Order Details</h2>
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
            <span className="font-medium">Date:</span>
            <span>{orderDetails?.orderDate.split("T")[0]}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaMoneyBill className="text-green-500" />
            <span className="font-medium">Total:</span>
            <span className="text-lg font-semibold text-green-700">
              ${orderDetails?.totalAmount}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FaMoneyBill className="text-purple-500" />
            <span className="font-medium">Payment:</span>
            <span>{orderDetails?.paymentMethod}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaMoneyBill className="text-yellow-500" />
            <span className="font-medium">Status:</span>
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
            <span className="font-medium">Order Status:</span>
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
                    <span className="font-medium text-blue-900">
                      🛒 {item.title}
                    </span>
                    <span className="text-gray-600">Qté: {item.quantity}</span>
                    <span className="text-green-700 font-semibold">
                      ${item.price}
                    </span>
                  </li>
                ))
              : null}
          </ul>
        </div>
        <Separator />

        {/* Shipping Info */}
        {/* Shipping Info */}
<div className="bg-white rounded-xl shadow flex flex-col gap-2 p-4 border border-blue-100">
  <div className="flex items-center gap-2 mb-2">
    <FaMapMarkerAlt className="text-blue-500 text-xl" />
    <span className="font-semibold text-blue-700 text-lg">Infos de livraison</span>
  </div>
  <div className="flex items-center gap-2 text-gray-700">
    <FaUser className="text-blue-400" />
    <span className="font-medium">{user.userName}</span>
  </div>
  <div className="flex items-center gap-2 text-gray-700">
    <FaMapMarkerAlt className="text-green-500" />
    <span>{orderDetails?.addressInfo?.address}</span>
  </div>
  <div className="flex items-center gap-2 text-gray-700">
    <FaMapMarkerAlt className="text-purple-500" />
    <span>{orderDetails?.addressInfo?.city}</span>
  </div>
  <div className="flex items-center gap-2 text-gray-700">
    <FaStickyNote className="text-yellow-500" />
    <span>{orderDetails?.addressInfo?.pincode}</span>
  </div>
  <div className="flex items-center gap-2 text-gray-700">
    <FaPhoneAlt className="text-pink-500" />
    <span>{orderDetails?.addressInfo?.phone}</span>
  </div>
  {orderDetails?.addressInfo?.notes && (
    <div className="flex items-center gap-2 text-gray-700">
      <FaStickyNote className="text-orange-400" />
      <span>{orderDetails?.addressInfo?.notes}</span>
    </div>
  )}
</div>
        <Separator />

        {/* Update Status Form */}
        <div className="mt-4">
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
