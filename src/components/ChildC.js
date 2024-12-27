import React, { useContext } from 'react'
import {userContext} from '../App'
export default function ChildC() {
    const user=useContext(userContext);
    console.log(user);
    
  return (
    <div>
      <p>{user}</p>
    </div>
  )
}
