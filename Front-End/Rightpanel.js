import * as React from 'react';
import {StyleSheet, Text, View, Image, VrButton} from 'react-360';
import GazeButton from "react-360-gaze-button";


/**
 * Render a description of the currently-selected model.
 * Connected to the global store to receive inputs.
 */
export default class Rightpanel extends React.Component {

  imgbutton = (id)=>{
    // let copy = Array.from(this.state.img);
    // let newcopy = copy.map((element, index)=>{
    //   console.log(element);
    //   return index === id? element = true : element;
    // })
    // this.setState({
    //   img:newcopy
    // })
    this.props.imgPointHandler(id);
  }
    render(){
       let castcopy = this.props.moviestate.credits.cast;
       let castImages = []
       castcopy.map((element,index)=>{
            if(index < 6){castImages.push('https://image.tmdb.org/t/p/w500'+element.profile_path)};
    })

    return (
      <View style={styles.wrapper}>
        <View style={styles.imageWrapper}>

            {(this.props.img[0])? 
                <Image source={{uri: castImages[0]}} style={styles.image}/> :
                    <GazeButton
                    duration={3000}
                    onClick={()=>{this.imgbutton(0)}}
                    style= {styles.vb}
                    render={(remainingTime, isGazed) => (
                    <Text style={styles.imgtext}>Click for Cast Image (10 points)</Text>
                    )}
                />
            }

            {(this.props.img[1])? 
                <Image source={{uri: castImages[1]}} style={styles.image}/>:
                <GazeButton
                duration={3000}
                onClick={()=>{this.imgbutton(1)}}
                style= {styles.vb}
                render={(remainingTime, isGazed) => (
                    <Text style={styles.imgtext}>Click for Cast Image (10 points)</Text>
                )}
                />
            }

            {(this.props.img[2])? 
                <Image source={{uri: castImages[2]}} style={styles.image}/>:
                <GazeButton
                duration={3000}
                onClick={()=>{this.imgbutton(2)}}
                style= {styles.vb}
                render={(remainingTime, isGazed) => (
                    <Text style={styles.imgtext}>Click for Cast Image (10 points)</Text>
                  )}
                />
                }
        </View>

        <View style={styles.imageWrapper}>

            {(this.props.img[3]) ? 
                <Image source={{uri: castImages[3]}} style={styles.image}/>:
                <GazeButton
                duration={3000}
                onClick={()=>{this.imgbutton(3)}}
                style= {styles.vb}
                render={(remainingTime, isGazed) => (
                    <Text style={styles.imgtext}>Click for Cast Image (10 points)</Text>
            )}
            />  
            }

            {(this.props.img[4]) ? 
                <Image source={{uri: castImages[4]}} style={styles.image}/>:
                    <GazeButton
                    duration={3000}
                    onClick={()=>{this.imgbutton(4)}}
                    style= {styles.vb}
                    render={(remainingTime, isGazed) => (
                <Text style={styles.imgtext}>Click for Cast Image (10 points)</Text>
              )}
              />  
            }

            { (this.props.img[5]) ? 
                <Image source={{uri: castImages[5]}} style={styles.image}/>:
                <GazeButton
                duration={3000}
                onClick={()=>{this.imgbutton(5)}}
                style= {styles.vb}
                render={(remainingTime, isGazed) => (
                <Text style={styles.imgtext}>Click for Cast Image (10 points)</Text>
                )}
                />  
              }
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
  },
  image:{
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
    color: 'black',
    fontSize: 20,
    margin: 5, 
  },
  vb:{
    backgroundColor: '#4CB963',
    justifyContent: 'center',
    width:200, 
    height:280,
    margin:20,
    borderRadius: 8,
    borderColor: 'rgba(0, 0, 0, 1)',
    borderRightWidth : 2,
    borderBottomWidth : 4,
  },
});
