'use client'
import Image from 'next/image'
import React, {useState, useEffect} from 'react'
import { MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import Avatar from 'react-avatar'
import { useBoardStore } from '@/store/BoardStore'
import fetchSuggestion from '@/lib/fetchSuggestion'

function Header() {
  const [board, searchString, setSearchString ] = useBoardStore((state) =>[state.board, state.searchString, state.setSearchString])
  const [loading, setLoading] = useState<Boolean>(false)
  const [suggestion, setSuggestion] = useState<string>("")

  useEffect(() => {
   if(board.columns.size === 0) return;
  //  setLoading(true)
  setLoading(false)

   const fetchSuggestionFunc = async () => {
    const suggestion = await fetchSuggestion(board)
    setSuggestion(suggestion)
    setLoading(false)
   }

  //  fetchSuggestionFunc();
  }, [board])
  

  return (
    <header>
      <div className='flex flex-col md:flex-row items-center p-4 bg-gray-400/20 rounded-b-2xl'>
        <div
        className='absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-slate-400 to-[#176cbd] rounded-md filter blur-3xl opacity-50 -z-50'/>
      <Image src="/Trello logo.png"
      alt="Trello logo"
      width={300}
      height={100}
      className='w-44 md:w-56 pb-10 md:pb-0 object-contain'
      />

      <div className='flex items-center space-x-5 flex-1 justify-end w-full'>
        {/* search box */}
        <form className='flex items-center space-x-5 bg-white r rounded-md p-2 shadow-md flex-1 md:flex-initial'>
          <MagnifyingGlassIcon className='h-6 w-6 text-gray-400'/>
          <input 
          type='text' 
          placeholder='Search' 
          className='flex-1 outline-none'
          onChange={(e) => setSearchString(e.target.value)}/>
          <button hidden type='submit'>Search</button>
        </form>

        {/* avatar */}
        <Avatar name="Soumyadeep Nayak" round size='50' color='#176cbd'/>
        
      </div>
      </div>

      <div className='flex items-center justify-center px-5 py-2  md:py-5'>
        <p className='flex items-center p-5 text-sm font-light pr-5 shadow-xl rounded-xl bg-white italic max-w-3xl text-[#176cbd]'>
          <UserCircleIcon className={`inline-block h-10 w-10 text-[#176cbd] ${loading && "animate-spin"}`} />
          {!loading && suggestion ? suggestion : `GPT is summarizing your day...`}
        </p>
      </div>

    </header>
  )
}

export default Header