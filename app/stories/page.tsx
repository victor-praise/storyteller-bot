import { getAllStories } from "@/lib/stories";
import { Story } from "@/types/stories";

function page() {
    const stories: Story[] = getAllStories();

    console.log(stories);
    
  return (
    <div>page</div>
  )
}

export default page