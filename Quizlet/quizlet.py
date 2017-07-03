#!/usr/local/bin/python3

import json
import random
import requests
import string
from urllib.parse import urlencode

# Replace with your own credentials when using
client_id_G = 'jFHBnBeJ4f'
encoded_string_G = 'akZIQm5CZUo0ZjpTZTJWNTJxcXJjS21GWnVxRGNEQ3Q1'
secret_key_G = 'Se2V52qqrcKmFZuqDcDCt5'
redirect_uri_G = 'https://quizlingo.herokuapp.com'


class Quizlet:
    # URLs
    base_url = 'https://api.quizlet.com/2.0'
    auth_url = 'https://quizlet.com/authorize'
    token_url = 'https://api.quizlet.com/oauth/token'

    # TODO: pass as parameter in future
    def __init__(self, client_id, encoded_string, secret_key, redirect_uri):
        self.client_id = client_id
        self.encoded_string = encoded_string
        self.secret_key = secret_key
        self.redirect_uri = redirect_uri
        self.access_info = None

    def generate_auth_url(self, scopes):
        state = ''.join(random.choice(string.ascii_uppercase + string.digits) for i in range(10))
        params = {
            'client_id': self.client_id,
            'response_type': 'code',
            'scope': ' '.join(scopes),
            'state': state
        }
        authorization_request_string = Quizlet.auth_url + '?' + urlencode(params)
        return authorization_request_string

    def request_token(self, code):
        data = {
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': self.redirect_uri
        }

        headers = {
            'Content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + self.encoded_string
        }

        r = requests.post(Quizlet.token_url, data=data, headers=headers)
        self.access_info = r.json()

    def make_request(self, api_path, params=None, type='get'):
        params = params if params else {}
        request_url_base = '/'.join([Quizlet.base_url, api_path])
        headers = {
            'Authorization': ' '.join(['Bearer', self.access_info['access_token']])
        }

        if type == 'get':
            r = requests.get(request_url_base, headers=headers, params=params)
        elif type == 'post':
            r = requests.post(request_url_base, headers=headers, data=params)
        else:
            r = None

        return r.json()


################
# Sample Usage
################

# Step 0. Instantiate Quizlet class
q = Quizlet(client_id_G, encoded_string_G, secret_key_G, redirect_uri_G)

# Step1. Open this URL to get code
print(q.generate_auth_url(['read', 'write_set']))

# Step 2. Replace with code from previous step
code = 'J5hcpBHgMR6JMWAVb4zCXgGu8Bd6YvWqg7SGues8'
q.request_token(code)
print(json.dumps(q.access_info, indent=2))

# Step 3. modify api_path to suit your API call
api_path = 'users/haodizc95'
print(json.dumps(q.make_request(api_path), indent=2))
