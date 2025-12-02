'use client';

import { useState } from "react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Readable } from "stream";
import { Frame } from "@gptscript-ai/gptscript";
import renderEventMessage from "@/lib/renderEventMessage";

const storiesPath = "public/stories"
function StoryWriter() {
    const [story, setStory] = useState("");
    const [pages, setPages] = useState<number>();
    const [progress, setProgress] = useState("");
    const [runStarted, setRunStarted] = useState<boolean>(false);
    const [runFinished, setRunFinished] = useState<boolean|null>(null);
    const [currentTool, setCurrentTool] = useState<string|null>(null);
    const [events, setEvents] = useState<Frame[]>([]);


    async function handleStream(reader:ReadableStreamDefaultReader<Uint8Array>, decoder:TextDecoder){
        while(true){
            const {done,value} = await reader.read();

            if(done) break;

            const chunk = decoder.decode(value,{stream:true});

            const eventData = chunk.split("\n\n").filter((line) => line.startsWith("event: ")).map((line)=> line.replace(/^event: /,""));


            eventData.forEach(data=>{
                try {
                    const parsedData = JSON.parse(data);

                    if(parsedData.type === "callProgress"){
                        setProgress(parsedData.output[parsedData.output.length -1].content);
                        setCurrentTool(parsedData.tool?.description || "");
                    }
                    else if(parsedData.type === "callStart"){
                        setCurrentTool(parsedData.tool?.description || "");
                    }
                    else if(parsedData.type === "runFinish"){
                        setRunFinished(true);

                        setRunStarted(false);
                    }
                    else{
                        setEvents((prevEvents) => [...prevEvents, parsedData]);
                    }
                } catch (error) {
                    console.error("Failed to parse to json")
                }
            })
        }
    }
    async function runScript() {
        setRunStarted(true);
        setRunFinished(false);

        const response = await fetch('/api/run-script', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ story, pages, path: storiesPath }),
        });

        if(response.ok && response.body){
                console.log("Streaming started");
                const reader = response.body.getReader();

                const decoder = new TextDecoder();

                handleStream(reader,decoder);
        }else{
            setRunFinished(true);
            setRunStarted(false);
            console.error("Failed to start the script.");   
        }
    }

  return (
    <div className="flex flex-col container">
        <section className="flex-1 flex flex-col border border-purple-300 rounded-md p-10 space-y-2">
            <Textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
            className="flex-1 text-black"
             placeholder="Write a story about a robot and a human who become friends..."/>
            <Select onValueChange={value => setPages(parseInt(value))}>
                <SelectTrigger>
                    <SelectValue placeholder="How many pages should the story be?"/>
                </SelectTrigger>
                <SelectContent 
                
                className="w-full">
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="6">6</SelectItem>
                    <SelectItem value="7">7</SelectItem>
                    <SelectItem value="8">8</SelectItem>
                    <SelectItem value="9">9</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                </SelectContent>
            </Select>

            <Button onClick={runScript} className="w-full bg-blue-600 text-white" size="lg" disabled={!story || !pages || runStarted}>
                Generate Story
            </Button>
        </section>
        <section className="flex-1 pb-5 mt-5">
            <div className="flex flex-col-reverse w-full space-y-2 bg-gray-800 rounded-md text-gray-200 font-mono p-10 h-96 overflow-y-auto">
                <div>
                    {runFinished === null && (
                        <>
                            <p className="animate-pulse mr-5">I'm waiting for you to Generate a story above...</p>
                            <br/>
                        </>
                    )}
                    <span className="mr-5">
                        {">>"}
                    </span>
                    {progress}
                </div>

                {currentTool && (
                    <div className="py-10">
                        <span className="mr-5">{"--- [Current Tool] ---"}</span>
                        {currentTool}
                    </div>
                )}
                <div className="space-y-5">
                    {
                        events.map((event,index)=> (
                            <div key={index}>
                                <span className="mr-5">{">>"}</span>
                                {renderEventMessage(event)}
                            </div>
                        ))
                    }
                </div>
                {runStarted && (
                    <div>
                        <span className="mr-5 animate-in">
                            {"--- [Storyteller Has Started] ---"}
                        </span>
                        <br/>
                    </div>
                )}
            </div>
        </section>
    </div>
  )
}

export default StoryWriter