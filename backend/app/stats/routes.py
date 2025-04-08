from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func, extract
from datetime import datetime, timedelta
from app import db
from app.models import Workout, WorkoutExercise, Exercise
from app.stats import stats_bp

@stats_bp.route('/summary', methods=['GET'])
@jwt_required()
def get_summary_stats():
    user_id = get_jwt_identity()
    
    # Get total workouts
    total_workouts = Workout.query.filter_by(user_id=user_id).count()
    
    # Get total workout duration
    total_duration = db.session.query(func.sum(Workout.duration)).filter(Workout.user_id == user_id).scalar() or 0
    
    # Get workout counts by category (last 30 days)
    thirty_days_ago = datetime.utcnow().date() - timedelta(days=30)
    workouts_last_30_days = Workout.query.filter(
        Workout.user_id == user_id,
        Workout.date >= thirty_days_ago
    ).count()
    
    # Get most frequent exercise
    most_frequent_exercise = db.session.query(
        Exercise.name, func.count(WorkoutExercise.exercise_id).label('count')
    ).join(
        WorkoutExercise, WorkoutExercise.exercise_id == Exercise.id
    ).join(
        Workout, Workout.id == WorkoutExercise.workout_id
    ).filter(
        Workout.user_id == user_id
    ).group_by(
        Exercise.name
    ).order_by(
        func.count(WorkoutExercise.exercise_id).desc()
    ).first()
    
    most_frequent_exercise_name = most_frequent_exercise[0] if most_frequent_exercise else None
    
    # Get last workout date
    last_workout = Workout.query.filter_by(user_id=user_id).order_by(Workout.date.desc()).first()
    last_workout_date = last_workout.date.isoformat() if last_workout else None
    
    return jsonify({
        'total_workouts': total_workouts,
        'total_duration_minutes': total_duration,
        'workouts_last_30_days': workouts_last_30_days,
        'most_frequent_exercise': most_frequent_exercise_name,
        'last_workout_date': last_workout_date
    })

@stats_bp.route('/monthly', methods=['GET'])
@jwt_required()
def get_monthly_stats():
    user_id = get_jwt_identity()
    
    # Get monthly workout counts for the last 12 months
    current_month = datetime.utcnow().month
    current_year = datetime.utcnow().year
    
    monthly_stats = []
    
    for i in range(12):
        # Calculate month and year (going backwards from current month)
        month = (current_month - i) % 12
        month = 12 if month == 0 else month  # Handle December
        year = current_year if month <= current_month else current_year - 1
        
        # Count workouts for this month
        count = Workout.query.filter(
            Workout.user_id == user_id,
            extract('month', Workout.date) == month,
            extract('year', Workout.date) == year
        ).count()
        
        # Calculate total duration for this month
        duration = db.session.query(func.sum(Workout.duration)).filter(
            Workout.user_id == user_id,
            extract('month', Workout.date) == month,
            extract('year', Workout.date) == year
        ).scalar() or 0
        
        monthly_stats.append({
            'year': year,
            'month': month,
            'count': count,
            'duration': duration
        })
    
    return jsonify(monthly_stats)

@stats_bp.route('/exercises', methods=['GET'])
@jwt_required()
def get_exercise_stats():
    user_id = get_jwt_identity()
    
    # Get exercise frequency
    exercise_stats = db.session.query(
        Exercise.id,
        Exercise.name,
        Exercise.category,
        func.count(WorkoutExercise.exercise_id).label('count')
    ).join(
        WorkoutExercise, WorkoutExercise.exercise_id == Exercise.id
    ).join(
        Workout, Workout.id == WorkoutExercise.workout_id
    ).filter(
        Workout.user_id == user_id
    ).group_by(
        Exercise.id, Exercise.name, Exercise.category
    ).order_by(
        func.count(WorkoutExercise.exercise_id).desc()
    ).all()
    
    result = [{
        'id': stat[0],
        'name': stat[1],
        'category': stat[2],
        'count': stat[3]
    } for stat in exercise_stats]
    
    return jsonify(result)
