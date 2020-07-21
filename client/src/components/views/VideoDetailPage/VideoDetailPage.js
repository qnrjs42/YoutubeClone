import React, { useEffect, useState } from "react";
import { Row, Col, List, Avatar } from "antd";
import Axios from "axios";
import SideVideo from './Sections/SideVideo';
import Subscriber from './Sections/Subscribe';

function VideoDetailPage(props) {
  const videoId = props.match.params.videoId;
  const [Video, setVideo] = useState([]);
  const videoVariable = { videoId: videoId };

  useEffect(() => {
    Axios.post("/api/video/getVideoDetail", videoVariable).then((response) => {
      if (response.data.success) {
        console.log("axios.response : ", response);
        console.log("axios.response.data : ", response.data);
        console.log("axios.response.data.VideoDetail : ", response.data.videoDetail);
        setVideo(response.data.videoDetail);

      } else {
        alert("비디오 정보 가져오기 실패");
      }
    });
  }, []);

  if (Video.writer) {
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

            <List.Item
              actions={[
                //   <LikeDislikes
                //     video
                //     videoId={videoId}
                //     userId={localStorage.getItem("userId")}
                //   />,
                <Subscriber
                  userTo={Video.writer._id}
                  // userFrom={localStorage.getItem("userId")}
                />,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={Video.writer && Video.writer.image} />}
                title={<a href="https://ant.design">{Video.title}</a>}
                description={Video.description}
              />
              <div></div>
            </List.Item>

            {/* <Comments
                    CommentLists={CommentLists}
                    postId={Video._id}
                    refreshFunction={updateComment}
                  /> */}
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
