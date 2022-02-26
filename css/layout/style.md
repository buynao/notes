* {
    margin: 0;
    padding: 0;
}
#layout1 {
    position: relative;
    width: 100%;
    height: 300px;
    margin: 0 auto;
    border: 1px solid #000;
    margin-bottom: 100px;
}

#layout1 .left {
    width: 200px;
    height: 100%;
    float: left;
    background: red;
}

#layout1 .right {
    height: 100%;
    overflow: hidden;
    background: pink;
}


#layout2 {
    position: relative;
    width: 100%;
    height: 300px;
    margin: 0 auto;
    border: 1px solid #000;
    margin-bottom: 100px;
}

#layout2 .left {
    width: 200px;
    height: 100%;
    float: left;
    background: red;
}

#layout2 .right {
    width: 200px;
    height: 100%;
    float: right;
    background: red;
}

#layout2 .mid {
    height: 100%;
    overflow: hidden;
    background: pink;
    margin: 0 200px;
}


#layout3 {
    position: relative;
    width: 100%;
    height: 300px;
    margin: 0 auto;
    border: 1px solid #000;
    margin-bottom: 100px;
}

#layout3 .left {
    position: absolute;
    width: 200px;
    height: 100%;
    left: 0;
    top: 0;
    background: red;
}

#layout3 .right {
    position: absolute;
    width: 200px;
    height: 100%;
    right: 0;
    top: 0;
    background: red;
}

#layout3 .mid {
    height: 100%;
    overflow: hidden;
    background: pink;
    margin: 0 200px;
}




#layout4 {
    position: relative;
    width: 100%;
    height: 300px;
    margin: 0 auto;
    border: 1px solid #000;
    margin-bottom: 100px;
}

#layout4 .left {
    float: left;
    width: 200px;
    height: 100%;
    background: red;
    margin-left: -100%;
}

#layout4 .right {
    float: left;
    width: 200px;
    height: 100%;
    background: red;
    margin-left: -200px;
}

#layout4 .mid {
    float: left;
    width: 100%;
    height: 100%;
    background: pink;
}
#layout4 .main {
    background: pink;
    margin: 0 200px;
}