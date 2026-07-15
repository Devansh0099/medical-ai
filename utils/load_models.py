import joblib

diabetes_model = joblib.load("models/random_forest_diabetes.pkl")
heart_model = joblib.load("models/heart_disease_model.pkl")
kidney_model = joblib.load("models/kidney_disease_model.pkl")
liver_model = joblib.load("models/liver_disease_model.pkl")