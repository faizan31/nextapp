import Image from "next/image"
import Link from "next/link"


export default function Header(){
    return(

       
    <header className="w-full bg-gray-white text-white py-2 px-6 flex items-center justify-between shadow-md">
      
      <Link href="/zaksite" className="flex items-center">
        <Image src="/images/logo.png" alt="Logo" width={100} height={100} />
        <span className="ml-3 text-lg font-bold"></span>
      </Link>


        </header>


    );

}