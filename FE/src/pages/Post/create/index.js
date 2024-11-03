import { Quill } from "react-quill/lib";
import ImageUploader from "quill-image-uploader";
import clsx from "clsx";
import fileSelect from "../../../assets/images/fileSelect.svg";
import styles from "../../admin/Course/create/CreateCourse.module.scss";
import ReactQuill from "react-quill";
import * as publicService from "../../../api/apiService/publicService";
import "react-quill/dist/quill.snow.css";
import InputComponent from "../../../component/InputComponent";
import * as userService from "../../../api/apiService/authService";

import "quill-image-uploader/dist/quill.imageUploader.min.css";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import btnClose from "../../../assets/images/btnClose.svg";
import SelectComponent from "../../../component/select/MultiSelectComponent";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

Quill.register("modules/imageUploader", ImageUploader);
let injectIsLoading = null;
const handleUpload = (file, setIsLoading) => {
    if (!file) {
        return;
    }
    injectIsLoading(true);
    const fetchApi = async () => {
        try {
            const result = await publicService.uploadFile(file);
            injectIsLoading(false);
            return result.content;
        } catch (error) {
            console.log(error);
        }
    };

    return fetchApi();
};

function CreatePost({ initPost }) {
    const [errors, setErrors] = useState({});
    const { title } = useParams();
    const [listTagData, setListTagData] = useState([]);
    const user = useSelector((state) => state.login.user);
    const [post, setPost] = useState(initPost);

    const [isLoading, setIsLoading] = useState(false);

    injectIsLoading = setIsLoading;

    const navigate = useNavigate();

    const handleChangeTag = (data) => {
        setPost({ ...post, tags: [...data] });
    };
    const handleRemoveItemPrevivew = (e) => {
        setPost({ ...post, thumbnail: "" });
    };

    const handleUpLoadThubmnail = (e) => {
        const file = e.target.files[0];
        setIsLoading(true);
        toast.promise(publicService.uploadFile(file), {
            loading: "loading...",
            success: (data) => {
                setPost({ ...post, thumbnail: data.content });
                setIsLoading(false);
                return "Upload thumbnail success";
            },
            error: (error) => {
                console.log(error);
                return "error";
            },
        });
        e.target.value = "";
    };

    const handleChangeQuill = (content) =>
        setPost((prev) => ({ ...prev, content: content }));

    const handleTitleChange = (e) => {
        setPost((prev) => ({ ...prev, title: e.target.value }));
    };
    const handleDescChange = (e) => {
        setPost((prev) => ({ ...prev, description: e.target.value }));
    };

    useEffect(() => {
        let reformatTags = [];
        if (initPost?.tags) {
            reformatTags = initPost.tags.map((tag) => ({
                label: tag.name,
                value: tag.id,
            }));
        }
        setPost({ ...initPost, tags: reformatTags });
    }, [initPost]);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = await publicService.getAllTag();
                const formatTags = result.map((tag) => ({
                    label: tag.name,
                    value: tag.id,
                }));
                setListTagData(formatTags);
            } catch (error) {
                console.log(error);
                toast.error("Error!");
            }
        };
        fetchApi();
    }, []);

    const handleUpdatePost = () => {
        const tagsValue = post.tags.map((tag) => {
            return {
                name: tag.label,
            };
        });
        toast.promise(userService.updatePost({ ...post, tags: tagsValue }), {
            loading: "loading...",
            success: () => {
                navigate(`/posts/${encodeURIComponent(post?.title)}/view`);
                return "Update successfully";
            },
            error: (error) => {
                console.log(error);
                return error.message;
            },
        });
    };

    const handlePusblish = () => {
        const tagsValue = post.tags.map((tag) => {
            return {
                name: tag.label,
            };
        });
        toast.promise(
            userService.createPost({ ...post, tags: tagsValue }, user.email),
            {
                loading: "loading...",
                success: () => {
                    navigate(`/posts/${encodeURIComponent(post?.title)}`);
                    return "Publis successfully, please wait for admin approval";
                },
                error: (error) => {
                    console.log(error);
                    return error.message;
                },
            }
        );
    };
    return (
        <div className="container flex py-10">
            <div className="mx-auto max-w-[800px] w-[800px] ">
                <div className="shadow-lg rounded-lg flex flex-col gap-4">
                    <div className="w-full p-6 border-b-[1px] border-b-gray-300">
                        <h4 className="font-bold text-2xl">Details</h4>
                        <span className="text-gray-500 text-sm font">
                            Title, short description, image...
                        </span>
                    </div>
                    <div className="px-6 mb-6 flex flex-col gap-4">
                        <InputComponent
                            onHandleChange={handleTitleChange}
                            value={post?.title}
                            label="Title"
                        ></InputComponent>
                        <InputComponent
                            onHandleChange={handleDescChange}
                            value={post?.description}
                            size="lg"
                            label="Description"
                        ></InputComponent>
                        <div>
                            <span className="text-xs font-bold">Content</span>
                            <div className="mt-2.5">
                                <ReactQuill
                                    theme="snow"
                                    value={post?.content}
                                    onChange={(
                                        content,
                                        delta,
                                        source,
                                        editor
                                    ) => {
                                        handleChangeQuill(
                                            content,
                                            delta,
                                            source,
                                            editor
                                        );
                                    }}
                                    modules={toolbar}
                                    formats={formats}
                                ></ReactQuill>
                            </div>
                        </div>
                        <div>
                            <span className="text-xs font-bold">Cover</span>
                            <div className="mt-2.5">
                                <div className="flex overflow-hidden">
                                    <div
                                        className={clsx(
                                            styles.formField,
                                            "w-1/2 overflow-hidden"
                                        )}
                                    >
                                        <label
                                            htmlFor="thumbnail"
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
                                                <img src={fileSelect} alt="" />
                                            </div>
                                        </label>
                                        {errors.thumbnail && (
                                            <div className="text-red-500 mt-1 text-sm mr-2">
                                                {errors.thumbnail}
                                            </div>
                                        )}
                                        <input
                                            name="thumbnail"
                                            onChange={handleUpLoadThubmnail}
                                            id="thumbnail"
                                            type="file"
                                            hidden
                                            accept=".jpg, .jpeg, .png, .webp"
                                        />
                                    </div>
                                    <div
                                        className={clsx(
                                            styles.formField,
                                            "w-1/2 mt-[10px] ml-2"
                                        )}
                                    >
                                        {post?.thumbnail && (
                                            <div
                                                className={clsx(
                                                    styles.imgField
                                                )}
                                            >
                                                <img
                                                    className={clsx(
                                                        styles.thumbnailImg,
                                                        "rounded-lg"
                                                    )}
                                                    src={post?.thumbnail}
                                                    alt=""
                                                />
                                                <button
                                                    onClick={(e) =>
                                                        handleRemoveItemPrevivew(
                                                            e
                                                        )
                                                    }
                                                    className={clsx(
                                                        styles.btnClosePreview,
                                                        "w-4 h-4"
                                                    )}
                                                >
                                                    <img
                                                        src={btnClose}
                                                        alt=""
                                                    />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mb-2">
                            <SelectComponent
                                data={listTagData}
                                value={post?.tags}
                                handleChange={handleChangeTag}
                            ></SelectComponent>
                        </div>
                    </div>
                </div>
                <div className="text-right mt-8">
                    <button
                        type="button"
                        className="rounded-lg cursor-pointer bg-white hover:bg-gray-100 transition-all ease-linear delay-50 border border-gray-300 text-black mr-4 font-bold text-base px-4 py-2.5"
                    >
                        Preview
                    </button>
                    {!title && (
                        <button
                            type="button"
                            onClick={handlePusblish}
                            className="rounded-lg cursor-pointer hover:opacity-75 bg-[#1C252E] text-white font-bold text-base px-4 py-2.5"
                        >
                            Publish
                        </button>
                    )}
                    {title && (
                        <button
                            type="button"
                            onClick={handleUpdatePost}
                            className="rounded-lg cursor-pointer hover:opacity-75 bg-[#1C252E] text-white font-bold text-base px-4 py-2.5"
                        >
                            SaveChange
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
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
    imageUploader: {
        upload: handleUpload,
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

export default CreatePost;
