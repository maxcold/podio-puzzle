##Usage

#### right way (require node.js, preferable with version < 0.10, tested on version 0.8)
    git clone git://github.com/maxcold/podio-puzzle.git
    cd podio-puzzle
    make

bem server will run on 8080

than in browser: http://localhost:8080/desktop.bundles/index/index.html

first load may be long (about 20 seconds), bem server should setup dependencies and build files

#### simple way (require python installed)
    git clone git://github.com/maxcold/podio-puzzle.git
    cd podio-puzzle
    make python-server

python SimpleHTTPServe will start on 8000

than in browser: http://localhost:8000/production/desktop.bundles/index/index.html

this version is build like for production (minified js, css, and html)