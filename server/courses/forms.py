import pandas as pd
import json
def retrieveCoursesByUserID(userID):
	df = pd.read_csv('data/CNPC_1401-1509_DI_v1_1_2016-03-01.csv')
	df = df.drop('registered', 1)
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
	df['completed_%'] = df['completed_%'].fillna(0)
	df = df.query('userid_DI == ' + userID)
						
	result = []					
	df.apply(lambda x: result.append(json.loads(x.to_json())), axis=1)
	
	return result
	# return [{'course': 'hi'}, {'course': 'bye'}]