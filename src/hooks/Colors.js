import {useState, useEffect } from 'react';
import { useFirestore } from "../firebase/useFirestore"

const Colors = () => {

    const [backgroundColor, setBackgroundColor] = useState('')
    const [topBarColor, setTopBarColor] = useState('')
    const [topBarIconsColor, setTopBarIconsColor] = useState('')

    const colors = useFirestore("Colors")

    useEffect(() => {
        colors && colors.forEach(color => {
            setBackgroundColor(color.Background)
            setTopBarColor(color.Topbar)
            setTopBarIconsColor(color.TopbarIcons)
        })

    },[colors])

    const colorObject = {
        BackgroundColor: backgroundColor, 
        TopBarColor: topBarColor,
        TopBarIconsColor: topBarIconsColor
    }

    return colorObject

}

export default Colors
