import Footer from "@/components/layout/Footer";

export default function LocationsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* <Header /> */}
      {children}
      <Footer />
    </>
  );
}
