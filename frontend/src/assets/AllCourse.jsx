import axios from "axios";
import { useEffect, useState } from "react";

function AllCourses() {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        async function fetchCourses() {
            try {
                const response = await axios.get("http://127.0.0.1:3000/course/preview");
                setCourses(response.data.courses);
            } catch (error) {
                console.error("Error in fetching courses: ", error);
            }
        }
        fetchCourses();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">All Courses</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {courses.map((course) => (
                    <CardComponent key={course._id} courseprop={course} />
                ))}
            </div>
        </div>
    );
}

function CardComponent({ courseprop }) {
    const [isPurchasing, setIsPurchasing] = useState(false)
    const [purchaseMessage, setPurchasingMessage] = useState('')
    const [error,setError] = useState('')

    const handlePurchase = async ()=>{
        setPurchasingMessage(true)
        setError('')
        setPurchasingMessage('')

        try{
            const response = await axios.post('http://localhost:3000/user/purchases',
                {courseId: courseprop._id},
                {withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                setPurchasingMessage(response.data);
                console.log(courseprop._id)
        }
        catch(error)
        {
            setError(error.response?.data?.message || 'Purchase failed. Please try again.')
        }finally{
            setIsPurchasing(false)
        }
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            {/* Course Image */}
            <div className="relative h-48 overflow-hidden">
                <img 
                    src={courseprop.imageUrl || "https://via.placeholder.com/300x200"} 
                    alt={courseprop.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    New
                </span>
            </div>
            
            {/* Course Content */}
            <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                    {courseprop.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {courseprop.description}
                </p>
                
                {/* Footer with price and button */}
                <div className="flex flex-col gap-2 mt-4 border-t border-gray-100 pt-3">
                    <span className="text-blue-600 font-bold">₹{courseprop.price}</span>
                    
                    {purchaseMessage && (
                        <div className="text-green-600 text-sm">{purchaseMessage}</div>
                    )}
                    
                    {error && (
                        <div className="text-red-600 text-sm">{error}</div>
                    )}
                    
                    <button 
                        onClick={handlePurchase}
                        disabled={isPurchasing}
                        className={`bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium transition-colors ${
                            isPurchasing ? 'opacity-75 cursor-not-allowed' : ''
                        }`}
                    >
                        {isPurchasing ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </span>
                        ) : 'Enroll Now'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AllCourses;