from flask import request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from app import db
from app.models import Workout, WorkoutExercise, Exercise
from app.api import api_bp

@api_bp.route('/workouts', methods=['GET'])
@jwt_required()
def get_workouts():
    user_id = get_jwt_identity()
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 10, type=int), 100)
    
    query = Workout.query.filter_by(user_id=user_id).order_by(Workout.date.desc())
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    
    workouts = pagination.items
    
    return jsonify({
        'workouts': [workout.to_dict() for workout in workouts],
        'total': pagination.total,
        'pages': pagination.pages,
        'page': page,
        'per_page': per_page
    })

@api_bp.route('/workouts/<int:id>', methods=['GET'])
@jwt_required()
def get_workout(id):
    user_id = get_jwt_identity()
    workout = Workout.query.filter_by(id=id, user_id=user_id).first_or_404()
    
    return jsonify(workout.to_dict(include_exercises=True))

@api_bp.route('/workouts', methods=['POST'])
@jwt_required()
def create_workout():
    user_id = get_jwt_identity()
    data = request.get_json() or {}
    
    if 'name' not in data:
        return jsonify({'error': 'Name is required'}), 400
    
    workout = Workout(
        user_id=user_id,
        name=data['name'],
        date=datetime.strptime(data.get('date', datetime.utcnow().strftime('%Y-%m-%d')), '%Y-%m-%d').date(),
        duration=data.get('duration'),
        notes=data.get('notes')
    )
    
    db.session.add(workout)
    db.session.commit()
    
    return jsonify(workout.to_dict()), 201

@api_bp.route('/workouts/<int:id>', methods=['PUT'])
@jwt_required()
def update_workout(id):
    user_id = get_jwt_identity()
    workout = Workout.query.filter_by(id=id, user_id=user_id).first_or_404()
    data = request.get_json() or {}
    
    if 'name' in data:
        workout.name = data['name']
    if 'date' in data:
        workout.date = datetime.strptime(data['date'], '%Y-%m-%d').date()
    if 'duration' in data:
        workout.duration = data['duration']
    if 'notes' in data:
        workout.notes = data['notes']
    
    db.session.commit()
    
    return jsonify(workout.to_dict())

@api_bp.route('/workouts/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_workout(id):
    user_id = get_jwt_identity()
    workout = Workout.query.filter_by(id=id, user_id=user_id).first_or_404()
    
    db.session.delete(workout)
    db.session.commit()
    
    return '', 204

@api_bp.route('/workouts/<int:workout_id>/exercises', methods=['POST'])
@jwt_required()
def add_exercise_to_workout(workout_id):
    user_id = get_jwt_identity()
    workout = Workout.query.filter_by(id=workout_id, user_id=user_id).first_or_404()
    data = request.get_json() or {}
    
    if 'exercise_id' not in data:
        return jsonify({'error': 'Exercise ID is required'}), 400
    
    exercise = Exercise.query.get_or_404(data['exercise_id'])
    
    workout_exercise = WorkoutExercise(
        workout_id=workout.id,
        exercise_id=exercise.id,
        sets=data.get('sets'),
        reps=data.get('reps'),
        weight=data.get('weight'),
        duration=data.get('duration'),
        distance=data.get('distance'),
        notes=data.get('notes')
    )
    
    db.session.add(workout_exercise)
    db.session.commit()
    
    return jsonify(workout_exercise.to_dict()), 201

@api_bp.route('/workouts/<int:workout_id>/exercises/<int:exercise_id>', methods=['PUT'])
@jwt_required()
def update_workout_exercise(workout_id, exercise_id):
    user_id = get_jwt_identity()
    workout = Workout.query.filter_by(id=workout_id, user_id=user_id).first_or_404()
    workout_exercise = WorkoutExercise.query.filter_by(workout_id=workout_id, id=exercise_id).first_or_404()
    
    data = request.get_json() or {}
    
    if 'sets' in data:
        workout_exercise.sets = data['sets']
    if 'reps' in data:
        workout_exercise.reps = data['reps']
    if 'weight' in data:
        workout_exercise.weight = data['weight']
    if 'duration' in data:
        workout_exercise.duration = data['duration']
    if 'distance' in data:
        workout_exercise.distance = data['distance']
    if 'notes' in data:
        workout_exercise.notes = data['notes']
    
    db.session.commit()
    
    return jsonify(workout_exercise.to_dict())

@api_bp.route('/workouts/<int:workout_id>/exercises/<int:exercise_id>', methods=['DELETE'])
@jwt_required()
def remove_exercise_from_workout(workout_id, exercise_id):
    user_id = get_jwt_identity()
    workout = Workout.query.filter_by(id=workout_id, user_id=user_id).first_or_404()
    workout_exercise = WorkoutExercise.query.filter_by(workout_id=workout_id, id=exercise_id).first_or_404()
    
    db.session.delete(workout_exercise)
    db.session.commit()
    
    return '', 204
