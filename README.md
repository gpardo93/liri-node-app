
# LIRI Node App

### Introduction

LIRI is a **Language Interpretation and Recognition Interface**.

LIRI is a command line node app that takes in parameters and gives you back data.
* This app made in node.js must be ran in the command line in terminal.


LIRI will do any of the below command when you enter them into the command line:

     * node liri.js my-tweets "TwitterUserName" ex."Giovanni_Pardo"- returns the latest 20 tweets

     * node liri.js spotify-this-song  "song name" - returns song data for 5 songs.

     * node liri.js movie-this  "movie name" - returns movie data.

     * node liri.js do-what-it-says - reads command from text file.

Type in **node liri.js** to get the instructions on how to enter the commands correctly. 


#### These are the npm packages I used and are needed to run the app

1. fs package in node
1. Twitter
1. Spotify
1. request

#### API used
1. OMDB API


#### To install these npm packages run these commands one at a time.

    - npm install twitter
    - npm install spotify
    - npm install request
