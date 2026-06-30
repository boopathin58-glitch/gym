const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sets: Number, reps: Number, duration: Number,
  rest: Number, weight: Number, notes: String,
  muscleGroup: String, equipment: String,
});

const dayPlanSchema = new mongoose.Schema({
  day: { type: String, enum: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'] },
  focus: String,
  exercises: [exerciseSchema],
  isRestDay: { type: Boolean, default: false },
});

const workoutPlanSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  goal: { type: String, enum: ['weight_loss','muscle_gain','endurance','flexibility','general_fitness'] },
  difficulty: { type: String, enum: ['beginner','intermediate','advanced'], default: 'beginner' },
  durationWeeks: { type: Number, default: 4 },
  weeklyPlan: [dayPlanSchema],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);
