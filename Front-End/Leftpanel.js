import * as React from 'react';
import {Image, StyleSheet, Text, View,} from 'react-360';
import GazeButton from "react-360-gaze-button";

export default class Leftpanel extends React.Component {

  render() {
    //gettng the image paths from the list of movies  
    let imgurl = (this.props.moviestate.images.backdrops[0])?this.props.moviestate.images.backdrops[0].file_path : this.props.moviestate.images.posters[0].file_path
    let posterUrl = 'http://image.tmdb.org/t/p/w780' + imgurl;

    return (
      <View style={styles.wrapper}>
        <View style={styles.imageWrapper}>
      {/* if the user has made the click on the pooster image then show the poster or show the 
      button and text covering the image */}
          {(this.props.poster)? 
            <Image source={{uri: posterUrl}} style={styles.image}/> :
            <GazeButton
                duration={3000}
                onClick={this.props.posterPointHandler}
                style= {styles.vb}
                render={(remainingTime, isGazed) => (
                <Text style={styles.imgtext}>Click for Poster Image (100 points) {'\n'} {parseInt(remainingTime/1000)} Sec to Click</Text>
                )}
            />                  
          }
        </View>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  wrapper: {
    width: 1250,
    height: 660,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginRight: 300,
  },  
  imageWrapper:{
    flex: 1,
    justifyContent: 'space-between', 
    width: 1000, 
    flexDirection: 'row',
  },
  image:{
    width:1000,
    borderRadius: 8,
    borderColor: 'rgba(0, 0, 0, 1)',
    borderRightWidth : 2,
    borderBottomWidth : 4,
  },
  imgtext:{
    textAlign: 'center',
    color: '#f4f4f4',
    fontSize: 30,
    margin: 5, 
  },
  vb:{
    backgroundColor: '#191919',
    justifyContent: 'center',
    width:1000, 
    borderRadius: 8,
    borderColor: 'rgba(0, 0, 0, 1)',
    borderRightWidth : 2,
    borderBottomWidth : 4,
  },
})