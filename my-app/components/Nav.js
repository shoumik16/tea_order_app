"use client"
import {signIn} from "next-auth/react"
import Link from "next/link"
import { loginwithGoogle } from "../app/login/action"
export default function Nav() {
  async function f() {
    
    await signIn();
  }


  return (
    <div className="flex items-center justify-between p-4 bg-gray-800 text-white h-14">
      <div className="text-xl font-bold">shomTea45</div>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded mb-2 mt-2"><Link href="/login">login</Link></button>
      
    </div>
  )
}