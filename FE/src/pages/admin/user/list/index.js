import styles from "../../Course/list/List.module.scss";
import clsx from "clsx";
import { Link } from "react-router-dom";
import deleteIcon from "../../../../assets/images/delete.svg";
import avatar from "../../../../assets/images/avatar_25.jpg";
import editIcon from "../../../../assets/images/edit.svg";
import { Fragment, useEffect, useRef, useState } from "react";
import * as authApi from "../../../../api/apiService/authService";
import { toast } from "sonner";
import { Dialog, Transition } from "@headlessui/react";

import DataGridComponent from "../../../../component/table";
import SelectComponent from "../../../../component/select/SelectComponent";

const selectes = [5, 10, 25];

function reFormatCuorse(data) {
    if (!data || data.length === 0) return [];
    return data.map((item) => {
        const create = new Date(item.createdAt);
        const update = new Date(item.updatedAt);
        return {
            id: item.id,
            user: item,
            role: item.role,
            createdAt: create,
            updatedAt: update,
            actions: item,
        };
    });
}

function ListUser() {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [role, setRole] = useState([]);
    const [selected, setSelected] = useState(selectes[0]);
    const [page, setPage] = useState(0);
    const [totalData, setTotalData] = useState(0);
    const [deletedModalOpen, setDeletedModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [update, setUpdate] = useState();
    const [isLoadingData, setIsLoadingData] = useState(false);
    const firstRender = useRef(true);
    const columns = [
        {
            field: "user",
            headerName: "User",
            headerClassName: "theme-header",
            width: 316,
            type: "string",
            sortable: true,
            sortComparator: (v1, v2) => {
                return v1.title - v2.title;
            },
            renderCell: (params) => {
                return (
                    <div className={clsx(styles.field, "flex h-full relative")}>
                        <div
                            className={clsx(
                                styles.cssImg,
                                "flex items-center absolute top-0 translate-y-1/4"
                            )}
                        >
                            <img
                                src={
                                    !params.value.avatarUrl
                                        ? avatar
                                        : params.value.avatarUrl
                                }
                                alt=""
                            />
                        </div>
                        <div className="overflow-hidden flex flex-col justify-center ">
                            <div className={clsx(styles.name)}>
                                {params.value.lastName +
                                    " " +
                                    params.value.firstName}
                            </div>
                            <div className={clsx(styles.categories)}>
                                {params.value.email}
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            field: "role",
            headerName: "Role",
            headerClassName: "theme-header",
            sortable: true,
            type: "string",
            width: 140,
        },
        {
            field: "createdAt",
            headerName: "Create At",
            headerClassName: "theme-header",
            sortable: true,
            type: "dateTime",
            width: 220,
            renderCell: (params) => {
                const date = params.value.toLocaleDateString();
                const time = params.value.toLocaleTimeString();
                return <>{date + "" + time}</>;
            },
        },
        {
            field: "updatedAt",
            headerName: "Updated At",
            headerClassName: "theme-header",
            sortable: true,
            type: "dateTime",
            width: 220,
            renderCell: (params) => {
                const date = params.value.toLocaleDateString();
                const time = params.value.toLocaleTimeString();
                return <>{date + "" + time}</>;
            },
        },
        {
            field: "actions",
            headerClassName: "theme-header",
            width: 160,
            type: "actions",
            renderCell: (params) => {
                return (
                    <div className={clsx(styles.name, "flex gap-4")}>
                        <Link
                            to={`/admin/user/view/${encodeURIComponent(
                                params.value.email
                            )}`}
                        >
                            <img src={editIcon} alt="" />
                        </Link>

                        <button
                            onClick={() => openDeleteModal(params.value.id)}
                        >
                            <img
                                src={deleteIcon}
                                alt=""
                                className="cursor-pointer"
                            />
                        </button>
                    </div>
                );
            },
        },
    ];

    const handleRemoveUser = () => {
        const fetchApi = async () => {
            toast.promise(authApi.softDeleteUser(deleteId), {
                loading: "Removing...",
                success: () => {
                    setUpdate(!update);
                    setDeletedModalOpen(false);
                    return "Delete successfully";
                },
                error: (error) => {
                    console.log(error);
                    return error.mess;
                },
            });
        };

        fetchApi();
    };

    const handleSelectChange = (e) => {
        setRole(e);
        setIsLoadingData(true);
        const fetchApi = async () => {
            try {
                const result = await authApi.getUserByRole(
                    e,
                    false,
                    page,
                    selected
                );
                setUsers(result.content);
                setTotalData(result.totalElements);
            } catch (error) {
                console.log(error);
                toast.error(error.mess);
            } finally {
                setIsLoadingData(false);
            }
        };

        const debounceApi = debounce(fetchApi);
        debounceApi();
    };

    const handleSearchInputChange = (e) => {
        setIsLoadingData(true);
        const fetchApi = async () => {
            try {
                const data = await authApi.getUserByName(
                    e.target.value,
                    page,
                    selected
                );
                setUsers(data.content);
                setTotalData(data.totalElements);
            } catch (error) {
                console.log(error);
                toast.error(error.mess);
            } finally {
                setIsLoadingData(false);
            }
        };
        const debounceApi = debounce(fetchApi, 300);
        debounceApi();
    };

    let timerId;

    const debounce = (func, delay = 600) => {
        return () => {
            clearTimeout(timerId);
            timerId = setTimeout(() => {
                func();
            }, delay);
        };
    };

    useEffect(() => {
        const fetchApi = async () => {
            try {
                let array = [];
                const result = await authApi.getAllUserAndRole(page, selected);
                result.roles.map((value) =>
                    array.push({ value: value, label: value })
                );
                array.push({ value: "All", label: "All" });
                setTotalData(result.users.totalElements);
                setRoles(array);
                setUsers(result.users.content);
            } catch (error) {
                console.log(error);
            }
        };
        fetchApi();
    }, [update]);

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        const fetchApi = async () => {
            try {
                const result = await authApi.getUserByPage(page, selected);
                setUsers(result.content.content);
            } catch (error) {
                console.log(error);
            }
        };
        fetchApi();
    }, [page, selected]);

    const handlePageData = async (action) => {
        setPage(action.page);
        setSelected(action.pageSize);
    };

    const handleCloseModal = () => {
        setDeletedModalOpen(false);
    };

    const openDeleteModal = (id) => {
        setDeleteId(id);
        setDeletedModalOpen(true);
    };

    return (
        <div className="flex justify-center w-full ">
            <div className="container mt-4 mx-14">
                <div className="wrapMainDash">
                    <div className={clsx(styles.topMain)}>
                        <div className={clsx(styles.itemTopMain)}>
                            <h4>LIST USER</h4>
                        </div>
                        <div className={clsx(styles.itemTopMain)}>
                            <Link to={"/sign-up"} className={styles.btnCreate}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                    role="img"
                                    className="component-iconify MuiBox-root css-1t9pz9x iconify iconify--mingcute"
                                    width="20px"
                                    height="20px"
                                    viewBox="0 0 24 24"
                                >
                                    <g fill="none">
                                        <path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path>
                                        <path
                                            fill="currentColor"
                                            d="M11 20a1 1 0 1 0 2 0v-7h7a1 1 0 1 0 0-2h-7V4a1 1 0 1 0-2 0v7H4a1 1 0 1 0 0 2h7z"
                                        ></path>
                                    </g>
                                </svg>
                                New User
                            </Link>
                        </div>
                    </div>

                    <div className="formGroup flex flex-col gap-3">
                        <div
                            className={clsx(
                                styles.contentMain,
                                "flex justify-between gap-3"
                            )}
                        >
                            <div className={clsx(styles.contentItem)}>
                                <div
                                    className={clsx(
                                        styles.formSelect,
                                        "focus:border-black hover:border-black border-gray-300 w-52"
                                    )}
                                >
                                    <label htmlFor="">Role</label>
                                    <SelectComponent
                                        value={role}
                                        handleChange={handleSelectChange}
                                        placeholder="All"
                                        data={roles}
                                    />
                                </div>
                            </div>
                            <div className={clsx(styles.contentItem, "flex-1")}>
                                <div
                                    id="seachWrap"
                                    className={clsx(styles.search, "ml-0")}
                                >
                                    <input
                                        onChange={handleSearchInputChange}
                                        id="searchInput"
                                        type="search"
                                        placeholder="Search.."
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <DataGridComponent
                                columns={columns}
                                rows={reFormatCuorse(users)}
                                totalElements={totalData}
                                isLoading={isLoadingData}
                                paginationModel={{
                                    pageSize: selected,
                                    page: page,
                                }}
                                setPaginationModel={handlePageData}
                            ></DataGridComponent>
                        </div>
                    </div>
                </div>
            </div>

            <Transition appear show={deletedModalOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-10"
                    onClose={handleCloseModal}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto overlay">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="z-50 w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <h2 className={styles.titleModal}>
                                        Delete
                                    </h2>
                                    <div
                                        className={clsx(
                                            styles.descModal,
                                            "mt-3"
                                        )}
                                    >
                                        Are you sure want to delete?
                                    </div>
                                    <div
                                        className={clsx(
                                            "flex justify-end mt-4"
                                        )}
                                    >
                                        <button
                                            onClick={handleRemoveUser}
                                            className={clsx("btnModal delete")}
                                        >
                                            Delete
                                        </button>
                                        <button
                                            onClick={handleCloseModal}
                                            className={clsx("btnModal cancel")}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}

export default ListUser;
