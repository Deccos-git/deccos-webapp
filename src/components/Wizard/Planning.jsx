import LeftSideBar from "../LeftSideBar";
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import MenuStatus from "../../hooks/MenuStatus";
import dayjs from 'dayjs'
import { useFirestore, useFirestoreMeasureMoments } from "../../firebase/useFirestore"
import { useState, useEffect } from "react";
import { client } from '../../hooks/Client';
import { db, timestamp } from "../../firebase/config.js"
import ScrollToTop from "../../hooks/ScrollToTop";

const Planning = () => {

  const researches = useFirestore('Research')

  const menuState = MenuStatus() 
  ScrollToTop()


    const year = dayjs().year()
    const month = dayjs().month()
    console.log(month)



   
  return (
    <div className="main">
        <LeftSideBar />
        <LeftSideBarFullScreen/>
        <div className="main-container" style={{display: menuState}}>
            <div className='page-header'>
                <h1>Planning</h1>
            </div>
            
        </div>  
    </div>
  )
}

export default Planning