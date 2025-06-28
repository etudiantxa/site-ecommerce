import { AlignJustify, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice";

function AdminHeader({ setOpen }) {
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-blue-900 border-b border-blue-800 shadow-sm">
      <Button
        onClick={() => setOpen(true)}
        className="lg:hidden sm:block bg-transparent hover:bg-blue-800 text-blue-100 p-2 rounded-full"
        aria-label="Ouvrir le menu"
      >
        <AlignJustify size={24} className="text-blue-300" />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="flex-1 flex justify-end">
        <Button
          onClick={handleLogout}
          className="inline-flex gap-2 items-center rounded-full px-5 py-2 text-sm font-semibold bg-blue-800 text-blue-100 hover:bg-blue-700 shadow transition"
        >
          <LogOut size={18} className="text-red-400" />
          Logout
        </Button>
      </div>
    </header>
  );
}

export default AdminHeader;
