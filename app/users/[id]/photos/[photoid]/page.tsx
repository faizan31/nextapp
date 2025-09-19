import React from 'react'

interface Props{
    params:{id:number,photoId:number}
}
const photoPage = ({params:{id,photoId}}:Props) => {
  return (
    <div>
      photoPage {id}{photoId}
    </div>
  )
}

export default photoPage
