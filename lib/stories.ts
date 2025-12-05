import page from "@/app/stories/page";
import { Page, Story } from "@/types/stories";
import fs from "fs";
import path from "path";
import cleanTitle from "./leanTitle";

const storiesDir = path.join(process.cwd(), "public/stories");
export function getAllStories(): Story[]{
if(!fs.existsSync(storiesDir)){
    return [];
}

const storyFolders = fs.readdirSync(storiesDir);
const stories: Story[] = storyFolders.map((folderName) => {
    const storyPath = path.join(storiesDir, folderName);
    const files = fs.readdirSync(storyPath);

    const pages: Page[] = [];

    const pageMap: {[key:string]: Partial<Page>} = {};

    files.forEach(file=>{
        const filePath = path.join(storyPath, file);
        const ext = path.extname(file).substring(1);
        const pageNumber = file.match(/page(\d+)\./)?.[1];
        const base = path.basename(file, ext);

        if(pageNumber){

        if(!pageMap[pageNumber]){
            pageMap[pageNumber] = {};
        }

        if(ext === "txt"){
            pageMap[pageNumber].txt = fs.readFileSync(filePath,"utf-8");
        } else if(ext === "png"){
            pageMap[pageNumber].png = `/stories/${folderName}/${file}`;
        }
        }
    })

    Object.keys(pageMap).forEach(pageNumber=>{
        if(pageMap[pageNumber].txt && pageMap[pageNumber].png){
            pages.push(pageMap[pageNumber] as Page);
        }
    });

    return {
        story: cleanTitle(folderName),
        pages,
    
    }
});

const storiesWithPages = stories.filter(story=> story.pages.length >0); 
return storiesWithPages;
}

export const getStory = (story:string): Story | undefined => {
    const stories = getAllStories();
    return stories.find(s=> s.story === story); 
}