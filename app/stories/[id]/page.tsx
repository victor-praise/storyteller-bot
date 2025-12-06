import { getAllStories, getStory } from "@/lib/stories";
import { notFound } from "next/navigation";
import Story from "@/components/Story";

interface StoryPagesProps{
    params:{
    id:string;
}
}

function StoryPage({params: {id}}: StoryPagesProps) {
    const decodeId = decodeURIComponent(id);

    const story = getStory(decodeId);

    if(!story){
        return notFound();
    }

    return <Story story={story}/>;
  return (
    <div>page</div>
  )
}

export default StoryPage;

export async function generateStaticParams(){
    const stories = getAllStories();

    const path =stories.map((story)=> ({
        id: story.story,
    }));

    return path;
}