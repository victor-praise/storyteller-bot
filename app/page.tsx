import Image from "next/image";
import logo from "../images/ChatGPT Image Nov 30, 2025, 11_50_37 PM.png"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import StoryWriter from "@/components/StoryWriter";
export default function Home() {
  return (
    <div className="flex-1 flex flex-col px-5">
    <section className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-blue-300 flex flex-col space-y-5 justify-center items-center order-1 lg:-order-1 pb-10">
        <Image src={logo} height={250} alt="logo"/>
        <Button asChild className="px-20 bg-blue-500 p-10 text-xl">
          <Link href="/stories">Explore Story Library</Link>
        </Button>
      </div>

      <StoryWriter/>
    </section>
    </div>
  );
}
