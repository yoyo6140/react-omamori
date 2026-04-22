import TopBar from "@/components/TopBar";

const OrdersPage = () => {
  return (
    <div className="min-h-screen bg-[var(--off-white)] text-[var(--sumi-black)]">
      <TopBar />
      <div className="max-w-7xl mx-auto px-8 pt-28">
        <h1 className="text-2xl font-bold font-serif">訂單</h1>
        <p className="mt-2 text-sm text-black/60">OrdersPage</p>
      </div>
    </div>
  );
};

export default OrdersPage;

