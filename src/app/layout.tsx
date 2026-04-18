import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-[#0c0f1a] to-[#030407] text-white">
        <main className="min-h-screen flex items-center justify-center px-4">
          
          {/* Outer glow wrapper */}
          <div className="w-full max-w-6xl">
            
            {/* Glass container */}
            <div className="glass p-8 md:p-10 w-full">
              {children}
            </div>

          </div>

        </main>
      </body>
    </html>
  );
}