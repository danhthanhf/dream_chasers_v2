const validateForm = (formData) => {
    const errors = {};
    if (!formData.title) errors.title = "Course Name is required.";
    if (!formData.description) errors.description = "Description is required.";
    if (!formData.price) errors.price = "Price is required.";
    if (!formData.thumbnail) errors.thumbnail = "Thumbnail is required.";
    if (formData.categories.length === 0)
        errors.categories = "At least one category is required.";

    formData.sections.forEach((section, sectionIndex) => {
        if (!section.title)
            errors[`section-${sectionIndex}`] = `Section ${
                sectionIndex + 1
            } Name is required.`;
        section.lessons?.forEach((lesson, lessonIndex) => {
            if (!lesson.title)
                errors[`lesson-${sectionIndex}-${lessonIndex}`] = `Lesson ${
                    lessonIndex + 1
                } Name is required in Section ${sectionIndex + 1}.`;
            if (!lesson.description)
                errors[
                    `lesson-desc-${sectionIndex}-${lessonIndex}`
                ] = `Lesson ${
                    lessonIndex + 1
                } Description is required in Section ${sectionIndex + 1}.`;
        });
    });

    return errors;
};
export default validateForm;
