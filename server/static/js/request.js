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
	console.log(courseStatJson['discipline'] + " - CourseID #" + courseStatJson['course_id_DI']);
	document.getElementById('description').innerHTML = courseStatJson['discipline'];
	document.getElementById('total-registered').innerHTML = courseStatJson['totalRegistered'];
	document.getElementById('completed-percent').innerHTML = Math.round( Number(courseStatJson['completed_%']) * 100 * 10 ) / 10 + '%';
	document.getElementById('class-average').innerHTML = Math.round( Number(courseStatJson['averageGrade']) * 100 * 10 ) / 10 + '%';
	document.getElementById('grade').innerHTML = Math.round( Number(courseStatJson['grade']) * 100 * 10 ) / 10 + '%';
	document.getElementById('rank').innerHTML = courseStatJson['rank'];
}

function populateRecommendation(responseText) {
	var json = JSON.parse(responseText);
	var recommendationJson = json['recommendation'];
	console.log(recommendationJson);
	var html = '';
    recommendationJson.forEach(function(recommendation, i) {
        var discipline = recommendation['discipline'];
        var rating = Math.round( Number(recommendation['rating']) * 10 ) / 10 + '%';
        var courseID = recommendation['course_id_DI'];
        var colorClass = getColorFromDiscipline(discipline);
        var radial = '<div class="d-inline-block p-3 text-white ' + colorClass + '">CourseID #' + courseID + '<span style="display: block;">' + discipline + '</span><span style="display: block;">' + rating + '</span></div>'
        html += radial;
    });
    document.getElementById('recommendation-list').innerHTML = html;
}

function getColorFromDiscipline(discipline) {
	switch(discipline) {
    case 'Business and Management':
        return 'bg-business';
    case 'Computer Science':
        return 'bg-computer';
    case 'Education':
        return 'bg-education';
    case 'Humanities':
        return 'bg-humanities';
 	case 'Interdisciplinary and Other':
        return 'bg-interdisciplinary';
    case 'Mathematics & Statistics':
        return 'bg-math';
    case 'Medical Pre-Medical':
        return 'bg-medical';
    case 'Physical Sciences':
        return 'bg-physical';
    case 'Professions and Applied Sciences':
        return 'bg-applied';
    case 'Social Sciences':
        return 'bg-social';
    default:
        return '';
	}
}
