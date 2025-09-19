import React from 'react'

interface Props{
    params:{id:number}
}
const UserdetailPage = ({params:{id}}:Props) => {
  return (
    <div>
      <h3>UserDetail page {id}</h3>
    </div>
  )
}

export default UserdetailPage
