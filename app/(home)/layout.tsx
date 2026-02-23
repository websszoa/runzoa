import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="main__container">{children}</main>
      <Footer />
    </>
  );
}
