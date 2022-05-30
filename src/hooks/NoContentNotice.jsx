import { useHistory } from "react-router-dom"
import { client } from "./Client"
import {ReactComponent as MagicIcon}  from '../images/icons/magic-icon.svg'

const NoContentNotice = (check, linkItem) => {

    const history = useHistory()

    const guideLink = () => {
        history.push(`/${client}/${linkItem}`)
    }

    return(

        <div className='empty-page-container' style={{display: check.length === 0 ? 'flex' : 'none'}}>
            <div className='no-content-container' onClick={guideLink}>
                <MagicIcon/>
                <p onClick={guideLink}>Bekijk <b>Deccos Impact Guide</b></p>
            </div>
        </div>

    )
}

export default NoContentNotice