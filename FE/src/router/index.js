import SignUp from "../pages/signUp";
import Login from "../pages/login";
import LandingPage from "../pages/landing";
import AdminPage from "../pages/admin";
import NotFoundPage from "../pages/notFound";
import ListCourse from "../pages/admin/Course/list";
import CreateCourse from "../pages/admin/Course/create";
import EditCourse from "../pages/admin/Course/edit";
import DetailCourseAdmin from "../pages/admin/Course/detail";
import DetailCourse from "../pages/course/detail";
import OverviewCourse from "../pages/course/OverviewCourse";
import ListCategory from "../pages/admin/Category/list";
import CategoryEdit from "../pages/admin/Category/edit";
import CreateCategory from "../pages/admin/Category/create";
import HistoryDeleted from "../pages/admin/Course/historyDeleted";
import HistoryDeletedCategory from "../pages/admin/Category/historyDeleted";
import ListUser from "../pages/admin/user/list";
import ListDeletedUser from "../pages/admin/user/historyDeleted";
import UserProfile from "../pages/user/profile";
import Payment from "../pages/payment";
import SuccessPayment from "../pages/payment/success";
import FailurePayment from "../pages/payment/failure";
import AdminView from "../pages/admin/user/userProfileAdmin";
import MyCourses from "../pages/user/course/index";
import ListInvoice from "../pages/admin/invoice/list";
import ListDeleteInvoice from "../pages/admin/invoice/historyDelete";
import CreateUser from "../pages/admin/user/create";
import AdminDetailCourse from "../pages/admin/Course/detail";
import Post from "../pages/Post/ListPostShow";
import CreatePost from "../pages/Post/create";
import ViewPost from "../pages/Post/ViewPost";
import EditPost from "../pages/Post/edit";
import BookMark from "../pages/Post/bookmark";
import ListPost from "../pages/admin/post/list";
import AdminViewPost from "../pages/admin/post/view";
import Instructor from "../pages/user/instructor";
import InstructorListCourse from "../pages/instructor/course/ListAvailableCourse";
import InstructorCreateCourse from "../pages/instructor/course/Create";
import ListDeletedCourse from "../pages/instructor/course/ListDeletedCourse";
import MyPostList from "../pages/user/post/MyPostList";

const publicRoutes = [
    { path: "/", component: LandingPage },
    { path: "*", component: NotFoundPage },
    { path: "/404", component: NotFoundPage },
    { path: "/course/overview/:title", component: OverviewCourse },
    { path: "/posts", component: Post },
    { path: "/posts/:title/", component: ViewPost },
];

const authRoutes = [
    { path: "/sign-up", component: SignUp },
    { path: "/login", component: Login },
];

const userRoutes = [
    { path: "/course/:title", component: DetailCourse },
    {
        path: "/course/detail/:title/openComment",
        component: DetailCourse,
    },
    { path: "/me/my-learning", component: MyCourses },
    { path: "/course/:title/payment", component: Payment },
    { path: "/payment/success", component: SuccessPayment },
    { path: "/payment/failure", component: FailurePayment },
    { path: "me/profile/:email", component: UserProfile },
    { path: "/new-post", component: CreatePost },
    { path: "/posts/:title/edit", component: EditPost },
    { path: "/me/posts", component: MyPostList },
    { path: "/posts/:title/view", component: ViewPost },
    { path: "/me/bookmark/posts", component: BookMark },
];

const instructorRoutes = [
    { path: "/instructor-dashboard", component: Instructor },
    {
        path: "/instructor-dashboard/course/list",
        component: InstructorListCourse,
    },
    {
        path: "/instructor-dashboard/course/historyDelete",
        component: ListDeletedCourse,
    },
    {
        path: "/instructor-dashboard/course/create",
        component: InstructorCreateCourse,
    },
    { path: "/instructor-dashboard/course/edit/:id", component: EditCourse },
];

const adminRoutes = [
    { path: "/admin", component: AdminPage },
    { path: "/admin/course/list", component: ListCourse },
    { path: "/admin/course/create", component: CreateCourse },
    { path: "/admin/course/edit/:id", component: EditCourse },
    {
        path: "/admin/course/detail/:id",
        component: AdminDetailCourse,
    },
    { path: "/admin/course/historyDelete", component: HistoryDeleted },
    { path: "/admin/category/list", component: ListCategory },
    { path: "/admin/category/create", component: CreateCategory },
    { path: "/admin/category/edit/:id", component: CategoryEdit },
    {
        path: "/admin/category/historyDelete",
        component: HistoryDeletedCategory,
    },

    { path: "/admin/user/list", component: ListUser },
    { path: "/admin/user/create", component: CreateUser },
    { path: "/admin/user/edit/:id", component: EditCourse },
    { path: "/admin/user/detail/:id", component: DetailCourseAdmin },
    { path: "/admin/user/historyDelete", component: ListDeletedUser },
    { path: "/admin/user/view/:email", component: AdminView },

    { path: "/admin/invoice/list", component: ListInvoice },
    { path: "/admin/invoice/create", component: CreateCourse },
    { path: "/admin/invoice/historyDelete", component: ListDeleteInvoice },

    { path: "/admin/post/list", component: ListPost },
    { path: "/admin/post/detail/:title", component: AdminViewPost },
];

export { publicRoutes, authRoutes, adminRoutes, userRoutes, instructorRoutes };
