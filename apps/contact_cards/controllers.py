"""
This file defines actions, i.e. functions the URLs are mapped into
The @action(path) decorator exposed the function at URL:

    http://127.0.0.1:8000/{app_name}/{path}

If app_name == '_default' then simply

    http://127.0.0.1:8000/{path}

If path == 'index' it can be omitted:

    http://127.0.0.1:8000/

The path follows the bottlepy syntax.

@action.uses('generic.html')  indicates that the action uses the generic.html template
@action.uses(session)         indicates that the action uses the session
@action.uses(db)              indicates that the action uses the db
@action.uses(T)               indicates that the action uses the i18n & pluralization
@action.uses(auth.user)       indicates that the action requires a logged in user
@action.uses(auth)            indicates that the action requires the auth object

session, db, T, auth, and tempates are examples of Fixtures.
Warning: Fixtures MUST be declared with @action.uses({fixtures}) else your app will result in undefined behavior
"""

from py4web import action, request, abort, redirect, URL
from yatl.helpers import A
from .common import db, session, T, cache, auth, logger, authenticated, unauthenticated, flash
from .models import get_user_email


@action('index')
@action.uses('index.html', db, auth.user)
def index():
    return dict(
        get_contacts_url = URL('get_contacts'),
        add_contact_url=URL('add_contact'),
        update_contact_url=URL('update_contact'),
        delete_contact_url=URL('delete_contact'),
        upload_image_url=URL('upload_image'),
        # Complete. 
    )

@action('get_contacts')
@action.uses(db, auth.user)
def get_contacts():
    contacts = db(db.contact_card.user_email == get_user_email()).select().as_list() # Complete. 
    return dict(contacts=contacts)

# You can add more methods. 

@action('add_contact', method="POST")
@action.uses(db, auth.user)
def add_contact():
    new_contact_id = db.contact_card.insert(
        contact_name='',
        contact_affiliation='',
        contact_description='',
        contact_image='https://bulma.io/assets/images/placeholders/96x96.png'
    )
    new_contact = db.contact_card[new_contact_id]
    return dict(contact=new_contact.as_dict())

@action('update_contact', method="POST")
@action.uses(db, auth.user)
def update_contact():
    data = request.json
    contact_id = data.get('id')
    if not contact_id:
        abort(400, "Contact ID missing.") # if contact id is not provided error
    
    # Update fields based on the provided data
    db(db.contact_card.id == contact_id).update( # update contact based on that id
        contact_name=data.get('contact_name', ''), # get the json input
        contact_affiliation=data.get('contact_affiliation', ''),
        contact_description=data.get('contact_description', ''),
    )
    return dict(success=True)

@action('delete_contact', method="POST")
@action.uses(db, auth.user)
def delete_contact():
    data = request.json
    contact_id = data.get('id')
    if not contact_id:
        abort(400, "Contact ID missing.")
    
    db(db.contact_card.id == contact_id).delete()
    return dict(success=True)

@action('upload_image', method="POST")
@action.uses(db, auth.user)
def upload_image():
    contact_id = request.forms.get('id')
    file = request.files.get('image')
    if not contact_id or not file:
        abort(400, "Missing contact ID or image file.")

    # Update the contact card with the new image
    db(db.contact_card.id == contact_id).update(contact_image=db.contact_card.contact_image.store(file, file.filename))
    return dict(success=True, image_url=URL('download', db.contact_card[contact_id].contact_image))
