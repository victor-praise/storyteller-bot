import { NextRequest} from "next/server";
import {RunEventType, RunOpts} from "@gptscript-ai/gptscript";
import g from "@/lib/gptScriptInstance";
import path from "path";

const script = path.resolve(process.cwd(), "story-book.gpt");


console.log("API route script path:", script);


export async function POST(request:NextRequest){
    const {story, pages, path} = await request.json();

    const opts: RunOpts = {
        disableCache:true,
        input: `--story ${story} --pages ${pages} --path ${path}`
    };

    try {
        console.log("Inside API route - starting stream");
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller){
                try {
                    const run = await g.run(script,opts);
                    console.log("Run started");

                    run.on(RunEventType.Event, (data)=>{
                        controller.enqueue(encoder.encode(`event: ${JSON.stringify(data)}\n\n`));
                    });

                    await run.text();
                    controller.close();
                } catch (error) {
                    controller.error(error);
                    console.error("error:", error)
                }
            }

        });

        return new Response(stream,{headers:{"Content-Type":"text/event-stream","Cache-Control":"no-cache", Connection:"keep-alive"}});
    } catch (error) {
        return new Response(JSON.stringify({ error: error }), { status: 500 });
    }
    
}