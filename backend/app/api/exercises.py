from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Exercise
from app.api import api_bp

@api_bp.route('/exercises', methods=['GET'])
@jwt_required()
def get_exercises():
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 20, type=int), 100)
    category = request.args.get('category')
    
    query = Exercise.query
    if category:
        query = query.filter_by(category=category)
    
    query = query.order_by(Exercise.name.asc())
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    
    exercises = pagination.items
    
    return jsonify({
        'exercises': [exercise.to_dict() for exercise in exercises],
        'total': pagination.total,
        'pages': pagination.pages,
        'page': page,
        'per_page': per_page
    })

@api_bp.route('/exercises/<int:id>', methods=['GET'])
def get_exercise(id):
    exercise = Exercise.query.get_or_404(id)
    return jsonify(exercise.to_dict())

@api_bp.route('/exercises', methods=['POST'])
@jwt_required()
def create_exercise():
    data = request.get_json() or {}
    
    if 'name' not in data:
        return jsonify({'error': 'Name is required'}), 400
    
    exercise = Exercise(
        name=data['name'],
        description=data.get('description'),
        category=data.get('category')
    )
    
    db.session.add(exercise)
    db.session.commit()
    
    return jsonify(exercise.to_dict()), 201

@api_bp.route('/exercises/<int:id>', methods=['PUT'])
@jwt_required()
def update_exercise(id):
    exercise = Exercise.query.get_or_404(id)
    data = request.get_json() or {}
    
    if 'name' in data:
        exercise.name = data['name']
    if 'description' in data:
        exercise.description = data['description']
    if 'category' in data:
        exercise.category = data['category']
    
    db.session.commit()
    
    return jsonify(exercise.to_dict())

@api_bp.route('/exercises/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_exercise(id):
    exercise = Exercise.query.get_or_404(id)
    
    # Check if exercise is used in any workouts
    if exercise.workout_exercises:
        return jsonify({'error': 'Cannot delete exercise as it is used in workouts'}), 400
    
    db.session.delete(exercise)
    db.session.commit()
    
    return '', 204
