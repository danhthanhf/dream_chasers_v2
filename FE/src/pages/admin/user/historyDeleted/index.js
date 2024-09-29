import styles from "../../Course/list/List.module.scss";
import clsx from "clsx";
import avatar from "../../../../assets/images/avatar_25.jpg";
import restoreIcon from "../../../../assets/images/restore.svg";
import { useEffect, useState } from "react";
import * as authApi from "../../../../api/apiService/authService";
import { toast } from "sonner";
import DataGridComponent from "../../../../component/table";
import SelectComponent from "../../../../component/select/SelectComponent";
import Modal from "../../../../component/modal";

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

function ListDeletedUser() {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [role, setRole] = useState("All");
    const [selected, setSelected] = useState(selectes[0]);
    const [page, setPage] = useState(0);
    const [totalData, setTotalData] = useState(0);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [reRender, setReRender] = useState();
    const [selectedRow, setSelectedRow] = useState([]);

    const [modalContent, setModalContent] = useState({
        title: "Delete",
        description: "Are you sure want to delete?",
        handleRemove: () => {},
        isOpen: false,
        handleCloseModal: () => {
            setModalContent({ ...modalContent, isOpen: false });
        },
    });

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
                        <button
                            type="button"
                            onClick={() => {
                                setModalContent({
                                    ...modalContent,
                                    title: "RESTORE",
                                    isOpen: true,
                                    description: "Are you sure want to restore",
                                    handleRemove: () =>
                                        handleRestoreUser(params.value.id),
                                });
                            }}
                        >
                            <img src={restoreIcon} alt="" />
                        </button>
                    </div>
                );
            },
        },
    ];

    const handleRoleChange = (e) => {
        setRole(e);
        setIsLoadingData(true);
        const fetchApi = async () => {
            try {
                const result = await authApi.getUserByRole(
                    e,
                    true,
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
                    role,
                    page,
                    selected,
                    true
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
        setIsLoadingData(true);
        const fetchApi = async () => {
            try {
                let array = [];
                const result = await authApi.getAllUserAndRole(
                    true,
                    page,
                    selected
                );
                result.roles.map((value) =>
                    array.push({ value: value, label: value })
                );
                array.push({ value: "All", label: "All" });
                setTotalData(result.users.totalElements);
                setRoles(array);
                setUsers(result.users.content);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoadingData(false);
            }
        };
        fetchApi();
    }, [page, selected, reRender]);

    const handleRestoreUser = (id) => {
        toast.promise(authApi.restoreUserById(id), {
            loading: "loading...",
            success: (data) => {
                setModalContent({ ...modalContent, isOpen: false });
                setReRender(!reRender);
                return data.mess;
            },
            error: (error) => {
                console.log(error);
                return error.mess;
            },
        });
    };

    const handlePageData = async (action) => {
        setPage(action.page);
        setSelected(action.pageSize);
        setIsLoadingData(true);
        const fetchApi = async () => {
            try {
                const result = await authApi.getAllDeletedUser(
                    action.page,
                    action.pageSize
                );
                setTotalData(result.totalElements);
                setUsers(result.content);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoadingData(false);
            }
        };
        fetchApi();
    };
    const openDeleteModal = (id) => {
        setModalContent({
            ...modalContent,
            isOpen: true,
            handleRemove: handleRestoreListUser,
            description: `Are you sure want to resotore ${selectedRow.length} user?`,
        });
    };

    const handleRowSelection = (selectionModel) => {
        setSelectedRow(selectionModel);
    };

    const handleRestoreListUser = async () => {
        try {
            await authApi.restoreListUser(selectedRow);
            setModalContent({ ...modalContent, isOpen: false });
            setReRender(!reRender);
            toast.success("Restore success");
        } catch (error) {
            toast.error(error.mess);
        }
    };

    return (
        <div className="flex justify-center w-full ">
            <div className="container mt-4 mx-14">
                <div className="wrapMainDash">
                    <div className={clsx(styles.topMain)}>
                        <div className={clsx(styles.itemTopMain)}>
                            <h4>HISTORy DELETED USER</h4>
                        </div>
                    </div>

                    <div className="formGroup flex flex-col gap-3 justify-center">
                        <div
                            className={clsx(
                                styles.contentMain,
                                "flex justify-between gap-3 items-center"
                            )}
                        >
                            <div className={clsx(styles.contentItem)}>
                                <div
                                    className={clsx(styles.formSelect, "w-52")}
                                >
                                    <label htmlFor="">Role</label>
                                    <SelectComponent
                                        value={role}
                                        handleChange={handleRoleChange}
                                        placeholder="All"
                                        data={roles}
                                    />
                                </div>
                            </div>
                            <div
                                className={clsx(
                                    "w-[160px] h-full flex items-center gap-1 cursor-pointer hover:opacity-70"
                                )}
                                onClick={openDeleteModal}
                            >
                                {selectedRow.length > 0 && (
                                    <>
                                        <button type="button">
                                            <img
                                                src={restoreIcon}
                                                alt=""
                                                className="w-5 h-5"
                                            />
                                        </button>
                                        <span className="text-xs font-semibold text-[#22c55e]">
                                            Restore ({selectedRow.length})
                                        </span>
                                    </>
                                )}
                            </div>
                            <div className={clsx(styles.contentItem, "flex-1")}>
                                <div
                                    id="seachWrap"
                                    className={clsx(styles.search)}
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
                                handleRowSelection={handleRowSelection}
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
            <Modal
                isOpen={modalContent.isOpen}
                closeModal={modalContent.handleCloseModal}
                handleRemove={modalContent.handleRemove}
                title={modalContent.title}
                description={modalContent.description}
            ></Modal>
        </div>
    );
}

export default ListDeletedUser;
