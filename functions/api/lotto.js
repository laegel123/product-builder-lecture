export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const drwNo = url.searchParams.get('drwNo');

  if (!drwNo || isNaN(drwNo) || drwNo < 1) {
    return new Response(JSON.stringify({ error: 'Invalid drwNo' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiUrl = `https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${drwNo}`;

  const res = await fetch(apiUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0',
      'Accept': 'application/json',
    },
    redirect: 'follow',
  });

  const data = await res.text();

  return new Response(data, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
