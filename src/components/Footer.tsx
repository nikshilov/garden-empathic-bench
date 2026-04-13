export function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto max-w-6xl px-4 text-center text-sm text-muted-foreground">
        <p>
          Built by{" "}
          <a href="https://github.com/nicshilov" className="text-foreground hover:text-gold transition-colors" target="_blank" rel="noopener noreferrer">
            Nikita Shilov
          </a>
          {" & "}
          <span className="text-foreground">Elle</span>
        </p>
        <p className="mt-1">
          Empathic Memory Bench &middot; Open-source &middot;{" "}
          <a href="https://github.com/nicshilov/garden-empathic-bench" className="hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </p>
      </div>
    </footer>
  );
}
