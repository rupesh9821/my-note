from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
CORS(app)

DB_NAME = "data.db"

# Initialize DB
def init_db():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS notes (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT,
                    content TEXT,
                    date TEXT
                )''')
    c.execute('''CREATE TABLE IF NOT EXISTS expenses (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT,
                    amount REAL,
                    category TEXT,
                    date TEXT
                )''')
    conn.commit()
    conn.close()

init_db()

# Routes for Notes
@app.route("/notes", methods=["GET"])
def get_notes():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("SELECT * FROM notes ORDER BY id DESC")
    notes = [dict(id=row[0], title=row[1], content=row[2], date=row[3]) for row in c.fetchall()]
    conn.close()
    return jsonify(notes)

@app.route("/notes", methods=["POST"])
def add_note():
    data = request.json
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("INSERT INTO notes (title, content, date) VALUES (?, ?, ?)",
              (data["title"], data["content"], data["date"]))
    conn.commit()
    conn.close()
    return jsonify({"message": "Note added successfully"}), 201

@app.route("/notes/<int:id>", methods=["DELETE"])
def delete_note(id):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("DELETE FROM notes WHERE id = ?", (id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Note deleted successfully"})

# Routes for Expenses
@app.route("/expenses", methods=["GET"])
def get_expenses():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("SELECT * FROM expenses ORDER BY id DESC")
    expenses = [dict(id=row[0], name=row[1], amount=row[2], category=row[3], date=row[4]) for row in c.fetchall()]
    conn.close()
    return jsonify(expenses)

@app.route("/expenses", methods=["POST"])
def add_expense():
    data = request.json
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("INSERT INTO expenses (name, amount, category, date) VALUES (?, ?, ?, ?)",
              (data["name"], data["amount"], data["category"], data["date"]))
    conn.commit()
    conn.close()
    return jsonify({"message": "Expense added successfully"}), 201

@app.route("/expenses/<int:id>", methods=["DELETE"])
def delete_expense(id):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("DELETE FROM expenses WHERE id = ?", (id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Expense deleted successfully"})

if __name__ == "__main__":
    app.run(debug=True)
