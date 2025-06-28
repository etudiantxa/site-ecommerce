import {
  BadgeCheck,
  ChartNoAxesCombined,
  LayoutDashboard,
  ShoppingBasket,
} from "lucide-react";
import { Fragment } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <ShoppingBasket size={20} />,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: <BadgeCheck size={20} />,
  },
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="mt-6 flex-col flex gap-1">
      {adminSidebarMenuItems.map((menuItem) => {
        const isActive = location.pathname.startsWith(menuItem.path);
        return (
          <div
            key={menuItem.id}
            onClick={() => {
              navigate(menuItem.path);
              setOpen ? setOpen(false) : null;
            }}
            className={`flex cursor-pointer items-center gap-3 rounded-lg px-4 py-2 transition-colors
              ${isActive
                ? "bg-blue-600 text-white shadow"
                : "text-blue-100 hover:bg-blue-700 hover:text-white"}
            `}
          >
            <span className="flex items-center justify-center">
              {menuItem.icon}
            </span>
            <span className="font-semibold">{menuItem.label}</span>
          </div>
        );
      })}
    </nav>
  );
}

function AdminSideBar({ open, setOpen }) {
  const navigate = useNavigate();

  return (
    <Fragment>
      {/* Mobile sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 bg-blue-900 text-white p-0">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b border-blue-800">
              <SheetTitle className="flex gap-2 mt-6 mb-6 items-center">
                <ChartNoAxesCombined size={32} className="text-blue-300" />
                <span className="text-2xl font-extrabold tracking-tight">
                  Admin Panel
                </span>
              </SheetTitle>
            </SheetHeader>
            <div className="border-t border-blue-800 mb-2" />
            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 flex-col bg-blue-900 text-white p-6 lg:flex min-h-screen">
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="flex cursor-pointer items-center gap-2 mb-8"
        >
          <ChartNoAxesCombined size={32} className="text-blue-300" />
          <span className="text-2xl font-extrabold tracking-tight">
            Admin Panel
          </span>
        </div>
        <div className="border-t border-blue-800 mb-2" />
        <MenuItems />
      </aside>
    </Fragment>
  );
}

export default AdminSideBar;
