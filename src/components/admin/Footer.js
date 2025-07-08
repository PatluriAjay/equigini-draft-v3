// Admin Footer component
export default function AdminFooter() {
  return (
    <footer className="w-full h-12 bg-bodybg4 text-center flex items-center justify-center text-xs text-gray-500">
      © {new Date().getFullYear()} Equigini. All rights reserved.
    </footer>
  );
}
