import { useHistory } from "react-router-dom"
import { client } from "./Client"
import {ReactComponent as MagicIcon}  from '../images/icons/magic-icon.svg'
import { useEffect, useState } from 'react';

const NoContentNotice = (check, linkItem) => {
    const [showNotice, setShownotice] = useState('none')

    const history = useHistory()

    const guideLink = () => {
        history.push(`/${client}/${linkItem}`)
    }
            
    setTimeout(() => {
        if(check.length === 0){
            setShownotice('flex') 
        } else{
            setShownotice('none') 
        }
    },500)

    return(
        <div className='empty-page-container' style={{display: showNotice}}>
            <h1>Het is hier nog leeg.</h1>
            <p>De Deccos Impact Guide helpt je om de volgende stap te zetten in het impact management proces.</p>
            <div className='no-content-container' onClick={guideLink}>
                <MagicIcon/>
                <p onClick={guideLink}>Bekijk <b>Deccos Impact Guide</b></p>
            </div>
        </div>
    )
}

export default NoContentNotice