import React from "react";
import {
	asset,
	StyleSheet,
	Animated,
	Text,
	View,
	Environment,
	NativeModules,
} from "react-360";
import Clues from "./sections/Clues";
import Leftpanel from "./sections/Leftpanel";
import Rightpanel from "./sections/Rightpanel";
import Gamewinner from "./visuals/Gamewinner";
import GameOver from "./visuals/GameOver";
import TimerCountdown from "react-native-timer-countdown";

const { AudioModule } = NativeModules,
	baseUrl = "http://localhost:9000";
export default class App extends React.Component {
	constructor() {
		super();
		this.state = {
			movie: "",
			poster: false,
			currentMovie: 0,
			spinValue: new Animated.Value(0),
			time: 60000,
			score: 150,
			plotValue: false,
			img: [false, false, false, false, false, false], // state props for Cast images and movie poster
			correctAnswer: false,
			wrongAnswer: false,
			timeout: false,
		};
		this.count = -1000; // counter variable for time
	}

	// Function to check the clicked answer is right or not
	// right ans sets resets state value.....
	// wrong ans reduces the times and score .....
	setGazed = (value) => {
		if (value) {
			const url = `${baseUrl}/currentmovie`;
			// Send the currentmovie counter value to backend to temp store
			// so even on refresh the currentmovie is at the same value and only changes on
			// right or wrong Ans.
			fetch(url, {
				method: "POST",
				body: JSON.stringify({ count: this.state.currentMovie }), // data can be `string` or {object}!
				headers: {
					"Content-Type": "application/json",
				},
			})
				.then((results) => {
					return results.json();
				})
				.then((results) => {
					this.setState({
						currentMovie: results,
						time: 60000,
						score: this.state.score + 20,
						img: [false, false, false, false, false, false],
						poster: false,
						correctAnswer: true,
						plotValue: false,
					});
					this.count = 0;
				})
				.catch((error) => {
					console.log(error);
				});
			setTimeout(() => {
				this.setState({
					correctAnswer: false,
				});
			}, 1000);
		} else {
			//
			this.setState({
				time: this.count < 50000 ? 50000 - this.count : 1000,
				score: this.state.score - 5,
				wrongAnswer: true,
			});
			this.count += 10000;
			setTimeout(() => {
				this.setState({
					wrongAnswer: false,
				});
				if (this.state.time === 0) {
					this.complete();
				}
			}, 1000);
		}
	};

	// Spin function for Loading animation
	spin = () => {
		this.state.spinValue.setValue(0);
		Animated.timing(this.state.spinValue, {
			toValue: 1,
			duration: 4000,
		}).start(() => this.spin());
	};

	// On Component mount the Loading Spin animation runs
	// and on a 10 sec Timeout the fetch function runs
	componentDidMount() {
		this.spin();
		setTimeout(() => {
			fetch(`${baseUrl}/movie`)
				.then((response) => {
					return response.json();
				})
				.then((data) => {
					// Here's a list of repos!
					this.setState({
						movie: data,
					});
				})
				.catch((error) => {
					alert("Server Error, Please Wait...");
					console.log(error);
				});
		}, 5000);
	}

	// Function to make a counter variable to use for scoring
	onTick = () => {
		this.count = this.count + 1000;
	};

	// Function which runs on completion of timer and reduces the score
	// and gets new movie from the state
	complete = () => {
		let url = `${baseUrl}/currentmovie`;
		fetch(url, {
			method: "POST",
			body: JSON.stringify({ count: this.state.currentMovie }), // data can be `string` or {object}!
			headers: { "Content-Type": "application/json" },
		})
			.then((results) => {
				return results.json();
			})
			.then((results) => {
				this.setState({
					currentMovie: results,
					time: 60000,
					score: this.state.score - 10,
					img: [false, false, false, false, false, false],
					poster: false,
					timeout: true,
					plotValue: false,
				});
				this.count = 0;
			})
			.catch((error) => {
				console.log(error);
			});
		setTimeout(() => {
			this.setState({
				timeout: false,
			});
		}, 1200);
	};

	plothandler = () => {
		this.setState({
			score: this.state.score - 10,
			plotValue: true,
		});
	};

	// function that handles the cast image clicked values to show them
	// them on clicks  and reduces 10 points from the user score
	imgPointHandler = (id) => {
		let copy = Array.from(this.state.img);
		let newcopy = copy.map((element, index) => {
			return index === id ? (element = true) : element;
		});
		this.setState({
			img: newcopy,
			score: this.state.score - 10,
		});
	};

	// function that shows the poster image on user clicks and reduces 100 points from the user score.
	posterPointHandler = () => {
		this.setState({
			score: this.state.score - 100,
			poster: true,
		});
	};

	// function that resets the game values to default values
	// also resets the background image to black to a 360 image
	resetgame = () => {
		Environment.setBackgroundImage(asset("./360Final.jpg"), { format: "3DTB" });
		this.setState({
			poster: false,
			time: 60000,
			score: 100,
			img: [false, false, false, false, false, false],
			plotValue: false,
		});
		this.count = 0;
	};

	render() {
		// a spin variable for the spinning of loading animation
		const spin = this.state.spinValue.interpolate({
			inputRange: [0, 1],
			outputRange: ["0deg", "360deg"],
		});

		// Variable that tracks the currentMovie in the state
		let moviestate = this.state.movie[this.state.currentMovie];

		// checking if user has won by getting a winning score
		// if yes then showing the winning component
		if (this.state.score > 500) {
			AudioModule.stopEnvironmental();
			return <Gamewinner resetgame={this.resetgame} />;
		}

		// checking if user has lost by getting a losing score
		// if yes then showing the Gameover component
		else if (this.state.score < 0) {
			AudioModule.stopEnvironmental();
			return (
				<View style={styles.mainpanel}>
					<View style={styles.panel}>
						<GameOver resetgame={this.resetgame} />
					</View>
				</View>
			);
		}

		// if user has not won or lost and the data has loaded from the backend then
		// show the actual game component
		else {
			if (moviestate) {
				AudioModule.playEnvironmental({
					source: asset("nature.mp3"),
					volume: 0.1, // play at 1/10 original volume
				});

				return (
					<View style={styles.mainpanel}>
						{/* LeftPanel which shows the posters on the left side of users viewplane  */}
						<View style={styles.panel}>
							<Leftpanel
								moviestate={moviestate}
								poster={this.state.poster}
								posterPointHandler={this.posterPointHandler}
							/>
						</View>

						{/* timerpanel which shows the timer and score  */}
						<View style={styles.timerpanel}>
							<View style={styles.board}>
								<Text style={{ color: "#fff", alignSelf: "center" }}>
									<TimerCountdown
										initialSecondsRemaining={this.state.time}
										onTick={() => this.onTick()}
										onTimeElapsed={() => this.complete()}
										allowFontScaling={true}
										style={{ fontSize: 30 }}
									/>
								</Text>
							</View>
						</View>

						{/* cpanel which is in the center ofthe view and shows the main content of the app 
          which are the clues and the ans */}
						<View style={styles.cpanel}>
							<Clues
								moviestate={moviestate}
								movie={this.state.movie}
								correctAnswer={this.state.correctAnswer}
								wrongAnswer={this.state.wrongAnswer}
								plotValue={this.state.plotValue}
								plothandler={this.plothandler}
								setGazed={this.setGazed}
								timeout={this.state.timeout}
							/>
						</View>

						<View style={styles.timerpanel}>
							<View style={styles.board}>
								<Text
									style={{ color: "#fff", alignSelf: "center", fontSize: 30 }}
								>
									{this.state.score}
								</Text>
							</View>
						</View>

						<View style={styles.panel}>
							<Rightpanel
								moviestate={moviestate}
								img={this.state.img}
								currentMovie={this.state.currentMovie}
								imgPointHandler={this.imgPointHandler}
							/>
						</View>
					</View>
				);
			}

			// loading animation till the data loads from the backend
			else {
				return (
					<View style={styles.loadingpanel}>
						<View style={styles.loading}>
							<Animated.Image
								style={{
									width: 227,
									height: 227,
									transform: [{ rotate: spin }],
								}}
								source={{
									uri: "https://openclipart.org/image/2400px/svg_to_png/32425/movie-reel.png",
								}}
							/>
						</View>
						<View style={styles.loadingtextbox}>
							<Text style={styles.loadingtext}>
								Guess the movie based on Clues
							</Text>
							<Text style={styles.loadingtext}>
								Look at a button for 3 SEC to click it
							</Text>
							<Text style={styles.loadingtext}>
								Right Answer gives 20 :: Wrong cuts 5
							</Text>
							<Text style={styles.loadingtext}>
								Player loses if score less than 0
							</Text>
						</View>
					</View>
				);
			}
		}
	}
}

const styles = StyleSheet.create({
	loadingpanel: {
		width: 3400,
		height: 660,
		flexDirection: "column",
		alignItems: "center",
	},
	loading: {
		flex: 1,
		alignContent: "center",
		justifyContent: "center",
		margin: 50,
	},
	loadingtextbox: {
		flex: 1,
		alignContent: "center",
		justifyContent: "flex-start",
		margin: 50,
		backgroundColor: "rgba(255, 255, 255, 0.8)",
		borderRadius: 8,
		borderColor: "rgba(0, 0, 0, 1)",
		borderRightWidth: 2,
		borderBottomWidth: 4,
	},
	loadingtext: {
		textAlign: "center",
		color: "#0f1214",
		fontSize: 40,
		marginRight: 20,
		marginLeft: 20,
		marginTop: 5,
	},
	mainpanel: {
		width: 3400,
		height: 660,
		flexDirection: "row",
		justifyContent: "center",
	},
	timerpanel: {
		flexDirection: "column",
		width: 100,
		height: 660,
		justifyContent: "center",
		marginLeft: 10,
		marginRight: 10,
	},
	board: {
		flexDirection: "column",
		width: 100,
		height: 100,
		backgroundColor: "#92325e",
		justifyContent: "center",
		borderRadius: 8,
		borderColor: "rgba(0, 0, 0, 1)",
		borderRightWidth: 2,
		borderBottomWidth: 4,
	},
	panel: {
		width: 1000, // Fill the entire surface
		height: 660,
		flexDirection: "column",
		alignItems: "center",
		marginLeft: 10,
		marginRight: 10,
	},
	cpanel: {
		width: 800, // Fill the entire surface
		height: 660,
		flexDirection: "column",
		alignItems: "center",
		marginLeft: 10,
		marginRight: 10,
	},
});
