import { getMarketSnapshots } from "@/lib/market/binance";

export async function GET() {
  try {
    const snapshots = await getMarketSnapshots();

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
