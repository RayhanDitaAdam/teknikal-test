import { NextRequest, NextResponse } from "next/server";

const MAIN_LOCATION = "Jakarta";
const NOMINATIM = "https://nominatim.openstreetmap.org";

async function geocode(place: string) {
  const res = await fetch(`${NOMINATIM}/search?q=${encodeURIComponent(place)}&format=json&limit=1`, {
    headers: { "User-Agent": "KendaraanApp/1.0" },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data[0] || null;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tujuan = searchParams.get("tujuan");

  if (!tujuan) return NextResponse.json({ error: "Tujuan wajib diisi" }, { status: 400 });

  try {
    const [originData, destData] = await Promise.all([geocode(MAIN_LOCATION), geocode(tujuan)]);

    if (!originData || !destData) {
      return NextResponse.json({ error: "Gagal mendapatkan koordinat lokasi" }, { status: 404 });
    }

    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(parseFloat(destData.lat) - parseFloat(originData.lat));
    const dLon = toRad(parseFloat(destData.lon) - parseFloat(originData.lon));
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(parseFloat(originData.lat))) *
        Math.cos(toRad(parseFloat(destData.lat))) *
        Math.sin(dLon / 2) ** 2;
    const jarakKm = Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));

    return NextResponse.json({
      asal: originData.display_name,
      tujuan: destData.display_name,
      jarakKm,
      originLat: originData.lat,
      originLon: originData.lon,
      destLat: destData.lat,
      destLon: destData.lon,
    });
  } catch (err) {
    return NextResponse.json({ error: "Gagal menghitung jarak" }, { status: 500 });
  }
}