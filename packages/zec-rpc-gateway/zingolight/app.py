from flask import Flask, current_app
from flask.cli import with_appcontext
from flask_cors import CORS
from flask_marshmallow import Marshmallow
from apifairy import APIFairy
from dotenv import load_dotenv
import click
import json
import sys
import logging

import os

apifairy = APIFairy()
ma = Marshmallow()
cors = CORS()



def create_app(config_name = None):
    app = Flask(__name__)
    app.config.from_object(config_name or os.environ['APP_SETTINGS'])
    apifairy.init_app(app)
    ma.init_app(app)

    if app.config['USE_CORS']:
        cors.init_app(app)

    from .api import bp as api_bp
    app.register_blueprint(api_bp, url_prefix='/api')
    
    return app
