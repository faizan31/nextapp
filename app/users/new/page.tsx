import React from 'react'
import Link from 'next/link'
import UserTableNew from '../UserTable';

interface Props{
  searchParams:{sortOrder:string}
}

  const UserPage = async ({searchParams:{sortOrder}}:Props) => {
   
  
    return (
      <>
      <h1>Users</h1>
      <Link href="/users/new" className='btn'>New User</Link>
     
    <UserTableNew sortOrder={sortOrder} />
      </>
    );
}

export default UserPage
