import styles from "../../../admin/Course/create/CreateCourse.module.scss";
import clsx from "clsx";
import btnClose from "../../../../assets/images/btnClose.svg";
import fileSelect from "../../../../assets/images/fileSelect.svg";
import { useEffect, useState } from "react";
import React from "react";
import CreatableSelect from "react-select/creatable";
import { toast } from "sonner";
import * as UserApi from "../../../../api/apiService/authService";
import { useSelector } from "react-redux";
import * as DataApi from "../../../../api/apiService/dataService";
import Debounce from "../../../../component/debounce";
import { useNavigate } from "react-router-dom";

const customStyles = {
    control: (provided) => ({
        ...provided,
        height: 50,
    }),
    multiValueLabel: (base) => ({
        ...base,
    }),
};

function SubContent({ isEdit = false, post = {}, handleBackClick }) {
    const [thumbnail, setThumbnail] = useState(post?.thumbnail || null);
    const user = useSelector((state) => state.login.user);
    const [tags, setTags] = useState(
        post?.tags?.map((tag) => {
            return {
                value: tag.name,
                label: `${tag.name} ${tag.sumP}`,
            };
        }) || []
    );
    const navigate = useNavigate();
    const [options, setOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleRemovePreview = () => {
        setThumbnail(null);
    };

    const MultiValue = (props) => {
        const { data, innerProps } = props;
        return (
            <div
                {...innerProps}
                className="input-select bg-gray-300 text-gray-700 text-sm mr-1 font-medium py-1 rounded-sm px-2"
            >
                <span style={{ fontWeight: "500" }}>{data.value}</span>
            </div>
        );
    };
    const SingleValue = (props) => {
        const { data, innerProps } = props;
        return (
            <div {...innerProps} className="input-select bg-gray-300">
                <span style={{ fontWeight: "500" }}>{data.value}</span>
            </div>
        );
    };

    const CustomOption = (props) => {
        const { label, data, innerProps } = props;
        const split = label.split(" ");
        const sum = split[split.length - 1];
        return (
            <div
                {...innerProps}
                ref={props.innerRef}
                className="hover:opacity-75 cursor-pointer pl-3 py-1"
            >
                <span style={{ fontWeight: "500" }}>{data.value}</span>
                <span className="text-gray-500 text-sm">
                    {!isNaN(Number(sum)) ? ` (${sum})` : ""}
                </span>
            </div>
        );
    };

    const handleUpLoadThubmnail = (e) => {
        const file = e.target.files[0];
        setIsLoading(true);
        toast.promise(DataApi.uploadFile(file), {
            loading: "loading...",
            success: (data) => {
                setThumbnail(data.content);
                setIsLoading(false);
                return "Upload thumbnail success";
            },
            error: (error) => {
                console.log(error);
                return "error";
            },
        });
    };

    const fetchApi = async (name) => {
        try {
            if (name === "") return;
            const result = await DataApi.serchTag(name);
            setOptions([
                ...result.content.map((tag) => {
                    return {
                        value: tag.name,
                        label: `${tag.name} ${tag.sumP}`,
                    };
                }),
            ]);
        } catch (error) {
            console.log(error);
        }
    };
    
    const handleInputChange = (e, actionMeta) => {
        if (actionMeta.action === "input-change") {
            const debounceApi = Debounce(fetchApi, 300);
            debounceApi(e);
        }
    };

    const handleChangeTag = (e) => {
        if (tags.length <= 4 && e.length <= 4) {
            setTags(e);
        }
    };

    const handlePublish = (isEdit) => {
        if (isLoading) {
            return toast.error("Please wait for the image to upload");
        }
        const tagsValue = tags.map((tag) => {
            return {
                name: tag.value,
            };
        });
        post = { ...post, tags: tagsValue, thumbnail };
        if (isEdit) {
            toast.promise(UserApi.updatePost({ ...post }, user.email), {
                loading: "loading...",
                success: (result) => {
                    navigate(`/posts/${encodeURIComponent(post.title)}`);
                    return result.mess;
                },
                error: (error) => {
                    console.log(error);
                    return error.mess;
                },
            });
        } else {
            toast.promise(UserApi.createPost({ ...post }, user.email), {
                loading: "loading...",
                success: (result) => {
                    console.log(encodeURIComponent(post.title));
                    navigate(`/posts/${encodeURIComponent(post.title)}`);
                    return result.mess;
                },
                error: (error) => {
                    console.log(error);
                    return error.mess;
                },
            });
        }
    };

    return (
        <div className="container mt-10">
            <div className="row">
                <div className="col-lg-6">
                    <div className="px-4">
                        <span className="font-semibold text-lg">Preview</span>
                        <div
                            className={clsx(
                                "mt-2 text-sm font-normal text-gray-700"
                            )}
                        >
                            Adding an attractive thumbnail picture will make
                            your article more attractive to readers.
                        </div>
                        <div className="flex overflow-hidden">
                            <div
                                className={clsx(
                                    styles.formField,
                                    "w-full overflow-hidden"
                                )}
                            >
                                <label
                                    htmlFor="thumbnail"
                                    style={{
                                        backgroundImage: thumbnail
                                            ? `url(${thumbnail})`
                                            : `url(${fileSelect})`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "50%",
                                    }}
                                    className={clsx(
                                        styles.formLabel2,
                                        styles.labelFile,
                                        "h-52 p-0"
                                    )}
                                ></label>
                                <button
                                    onClick={handleRemovePreview}
                                    className={clsx(styles.btnClosePreview)}
                                >
                                    <img src={btnClose} alt="" />
                                </button>
                                <input
                                    onChange={handleUpLoadThubmnail}
                                    name="thumbnail"
                                    id="thumbnail"
                                    type="file"
                                    hidden
                                    accept=".jpg, .jpeg, .png"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="px-4 sm:mt-8 max-sm:mt-6">
                        <div className="text-sm font-normal text-gray-700 mb-3">
                            Add up to 4 tags to let readers know what your post
                            is about.
                        </div>
                        <CreatableSelect
                            components={{
                                Option: CustomOption,
                                MultiValue: MultiValue,
                                SingleValue: SingleValue,
                            }}
                            placeholder={"Eg: Front-end, ReactJS..."}
                            isMulti
                            value={tags}
                            options={options}
                            onChange={handleChangeTag}
                            onInputChange={handleInputChange}
                            styles={customStyles}
                        />
                        <div className="flex justify-between">
                            <button
                                onClick={handleBackClick}
                                className="cursor-pointer hover:opacity-80z w-auto rounded-lg inline-block float-end mt-4 px-4 py-2 text-white bg-black font-medium text-sm"
                            >
                                Back To Create
                            </button>
                            <button
                                className="cursor-pointer hover:opacity-80z w-auto rounded-lg inline-block float-end mt-4 px-4 py-2 text-white bg-black font-medium text-sm"
                                onClick={() => handlePublish(isEdit)}
                            >
                                {isEdit ? "Update" : "Publish"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SubContent;
