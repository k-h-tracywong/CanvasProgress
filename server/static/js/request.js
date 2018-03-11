var userID;

function displayCourses() {
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

