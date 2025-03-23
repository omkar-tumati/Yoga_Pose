from flask import Flask, jsonify, request
import tensorflow as tf
import numpy as np

app = Flask(__name__)

# Load the TensorFlow model
new_model = tf.keras.models.load_model(
    '/Users/internalis/Desktop/YogShikshAI---1-main/YogShikshAI---1-main/classification model/my_model.h5')


@app.route('/predict', methods=['POST'])
def predict():
    # Get the input data from the request
    input_data = request.get_json()

    input_data = np.array(input_data)

    print(input_data.shape)

    predictions = new_model.predict(input_data)

    print(predictions.tolist())

    return jsonify({'data': predictions.tolist()})


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
