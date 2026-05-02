import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const allowedAssetTypes = ["CRYPTO", "STOCK", "ETF", "FUND", "OTHER"];

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: user, error: authError } = await supabase.auth.getUser();

  if (authError || !user?.user) {
    return NextResponse.json({ error: "Autenticación requerida." }, { status: 401 });
  }

  const body = await request.json();
  const {
    symbol,
    asset_name,
    asset_type,
    quantity,
    average_price,
    currency,
    platform,
    notes,
  } = body;

  if (!symbol || typeof symbol !== "string") {
    return NextResponse.json({ error: "Símbolo inválido." }, { status: 400 });
  }

  if (!allowedAssetTypes.includes(asset_type)) {
    return NextResponse.json({ error: "Tipo de activo inválido." }, { status: 400 });
  }

  const numericQuantity = Number(quantity);
  const numericPrice = Number(average_price);

  if (Number.isNaN(numericQuantity) || numericQuantity < 0) {
    return NextResponse.json({ error: "Cantidad inválida." }, { status: 400 });
  }

  if (Number.isNaN(numericPrice) || numericPrice < 0) {
    return NextResponse.json({ error: "Precio medio inválido." }, { status: 400 });
  }

  const { data, error } = await supabase.from("user_portfolio_positions").insert([
    {
      user_id: user.user.id,
      symbol: symbol.trim().toUpperCase(),
      asset_name: asset_name?.trim() || null,
      asset_type,
      quantity: numericQuantity,
      average_price: numericPrice,
      currency: currency?.trim().toUpperCase() || "USD",
      platform: platform?.trim() || null,
      notes: notes?.trim() || null,
    },
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, position: data?.[0] ?? null });
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { data: user, error: authError } = await supabase.auth.getUser();

  if (authError || !user?.user) {
    return NextResponse.json({ error: "Autenticación requerida." }, { status: 401 });
  }

  const body = await request.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json({ error: "ID de posición requerido." }, { status: 400 });
  }

  const { error } = await supabase
    .from("user_portfolio_positions")
    .delete()
    .eq("id", id)
    .eq("user_id", user.user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
