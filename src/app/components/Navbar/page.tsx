import Menu from "./assets/Menu";
import ProfileIcon from "./assets/ProfileIcon";
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

if (process.env.NODE_ENV === "development") {
  links.push({
    name: "Testing",
    href: "/testing",
  });
}

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-10 flex items-center justify-between px-10 bg-slate-200 py-4 drop-shadow-md">
      <div className="flex-1">
        <Menu links={links} />
      </div>
      <div className="absolute transform -translate-x-1/2 left-1/2">
        <Logo size={50} />
      </div>
      <div className="flex justify-end flex-1">
        <ProfileIcon size={40} />
      </div>
    </nav>
  );
}
