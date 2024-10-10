import Menu from "./assets/Menu";
import Profile from "./assets/Profile";
import Logo from "./assets/Logo";

const links: Link[] = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Shopping",
    href: "/shopping",
  },
  {
    name: "Cooking",
    href: "/cooking",
  },
];

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-10 flex items-center justify-between px-10 py-4 bg-red-200 drop-shadow-md">
      <div className="flex-1">
        <Menu links={links} />
      </div>
      <div className="absolute transform -translate-x-1/2 left-1/2">
        <Logo size={50} />
      </div>
      <div className="flex justify-end flex-1">
        <Profile size={40} />
      </div>
    </nav>
  );
}
