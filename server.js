const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    request = require('request'),
    axios = require('axios');
    dotenv = require('dotenv');
    PORT = process.env.PORT || 9000;

let moviedata= [],
    movieListArray = [79545,79546,79543,79547],
    currentmovie = 0,
    count = 0;

    dotenv.config()

// parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
    app.use(bodyParser.json())

// adding the lines for cors so that incoming connection are handled properly 
    app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
    });

app.use(express.static('./Front-End/build'));
app.use('/static_assets', express.static('./Front-End/static_assets'));


app.get('/movie', (req, res)=>{
    console.log("hello");
    res.send(moviedata);
})

app.post('/currentmovie', (req,res)=>{
    let count = req.body.count;

    currentmovie = (count<moviedata.length)?parseInt(count) + 1 : 0;
    res.status(200).send((currentmovie).toString());

})

apiCallFunction = (i , j) =>{
    let mp =[];
    const movieListConfig = {  params: { language: 'en', api_key: process.env.API_KEY, page: j },
                            headers: { authorization: 'Bearer <<access_token>>', 'content-type': 'application/json;charset=utf-8' },
                            json: true };
        axios.get('https://api.themoviedb.org/4/list/' + movieListArray[i], movieListConfig)
             .then(data=>{
                let movie = data.data.results;
                movie.forEach(element=>{
                    const movieConfig = {  params: { append_to_response: 'credits,releases,similar_movies,images', 
                                                include_image_language: 'en',
                                                language: 'en-US', 
                                                api_key: process.env.API_KEY },
                                    headers: { authorization: 'Bearer <<access_token>>', 
                                                'content-type': 'application/json;charset=utf -8' }};
                    return mp.push(axios.get('https://api.themoviedb.org/3/movie/' + element.id , movieConfig));        
                })
                return Promise.all(mp);
            })
            .then (results=>{
                let movieDetailsArray = results.map((element)=>{
                    return element.data;
                })
                moviedata.push(...movieDetailsArray);
            })
            .catch(error=>{
                console.log(error);
            })
}

let timer = setInterval(()=>{
    console.log(`running with count ${count}`);
    if(count < 4){
    apiCallFunction(count , 1);
    count++;
    }
    else if (count < 8) {
        apiCallFunction(count-4, 2)
        count++;
    }
    else{
        clearInterval(timer);
    }
},10000)

// making sure the server is listening
app.listen(PORT, ()=>{
        console.log(`server running on ${PORT}`);
})
