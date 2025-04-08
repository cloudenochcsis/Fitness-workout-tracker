import json
import pytest
from app import db
from app.models import User

def test_register(client):
    response = client.post('/auth/register', json={
        'username': 'newuser',
        'email': 'newuser@example.com',
        'password': 'password'
    })
    
    assert response.status_code == 201
    assert 'access_token' in response.json
    assert response.json['user']['username'] == 'newuser'
    
    # Check if user was added to database
    user = User.query.filter_by(username='newuser').first()
    assert user is not None
    assert user.email == 'newuser@example.com'

def test_register_duplicate_username(client, init_database):
    response = client.post('/auth/register', json={
        'username': 'testuser',  # Already exists
        'email': 'unique@example.com',
        'password': 'password'
    })
    
    assert response.status_code == 400
    assert 'Username already exists' in response.json['error']

def test_login(client, init_database):
    response = client.post('/auth/login', json={
        'username': 'testuser',
        'password': 'password'
    })
    
    assert response.status_code == 200
    assert 'access_token' in response.json
    assert response.json['user']['username'] == 'testuser'

def test_login_invalid_credentials(client, init_database):
    response = client.post('/auth/login', json={
        'username': 'testuser',
        'password': 'wrongpassword'
    })
    
    assert response.status_code == 401
    assert 'Invalid username or password' in response.json['error']

def test_get_profile(client, auth_headers, init_database):
    response = client.get('/auth/profile', headers=auth_headers)
    
    assert response.status_code == 200
    assert response.json['username'] == 'testuser'
    assert response.json['email'] == 'test@example.com'

def test_update_profile(client, auth_headers, init_database):
    response = client.put('/auth/profile', json={
        'username': 'updateduser',
        'email': 'updated@example.com'
    }, headers=auth_headers)
    
    assert response.status_code == 200
    assert response.json['user']['username'] == 'updateduser'
    assert response.json['user']['email'] == 'updated@example.com'
    
    # Check if user was updated in database
    user = User.query.filter_by(username='updateduser').first()
    assert user is not None
    assert user.email == 'updated@example.com'
