
interface DeleteModalProps {
  isAReply: boolean;
  commentIndex: number;
  originalCommentIndex: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  changeModalState: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateCommentList: (comment: any) => void;
}

function DeleteModal({
  isAReply,
  commentIndex,
  originalCommentIndex,
  changeModalState,
  updateCommentList,
}: DeleteModalProps) {
  const storedData = JSON.parse(localStorage.getItem("data") || "{}");

  const closeModal = (): void => {
    document.querySelector("body")!.style.overflow = "auto";
    changeModalState(false);
  };

  const deleteComment = (): void => {
    if (isAReply) {
      storedData.comments[originalCommentIndex].replies.splice(commentIndex, 1);
    } else {
      storedData.comments.splice(commentIndex).splice(commentIndex, 1);
    }

    const updatedDataString = JSON.stringify(storedData);
    localStorage.setItem("data", updatedDataString);

    updateCommentList(storedData.comments);
    closeModal();
  };

  return (
    <div
      className="fixed flex top-0 left-0 w-full h-full bg-black/50 justify-center items-center px-5"
      style={{ zIndex: 99 }}
    >
      <div className="bg-white sm:w-[400px] flex flex-col gap-4 p-10 rounded-xl">
        <h1 className="font-semibold text-2xl text-dark-blue">
          Delete comment
        </h1>
        <p className="font-medium text-lg text-grayish-blue">
          Are you sure you want to delete this comment? This will remove the
          comment and can't be undone.
        </p>
        <div className="flex justify-between">
          <button
            className="px-6 py-4 text-white bg-grayish-blue rounded-lg font-semibold text-xl hover:bg-moderate-blue"
            onClick={closeModal}
          >
            No, Cancel
          </button>
          <button
            className="px-6 py-4 text-white bg-soft-red rounded-lg font-semibold text-xl hover:bg-pale-red"
            onClick={deleteComment}
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
