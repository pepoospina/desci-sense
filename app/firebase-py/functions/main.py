# The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
from firebase_functions import https_fn

# The Firebase Admin SDK to access Cloud Firestore.
from firebase_admin import initialize_app

from models.tagger import SM_FUNCTION_post_tagger

app = initialize_app()

@https_fn.on_request()
def post_tagger(request):
    return SM_FUNCTION_post_tagger(request)