from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# In-memory storage (replace with a database in production)
notes = []
expenses = []

@app.route('/notes', methods=['GET', 'POST'])
def handle_notes():
    global notes
    if request.method == 'GET':
        return jsonify(notes)
    elif request.method == 'POST':
        data = request.json
        notes.append(data)
        return jsonify({"status": "success"}), 201

@app.route('/expenses', methods=['GET', 'POST'])
def handle_expenses():
    global expenses
    if request.method == 'GET':
        return jsonify(expenses)
    elif request.method == 'POST':
        data = request.json
        expenses.append(data)
        return jsonify({"status": "success"}), 201

@app.route('/summary', methods=['GET'])
def get_summary():
    total_notes = len(notes)
    total_expenses = sum(expense['amount'] for expense in expenses)
    return jsonify({
        "total_notes": total_notes,
        "total_expenses": total_expenses
    })

if __name__ == '__main__':
    app.run(debug=True)