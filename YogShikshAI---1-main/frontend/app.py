# from flask import Flask, jsonify, request
# import tensorflow as tf
# import numpy as np

# app = Flask(__name__)

# # Load the TensorFlow model
# new_model = tf.keras.models.load_model(
#     '/Users/internalis/Desktop/YogShikshAI---1-main/YogShikshAI---1-main/classification model/my_model.h5')


# @app.route('/predict', methods=['POST'])
# def predict():
#     # Get the input data from the request
#     input_data = request.get_json()

#     input_data = np.array(input_data)

#     print(input_data.shape)

#     predictions = new_model.predict(input_data)

#     print(predictions.tolist())

#     return jsonify({'data': predictions.tolist()})


# if __name__ == '__main__':
#     app.run(host='0.0.0.0', debug=True)

from flask import Flask, jsonify, request
import tensorflow as tf
import numpy as np

app = Flask(__name__)

# Load the TensorFlow model - update path to be relative
model_path = '/Users/internalis/Desktop/YogShikshAI---1-main/YogShikshAI---1-main/classification model/my_model.h5'
new_model = tf.keras.models.load_model(model_path)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get the input data from the request
        content = request.get_json()
        keypoints = np.array(content['keypoints'])
        
        # Make prediction
        predictions = new_model.predict(keypoints)
        
        # Get the highest confidence score from predictions
        max_confidence = float(np.max(predictions))
        
        return jsonify({
            'status': 'success',
            'data': predictions.tolist(),
            'confidence': max_confidence
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
