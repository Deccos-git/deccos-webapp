import LeftSideBar from "../LeftSideBar";
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import Location from "../../hooks/Location"
import MenuStatus from "../../hooks/MenuStatus";
import { useHistory } from "react-router-dom";
import { client } from "../../hooks/Client"
import plusIcon from '../../images/icons/plus-icon.png'
import groupIcon from '../../images/icons/group-icon.png'
import { useFirestore, useFirestoreResults } from "../../firebase/useFirestore"
import { db } from "../../firebase/config.js"
import penIcon from '../../images/icons/pen-icon.png'
import { NavLink } from "react-router-dom";
import { useState, useEffect, useContext } from 'react'
import ScrollToTop from "../../hooks/ScrollToTop";

const Impacthub = () => {
    const [ID, setID] = useState('')

    const menuState = MenuStatus()
    const history = useHistory()
    ScrollToTop()

    const compagnies = useFirestore('CompagnyMeta')
    const followers = useFirestore("FollowsImpacthub")

    useEffect(() => {
        compagnies && compagnies.forEach(comp => {
            setID(comp.ID)
        })
    },[compagnies])

    const showFollowers = () => {
        if(followers.length === 0){
            return 'block'
        } else {
            return 'none'
        }
    } 

  return (
    <div className="main">
    <LeftSideBar />
    <LeftSideBarFullScreen/>
    <div className="main-container" style={{display: menuState}}>
        <div className='page-header'>
            <h1>Impactclub</h1>
                <div className='edit-icon-header-container'>
                    <NavLink activeClassName='active' to={`/${client}/Impactclub`}>
                        <img src={penIcon} alt="" />
                    </NavLink>
                </div>
        </div>
        <div className='profile profile-auth-profile'>
            {compagnies && compagnies.map(comp => (
                <div className='impactclub-banner-container'>
                    <img src={comp.ImpactBanner} alt="" />
                </div>
            ))}
            <div className='goal-meta-inner-container'>
                <div className='goal-meta-title-container'>
                    <img src={groupIcon} alt="" />
                    <h3>Volgers</h3>
                </div>
                <div className='list-container table-container-impactclub'>
                    <table>
                        <tr>
                            <th>NAAM</th>
                        </tr>
                        <tr style={{display: showFollowers()}}>
                            <td>Nog geen volgers</td>
                        </tr>
                        {followers && followers.map(follower => (
                        <tr>
                            <td>{follower.User}</td>
                        </tr>                               
                    ))}
                    </table>
                </div>
            </div>
            <div className='button-container button-container-impactclub'>
                <a href={`https://deccos.nl/OrganisationDetail/${client}/${ID}`} target='_blank'><button>Bekijk profiel</button></a>
            </div>
        </div>
    </div>
</div>
  )
}

export default Impacthub