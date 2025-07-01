import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  return (
    <Card className="w-full max-w-xs mx-auto bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-xl shadow-lg border border-blue-200 hover:shadow-blue-300 transition-shadow duration-200">
      <div onClick={() => handleGetProductDetails(product?._id)} className="cursor-pointer">
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[160px] object-cover rounded-t-xl border-b border-blue-100"
          />
          {product?.totalStock === 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-600 text-white px-2 py-0.5 rounded-full text-xs shadow">
              Rupture
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-0.5 rounded-full text-xs shadow">
              {`Stock: ${product?.totalStock}`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-green-600 text-white px-2 py-0.5 rounded-full text-xs shadow">
              Promo
            </Badge>
          ) : null}
        </div>
        <CardContent className="p-3">
          <h2 className="text-lg font-bold text-blue-700 mb-1 truncate">{product?.title}</h2>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
              {categoryOptionsMap[product?.category]}
            </span>
            <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
              {brandOptionsMap[product?.brand]}
            </span>
          </div>
          <hr className="my-1 border-blue-100" />
          <div className="flex justify-between items-center gap-1 mb-1">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through text-gray-400" : "text-green-700"
              } text-base font-semibold`}
            >
              ${product?.price}
            </span>
            {product?.salePrice > 0 && (
              <span className="text-base font-bold text-green-700">
                ${product?.salePrice}
              </span>
            )}
          </div>
        </CardContent>
      </div>
      <CardFooter>
        {product?.totalStock === 0 ? (
          <Button className="w-full h-8 text-xs opacity-60 cursor-not-allowed" disabled>
            Rupture de stock
          </Button>
        ) : (
          <Button
            onClick={() => handleAddtoCart(product?._id, product?.totalStock)}
            className="w-full h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold"
          >
            Ajouter au panier
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;