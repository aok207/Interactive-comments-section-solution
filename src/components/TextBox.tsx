import { useState } from "react";
import Textarea from "./Textarea";
import data from "../data/data.json";
import timeAgo from "../calculateTime";

interface TextBoxProp {
  typeOfComment: string;
  replyingTo: string | null;
  replyingToAReply: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateCommentList: (commentList: any) => void;
  originalCommentIndex?: number;
}

function TextBox({
  typeOfComment /* send, reply */,
  replyingTo,
  replyingToAReply,
  updateCommentList,
  originalCommentIndex = 0,
}: TextBoxProp) {
  const storedData = JSON.parse(localStorage.getItem("data") || "{}");

  const [inputValue, setInputValue] = useState(
    typeOfComment === "send" ? "" : `@${replyingTo}`
  );

  // Will get the input value from Textarea component
  const getInputValue = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setInputValue(e.currentTarget.value);
  };

  // Logic after btn click
  const btnOnClick = (): void => {
    if (typeOfComment === "send") {
      const newComment = {
        id: storedData.comments.length + 1,
        content: inputValue,
        createdAt: "a few seconds ago",
        score: 0,
        user: data.currentUser,
        replies: [],
        timestamp: `${new Date()}`,
      };
      storedData.comments.push(newComment);
      setInputValue("");
    } else {
      const newReply = {
        id: storedData.comments[originalCommentIndex].replies.length + 1,
        content: inputValue.split(" ").slice(1).join(" "),
        createdAt: "a few seconds ago",
        score: 0,
        user: data.currentUser,
        replyingTo: replyingTo,
        timestamp: `${new Date()}`,
      };

      storedData.comments[originalCommentIndex].replies.push(newReply);
      setInputValue(`@${replyingTo} `);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    storedData.comments.forEach((comment: any) => {
      comment.createdAt = timeAgo(new Date(comment.timestamp).getTime());
      if (comment.replies.length !== 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        comment.replies.forEach((reply: any) => {
          reply.createdAt = timeAgo(new Date(reply.timestamp).getTime());
        });
      }
    });

    const updatedDataString = JSON.stringify(storedData);
    localStorage.setItem("data", updatedDataString);
    updateCommentList(storedData.comments);
  };

  return (
    <>
      {typeOfComment === "send" || typeOfComment === "reply" ? (
        <div
          className={`bg-white sm:flex sm:gap-5 rounded-md p-5 ${
            replyingToAReply ? "ml-5" : ""
          }`}
        >

          <div className="hidden sm:block">
            <img
              src={`${data.currentUser.image.png}`}
              alt="user profile"
              className="w-10"
            />
          </div>

          <div className="flex-grow">
            <Textarea
              placeHolder={typeOfComment === "send" ? "Add a comment..." : " "}
              value={inputValue}
              onChange={getInputValue}
            />
          </div>

          <div className="hidden sm:block">
            <button
              onClick={btnOnClick}
              className="text-white bg-moderate-blue rounded-md px-6 py-3 hover:bg-light-grayish-blue"
            >
              {typeOfComment.toUpperCase()}
            </button>
          </div>

          <div className="flex sm:hidden items-center justify-between mt-3">
            <img
              src={`${data.currentUser.image.png}`}
              alt="user profile"
              className="w-10"
            />
            <button
              onClick={btnOnClick}
              className="text-white bg-moderate-blue rounded-md px-6 py-3"
            >
              {typeOfComment.toUpperCase()}
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default TextBox;
