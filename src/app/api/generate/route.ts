import puppeteer from 'puppeteer';

export async function POST(req: Request) {
    const body = await req.json();

    console.log('body 😋', {body}, '');
    const browser = await puppeteer.launch({defaultViewport: {width: 1920, height: 1080}});

    const page = await browser.newPage();
    await page.goto(body.url);
    const image = await page.screenshot();
    await browser.close();

    console.log('image 😋', {image}, '');

    const base64Screenshot = image.toString('base64')
    return Response.json({
        image: `data:image/png;base64,${base64Screenshot}`
    })
}
