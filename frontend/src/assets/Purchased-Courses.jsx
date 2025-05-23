import axios from "axios"
import { useEffect, useState } from "react"

function puechasedCourses()
{
    const [course, setCourses] = useState({})

    useEffect(async function handelClick(e)=>{
        const courseData = await axios.get("http://127.0..0.1:5173")
    })
    return (<div>
        purchased courses are here
    </div>)
}