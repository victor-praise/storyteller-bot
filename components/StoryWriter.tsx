'use client';

import { useState } from "react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";

const storiesPath = "public/stories"
function StoryWriter() {
    const [story, setStory] = useState("");
    const [pages, setPages] = useState<number>();
    const [progress, setProgress] = useState("");
    const [runStarted, setRunStarted] = useState<boolean>(false);
    const [runFinished, setRunFinished] = useState<boolean|null>(null);
    const [currentTool, setCurrentTool] = useState<string|null>(null);

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