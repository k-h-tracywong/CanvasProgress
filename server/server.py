from flask import Flask, request, render_template, jsonify
from courses.forms import CourseForms

app = Flask(__name__)
courseForms = CourseForms()

@app.route('/') 
def home():
    return render_template('home.html')

@app.route('/courses', methods=['GET'])
def courses():
    return jsonify({'courses': courseForms.retrieveCoursesByUserID(str(request.args.get('userID')))})

@app.route('/coursestat', methods=['GET'])
def coursestat():
	return jsonify({'coursestat': courseForms.retrieveCourseStatByCourseIDAndUserID(str(request.args.get('courseID')), str(request.args.get('userID')))})

@app.route('/recommendation', methods=['GET'])
def recommend():
	# print(request.args.get('userID'))
	return jsonify({'recommendation': courseForms.getRecommendation(int(request.args.get('userID')))})

if __name__ == '__main__':
    app.run(debug=True)