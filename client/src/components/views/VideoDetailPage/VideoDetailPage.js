import React, { useEffect, useState } from "react";
import { Row, Col, List, Avatar } from "antd";
import Axios from "axios";
import SideVideo from './Sections/SideVideo';
import Subscriber from './Sections/Subscribe';
import Subscribe from "./Sections/Subscribe";
import Comment from './Sections/Comment';

function VideoDetailPage(props) {
  const videoId = props.match.params.videoId;
  const [Video, setVideo] = useState([]);
  const [Comments, setComments] = useState([]);

  const variable = { videoId: videoId };

  useEffect(() => {
    Axios.post("/api/video/getVideoDetail", variable).then((response) => {
      if (response.data.success) {
        setVideo(response.data.videoDetail);

      } else {
        alert("비디오 정보 가져오기 실패");
      }

      Axios.post('/api/comment/getComments', variable)
      .then(response => {
        if(response.data.success) {
          setComments(response.data.comments);

          console.log("comments: ", response.data.comments);
        } else {
          alert('코멘트 정보 가져오기 실패')
        }
      })
    });
  }, []);

  const refreshFunction = (newComment) => {
    setComments(Comments.concat(newComment));
  }

  if (Video.writer) {
    const subscribeButton = Video.writer._id !== localStorage.getItem('userId') && <Subscribe userTo={Video.writer._id} userFrom={localStorage.getItem("userId")} />
    return (
      <Row>
        <Col lg={18} xs={24}>
          <div
            className="postPage"
            style={{ width: "100%", padding: "3rem 4em" }}
          >
            <video
              style={{ width: "100%" }}
              src={`http://localhost:5000/${Video.filePath}`}
              controls
            ></video>

            <List.Item actions={[subscribeButton]}>
              <List.Item.Meta
                avatar={<Avatar src={Video.writer && Video.writer.image} />}
                title={<a href="https://ant.design">{Video.title}</a>}
                description={Video.description}
              />
              <div></div>
            </List.Item>

            <Comment
              Comments={Comments}
              postId={Video._id}
              refreshFunction={refreshFunction}
            />
          </div>
        </Col>
        <Col lg={6} xs={24}>
          <SideVideo />
        </Col>
      </Row>
    );
  } else {
    return <div>Loading...</div>;
  }
}

export default VideoDetailPage;
