"use client";

import {Story as StoryType} from "@/types/stories";

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
;
import Image from "next/image";
import { useEffect, useState } from "react";
interface Props{
    story: StoryType;
}


const Story = ({story}: Props) => {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);
    
    useEffect(()=>{
        if(!api) return;

        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap()+1);

        api.on("select", ()=>{
            setCurrent(api.selectedScrollSnap()+1);
        } )
    },[api])
    return (
        <div>
            <div className="px-20">
                 
                <Carousel setApi={setApi}  className="w-full lg:w-4/5 h-56 mx-auto">

                    <CarouselContent className="px-5">
                        {story.pages.map((page,index)=>(
                            <CarouselItem key={index}>
                                  
                                <Card className="p-5 md:p-10 border">
                                    <h2 className="text-center text-gray-400">{story.story}</h2>

                                    <CardContent className="p-5 xl:flex">
                                       
                                        <Image src={page.png} alt={`Page ${index + 1} image`} width={200} height={200} className="w-80 h-8w-80 xl:w-[500px] xl:h-[500px] rounded-3xl mx-auto float-right p-5 xl:order-last"/>
                                        <p className="font-semibold text-xl first-letter:text-3xl whitespace-pre-wrap">{page.txt}</p>
                                    </CardContent>
                                    <p className="text-center text-gray-500">
                                        Page {current} of {count}
                                    </p>
                                </Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                     <CarouselPrevious />
      <CarouselNext />
                </Carousel>
            </div>
        </div>
    );
}
export default Story;