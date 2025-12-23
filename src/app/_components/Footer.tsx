export default function Footer() {
  return (
    <footer className="bg-neutral-900 border-t border-neutral-800 mt-auto py-6">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-neutral-400 text-sm">
          © {new Date().getFullYear()} PVM - Made By Laser
        </p>
      </div>
    </footer>
  );
}