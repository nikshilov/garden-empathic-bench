export function Footer() {
  return (
    <footer className="py-10">
      <div className="mx-auto max-w-6xl px-4">
        {/* Subtle gradient separator */}
        <div className="mx-auto mb-8 h-px w-32 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <div className="text-center text-sm text-muted-foreground">
          <p>
            Built by{" "}
            <a
              href="https://github.com/nicshilov"
              className="font-medium text-foreground transition-colors duration-300 hover:text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nikita Shilov
            </a>
            {" & "}
            <span className="font-medium gradient-text">Elle</span>
          </p>
          <p className="mt-2">
            Empathic Memory Bench &middot; Open-source &middot;{" "}
            <a
              href="https://github.com/nicshilov/garden-empathic-bench"
              className="transition-colors duration-300 hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
