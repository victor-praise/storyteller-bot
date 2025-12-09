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
import { useState } from "react";
interface Props{
    story: StoryType;
}


const Story = ({story}: Props) => {
    const [api, setApi] = useState<CarouselApi>();
    
    return (
        <div>
            <div className="px-20">
                 
                <Carousel setApi={setApi}  className="w-full lg:w-4/5 h-56 mx-auto">

                    <CarouselContent>
                        {story.pages.map((page,index)=>(
                            <CarouselItem key={index}>
                                  
                                <Card>
                                    <h2>{story.story}</h2>

                                    <CardContent>
                                       
                                        <Image src={page.png} alt={`Page ${index + 1} image`} width={200} height={200} className="w-80 h-8w-80 xl:w-[500px] xl:h-[500px] rounded-3xl mx-auto float-right p-5 xl:order-last"/>
                                        <p>{page.txt}</p>
                                    </CardContent>
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