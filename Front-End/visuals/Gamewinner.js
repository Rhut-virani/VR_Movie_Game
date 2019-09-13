import * as React from 'react';
import {Text, View, Environment, NativeModules} from 'react-360';
import GazeButton from "react-360-gaze-button";

const {VideoModule} = NativeModules;

export default class Gamewinner extends React.Component {
  resetwinnergame=()=>{
    VideoModule.stop('winnerplayer'); // Stop playback
    this.props.resetgame();
  }
      render() {
        // AudioModule.stopEnvironmental();
        Environment.setBackgroundVideo('winnerplayer');
        VideoModule.resume('winnerplayer'); 
        // VideoModule.play('muted : false'); 
        return (
          <View style={styles.wrapper}>
            <GazeButton
                duration={3000}
                onClick={this.resetwinnergame}
                style= {styles.vb}
                render={(remainingTime, isGazed) => (
                <Text style={styles.resetButtonText}>Reset Game</Text>
                )}
            />
          </View>
        );
      }
}

const styles = {
  wrapper: {
    width: 3200,
    height: 660,
    flexDirection: 'column',
    justifyContent: 'flex-start',
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
  },
  resetButtonText:{
    alignSelf : 'center',
    color: 'black',
    fontSize: 20,
}
}