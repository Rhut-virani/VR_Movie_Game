const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      request = require('request'),
      axios = require('axios');

      const PORT = process.env.PORT || 8080;

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


const p =[];
const moviedata= [];
const movieListArray = [79545,79546,79543,79547];
const currentmovie = 0;
const filtered = {};


app.get('/movie', (req, res)=>{
    res.send(filtered);
})

app.post('/currentmovie', (req,res)=>{
    let count = req.body.count;

    currentmovie = (count<140)?parseInt(count) + 1 : 0;
    console.log(currentmovie);
    res.status(200).send((currentmovie).toString());

})

apiCallFunction = (i , j) =>{
    let mp =[];
    var config = {  params: { language: 'en', api_key: '9fedd0c8b577f3ffc23a28a67e0a144d',page: j },
                            headers: { authorization: 'Bearer <<access_token>>', 'content-type': 'application/json;charset=utf-8' },
                            json: true };
        axios.get('https://api.themoviedb.org/4/list/' + movieListArray[i], config)
             .then(data=>{
                let movie = data.data.results;
                movie.forEach(element=>{
                    var config = {  params: { append_to_response: 'credits,releases,similar_movies,images', 
                                                include_image_language: 'en',
                                                language: 'en-US', 
                                                api_key: '9fedd0c8b577f3ffc23a28a67e0a144d' },
                                    headers: { authorization: 'Bearer <<access_token>>', 
                                                'content-type': 'application/json;charset=utf -8' }};
                    return mp.push(axios.get('https://api.themoviedb.org/3/movie/' + element.id , config));        
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
const scrapeGenre =  () => {
    for (let e of moviedata){
        for (let i in e.genres){
            if(!filtered[e.genres[i]["name"]]){
                filtered[e.genres[i]["name"]] = [e];
            }
            else{
                filtered[e.genres[i]["name"]].push(e);
            }
        }
    }
    console.log("filterd", filtered);

}

let count = 0
let timer = setInterval(()=>{
    console.log('running with count =', count);
    if(count < 4){
    apiCallFunction(count , 1);
    count++;
    }
    else if (count < 8) {
        apiCallFunction(count-4, 2)
        count++;
    }
    else{
        scrapeGenre();
        clearInterval(timer);
    }
},10000)

// making sure the server is listening
app.listen(PORT, ()=>{
        console.log('server running on' + PORT);
})
