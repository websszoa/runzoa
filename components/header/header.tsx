import HeaderLeft from "./header-left";

export default async function Header() {
  return (
    <header className="header__container">
      <div className="flex items-center justify-between">
        <HeaderLeft />
      </div>
    </header>
  );
}
