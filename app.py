from flask import Flask, render_template, redirect, request, session, make_response, redirect, url_for
import os
import requests
import datetime
import math
import spotipy

app = Flask(__name__)

app.secret_key = os.environ.get('APP_SECRET_KEY')
API_BASE = 'https://accounts.spotify.com'
REDIRECT_URI = str(os.environ.get('SPOTIPY_REDIRECT_URI')) + "api_callback"
CLI_ID = os.environ.get('SPOTIPY_CLIENT_ID')
CLI_SEC = os.environ.get('SPOTIPY_CLIENT_SECRET')
SCOPE = 'playlist-modify-public,playlist-modify-private,playlist-read-private,user-library-read'
SHOW_DIALOG = True

months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
seasons = ['spring', 'summer', 'autumn', 'winter']


def show_tracks(tracks, track_dict):
	for i, item in enumerate(tracks['items']):
		track = item['track']
		added = item['added_at'].split('T')[0]
		uri = track['uri']
		d = datetime.datetime.strptime(added, "%Y-%m-%d")
		if 'local' not in uri:
			if uri not in track_dict:
				track_dict[uri] = d
			else:
				if d < track_dict[uri]:
					track_dict[uri] = d


def add_liked_tracks(results, track_dict):
	for item in results['items']:
		track = item['track']
		added = item['added_at'].split('T')[0]
		uri = track['uri']
		d = datetime.datetime.strptime(added, "%Y-%m-%d")
		if 'local' not in uri:
			if uri not in track_dict:
				track_dict[uri] = d
			else:
				if d < track_dict[uri]:
					track_dict[uri] = d



@app.route('/')
def index():
	return render_template('index.html')


@app.route('/login/')
def login():
	auth_url = f'{API_BASE}/authorize?client_id={CLI_ID}&response_type=code&redirect_uri={REDIRECT_URI}&scope={SCOPE}&show_dialog={SHOW_DIALOG}'
	return redirect(auth_url)


@app.route('/apple/')
def apple():
	return render_template("apple.html")


@app.route('/api_callback')
def api_callback():
	code = request.args.get('code')

	auth_token_url = f"{API_BASE}/api/token"
	res = requests.post(auth_token_url, data={
		"grant_type": "authorization_code",
		"code": code,
		"redirect_uri": REDIRECT_URI,
		"client_id": CLI_ID,
		"client_secret": CLI_SEC
	})

	res_body = res.json()
	session["token"] = res_body.get("access_token")

	return redirect(url_for('menu'))


@app.route('/menu')
def menu():
	token = session['token']
	all_playlists = get_all_playlists(token)
	if len(all_playlists) == 0:
		return render_template('error.html', test=session['token'], token=token)
	return render_template('menu.html', all_playlists=all_playlists, token=token, months=months)


@app.route('/register/', methods=['GET', 'POST'])
def register():
	error = None
	if request.method == 'POST':
		menu_request = request.form.to_dict(flat=False)
		saved_tracks = False
		if menu_request and 'checked' in menu_request:
			ignore = menu_request['checked']
		else:
			ignore = []
		if menu_request and 'agg_type' in menu_request:
			agg_type = menu_request['agg_type'][0]
		else:
			agg_type = 'monthly'
		if menu_request and agg_type == 'single-month' and 'single-month' in menu_request:
			agg_type = menu_request['single-month'][0]
		elif menu_request and agg_type == 'single-month':
			month = datetime.datetime.today().month
			agg_type = months[month - 1]

		if menu_request and 'saved' in menu_request:
			saved_tracks = menu_request['saved'][0]
			if saved_tracks == 'yes':
				saved_tracks = True
			else:
				saved_tracks = False

		results = parse_playlists(agg_type, ignore, saved_tracks, token=session['token'])
		return render_template('complete.html', playlists=results)
	return render_template('complete.html', error=error)


def get_all_playlists(token):
	all_playlists = []
	if token:
		sp = spotipy.Spotify(auth=token)
		res = sp.current_user()
		username = res['id']
		playlists = sp.user_playlists(username)
		for playlist in playlists['items']:
			if playlist['owner']['id'] == username:
				all_playlists.append(playlist)

		while playlists['next']:
			playlists = sp.next(playlists)
			for playlist in playlists['items']:
				if playlist['owner']['id'] == username:
					all_playlists.append(playlist)

	return all_playlists


def parse_playlists(agg_type, ignore_option, saved_tracks, token):
	if token:
		sp = spotipy.Spotify(auth=token)
		res = sp.current_user()
		username = res['id']
		playlists = get_all_playlists(token)
		track_dict = {}
		new_playlists = []

		for playlist in playlists:
			if playlist['name'] not in ignore_option:
				results = sp.playlist(playlist['id'], fields="tracks,next")
				tracks = results['tracks']
				show_tracks(tracks, track_dict)
				while tracks['next']:
					tracks = sp.next(tracks)
					show_tracks(tracks, track_dict)

		if saved_tracks:
			results = sp.current_user_saved_tracks()
			add_liked_tracks(results, track_dict)
			while results['next']:
				results = sp.next(results)
				add_liked_tracks(results, track_dict)

		monthly = [[], [], [], [], [], [], [], [], [], [], [], []]
		seasonal = [[], [], [], []]
		single_month = [[]]

		for item in track_dict:
			track_date = track_dict[item]
			track_month = track_date.month
			track_day = track_date.day

			if agg_type == 'monthly':
				monthly[track_month - 1].append(item)

			elif agg_type == 'seasonal':
				# Spring runs from March 1 to May 31;
				# Summer runs from June 1 to August 31;
				# Fall (autumn) runs from September 1 to November 30; and
				# Winter runs from December 1 to February 28 (February 29 in a leap year).

				if 2 < track_month < 6:  # spring
					seasonal[0].append(item)
				elif 5 < track_month < 9:  # summer
					seasonal[1].append(item)
				elif 8 < track_month < 12:  # fall
					seasonal[2].append(item)
				else:  # winter
					seasonal[3].append(item)
			else:
				if months.index(agg_type) == track_month - 1:  # i.e. January
					single_month[0].append(item)

		if agg_type == 'monthly':
			num_playlists = 12
			lookup = months
			ref = monthly
		elif agg_type == 'seasonal':
			num_playlists = 4
			lookup = seasons
			ref = seasonal
		else:
			num_playlists = 1
			lookup = [agg_type]
			ref = single_month

		for x in range(num_playlists):
			new_playlist = sp.user_playlist_create(user=username, name=f'{lookup[x]} Tunes', public=True, description=f'This is an automatically generated playlist that includes all songs added to any one of my playlists in the month of {lookup[x]}')
			for i in range(0, math.ceil(len(ref[x]) / 100)):
				cur = ref[x]
				cur = cur[(i * 100):((i * 100) + 99)]

				sp.user_playlist_add_tracks(user=username, playlist_id=new_playlist['id'], tracks=cur)

			new_playlists.append(new_playlist)

		return new_playlists


if __name__ == '__main__':
	app.run()
