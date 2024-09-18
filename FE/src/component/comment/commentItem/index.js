import React from "react";
import moment from "moment";
import clsx from "clsx";
import styles from "./styles.module.css"; // Assuming you have a CSS module

const Comment = ({
    comment,
    handleReply,
    handleSendComment,
    subComment,
    setSubComment,
    showReplyBox,
    avatar,
}) => {
    const timeElapsed = moment(comment.date).fromNow();
    return (
        <div className={clsx(styles.cmtItem, "flex flex-col flex-none")}>
            <div className={styles.cmt}>
                <img src={avatar} alt="avatar" />
                <div className={styles.cmtContent}>
                    <div className={styles.wrap}>
                        <span>{comment.author}</span>
                        {comment.text}
                    </div>
                    <div className={styles.timeCmt}>{timeElapsed}</div>
                    <div className={styles.actionsCmt}>
                        <button onClick={() => handleReply(comment.id)}>Reply</button>
                    </div>
                </div>
            </div>
            {comment.children &&
                comment.children.map((childComment, ind) => (
                    <Comment
                        key={ind}
                        comment={childComment}
                        handleReply={handleReply}
                        handleSendComment={handleSendComment}
                        subComment={subComment}
                        setSubComment={setSubComment}
                        showReplyBox={showReplyBox}
                        avatar={avatar}
                    />
                ))}
        </div>
    );
};