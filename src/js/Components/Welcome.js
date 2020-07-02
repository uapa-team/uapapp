import React from "react";
import { withRouter } from "react-router-dom";
import { Row, Typography } from "antd";
import ReactPlayer from "react-player";

const { Title } = Typography;

class Welcome extends React.Component {
  render() {
    return (
      <Row justify="center">
        <div className="welcome-title">
          <Title level={2}>¡Bienvenido al nuevo UAPApp!</Title>
        </div>
        <div className="welcome-video">
          <div className="player-wrapper">
            <ReactPlayer
              url="https://www.youtube.com/watch?v=XhyjiFEB5TY"
              controls
              width="100%"
              height="100%"
              className="react-player"
            />
          </div>
        </div>
      </Row>
    );
  }
}

export default withRouter(Welcome);
