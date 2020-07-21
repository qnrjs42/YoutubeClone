import React, { useEffect, useState } from "react";
import { Row, Col, Card, Typography, Avatar } from "antd";
import Axios from "axios";
import moment from "moment";

const { Title } = Typography;
const { Meta } = Card;

function LandingPage() {
  const [Video, setVideo] = useState([]);

  // useEffect DOM이 로드 되자마자 실행
  // []이 비워져있으면 한 번만 업데이트
  // []이 채워져있으면 계속 업데이트
  useEffect(() => {
    Axios.post("/api/video/getVideos").then((response) => {
      if (response.data.success) {
        console.log(response.data);
        setVideo(response.data.videos);
      } else {
        alert("비디오 가져오기 실패");
      }
    });
  }, []);

  const renderCards = Video.map((video, index) => {
    let minutes = Math.floor(video.duration / 60);
    let seconds = Math.floor(video.duration - minutes * 60);

    return (
      <Col lg={6} md={8} xs={24}>
        <div style={{ position: "relative" }}>
          <a href={`/video/${video._id}`}>
            <img
              style={{ width: "100%" }}
              src={`http://localhost:5000/${video.thumbnail}`}
            />
            <div className="duration">
              <span>
                {minutes} : {seconds}
              </span>
            </div>
          </a>
        </div>
        <br />
        <Meta
          avatar={<Avatar src={video.writer.image} />}
          title={video.title}
          description=""
        />
        <span>{video.writer.name}</span>
        <br />
        <span style={{ marginLeft: "3rem" }}>{video.views}</span>-
        <span>
          {/* 업데이트 한 날짜 */}
          {moment(video.createdAt).format("MMM Do YY")}
        </span>
      </Col>
    );
  });

  // const renderCards = ;
  return (
    <div style={{ width: "85%", margin: "3rem auto" }}>
      <Title level={2}>Recommended</Title>
      <hr />
      <Row gutter={[32, 16]}>{renderCards}</Row>
    </div>
  );
}

export default LandingPage;
