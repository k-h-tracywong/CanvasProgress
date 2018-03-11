var userID;

function displayCoursesAndRecommendation() {
	userID = document.getElementById("userID-input").value;
	var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            populateVizes(this.responseText);
       	}
    };
    xmlHttp.open("GET", "courses?userID=" + userID, true);
    xmlHttp.send();

    var xmlHttp1 = new XMLHttpRequest();
    xmlHttp1.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            populateRecommendation(this.responseText);
       	}
    };
    xmlHttp1.open("GET", "recommendation?userID=" + userID, true);
    xmlHttp1.send();
}

function displayModal(courseID) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			console.log(this.responseText);
			var modal = document.getElementById('myModal');
    		modal.style.display = "block";
    		updateModal(this.responseText);
		}
	}

	xmlHttp.open("GET", "coursestat?userID=" + userID + '&courseID=' + courseID, true);
    xmlHttp.send();
}

function updateModal(responseText) {
	var json = JSON.parse(responseText);
	var courseStatJson = json['coursestat'];
	console.log(courseStatJson);
	document.getElementById('description').innerHTML = courseStatJson['discipline'] + " - CourseID #" + courseStatJson['course_id_DI'];
	document.getElementById('total-registered').innerHTML = courseStatJson['totalRegistered'];
	document.getElementById('completed-percent').innerHTML = Math.round( Number(courseStatJson['completed_%']) * 100 * 10 ) / 10 + '%';
	document.getElementById('class-average').innerHTML = Math.round( Number(courseStatJson['averageGrade']) * 100 * 10 ) / 10 + '%';
	document.getElementById('grade').innerHTML = courseStatJson['grade'];
	document.getElementById('rank').innerHTML = courseStatJson['rank'];
}

function populateRecommendation(responseText) {
	var json = JSON.parse(responseText);
	var recommendationJson = json['recommendation'];
	console.log(recommendationJson);
	var html = '';
    recommendationJson.forEach(function(recommendation, i) {
        var discipline = recommendation['discipline'];
        var courseID = recommendation['course_id_DI'];
        var radial = '<div class="d-inline-block p-3 bg-primary text-white">CourseID #' + courseID + '</div>'
        html += radial;
    });
    document.getElementById('recommendation-list').innerHTML = html;
}

