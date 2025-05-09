import styles from "../../Course/create/CreateCourse.module.scss";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import * as adminService from "../../../../api/apiService/adminService";
import * as publicService from "../../../../api/apiService/publicService";
import { useParams } from "react-router-dom";

function CategoryEdit() {
    const { id } = useParams();
    const [category, setCateogry] = useState({
        id: "",
        name: "",
    });
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCateogry({
            ...category,
            [name]: value,
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await publicService.getCategoryById(id);
                setCateogry(result.content);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        toast.promise(adminService.editCategory(id, category), {
            loading: "Loading...",
            success: (data) => {
                return "Update Sucessfully";
            },
            error: (error) => {
                return error.message;
            },
        });
    };

    return (
        <div>
            <div className="container flex flex-col">
                <div className="wrapMainDash mr-auto w-3/4 ">
                    <h3 className="titleMainDash">Edit a category</h3>
                    <div
                        className={clsx(
                            styles.formGroup,
                            "flex gap-6 flex-col rounded-lg"
                        )}
                    >
                        <div
                            className={clsx(styles.formField, "field-disable")}
                        >
                            <input
                                value={category.id}
                                onChange={handleInputChange}
                                name="id"
                                data-validate
                                className={clsx(styles.formInput)}
                                type="text"
                                disabled
                            />
                            <label className={clsx(styles.formLabel)}>Id</label>
                        </div>
                        <div className={clsx(styles.formField)}>
                            <input
                                required
                                onChange={handleInputChange}
                                value={category.name}
                                name="name"
                                data-validate
                                className={clsx(styles.formInput)}
                                type="text"
                            />
                            <label className={clsx(styles.formLabel)}>
                                Name
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="justify-center px-5 py-3.5 mt-5 text-sm font-medium text-center text-white bg-black rounded-lg max-md:max-w-full w-full"
                            onClick={handleSubmit}
                        >
                            Edit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CategoryEdit;
