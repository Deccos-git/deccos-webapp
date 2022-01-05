import '../CSS/leftSideBar.css';
import { Link } from "react-router-dom";
import { client } from '../hooks/Client';
import { useFirestore } from '../firebase/useFirestore';
import { MobileMenu } from '../StateManagment/MobileMenu';
import { motion } from "framer-motion"
import { useState , useEffect, useContext} from 'react';
import { Auth } from '../StateManagment/Auth';

const LeftSideBarFullScreen = () => {
    const [menu, setMenu] = useContext(MobileMenu)
    const [authO] = useContext(Auth)

    const [impacteer, setImpacteer] = useState('none')
    const [displayWelcome, setDisplayWelcome] = useState('')
    const [displayImpact, setDisplayImpact] = useState('')
    const [displayChannels, setDisplayChannels] = useState('')
    const [displayGroups, setDisplayGroups] = useState('')

    const groups = useFirestore("Groups")
    const channels = useFirestore("Channels")
    const impacteers = useFirestore('Impacteers')
    const admins = useFirestore('Admins')
    const compagny = useFirestore("CompagnyMeta")

    useEffect(() => {
        compagny && compagny.forEach(comp => {
            setDisplayWelcome(comp.Welcome)
            setDisplayImpact(comp.Impact)
            setDisplayChannels(comp.Channels)
            setDisplayGroups(comp.Groups)
        })
    },[compagny])

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

    const changeMenuStatus = () => {
        setMenu("none")
    }

    const showImpact = () => {
        if(displayImpact === true  && impacteer === 'block'){
            return 'block'
        } else if (displayImpact === false  && impacteer === 'block') {
            return 'none'
        } else if (displayImpact === false  && impacteer === 'none') {
            return 'none'
        }
    }

    const showWelcome = () => {
        if(displayWelcome === true){
            return 'block'
        } else if (displayWelcome === false ) {
            return 'none'
        }
    }

    const showGroups = () => {
        if(displayGroups === true){
            return 'block'
        } else if (displayGroups === false ) {
            return 'none'
        }
    }

    const showChannels = () => {
        if(displayChannels === true){
            return 'block'
        } else if (displayChannels === false ) {
            return 'none'
        }
    }

    return (
        <div 
        className="left-sidebar-container-mobile" 
        style={{display: menu}}>
            <div className="left-side-bar-full-screen">
                <div className="channel-div" style={{display: showWelcome()}}>
                    <h3>Welkom</h3>
                    <div className="channel-inner-div">
                        <Link to={`/${client}/Start`} onClick={changeMenuStatus} >Start hier</Link>
                        <Link to={`/${client}/Introductions`} onClick={changeMenuStatus} >Stel je voor</Link>
                        <Link to={`/${client}/AllActivity`} onClick={changeMenuStatus} >Alle activiteit</Link>
                    </div>
                </div>
                <div className="channel-div" style={{display: showChannels()}}>
                    <div className="nav-title-container">
                        <h3>Kanalen</h3>
                    </div>
                    {channels && channels.map(channel => (
                        <div className="channel-inner-div"  key={channel.ID}>
                            <Link to={`/${client}/${channel.Link}/${channel.ID}`} onClick={changeMenuStatus}>{channel.Name}</Link>
                        </div>
                    ))}
                </div>
                <div className="channel-div" style={{display: showGroups()}}>
                    <div className="nav-title-container">
                        <h3>Groepen</h3>
                    </div>
                    {groups && groups.map(group => (
                        <div className="channel-inner-div" key={group.ID}>
                            <Link to={`/${client}/GroupLanding/${group.ID}`} onClick={changeMenuStatus}>{group.Room}</Link>
                        </div>
                    ))}
                </div>
                <div className="channel-div" style={{display: showImpact()}}>
                    <div className="nav-title-container">
                        <h3>Projectbeheer</h3>
                    </div>
                    <div className="channel-inner-div">
                        <Link to={`/${client}/Goals`} onClick={changeMenuStatus}>Doelen</Link>
                    </div>
                    <div className="channel-inner-div">
                        <Link to={`/${client}/Activities`} onClick={changeMenuStatus}>Activiteiten</Link>
                    </div>
                    <div className="channel-inner-div">
                        <Link to={`/${client}/Tasks/${authO.ID}`} onClick={changeMenuStatus}>Taken</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LeftSideBarFullScreen
