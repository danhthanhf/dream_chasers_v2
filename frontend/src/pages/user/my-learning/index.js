import React, { memo, useEffect, useState } from "react";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { getAlEnrollCourse } from "../../../api/apiService/userService";
import Ink from "react-ink";
import { convertSecondsToTime } from "../../../util";

function Badge({ children }) {
    return (
        <div className="flex justify-center px-2.5 py-1 bg-white rounded-md border border-gray-500 border-solid text-xs ">
            {children}
        </div>
    );
}
export const Card = memo(({ enrollment, textBtn = "Go to learn" }) => {
    var course = enrollment?.course;
    console.log(enrollment);
    return (
        <div className="rounded-xl b-shadow-light">
            <div className="p-2">
                <div className="rounded-xl overflow-hidden  border-1 border-gray-200">
                    <img
                        src={course.thumbnail}
                        alt=""
                        className="object-cover w-full h-[200px]"
                    />
                </div>
                <div className="px-2 pt-[20px] pb-3">
                    <div className="flex gap-2 text-xs text-gray-500">
                        <div className="flex gap-1.5 px-2 py-1 rounded-md bg-[#edeff1]">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                                role="img"
                                className="w-4 h-4"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="currentColor"
                                    fillRule="evenodd"
                                    d="M12 2.75a9.25 9.25 0 1 0 0 18.5a9.25 9.25 0 0 0 0-18.5M1.25 12C1.25 6.063 6.063 1.25 12 1.25S22.75 6.063 22.75 12S17.937 22.75 12 22.75S1.25 17.937 1.25 12M12 7.25a.75.75 0 0 1 .75.75v3.69l2.28 2.28a.75.75 0 1 1-1.06 1.06l-2.5-2.5a.75.75 0 0 1-.22-.53V8a.75.75 0 0 1 .75-.75"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                            {course &&
                                convertSecondsToTime(course.totalDuration)}
                        </div>
                        <div className="flex gap-1.5 px-2 py-1 rounded-md bg-[#edeff1]">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                                className="w-4 h-4"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    cx="9.001"
                                    cy="6"
                                    r="4"
                                    fill="currentColor"
                                ></circle>
                                <ellipse
                                    cx="9.001"
                                    cy="17.001"
                                    fill="currentColor"
                                    rx="7"
                                    ry="4"
                                ></ellipse>
                                <path
                                    fill="currentColor"
                                    d="M21 17c0 1.657-2.036 3-4.521 3c.732-.8 1.236-1.805 1.236-2.998c0-1.195-.505-2.2-1.239-3.001C18.962 14 21 15.344 21 17M18 6a3 3 0 0 1-4.029 2.82A5.7 5.7 0 0 0 14.714 6c0-1.025-.27-1.987-.742-2.819A3 3 0 0 1 18 6.001"
                                ></path>
                            </svg>
                            {course && course.totalRegister}
                        </div>
                    </div>
                    {/* <div className="flex justify-start my-2 flex-wrap gap-1.5">
                        {course.categories?.map((category, index) => (
                            <Badge key={index} keyData={category.id}>
                                {category.name}
                            </Badge>
                        ))}
                    </div> */}
                    <div className="font-semibold text-sm mt-3.5 text-black line-clamp-2 min-h-10">
                        {course && course.title + " "}
                    </div>
                    <div className="mt-6 flex justify-between">
                        <div className="font-semibold text-sm border-1 border-gray-300 rounded-lg px-2 flex items-center">
                            {enrollment.completed
                                ? "Completed"
                                : enrollment.totalCompletedLessons +
                                  "/" +
                                  enrollment.totalLessons +
                                  " lessons"}
                        </div>
                        <Link
                            to={`/course/${course.id}`}
                            className="bg-black cursor-pointer relative py-1.5 hover:opacity-80 transition-all rounded-lg text-white font-bold text-sm px-4"
                            size="sm"
                        >
                            <Ink></Ink>
                            Go to course
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
});

const mockData = [
    {
        totalLessons: 8,
        totalCompletedLessons: 8,
        course: {
            id: "f20b2c39-fd9e-409b-ba2c-39e853e08e79",
            discount: 0,
            price: 0,
            totalDuration: 739,
            isEditedCategories: 0,
            isEdited: 0,
            totalRegister: 7,
            totalRating: 2,
            scoreRating: 4.25,
            author: {
                email: "admin@gmail.com",
                firstName: "Nguyen",
                lastName: "Admin",
                avatarUrl:
                    "https://res.cloudinary.com/dosrtyzbs/image/upload/v1733680889/dream_chasers_v2/ucq0bsof1yvekskkbnoi.png",
                phoneNumber: "0949550687",
                bio: " new bio 1",
            },
            title: "Become a Certified Web Developer: HTML, CSS and JavaScript",
            tier: "FREE",
            description:
                "<p><strong>Completely Updated for 2023/2024 with 40 NEW lectures coding activities and projects!&nbsp;</strong></p><p>Learn What It Takes to Code Dynamic, Professional Websites and Web Apps From The Comfort of Your Own Home&nbsp;</p><p>Do you ever browse the internet wondering how your favorite websites were built? Facebook, Twitter, Amazon—they were all created by people who at one point in time didn’t know anything about coding. How did they obtain this knowledge?&nbsp;</p><p>In this comprehensive course, I’m going to show you everything you need to know so that you can follow in these people’s footsteps.&nbsp;</p><p>You’re going to learn how to code AND you’re going to become a certified professional from a recognized international trainer. And best of all, you’re going to have fun doing it.&nbsp;</p><p>You Don’t Have to Be a Genius or a Mathematical Wizard.&nbsp;</p><p>So many people believe that you must have a special ‘gift’ to create professional-quality, dynamic websites/web apps. I’m here to tell you once and for all that this is false. All you need to have is the desire to learn and the ability to follow instructions—that’s it!&nbsp;</p><p>Our course starts teaching basic coding principles and develops your coding skills in a variety of languages from beginner through to advanced. Here it is, once and for all, a complete guide that will take you from novice to web developer.&nbsp;</p><p>Skip Hours of Frustration and Thousands of Wasted Dollars and Become 100% Certified&nbsp;</p><p>The internet has changed the rules of doing business. More and more companies are migrating online while many new, never before seen businesses are created every day thanks to the power of this phenomenon. You know what that means? Higher demand for people just like you!&nbsp;</p><p>But the problem for these businesses is that while demand is high, supply is short.&nbsp;</p><p>Please don’t let a lack of knowledge stop you from having the career of your dreams, not when the knowledge you need is right here and is extremely affordable.&nbsp;</p><p>Don’t worry, you won’t need to buy any additional courses, it’s all here. No need to spend four years and over $15,000 per year in college tuition either—it really is all here. From HTML to CSS then to Javascript and finally PHP, you will learn how to Become a Certified Web Developer.&nbsp;</p><p>It Doesn’t Matter Where You’re Starting From...You Can Do It!&nbsp;</p><p>Maybe:&nbsp;</p><p>&nbsp;&nbsp;&nbsp;● You’re planning on studying coding at college and want to build a rock-solid foundation so that you have a huge head start before your course begins?&nbsp;</p><p>&nbsp;&nbsp;&nbsp;● You’re dissatisfied with your current job and want to learn exactly what it takes to become a fully qualified web developer?&nbsp;</p><p>&nbsp;&nbsp;&nbsp;● You’re currently working in IT but want to expand your skill base so that you’re 100% up to date with the latest developments in web technology?&nbsp;</p><p>&nbsp;&nbsp;&nbsp;● You want to develop mobile apps or websites on the side to create some additional income while retaining your current job?&nbsp;</p><p><strong>Learn Skills That Will Benefit You for The Rest of Your Life&nbsp;</strong></p><p>- Imagine being able to create a web app that is downloaded by millions of paying customers—or a website that’s visited by people from all seven continents.&nbsp;</p><p>- Imagine the limitless opportunities that having these programming skills will give you.&nbsp;</p><p>- Imagine working in a field that challenges you and allows you to express yourself freely every day.&nbsp;</p><p>- Imagine being paid extremely well for developing products and services that can help change people’s lives.&nbsp;</p><p>Stop imagining and take action! It’s time to start your journey. Your future is waiting for you...&nbsp;</p><p><br></p><p><strong>Four Certifications in One</strong></p><p>The unique Certified Web Development Professional credential will provide proof that you have mastered the fundamental skills needed by new web developers. You'll have a full understanding of HTML5, the language used to structure web sites and many mobile applications that you use every day. From there, you'll move on to Javascript-- the language of interaction on the web. The use of Javascript is growing at a lightning pace and it's been called \"the most important language to learn today,\" by multiple experts.</p><p>Each language carries its own individual Specialist Designation for which you earn a certificate, the privilege of using the specialist credential badge, and a personal online transcript page that shows your designations, certification, and accomplishments.</p><p><br></p><p><strong>Prepare for Valuable Industry Certifications</strong></p><p>This course is specially designed to prepare you for the&nbsp;Web Development Professional Certification from LearnToProgram, Inc. This certification will allow you to prove that you have achieved competencies in HTML, CSS, and JavaScript-- everything you need to create basic web applications.&nbsp;<strong>New for 2023:&nbsp;&nbsp;</strong>No exams are required to earn your certifications.&nbsp;Complete and submit all the lab activities for the course program and you'll earn your new certifications!</p><p><br></p><p><strong>Certified Web Developers</strong>&nbsp;will receive:&nbsp;</p><ol><li>A printable certificate indicating the new certification that you can present to employers or prospects</li><li>A letter explaining the certification and its value to a prospective employer. The letter will state exactly what mastery the certification represents</li><li>Authorization to use the LearnToProgram Certified Web Developer Badge on your website and marketing materials</li><li>Automatic linkage to your LinkedIn account to display your certification</li></ol><p><br></p>",
            thumbnail:
                "https://res.cloudinary.com/dosrtyzbs/image/upload/v1731077345/dream_chasers_v2/u7uwwnazzu76kyymt1w8.png",
            video: "https://res.cloudinary.com/dosrtyzbs/video/upload/v1731077241/dream_chasers_v2/gog2pnxpyey5nk0cgt1w.mp4",
            enrolled: false,
            visible: false,
            status: "PUBLISHED",
            createdAt: "2024-11-08T21:52:18.541867",
            updatedAt: "2024-12-08T21:16:11.306343",
            categories: ["It", "Java"],
            sections: [
                {
                    id: "5e706ff1-0336-4a29-a399-399e5c65b6ef",
                    title: "Setting the scene",
                    totalDuration: 441,
                    isEdited: 0,
                    lessons: [
                        {
                            id: "7fe44328-c8ad-4eec-8f52-30528feec7ac",
                            createdAt: "2024-11-08T21:52:18.552913",
                            updatedAt: "2024-11-08T21:52:18.552913",
                            deleted: false,
                            title: "Welcom",
                            video: "https://res.cloudinary.com/dosrtyzbs/video/upload/v1731077401/dream_chasers_v2/jajghmasoqazrrp7pgpr.mp4",
                            description: "asd",
                            duration: 163,
                        },
                        {
                            id: "1ec6d35f-c402-4557-9885-a7f8ffc3f03f",
                            createdAt: "2024-11-08T21:52:18.557234",
                            updatedAt: "2024-11-08T21:52:18.557234",
                            deleted: false,
                            title: "Student Workbook and Download Pack",
                            video: "https://res.cloudinary.com/dosrtyzbs/video/upload/v1731077411/dream_chasers_v2/yc7tvfajildokw6dfnqa.mp4",
                            description: "asdasd",
                            duration: 139,
                        },
                        {
                            id: "9d1f6a02-77aa-4f12-9a01-6bfb79a9e768",
                            createdAt: "2024-11-08T21:52:18.559241",
                            updatedAt: "2024-11-08T21:52:18.559241",
                            deleted: false,
                            title: "The business beneifits of user ",
                            video: "https://res.cloudinary.com/dosrtyzbs/video/upload/v1731077425/dream_chasers_v2/hq3xt8kzkbnf2m561aff.mp4",
                            description: "",
                            duration: 139,
                        },
                    ],
                },
                {
                    id: "cc91f7c8-4033-4cc5-b146-fcadb5e7debc",
                    title: "Going where the action is: Understanding users in context",
                    totalDuration: 159,
                    isEdited: 0,
                    lessons: [
                        {
                            id: "819ed0a9-5346-47ec-b7a3-a4be3118d7a8",
                            createdAt: "2024-11-08T21:52:18.563279",
                            updatedAt: "2024-11-08T21:52:18.563279",
                            deleted: false,
                            title: "Introduction to Section 2",
                            video: "https://res.cloudinary.com/dosrtyzbs/video/upload/v1731077462/dream_chasers_v2/oauwpfk8bicaimuuy7js.mp4",
                            description: "",
                            duration: 139,
                        },
                        {
                            id: "4de2bccd-4704-4d1a-a07d-239680d6ca64",
                            createdAt: "2024-11-08T21:52:18.565283",
                            updatedAt: "2024-11-08T21:52:18.565283",
                            deleted: false,
                            title: 'How uasbilyti depends on the "context of use"',
                            video: "https://res.cloudinary.com/dosrtyzbs/video/upload/v1731077479/dream_chasers_v2/maitwous9jbvbb6qlfhy.mp4",
                            description: "",
                            duration: 10,
                        },
                        {
                            id: "8dbcd165-3223-48a5-be58-a921d0960cdb",
                            createdAt: "2024-11-08T21:52:18.56628",
                            updatedAt: "2024-11-08T21:52:18.567281",
                            deleted: false,
                            title: "What is a browser ?",
                            video: "https://res.cloudinary.com/dosrtyzbs/video/upload/v1731077491/dream_chasers_v2/nstd4ybvsc6nflnue4fw.mp4",
                            description: "",
                            duration: 10,
                        },
                    ],
                },
                {
                    id: "bebbfecf-6cd5-4644-97dc-6f65b6ddf999",
                    title: "How to get niche quick",
                    totalDuration: 139,
                    isEdited: 0,
                    lessons: [
                        {
                            id: "a710eb6e-bf3a-4d00-a262-55c891162e60",
                            createdAt: "2024-11-08T21:52:18.570791",
                            updatedAt: "2024-11-08T21:52:18.570791",
                            deleted: false,
                            title: "Introduction to Personaas",
                            video: "https://res.cloudinary.com/dosrtyzbs/video/upload/v1731077515/dream_chasers_v2/gpskyyextbluswypmeup.mp4",
                            description: "asd",
                            duration: 139,
                        },
                        {
                            id: "902a6b39-af16-4c5b-b24c-78326d385114",
                            createdAt: "2024-11-08T21:52:18.572324",
                            updatedAt: "2024-11-08T21:52:18.572324",
                            deleted: false,
                            title: "The 7-step persona checklisy",
                            video: "https://res.cloudinary.com/dosrtyzbs/video/upload/v1731077533/dream_chasers_v2/edbm1xafhw5pfuosqako.mp4",
                            description: "asdasd",
                            duration: 0,
                        },
                    ],
                },
            ],
            progress: null,
        },
        progresses: [
            {
                timeStamp: 0,
                duration: 163,
                lessonId: "7fe44328-c8ad-4eec-8f52-30528feec7ac",
                locked: false,
                completed: true,
            },
            {
                timeStamp: 0,
                duration: 139,
                lessonId: "1ec6d35f-c402-4557-9885-a7f8ffc3f03f",
                locked: false,
                completed: true,
            },
            {
                timeStamp: 0,
                duration: 139,
                lessonId: "9d1f6a02-77aa-4f12-9a01-6bfb79a9e768",
                locked: false,
                completed: true,
            },
            {
                timeStamp: 0,
                duration: 139,
                lessonId: "819ed0a9-5346-47ec-b7a3-a4be3118d7a8",
                locked: false,
                completed: true,
            },
            {
                timeStamp: 0,
                duration: 10,
                lessonId: "4de2bccd-4704-4d1a-a07d-239680d6ca64",
                locked: false,
                completed: true,
            },
            {
                timeStamp: 0,
                duration: 10,
                lessonId: "8dbcd165-3223-48a5-be58-a921d0960cdb",
                locked: false,
                completed: true,
            },
            {
                timeStamp: 0,
                duration: 139,
                lessonId: "a710eb6e-bf3a-4d00-a262-55c891162e60",
                locked: false,
                completed: true,
            },
            {
                timeStamp: 0,
                duration: 0,
                lessonId: "902a6b39-af16-4c5b-b24c-78326d385114",
                locked: false,
                completed: true,
            },
        ],
        myRating: null,
        completed: true,
    },
];

const MyLearning = () => {
    const [enrollments, setEnrollments] = useState([]);
    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = await getAlEnrollCourse();
                console.log(result);
                setEnrollments(result);
            } catch (error) {
                console.log(error);
            }
        };

        fetchApi();
    }, []);

    return (
        <div>
            <div className={clsx("bg-[#2d2f31] text-white pt-12 pb-5")}>
                <div className="container">
                    <h1 className={clsx("uppercase font-extrabold")}>
                        My Learning
                    </h1>
                </div>
            </div>
            <div className={clsx("container mt-6")}>
                <div className="grid grid-cols-12 gap-4">
                    {enrollments?.length > 0 ? (
                        enrollments.map((item, ind) => (
                            <div className="lg:col-span-3">
                                <Card key={item.id} enrollment={item} />
                            </div>
                        ))
                    ) : (
                        <div className="text-lg font-semibold">
                            You have not enroll for any courses yet
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyLearning;
