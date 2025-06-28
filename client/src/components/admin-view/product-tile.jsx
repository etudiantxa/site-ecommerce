import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Dialog, DialogContent } from "../ui/dialog";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
}) {
  const [openConfirm, setOpenConfirm] = useState(false);

  return (
    <Card className="w-full max-w-xs mx-auto bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-xl shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
      <div>
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[140px] object-cover rounded-t-xl"
          />
          {product?.salePrice > 0 && (
            <span className="absolute top-2 right-2 bg-green-500 text-white px-2 py-0.5 text-xs rounded-full shadow font-bold tracking-wide">
              Promo
            </span>
          )}
        </div>
        <CardContent className="p-3">
          <h2 className="text-base font-extrabold mb-1 mt-2 text-blue-900 truncate">
            {product?.title}
          </h2>
          <div className="flex justify-between items-end mb-1">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through text-gray-400" : "text-primary"
              } text-base font-bold`}
            >
              ${product?.price}
            </span>
            {product?.salePrice > 0 && (
              <span className="text-base font-extrabold text-green-600 drop-shadow">
                ${product?.salePrice}
              </span>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center mt-1 px-3 pb-3">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow rounded px-4 py-1 text-sm"
            onClick={() => {
              setOpenCreateProductsDialog(true);
              setCurrentEditedId(product?._id);
              setFormData(product);
            }}
          >
            &#9998; Edit
          </Button>
          <Button
            className="bg-red-500 hover:bg-red-600 text-white font-bold shadow rounded px-4 py-1 text-sm"
            onClick={() => setOpenConfirm(true)}
          >
            &#10060; Delete
          </Button>
        </CardFooter>
      </div>
      {/* Confirmation Dialog */}
      <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <DialogContent className="max-w-xs w-full flex flex-col items-center bg-gradient-to-br from-white via-red-100 to-red-200 rounded-3xl shadow-2xl border-0 p-8">
          <div className="flex flex-col items-center w-full">
            <div className="bg-red-200 rounded-full p-5 mb-4 shadow-lg border-4 border-red-300 animate-pulse">
              <span className="text-4xl text-red-600">🗑️</span>
            </div>
            <h3 className="text-2xl font-extrabold text-red-700 mb-2 text-center drop-shadow">
              Suppression du produit
            </h3>
            <p className="text-gray-700 mb-6 text-center text-base">
              Voulez-vous vraiment supprimer ce produit&nbsp;?<br />
              <span className="font-bold text-red-600">Cette action est irréversible.</span>
            </p>
            <div className="flex gap-4 w-full justify-center">
              <Button
                className="bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 font-semibold px-6 py-2 rounded-full shadow"
                onClick={() => setOpenConfirm(false)}
                type="button"
              >
                Annuler
              </Button>
              <Button
                className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-bold px-6 py-2 rounded-full shadow-lg"
                onClick={() => {
                  handleDelete(product?._id);
                  setOpenConfirm(false);
                }}
                type="button"
              >
                Oui, supprimer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default AdminProductTile;
