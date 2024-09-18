import "bootstrap/dist/css/bootstrap.min.css";
import clsx from "clsx";
import styles from "../create/CreateCourse.module.scss";
import fileSelect from "../../../../assets/images/fileSelect.svg";
import { useEffect, useState } from "react";
import Select from "react-select";
import * as DataApi from "../../../../api/apiService/dataService";
import { toast } from "sonner";
import btnClose from "../../../../assets/images/btnClose.svg";
import { useParams } from "react-router-dom";
import makeAnimated from "react-select/animated";
import validateForm from "../../../../component/validation";
const animatedComponents = makeAnimated();

const initFormData = {
    id: "",
    title: "",
    description: "",
    price: "",
    thumbnail: "",
    video: "",
    date: "",
    sections: [],
    categories: [],
};

function EditCourse() {
    const [formData, setFormData] = useState(initFormData);
    const [options, setOptions] = useState([]);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const { id } = useParams();

    let timerId;

    //!NOTE: ============================START HANDLE ===================================

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        errors[name] = "";
        setErrors(errors);
    };

    const handleFileChange = (e, index, indexSection) => {
        const file = e.target.files[0];
        setIsLoading((prev) => true);
        toast.promise(DataApi.uploadImg(file), {
            loading: "Loading file...",
            success: (result) => {
                setIsLoading((prev) => false);
                if (file.type === "video/mp4") {
                    const updateSection = {
                        ...formData.sections[indexSection],
                    };
                    updateSection.lessons[index] = {
                        ...updateSection.lessons[index],
                        video: result.content,
                    };
                    const updateSections = [...formData.sections];
                    updateSections[indexSection] = updateSection;

                    setFormData({
                        ...formData,
                        sections: [...updateSections],
                    });
                } else {
                    setFormData({
                        ...formData,
                        thumbnail: result.content,
                    });
                }
                return "Uploading successfully...";
            },
            error: (error) => {
                console.log(error);
                return "Upload file failed";
            },
        });
        e.target.value = "";
        errors[e.target.name] = "";
        setErrors(errors);
    };

    const handleUpdateVideoCourse = (e) => {
        setIsLoading((prev) => true);
        toast.promise(DataApi.uploadImg(e.target.files[0]), {
            loading: "Loading video...",
            success: (result) => {
                setIsLoading((prev) => false);

                setFormData({ ...formData, video: result.content });
                return "Upload video successfully";
            },
            error: (error) => {
                console.log(error);
                return "Upload video failed";
            },
        });
    };

    const handleSelectChange = (e) => {
        setFormData({
            ...formData,
            categories: [...e],
            isEditedCategories: 1,
        });
    };

    const handleRemoveItemPrevivew = (e, type, index, sectionIndex) => {
        if (type === "video") {
            const updateSection = { ...formData.sections[sectionIndex] };
            updateSection.lessons[index] = {
                ...updateSection.lessons[index],
                video: null,
                actionVideo: "NONE",
            };
            const updateSections = [...formData.sections];
            updateSections[sectionIndex] = { ...updateSection };
            setFormData({ ...formData, sections: [...updateSections] });
        } else setFormData({ ...formData, thumbnail: "" });
        e.target.value = "";
    };

    const handleAddLesson = (sectionIndex) => {
        let lesson = {
            title: "",
            description: "",
            video: "",
            linkVideo: "",
        };
        const updateSection = { ...formData.sections[sectionIndex] };
        updateSection.lessons.push(lesson);
        const updateSections = [...formData.sections];
        updateSections[sectionIndex] = updateSection;

        setFormData({
            ...formData,
            sections: [...updateSections],
        });
    };

    const handleInputLessonChange = (e, index, sectionIndex) => {
        const { name, value } = e.target;
        let updateSection = {
            ...formData.sections[sectionIndex],
        };
        updateSection = {
            ...updateSection,
            isEdited: 1,
        };
        const updateSections = [...formData.sections];
        updateSection.lessons[index] = {
            ...updateSection.lessons[index],
            [name]: value,
        };
        updateSections[sectionIndex] = { ...updateSection };

        errors[name] = "";
        setErrors(errors);

        setFormData({
            ...formData,
            sections: [...updateSections],
        });
    };

    const handleCreateSection = () => {
        const newSection = {
            title: "",
            lessons: [],
        };

        const newSections = [...formData.sections];
        newSections.push(newSection);
        setFormData({ ...formData, sections: [...newSections] });
    };

    const handleInputSectionChange = (e, sectionIndex) => {
        let updateSection = formData.sections[sectionIndex];
        updateSection = {
            ...updateSection,
            title: e.target.value,
            isEdited: 1,
        };
        const updateSections = [...formData.sections];
        updateSections[sectionIndex] = updateSection;
        setFormData({ ...formData, sections: [...updateSections] });
    };

    const handleRemoveSection = (index) => {
        const updateSections = [...formData.sections];
        updateSections.splice(index, 1);
        setFormData({
            ...formData,
            sections: updateSections,
        });
    };

    const handleRemoveLesson = (index, sectionId) => {
        var newSection = { ...formData.sections[sectionId] };
        newSection.lessons.splice(index, 1);
        var newSections = [...formData.sections];
        newSections[sectionId] = newSection;
        setFormData({ ...formData, sections: newSections });
    };
    const handleRemoveVideoCourse = (e) => {
        setFormData({ ...formData, video: "" });
    };

    //!NOTE: ========================END HANDLE ====================================

    //!======================================NOTE SUBMIT ========================
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLoading) return toast.error("Please wait for the file to upload");
        const validationErrors = validateForm(formData);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            toast.error("You need to fill in the empty field");
            return;
        }

        const featchApi = async () => {
            let newCategories = [];
            formData.categories.forEach((cate) => newCategories.push(cate.id));
            const newCourse = {
                ...formData,
                categories: newCategories,
            };

            toast.promise(DataApi.updateCourse(id, newCourse), {
                loading: "Loading...",
                success: (result) => {
                    return "Update successfully";
                },
                error: (error) => {
                    console.log(error);
                    return error;
                },
            });
        };

        const debounceApi = debounce(featchApi);
        debounceApi();
    };

    const debounce = (func, delay = 600) => {
        return () => {
            clearTimeout(timerId);

            timerId = setTimeout(() => {
                func();
            }, delay);
        };
    };

    //!NOTE========================== USEFFECT ====================================
    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = await DataApi.getAllCategories();
                setOptions(result.content.content);
                const data = await DataApi.getCourseById(id);
                console.log(data);
                setFormData(data.content);
            } catch (error) {
                console.log(error);
            }
        };
        fetchApi();
    }, [id]);

    return (
        <div className="flex justify-center w-full ">
            <div className="wrapMainDash mr-auto w-3/4 ">
                <h3 className="titleMainDash">Edit</h3>
                <div
                    className={clsx(
                        styles.formGroup,
                        "flex gap-6 flex-col rounded-lg"
                    )}
                >
                    <div className={clsx(styles.formField)}>
                        <input
                            onChange={handleInputChange}
                            value={formData.title}
                            name="title"
                            className={clsx(styles.formInput)}
                            type="text"
                        />
                        <label className={clsx(styles.formLabel)}>
                            Course Name
                        </label>
                        {errors.title && (
                            <div className="text-red-500 mt-1 text-sm ml-1">
                                {errors.title}
                            </div>
                        )}
                    </div>
                    <div className={clsx(styles.formField)}>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className={clsx(styles.formInput, "h-22")}
                            type="text"
                        />
                        <label
                            className={clsx(styles.formLabel, styles.descInput)}
                        >
                            Description
                        </label>
                        {errors.description && (
                            <div className="text-red-500 mt-1 text-sm ml-1">
                                {errors.description}
                            </div>
                        )}
                    </div>
                    <div className={clsx("flex")}>
                        <div className={clsx(styles.formField, "w-1/2 mr-9")}>
                            <Select
                                isMulti
                                components={animatedComponents}
                                onChange={handleSelectChange}
                                getOptionLabel={(x) => x.name}
                                getOptionValue={(x) => x.id}
                                value={formData.categories}
                                options={options}
                                styles={{
                                    control: (baseStyles, state) => ({
                                        ...baseStyles,
                                        borderColor: state.isFocused
                                            ? "black"
                                            : "#e9ecee",
                                    }),
                                }}
                            />
                            <label className={clsx(styles.formLabel)}>
                                Category
                            </label>
                            {errors.categories && (
                                <div className="text-red-500 mt-1 text-sm ml-1">
                                    {errors.categories}
                                </div>
                            )}
                        </div>
                        <div className={clsx(styles.formField, "w-1/2")}>
                            <input
                                name="price"
                                onChange={handleInputChange}
                                value={formData.price}
                                min="0"
                                className={clsx(styles.formInput)}
                                type="number"
                            />
                            <label className={clsx(styles.formLabel)}>
                                Price
                            </label>
                            {errors.price && (
                                <div className="text-red-500 mt-1 text-sm ml-1">
                                    {errors.price}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex">
                        <div
                            className={clsx(
                                styles.formField,
                                "w-1/2 overflow-hidden"
                            )}
                        >
                            <span className={clsx(styles.formLabel2)}>
                                Thumbnail
                            </span>
                            <label
                                htmlFor="thumbnail"
                                className={clsx(
                                    styles.formLabel2,
                                    styles.labelFile
                                )}
                            >
                                <div className={clsx(styles.iconFile)}>
                                    <img
                                        loading="lazy"
                                        src={fileSelect}
                                        alt=""
                                    />
                                </div>
                            </label>

                            <input
                                name="thumbnail"
                                onChange={handleFileChange}
                                id="thumbnail"
                                type="file"
                                hidden
                            />
                        </div>
                        <div
                            className={clsx(
                                styles.formField,
                                "w-1/2 mt-8 ml-9"
                            )}
                        >
                            {formData.thumbnail && (
                                <div className={clsx(styles.imgField)}>
                                    <img
                                        loading="lazy"
                                        className={clsx(styles.thumbnailImg)}
                                        src={formData.thumbnail}
                                        alt=""
                                    />
                                    <button
                                        onClick={(e) =>
                                            handleRemoveItemPrevivew(e)
                                        }
                                        className={clsx(styles.btnClosePreview)}
                                    >
                                        {" "}
                                        <img
                                            loading="lazy"
                                            src={btnClose}
                                            alt=""
                                        />{" "}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex">
                        <div
                            className={clsx(
                                styles.formField,
                                "w-1/2 overflow-hidden"
                            )}
                        >
                            <span className={clsx(styles.formLabel2)}>
                                Video
                            </span>
                            <label
                                htmlFor={`courseVideo`}
                                className={clsx(
                                    styles.formLabel2,
                                    styles.labelFile,
                                    "h-full"
                                )}
                            >
                                <div className={clsx(styles.iconFile)}>
                                    <img
                                        loading="lazy"
                                        src={fileSelect}
                                        alt=""
                                    />
                                </div>
                            </label>
                            <input
                                name="video"
                                onChange={handleUpdateVideoCourse}
                                id={`courseVideo`}
                                type="file"
                                hidden
                                accept=".mp4"
                            />
                        </div>
                        <div
                            className={clsx(
                                styles.formField,
                                "w-1/2 mt-8 ml-9"
                            )}
                        >
                            {formData.video && (
                                <div className={clsx(styles.videoField)}>
                                    <video
                                        key={formData.video}
                                        controls
                                        className="rounded-lg"
                                    >
                                        <source
                                            src={formData.video}
                                            type="video/mp4"
                                        />
                                    </video>
                                    <button
                                        className={clsx(styles.btnClosePreview)}
                                        onClick={(e) =>
                                            handleRemoveVideoCourse(e)
                                        }
                                    >
                                        {" "}
                                        <img
                                            loading="lazy"
                                            src={btnClose}
                                            alt=""
                                        />{" "}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/*NOTE Lesson */}

                    <div className={clsx(styles.lessonArea)}>
                        {formData.sections &&
                            formData.sections.map((section, sectionIndex) => {
                                const lessons = section.lessons;
                                return (
                                    <div
                                        className={clsx("mt-1 flex flex-col")}
                                        key={sectionIndex}
                                    >
                                        <div
                                            className={clsx(
                                                styles.sectionName,
                                                "text-center  font-semibold"
                                            )}
                                        >
                                            Section {sectionIndex + 1}
                                        </div>
                                        <div
                                            className="justify-end px-3 py-1.5 text-sm cursor-pointer font-medium text-center text-white bg-black rounded-lg max-md:max-w-1/5 w-1/5 self-end"
                                            onClick={() => {
                                                handleRemoveSection(
                                                    sectionIndex
                                                );
                                            }}
                                        >
                                            {" "}
                                            Remove section
                                        </div>
                                        <div
                                            className={clsx(
                                                styles.formField,
                                                "mt-4"
                                            )}
                                        >
                                            <input
                                                data-section="1"
                                                name={`title`}
                                                onChange={(e) => {
                                                    handleInputSectionChange(
                                                        e,
                                                        sectionIndex
                                                    );
                                                }}
                                                value={section.title}
                                                className={clsx(
                                                    styles.formInput
                                                )}
                                                type="text"
                                            />
                                            <label
                                                className={clsx(
                                                    styles.formLabel
                                                )}
                                            >
                                                Section Name
                                            </label>
                                            {errors[
                                                `section-${sectionIndex}`
                                            ] && (
                                                <div className="text-red-500 mt-1 text-sm ml-1">
                                                    {
                                                        errors[
                                                            `section-${sectionIndex}`
                                                        ]
                                                    }
                                                </div>
                                            )}
                                        </div>
                                        {lessons &&
                                            lessons.map((lesson, index) => {
                                                return (
                                                    <div
                                                        key={index}
                                                        className={clsx(
                                                            styles.lessonField,
                                                            "gap-6 flex flex-col mt-4"
                                                        )}
                                                    >
                                                        <div
                                                            className={clsx(
                                                                styles.formField,
                                                                "flex justify-between"
                                                            )}
                                                        >
                                                            <div className="self-center  font-semibold">
                                                                Lesson{" "}
                                                                {index + 1}
                                                            </div>

                                                            <div
                                                                className="justify-center px-3 py-1.5 text-sm cursor-pointer font-medium text-center text-white bg-black rounded-lg max-md:max-w-1/5 w-1/5 self-center"
                                                                onClick={() => {
                                                                    handleRemoveLesson(
                                                                        index,
                                                                        sectionIndex
                                                                    );
                                                                }}
                                                            >
                                                                {" "}
                                                                Remove lesson
                                                            </div>
                                                        </div>
                                                        <div
                                                            className={clsx(
                                                                styles.formField
                                                            )}
                                                        >
                                                            <input
                                                                data-section="1"
                                                                name={`title`}
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    handleInputLessonChange(
                                                                        e,
                                                                        index,
                                                                        sectionIndex
                                                                    );
                                                                }}
                                                                value={
                                                                    lesson.title
                                                                }
                                                                className={clsx(
                                                                    styles.formInput
                                                                )}
                                                                type="text"
                                                            />
                                                            <label
                                                                className={clsx(
                                                                    styles.formLabel
                                                                )}
                                                            >
                                                                Lesson Name
                                                            </label>
                                                            {errors[
                                                                `lesson-${sectionIndex}-${index}`
                                                            ] && (
                                                                <div className="text-red-500 mt-1 text-sm ml-1">
                                                                    {
                                                                        errors[
                                                                            `lesson-${sectionIndex}-${index}`
                                                                        ]
                                                                    }
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div
                                                            className={clsx(
                                                                styles.formField
                                                            )}
                                                        >
                                                            <textarea
                                                                name="description"
                                                                value={
                                                                    lesson.description
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    handleInputLessonChange(
                                                                        e,
                                                                        index,
                                                                        sectionIndex
                                                                    );
                                                                }}
                                                                className={clsx(
                                                                    styles.formInput,
                                                                    "h-22"
                                                                )}
                                                                type="text"
                                                            />
                                                            <label
                                                                className={clsx(
                                                                    styles.formLabel,
                                                                    styles.descInput
                                                                )}
                                                            >
                                                                Description
                                                            </label>
                                                            {errors[
                                                                `lesson-desc-${sectionIndex}-${index}`
                                                            ] && (
                                                                <div className="text-red-500 mt-1 text-sm ml-1">
                                                                    {
                                                                        errors[
                                                                            `lesson-desc-${sectionIndex}-${index}`
                                                                        ]
                                                                    }
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex">
                                                            <div
                                                                className={clsx(
                                                                    styles.formField,
                                                                    "w-1/2"
                                                                )}
                                                            >
                                                                <span
                                                                    className={clsx(
                                                                        styles.formLabel2
                                                                    )}
                                                                >
                                                                    Video
                                                                </span>
                                                                <label
                                                                    htmlFor={`video${section.title}${index}`}
                                                                    className={clsx(
                                                                        styles.formLabel2,
                                                                        styles.labelFile
                                                                    )}
                                                                >
                                                                    <div
                                                                        className={clsx(
                                                                            styles.iconFile
                                                                        )}
                                                                    >
                                                                        <img
                                                                            loading="lazy"
                                                                            src={
                                                                                fileSelect
                                                                            }
                                                                            alt=""
                                                                        />
                                                                    </div>
                                                                </label>
                                                                <input
                                                                    name="video"
                                                                    accept=".mp4"
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleFileChange(
                                                                            e,
                                                                            index,
                                                                            sectionIndex
                                                                        )
                                                                    }
                                                                    id={`video${section.title}${index}`}
                                                                    type="file"
                                                                    hidden
                                                                />
                                                            </div>
                                                            <div
                                                                className={clsx(
                                                                    styles.formField,
                                                                    "w-1/2 mt-8 ml-9"
                                                                )}
                                                            >
                                                                {lesson.video && (
                                                                    <div
                                                                        className={clsx(
                                                                            styles.videoField
                                                                        )}
                                                                    >
                                                                        <video
                                                                            key={
                                                                                lesson.video
                                                                            }
                                                                            controls
                                                                            className="rounded-lg"
                                                                        >
                                                                            <source
                                                                                src={
                                                                                    lesson.video
                                                                                }
                                                                                type="video/mp4"
                                                                            />
                                                                        </video>
                                                                        <button
                                                                            className={clsx(
                                                                                styles.btnClosePreview
                                                                            )}
                                                                            onClick={(
                                                                                e
                                                                            ) =>
                                                                                handleRemoveItemPrevivew(
                                                                                    e,
                                                                                    "video",
                                                                                    index,
                                                                                    sectionIndex
                                                                                )
                                                                            }
                                                                        >
                                                                            {" "}
                                                                            <img
                                                                                loading="lazy"
                                                                                src={
                                                                                    btnClose
                                                                                }
                                                                                alt=""
                                                                            />{" "}
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div
                                                            className={clsx(
                                                                styles.formField
                                                            )}
                                                        >
                                                            <input
                                                                name="linkVideo"
                                                                value={
                                                                    lesson.linkVideo
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    handleInputLessonChange(
                                                                        e,
                                                                        index,
                                                                        sectionIndex
                                                                    );
                                                                }}
                                                                className={clsx(
                                                                    styles.formInput
                                                                )}
                                                                type="text"
                                                            />
                                                            <label
                                                                className={clsx(
                                                                    styles.formLabel
                                                                )}
                                                            >
                                                                Link Video
                                                            </label>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        <button
                                            type="submit"
                                            className="justify-start px-1 py-2 mt-4 text-sm font-medium text-center text-white bg-black rounded-lg max-md:max-w-1/5 w-1/5 self-start"
                                            onClick={() =>
                                                handleAddLesson(sectionIndex)
                                            }
                                        >
                                            Add Lesson
                                        </button>
                                    </div>
                                );
                            })}
                    </div>
                    <button
                        type="submit"
                        className="justify-center px-5 py-2.5 mt-5 text-sm font-medium text-center text-white bg-black rounded-lg max-md:max-w-1/3 w-1/3 self-center"
                        onClick={handleCreateSection}
                    >
                        Create Section
                    </button>
                    <button
                        type="submit"
                        className="justify-center px-5 py-3.5 mt-5 text-sm font-medium text-center text-white bg-black rounded-lg max-md:max-w-full w-full"
                        onClick={handleSubmit}
                    >
                        Update Course
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditCourse;
