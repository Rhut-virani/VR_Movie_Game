import React from 'react';
import {
    AppRegistry,
    Animated,
    asset,
    Easing,
    StyleSheet,
    Text,
    View,
    Image,
    NativeModules,
  } from 'react-360';
  import GazeButton from "react-360-gaze-button";

  
export default class Clues extends React.Component {
  constructor() {
    super();
    this.state = {
      bounceValue: new Animated.Value(1),
    };
  }

// Function that handles the animation for right answer, wrong answer and timeout 
  animateImage=()=>{                           // Start the animation
      this.state.bounceValue.setValue(1.1);     // Start large
      Animated.spring(                          // Base: spring, decay, timing
        this.state.bounceValue,                 // Animate `bounceValue`
        {
          toValue: 1,                       // Animate to smaller size
          friction: 1,                          // Bouncier spring
        }
      ).start();     
  }

    render(){

        let moviedata = this.props.moviestate;        
        let randomArray = [];

    // Answer Generation by getting similar movies to the current movie 
    // and then ranomising them with the help of Math.floor
        let ans1Data = [moviedata.title, true];                               // correct answer
        let ans2Data = [moviedata.similar_movies.results[0].title, false];
        let ans3Data = [moviedata.similar_movies.results[1].title, false];
        let ans4Data = [moviedata.similar_movies.results[2].title, false];

    // Unrandomised array which would be used to generate a randomised array
        let unrandomArr = [ans1Data, ans2Data, ans3Data, ans4Data];
        for (let i = 4; i > 0; i--) {
                let random = Math.floor(Math.random()*i);
                randomArray.push(unrandomArr[random]);
                unrandomArr.splice(random, 1)
            }

    // generating variable for Answers and its value (true of false)
        let answerOption1 = randomArray[0][0];
        let answerOption2 = randomArray[1][0];
        let answerOption3 = randomArray[2][0];
        let answerOption4 = randomArray[3][0];
        let answerValue1 = randomArray[0][1];
        let answerValue2 = randomArray[1][1];
        let answerValue3 = randomArray[2][1];
        let answerValue4 = randomArray[3][1];

    // creating clues from the the current movie 
        let genre = moviedata.genres[0].name;
        let releaseDate = moviedata.release_date;
        let director = moviedata.credits.crew[0].job + ' : ' + moviedata.credits.crew[0].name;
        let tagline = moviedata.tagline;
        let release = moviedata.release_date;
        
    // removing access charactors from the plot 
        let plotSplit = moviedata.overview.split(' ')
        let plotArray =  plotSplit.filter((element,index)=>{return index<15});
        plotArray.push('.....');
        let plot = plotArray.join(' ');
        
    // if a user selects a correct answer then show a right sign on screen
      if(this.props.correctAns){
        this.animateImage();
        return(          
        <View style={styles.clueContainer}>
          <Animated.Image source={asset('right.png')} style={{alignSelf: 'center',width:300,height:300,transform: [{scale: this.state.bounceValue}]}} />
        </View>
        )
      }  
      
    // if a user selects a wrong answer then show a right sign on screen        
      else if(this.props.wrongAns){
        this.animateImage();          
        return(          
          <View style={styles.clueContainer}>
            <Animated.Image source={asset('wrong.png')} style={{alignSelf: 'center',width:300,height:300,transform: [{scale: this.state.bounceValue}]}} />
          </View>        
        )  
      }

    // if the time runs out before user can guess an answer 
    // then show the timesup animation
      else if(this.props.timeout){
        this.animateImage();          
        return(          
        <View style={styles.clueContainer}>
          <Animated.Image source={asset('Timesup.jpg')} style={{alignSelf: 'center',width:400,height:300,transform: [{scale: this.state.bounceValue}]}} />
        </View>        
        )  
      }

    // if all other conditions are not true then run this code
    // i.e. most of the time apart from when uaer get a right wrong answer or time runs out
      else{
        return(
        <View style={styles.clueContainer}>
            <View style={styles.queContainer}>
                <View style= {styles.que1}><Text style={styles.quetext}>Genre : {genre}</Text></View>
                <View style= {styles.que2}><Text style={styles.quetext}>Release Date : {releaseDate}</Text></View>
                <View style= {styles.que1}><Text style={styles.quetext}>{director}</Text></View>
                <View style= {styles.que2}><Text style={styles.quetext}>{(tagline)? 'TagLine : ' + tagline : 'No Tagline found'}</Text></View>
                <View style= {styles.que1}>
                  {(this.props.plotValue)?
                    <Text style={styles.quetext}>{plot}</Text> :
                    <GazeButton
                    duration={3000}
                    onClick={this.props.plothandler} 
                    render={(remainingTime, isGazed) => (
                    <Text style={styles.quetext}>Click for Movie Plot (10 Points)</Text>
                    )}
                    />
                  }
                </View>
            </View>
            <View style={styles.ansContainer}>
              <View style={styles.anscol}>
                  <GazeButton
                      duration={3000}
                      onClick={()=>{this.props.setGazed(answerValue1)}}
                      style= {styles.vb}
                      render={(remainingTime, isGazed) => (
                        <Text style={styles.ans}>{answerOption1}</Text>
                      )}
                  />
                  <GazeButton
                          duration={3000}
                          onClick={()=>{this.props.setGazed(answerValue2)}}
                          style= {styles.vb}
                          render={(remainingTime, isGazed) => (
                            <Text style={styles.ans}>{answerOption2}</Text>
                          )}
                  />              
              </View>                
              <View style={styles.anscol}> 
                  <GazeButton
                          duration={3000}
                          onClick={()=>{this.props.setGazed(answerValue3)}}
                          style= {styles.vb}
                          render={(remainingTime, isGazed) => (
                            <Text style={styles.ans}>{answerOption3}</Text>
                          )}
                  />
                  
                  <GazeButton
                          duration={3000}
                          onClick={()=>{this.props.setGazed(answerValue4)}}
                          style= {styles.vb}
                          render={(remainingTime, isGazed) => (
                            <Text style={styles.ans}>{answerOption4}</Text>
                          )}
                  />                
              </View>
            </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  clueContainer: {
    width: 700,    // Fill the entire surface
    height: 660,
    flex: 1,
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent:'center',    
  },
  queContainer: {
    flex: 4,
    flexDirection: 'column',
    justifyContent: 'center',
    width: 700,
  },
    que1:{
      flex : 1,
      backgroundColor: '#0f1214',
      justifyContent: 'center',
      margin: 5,
      borderRadius: 8,
      borderColor: 'rgba(0, 0, 0, 0.8)',
      borderRightWidth : 4,
      borderBottomWidth : 6,
      // boxShadow: '10px 5px 5px red'
      
    },
    que2:{
      flex : 1,
      backgroundColor: '#0f1214',
      margin: 5,
      justifyContent: 'center',
      borderRadius: 8,
      borderColor: 'rgba(0, 0, 0, 1)',
      borderRightWidth : 4,
      borderBottomWidth : 6,
      
    },
    quetext:{
      color: '#F7FFF7',
      textAlign: 'center',
      fontSize: 30,
      margin: 3,
    },
  ansContainer: {
    flex: 2,
    flexDirection: 'row',
    width: 700,
  },
    anscol:{
      flexDirection: 'column',
      flex: 1,
      width: 250
    },
    ans:{
      textAlign: 'center',
      color: '#0f1214',
      fontSize: 30,     
      margin: 3,     
    },
    vb:{
      flex : 1,
      backgroundColor: '#F7FFF7',
      justifyContent: 'center',
      margin: 5,
      borderRadius: 8,
      borderColor: 'rgba(0, 0, 0, 1)',
      borderRightWidth : 4,
      borderBottomWidth : 6,
    },
});