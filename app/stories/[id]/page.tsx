import { getAllStories, getStory } from "@/lib/stories";
import { notFound } from "next/navigation";
import Story from "@/components/Story";

interface StoryPagesProps {
  params: Promise<{
    id: string;
  }>;
}


export default async function StoryPage({params}: StoryPagesProps) {
    const {id} = await params;
    const decodeId = decodeURIComponent(id);

    const story = getStory(decodeId);

    if(!story){
        return notFound();
    }

    return <Story story={story}/>;

}



export async function generateStaticParams(){
    const stories = getAllStories();

    const path =stories.map((story)=> ({
        id: story.story,
    }));

    return path;
}