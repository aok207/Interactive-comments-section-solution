import { useEffect, useState } from "react";
import data from "../data/data.json";
import TextBox from "./TextBox";
import Textarea from "./Textarea";
import DeleteModal from "./DeleteModal";
import timeAgo from "../calculateTime";

interface CommentBoxProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateCommentList: any;
  index: number;
  username: string;
  profilePic: string;
  createdAt: string;
  content: string;
  score: number;
  isAReply: boolean;
  replyingTo: string | null;
  originalCommentIndex: number;
}

function CommentBox({
  updateCommentList,
  index,
  username,
  profilePic,
  createdAt,
  content,
  score,
  isAReply,
  replyingTo = null,
  originalCommentIndex,
}: CommentBoxProps) {
  const storedData = JSON.parse(localStorage.getItem("data") || "{}");

  const [isEditMode, setIsEditMode] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [isModalShown, setIsModalShown] = useState(false);
  const [currentScore, setCurrentScore] = useState(score);
  const [editValue, setEditValue] = useState(content);

  // Reply Btn onClick
  const replyOnClik = (): void => {
    setIsReplying(!isReplying);
  };

  // Delete Btn onClick
  const deleteOnClick = (): void => {
    document.querySelector("body")!.style.overflow = "hidden";
    setIsModalShown(true);
  };

  // Pass this function as a prop to the modal component, and in the component call this function with the parameter of false
  const changeModalState = (state: boolean): void => {
    setIsModalShown(state);
  };

  // Edit Btn onClick
  const editOnClick = (): void => {
    setIsEditMode(!isEditMode);
  };

  // Add score functionality
  const addScore = (): void => {
    setCurrentScore(currentScore + 1);
  };

  // Subtract score functionality
  const subtractScore = (): void => {
    if (currentScore <= 0) {
      setCurrentScore(0);
    } else {
      setCurrentScore(currentScore - 1);
    }
  };

  // Edit commment
  const editOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Clear the value first
    setEditValue(e.target.value);
  };

  const updateContent = (): void => {
    if (!isAReply) {
      storedData.comments[index].content = editValue;
    } else {
      storedData.comments[originalCommentIndex].replies[index].content =
        editValue;
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

    setIsEditMode(false);
  };

  useEffect((): void => {
    if (!isAReply) {
      storedData.comments[index].score = currentScore;
    } else {
      storedData.comments[originalCommentIndex].replies[index].score =
        currentScore;
    }

    const updatedDataString = JSON.stringify(storedData);
    localStorage.setItem("data", updatedDataString);
  }, [currentScore]);

  return (
    <div className="flex flex-col gap-5 sm:w-[700px]">
      <div
        className={`bg-white flex flex-col px-4 py-6 gap-5 rounded-lg ${
          isAReply && "ml-5"
        }`}
      >
        <div className="flex sm:flex-row flex-col gap-5">
          {/* Top Row in a comment box */}
          {/* Score div: hidden in small screen, flex in bigger screen */}
          <div className="px-4 py-2 sm:h-fit bg-very-light-gray rounded-md sm:flex hidden sm:flex-col gap-4">
            <button
              className="text-light-grayish-blue font-semibold hover:text-moderate-blue"
              onClick={addScore}
            >
              +
            </button>
            <span className="font-semibold text-moderate-blue">
              {currentScore}
            </span>
            <button
              className="text-light-grayish-blue font-semibold hover:text-moderate-blue"
              onClick={subtractScore}
            >
              -
            </button>
          </div>
          {/* The top part will have delete and edit, or reply btn, flex in big screens and hidden in small screens */}
          <div className="flex flex-col gap-5 sm:w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={profilePic} alt="profile" className="w-10" />
                <span>
                  <strong className="text-dark-blue">{username}</strong>
                </span>
                {username === data.currentUser.username && (
                  <span className="bg-moderate-blue text-white px-2 py-[1px] rounded-sm">
                    you
                  </span>
                )}
                <span className="text-grayish-blue">{createdAt}</span>
              </div>

              {username === data.currentUser.username ? (
                <div className="sm:flex hidden sm:gap-5">
                  <button
                    className="flex gap-2 items-center hover:text-pale-red text-soft-red group"
                    onClick={deleteOnClick}
                  >
                    <svg width="12" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M1.167 12.448c0 .854.7 1.552 1.555 1.552h6.222c.856 0 1.556-.698 1.556-1.552V3.5H1.167v8.948Zm10.5-11.281H8.75L7.773 0h-3.88l-.976 1.167H0v1.166h11.667V1.167Z" fill="#ED6368" className="group-hover:fill-pale-red"/></svg>
                    Delete
                  </button>
                  <button
                    className="flex gap-2 items-center text-moderate-blue group hover:text-light-grayish-blue"
                    onClick={editOnClick}
                  >
                    <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M13.479 2.872 11.08.474a1.75 1.75 0 0 0-2.327-.06L.879 8.287a1.75 1.75 0 0 0-.5 1.06l-.375 3.648a.875.875 0 0 0 .875.954h.078l3.65-.333c.399-.04.773-.216 1.058-.499l7.875-7.875a1.68 1.68 0 0 0-.061-2.371Zm-2.975 2.923L8.159 3.449 9.865 1.7l2.389 2.39-1.75 1.706Z" fill="#5357B6" className="group-hover:fill-light-grayish-blue"/></svg>
                    Edit
                  </button>
                </div>
              ) : (
                <button
                  className="hidden sm:flex gap-2 items-center text-moderate-blue hover:text-light-grayish-blue group"
                  onClick={replyOnClik}
                >
                  <svg width="14" height="13" xmlns="http://www.w3.org/2000/svg"><path d="M.227 4.316 5.04.16a.657.657 0 0 1 1.085.497v2.189c4.392.05 7.875.93 7.875 5.093 0 1.68-1.082 3.344-2.279 4.214-.373.272-.905-.07-.767-.51 1.24-3.964-.588-5.017-4.829-5.078v2.404c0 .566-.664.86-1.085.496L.227 5.31a.657.657 0 0 1 0-.993Z" fill="#5357B6" className="group-hover:fill-light-grayish-blue"/></svg>
                  Reply
                </button>
              )}
            </div>
            {/* End Of Top Row */}

            {/* Second Row in a comment box */}
            {isAReply && typeof replyingTo === "string" ? (
              <div>
                {isEditMode ? (
                  <Textarea
                    placeHolder=""
                    value={
                      editValue.startsWith(`@${replyingTo}`)
                        ? editValue
                        : `@${replyingTo} ${editValue}`
                    }
                    onChange={editOnChange}
                  />
                ) : (
                  <p className="text-grayish-blue">
                    <strong className="text-moderate-blue">
                      @{replyingTo}
                    </strong>{" "}
                    {editValue.startsWith(`@${replyingTo}`)
                      ? editValue.split(" ").slice(1).join(" ")
                      : editValue}
                  </p>
                )}
              </div>
            ) : (
              <div>
                <div>
                  {isEditMode ? (
                    <Textarea
                      onChange={editOnChange}
                      placeHolder=""
                      value={editValue}
                    />
                  ) : (
                    <p className="text-grayish-blue">{editValue}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* The update btn for big screens; hidden in phone screens */}
        {isEditMode && (
          <div className="hidden sm:flex sm:justify-between">
            <div></div>
            <button
              className="text-white bg-moderate-blue rounded-md px-6 py-3 w-fit hover:bg-light-grayish-blue"
              onClick={updateContent}
            >
              UPDATE
            </button>
          </div>
        )}

        {/* Third Row in a comment box */}
        {/* The score, edit, delete, reply btns for mobile; hidden in big screens */}
        <div
          className={`flex justify-between sm:hidden ${
            isEditMode ? "hidden" : ""
          }`}
        >
          <div className="px-4 py-2 bg-very-light-gray rounded-md flex gap-4">
            <button
              className="text-light-grayish-blue font-semibold"
              onClick={addScore}
            >
              +
            </button>
            <span className="font-semibold text-moderate-blue">
              {currentScore}
            </span>
            <button
              className="text-light-grayish-blue font-semibold"
              onClick={subtractScore}
            >
              -
            </button>
          </div>

          {username === data.currentUser.username ? (
            <div className="flex gap-5">
              <button
                className="flex gap-2 items-center text-soft-red"
                onClick={deleteOnClick}
              >
                <img src="/images/icon-delete.svg" alt="delete" />
                Delete
              </button>
              <button
                className="flex gap-2 items-center text-moderate-blue"
                onClick={editOnClick}
              >
                <img src="/images/icon-edit.svg" alt="edit" />
                Edit
              </button>
            </div>
          ) : (
            <button
              className="flex sm:hidden gap-2 items-center text-moderate-blue"
              onClick={replyOnClik}
            >
              <img src="/images/icon-reply.svg" alt="reply" />
              Reply
            </button>
          )}
        </div>
          
        {/* Update btn for phone screens; hidden in big screens */}
        {isEditMode && (
          <div className="flex sm:hidden justify-between">
            <div></div>
            <button
              className="text-white bg-moderate-blue rounded-md px-6 py-3 w-fit"
              onClick={updateContent}
            >
              UPDATE
            </button>
          </div>
        )}
      </div>

      {/* Reply text box */}
      <div className={`${isReplying ? "" : "hidden"}`}>
        <TextBox
          typeOfComment="reply"
          replyingTo={`${username} `}
          replyingToAReply={isAReply}
          updateCommentList={updateCommentList}
          originalCommentIndex={originalCommentIndex}
        />
      </div>

      {/* Delete Modal */}
      {isModalShown && (
        <DeleteModal
          isAReply={isAReply}
          originalCommentIndex={originalCommentIndex}
          commentIndex={index}
          changeModalState={changeModalState}
          updateCommentList={updateCommentList}
        />
      )}
    </div>
  );
}

export default CommentBox;
