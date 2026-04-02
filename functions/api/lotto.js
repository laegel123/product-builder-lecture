export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const drwNo = url.searchParams.get('drwNo');

  if (!drwNo || isNaN(drwNo) || drwNo < 1) {
    return Response.json({ returnValue: 'fail', error: 'Invalid drwNo' }, { status: 400 });
  }

  const apiUrl = `https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${drwNo}`;

  try {
    const res = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'ko-KR,ko;q=0.9',
        'Referer': 'https://www.dhlottery.co.kr/',
      },
      redirect: 'follow',
    });

    const text = await res.text();

    // JSON인지 검증
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      return Response.json(
        { returnValue: 'fail', error: 'Invalid response from API', status: res.status, body: text.substring(0, 200) },
        { status: 502 }
      );
    }

    return Response.json(json, {
      headers: { 'Cache-Control': 'public, max-age=3600' },
    });

  } catch (err) {
    return Response.json(
      { returnValue: 'fail', error: err.message },
      { status: 502 }
    );
  }
}
