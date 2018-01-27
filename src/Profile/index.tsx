import React, { Component } from 'react';
import { Panel, ControlLabel, Glyphicon } from 'react-bootstrap';
import './index.css';

interface profileInterf{
  profile:{
    name:string,
    picture:string,
    nickname:string
  },

}
class Profile extends Component<any,profileInterf> {
  componentWillMount() {
    this.setState({ profile: {
      name:'',
      picture:'',
      nickname:''
    } });
    const { userProfile, getProfile } = this.props.auth;
    if (!userProfile) {
      getProfile((err:any, profile:any) => {
        this.setState({ profile });
      });
    } else {
      this.setState({ profile: userProfile });
    }
  }
  render() {
    const { profile } = this.state;
    return (
      <div className="container">
        <div className="profile-area">
          <h1>{profile.name}</h1>
          <Panel header="Profile">
            <img src={profile.picture} alt="profile" />
            <div>
              <ControlLabel><Glyphicon glyph="user" /> Nickname</ControlLabel>
              <h3>{profile.nickname}</h3>
            </div>
            <pre>{JSON.stringify(profile, null, 2)}</pre>
          </Panel>
        </div>
      </div>
    );
  }
}

export default Profile;
