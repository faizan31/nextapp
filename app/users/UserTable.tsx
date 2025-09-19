import Link from 'next/link';
import React from 'react';
import { sort } from "fast-sort";

interface User {
    id: number;
    name: string;
    email:string;

  }
  interface Props{
    sortOrder:string
  }




const UserTableNew = async ({sortOrder}:Props) => {
    const res = await fetch( "https://jsonplaceholder.typicode.com/users",);
    const users: User[] = await res.json();

    const sortedUsers = sort(users).asc(
      sortOrder === "email"
        ? (user) => user.email
        : (user) => user.name
    );

  return (
    <>
    
    <table className='table table-bordered'>
        <tr>
            <thead>
              <th>
                <Link href="/users/new?sortOrder=name">Name</Link></th>
              <th><Link href="/users/new?sortOrder=email">Email</Link></th>
            
            </thead>
           
        </tr>
        <tbody>
      {sortedUsers.map(user=><tr key={user.id}><td>{user.name}</td><td>{user.email}</td></tr>)}
      </tbody>
      </table>
    </>
      
    
  )
}

export default UserTableNew
