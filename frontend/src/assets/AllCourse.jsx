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
                <div className="flex justify-between items-center mt-4 border-t border-gray-100 pt-3">
                    <span className="text-blue-600 font-bold">₹{courseprop.price}</span>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors">
                        Enroll Now
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AllCourses;