import { getMarketSnapshots } from "@/lib/market/binance";

export async function GET() {
  try {
    const snapshots = await getMarketSnapshots();

    if (snapshots.length === 0) {
      return Response.json(
        {
          error: "No se pudo cargar ningún activo de mercado.",
        },
        {
          status: 502,
        },
      );
    }

    return Response.json(snapshots);
  } catch {
    return Response.json(
      {
        error: "No se pudo cargar el snapshot de mercado.",
      },
      {
        status: 502,
      },
    );
  }
}
