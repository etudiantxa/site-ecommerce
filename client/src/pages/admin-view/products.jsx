import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { addProductFormElements } from "@/config";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 4; // ou la valeur que tu veux par page

  const { productList, pagination } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();
  

  function onSubmit(event) {
    event.preventDefault();

    currentEditedId !== null
      ? dispatch(
          editProduct({
            id: currentEditedId,
            formData,
          })
        ).then((data) => {
          console.log(data, "edit");

          if (data?.payload?.success) {
            dispatch(fetchAllProducts({ page, limit }));
            setFormData(initialFormData);
            setOpenCreateProductsDialog(false);
            setCurrentEditedId(null);
            toast({
  title: "Produit modifié avec succès !",
  description: "Les informations du produit ont été mises à jour.",
  className: "bg-blue-50 border-blue-400 text-blue-900 font-semibold",
  icon: "✏️",
});
          }
        })
      : dispatch(
          addNewProduct({
            ...formData,
            image: uploadedImageUrl,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts({ page, limit }));
            setOpenCreateProductsDialog(false);
            setImageFile(null);
            setFormData(initialFormData);
            toast({
  title: "Produit ajouté avec succès !",
  description: "Votre produit a bien été enregistré dans le catalogue.",
  variant: "success", // si ton système de toast gère les variantes
  className: "bg-green-50 border-green-400 text-green-900 font-semibold",
  icon: "✅", // si ton composant toast accepte une icône personnalisée
});
          }
        });
  }

  function handleDelete(getCurrentProductId) {
  dispatch(deleteProduct(getCurrentProductId)).then((data) => {
    if (data?.payload?.success) {
      // Vérifie si la page courante devient vide après suppression
      if (pagination.total > 1 && productList.length === 1 && page > 1) {
        setPage(page - 1); // On revient à la page précédente
      } else {
        dispatch(fetchAllProducts({ page, limit }));
      }
      toast({
        title: "Produit supprimé !",
        description: "Le produit a été retiré du catalogue.",
        className: "bg-red-50 border-red-400 text-red-900 font-semibold",
        icon: "🗑️",
      });
    }
  });
}

  function isFormValid() {
    return Object.keys(formData)
      .filter((currentKey) => currentKey !== "averageReview")
      .map((key) => formData[key] !== "")
      .every((item) => item);
  }

  useEffect(() => {
    dispatch(fetchAllProducts({ page, limit }));
  }, [dispatch, page]);

  console.log(formData, "productList");

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold" 
        onClick={() => setOpenCreateProductsDialog(true)}
          >
          Add New Product
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList && productList.length > 0
          ? productList.map((productItem) => (
              <AdminProductTile
                setFormData={setFormData}
                setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                setCurrentEditedId={setCurrentEditedId}
                product={productItem}
                handleDelete={handleDelete}
              />
            ))
          : null}
      </div>
      <div className="flex justify-center my-8 gap-2">
  <Button
    disabled={page === 1}
    onClick={() => setPage(page - 1)}
    className="rounded-full px-4 py-2 bg-blue-100 text-blue-700 font-bold shadow hover:bg-blue-200 transition disabled:opacity-50"
  >
    ← Précédent
  </Button>
  {[...Array(pagination.totalPages)].map((_, idx) => (
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
    disabled={page === pagination.totalPages}
    onClick={() => setPage(page + 1)}
    className="rounded-full px-4 py-2 bg-blue-100 text-blue-700 font-bold shadow hover:bg-blue-200 transition disabled:opacity-50"
  >
    Suivant →
  </Button>
</div>
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-2xl font-extrabold text-blue-800 tracking-tight">
              {currentEditedId !== null ? (
                <>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-base">Edit</span>
                  <span>Product</span>
                </>
              ) : (
                <>
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-base">Add</span>
                  <span>New Product</span>
                </>
              )}
            </SheetTitle>
          </SheetHeader>
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
          />
          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              formControls={addProductFormElements}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;
