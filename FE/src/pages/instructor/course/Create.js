import React from "react";
import { Checkbox } from "@nextui-org/react";
import ReactPlayer from "react-player";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
} from "@nextui-org/react";
import "bootstrap/dist/css/bootstrap.min.css";
import MultiSelect from "../../../component/select/MultiSelectComponent";
import styles from "../../admin/Course/create/CreateCourse.module.scss";
import clsx from "clsx";
import fileSelect from "../../../assets/images/fileSelect.svg";
import { useEffect, useState } from "react";
import * as instructorService from "../../../api/apiService/instructorService";
import * as publicService from "../../../api/apiService/publicService";
import { toast } from "sonner";
import btnClose from "../../../assets/images/btnClose.svg";
import ReactQuill from "react-quill";
import { Switch } from "@nextui-org/react";
import SelectComponent from "../../../component/select/SelectComponent";
import Ink from "react-ink";

const initFormData = {
    title: "",
    description: "",
    price: "",
    thumbnail: "",
    date: "",
    categories: [],
    sections: [],
    status: "DRAFT",
};

function InstructorCreateCourse() {
    const [formData, setFormData] = useState(initFormData);
    const [options, setOptions] = useState([]);
    const [errors, setErrors] = useState({});
    const [isUploading, setIsUploading] = useState(false);
    const [priceTiers, setPriceTires] = useState([]);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    let timerId;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        errors[name] = "";
        if (name === "price" && (isNaN(value) || value < 0)) {
            return;
        }
        setErrors(errors);
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const updateVideoForLesson = (video, lessonIndex, sectionIndex) => {
        const updateSection = { ...formData.sections[sectionIndex] };
        const cloneFromData = { ...formData };
        updateSection.lessons[lessonIndex] = {
            ...updateSection.lessons[lessonIndex],
            video,
        };
        cloneFromData.sections[sectionIndex] = { ...updateSection };
        return cloneFromData;
    };

    const handleFileChange = (e, index, sectionIndex) => {
        const file = e.target.files[0];
        setIsUploading(true);
        toast.promise(publicService.uploadFile(file), {
            loading: "Loading file...",
            success: (result) => {
                setIsUploading(false);

                setFormData((prev) => {
                    if (file.type === "video/mp4") {
                        return updateVideoForLesson(
                            result.content,
                            index,
                            sectionIndex
                        );
                    } else {
                        return {
                            ...prev,
                            thumbnail: result.content,
                        };
                    }
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
                // https://res.cloudinary.com/dhydbv51p/video/upload/v1729619451/dream_chasers_v2/t0ygpbqaddd0waiblgnd.mp4
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
        if (!formData.title) errors.title = "Course Name is required.";
        if (!formData.description)
            errors.description = "Description is required.";
        if (!formData.price) errors.price = "Price is required.";
        // if (!formData.thumbnail) errors.thumbnail = "Thumbnail is required.";
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
            toast.promise(instructorService.createCourse(formData), {
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
                console.log(error.mess);
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

    return (
        <>
            <div className="container flex flex-col justify-center">
                <div className="w-3/4 mx-auto">
                    <div>
                        <h3 className="titleMainDash">Create a new course</h3>

                        <div
                            className={clsx(
                                styles.formGroup,
                                "flex gap-6 flex-col rounded-lg"
                            )}
                        >
                            <div className={clsx(styles.formField)}>
                                <input
                                    required
                                    onChange={handleInputChange}
                                    value={formData?.title}
                                    name="title"
                                    data-validate
                                    className={clsx(styles.formInput)}
                                    type="text"
                                />
                                <label
                                    className={clsx(
                                        styles.formLabel,
                                        "text-black"
                                    )}
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
                                        "w-1/2 mr-9"
                                    )}
                                >
                                    <MultiSelect
                                        title="Category"
                                        value={formData.categories}
                                        handleChange={handleSelectChange}
                                        data={options}
                                        maxValues={3}
                                    />

                                    {/* <label
                                        className={clsx(
                                            styles.formLabel,
                                            "text-black"
                                        )}
                                    >
                                        Category
                                    </label> */}
                                    {errors.categories && (
                                        <div className="text-red-500 mt-1 text-sm ml-1">
                                            {errors.categories}
                                        </div>
                                    )}
                                </div>
                                <div
                                    className={clsx(styles.formField, "w-1/2")}
                                >
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
                                    className={clsx(
                                        styles.formField,
                                        "w-1/2 mt-8"
                                    )}
                                >
                                    {formData.video && (
                                        <div
                                            className={clsx(styles.videoField)}
                                        >
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
                                                <img
                                                    src={btnClose}
                                                    alt=""
                                                />{" "}
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
                                                        "mt-3 flex flex-col border border-gray-200 p-3 rounded-lg"
                                                    )}
                                                    key={sectionIndex}
                                                >
                                                    <div
                                                        className={clsx(
                                                            styles.sectionName,
                                                            "text-center font-semibold"
                                                        )}
                                                    >
                                                        #Section{" "}
                                                        {sectionIndex + 1}
                                                    </div>
                                                    <div
                                                        className="relative justify-end px-3 py-2 text-sm cursor-pointer font-medium text-center text-white bg-black rounded-lg max-md:max-w-1/5 w-1/5 self-end"
                                                        onClick={() => {
                                                            handleRemoveSection(
                                                                sectionIndex
                                                            );
                                                        }}
                                                    >
                                                        <Ink></Ink> Remove
                                                        section
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
                                                            value={
                                                                section.title
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
                                                            Section Name
                                                        </label>
                                                    </div>
                                                    {lessons &&
                                                        lessons.map(
                                                            (lesson, index) => {
                                                                return (
                                                                    <div
                                                                        key={
                                                                            index
                                                                        }
                                                                        className={clsx(
                                                                            styles.lessonField,
                                                                            "gap-6 flex flex-col mt-4 p-3 border border-gray-200 rounded-lg"
                                                                        )}
                                                                    >
                                                                        <div
                                                                            className={clsx(
                                                                                styles.formField,
                                                                                "flex justify-between"
                                                                            )}
                                                                        >
                                                                            <div className="self-center  font-semibold">
                                                                                #Lesson{" "}
                                                                                {index +
                                                                                    1}
                                                                            </div>

                                                                            <div
                                                                                className="relative justify-center px-3 py-2 text-sm cursor-pointer font-medium text-center text-white bg-black rounded-lg max-md:max-w-1/5 w-1/5 self-center"
                                                                                onClick={() => {
                                                                                    handleRemoveLesson(
                                                                                        index,
                                                                                        sectionIndex
                                                                                    );
                                                                                }}
                                                                            >
                                                                                <Ink></Ink>{" "}
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
                                                        className="relative justify-start px-1 py-2 mt-4 text-sm font-medium text-center text-white bg-black rounded-lg max-md:max-w-1/5 w-1/5 self-start"
                                                        onClick={() =>
                                                            handleAddLesson(
                                                                sectionIndex
                                                            )
                                                        }
                                                    >
                                                        <Ink></Ink>
                                                        Add Lesson
                                                    </button>
                                                </div>
                                            );
                                        }
                                    )}
                            </div>
                            <button
                                type="submit"
                                className="relative justify-center px-4 py-2 text-sm font-medium text-center text-white bg-black rounded-lg max-md:max-w-1/3 w-1/3 self-center"
                                onClick={handleCreateSection}
                            >
                                <Ink></Ink>
                                Create Section
                            </button>
                        </div>
                    </div>

                    <div className="flex mt-3 mb-6 justify-end items-center gap-3">
                        <div className="center gap-0 font-medium bg-white rounded-lg px-3">
                            <div onPress={onOpen}>
                                By creating a course on our platform, you agree
                                to the following
                            </div>
                            <Button
                                className="bg-white p-0 inline min-w-0 underline ml-1 mr-1 hover:opacity-80 text-base font-bold"
                                onPress={onOpen}
                            >
                                terms
                            </Button>

                            <Modal
                                isOpen={isOpen}
                                onOpenChange={onOpenChange}
                                size="4xl"
                                scrollBehavior={"inside"}
                            >
                                <ModalContent>
                                    {(onClose) => (
                                        <>
                                            <ModalHeader className="flex flex-col gap-1  pt-4 pb-2">
                                                <h4 className="text-xl  font-bold">
                                                    Course Creation Terms and
                                                    Conditions
                                                </h4>
                                            </ModalHeader>
                                            <ModalBody>
                                                <div class="article-body">
                                                    <p>
                                                        <span>
                                                            This article
                                                            includes a checklist
                                                            of the minimum
                                                            requirements a
                                                            course must have in
                                                            order for it to be
                                                            published on the
                                                            Dream Chaser
                                                            platform. In
                                                            addition, it also
                                                            includes guidelines
                                                            and resources
                                                            instructors can use
                                                            to improve the
                                                            quality of their
                                                            courses, and enhance
                                                            the learning
                                                            experience of
                                                            students!
                                                        </span>
                                                    </p>
                                                    <p className="py-2">
                                                        <span className="underline">
                                                            <strong>
                                                                The minimum
                                                                course
                                                                requirements
                                                                checklist
                                                            </strong>
                                                        </span>
                                                    </p>
                                                    <p>
                                                        <span>
                                                            Below is a checklist
                                                            of the minimum
                                                            standards a course
                                                            must have in order
                                                            for it to be
                                                            published on the
                                                            Dream Chasers
                                                            platform.&nbsp;
                                                        </span>
                                                    </p>
                                                    <ul>
                                                        <li aria-level="1">
                                                            <span>
                                                                At least 30
                                                                minutes of video
                                                                content
                                                            </span>
                                                        </li>
                                                        <li aria-level="1">
                                                            <span>
                                                                At least 5
                                                                separate
                                                                lectures
                                                            </span>
                                                        </li>
                                                        <li aria-level="1">
                                                            <span>
                                                                Valuable
                                                                educational
                                                                content
                                                            </span>
                                                        </li>
                                                        <li aria-level="1">
                                                            <span>
                                                                HD video quality
                                                                (720p or 1080p)
                                                            </span>
                                                            <ul>
                                                                <li aria-level="1">
                                                                    <span>
                                                                        Note:
                                                                        Videos
                                                                        exceeding
                                                                        an
                                                                        aspect
                                                                        ratio of
                                                                        16:9
                                                                        will
                                                                        automatically
                                                                        be
                                                                        re-modified
                                                                        to 16:9
                                                                        by our
                                                                        system.
                                                                        If the
                                                                        resulting
                                                                        quality
                                                                        of the
                                                                        video is
                                                                        poor,
                                                                        the
                                                                        video
                                                                        may be
                                                                        rejected
                                                                        by our
                                                                        Quality
                                                                        Review
                                                                        Team.
                                                                    </span>
                                                                </li>
                                                            </ul>
                                                        </li>
                                                        <li aria-level="1">
                                                            <span>
                                                                Audio that comes
                                                                out of both
                                                                channels and is
                                                                synced to video
                                                            </span>
                                                        </li>
                                                        <li aria-level="1">
                                                            <span>
                                                                Audio quality
                                                                that is not
                                                                distracting to
                                                                students
                                                            </span>
                                                        </li>
                                                        <li aria-level="1">
                                                            <span>
                                                                A unique course
                                                                landing page
                                                            </span>
                                                            <ul>
                                                                <li aria-level="2">
                                                                    <span>
                                                                        A course
                                                                        image in
                                                                        line
                                                                        with
                                                                        Dream
                                                                        Chasers
                                                                        image
                                                                        standards
                                                                    </span>
                                                                </li>
                                                                <li aria-level="2">
                                                                    <span>
                                                                        A course
                                                                        title
                                                                        and
                                                                        subtitle
                                                                        that
                                                                        includes
                                                                        relevant
                                                                        keywords
                                                                    </span>
                                                                </li>
                                                                <li aria-level="2">
                                                                    <span>
                                                                        A course
                                                                        description
                                                                        with
                                                                        more
                                                                        than 200
                                                                        words
                                                                    </span>
                                                                </li>
                                                                <li aria-level="2">
                                                                    <span>
                                                                        A
                                                                        completed
                                                                        intended
                                                                        learners
                                                                        section
                                                                    </span>
                                                                </li>
                                                                <li aria-level="2">
                                                                    <span>
                                                                        A
                                                                        complete
                                                                        instructor
                                                                        bio and
                                                                        profile
                                                                        picture
                                                                    </span>
                                                                </li>
                                                            </ul>
                                                        </li>
                                                    </ul>
                                                    <p>
                                                        <em>
                                                            <span>
                                                                Please note:
                                                                free courses
                                                                published on or
                                                                after March 17,
                                                                2020 must have
                                                                less than 2
                                                                hours of video
                                                                content. Learn .
                                                            </span>
                                                        </em>
                                                    </p>
                                                    <p>
                                                        <span className="underline">
                                                            <strong>
                                                                Additional
                                                                resources
                                                            </strong>
                                                        </span>
                                                    </p>
                                                    <p>
                                                        <strong>
                                                            Best practices for
                                                            course creation
                                                        </strong>
                                                        <span>: </span>
                                                        <span>
                                                            best practices make
                                                            good courses, great.
                                                            You can learn more
                                                            about the best
                                                            practices that have
                                                            worked for thousands
                                                            of Dream Chasers
                                                            instructors to
                                                            create compelling,
                                                            high quality courses
                                                            in our.
                                                        </span>
                                                    </p>
                                                    <p>
                                                        <strong>
                                                            Test video service:
                                                        </strong>
                                                        <span>
                                                            {" "}
                                                            we highly recommend
                                                            you take advantage
                                                            of our test video
                                                            service
                                                        </span>

                                                        <span>
                                                            to get personalized
                                                            assistance and
                                                            feedback on audio
                                                            and video quality
                                                            early into the
                                                            course creation
                                                            process. This will
                                                            help you feel
                                                            confident about your
                                                            recording setup
                                                            before you record
                                                            your course.&nbsp;
                                                        </span>
                                                    </p>
                                                    <p>
                                                        <strong>
                                                            Trust &amp; Safety
                                                            guidelines:{" "}
                                                        </strong>
                                                        <span>
                                                            as you create your
                                                            course, we also ask
                                                            that you take time
                                                            to review our trust
                                                            and Safety Policy
                                                            Guidelines and make
                                                            sure the course
                                                            meets these and can
                                                            be published.
                                                        </span>
                                                    </p>
                                                    <p>
                                                        <strong>
                                                            The Quality Review
                                                            process:{" "}
                                                        </strong>
                                                        <span>
                                                            after you complete
                                                            your course and it’s
                                                            submitted for
                                                            review, our review
                                                            team will provide
                                                            you with feedback to
                                                            help you get your
                                                            course ready for
                                                            students to enjoy.
                                                            Learn more about the
                                                            Quality Review
                                                            process.
                                                        </span>
                                                    </p>
                                                    <p>
                                                        <strong>
                                                            The Instructor
                                                            Community:
                                                        </strong>
                                                        <span> our </span>

                                                        <span>
                                                            global instructor
                                                            community is another
                                                            great place to find
                                                            help and ideas
                                                            regarding the course
                                                            creation
                                                            process.&nbsp;
                                                        </span>
                                                    </p>
                                                </div>
                                                {/* <ol className="flex flex-col gap-2 font-medium text-base list-decimal">
                                                    <li>
                                                        <strong>
                                                            Original Content
                                                        </strong>{" "}
                                                        <br />
                                                        All content must be
                                                        original and created by
                                                        you, or you must have
                                                        obtained proper rights
                                                        and permissions to use
                                                        any third-party
                                                        material.
                                                    </li>
                                                    <li>
                                                        <strong>
                                                            Accuracy and
                                                            Integrity
                                                        </strong>{" "}
                                                        <br />
                                                        Information provided in
                                                        this course should be
                                                        accurate, and the course
                                                        must aim to provide
                                                        educational value to
                                                        students.
                                                    </li>
                                                    <li>
                                                        <strong>
                                                            No Inappropriate
                                                            Content
                                                        </strong>{" "}
                                                        <br />
                                                        Content that is
                                                        offensive,
                                                        discriminatory, or
                                                        violates any policies or
                                                        community standards will
                                                        not be permitted.
                                                    </li>
                                                    <li>
                                                        <strong>
                                                            Compliance
                                                        </strong>{" "}
                                                        <br />
                                                        The course should comply
                                                        with all applicable
                                                        local laws, regulations,
                                                        and intellectual
                                                        property rights.
                                                    </li>
                                                    <li>
                                                        <strong>
                                                            Updates and
                                                            Maintenance
                                                        </strong>{" "}
                                                        <br />
                                                        You agree to keep course
                                                        materials updated as
                                                        necessary to ensure the
                                                        content remains relevant
                                                        and accurate.
                                                    </li>
                                                </ol> */}
                                            </ModalBody>

                                            <ModalFooter>
                                                <Button
                                                    color="black"
                                                    className="text-white font-bold bg-black "
                                                    variant="light"
                                                    onPress={onClose}
                                                >
                                                    Close
                                                </Button>
                                            </ModalFooter>
                                        </>
                                    )}
                                </ModalContent>
                            </Modal>
                        </div>
                        <div className="flex items-center">
                            <Switch
                                aria-label="Puslish"
                                color="success"
                                className="mr-1"
                                size="sm"
                                onChange={(e) => {
                                    let status = e.target.checked
                                        ? "PUBLISHED"
                                        : "DRAFT";
                                    setFormData((prev) => ({
                                        ...prev,
                                        status: status,
                                    }));
                                }}
                            />
                            <div>Publish</div>
                        </div>

                        <button
                            type="submit"
                            className="relative justify-center px-3.5 py-2 text-sm font-medium text-center text-white bg-black rounded-lg "
                            onClick={handleSubmit}
                        >
                            <Ink></Ink>
                            Create Course
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default InstructorCreateCourse;
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
