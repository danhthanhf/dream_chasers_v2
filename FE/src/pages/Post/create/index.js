import React, { memo, useEffect, useState } from "react";
import clsx from "clsx";
import styles from "./CreatePost.module.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "quill-image-uploader/dist/quill.imageUploader.min.css";
import ImageUploader from "quill-image-uploader";
import { Quill } from "react-quill/lib";
import { toast } from "sonner";
import * as dataApi from "../../../api/apiService/dataService";
import SubContent from "./subContent/index";

let injectIsLoading = null;

Quill.register("modules/imageUploader", ImageUploader);

const handleUpload = (file, setIsLoading) => {
    if (!file) {
        return;
    }
    injectIsLoading(true);
    const fetchApi = async () => {
        try {
            const result = await dataApi.uploadImg(file);
            injectIsLoading(false);
            return result.content;
        } catch (error) {
            console.log(error);
        }
    };

    return fetchApi();
};

function CreatePost({ isEdit, postInit }) {
    const [post, setPost] = useState({
        title: "",
        content: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [openSubContent, setOpenSubContent] = useState(false);
    injectIsLoading = setIsLoading;

    const handleChangeQuill = (content, delta, source, editor) =>
        setPost({ ...post, content: content });

    const handleOpenSubContent = () => {
        if (isLoading) {
            return toast.error("Please wait for the image to upload");
        }
        setOpenSubContent(!openSubContent);
    };

    useEffect(() => {
        setPost({ ...postInit });
    }, [postInit]);

    return (
        <div className="container pt-10 py-28">
            {openSubContent ? (
                <SubContent
                    isEdit={isEdit}
                    post={post}
                    handleBackClick={handleOpenSubContent}
                ></SubContent>
            ) : (
                <div className="wrap">
                    <h1 className="font-bold text-3xl uppercase ">
                        {isEdit ? "Edit" : "Create"} Post
                    </h1>
                    <div className={clsx(styles.wrap, "mt-10")}>
                        <form>
                            <div className={clsx(styles.formField, "text-xl ")}>
                                <textarea
                                    required
                                    value={post.title}
                                    onChange={(e) =>
                                        setPost({
                                            ...post,
                                            title: e.target.value,
                                        })
                                    }
                                    name="title"
                                    className={clsx(styles.formInput)}
                                    placeholder="Enter a title..."
                                    type="text"
                                />
                                <label className={clsx(styles.formLabel)}>
                                    Title
                                </label>
                            </div>
                            <div className="mt-6">
                                <ReactQuill
                                    theme="snow"
                                    value={post.content || ""}
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
                        </form>
                    </div>

                    <button
                        onClick={handleOpenSubContent}
                        className={clsx(
                            "cursor-pointer hover:opacity-80z w-auto rounded-lg inline-block float-end my-4 px-4 py-2 text-white bg-black font-semibold text-base",
                            {
                                notActive: !post.title && !post.content,
                            }
                        )}
                    >
                        Publish
                    </button>
                </div>
            )}
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

export default memo(CreatePost);
