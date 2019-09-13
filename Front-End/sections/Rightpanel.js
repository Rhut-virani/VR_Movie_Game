import * as React from 'react';
import {StyleSheet, Text, View, Image} from 'react-360';
import GazeButton from "react-360-gaze-button";


export default class Rightpanel extends React.Component {

  imgbutton = (id)=>{
    this.props.imgPointHandler(id);
  }
    render(){
      const img = this.props.img
      const castcopy = this.props.moviestate.credits.cast;
      let castImages = [];
      castcopy.forEach((element,index)=>{
          if(index < 6){castImages.push('https://image.tmdb.org/t/p/w500'+element.profile_path)};
      })
      
      let imgJSX = img.map((ele,ind)=>{
        return(
          (ele)? 
            <Image key={ind} source={{uri: castImages[ind]}} style={styles.vb}/> :
                <GazeButton
                key={ind}
                duration={3000}
                onClick={()=>{this.imgbutton(ind)}}
                style= {styles.vb}
                render={(remainingTime, isGazed) => (
                <Text style={styles.imgtext}>Click for Cast Image (10 points)</Text>
                )}
            />
        )
      })
    return (
      <View style={styles.wrapper}>
        <View style={styles.imageWrapper}>
          {imgJSX}
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  wrapper: {
    width: 1000,
    height: 660,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
  },
  imageWrapper:{
    flex: 1,
    justifyContent: 'space-between', 
    width: 800, 
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  vb:{
    backgroundColor: '#191919',
    justifyContent: 'center',
    width:200, 
    height:280,
    margin:20,
    borderRadius: 8,
    borderColor: 'rgba(0, 0, 0, 1)',
    borderRightWidth : 2,
    borderBottomWidth : 4,
  },
  imgtext:{
    textAlign: 'center',
    color: '#f4f4f4',
    fontSize: 20,
    margin: 5, 
  },
});
