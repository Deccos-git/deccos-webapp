import '../CSS/leftSideBar.css';
import { NavLink, Link } from "react-router-dom";
import { client } from '../hooks/Client';
import { useFirestore } from '../firebase/useFirestore';
import { useState , useEffect, useContext} from 'react';
import { Auth } from '../StateManagment/Auth';

const LeftSideBar = () => {
    const [authO] = useContext(Auth)

    const [impacteer, setImpacteer] = useState('none')

    const groups = useFirestore("Groups")
    const channels = useFirestore("Channels")
    const impacteers = useFirestore('Impacteers')
    const admins = useFirestore('Admins')

    useEffect(() => {
        impacteers && impacteers.forEach(impacteer => {
            if(impacteer.UserID === authO.ID){
                setImpacteer('block')
            }
        })
    }, [impacteers])

    useEffect(() => {
        admins && admins.forEach(admin => {
            if(admin.UserID === authO.ID){
                setImpacteer('block')
            }
        })
    }, [admins])

    return (
        <div className="left-sidebar-container">
            <div className="left-side-bar">
                <div className="channel-div">
                    <h3>Welkom</h3>
                    <div className="channel-inner-div">
                        <NavLink activeClassName='active' to={`/${client}/Start`} >Start hier</NavLink>
                        <NavLink activeClassName='active' to={`/${client}/Introductions`} >Stel je voor</NavLink>
                        <NavLink activeClassName='active' to={`/${client}/AllActivity`} >Alle activiteit</NavLink>
                    </div>
                </div>
                <div className="channel-div" style={{display: impacteer}}>
                    <div className="nav-title-container">
                        <h3>Impact</h3>
                    </div>
                    <div className="channel-inner-div">
                        <NavLink activeClassName='active' to={`/${client}/Goals`}>Doelen</NavLink>
                    </div>
                    <div className="channel-inner-div">
                        <NavLink activeClassName='active' to={`/${client}/Activities`}>Activiteiten</NavLink>
                    </div>
                </div>
                <div className="channel-div">
                    <div className="nav-title-container">
                        <h3>Kanalen</h3>
                    </div>
                    {channels && channels.map(channel => (
                        <div className="channel-inner-div" key={channel.ID}>
                            <NavLink activeClassName='active' to={`/${client}/${channel.Link}/${channel.ID}`}>{channel.Name}</NavLink>
                        </div>
                    ))}
                </div>
                <div className="channel-div">
                    <div className="nav-title-container">
                        <h3>Groepen</h3>
                    </div>
                    {groups && groups.map(group => (
                        <div className="channel-inner-div" key={group.ID}>
                            <NavLink activeClassName='active' to={`/${client}/GroupLanding/${group.ID}`}>{group.Room}</NavLink>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default LeftSideBar
