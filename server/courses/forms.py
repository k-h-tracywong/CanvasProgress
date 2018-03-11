import pandas as pd
import json
import pickle

class CourseForms:
	def __init__(self):
		self.df_ = df = pd.read_csv('data/CNPC_1401-1509_DI_v1_1_2016-03-01.csv')
	
	def retrieveCoursesByUserID(self, userID):
		df = self.df_.drop('registered', 1)
		df = df.drop('viewed', 1)
		df = df.drop('explored', 1)
		df = df.drop('grade', 1)
		df = df.drop('grade_reqs', 1)
		df = df.drop('course_reqs', 1)
		df = df.drop('final_cc_cname_DI', 1)
		df = df.drop('primary_reason', 1)
		df = df.drop('learner_type', 1)
		df = df.drop('expected_hours_week', 1)
		df = df.drop('LoE_DI', 1)
		df = df.drop('age_DI', 1)
		df = df.drop('gender', 1)
		df = df.drop('start_time_DI', 1)
		df = df.drop('course_start', 1)
		df = df.drop('course_end', 1)
		df = df.drop('last_event_DI', 1)
		df = df.drop('nevents', 1)
		df = df.drop('ndays_act', 1)
		df = df.drop('ncontent', 1)
		df = df.drop('nforum_posts', 1)
		df = df.drop('course_length', 1)
		df = df.query('userid_DI == ' + userID)
		df['completed_%'] = df['completed_%'].fillna(0)
							
		result = []					
		df.apply(lambda x: result.append(json.loads(x.to_json())), axis=1)
		
		return result

	def retrieveCourseStatByCourseIDAndUserID(self, courseID, userID):
		df = self.df_.query('course_id_DI == ' + courseID)
		totalRegistered = df.shape[0]
		df['grade'] = df['grade'].fillna(0)
		averageGrade = df['grade'].mean()
		df1 = self.df_.query('course_id_DI == ' + courseID + ' & userid_DI == ' + userID)
		df1['grade'] = df1['grade'].fillna(0)
		df1['completed_%'] = df1['completed_%'].fillna(0)
		grade = df1['grade'].iloc[0]
		completed = df1['completed_%'].iloc[0]

		df2 = df[df['grade'] < grade]
		rank = totalRegistered - df2.shape[0]
		discipline = df1['discipline'].iloc[0]

		return {'course_id_DI': courseID, 'userid_DI': userID, 'totalRegistered': totalRegistered, 
		'averageGrade': averageGrade, 'grade': grade, 'completed_%': completed, 'rank': rank, 'discipline': discipline}

	def getRecommendation(self, userID):
		top_10 = pickle.load(open("pickle/top_10.bin", "rb"))
		result = []

		for courseRank in top_10[userID]:
			df = self.df_.query('course_id_DI == ' + str(courseRank[0]))
			json = {}
			json['course_id_DI'] = courseRank[0]
			json['discipline'] = df['discipline'].iloc[0]
			result.append(json)
			
		return result
