import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {

  return (
<div className="bg-black text-white h-screen w-full flex justify-center items-center text-3xl ">
 Welcome to Home Page!
 Try Visit 
 <div className="flex items-center ps-2 group ">

 <Link className=" underline text-green-400" href="/test">Test Page</Link>
 <ArrowRight className="text-green-400 ps-1 group-hover:ps-4 w-10 h-10 transition-all duration-500"/>
 </div>
</div>
   
  );
}
