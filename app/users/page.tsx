'use client'
import { useRouter } from 'next/navigation'
import React, { useReducer } from 'react'


const Users = () => {
 const router= useRouter();
  return (
    <>
        <button className='btn btn-primary' onClick={()=>router.push('/users/new')}>Create</button>
      
      
    </>
  )
}

export default Users
