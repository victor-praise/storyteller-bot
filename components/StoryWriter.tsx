'use client';

import { useState } from "react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";

function StoryWriter() {
    const [story, setStory] = useState("");
    const [pages, setPages] = useState<number>();
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

            <Button className="w-full bg-blue-600 text-white" size="lg" disabled={!story || !pages}>
                Generate Story
            </Button>
        </section>
        <section className="flex-1 pb-5 mt-5">
            <div className="flex flex-col-reverse w-full space-y-2 bg-gray-800 rounded-md text-gray-200 font-mono p-10 h-96 overflow-y-auto">
                <div>
                    <span className="mr-5">
                        {">>"}
                    </span>
                </div>
            </div>
        </section>
    </div>
  )
}

export default StoryWriter