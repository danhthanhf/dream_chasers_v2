import * as React from "react";

function CourseSection() {
    return (
        <section className="flex flex-wrap gap-5 mx-auto max-w-screen-xl max-sm:px-3 md:px-6 text-start mt-10 items-center">
            <div className="flex flex-col flex-1">
                <h2 className="text-2xl md:text-4xl font-semibold leading-tight md:leading-snug text-neutral-800">
                    Our Courses
                </h2>
                <p className="mt-1 text-sm md:text-base leading-snug md:leading-normal text-zinc-600">
                    There will be more investment in terms of in-depth
                    knowledge, the quality of teaching, and many valuable
                    things.
                </p>
            </div>
        </section>
    );
}

export default CourseSection;
