import * as React from 'react';
import {asset,  Image, StyleSheet, Text, View, VrButton, Video, VideoControl,NativeModules, Environment, MediaPlayerState,} from 'react-360';
const {AudioModule} = NativeModules;
import GazeButton from "react-360-gaze-button";

export default class GameOver extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerState: new MediaPlayerState({autoPlay: true, muted: false}), // init with muted, autoPlay
    };
  }


  render() {
      // Set the background to a black image
    Environment.setBackgroundImage(asset('./black.jpg'),{format: '2D'}, /* one of the formats mentioned above */);
    
    return (
      <View style={styles.wrapper}>
        <Video
          style={{height: 500, width: 1200}}
          source={[ asset('./game-over.mp4', {format: 'mp4'}) ]}
          playerState={this.state.playerState}
        />
        <VideoControl style={{height: 0.2, width: 4}} playerState={this.state.playerState} />
        <GazeButton
                duration={3000}
                onClick={this.props.resetgame}
                style= {styles.vb}
                render={(remainingTime, isGazed) => (
                <Text style={styles.resetButtonText}>Reset Game</Text>
                )}
            />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    width: 1200,
    height: 660,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vb:{
    backgroundColor: '#4CB963',
    justifyContent: 'center',
    width:300, 
    height: 100,
    borderRadius: 8,
    borderColor: 'rgba(0, 0, 0, 1)',
    borderRightWidth : 2,
    borderBottomWidth : 4,
    alignSelf: 'center',
  },
   resetButtonText:{
     alignSelf : 'center',
     color: 'black',
     fontSize: 20,
}

})