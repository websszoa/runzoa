import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import MobileNav from "@/components/nav/mobile-nav";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="main__container">{children}</main>
      <Footer />
      <MobileNav />
    </>
  );
}
