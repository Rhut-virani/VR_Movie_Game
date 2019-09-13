import React from 'react';
import {
    Animated,
    asset,
    StyleSheet,
    Text,
    View,
  } from 'react-360';
  import GazeButton from "react-360-gaze-button";

  
export default class Clues extends React.Component {
  constructor() {
    super();
    this.state = {
      bounceValue: new Animated.Value(0.9),
    };
  }

// Function that handles the animation for right answer, wrong answer and timeout 
  animateImage=()=>{                           // Start the animation
      this.state.bounceValue.setValue(1);     // Start large
      Animated.spring(                          // Base: spring, decay, timing
        this.state.bounceValue,                 // Animate `bounceValue`
        {
          toValue: 0.9,                       // Animate to smaller size
          friction: 0.8,                          // Bouncier spring
        }
      ).start();     
  }

  render(){

          const {moviestate, plotValue, wrongAns, correctAns, plothandler, setGazed, timeout} = this.props;
          let randomArray = [];

      // Answer Generation by getting similar movies to the current movie 
      // and then ranomising them with the help of Math.floor
          const ans1Data = [moviestate.title, true];                               // correct answer
          const ans2Data = [moviestate.similar_movies.results[0].title, false];
          const ans3Data = [moviestate.similar_movies.results[1].title, false];
          const ans4Data = [moviestate.similar_movies.results[2].title, false];

      // Unrandomised array which would be used to generate a randomised array
          let unrandomArr = [ans1Data, ans2Data, ans3Data, ans4Data];
          for (let i = 4; i > 0; i--) {
                  let random = Math.floor(Math.random()*i);
                  randomArray.push(unrandomArr[random]);
                  unrandomArr.splice(random, 1)
              }

      // trying another dry technique......
          const ansJSX = randomArray.map((ele, ind)=>{
            return (
              <GazeButton
                    key={ind}
                    duration={3000}
                    onClick={()=>{setGazed(ele[1])}}
                    style= {styles.vb}
                    render={(remainingTime, isGazed) => (
                      <Text style={styles.ans}>{ele[0]}</Text>
                    )}
                />
            )
          })

      // creating clues from the the current movie 
          const genre = moviestate.genres[0].name;
          const releaseDate = moviestate.release_date;
          const director = moviestate.credits.crew[0].job + ' : ' + moviestate.credits.crew[0].name;
          const tagline = moviestate.tagline;
          const release = moviestate.release_date;
          
      // removing access charactors from the plot 
          const plotSplit = moviestate.overview.split(' ')
          const plotArray =  plotSplit.filter((element,index)=>{return index<15});
          plotArray.push('.....');
          const plot = plotArray.join(' ');
          
      // if a user selects a correct answer then show a right sign on screen
        if(correctAns){
          this.animateImage();
          return(          
          <View style={styles.clueContainer}>
            <Animated.Image source={asset('right.png')} style={{alignSelf: 'center',width:300,height:300,transform: [{scale: this.state.bounceValue}]}} />
          </View>
          )
        }  
        
      // if a user selects a wrong answer then show a right sign on screen        
        else if(wrongAns){
          this.animateImage();          
          return(          
            <View style={styles.clueContainer}>
              <Animated.Image source={asset('wrong.png')} style={{alignSelf: 'center',width:300,height:300,transform: [{scale: this.state.bounceValue}]}} />
            </View>        
          )  
        }

      // if the time runs out before user can guess an answer 
      // then show the timesup animation
        else if(timeout){
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
                    {(plotValue)?
                      <Text style={styles.quetext}>{plot}</Text> :
                      <GazeButton
                        duration={3000}
                        onClick={plothandler} 
                        render={(remainingTime, isGazed) => (
                        <Text style={styles.quetext}>Click for Movie Plot (10 Points)</Text>
                      )}
                      />
                    }
                  </View>
              </View>
              <View style={styles.ansContainer}>
                {ansJSX}
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
  flexWrap: 'wrap',
  },
  vb:{
    flex : 1,
    height: 100,
    flexBasis: "45%",
    backgroundColor: '#F7FFF7',
    justifyContent: 'center',
    margin: 5,
    borderRadius: 8,
    borderColor: 'rgba(0, 0, 0, 1)',
    borderRightWidth : 4,
    borderBottomWidth : 6,
  },
  ans:{
    textAlign: 'center',
    color: '#0f1214',
    fontSize: 30,     
    margin: 3,     
  },
});