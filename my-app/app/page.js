"use client"
import React from 'react'
 
function page() {
  return (
    <div>
      <div className=" flex flex-col items-center justify-center min-h-[40vh]">
        <div className="text-2xl font-bold">
          Buy Me Tea
        </div>
        <p>
          A crowdfunding platform for tea lovers to support their favorite tea brands and help them grow.
        </p>
        <button className="bg-blue-400 text-white px-2 py-2 rounded mt-4 hover:bg-blue-500 transition-colors duration-300">
          Start Here
        </button>
      </div>
      <div className="bg-black h-1 opacity-50">
      </div>
      <h6 className="text-lg font-semibold text-center mt-4">
        Your Fans Can Help You Grow
      </h6>
      <div className="flex align-items-center justify-center gap-30 py-15">
        <div className="flex flex-col items-center justify-center">
          <div className='bg-gray-200 h-20 w-20 rounded-full flex items-center justify-center'><span className="material-symbols-outlined " style={{ fontSize: "60px" }}>home</span></div>
          <h1 className="text-xl font-bold mt-2">Fans Want to Support You</h1>
          <p className="text-center mt-2">Here You Can Connect With Your Fans</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className='bg-gray-200 h-20 w-20 rounded-full flex items-center justify-center'><span className="material-symbols-outlined " style={{ fontSize: "60px" }}>home</span></div>
          <h1 className="text-xl font-bold mt-2">Fans Want to Support You</h1>
          <p className="text-center mt-2">Here You Can Connect With Your Fans</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className='bg-gray-200 h-20 w-20 rounded-full flex items-center justify-center'><span className="material-symbols-outlined " style={{ fontSize: "60px" }}>home</span></div>
          <h1 className="text-xl font-bold mt-2">Fans Want to Support You</h1>
          <p className="text-center mt-2">Here You Can Connect With Your Fans</p>
        </div>
      </div>
       <div className="bg-black h-1 opacity-50">
      </div>
      <div className="flex align-items-center justify-center gap-30 py-15 ">
        <div className="flex flex-col items-center justify-center ">
          <div className='bg-gray-200 h-20 w-20 rounded-full flex items-center justify-center'><span className="material-symbols-outlined " style={{ fontSize: "60px" }}>home</span></div>
          <h1 className="text-xl font-bold mt-2">Fans Want to Support You</h1>
          <p className="text-center mt-2">Here You Can Connect With Your Fans</p>
        </div>
        <div className="flex flex-col items-center justify-center ">
          <div className='bg-gray-200 h-20 w-20 rounded-full flex items-center justify-center'><span className="material-symbols-outlined " style={{ fontSize: "60px" }}>home</span></div>
          <h1 className="text-xl font-bold mt-2">Fans Want to Support You</h1>
          <p className="text-center mt-2">Here You Can Connect With Your Fans</p>
        </div>
        <div className="flex flex-col items-center justify-center ">
          <div className='bg-gray-200 h-20 w-20 rounded-full flex items-center justify-center'><span className="material-symbols-outlined " style={{ fontSize: "60px" }}>home</span></div>
          <h1 className="text-xl font-bold mt-2">Fans Want to Support You</h1>
          <p className="text-center mt-2">Here You Can Connect With Your Fans</p>
        </div>
      </div>
      


    </div>
  )
}

export default page