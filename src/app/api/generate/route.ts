import puppeteer from 'puppeteer';
import {GenerateService} from "@/sevices/generate";

export async function POST(req: Request) {
    const body = await req.json();

    const result = await GenerateService().generateOGImagesForDomain(body.url);

    return Response.json(result);
}
