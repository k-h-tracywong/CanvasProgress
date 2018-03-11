/*
 Copyright (c) 2016, BrightPoint Consulting, Inc.

 MIT LICENSE:

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
 and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 IN THE SOFTWARE.
 */

// @version 1.1.54

//**************************************************************************************************************
//
//  This is a test/example file that shows you one way you could use a vizuly object.
//  We have tried to make these examples easy enough to follow, while still using some more advanced
//  techniques.  Vizuly does not rely on any libraries other than D3.  These examples do use jQuery and
//  materialize.css to simplify the examples and provide a decent UI framework.
//
//**************************************************************************************************************


// html element that holds the chart
var viz_container;

// our radial components and an array to hold them
var vizs=[];

// our radial themes and an array to hold them
var themes = [];

// our div elements we will put radials in
var divs = [];

// show reel for demo only;
var reels=[];

var screenW, screenH;
var courses;

function initialize(screenWidth, screenHeight) {
    //We use this function to size the components based on the selected value from the RadiaLProgressTest.html page.
    // changeSize(screenWidth + "," + screenHeight);
    screenW = screenWidth;
    screenH = screenHeight;
}

function populateVizes(responseText) {
    vizs = [];
    divs = [];
    themes = [];

        //Here we use the three div tags from our HTML page to load the three components into.
    // console.log(responseText);
    var json = JSON.parse(responseText);
    courses = json['courses'];
    console.log(this.courses);
    var html = '';
    courses.forEach(function(course, i) {
        var discipline = course['discipline'];
        var courseID = course['course_id_DI'];
        var radial = '<div class="col-lg-4 course" id="' + courseID + '"><div class="display-item mx auto"><h3>' + discipline + '</h3><p class="lead">CourseID #' + courseID + '</p><div class="display-progress"><div id="div' + i + '" class="radial_container"></div></div></div></div>'
        html += radial;
    });
    document.getElementById('courses-radial').innerHTML = html;
    var courseElems = document.getElementsByClassName('course');

    for (var i = 0; i < courseElems.length; i++) {
        var currentCourseElem = courseElems[i];
        console.log(this.courses);
        currentCourseElem.onclick = function() {
            console.log(this.id);
            displayModal(this.id);
        }
    }

    courses.forEach(function(course, i) {
        divs.push(d3.select('#div' + i));
        var viz = vizuly.viz.radial_progress(document.getElementById("div" + i));
        vizs.push(viz);
        themes.push(vizuly.theme.radial_progress(viz).skin(vizuly.skin.RADIAL_PROGRESS_BUSINESS))
    });

    //Like D3 and jQuery, vizuly uses a function chaining syntax to set component properties
    //Here we set some bases line properties for all three components.
    vizs.forEach(function (viz,i) {
        viz.data(80)                       // Current value
            .height(600)                    // Height of component - radius is calculated automatically for us
            .min(0)                         // min value
            .max(100)                       // max value
            .capRadius(1)                   // Sets the curvature of the ends of the arc.
            .on("tween",onTween)            // On the arc animation we create a callback to update the label
            .on("mouseover",onMouseOver)    // mouseover callback - all viz components issue these events
            .on("mouseout",onMouseOut)      // mouseout callback - all viz components issue these events
            .on("click",onClick);           // mouseout callback - all viz components issue these events
        viz
            .startAngle(250)
            .endAngle(110)
            .arcThickness(.12)
            .label(function (d,i) {                 
                return d3.format(".0f")(d) + "%";
            });
        viz.data(courses[i]['completed_%'] * 100).update();
    });
    changeSize(screenW, screenH);
}

//Here we want to animate the label value by capturin the tween event
//that occurs when the component animates the value arcs.
function onTween(viz,i) {
    viz.selection().selectAll(".vz-radial_progress-label")
        .text(viz.label()(viz.data() * i));
}

function onMouseOver(viz,d,i) {
    //We can capture mouse over events and respond to them
}

function onMouseOut(viz,d,i) {
    //We can capture mouse out events and respond to them
}

function onClick(viz,d,i) {
    // console.log(viz);
    // console.log(d);
    // console.log(i);
    // console.log(vizs.indexof(viz));
    // console.log(courses[vizs.indexof(viz)]);
    // displayModal(courses[i]['course_id_DI']);
}

//---------------------------------------------------------
//
//  The following functions are triggered by the user making changes in the settings panel which is declared in the
//  RadialProgressTest.html file.
//
//---------------------------------------------------------


//This function is called when the user selects a different skin.
function changeSkin(val) {
    themes.forEach(function (theme,i) {
        //If the user selects "none" for the skin we need to tell the theme to release the component and clear
        //any applied styles.
        if (val == "none") {
            theme.release();
            vizs[i].update();
        }
        //If the user selected a skin, make sure each viz has a theme and apply the skin
        else {
            theme.viz(vizs[i]);
            theme.skin(val);
            theme.viz().update();  //We could use theme.apply() here, but we want to trigger the tween.
        }
    })

}

//This is applies different end caps to each arc track by adjusting the 'capRadius' property
function changeEndCap(val) {
    vizs.forEach(function (viz,i) {
        vizs[i].capRadius(Number(val)).update();
    })
}

//This changes the size of the component by adjusting the radius and width/height;
function changeSize(val) {
    var s = String(val).split(",");
    viz_container.transition().duration(300).style('width', s[0] + 'px').style('height', s[1] + 'px');

    var divWidth = s[0] * 1.0 / 3;

    divs.forEach(function (div,i) {
        // div.style("width",divWidth + 'px').style("margin-left", (s[0] *.05) + "px");
        vizs[i].width(divWidth).height(divWidth).radius(divWidth/2.2).update();
    })

}

//This sets the same value for each radial progress
function changeData(val) {
    vizs.forEach(function (viz,i) {
        vizs[i].data(Number(val)).update();
    })
}










