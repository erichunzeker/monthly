from flask import Flask, render_template, redirect, request, session, make_response, session, redirect
import os
import requests
import datetime
import math
import spotipy

app = Flask(__name__)

app.secret_key = 'idk bruh'
API_BASE = 'https://accounts.spotify.com'
REDIRECT_URI = "http://localhost:5000/api_callback"
CLI_ID = os.environ.get('SPOTIPY_CLIENT_ID')
CLI_SEC = os.environ.get('SPOTIPY_CLIENT_SECRET')
SCOPE = 'playlist-modify-public,playlist-modify-private'
SHOW_DIALOG = True

track_dict = {}


def show_tracks(tracks):
	for i, item in enumerate(tracks['items']):
		track = item['track']
		added = item['added_at']
		added = added.split('T')[0]
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
	print(auth_url)
	return redirect(auth_url)


@app.route('/api_callback')
def api_callback():
	session.clear()
	code = request.args.get('code')

	auth_token_url = f"{API_BASE}/api/token"
	res = requests.post(auth_token_url, data={
		"grant_type": "authorization_code",
		"code": code,
		"redirect_uri": "http://localhost:5000/api_callback",
		"client_id": CLI_ID,
		"client_secret": CLI_SEC
	})

	res_body = res.json()
	print(res.json())
	session["token"] = res_body.get("access_token")

	return redirect("test")


@app.route('/test')
def hello_world():
	username = 'erichunzeker'
	# scope = 'playlist-modify-public'
	# token = util.prompt_for_user_token(username, scope)

	if session['token']:
		sp = spotipy.Spotify(auth=session['token'])
		res = sp.current_user()
		username = res['id']
		playlists = sp.user_playlists(username)
		for playlist in playlists['items']:
			if playlist['owner']['id'] == username and playlist['name'] != 'nunu' and playlist[
				'name'] != 'archives and onion' and playlist['name'] != 'pollen collective':
				print()
				print(playlist['name'])
				print('  total tracks', playlist['tracks']['total'])
				results = sp.playlist(playlist['id'], fields="tracks,next")
				tracks = results['tracks']
				show_tracks(tracks)
				while tracks['next']:
					tracks = sp.next(tracks)
					show_tracks(tracks)

		while playlists['next']:
			playlists = sp.next(playlists)
			for playlist in playlists['items']:
				if playlist['owner']['id'] == username:
					print()
					print(playlist['name'])
					print('  total tracks', playlist['tracks']['total'])
					results = sp.playlist(playlist['id'], fields="tracks,next")
					tracks = results['tracks']
					show_tracks(tracks)
					while tracks['next']:
						tracks = sp.next(tracks)
						show_tracks(tracks)

		monthly = [[], [], [], [], [], [], [], [], [], [], [], []]
		for item in track_dict:
			track_month = track_dict[item]
			track_month = track_month.month

			monthly[track_month - 1].append(item)

		print(str(monthly))

		# spuser_playlist_create(user, name, public=True, description='')

		t = sp.user_playlist_create(user=username, name='January Tunes', public=True,
									description='This is an automatically generated playlist that includes all songs added to any one of my playlists in the month of January')
		for i in range(0, math.ceil(len(monthly[0]) / 100)):
			cur = monthly[0]
			cur = cur[(i * 100):((i * 100) + 99)]

			sp.user_playlist_add_tracks(user=username, playlist_id=t['id'], tracks=cur)


if __name__ == '__main__':
	app.run()
