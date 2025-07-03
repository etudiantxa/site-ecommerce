import { Button } from "@/components/ui/button";
import bannerOne from "../../assets/banner-1.webp";
import bannerTwo from "../../assets/banner-2.webp";
import bannerThree from "../../assets/banner-3.webp";
import {
  Airplay,
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  Heater,
  Images,
  Shirt,
  ShirtIcon,
  ShoppingBasket,
  UmbrellaIcon,
  WashingMachine,
  WatchIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";

const categoriesWithIcon = [
  { id: "men", label: "Men", icon: ShirtIcon },
  { id: "women", label: "Women", icon: CloudLightning },
  { id: "kids", label: "Kids", icon: BabyIcon },
  { id: "accessories", label: "Accessories", icon: WatchIcon },
  { id: "footwear", label: "Footwear", icon: UmbrellaIcon },
];

const brandsWithIcon = [
  { id: "nike", label: "Nike", icon: Shirt },
  { id: "adidas", label: "Adidas", icon: WashingMachine },
  { id: "puma", label: "Puma", icon: ShoppingBasket },
  { id: "levi", label: "Levi's", icon: Airplay },
  { id: "zara", label: "Zara", icon: Images },
  { id: "h&m", label: "H&M", icon: Heater },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4;

  const { productList, productDetails, pagination } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 15000);

    return () => clearInterval(timer);
  }, [featureImageList]);

  // Pagination backend : on change de page, on recharge les produits
  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
        page: currentPage,
        limit: productsPerPage,
      })
    );
  }, [dispatch, currentPage]);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full h-[600px] overflow-hidden">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((slide, index) => (
              <img
                src={slide?.image}
                key={index}
                className={`${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
                alt=""
              />
            ))
          : null}
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) =>
                (prevSlide - 1 + featureImageList.length) %
                featureImageList.length
            )
          }
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide + 1) % featureImageList.length
            )
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>
      <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-blue-100">
  <div className="container mx-auto px-4">
    <h2 className="text-4xl font-extrabold text-center mb-10 text-blue-700 tracking-tight drop-shadow">
      🛍️ Catégories populaires
    </h2>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
      {categoriesWithIcon.map((categoryItem) => (
        <Card
          key={categoryItem.id}
          onClick={() =>
            handleNavigateToListingPage(categoryItem, "category")
          }
          className="cursor-pointer group bg-white border-2 border-blue-100 hover:border-blue-400 hover:shadow-xl transition-all duration-200 rounded-xl hover:animate-bounce"
        >
          <CardContent className="flex flex-col items-center justify-center p-8">
            <span className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 group-hover:bg-blue-600 transition-colors mb-4 shadow">
              <categoryItem.icon className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
            </span>
            <span className="font-bold text-blue-700 text-lg group-hover:text-blue-900 transition-colors">
              {categoryItem.label}
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
</section>

      <section className="py-16 bg-gradient-to-br from-blue-100 via-white to-blue-50">
  <div className="container mx-auto px-4">
    <h2 className="text-4xl font-extrabold text-center mb-10 text-blue-700 tracking-tight drop-shadow">
      🏷️ Marques populaires
    </h2>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
      {brandsWithIcon.map((brandItem) => (
        <Card
          key={brandItem.id}
          onClick={() => handleNavigateToListingPage(brandItem, "brand")}
          className="cursor-pointer group bg-white border-2 border-blue-100 hover:border-blue-400 hover:shadow-xl transition-all duration-200 rounded-xl hover:animate-bounce"
        >
          <CardContent className="flex flex-col items-center justify-center p-8">
            <span className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 group-hover:bg-blue-600 transition-colors mb-4 shadow">
              <brandItem.icon className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
            </span>
            <span className="font-bold text-blue-700 text-lg group-hover:text-blue-900 transition-colors">
              {brandItem.label}
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
</section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-center mb-10 text-blue-700 tracking-tight drop-shadow">
            Feature Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList && productList.length > 0
              ? productList.map((productItem) => (
                  <ShoppingProductTile
                    key={productItem._id}
                    handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                    handleAddtoCart={handleAddtoCart}
                  />
                ))
              : <div className="col-span-full text-center text-gray-400">Aucun produit trouvé.</div>}
          </div>
          {/* Pagination */}
          <div className="flex justify-center items-center mt-8 gap-2">
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 shadow disabled:opacity-50 disabled:cursor-not-allowed"
              size="sm"
              variant="default"
            >
              Précédent
            </Button>
            <span className="mx-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold text-base shadow">
              Page {currentPage} / {pagination?.totalPages || 1}
            </span>
            <Button
              disabled={currentPage === (pagination?.totalPages || 1)}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 shadow disabled:opacity-50 disabled:cursor-not-allowed"
              size="sm"
              variant="default"
            >
              Suivant
            </Button>
          </div>
        </div>
      </section>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
