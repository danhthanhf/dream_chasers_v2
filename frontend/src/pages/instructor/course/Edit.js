import { useParams } from "react-router-dom";
import InstructorCreateCourse from "./Create";

function InstructorEditCourse() {
    const { id } = useParams();
    return (
        <div>
            <InstructorCreateCourse
                isEdit
                courseId={id}
            ></InstructorCreateCourse>
        </div>
    );
}

export default InstructorEditCourse;
