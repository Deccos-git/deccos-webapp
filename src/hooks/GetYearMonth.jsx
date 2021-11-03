const currentMonth = new Date().getMonth()
const currentYear = new Date().getFullYear()

const GetMonthYear = () => {
    if(currentMonth === 0){
        return `Januari ${currentYear}` 
    } else if (currentMonth === 1){
        return `Februari ${currentYear}` 
    } else if (currentMonth === 2){
        return `Maart ${currentYear}` 
    } else if (currentMonth === 3){
        return `April ${currentYear}` 
    } else if (currentMonth === 4){
        return `Mei ${currentYear}` 
    } else if (currentMonth === 5){
        return `Juni ${currentYear}` 
    } else if (currentMonth === 6){
        return `Juli ${currentYear}` 
    } else if (currentMonth === 7){
        return `Augustus ${currentYear}` 
    } else if (currentMonth === 8){
        return `September ${currentYear}` 
    } else if (currentMonth === 9){
        return `Oktober ${currentYear}` 
    } else if (currentMonth === 10){
        return `November ${currentYear}` 
    } else if (currentMonth === 11){
        return `December ${currentYear}` 
    }
}

export default GetMonthYear