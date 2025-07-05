import HistoryDeleted from "../../admin/Course/historyDeleted";

function ListDeletedCourse() {
    return (
        <div>
            <HistoryDeleted isAdmin={false}></HistoryDeleted>
        </div>
    );
}

export default ListDeletedCourse;
