import { NextResponse } from "next/server";
import {RunEventType, RunOpts} from "@gptscript-ai/gptscript";

export async function POST(request:NextResponse){
    const {story, pages, path} = await request.json();

    const opts: RunOpts = {
        disableCache:true,
        input: `--story ${story} --pages ${pages} --path ${path}`
    };

    try {
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller){
                try {
                    const run = await 
                } catch (error) {
                    controller.error(error);
                    console.error("error:", error)
                }
            }
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: error }), { status: 500 });
    }
    
}