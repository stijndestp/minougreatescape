import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Bewust UIT: met Cache Components blijft een verlaten pagina (met zijn
  // animatie-/spelstatus) in het geheugen en komt terug bij "terug naar de kaart".
  // Het spel wil bij elke pagina een schone start vanuit de opgeslagen voortgang.
  cacheComponents: false,
};

export default nextConfig;
