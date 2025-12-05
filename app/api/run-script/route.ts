// app/api/run-script/route.ts
import { NextRequest } from "next/server";
import { RunEventType, RunOpts } from "@gptscript-ai/gptscript";
import g from "@/lib/gptScriptInstance";
import path from "path";

const script = "app/api/run-script/story-book.gpt";
console.log("API route script path:", script);

export const runtime = "nodejs"; // important because we use Node APIs elsewhere

export async function POST(request: NextRequest) {
  const { story, pages, path: storiesPath } = await request.json();

  const opts: RunOpts = {
    disableCache: true,
    input: `--story ${story} --pages ${pages} --path ${storiesPath}`,
  };

  try {
    console.log("Inside API route - starting stream");
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const run = await g.run(script, opts);
          console.log("Run started");

          // Stream events to the client as before
          run.on(RunEventType.Event, (data) => {
            controller.enqueue(
              encoder.encode(`event: ${JSON.stringify(data)}\n\n`)
            );
          });

          // Wait for GPTScript to finish and get the final text output
          const finalText = await run.text();

          // --- PARSE RESULT_JSON LINE ---
          let storyTitle: string | null = null;
          let pageCount: number | null = null;

          const match = finalText.match(/RESULT_JSON:\s*(\{.*\})/s);
          if (match && match[1]) {
            try {
              const result = JSON.parse(match[1]);
              storyTitle = result.title;
              pageCount = result.pages;
              console.log("Parsed RESULT_JSON:", result);

              // Optionally send an event to the client with parsed result
              controller.enqueue(
                encoder.encode(
                  `event: ${JSON.stringify({
                    type: "parsedResult",
                    title: storyTitle,
                    pages: pageCount,
                  })}\n\n`
                )
              );
              controller.enqueue(
  encoder.encode(
    `event: ${JSON.stringify({
      type: "storyComplete",
      message:
        "Your story has been generated successfully! You can find it in the Stories tab.",
    })}\n\n`
  )
);

controller.close();
            } catch (err) {
              console.error("Failed to parse RESULT_JSON:", err);
            }
          } else {
            console.warn("No RESULT_JSON line found in GPTScript output");
          }

          // --- AUTO-CALL IMAGE ENDPOINT ---
          if (storyTitle && pageCount) {
            const origin = new URL(request.url).origin;

            for (let pageNumber = 1; pageNumber <= pageCount; pageNumber++) {
              // You can customize this prompt however you like.
              const prompt = `Children's book illustration for page ${pageNumber} of "${storyTitle}".`;

              // Notify client we're starting image generation for this page
              controller.enqueue(
                encoder.encode(
                  `event: ${JSON.stringify({
                    type: "imageGenerationStart",
                    pageNumber,
                  })}\n\n`
                )
              );

              try {
                const res = await fetch(
                  `${origin}/api/generate-story-image`,
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      prompt,
                      storyTitle,
                      pageNumber,
                    }),
                  }
                );

                const data = await res.json();

                // Notify client about success / failure for each page
                controller.enqueue(
                  encoder.encode(
                    `event: ${JSON.stringify({
                      type: "imageGenerationResult",
                      pageNumber,
                      success: res.ok,
                      url: data?.url ?? null,
                      error: res.ok ? null : data?.error ?? "Unknown error",
                    })}\n\n`
                  )
                );
              } catch (err: any) {
                console.error(
                  `Failed to generate image for page ${pageNumber}:`,
                  err
                );
                controller.enqueue(
                  encoder.encode(
                    `event: ${JSON.stringify({
                      type: "imageGenerationError",
                      pageNumber,
                      error: err?.message || "Image generation failed",
                    })}\n\n`
                  )
                );
              }
            }
          }

          controller.close();
        } catch (error) {
          console.error("error in run-script route:", error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("route-level error:", error);
    return new Response(JSON.stringify({ error }), { status: 500 });
  }
}
