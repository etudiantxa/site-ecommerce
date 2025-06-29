import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
} from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 8; // ou la valeur que tu veux par page
  const { orderList, orderDetails, pagination } = useSelector(
    (state) => state.adminOrder
  );
  const dispatch = useDispatch();

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetailsForAdmin(getId));
  }

  useEffect(() => {
    dispatch(getAllOrdersForAdmin({ page, limit }));
  }, [dispatch, page]);

  console.log(orderDetails, "orderList");

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  return (
    <Card className="shadow-2xl rounded-3xl border-blue-100 bg-white/90">
      <CardHeader className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-400 rounded-t-3xl pb-6">
        <CardTitle className="text-white text-2xl font-extrabold tracking-tight drop-shadow flex items-center gap-2">
          <span className="bg-blue-300 text-blue-900 px-3 py-1 rounded-full text-base">
            Admin
          </span>
          <span>Commandes</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-50">
              <TableHead className="text-blue-900 font-bold">ID</TableHead>
              <TableHead className="text-blue-900 font-bold">Date</TableHead>
              <TableHead className="text-blue-900 font-bold">Statut</TableHead>
              <TableHead className="text-blue-900 font-bold">Total</TableHead>
              <TableHead>
                <span className="sr-only">Détails</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList && orderList.length > 0
              ? orderList.map((orderItem) => (
                  <TableRow
                    key={orderItem._id}
                    className="hover:bg-blue-50 transition"
                  >
                    <TableCell className="font-mono text-xs text-blue-800">
                      {orderItem?._id}
                    </TableCell>
                    <TableCell className="text-blue-700">
                      {orderItem?.orderDate.split("T")[0]}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`py-1 px-3 text-white font-bold rounded-full shadow
                      ${
                        orderItem?.orderStatus === "confirmed"
                          ? "bg-green-500"
                          : orderItem?.orderStatus === "rejected"
                          ? "bg-red-600"
                          : "bg-gray-800"
                      }`}
                      >
                        {orderItem?.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-bold text-blue-900">
                      ${orderItem?.totalAmount}
                    </TableCell>
                    <TableCell>
                      <Dialog
                        open={openDetailsDialog}
                        onOpenChange={() => {
                          setOpenDetailsDialog(false);
                          dispatch(resetOrderDetails());
                        }}
                      >
                        <Button
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full px-4 py-1 shadow"
                          onClick={() => handleFetchOrderDetails(orderItem?._id)}
                        >
                          Voir détails
                        </Button>
                        <AdminOrderDetailsView orderDetails={orderDetails} />
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-blue-400 py-8">
                    Aucune commande trouvée.
                  </TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
        <div className="flex justify-center my-8 gap-2">
          <Button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="rounded-full px-4 py-2 bg-blue-100 text-blue-700 font-bold shadow hover:bg-blue-200 transition disabled:opacity-50"
          >
            ← Précédent
          </Button>
          {[...Array(pagination?.totalPages || 1)].map((_, idx) => (
            <button
              key={idx + 1}
              onClick={() => setPage(idx + 1)}
              className={`mx-1 w-10 h-10 rounded-full font-bold border-2 transition
        ${page === idx + 1
                  ? "bg-blue-600 text-white border-blue-600 shadow-lg scale-110"
                  : "bg-white text-blue-700 border-blue-200 hover:bg-blue-50"}`}
              disabled={page === idx + 1}
            >
              {idx + 1}
            </button>
          ))}
          <Button
            disabled={page === (pagination?.totalPages || 1)}
            onClick={() => setPage(page + 1)}
            className="rounded-full px-4 py-2 bg-blue-100 text-blue-700 font-bold shadow hover:bg-blue-200 transition disabled:opacity-50"
          >
            Suivant →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default AdminOrdersView;
