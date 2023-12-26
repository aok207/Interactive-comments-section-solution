import { ReactNode, useEffect, useState } from "react";
import CommentBox from "./components/CommentBox";
import data from "./data/data.json";
import TextBox from "./components/TextBox";
import timeAgo from "./calculateTime";

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  score: number;
  user: {
    username: string;
    image: {
      png: string;
    };
  };
  replies: Comment[];
  timestamp: string;
}

function App() {
  const [hasStoredData, setHasStoredData] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect((): void => {
    if (!localStorage.getItem("data")) {
      localStorage.setItem("data", JSON.stringify(data));
    }
    const storedData = JSON.parse(localStorage.getItem("data") || "{}");

    storedData.comments.forEach((comment: Comment) => {
      comment.createdAt = timeAgo(new Date(comment.timestamp).getTime());
      if (comment.replies.length !== 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        comment.replies.forEach((reply: any) => {
          reply.createdAt = timeAgo(new Date(reply.timestamp).getTime());
        });
      }
    });

    setComments(storedData.comments || []);
    setHasStoredData(true);
  }, []);

  const updateCommentList = (commentList: Comment[]) => {
    setComments(commentList);
  };

  return (
    <>
      <div
        className="py-10 px-5 flex flex-col sm:items-center gap-5 mb-[200px]"
        id="app"
        style={{ zIndex: 10 }}
      >
        {hasStoredData &&
          comments.map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (item: any, index: number): ReactNode => (
              <div className="flex flex-col gap-5" key={item.id}>
                <CommentBox
                  key={item.id}
                  index={index}
                  username={item.user.username}
                  profilePic={item.user.image.png}
                  createdAt={item.createdAt}
                  content={item.content}
                  score={item.score}
                  isAReply={false}
                  replyingTo={null}
                  originalCommentIndex={index}
                  updateCommentList={updateCommentList}
                />
                <div className="flex flex-col gap-5 border-l border-l-light-grayish-blue">
                  {item.replies.length !== 0
                    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      item.replies.map((reply: any, i: number) => (
                        <CommentBox
                          key={reply.id}
                          index={i}
                          username={reply.user.username}
                          profilePic={reply.user.image.png}
                          createdAt={reply.createdAt}
                          content={reply.content}
                          score={reply.score}
                          isAReply={true}
                          replyingTo={reply.replyingTo}
                          originalCommentIndex={index}
                          updateCommentList={updateCommentList}
                        />
                      ))
                    : null}
                </div>
              </div>
            )
          )}
        <div className="text-[13px] text-center ">
          Challenge by{" "}
          <a
            href="https://www.frontendmentor.io?ref=challenge"
            className="text-moderate-blue"
            target="_blank"
          >
            Frontend Mentor
          </a>
          . Coded by{" "}
          <a
            href="https://aungookhant-portfolio.onrender.com/"
            target="_blank"
            className="text-moderate-blue"
          >
            Aung Oo Khant
          </a>
          .
        </div>
      </div>
      <div
        style={{ zIndex: 11 }}
        className="fixed sm:left-1/2 sm:transform sm:-translate-x-1/2 w-full sm:w-[700px] sm:px-0 px-5 bottom-0 left-0"
      >
        <TextBox
          typeOfComment="send"
          replyingTo={null}
          replyingToAReply={false}
          updateCommentList={updateCommentList}
        />
      </div>
    </>
  );
}

export default App;
