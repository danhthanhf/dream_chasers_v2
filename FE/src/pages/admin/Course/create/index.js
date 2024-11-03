import React from "react";
import ReactPlayer from "react-player";

import "bootstrap/dist/css/bootstrap.min.css";
import MultiSelect from "../../../../component/select/MultiSelectComponent";
import styles from "./CreateCourse.module.scss";
import clsx from "clsx";
import fileSelect from "../../../../assets/images/fileSelect.svg";
import { useEffect, useState } from "react";
import * as adminService from "../../../../api/apiService/adminService";
import * as publicService from "../../../../api/apiService/publicService";
import { toast } from "sonner";
import btnClose from "../../../../assets/images/btnClose.svg";
import ReactQuill from "react-quill";
import SelectComponent from "../../../../component/select/SelectComponent";

const initFormData = {
    title: "",
    description: "",
    price: "",
    thumbnail: "",
    date: "",
    categories: [],
    sections: [],
};

function CreateCourse() {
    const [formData, setFormData] = useState(initFormData);
    const [options, setOptions] = useState([]);
    const [errors, setErrors] = useState({});
    const [isUploading, setIsUploading] = useState(false);
    const [priceTiers, setPriceTires] = useState([]);
    const [tagSelected, setTagSelected] = useState([]);
    let timerId;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        errors[name] = "";
        setErrors(errors);
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = (e, index, indexSection) => {
        const file = e.target.files[0];
        setIsUploading(true);
        toast.promise(publicService.uploadFile(file), {
            loading: "Loading file...",
            success: (result) => {
                setIsUploading(false);
                setFormData((prev) => {
                    const updatedSections = [...prev.sections];
                    if (file.type === "video/mp4") {
                        const updatedSection = {
                            ...updatedSections[indexSection],
                            lessons: updatedSections[indexSection].lessons.map(
                                (lesson, lessonIndex) =>
                                    lessonIndex === index
                                        ? { ...lesson, video: result.content }
                                        : lesson
                            ),
                        };
                        updatedSections[indexSection] = updatedSection;
                    } else {
                        return {
                            ...prev,
                            thumbnail: result.content,
                        };
                    }
                    return {
                        ...prev,
                        sections: updatedSections,
                    };
                });
                return "Uploading successfully...";
            },
            error: (error) => {
                console.log(error);
                return "Upload thumbnail failed";
            },
        });
        e.target.value = "";
        errors[e.target.name] = "";
        setErrors(errors);
    };

    const handleSelectChange = (e) => {
        setFormData({
            ...formData,
            categories: [...e],
        });
    };
    const handleUpdateVideoCourse = (e) => {
        setIsUploading((prev) => true);
        toast.promise(publicService.uploadFile(e.target.files[0]), {
            loading: "Loading video...",
            success: (result) => {
                setIsUploading((prev) => false);
                console.log(result.content);
                setFormData((prev) => {
                    return { ...prev, video: result.content };
                });
                return "Upload video successfully";
            },
            error: (error) => {
                console.log(error);
                return "Upload video failed";
            },
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

    const handleInputLessonChange = (e, index, sectionIndex) => {
        const { name, value } = e.target;
        const updateSection = { ...formData.sections[sectionIndex] };
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

    const handleRemoveLesson = (index, sectionId) => {
        var newSection = { ...formData.sections[sectionId] };
        newSection.lessons.splice(index, 1);
        var newSections = [...formData.sections];
        newSections[sectionId] = newSection;
        setFormData((prev) => {
            return { ...prev, sections: newSections };
        });
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

    const handleInputSectionChange = (e, sectionIndex) => {
        const updateSection = formData.sections[sectionIndex];
        updateSection.title = e.target.value;
        const updateSections = [...formData.sections];
        updateSections[sectionIndex] = updateSection;
        setFormData({ ...formData, sections: [...updateSections] });
    };

    const handleRemoveSection = (index) => {
        const updateSections = [...formData.sections];
        updateSections.splice(index, 1);
        setFormData((prev) => {
            return { ...prev, sections: [...updateSections] };
        });
    };

    const debounce = (func, delay = 600) => {
        return () => {
            clearTimeout(timerId);

            timerId = setTimeout(() => {
                func();
            }, delay);
        };
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

    const handleRemoveVideoCourse = (e) => {
        setFormData({ ...formData, video: null });
    };

    const validateForm = (formData) => {
        const errors = {};
        if (!formData.title) errors.title = "Course name is required.";
        if (!formData.description)
            errors.description = "Description is required.";
        if (!formData.price) errors.price = "Price is required.";
        if (!formData.thumbnail) errors.thumbnail = "Thumbnail is required.";
        if (formData.categories.length === 0)
            errors.categories = "At least one category is required.";
        if (formData.section)
            formData.sections.forEach((section, sectionIndex) => {
                if (!section.title)
                    errors[`section-${sectionIndex}`] = `Section ${
                        sectionIndex + 1
                    } Name is required.`;
                section.lessons.forEach((lesson, lessonIndex) => {
                    if (!lesson.title)
                        errors[
                            `lesson-${sectionIndex}-${lessonIndex}`
                        ] = `Lesson ${
                            lessonIndex + 1
                        } Name is required in Section ${sectionIndex + 1}.`;
                    if (!lesson.description)
                        errors[
                            `lesson-desc-${sectionIndex}-${lessonIndex}`
                        ] = `Lesson ${
                            lessonIndex + 1
                        } Description is required in Section ${
                            sectionIndex + 1
                        }.`;
                });
            });

        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isUploading)
            return toast.error("Please wait for the file to finish uploading");
        const validationErrors = validateForm(formData);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            toast.error("You need to fill in the empty field");
            return;
        }

        const featchApi = async () => {
            toast.promise(adminService.createCourse(formData), {
                loading: "Loading...",
                success: () => {
                    setFormData(initFormData);
                    return "Create successfully";
                },
                error: (error) => {
                    return error.message;
                },
            });
        };

        const debounceApi = debounce(featchApi);
        debounceApi();
    };
    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = await publicService.getAllCategoriesAndPrice(
                    false,
                    0,
                    999999
                );
                setPriceTires(
                    result.prices.map((price) => ({
                        label:
                            price.value.toLocaleString("vi-VN") +
                            " (" +
                            price.name +
                            ")",
                        value: price.value.toString(),
                    }))
                );
                setOptions(
                    result.categories.content.map((cate) => ({
                        label: cate.name,
                        value: cate.id,
                    }))
                );
            } catch (error) {
                console.log(error);
            }
        };
        fetchApi();
    }, []);

    const updateDuration = (e, lesson, sectionIndex) => {
        var sectionUpdate = { ...formData.sections[sectionIndex] };
        sectionUpdate.lessons = sectionUpdate.lessons.map((l) => {
            if (l.title === lesson.title) {
                return { ...l, duration: e };
            }
            return l;
        });
        const sectionsUpdates = [...formData.sections];
        sectionsUpdates[sectionIndex] = sectionUpdate;
        setFormData((prev) => {
            return { ...prev, sections: [...sectionsUpdates] };
        });
    };

    console.table(formData);

    return (
        <>
            <div className="container flex flex-col justify-center">
                <div className="w-[900px] mx-auto">
                    <h3 className="titleMainDash">Create a new course</h3>
                    <div
                        className={clsx(
                            styles.formGroup,
                            "flex gap-6 flex-col rounded-lg"
                        )}
                    >
                        <div className={clsx(styles.formField, "")}>
                            <input
                                required
                                onChange={handleInputChange}
                                value={formData.title}
                                name="title"
                                data-validate
                                className={clsx(
                                    "w-full border-gray-300 border-1 rounded-lg transition-all focus-within:border-black input-h focus:outline-none px-2"
                                )}
                                type="text"
                            />
                            <label
                                className={clsx(styles.formLabel, "text-black")}
                            >
                                Course Name
                            </label>
                            {errors.title && (
                                <div className="text-red-500 mt-1 text-sm ml-1">
                                    {errors.title}
                                </div>
                            )}
                        </div>
                        <div className={clsx(styles.formField)}>
                            <div className="mt-2.5">
                                <label
                                    className={clsx(
                                        "text-black ml-0 font-semibold  text-sm pb-2"
                                    )}
                                >
                                    Description
                                </label>
                                <ReactQuill
                                    theme="snow"
                                    value={formData.description || ""}
                                    onChange={(
                                        content,
                                        delta,
                                        source,
                                        editor
                                    ) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            description: content,
                                        }));
                                    }}
                                    modules={toolbar}
                                    formats={formats}
                                ></ReactQuill>
                            </div>

                            {errors.description && (
                                <div className="text-red-500 mt-1 text-sm ml-1">
                                    {errors.description}
                                </div>
                            )}
                        </div>

                        <div className={clsx("flex")}>
                            <div
                                className={clsx(
                                    styles.formField,
                                    "w-1/2 mr-9 input-h"
                                )}
                            >
                                <MultiSelect
                                    value={formData.categories}
                                    handleChange={handleSelectChange}
                                    data={options}
                                    maxValues={3}
                                    title="Category"
                                />

                                {errors.categories && (
                                    <div className="text-red-500 mt-1 text-sm ml-1">
                                        {errors.categories}
                                    </div>
                                )}
                            </div>
                            <div className={clsx(styles.formField, "w-1/2")}>
                                <div className="input-h">
                                    <SelectComponent
                                        value={formData.price}
                                        data={priceTiers}
                                        handleChange={(e) => {
                                            setFormData((prev) => ({
                                                ...prev,
                                                price: e,
                                            }));
                                        }}
                                    ></SelectComponent>
                                </div>

                                {errors.price && (
                                    <div className="text-red-500 mt-1 text-sm ml-1">
                                        {errors.price}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex overflow-hidden">
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
                                    <div>
                                        <img src={fileSelect} alt="" />
                                    </div>
                                </label>
                                {errors.thumbnail && (
                                    <div className="text-red-500 mt-1 text-sm ml-1">
                                        {errors.thumbnail}
                                    </div>
                                )}
                                <input
                                    name="thumbnail"
                                    onChange={handleFileChange}
                                    id="thumbnail"
                                    type="file"
                                    hidden
                                    accept=".jpg, .jpeg, .png, .webp"
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
                                            className={clsx(
                                                styles.thumbnailImg
                                            )}
                                            src={formData.thumbnail}
                                            alt=""
                                        />
                                        <button
                                            onClick={(e) =>
                                                handleRemoveItemPrevivew(e)
                                            }
                                            className={clsx(
                                                styles.btnClosePreview
                                            )}
                                        >
                                            <img src={btnClose} alt="" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-3 overflow-hidden">
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
                                        "h-[250px]"
                                    )}
                                >
                                    <div>
                                        <img
                                            className="h-full"
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
                                className={clsx(styles.formField, "w-1/2 mt-8")}
                            >
                                {formData.video && (
                                    <div className={clsx(styles.videoField)}>
                                        <ReactPlayer
                                            url={formData.video}
                                            controls
                                            width="100%"
                                            onDuration={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    duration: e,
                                                }))
                                            }
                                            height="250px"
                                            style={{
                                                borderRadius: "8px",
                                                overflow: "hidden",
                                            }}
                                        ></ReactPlayer>
                                        <button
                                            className={clsx(
                                                styles.btnClosePreview
                                            )}
                                            onClick={(e) =>
                                                handleRemoveVideoCourse(e)
                                            }
                                        >
                                            {" "}
                                            <img src={btnClose} alt="" />{" "}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/*NOTE Lesson */}
                        <h5 className="text-center font-semibold text-3xl mt-12">
                            Curriculum
                        </h5>

                        <div className={clsx(styles.lessonArea)}>
                            {formData.sections &&
                                formData.sections.map(
                                    (section, sectionIndex) => {
                                        const lessons = section.lessons;
                                        return (
                                            <div
                                                className={clsx(
                                                    "mt-1 flex flex-col"
                                                )}
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
                                                            "transition-all w-full rounded-lg px-2  input-h border-1 border-gray-300 focus-within:border-black outline-none"
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
                                                </div>
                                                {lessons &&
                                                    lessons.map(
                                                        (lesson, index) => {
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
                                                                            {index +
                                                                                1}
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
                                                                            Remove
                                                                            lesson
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
                                                                            Lesson
                                                                            Name
                                                                        </label>
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
                                                                                        src={
                                                                                            fileSelect
                                                                                        }
                                                                                        alt=""
                                                                                    />
                                                                                </div>
                                                                            </label>
                                                                            <input
                                                                                name="video"
                                                                                onChange={(
                                                                                    e
                                                                                ) => {
                                                                                    handleFileChange(
                                                                                        e,
                                                                                        index,
                                                                                        sectionIndex
                                                                                    );
                                                                                }}
                                                                                id={`video${section.title}${index}`}
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
                                                                            {lesson.video && (
                                                                                <div
                                                                                    className={clsx(
                                                                                        styles.videoField
                                                                                    )}
                                                                                >
                                                                                    <ReactPlayer
                                                                                        url={
                                                                                            lesson.video
                                                                                        }
                                                                                        controls
                                                                                        width="100%"
                                                                                        onDuration={(
                                                                                            e
                                                                                        ) =>
                                                                                            updateDuration(
                                                                                                e,
                                                                                                lesson,
                                                                                                sectionIndex
                                                                                            )
                                                                                        }
                                                                                        height="250px"
                                                                                        style={{
                                                                                            borderRadius:
                                                                                                "8px",
                                                                                            overflow:
                                                                                                "hidden",
                                                                                        }}
                                                                                    ></ReactPlayer>

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
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                                <button
                                                    type="submit"
                                                    className="justify-start px-1 py-2 mt-4 text-sm font-medium text-center text-white bg-black rounded-lg max-md:max-w-1/5 w-1/5 self-start"
                                                    onClick={() =>
                                                        handleAddLesson(
                                                            sectionIndex
                                                        )
                                                    }
                                                >
                                                    Add Lesson
                                                </button>
                                            </div>
                                        );
                                    }
                                )}
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
                            Create Course
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CreateCourse;
const toolbar = {
    toolbar: {
        container: [
            [{ header: "1" }, { header: "2" }],
            [{ size: [] }],
            ["bold", "italic", "underline", "strike"],
            [
                { list: "ordered" },
                { list: "bullet" },
                { indent: "-1" },
                { indent: "+1" },
            ],
            ["link", "image"],
            ["clean"],
        ],
    },
    clipboard: {
        matchVisual: false,
    },
};

const formats = [
    "header",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "imageBlot",
];
