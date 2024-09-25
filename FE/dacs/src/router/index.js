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
import Course from "../pages/course";
import ListCategory from "../pages/admin/Category/list";
import CategoryEdit from "../pages/admin/Category/edit";
import CreateCategory from "../pages/admin/Category/create";
import HistoryDeleted from "../pages/admin/Course/historyDeleted";
import HistoryDeletedCategory from "../pages/admin/Category/historyDeleted";
import ListUser from "../pages/admin/user/list";
import ListDeletedUser from "../pages/admin/user/historyDeleted";
import UserProfile from "../pages/user/userProfile/index";
import Payment from "../pages/payment";
import SuccessPayment from "../pages/payment/success";
import FailurePayment from "../pages/payment/failure";
import AdminView from "../pages/admin/user/userProfileAdmin";
import MyCourses from "../pages/user/userCourse/index";
import ListInvoice from "../pages/admin/invoice/list";
import ListDeleteInvoice from "../pages/admin/invoice/historyDelete";
import CreateUser from "../pages/admin/user/create";
import AdminDetailCourse from "../pages/admin/Course/detail";
import Post from "../pages/Post";
import CreatePost from "../pages/Post/create";
import ViewPost from "../pages/Post/ViewPost";
import EditPost from "../pages/Post/edit";
import BookMark from "../pages/Post/bookmark";
import MyPosts from "../pages/Post/MyPosts";
import ListPost from "../pages/admin/post/list";
import AdminViewPost from "../pages/admin/post/view";

const publicRoutes = [
    { path: "/", component: LandingPage },
    { path: "/sign-up", component: SignUp },
    { path: "/login", component: Login },
    { path: "*", component: NotFoundPage },
    { path: "/course/:id", component: Course },
    { path: "/posts", component: Post },
    { path: "/posts/:title/", component: ViewPost },
];

const userRoutes = [
    { path: "/course/detail/:id", component: DetailCourse },
    {
        path: "/course/detail/:id/openComment",
        component: DetailCourse,
    },
    { path: "/me/my-courses", component: MyCourses },
    { path: "/course/payment/:id", component: Payment },
    { path: "/payment/success", component: SuccessPayment },
    { path: "/payment/failure", component: FailurePayment },
    { path: "me/profile/:email", component: UserProfile },
    { path: "/new-post", component: CreatePost },
    { path: "/post/:id/edit", component: EditPost },
    { path: "/me/posts/publish", component: MyPosts },
    { path: "/me/bookmark/posts", component: BookMark },
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

export { publicRoutes, adminRoutes, userRoutes };
