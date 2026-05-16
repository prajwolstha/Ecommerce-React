function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="text-center p-4">
        © {new Date().getFullYear()} My E-Commerce Store
      </footer>
    </div>
  );
}