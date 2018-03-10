from flask import Flask, request, render_template, jsonify
from courses.forms import retrieveCoursesByUserID

app = Flask(__name__)

@app.route('/') 
def home():
    return render_template('home.html')

@app.route('/courses', methods=['GET'])
def courses():
    return jsonify({'courses': retrieveCoursesByUserID(str(request.args.get('userID')))})

if __name__ == '__main__':
    app.run(debug=True)